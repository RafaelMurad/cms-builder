/**
 * Feature Flags Module
 *
 * A type-safe, modular feature flag system for React applications.
 *
 * QUICK START:
 *
 * 1. Wrap your app with FeatureFlagProvider:
 *    <FeatureFlagProvider>
 *      <App />
 *    </FeatureFlagProvider>
 *
 * 2. Use the hook to check flags:
 *    const isEnabled = useFeatureFlag('command-palette');
 *
 * 3. Or use the Feature component:
 *    <Feature flag="command-palette">
 *      <CommandPalette />
 *    </Feature>
 *
 * 4. Add the debug panel for development:
 *    <FeatureFlagDebugPanel />
 *
 * TO ADD A NEW FLAG:
 * 1. Add key to FeatureFlagKey type in types.ts
 * 2. Add definition to FEATURE_FLAGS object in types.ts
 */

// Context and hooks
export {
  FeatureFlagProvider,
  useFeatureFlags,
  useFeatureFlag,
  Feature,
} from "./context";

// Debug panel
export { FeatureFlagDebugPanel } from "./DebugPanel";

// Types and constants
export {
  FEATURE_FLAGS,
  FLAG_CATEGORIES,
  CATEGORY_LABELS,
  type FeatureFlagKey,
  type FeatureFlagDefinition,
  type FeatureFlagState,
  type FeatureFlagCategory,
} from "./types";
