/**
 * Stripe client, webhook verification, and Connect helpers.
 *
 * All Stripe IDs that contain payment references are C4 (Customer Financial).
 * They are encrypted before storage via the encryption module.
 *
 * ADR: ADR-0005
 * Commission logic: fee = subtotal < threshold ? 0 : round(subtotal * rate)
 * Silver: 3% on orders >= £20 (2000 pence)
 * Gold: 5% on orders >= £30 (3000 pence)
 */

import Stripe from 'stripe';

// Singleton Stripe client
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
  }

  _stripe = new Stripe(secretKey, {
    apiVersion: '2025-02-24.acacia',
    typescript: true,
    appInfo: {
      name: 'Farmmap',
      version: '1.0.0',
      url: 'https://farmmap.co.uk',
    },
  });

  return _stripe;
}

/**
 * Verifies a Stripe webhook signature.
 * Returns the parsed event or throws on invalid signature.
 *
 * CRITICAL: Always verify webhooks. Never trust unverified payloads.
 * C6 classification: webhook secret is never logged.
 */
export async function verifyStripeWebhook(
  body: string,
  signature: string,
): Promise<Stripe.Event> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET environment variable is not set');
  }

  const stripe = getStripe();
  return stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
}

/**
 * Calculates the Farmmap application fee for a marketplace order.
 *
 * Silver: 3% on subtotal >= £20 (2000p)
 * Gold: 5% on subtotal >= £30 (3000p)
 *
 * Returns 0 if below the threshold (per ADR-0005 commission structure).
 */
export function calculateCommission(
  subtotalPence: number,
  tier: 'silver' | 'gold',
  commissionConfig?: {
    silver: { rate: number; threshold_pence: number };
    gold: { rate: number; threshold_pence: number };
  },
): number {
  const config = commissionConfig ?? {
    silver: { rate: 0.03, threshold_pence: 2000 },
    gold: { rate: 0.05, threshold_pence: 3000 },
  };

  const { rate, threshold_pence } = config[tier];
  if (subtotalPence < threshold_pence) return 0;
  return Math.round(subtotalPence * rate);
}

/**
 * Creates a Stripe Connect Standard OAuth link for Silver/Gold onboarding.
 * Returns the URL the user should be redirected to.
 *
 * ADR-0005: Connect Standard — farm shop is always the merchant of record.
 * Farmmap holds connect_account_id per listing (encrypted at C3).
 */
export async function createConnectOAuthLink(
  listingSlug: string,
  redirectUri: string,
): Promise<string> {
  const stripe = getStripe();
  const clientId = process.env.STRIPE_CONNECT_CLIENT_ID;

  if (!clientId) {
    throw new Error('STRIPE_CONNECT_CLIENT_ID environment variable is not set');
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: 'read_write',
    redirect_uri: redirectUri,
    state: listingSlug,
    'stripe_user[business_type]': 'sole_prop',
    'stripe_user[country]': 'GB',
  });

  return `https://connect.stripe.com/oauth/authorize?${params.toString()}`;
}

/**
 * Exchanges a Connect OAuth code for the connected account ID.
 * Called from the /api/subscriptions/[slug]/connect callback.
 */
export async function exchangeConnectCode(code: string): Promise<string> {
  const stripe = getStripe();
  const response = await stripe.oauth.token({
    grant_type: 'authorization_code',
    code,
  });
  if (!response.stripe_user_id) {
    throw new Error('Stripe Connect OAuth exchange did not return a stripe_user_id');
  }
  return response.stripe_user_id;
}

/**
 * Creates a Stripe Billing Checkout session for subscription upgrade.
 * Returns the checkout URL to redirect the user to.
 */
export async function createSubscriptionCheckout(opts: {
  tier: 'bronze' | 'silver' | 'gold';
  stripeCustomerId?: string;
  successUrl: string;
  cancelUrl: string;
  metadata: Record<string, string>;
}): Promise<string> {
  const stripe = getStripe();

  const priceIds: Record<string, string | undefined> = {
    bronze: process.env.STRIPE_BRONZE_PRICE_ID,
    silver: process.env.STRIPE_SILVER_PRICE_ID,
    gold: process.env.STRIPE_GOLD_PRICE_ID,
  };

  const priceId = priceIds[opts.tier];
  if (!priceId) {
    throw new Error(`Missing Stripe Price ID for tier: ${opts.tier}`);
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
    metadata: opts.metadata,
    ...(opts.stripeCustomerId ? { customer: opts.stripeCustomerId } : {}),
    subscription_data: {
      metadata: opts.metadata,
    },
    // 14-day cancellation right disclosure (V2-C1 DMCC 2024)
    custom_text: {
      submit: {
        message:
          'You have a 14-day right to cancel under the Consumer Contracts Regulations 2013. See our Terms of Service for details.',
      },
    },
  });

  if (!session.url) {
    throw new Error('Stripe Checkout session did not return a URL');
  }
  return session.url;
}

/**
 * Creates a Stripe Billing Portal session for self-service management.
 * The owner can upgrade, downgrade, cancel, or update payment details.
 */
export async function createBillingPortal(
  stripeCustomerId: string,
  returnUrl: string,
): Promise<string> {
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl,
  });
  return session.url;
}

/**
 * Creates a Stripe PaymentIntent on the connected account with application fee.
 * This is used for Silver/Gold marketplace orders.
 *
 * The connected account is the merchant of record (ADR-0005).
 * Farmmap receives the application_fee_amount.
 */
export async function createOrderPaymentIntent(opts: {
  amountPence: number;
  applicationFeePence: number;
  currency: 'gbp' | 'eur';
  connectAccountId: string;
  idempotencyKey: string;
  metadata: Record<string, string>;
}): Promise<{ id: string; clientSecret: string }> {
  const stripe = getStripe();

  const intent = await stripe.paymentIntents.create(
    {
      amount: opts.amountPence,
      currency: opts.currency,
      application_fee_amount: opts.applicationFeePence,
      transfer_data: {
        destination: opts.connectAccountId,
      },
      metadata: opts.metadata,
      automatic_payment_methods: { enabled: true },
    },
    {
      idempotencyKey: opts.idempotencyKey,
      stripeAccount: undefined, // Create on Farmmap's account, transfer to connected
    },
  );

  if (!intent.client_secret) {
    throw new Error('Stripe PaymentIntent did not return a client_secret');
  }

  return {
    id: intent.id,
    clientSecret: intent.client_secret,
  };
}
