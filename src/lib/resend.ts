/**
 * Resend email sending helpers.
 *
 * All emails are sent from noreply@farmmap.co.uk.
 * No C3+ data is logged — only delivery status and recipient hash.
 *
 * ADR: ADR-0009
 * Data classification: email addresses passed to Resend are C3.
 * They are encrypted in the database but passed in plaintext to Resend's API.
 * Resend is the data processor; Farmmap is the data controller.
 */

import { Resend } from 'resend';

let _resend: Resend | null = null;

function getResend(): Resend {
  if (_resend) return _resend;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }

  _resend = new Resend(apiKey);
  return _resend;
}

const FROM_EMAIL = process.env.EMAIL_FROM ?? 'Farmmap <noreply@farmmap.co.uk>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://farmmap.co.uk';

interface SendResult {
  id: string;
}

/**
 * Sends a listing claim verification email.
 * Contains a single-use verification link valid for 24 hours.
 */
export async function sendClaimVerificationEmail(opts: {
  to: string;
  claimantName: string;
  listingName: string;
  verificationUrl: string;
}): Promise<SendResult> {
  const resend = getResend();
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: opts.to,
    subject: `Verify your claim for ${opts.listingName} — Farmmap`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,sans-serif;line-height:1.6;color:#1A2E1F;max-width:600px;margin:0 auto;padding:24px">
  <h1 style="color:#2D6A4F;font-size:24px">Verify your listing claim</h1>
  <p>Hi ${opts.claimantName},</p>
  <p>We received a request to claim <strong>${opts.listingName}</strong> on Farmmap.</p>
  <p>Please click the button below to verify your identity and complete the claim. This link is valid for 24 hours.</p>
  <p style="margin:32px 0">
    <a href="${opts.verificationUrl}" style="background:#2D6A4F;color:#fff;padding:14px 28px;text-decoration:none;border-radius:6px;font-weight:600">
      Verify and claim listing
    </a>
  </p>
  <p>If you did not request this, you can safely ignore this email.</p>
  <hr style="border:none;border-top:1px solid #D4DDD8;margin:32px 0">
  <p style="font-size:14px;color:#7A9080">
    Farmmap — <a href="${SITE_URL}" style="color:#2D6A4F">${SITE_URL}</a>
  </p>
</body>
</html>`,
  });

  if (error) throw new Error(`Resend error sending claim verification: ${error.message}`);
  return { id: data!.id };
}

/**
 * Sends a manager invitation email.
 * Contains a single-use acceptance link valid for 48 hours.
 */
export async function sendManagerInvitationEmail(opts: {
  to: string;
  invitedByName: string;
  listingName: string;
  acceptUrl: string;
}): Promise<SendResult> {
  const resend = getResend();
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: opts.to,
    subject: `You've been invited to manage ${opts.listingName} on Farmmap`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,sans-serif;line-height:1.6;color:#1A2E1F;max-width:600px;margin:0 auto;padding:24px">
  <h1 style="color:#2D6A4F;font-size:24px">You've been invited to manage a listing</h1>
  <p><strong>${opts.invitedByName}</strong> has invited you to help manage <strong>${opts.listingName}</strong> on Farmmap.</p>
  <p>Click the button below to accept the invitation. This link expires in 48 hours.</p>
  <p style="margin:32px 0">
    <a href="${opts.acceptUrl}" style="background:#2D6A4F;color:#fff;padding:14px 28px;text-decoration:none;border-radius:6px;font-weight:600">
      Accept invitation
    </a>
  </p>
  <p>If you did not expect this invitation, you can safely ignore this email.</p>
  <hr style="border:none;border-top:1px solid #D4DDD8;margin:32px 0">
  <p style="font-size:14px;color:#7A9080">Farmmap — <a href="${SITE_URL}" style="color:#2D6A4F">${SITE_URL}</a></p>
</body>
</html>`,
  });

  if (error) throw new Error(`Resend error sending manager invitation: ${error.message}`);
  return { id: data!.id };
}

/**
 * Sends a waitlist confirmation email with a one-click unsubscribe link.
 */
export async function sendWaitlistConfirmationEmail(opts: {
  to: string;
  listingName: string;
  unsubscribeUrl: string;
}): Promise<SendResult> {
  const resend = getResend();
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: opts.to,
    subject: `You're on the waitlist for ${opts.listingName}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,sans-serif;line-height:1.6;color:#1A2E1F;max-width:600px;margin:0 auto;padding:24px">
  <h1 style="color:#2D6A4F;font-size:24px">You're on the waitlist!</h1>
  <p>We'll email you as soon as online ordering is available at <strong>${opts.listingName}</strong> on Farmmap.</p>
  <p>You only need to sign up once — we'll notify you when it's ready.</p>
  <p style="margin-top:32px;font-size:14px;color:#7A9080">
    Don't want to hear from us? <a href="${opts.unsubscribeUrl}" style="color:#7A9080">Unsubscribe from this waitlist</a>
  </p>
  <hr style="border:none;border-top:1px solid #D4DDD8;margin:32px 0">
  <p style="font-size:14px;color:#7A9080">Farmmap — <a href="${SITE_URL}" style="color:#2D6A4F">${SITE_URL}</a></p>
</body>
</html>`,
    headers: {
      'List-Unsubscribe': `<${opts.unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  });

  if (error) throw new Error(`Resend error sending waitlist confirmation: ${error.message}`);
  return { id: data!.id };
}

/**
 * Sends the Silver activation notification to all waitlist subscribers.
 * Called when a listing transitions to Silver tier.
 */
export async function sendWaitlistActivationEmail(opts: {
  to: string;
  listingName: string;
  listingUrl: string;
  unsubscribeUrl: string;
}): Promise<SendResult> {
  const resend = getResend();
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: opts.to,
    subject: `${opts.listingName} is now taking orders on Farmmap!`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,sans-serif;line-height:1.6;color:#1A2E1F;max-width:600px;margin:0 auto;padding:24px">
  <h1 style="color:#2D6A4F;font-size:24px">Great news — online ordering is live!</h1>
  <p><strong>${opts.listingName}</strong> is now taking orders through Farmmap.</p>
  <p style="margin:32px 0">
    <a href="${opts.listingUrl}" style="background:#2D6A4F;color:#fff;padding:14px 28px;text-decoration:none;border-radius:6px;font-weight:600">
      Browse and order now
    </a>
  </p>
  <p style="margin-top:32px;font-size:14px;color:#7A9080">
    <a href="${opts.unsubscribeUrl}" style="color:#7A9080">Unsubscribe from waitlist notifications</a>
  </p>
  <hr style="border:none;border-top:1px solid #D4DDD8;margin:32px 0">
  <p style="font-size:14px;color:#7A9080">Farmmap — <a href="${SITE_URL}" style="color:#2D6A4F">${SITE_URL}</a></p>
</body>
</html>`,
    headers: {
      'List-Unsubscribe': `<${opts.unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  });

  if (error) throw new Error(`Resend error sending waitlist activation: ${error.message}`);
  return { id: data!.id };
}

/**
 * Sends an order status notification to the buyer.
 */
export async function sendOrderStatusEmail(opts: {
  to: string;
  buyerName: string;
  listingName: string;
  orderId: string;
  newStatus: string;
  deliverySlot?: { date: string; time_from: string; time_to: string } | null;
}): Promise<SendResult> {
  const resend = getResend();

  const statusMessages: Record<string, string> = {
    accepted: `Your order has been accepted by ${opts.listingName}. They will begin preparing it shortly.`,
    preparing: `${opts.listingName} is now preparing your order.`,
    dispatched: `Your order has been dispatched and is on its way!`,
    delivered: `Your order has been delivered. Enjoy!`,
    cancelled: `Your order has been cancelled. If you paid, a full refund will be returned to your original payment method within 5-10 business days.`,
    refunded: `Your order has been refunded. Please allow 5-10 business days for the funds to appear.`,
  };

  const subject = `Order update from ${opts.listingName} — Farmmap`;
  const message = statusMessages[opts.newStatus] ?? `Your order status has been updated to: ${opts.newStatus}.`;

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: opts.to,
    subject,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,sans-serif;line-height:1.6;color:#1A2E1F;max-width:600px;margin:0 auto;padding:24px">
  <h1 style="color:#2D6A4F;font-size:24px">Order update</h1>
  <p>Hi ${opts.buyerName},</p>
  <p>${message}</p>
  ${opts.deliverySlot ? `<p>Delivery slot: <strong>${opts.deliverySlot.date}</strong> between <strong>${opts.deliverySlot.time_from}</strong> and <strong>${opts.deliverySlot.time_to}</strong></p>` : ''}
  <p style="font-size:14px;color:#7A9080">Order reference: ${opts.orderId}</p>
  <hr style="border:none;border-top:1px solid #D4DDD8;margin:32px 0">
  <p style="font-size:14px;color:#7A9080">Farmmap — <a href="${SITE_URL}" style="color:#2D6A4F">${SITE_URL}</a></p>
</body>
</html>`,
  });

  if (error) throw new Error(`Resend error sending order status email: ${error.message}`);
  return { id: data!.id };
}

/**
 * Sends an order receipt to the buyer on successful payment.
 */
export async function sendOrderReceiptEmail(opts: {
  to: string;
  buyerName: string;
  listingName: string;
  orderId: string;
  totalPence: number;
  currency: string;
  items: Array<{ product_name: string; quantity: number; unit_price_pence: number }>;
  deliverySlot: { date: string; time_from: string; time_to: string };
}): Promise<SendResult> {
  const resend = getResend();

  const formatPrice = (pence: number) =>
    `${opts.currency === 'GBP' ? '£' : '€'}${(pence / 100).toFixed(2)}`;

  const itemRows = opts.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #E8EFEB">${i.product_name} × ${i.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #E8EFEB;text-align:right">${formatPrice(i.unit_price_pence * i.quantity)}</td>
        </tr>`,
    )
    .join('');

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: opts.to,
    subject: `Your order from ${opts.listingName} — Farmmap`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,sans-serif;line-height:1.6;color:#1A2E1F;max-width:600px;margin:0 auto;padding:24px">
  <h1 style="color:#2D6A4F;font-size:24px">Order confirmed!</h1>
  <p>Hi ${opts.buyerName},</p>
  <p>Your order from <strong>${opts.listingName}</strong> has been placed. You'll receive an email when it's accepted.</p>
  <table style="width:100%;border-collapse:collapse;margin:24px 0">
    ${itemRows}
    <tr>
      <td style="padding:12px 0;font-weight:600">Total</td>
      <td style="padding:12px 0;font-weight:600;text-align:right">${formatPrice(opts.totalPence)}</td>
    </tr>
  </table>
  <p>Delivery slot: <strong>${opts.deliverySlot.date}</strong> between <strong>${opts.deliverySlot.time_from}</strong> and <strong>${opts.deliverySlot.time_to}</strong></p>
  <p style="font-size:14px;color:#7A9080">Order reference: ${opts.orderId}</p>
  <hr style="border:none;border-top:1px solid #D4DDD8;margin:32px 0">
  <p style="font-size:14px;color:#7A9080">Farmmap — <a href="${SITE_URL}" style="color:#2D6A4F">${SITE_URL}</a></p>
</body>
</html>`,
  });

  if (error) throw new Error(`Resend error sending order receipt: ${error.message}`);
  return { id: data!.id };
}

/**
 * Sends a subscription renewal reminder (DMCC 2024 auto-renewal notification).
 * Sent 7 days before renewal for all active subscriptions.
 */
export async function sendRenewalReminderEmail(opts: {
  to: string;
  ownerName: string;
  listingName: string;
  tier: string;
  renewalDate: string;
  portalUrl: string;
}): Promise<SendResult> {
  const resend = getResend();
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: opts.to,
    subject: `Your Farmmap ${opts.tier} subscription renews in 7 days`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,sans-serif;line-height:1.6;color:#1A2E1F;max-width:600px;margin:0 auto;padding:24px">
  <h1 style="color:#2D6A4F;font-size:24px">Subscription renewal reminder</h1>
  <p>Hi ${opts.ownerName},</p>
  <p>Your <strong>${opts.tier}</strong> subscription for <strong>${opts.listingName}</strong> will automatically renew on <strong>${opts.renewalDate}</strong>.</p>
  <p>If you wish to cancel or change your plan before the renewal date, you can do so at any time:</p>
  <p style="margin:32px 0">
    <a href="${opts.portalUrl}" style="background:#2D6A4F;color:#fff;padding:14px 28px;text-decoration:none;border-radius:6px;font-weight:600">
      Manage subscription
    </a>
  </p>
  <p style="font-size:14px;color:#7A9080">This reminder is sent in accordance with the UK Digital Markets, Competition and Consumers Act 2024 (DMCC). You have the right to cancel at any time before renewal.</p>
  <hr style="border:none;border-top:1px solid #D4DDD8;margin:32px 0">
  <p style="font-size:14px;color:#7A9080">Farmmap — <a href="${SITE_URL}" style="color:#2D6A4F">${SITE_URL}</a></p>
</body>
</html>`,
  });

  if (error) throw new Error(`Resend error sending renewal reminder: ${error.message}`);
  return { id: data!.id };
}
