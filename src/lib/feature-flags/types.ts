/**
 * Feature Flags Type Definitions
 *
 * This file defines all available feature flags in the application.
 * Each flag has a unique key, default value, and metadata.
 *
 * HOW TO ADD A NEW FLAG:
 * 1. Add the flag key to the FeatureFlagKey type
 * 2. Add the flag definition to FEATURE_FLAGS object
 * 3. Use useFeatureFlag('your-flag-key') in your component
 */

// ============================================================================
// FEATURE FLAG KEYS
// ============================================================================

/**
 * All available feature flag keys.
 * Add new flags here as literal types for type safety.
 */
export type FeatureFlagKey =
  | "command-palette"
  | "undo-redo"
  | "virtual-list"
  | "realtime-presence"
  | "offline-pwa"
  | "ab-testing"
  | "performance-dashboard"
  | "i18n"
  | "state-machines"
  | "image-optimization"
  | "keyboard-shortcuts"
  | "toast-notifications"
  | "form-validation"
  | "debug-panel";

// ============================================================================
// FLAG DEFINITION
// ============================================================================

export interface FeatureFlagDefinition {
  /** Unique identifier for the flag */
  key: FeatureFlagKey;
  /** Human-readable name */
  name: string;
  /** Brief description of what the flag enables */
  description: string;
  /** Default state when not overridden */
  defaultValue: boolean;
  /** Category for grouping in debug panel */
  category: "core" | "ui" | "performance" | "experimental";
  /** Whether this flag is safe to enable in production */
  productionReady: boolean;
  /** Link to documentation or learning guide */
  learnMoreUrl?: string;
}

// ============================================================================
// FLAG DEFINITIONS
// ============================================================================

export const FEATURE_FLAGS: Record<FeatureFlagKey, FeatureFlagDefinition> = {
  "command-palette": {
    key: "command-palette",
    name: "Command Palette",
    description: "Press Cmd+K to open a searchable command palette",
    defaultValue: false,
    category: "ui",
    productionReady: false,
    learnMoreUrl: "/learn/command-palette",
  },
  "undo-redo": {
    key: "undo-redo",
    name: "Undo/Redo System",
    description: "Enable undo/redo functionality with history tracking",
    defaultValue: false,
    category: "core",
    productionReady: false,
    learnMoreUrl: "/learn/undo-redo",
  },
  "virtual-list": {
    key: "virtual-list",
    name: "Virtual List",
    description: "Render large lists efficiently with windowing",
    defaultValue: false,
    category: "performance",
    productionReady: false,
    learnMoreUrl: "/learn/virtual-list",
  },
  "realtime-presence": {
    key: "realtime-presence",
    name: "Real-time Presence",
    description: "Show live cursors and presence of other users",
    defaultValue: false,
    category: "experimental",
    productionReady: false,
    learnMoreUrl: "/learn/realtime-presence",
  },
  "offline-pwa": {
    key: "offline-pwa",
    name: "Offline PWA",
    description: "Enable offline support with service workers",
    defaultValue: false,
    category: "core",
    productionReady: false,
    learnMoreUrl: "/learn/offline-pwa",
  },
  "ab-testing": {
    key: "ab-testing",
    name: "A/B Testing",
    description: "Enable A/B testing framework for experiments",
    defaultValue: false,
    category: "experimental",
    productionReady: false,
    learnMoreUrl: "/learn/ab-testing",
  },
  "performance-dashboard": {
    key: "performance-dashboard",
    name: "Performance Dashboard",
    description: "Show Web Vitals and performance metrics",
    defaultValue: false,
    category: "performance",
    productionReady: false,
    learnMoreUrl: "/learn/performance-dashboard",
  },
  "i18n": {
    key: "i18n",
    name: "Internationalization",
    description: "Enable multi-language support with RTL",
    defaultValue: false,
    category: "core",
    productionReady: false,
    learnMoreUrl: "/learn/i18n",
  },
  "state-machines": {
    key: "state-machines",
    name: "State Machines",
    description: "Use XState for complex UI state management",
    defaultValue: false,
    category: "experimental",
    productionReady: false,
    learnMoreUrl: "/learn/state-machines",
  },
  "image-optimization": {
    key: "image-optimization",
    name: "Image Optimization",
    description: "Advanced image loading with blur placeholders",
    defaultValue: false,
    category: "performance",
    productionReady: false,
    learnMoreUrl: "/learn/image-optimization",
  },
  "keyboard-shortcuts": {
    key: "keyboard-shortcuts",
    name: "Keyboard Shortcuts",
    description: "Global keyboard shortcuts with chord support",
    defaultValue: false,
    category: "ui",
    productionReady: false,
    learnMoreUrl: "/learn/keyboard-shortcuts",
  },
  "toast-notifications": {
    key: "toast-notifications",
    name: "Toast Notifications",
    description: "Queue-based notification system",
    defaultValue: false,
    category: "ui",
    productionReady: false,
    learnMoreUrl: "/learn/toast-notifications",
  },
  "form-validation": {
    key: "form-validation",
    name: "Form Validation",
    description: "Schema-based form validation with Zod",
    defaultValue: false,
    category: "core",
    productionReady: false,
    learnMoreUrl: "/learn/form-validation",
  },
  "debug-panel": {
    key: "debug-panel",
    name: "Debug Panel",
    description: "Show feature flag debug panel in development",
    defaultValue: process.env.NODE_ENV === "development",
    category: "core",
    productionReady: true,
  },
};

// ============================================================================
// HELPER TYPES
// ============================================================================

export type FeatureFlagState = Record<FeatureFlagKey, boolean>;

export type FeatureFlagCategory = FeatureFlagDefinition["category"];

export const FLAG_CATEGORIES: FeatureFlagCategory[] = [
  "core",
  "ui",
  "performance",
  "experimental",
];

export const CATEGORY_LABELS: Record<FeatureFlagCategory, string> = {
  core: "Core Features",
  ui: "UI Enhancements",
  performance: "Performance",
  experimental: "Experimental",
};
