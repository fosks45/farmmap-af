/**
 * POST /api/orders
 * Create a marketplace order (consumer, authenticated).
 * Silver/Gold listings only. Validates products, allergens, delivery zone.
 * Creates Stripe PaymentIntent via Connect with application_fee_amount.
 *
 * F10 — Order creation
 * ADR-0004 (auth), ADR-0005 (Stripe Connect, commission)
 * Data classification: C3/C4 (buyer details encrypted before insert)
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { requireAuth, getDirectoryId } from '@/lib/auth';
import { encrypt, encryptJson, decryptNullable } from '@/lib/encryption';
import { calculateCommission, createOrderPaymentIntent } from '@/lib/stripe';

export const runtime = 'nodejs';

const OrderItemSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().min(1).max(999),
});

const DeliveryAddressSchema = z.object({
  line1: z.string().min(1).max(200),
  line2: z.string().max(200).optional(),
  town: z.string().min(1).max(100),
  county: z.string().max(100).optional(),
  postcode: z.string().min(1).max(20),
  country: z.string().max(50).default('England'),
});

const CreateOrderSchema = z.object({
  listing_id: z.string().uuid(),
  items: z.array(OrderItemSchema).min(1).max(50),
  delivery_address: DeliveryAddressSchema,
  notes: z.string().max(500).optional(),
  idempotency_key: z.string().uuid().optional(),
});

export async function POST(request: Request): Promise<NextResponse> {
  const directoryId = getDirectoryId(request);

  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;
  const { user } = authResult;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: 'invalid_body', message: 'Request body must be valid JSON' } },
      { status: 400 },
    );
  }

  const parsed = CreateOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: 'validation_error',
          message: 'Invalid request body',
          details: parsed.error.flatten(),
        },
      },
      { status: 422 },
    );
  }

  const { listing_id, items, delivery_address, notes } = parsed.data;
  const idempotencyKey = parsed.data.idempotency_key ?? randomUUID();

  const supabase = await createClient();

  // Verify listing is Silver/Gold and active
  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select('id, name, slug, tier, status')
    .eq('id', listing_id)
    .eq('directory_id', directoryId)
    .eq('status', 'active')
    .single();

  if (listingError || !listing) {
    return NextResponse.json(
      { error: { code: 'not_found', message: 'Listing not found' } },
      { status: 404 },
    );
  }

  const tier = listing.tier ?? 'free';
  if (!['silver', 'gold'].includes(tier)) {
    return NextResponse.json(
      {
        error: {
          code: 'ordering_not_available',
          message: 'This listing does not accept online orders',
        },
      },
      { status: 422 },
    );
  }

  // Fetch subscription for connect account
  const { data: subscription } = await supabase
    .from('listing_subscriptions')
    .select('stripe_connect_account_id')
    .eq('listing_id', listing_id)
    .single();

  if (!subscription?.stripe_connect_account_id) {
    return NextResponse.json(
      {
        error: {
          code: 'payment_not_configured',
          message: 'This listing has not completed payment setup',
        },
      },
      { status: 422 },
    );
  }

  const connectAccountId = decryptNullable(subscription.stripe_connect_account_id);
  if (!connectAccountId) {
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to resolve payment account' } },
      { status: 500 },
    );
  }

  // Fetch and validate all products
  const productIds = items.map((i) => i.product_id);
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select(
      'id, name, price_pence, is_purchasable, allergen_declaration_complete, status, stock_count, stock_reserved, max_per_order',
    )
    .in('id', productIds)
    .eq('listing_id', listing_id)
    .eq('status', 'active');

  if (productsError) {
    console.error('[orders/post] products query error:', productsError.message);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to fetch products' } },
      { status: 500 },
    );
  }

  const productMap = new Map((products ?? []).map((p) => [p.id, p]));

  for (const item of items) {
    const product = productMap.get(item.product_id);

    if (!product) {
      return NextResponse.json(
        {
          error: {
            code: 'product_not_found',
            message: `Product ${item.product_id} not found or not active`,
          },
        },
        { status: 422 },
      );
    }

    if (!product.is_purchasable) {
      return NextResponse.json(
        {
          error: {
            code: 'product_not_purchasable',
            message: `Product "${product.name}" is not available for purchase`,
          },
        },
        { status: 422 },
      );
    }

    if (!product.allergen_declaration_complete) {
      return NextResponse.json(
        {
          error: {
            code: 'allergen_declaration_incomplete',
            message: `Product "${product.name}" does not have a complete allergen declaration`,
          },
        },
        { status: 422 },
      );
    }

    if (product.max_per_order && item.quantity > product.max_per_order) {
      return NextResponse.json(
        {
          error: {
            code: 'quantity_exceeded',
            message: `Maximum ${product.max_per_order} units per order for "${product.name}"`,
          },
        },
        { status: 422 },
      );
    }

    const available =
      product.stock_count !== null
        ? product.stock_count - (product.stock_reserved ?? 0)
        : Infinity;
    if (item.quantity > available) {
      return NextResponse.json(
        {
          error: {
            code: 'insufficient_stock',
            message: `Insufficient stock for "${product.name}"`,
          },
        },
        { status: 422 },
      );
    }
  }

  // Validate delivery address is in a valid delivery zone
  const { data: deliveryZones } = await supabase
    .from('delivery_zones')
    .select('id, postcodes, fee_pence, min_order_pence')
    .eq('listing_id', listing_id)
    .eq('is_active', true);

  const postcodePrefix = delivery_address.postcode.replace(/\s/g, '').toUpperCase().slice(0, 4);
  const fullPostcode = delivery_address.postcode.replace(/\s/g, '').toUpperCase();

  const matchedZone = (deliveryZones ?? []).find((zone) =>
    zone.postcodes.some(
      (p: string) =>
        fullPostcode.startsWith(p.replace(/\s/g, '').toUpperCase()) ||
        postcodePrefix.startsWith(p.replace(/\s/g, '').toUpperCase()),
    ),
  );

  if (!matchedZone && (deliveryZones ?? []).length > 0) {
    return NextResponse.json(
      {
        error: {
          code: 'outside_delivery_zone',
          message: 'Your delivery address is outside this listing\'s delivery zones',
        },
      },
      { status: 422 },
    );
  }

  const deliveryFeePence = matchedZone?.fee_pence ?? 0;

  // Calculate subtotal
  let subtotalPence = 0;
  const orderItems = items.map((item) => {
    const product = productMap.get(item.product_id)!;
    const lineTotalPence = (product.price_pence ?? 0) * item.quantity;
    subtotalPence += lineTotalPence;
    return {
      product_id: item.product_id,
      product_name: product.name,
      quantity: item.quantity,
      unit_price_pence: product.price_pence ?? 0,
    };
  });

  // Validate minimum order
  if (matchedZone && subtotalPence < matchedZone.min_order_pence) {
    return NextResponse.json(
      {
        error: {
          code: 'below_minimum_order',
          message: `Minimum order is £${(matchedZone.min_order_pence / 100).toFixed(2)} for your delivery zone`,
        },
      },
      { status: 422 },
    );
  }

  // Calculate commission
  const commissionPence = calculateCommission(
    subtotalPence,
    tier as 'silver' | 'gold',
  );

  const totalPence = subtotalPence + deliveryFeePence;

  // Fetch buyer profile for name/email
  const { data: userProfile } = await supabase
    .from('users')
    .select('display_name')
    .eq('id', user.id)
    .single();

  const buyerName = userProfile?.display_name
    ? (decryptNullable(userProfile.display_name) ?? 'Customer')
    : 'Customer';
  const buyerEmail = user.email ?? '';

  // Create Stripe PaymentIntent via Connect
  let paymentIntent: { id: string; clientSecret: string };
  try {
    paymentIntent = await createOrderPaymentIntent({
      amountPence: totalPence,
      applicationFeePence: commissionPence,
      currency: 'gbp',
      connectAccountId,
      idempotencyKey,
      metadata: {
        listing_id: listing_id,
        directory_id: directoryId,
        buyer_user_id: user.id,
      },
    });
  } catch (err) {
    console.error('[orders/post] stripe error:', err);
    return NextResponse.json(
      { error: { code: 'payment_error', message: 'Failed to create payment' } },
      { status: 500 },
    );
  }

  // Insert order
  const autoCancelAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const { data: order, error: orderInsertError } = await supabase
    .from('orders')
    .insert({
      listing_id,
      directory_id: directoryId,
      buyer_user_id: user.id,
      idempotency_key: idempotencyKey,
      stripe_payment_intent_id: encrypt(paymentIntent.id),
      stripe_connect_account_id: encrypt(connectAccountId),
      subtotal_pence: subtotalPence,
      commission_pence: commissionPence,
      delivery_fee_pence: deliveryFeePence,
      total_pence: totalPence,
      currency: 'GBP',
      status: 'pending',
      buyer_name: encrypt(buyerName),
      buyer_email: encrypt(buyerEmail),
      delivery_address: encryptJson(delivery_address),
      delivery_zone_id: matchedZone?.id ?? null,
      notes: notes ?? null,
      auto_cancel_at: autoCancelAt,
    })
    .select('id')
    .single();

  if (orderInsertError || !order) {
    if (orderInsertError?.code === '23505') {
      return NextResponse.json(
        {
          error: {
            code: 'duplicate_order',
            message: 'An order with this idempotency key already exists',
          },
        },
        { status: 409 },
      );
    }
    console.error('[orders/post] order insert error:', orderInsertError?.message);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to create order' } },
      { status: 500 },
    );
  }

  // Insert order items
  const { error: itemsInsertError } = await supabase.from('order_items').insert(
    orderItems.map((item) => ({
      order_id: order.id,
      ...item,
    })),
  );

  if (itemsInsertError) {
    console.error('[orders/post] order items insert error:', itemsInsertError.message);
    // Order created but items failed — log for manual resolution
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to create order items' } },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      orderId: order.id,
      clientSecret: paymentIntent.clientSecret,
    },
    { status: 201 },
  );
}
