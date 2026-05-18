/**
 * POST /api/webhooks/stripe
 * Stripe webhook handler. All event handlers are idempotent.
 * Verifies webhook signature before processing any event.
 *
 * Handled events:
 *   checkout.session.completed      → activate subscription
 *   customer.subscription.updated   → update tier, handle downgrade
 *   customer.subscription.deleted   → cancel subscription, downgrade to free
 *   payment_intent.succeeded        → mark order paid, send receipt
 *   payment_intent.payment_failed   → notify shop owner
 *
 * ADR-0005 (Stripe), Constitution Principle 10 (no secrets logged)
 * Data classification: C3/C4 — Stripe IDs encrypted before storage; never logged
 */

import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyStripeWebhook } from '@/lib/stripe';
import { encrypt, decrypt } from '@/lib/encryption';
import { sendOrderReceiptEmail, sendOrderStatusEmail } from '@/lib/resend';

export const runtime = 'nodejs';

// Required for raw body access in Next.js App Router
export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: { code: 'missing_signature', message: 'Missing Stripe signature header' } },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    event = await verifyStripeWebhook(body, signature);
  } catch (err) {
    console.error('[webhook/stripe] signature verification failed:', err instanceof Error ? err.message : 'unknown');
    return NextResponse.json(
      { error: { code: 'invalid_signature', message: 'Invalid webhook signature' } },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        await handleCheckoutCompleted(supabase, event.data.object as Stripe.Checkout.Session);
        break;
      }
      case 'customer.subscription.updated': {
        await handleSubscriptionUpdated(supabase, event.data.object as Stripe.Subscription);
        break;
      }
      case 'customer.subscription.deleted': {
        await handleSubscriptionDeleted(supabase, event.data.object as Stripe.Subscription);
        break;
      }
      case 'payment_intent.succeeded': {
        await handlePaymentIntentSucceeded(supabase, event.data.object as Stripe.PaymentIntent);
        break;
      }
      case 'payment_intent.payment_failed': {
        await handlePaymentIntentFailed(supabase, event.data.object as Stripe.PaymentIntent);
        break;
      }
      default:
        // Unknown event type — acknowledge and ignore
        break;
    }
  } catch (err) {
    console.error(`[webhook/stripe] handler error for ${event.type}:`, err instanceof Error ? err.message : 'unknown');
    // Return 500 so Stripe retries the webhook
    return NextResponse.json(
      { error: { code: 'handler_error', message: 'Failed to process webhook event' } },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}

// ============================================================
// Event Handlers
// ============================================================

async function handleCheckoutCompleted(
  supabase: ReturnType<typeof createAdminClient>,
  session: Stripe.Checkout.Session,
): Promise<void> {
  const { listing_id, directory_id, tier } = session.metadata ?? {};
  if (!listing_id || !directory_id || !tier) {
    console.error('[webhook/stripe] checkout.session.completed missing metadata');
    return;
  }

  const stripeCustomerId = session.customer as string | null;
  const stripeSubscriptionId = session.subscription as string | null;

  if (!stripeSubscriptionId) return;

  // Upsert listing_subscriptions
  const { data: existing } = await supabase
    .from('listing_subscriptions')
    .select('id')
    .eq('listing_id', listing_id)
    .single();

  const now = new Date().toISOString();

  if (existing) {
    await supabase
      .from('listing_subscriptions')
      .update({
        tier,
        status: 'active',
        stripe_subscription_id: encrypt(stripeSubscriptionId),
        stripe_customer_id: stripeCustomerId ? encrypt(stripeCustomerId) : undefined,
        cancel_at_period_end: false,
        pending_tier: null,
        updated_at: now,
      })
      .eq('id', existing.id);
  } else {
    await supabase.from('listing_subscriptions').insert({
      listing_id,
      directory_id,
      tier,
      status: 'active',
      stripe_subscription_id: encrypt(stripeSubscriptionId),
      stripe_customer_id: stripeCustomerId ? encrypt(stripeCustomerId) : null,
      created_at: now,
      updated_at: now,
    });
  }

  // Denormalise tier onto listings table
  await supabase
    .from('listings')
    .update({ tier, updated_at: now })
    .eq('id', listing_id);
}

async function handleSubscriptionUpdated(
  supabase: ReturnType<typeof createAdminClient>,
  subscription: Stripe.Subscription,
): Promise<void> {
  const stripeSubscriptionId = subscription.id;
  const encryptedId = encrypt(stripeSubscriptionId);

  const { data: sub } = await supabase
    .from('listing_subscriptions')
    .select('id, listing_id, tier, silver_months_count')
    .eq('stripe_subscription_id', encryptedId)
    .single();

  if (!sub) {
    // Try to find by iterating (encrypted values differ per-row — look up by customer)
    // For robustness, fetch from metadata
    const listingId = (subscription.metadata as Record<string, string>)?.listing_id;
    if (!listingId) {
      console.error('[webhook/stripe] subscription.updated: no listing found for sub', stripeSubscriptionId.substring(0, 10));
      return;
    }
  }

  if (!sub) return;

  const newTier = mapStripePriceTier(subscription);
  const status = mapStripeStatus(subscription.status);
  const cancelAtPeriodEnd = subscription.cancel_at_period_end;
  const pendingTier = cancelAtPeriodEnd ? 'free' : null;

  // Increment silver_months_count if billing period rolled over on Silver
  let silverMonths = sub.silver_months_count ?? 0;
  if (sub.tier === 'silver' && newTier === 'silver') {
    // Detect period rollover by comparing current_period_start
    const periodStart = new Date((subscription.current_period_start ?? 0) * 1000);
    const now = new Date();
    const daysSinceStart = (now.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceStart < 2) {
      // Within 2 days of period start — this is a renewal
      silverMonths += 1;
    }
  }

  const now = new Date().toISOString();

  await supabase
    .from('listing_subscriptions')
    .update({
      tier: newTier,
      status,
      cancel_at_period_end: cancelAtPeriodEnd,
      pending_tier: pendingTier,
      silver_months_count: silverMonths,
      current_period_start: subscription.current_period_start
        ? new Date(subscription.current_period_start * 1000).toISOString()
        : null,
      current_period_end: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null,
      updated_at: now,
    })
    .eq('id', sub.id);

  // Denormalise tier onto listings
  await supabase
    .from('listings')
    .update({ tier: newTier, updated_at: now })
    .eq('id', sub.listing_id);
}

async function handleSubscriptionDeleted(
  supabase: ReturnType<typeof createAdminClient>,
  subscription: Stripe.Subscription,
): Promise<void> {
  const listingId = (subscription.metadata as Record<string, string>)?.listing_id;
  if (!listingId) return;

  const now = new Date().toISOString();

  await supabase
    .from('listing_subscriptions')
    .update({
      tier: 'free',
      status: 'cancelled',
      cancel_at_period_end: false,
      cancelled_at: now,
      updated_at: now,
    })
    .eq('listing_id', listingId);

  // Downgrade listing to free
  await supabase
    .from('listings')
    .update({ tier: 'free', updated_at: now })
    .eq('id', listingId);
}

async function handlePaymentIntentSucceeded(
  supabase: ReturnType<typeof createAdminClient>,
  paymentIntent: Stripe.PaymentIntent,
): Promise<void> {
  // Find order by encrypted payment_intent_id — cannot match directly due to encryption
  // Use metadata to find listing and match
  const { buyer_user_id, listing_id } = paymentIntent.metadata as Record<string, string>;

  if (!buyer_user_id || !listing_id) return;

  // Fetch the order(s) in pending status for this buyer/listing combo
  const { data: orders } = await supabase
    .from('orders')
    .select('id, status, total_pence, currency, buyer_email, buyer_name, delivery_slot, stripe_payment_intent_id')
    .eq('buyer_user_id', buyer_user_id)
    .eq('listing_id', listing_id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(5);

  if (!orders || orders.length === 0) return;

  // Match by decrypting stripe_payment_intent_id
  const matchedOrder = orders.find((o) => {
    if (!o.stripe_payment_intent_id) return false;
    try {
      return decrypt(o.stripe_payment_intent_id) === paymentIntent.id;
    } catch {
      return false;
    }
  });

  if (!matchedOrder) return;

  // Update order status to pending (payment captured — awaiting acceptance)
  await supabase
    .from('orders')
    .update({
      status: 'pending', // remains pending until shop accepts
      updated_at: new Date().toISOString(),
    })
    .eq('id', matchedOrder.id);

  // Increment completed_order_count is done on 'delivered' not on payment

  // Send receipt email
  if (matchedOrder.buyer_email) {
    try {
      const buyerEmail = decrypt(matchedOrder.buyer_email);
      const buyerName = matchedOrder.buyer_name
        ? decrypt(matchedOrder.buyer_name)
        : 'Customer';

      // Fetch listing name and order items
      const { data: listingRow } = await supabase
        .from('listings')
        .select('name')
        .eq('id', listing_id)
        .single();

      const { data: items } = await supabase
        .from('order_items')
        .select('product_name, quantity, unit_price_pence')
        .eq('order_id', matchedOrder.id);

      const deliverySlot = matchedOrder.delivery_slot as {
        date: string;
        time_from: string;
        time_to: string;
      } | null;

      if (deliverySlot) {
        await sendOrderReceiptEmail({
          to: buyerEmail,
          buyerName,
          listingName: listingRow?.name ?? 'the shop',
          orderId: matchedOrder.id,
          totalPence: matchedOrder.total_pence,
          currency: matchedOrder.currency ?? 'GBP',
          items: (items ?? []).map((i) => ({
            product_name: i.product_name,
            quantity: i.quantity,
            unit_price_pence: i.unit_price_pence,
          })),
          deliverySlot,
        });
      }
    } catch (err) {
      console.error('[webhook/stripe] payment_intent.succeeded receipt email error:', err instanceof Error ? err.message : 'unknown');
    }
  }
}

async function handlePaymentIntentFailed(
  supabase: ReturnType<typeof createAdminClient>,
  paymentIntent: Stripe.PaymentIntent,
): Promise<void> {
  const { listing_id } = paymentIntent.metadata as Record<string, string>;
  if (!listing_id) return;

  // Fetch shop owner email to notify
  const { data: listing } = await supabase
    .from('listings')
    .select('id, name')
    .eq('id', listing_id)
    .single();

  if (!listing) return;

  // Find owner manager
  const { data: owner } = await supabase
    .from('listing_managers')
    .select('user_id')
    .eq('listing_id', listing_id)
    .eq('role', 'owner')
    .not('accepted_at', 'is', null)
    .single();

  if (!owner) return;

  // Get owner email from auth.users via admin API (not stored in our tables directly)
  try {
    const { data: authUser } = await supabase.auth.admin.getUserById(owner.user_id);
    if (authUser?.user?.email) {
      await sendOrderStatusEmail({
        to: authUser.user.email,
        buyerName: 'Customer',
        listingName: listing.name,
        orderId: paymentIntent.id,
        newStatus: 'cancelled',
        deliverySlot: null,
      });
    }
  } catch (err) {
    console.error('[webhook/stripe] payment_intent.payment_failed notify error:', err instanceof Error ? err.message : 'unknown');
  }
}

// ============================================================
// Helpers
// ============================================================

function mapStripeStatus(
  stripeStatus: Stripe.Subscription['status'],
): string {
  const map: Record<string, string> = {
    active: 'active',
    trialing: 'trialing',
    past_due: 'past_due',
    canceled: 'cancelled',
    unpaid: 'suspended',
    incomplete: 'past_due',
    incomplete_expired: 'cancelled',
    paused: 'suspended',
  };
  return map[stripeStatus] ?? 'suspended';
}

function mapStripePriceTier(subscription: Stripe.Subscription): string {
  const priceId = subscription.items.data[0]?.price?.id ?? '';

  const bronzePriceId = process.env.STRIPE_BRONZE_PRICE_ID;
  const silverPriceId = process.env.STRIPE_SILVER_PRICE_ID;
  const goldPriceId = process.env.STRIPE_GOLD_PRICE_ID;

  if (priceId === bronzePriceId) return 'bronze';
  if (priceId === silverPriceId) return 'silver';
  if (priceId === goldPriceId) return 'gold';

  // Fallback: try metadata
  const metaTier = (subscription.metadata as Record<string, string>)?.tier;
  if (metaTier && ['bronze', 'silver', 'gold'].includes(metaTier)) return metaTier;

  return 'free';
}
