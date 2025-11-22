"use client";

/**
 * Feature Flag Debug Panel
 *
 * A floating panel for toggling feature flags during development.
 * Only visible when the "debug-panel" flag is enabled.
 *
 * Features:
 * - Draggable panel
 * - Group flags by category
 * - Show override status
 * - Reset individual or all flags
 * - Keyboard shortcut (Ctrl+Shift+F) to toggle
 */

import React, { useState, useEffect, useCallback } from "react";
import { useFeatureFlags, useFeatureFlag } from "./context";
import {
  FEATURE_FLAGS,
  FLAG_CATEGORIES,
  CATEGORY_LABELS,
  FeatureFlagKey,
} from "./types";

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function FeatureFlagDebugPanel() {
  const isDebugEnabled = useFeatureFlag("debug-panel");

  if (!isDebugEnabled) return null;

  return <DebugPanelContent />;
}

// ============================================================================
// PANEL CONTENT
// ============================================================================

function DebugPanelContent() {
  const { flags, toggleFlag, resetFlags, resetFlag, isOverridden } =
    useFeatureFlags();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Keyboard shortcut: Ctrl+Shift+F
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "F") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter flags
  const filteredFlags = Object.values(FEATURE_FLAGS).filter((flag) => {
    if (flag.key === "debug-panel") return false; // Hide debug panel flag
    if (filter && !flag.name.toLowerCase().includes(filter.toLowerCase())) {
      return false;
    }
    if (selectedCategory && flag.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  // Group by category
  const groupedFlags = FLAG_CATEGORIES.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    flags: filteredFlags.filter((f) => f.category === category),
  })).filter((group) => group.flags.length > 0);

  const overrideCount = Object.keys(FEATURE_FLAGS).filter(
    (key) => isOverridden(key as FeatureFlagKey)
  ).length;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-[9999] flex items-center gap-2 px-3 py-2 bg-neutral-900 text-white rounded-lg shadow-lg hover:bg-neutral-800 transition-colors text-sm font-medium border border-neutral-700"
        title="Toggle Feature Flags (Ctrl+Shift+F)"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
          />
        </svg>
        <span>Flags</span>
        {overrideCount > 0 && (
          <span className="px-1.5 py-0.5 text-xs bg-blue-500 rounded-full">
            {overrideCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 z-[9999] w-80 max-h-[70vh] bg-neutral-900 text-white rounded-xl shadow-2xl border border-neutral-700 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-neutral-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Feature Flags</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-neutral-700 rounded"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Search */}
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search flags..."
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />

            {/* Category Filter */}
            <div className="flex gap-1 mt-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-2 py-1 text-xs rounded ${
                  selectedCategory === null
                    ? "bg-blue-500 text-white"
                    : "bg-neutral-800 hover:bg-neutral-700"
                }`}
              >
                All
              </button>
              {FLAG_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 text-xs rounded capitalize ${
                    selectedCategory === cat
                      ? "bg-blue-500 text-white"
                      : "bg-neutral-800 hover:bg-neutral-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Flags List */}
          <div className="flex-1 overflow-auto p-2">
            {groupedFlags.map((group) => (
              <div key={group.category} className="mb-4">
                <h4 className="text-xs font-medium text-neutral-400 uppercase tracking-wider px-2 mb-2">
                  {group.label}
                </h4>
                <div className="space-y-1">
                  {group.flags.map((flag) => (
                    <FlagRow
                      key={flag.key}
                      flag={flag}
                      isEnabled={flags[flag.key]}
                      isOverridden={isOverridden(flag.key)}
                      onToggle={() => toggleFlag(flag.key)}
                      onReset={() => resetFlag(flag.key)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-neutral-700 flex items-center justify-between">
            <span className="text-xs text-neutral-400">
              {overrideCount} override{overrideCount !== 1 ? "s" : ""}
            </span>
            <button
              onClick={resetFlags}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Reset All
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================================
// FLAG ROW
// ============================================================================

interface FlagRowProps {
  flag: (typeof FEATURE_FLAGS)[FeatureFlagKey];
  isEnabled: boolean;
  isOverridden: boolean;
  onToggle: () => void;
  onReset: () => void;
}

function FlagRow({
  flag,
  isEnabled,
  isOverridden,
  onToggle,
  onReset,
}: FlagRowProps) {
  return (
    <div
      className={`flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-neutral-800 group ${
        isOverridden ? "bg-neutral-800/50" : ""
      }`}
    >
      {/* Toggle */}
      <button
        onClick={onToggle}
        className={`relative w-10 h-6 rounded-full transition-colors ${
          isEnabled ? "bg-blue-500" : "bg-neutral-700"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
            isEnabled ? "left-5" : "left-1"
          }`}
        />
      </button>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{flag.name}</span>
          {isOverridden && (
            <span className="px-1 py-0.5 text-[10px] bg-blue-500/20 text-blue-400 rounded">
              override
            </span>
          )}
          {!flag.productionReady && (
            <span className="px-1 py-0.5 text-[10px] bg-yellow-500/20 text-yellow-400 rounded">
              dev
            </span>
          )}
        </div>
        <p className="text-xs text-neutral-400 truncate">{flag.description}</p>
      </div>

      {/* Reset button (only if overridden) */}
      {isOverridden && (
        <button
          onClick={onReset}
          className="p-1 opacity-0 group-hover:opacity-100 hover:bg-neutral-700 rounded transition-opacity"
          title="Reset to default"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
