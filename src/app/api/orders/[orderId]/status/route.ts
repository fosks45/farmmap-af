/**
 * PATCH /api/orders/[orderId]/status
 * Update order status (owner/manager auth).
 * On 'delivered': increments completed_order_count, checks Gold eligibility.
 * On 'cancelled' by shop: refunds PaymentIntent if captured, reverses commission.
 *
 * F11 — Order status management
 * ADR-0004 (auth), ADR-0005 (Stripe)
 * Data classification: C0 (status), C4 (payment_intent_id)
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getDirectoryId, requireListingManager } from '@/lib/auth';
import { decryptNullable } from '@/lib/encryption';
import { getStripe } from '@/lib/stripe';
import { sendOrderStatusEmail } from '@/lib/resend';
import { GOLD_ELIGIBILITY } from '@/lib/tokens';

export const runtime = 'nodejs';

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['accepted', 'cancelled'],
  accepted: ['preparing', 'cancelled'],
  preparing: ['dispatched', 'cancelled'],
  dispatched: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
  refunded: [],
};

const UpdateStatusSchema = z.object({
  status: z.enum(['accepted', 'preparing', 'dispatched', 'delivered', 'cancelled']),
  cancellation_reason: z.string().max(500).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
): Promise<NextResponse> {
  const { orderId } = await params;
  const directoryId = getDirectoryId(request);
  const supabase = await createClient();

  // Fetch order to get listing_id
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(
      `
      id, listing_id, status, stripe_payment_intent_id, stripe_connect_account_id,
      total_pence, commission_pence, buyer_email, buyer_name, delivery_slot
      `,
    )
    .eq('id', orderId)
    .eq('directory_id', directoryId)
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: { code: 'not_found', message: 'Order not found' } },
      { status: 404 },
    );
  }

  // Auth: owner or manager of the listing
  const authResult = await requireListingManager(request, order.listing_id);
  if (authResult instanceof NextResponse) return authResult;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: 'invalid_body', message: 'Request body must be valid JSON' } },
      { status: 400 },
    );
  }

  const parsed = UpdateStatusSchema.safeParse(body);
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

  const { status: newStatus, cancellation_reason } = parsed.data;

  // Validate status transition
  const allowedTransitions = VALID_TRANSITIONS[order.status] ?? [];
  if (!allowedTransitions.includes(newStatus)) {
    return NextResponse.json(
      {
        error: {
          code: 'invalid_transition',
          message: `Cannot transition from '${order.status}' to '${newStatus}'`,
        },
      },
      { status: 422 },
    );
  }

  const updatePayload: Record<string, unknown> = {
    status: newStatus,
    updated_at: new Date().toISOString(),
  };

  if (newStatus === 'cancelled' && cancellation_reason) {
    updatePayload.cancellation_reason = cancellation_reason;
  }

  // Handle cancellation with refund
  if (newStatus === 'cancelled' && order.stripe_payment_intent_id) {
    const paymentIntentId = decryptNullable(order.stripe_payment_intent_id);

    if (paymentIntentId) {
      try {
        const stripe = getStripe();
        const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (intent.status === 'succeeded' || intent.status === 'requires_capture') {
          await stripe.refunds.create({
            payment_intent: paymentIntentId,
          });
          updatePayload.refunded_at = new Date().toISOString();
        }
      } catch (err) {
        console.error('[orders/status] stripe refund error:', err);
        // Log but do not block status update — manual reconciliation
      }
    }
  }

  // Update order status
  const { error: updateError } = await supabase
    .from('orders')
    .update(updatePayload)
    .eq('id', orderId);

  if (updateError) {
    console.error('[orders/status] update error:', updateError.message);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to update order status' } },
      { status: 500 },
    );
  }

  // On delivered: increment completed_order_count, check Gold eligibility
  if (newStatus === 'delivered') {
    const { data: sub } = await supabase
      .from('listing_subscriptions')
      .select('id, completed_order_count, silver_months_count, gold_unlock_at')
      .eq('listing_id', order.listing_id)
      .single();

    if (sub) {
      const newCount = (sub.completed_order_count ?? 0) + 1;
      const goldEligible =
        newCount >= GOLD_ELIGIBILITY.requiredCompletedOrders &&
        sub.silver_months_count >= GOLD_ELIGIBILITY.requiredSilverMonths;

      await supabase
        .from('listing_subscriptions')
        .update({
          completed_order_count: newCount,
          gold_unlock_at:
            goldEligible && !sub.gold_unlock_at
              ? new Date().toISOString()
              : sub.gold_unlock_at,
          updated_at: new Date().toISOString(),
        })
        .eq('id', sub.id);
    }
  }

  // Send buyer notification email (fire and forget)
  if (order.buyer_email) {
    const buyerEmail = decryptNullable(order.buyer_email);
    const buyerName = order.buyer_name ? decryptNullable(order.buyer_name) ?? 'Customer' : 'Customer';

    if (buyerEmail) {
      // Fetch listing name
      const { data: listingRow } = await supabase
        .from('listings')
        .select('name')
        .eq('id', order.listing_id)
        .single();

      void sendOrderStatusEmail({
        to: buyerEmail,
        buyerName,
        listingName: listingRow?.name ?? 'the shop',
        orderId,
        newStatus,
        deliverySlot: order.delivery_slot as { date: string; time_from: string; time_to: string } | null,
      }).catch((err) =>
        console.error('[orders/status] email notification error:', err),
      );
    }
  }

  return NextResponse.json({ orderId, status: newStatus });
}
