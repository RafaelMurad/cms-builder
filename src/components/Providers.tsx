"use client";

/**
 * Client-side Providers
 *
 * This component wraps all client-side context providers.
 * Kept separate from the root layout to preserve Server Component benefits.
 */

import { ReactNode } from "react";
import {
  FeatureFlagProvider,
  FeatureFlagDebugPanel,
} from "@/lib/feature-flags";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <FeatureFlagProvider>
      {children}
      <FeatureFlagDebugPanel />
    </FeatureFlagProvider>
  );
}
