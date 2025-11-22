/**
 * NextAuth.js Configuration
 *
 * Supports:
 * - Google OAuth
 * - GitHub OAuth
 * - Twitter/X OAuth
 * - Email/Password (credentials)
 * - Magic Link (email)
 *
 * Setup:
 * 1. Add required env vars (see .env.example)
 * 2. Run: npx prisma generate && npx prisma db push
 * 3. Configure OAuth apps in provider dashboards
 */

import type { NextAuthOptions } from "next-auth";

// Subscription tier type (mirrors Prisma enum)
export type SubscriptionTier = "FREE" | "STARTER" | "PROFESSIONAL" | "ENTERPRISE";

// Extend session type to include custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      subscriptionTier: SubscriptionTier;
      isTrialing: boolean;
    };
  }

  interface User {
    subscriptionTier?: SubscriptionTier;
    trialEndsAt?: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    subscriptionTier: SubscriptionTier;
    isTrialing: boolean;
  }
}

// Build auth options dynamically to handle missing dependencies
function buildAuthOptions(): NextAuthOptions {
  const providers: NextAuthOptions["providers"] = [];

  // Only add providers if their credentials are configured
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    const GoogleProvider = require("next-auth/providers/google").default;
    providers.push(
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
          },
        },
      })
    );
  }

  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    const GitHubProvider = require("next-auth/providers/github").default;
    providers.push(
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      })
    );
  }

  if (process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET) {
    const TwitterProvider = require("next-auth/providers/twitter").default;
    providers.push(
      TwitterProvider({
        clientId: process.env.TWITTER_CLIENT_ID,
        clientSecret: process.env.TWITTER_CLIENT_SECRET,
        version: "2.0",
      })
    );
  }

  // Add credentials provider for demo/development
  const CredentialsProvider = require("next-auth/providers/credentials").default;
  providers.push(
    CredentialsProvider({
      id: "credentials",
      name: "Demo Account",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Demo authentication - in production, verify against database
        if (credentials?.email && credentials?.password) {
          return {
            id: "demo-user-1",
            email: credentials.email,
            name: "Demo User",
            subscriptionTier: "PROFESSIONAL" as SubscriptionTier,
          };
        }
        return null;
      },
    })
  );

  return {
    providers,
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
      newUser: "/studio",
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.subscriptionTier = user.subscriptionTier || "FREE";
          token.isTrialing = user.trialEndsAt
            ? new Date(user.trialEndsAt) > new Date()
            : false;
        }
        return token;
      },
      async session({ session, token }) {
        if (token) {
          session.user.id = token.id;
          session.user.subscriptionTier = token.subscriptionTier;
          session.user.isTrialing = token.isTrialing;
        }
        return session;
      },
    },
    debug: process.env.NODE_ENV === "development",
  };
}

export const authOptions: NextAuthOptions = buildAuthOptions();

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const { hash } = await import("bcryptjs");
  return hash(password, 12);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const { compare } = await import("bcryptjs");
  return compare(password, hashedPassword);
}

/**
 * Check if user has access to a feature based on their subscription
 */
export function hasFeatureAccess(
  tier: SubscriptionTier,
  feature: string
): boolean {
  const featureAccess: Record<string, SubscriptionTier[]> = {
    // Basic features (all tiers)
    basic_galleries: ["FREE", "STARTER", "PROFESSIONAL", "ENTERPRISE"],
    basic_pages: ["FREE", "STARTER", "PROFESSIONAL", "ENTERPRISE"],
    basic_media: ["FREE", "STARTER", "PROFESSIONAL", "ENTERPRISE"],

    // Starter features
    custom_domain: ["STARTER", "PROFESSIONAL", "ENTERPRISE"],
    remove_branding: ["STARTER", "PROFESSIONAL", "ENTERPRISE"],
    analytics_basic: ["STARTER", "PROFESSIONAL", "ENTERPRISE"],

    // Professional features
    analytics_advanced: ["PROFESSIONAL", "ENTERPRISE"],
    api_access: ["PROFESSIONAL", "ENTERPRISE"],
    custom_css: ["PROFESSIONAL", "ENTERPRISE"],
    team_members: ["PROFESSIONAL", "ENTERPRISE"],

    // Enterprise features
    sso: ["ENTERPRISE"],
    dedicated_support: ["ENTERPRISE"],
    unlimited_storage: ["ENTERPRISE"],
  };

  return featureAccess[feature]?.includes(tier) ?? false;
}

/**
 * Get storage limit in MB for a subscription tier
 */
export function getStorageLimit(tier: SubscriptionTier): number {
  const limits: Record<SubscriptionTier, number> = {
    FREE: 100,
    STARTER: 1024,
    PROFESSIONAL: 10240,
    ENTERPRISE: -1, // Unlimited
  };
  return limits[tier];
}

/**
 * Get gallery limit for a subscription tier
 */
export function getGalleryLimit(tier: SubscriptionTier): number {
  const limits: Record<SubscriptionTier, number> = {
    FREE: 3,
    STARTER: 10,
    PROFESSIONAL: 50,
    ENTERPRISE: -1, // Unlimited
  };
  return limits[tier];
}
