/**
 * Subscription & Billing System
 *
 * Integrates with Stripe for payment processing.
 * Manages subscription tiers, usage limits, and feature access.
 */

import { prisma } from "@/lib/db/client";
import { SubscriptionTier } from "@/lib/auth/config";

// Subscription status type
export type SubscriptionStatus = "ACTIVE" | "PAST_DUE" | "CANCELED" | "TRIALING" | "PAUSED";

// Initialize Stripe dynamically
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  try {
    const Stripe = require("stripe").default;
    return new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });
  } catch {
    return null;
  }
};

// =============================================================================
// PRICING CONFIGURATION
// =============================================================================

export interface PricingPlan {
  id: SubscriptionTier;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  stripePriceIds: {
    monthly: string;
    yearly: string;
  };
  features: string[];
  limits: {
    galleries: number;
    pages: number;
    storageMB: number;
    teamMembers: number;
    apiCalls: number;
  };
  popular?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "FREE",
    name: "Free",
    description: "Perfect for trying out Studio CMS",
    price: {
      monthly: 0,
      yearly: 0,
    },
    stripePriceIds: {
      monthly: "",
      yearly: "",
    },
    features: [
      "Up to 3 galleries",
      "5 pages",
      "100 MB storage",
      "Basic templates",
      "Studio branding",
      "Community support",
    ],
    limits: {
      galleries: 3,
      pages: 5,
      storageMB: 100,
      teamMembers: 1,
      apiCalls: 100,
    },
  },
  {
    id: "STARTER",
    name: "Starter",
    description: "For individuals and small portfolios",
    price: {
      monthly: 9,
      yearly: 90, // 2 months free
    },
    stripePriceIds: {
      monthly: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID || "",
      yearly: process.env.STRIPE_STARTER_YEARLY_PRICE_ID || "",
    },
    features: [
      "Up to 10 galleries",
      "20 pages",
      "1 GB storage",
      "All templates",
      "Custom domain",
      "Remove branding",
      "Basic analytics",
      "Email support",
    ],
    limits: {
      galleries: 10,
      pages: 20,
      storageMB: 1024,
      teamMembers: 1,
      apiCalls: 1000,
    },
  },
  {
    id: "PROFESSIONAL",
    name: "Professional",
    description: "For agencies and growing businesses",
    price: {
      monthly: 29,
      yearly: 290, // 2 months free
    },
    stripePriceIds: {
      monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "",
      yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID || "",
    },
    features: [
      "Up to 50 galleries",
      "Unlimited pages",
      "10 GB storage",
      "All templates",
      "Custom domain",
      "Remove branding",
      "Advanced analytics",
      "API access",
      "Custom CSS",
      "Password protection",
      "Up to 5 team members",
      "Priority support",
    ],
    limits: {
      galleries: 50,
      pages: -1, // Unlimited
      storageMB: 10240,
      teamMembers: 5,
      apiCalls: 10000,
    },
    popular: true,
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    description: "For large organizations with custom needs",
    price: {
      monthly: 99,
      yearly: 990, // 2 months free
    },
    stripePriceIds: {
      monthly: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID || "",
      yearly: process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID || "",
    },
    features: [
      "Unlimited galleries",
      "Unlimited pages",
      "Unlimited storage",
      "All templates",
      "Custom domain",
      "White-label solution",
      "Advanced analytics",
      "Full API access",
      "Custom CSS & JS",
      "SSO/SAML",
      "Unlimited team members",
      "Dedicated support",
      "SLA guarantee",
      "Custom integrations",
    ],
    limits: {
      galleries: -1,
      pages: -1,
      storageMB: -1,
      teamMembers: -1,
      apiCalls: -1,
    },
  },
];

// =============================================================================
// STRIPE INTEGRATION
// =============================================================================

/**
 * Create a Stripe checkout session for subscription
 */
export async function createCheckoutSession(
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<string | null> {
  const stripe = getStripe();
  if (!stripe) {
    console.error("Stripe not configured");
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, stripeCustomerId: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Create or get Stripe customer
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email || undefined,
      metadata: { userId },
    });
    customerId = customer.id;

    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customerId },
    });
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId },
    subscription_data: {
      metadata: { userId },
    },
    allow_promotion_codes: true,
  });

  return session.url;
}

/**
 * Create a Stripe billing portal session
 */
export async function createBillingPortalSession(
  userId: string,
  returnUrl: string
): Promise<string | null> {
  const stripe = getStripe();
  if (!stripe) {
    console.error("Stripe not configured");
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  if (!user?.stripeCustomerId) {
    throw new Error("No Stripe customer found");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: returnUrl,
  });

  return session.url;
}

/**
 * Handle Stripe webhook events
 */
export async function handleStripeWebhook(
  event: any // Stripe.Event type
): Promise<void> {
  const stripe = getStripe();
  if (!stripe) return;

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const subscriptionId = session.subscription as string;

      if (userId && subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id;
        const tier = getPlanByPriceId(priceId);

        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionTier: tier || "STARTER",
            subscriptionStatus: "ACTIVE",
            stripeSubscriptionId: subscriptionId,
            trialEndsAt: null,
          },
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const userId = subscription.metadata?.userId;

      if (userId) {
        const priceId = subscription.items.data[0]?.price.id;
        const tier = getPlanByPriceId(priceId);

        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionTier: tier || "FREE",
            subscriptionStatus: mapStripeStatus(subscription.status),
          },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const userId = subscription.metadata?.userId;

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionTier: "FREE",
            subscriptionStatus: "CANCELED",
            stripeSubscriptionId: null,
          },
        });
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object;
      const customerId = invoice.customer as string;

      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId },
      });

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { subscriptionStatus: "PAST_DUE" },
        });
      }
      break;
    }
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get plan by Stripe price ID
 */
function getPlanByPriceId(priceId: string): SubscriptionTier | null {
  for (const plan of PRICING_PLANS) {
    if (
      plan.stripePriceIds.monthly === priceId ||
      plan.stripePriceIds.yearly === priceId
    ) {
      return plan.id;
    }
  }
  return null;
}

/**
 * Map Stripe subscription status to our status enum
 */
function mapStripeStatus(status: string): SubscriptionStatus {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "past_due":
      return "PAST_DUE";
    case "canceled":
      return "CANCELED";
    case "trialing":
      return "TRIALING";
    case "paused":
      return "PAUSED";
    default:
      return "ACTIVE";
  }
}

/**
 * Check if user is within their usage limits
 */
export async function checkUsageLimits(
  userId: string
): Promise<{
  withinLimits: boolean;
  usage: {
    galleries: { current: number; limit: number };
    storage: { current: number; limit: number };
  };
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionTier: true,
      storageUsedMB: true,
      _count: {
        select: { galleries: true },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const plan = PRICING_PLANS.find((p) => p.id === user.subscriptionTier);
  if (!plan) {
    throw new Error("Invalid subscription tier");
  }

  const galleryLimit = plan.limits.galleries;
  const storageLimit = plan.limits.storageMB;

  const withinGalleryLimit =
    galleryLimit === -1 || user._count.galleries < galleryLimit;
  const withinStorageLimit =
    storageLimit === -1 || user.storageUsedMB < storageLimit;

  return {
    withinLimits: withinGalleryLimit && withinStorageLimit,
    usage: {
      galleries: {
        current: user._count.galleries,
        limit: galleryLimit,
      },
      storage: {
        current: user.storageUsedMB,
        limit: storageLimit,
      },
    },
  };
}

/**
 * Get plan details for a tier
 */
export function getPlanDetails(tier: SubscriptionTier): PricingPlan | undefined {
  return PRICING_PLANS.find((p) => p.id === tier);
}
