"use client";

/**
 * Feature Flag Context Provider
 *
 * This provider manages feature flag state across the application.
 * It supports:
 * - Default values from flag definitions
 * - localStorage persistence for overrides
 * - URL parameter overrides (e.g., ?ff_command-palette=true)
 * - Development debug panel
 *
 * ARCHITECTURE:
 * 1. Default values come from FEATURE_FLAGS definitions
 * 2. localStorage overrides persist user/dev preferences
 * 3. URL params allow temporary testing without persistence
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  FeatureFlagKey,
  FeatureFlagState,
  FEATURE_FLAGS,
} from "./types";

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY = "haus-feature-flags";
const URL_PARAM_PREFIX = "ff_";

// ============================================================================
// CONTEXT TYPES
// ============================================================================

interface FeatureFlagContextValue {
  /** Current state of all flags */
  flags: FeatureFlagState;
  /** Check if a specific flag is enabled */
  isEnabled: (key: FeatureFlagKey) => boolean;
  /** Enable a specific flag */
  enableFlag: (key: FeatureFlagKey) => void;
  /** Disable a specific flag */
  disableFlag: (key: FeatureFlagKey) => void;
  /** Toggle a specific flag */
  toggleFlag: (key: FeatureFlagKey) => void;
  /** Reset all flags to defaults */
  resetFlags: () => void;
  /** Reset a specific flag to default */
  resetFlag: (key: FeatureFlagKey) => void;
  /** Check if a flag has been overridden */
  isOverridden: (key: FeatureFlagKey) => boolean;
  /** Get all overridden flags */
  overrides: Partial<FeatureFlagState>;
}

const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get default values from flag definitions
 */
function getDefaultFlags(): FeatureFlagState {
  const defaults = {} as FeatureFlagState;
  for (const key of Object.keys(FEATURE_FLAGS) as FeatureFlagKey[]) {
    defaults[key] = FEATURE_FLAGS[key].defaultValue;
  }
  return defaults;
}

/**
 * Load overrides from localStorage
 */
function loadStoredOverrides(): Partial<FeatureFlagState> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Save overrides to localStorage
 */
function saveOverrides(overrides: Partial<FeatureFlagState>): void {
  if (typeof window === "undefined") return;
  try {
    if (Object.keys(overrides).length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Parse URL parameters for flag overrides
 * Format: ?ff_flag-name=true or ?ff_flag-name=false
 */
function parseUrlOverrides(): Partial<FeatureFlagState> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const overrides: Partial<FeatureFlagState> = {};

  params.forEach((value, key) => {
    if (key.startsWith(URL_PARAM_PREFIX)) {
      const flagKey = key.slice(URL_PARAM_PREFIX.length) as FeatureFlagKey;
      if (flagKey in FEATURE_FLAGS) {
        overrides[flagKey] = value === "true" || value === "1";
      }
    }
  });

  return overrides;
}

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface FeatureFlagProviderProps {
  children: React.ReactNode;
  /** Optional initial overrides (useful for testing) */
  initialOverrides?: Partial<FeatureFlagState>;
}

export function FeatureFlagProvider({
  children,
  initialOverrides = {},
}: FeatureFlagProviderProps) {
  // State: stored overrides (persisted to localStorage)
  const [storedOverrides, setStoredOverrides] = useState<Partial<FeatureFlagState>>(() => ({
    ...loadStoredOverrides(),
    ...initialOverrides,
  }));

  // URL overrides (temporary, not persisted)
  const [urlOverrides, setUrlOverrides] = useState<Partial<FeatureFlagState>>({});

  // Load URL overrides on mount
  useEffect(() => {
    setUrlOverrides(parseUrlOverrides());
  }, []);

  // Compute final flag state
  const flags = useMemo(() => {
    const defaults = getDefaultFlags();
    return {
      ...defaults,
      ...storedOverrides,
      ...urlOverrides, // URL overrides take precedence
    };
  }, [storedOverrides, urlOverrides]);

  // Persist overrides to localStorage
  useEffect(() => {
    saveOverrides(storedOverrides);
  }, [storedOverrides]);

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const isEnabled = useCallback(
    (key: FeatureFlagKey) => flags[key],
    [flags]
  );

  const enableFlag = useCallback((key: FeatureFlagKey) => {
    setStoredOverrides((prev) => ({ ...prev, [key]: true }));
  }, []);

  const disableFlag = useCallback((key: FeatureFlagKey) => {
    setStoredOverrides((prev) => ({ ...prev, [key]: false }));
  }, []);

  const toggleFlag = useCallback((key: FeatureFlagKey) => {
    setStoredOverrides((prev) => ({
      ...prev,
      [key]: !flags[key],
    }));
  }, [flags]);

  const resetFlags = useCallback(() => {
    setStoredOverrides({});
  }, []);

  const resetFlag = useCallback((key: FeatureFlagKey) => {
    setStoredOverrides((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const isOverridden = useCallback(
    (key: FeatureFlagKey) => key in storedOverrides || key in urlOverrides,
    [storedOverrides, urlOverrides]
  );

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value = useMemo<FeatureFlagContextValue>(
    () => ({
      flags,
      isEnabled,
      enableFlag,
      disableFlag,
      toggleFlag,
      resetFlags,
      resetFlag,
      isOverridden,
      overrides: storedOverrides,
    }),
    [
      flags,
      isEnabled,
      enableFlag,
      disableFlag,
      toggleFlag,
      resetFlags,
      resetFlag,
      isOverridden,
      storedOverrides,
    ]
  );

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Access the full feature flag context
 */
export function useFeatureFlags(): FeatureFlagContextValue {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error(
      "useFeatureFlags must be used within a FeatureFlagProvider"
    );
  }
  return context;
}

/**
 * Check if a specific feature flag is enabled
 *
 * @example
 * const isCommandPaletteEnabled = useFeatureFlag('command-palette');
 * if (isCommandPaletteEnabled) {
 *   // Render command palette
 * }
 */
export function useFeatureFlag(key: FeatureFlagKey): boolean {
  const { isEnabled } = useFeatureFlags();
  return isEnabled(key);
}

/**
 * Conditional rendering based on feature flag
 *
 * @example
 * <Feature flag="command-palette">
 *   <CommandPalette />
 * </Feature>
 *
 * // With fallback
 * <Feature flag="command-palette" fallback={<OldSearch />}>
 *   <CommandPalette />
 * </Feature>
 */
export function Feature({
  flag,
  children,
  fallback = null,
}: {
  flag: FeatureFlagKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const isEnabled = useFeatureFlag(flag);
  return <>{isEnabled ? children : fallback}</>;
}
