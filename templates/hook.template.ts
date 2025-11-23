/**
 * Hook Template
 *
 * Copy this file to: src/hooks/use[HookName].ts
 *
 * Patterns included:
 * - TypeScript generics
 * - Cleanup on unmount
 * - Memoization
 * - Error handling
 */

import { useState, useEffect, useCallback, useRef } from "react";

// =============================================================================
// TYPES
// =============================================================================

interface UseHookNameOptions {
  /** Enable the hook */
  enabled?: boolean;
  /** Callback when value changes */
  onChange?: (value: string) => void;
  /** Initial value */
  initialValue?: string;
  /** Debounce delay in ms */
  debounce?: number;
}

interface UseHookNameReturn {
  /** Current value */
  value: string;
  /** Set new value */
  setValue: (value: string) => void;
  /** Reset to initial value */
  reset: () => void;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
}

// =============================================================================
// HOOK
// =============================================================================

export function useHookName(
  options: UseHookNameOptions = {}
): UseHookNameReturn {
  const {
    enabled = true,
    onChange,
    initialValue = "",
    debounce = 0,
  } = options;

  // State
  const [value, setValueState] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Refs for cleanup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Debounced setValue
  const setValue = useCallback(
    (newValue: string) => {
      if (!enabled) return;

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set immediately if no debounce
      if (debounce === 0) {
        setValueState(newValue);
        onChange?.(newValue);
        return;
      }

      // Debounce
      timeoutRef.current = setTimeout(() => {
        if (mountedRef.current) {
          setValueState(newValue);
          onChange?.(newValue);
        }
      }, debounce);
    },
    [enabled, debounce, onChange]
  );

  // Reset function
  const reset = useCallback(() => {
    setValueState(initialValue);
    setError(null);
    onChange?.(initialValue);
  }, [initialValue, onChange]);

  // Example async effect (customize as needed)
  useEffect(() => {
    if (!enabled || !value) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Replace with actual async operation
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (!mountedRef.current) return;
        // setValueState(result);
      } catch (err) {
        if (!mountedRef.current) return;
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    // Uncomment to enable async fetch
    // fetchData();
  }, [enabled, value]);

  return {
    value,
    setValue,
    reset,
    isLoading,
    error,
  };
}

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default useHookName;
