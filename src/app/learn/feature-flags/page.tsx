"use client";

/**
 * Feature Flags Learning Guide
 *
 * Interactive guide to understand and practice feature flags.
 */

import { useState } from "react";
import Link from "next/link";
import {
  useFeatureFlags,
  useFeatureFlag,
  Feature,
  FEATURE_FLAGS,
  FeatureFlagKey,
} from "@/lib/feature-flags";

export default function FeatureFlagsLearnPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/learn"
            className="text-neutral-400 hover:text-white transition-colors mb-4 inline-block"
          >
            &larr; Back to Learn
          </Link>
          <h1 className="text-4xl font-bold mb-4">Feature Flags</h1>
          <p className="text-xl text-neutral-400">
            Control feature rollout without deploying new code
          </p>
        </div>

        {/* What are Feature Flags */}
        <Section title="What are Feature Flags?">
          <p className="text-neutral-300 mb-4">
            Feature flags (also called feature toggles) are a software development
            technique that allows you to enable or disable features without deploying
            new code. They decouple <strong>deployment</strong> from <strong>release</strong>.
          </p>
          <CodeBlock
            title="Basic Usage"
            code={`// Check if a flag is enabled
const isEnabled = useFeatureFlag('command-palette');

// Conditional rendering
if (isEnabled) {
  return <CommandPalette />;
}

// Or use the Feature component
<Feature flag="command-palette">
  <CommandPalette />
</Feature>`}
          />
        </Section>

        {/* Why Use Feature Flags */}
        <Section title="Why Use Feature Flags?">
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <BenefitCard
              title="Safe Deployments"
              description="Ship code to production without enabling it for users"
            />
            <BenefitCard
              title="Gradual Rollouts"
              description="Enable features for a percentage of users"
            />
            <BenefitCard
              title="A/B Testing"
              description="Test different variations with real users"
            />
            <BenefitCard
              title="Kill Switches"
              description="Instantly disable problematic features"
            />
          </div>
        </Section>

        {/* Architecture */}
        <Section title="Architecture">
          <p className="text-neutral-300 mb-4">
            Our feature flag system uses three layers of configuration:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-neutral-300 mb-6">
            <li><strong>Default Values</strong> - Defined in code (types.ts)</li>
            <li><strong>localStorage Overrides</strong> - Persisted user/dev preferences</li>
            <li><strong>URL Parameters</strong> - Temporary testing (highest priority)</li>
          </ol>
          <CodeBlock
            title="Priority Order"
            code={`// Final value computed as:
const value = urlOverride ?? storedOverride ?? defaultValue;

// Test via URL: ?ff_command-palette=true
// This won't persist, perfect for testing`}
          />
        </Section>

        {/* Interactive Demo */}
        <Section title="Interactive Demo">
          <InteractiveDemo />
        </Section>

        {/* Adding New Flags */}
        <Section title="Adding New Flags">
          <p className="text-neutral-300 mb-4">
            To add a new feature flag:
          </p>
          <CodeBlock
            title="src/lib/feature-flags/types.ts"
            code={`// Step 1: Add to FeatureFlagKey type
export type FeatureFlagKey =
  | "command-palette"
  | "your-new-flag"  // Add here
  | ...;

// Step 2: Add definition to FEATURE_FLAGS
export const FEATURE_FLAGS = {
  "your-new-flag": {
    key: "your-new-flag",
    name: "Your New Feature",
    description: "What this flag enables",
    defaultValue: false,
    category: "experimental",
    productionReady: false,
    learnMoreUrl: "/learn/your-feature",
  },
  ...
};`}
          />
        </Section>

        {/* Exercises */}
        <Section title="Exercises">
          <div className="space-y-6">
            <Exercise
              number={1}
              title="Create a Feature-Flagged Component"
              description="Create a component that only renders when a specific flag is enabled."
              tasks={[
                "Create a new component called SecretFeature.tsx",
                "Use useFeatureFlag to check if 'toast-notifications' is enabled",
                "Show different content based on the flag state",
              ]}
            />
            <Exercise
              number={2}
              title="Add URL Parameter Override"
              description="Test feature flags without persisting changes."
              tasks={[
                "Open your app with ?ff_command-palette=true in the URL",
                "Verify the flag is enabled in the debug panel",
                "Refresh the page - the flag should reset (URL params don't persist)",
              ]}
            />
            <Exercise
              number={3}
              title="Create a Custom Flag"
              description="Add your own feature flag to the system."
              tasks={[
                "Add a new flag key to FeatureFlagKey type",
                "Add the flag definition to FEATURE_FLAGS",
                "Use the flag in a component",
                "Toggle it via the debug panel",
              ]}
            />
          </div>
        </Section>

        {/* Best Practices */}
        <Section title="Best Practices">
          <ul className="space-y-3 text-neutral-300">
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Keep flags short-lived - remove them once features are stable</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Use descriptive names that explain what the flag controls</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Document flags with descriptions and categories</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Test both flag states in your test suite</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">✗</span>
              <span>Don&apos;t nest flags - it creates complex state combinations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">✗</span>
              <span>Don&apos;t use flags for permanent configuration (use env vars)</span>
            </li>
          </ul>
        </Section>

        {/* Further Reading */}
        <Section title="Further Reading">
          <ul className="space-y-2">
            <li>
              <a
                href="https://martinfowler.com/articles/feature-toggles.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Martin Fowler - Feature Toggles
              </a>
            </li>
            <li>
              <a
                href="https://launchdarkly.com/blog/what-are-feature-flags/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                LaunchDarkly - Feature Flags Guide
              </a>
            </li>
          </ul>
        </Section>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENTS
// ============================================================================

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      {children}
    </section>
  );
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="bg-neutral-900 rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-neutral-800 text-sm text-neutral-400">
        {title}
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code className="text-neutral-300">{code}</code>
      </pre>
    </div>
  );
}

function BenefitCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-neutral-400">{description}</p>
    </div>
  );
}

function Exercise({
  number,
  title,
  description,
  tasks,
}: {
  number: number;
  title: string;
  description: string;
  tasks: string[];
}) {
  const [completed, setCompleted] = useState<boolean[]>(
    new Array(tasks.length).fill(false)
  );

  const toggleTask = (index: number) => {
    setCompleted((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const completedCount = completed.filter(Boolean).length;

  return (
    <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-sm text-neutral-500">Exercise {number}</span>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <span className="text-sm text-neutral-400">
          {completedCount}/{tasks.length}
        </span>
      </div>
      <p className="text-neutral-400 mb-4">{description}</p>
      <ul className="space-y-2">
        {tasks.map((task, index) => (
          <li key={index} className="flex items-center gap-3">
            <button
              onClick={() => toggleTask(index)}
              className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                completed[index]
                  ? "bg-green-500 border-green-500"
                  : "border-neutral-600 hover:border-neutral-400"
              }`}
            >
              {completed[index] && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
            <span
              className={
                completed[index] ? "text-neutral-500 line-through" : ""
              }
            >
              {task}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// INTERACTIVE DEMO
// ============================================================================

function InteractiveDemo() {
  const { flags, toggleFlag, isOverridden } = useFeatureFlags();
  const [selectedFlag, setSelectedFlag] = useState<FeatureFlagKey>("command-palette");

  const flagDef = FEATURE_FLAGS[selectedFlag];

  return (
    <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
      <h3 className="font-semibold mb-4">Try it yourself</h3>

      {/* Flag Selector */}
      <div className="mb-4">
        <label className="block text-sm text-neutral-400 mb-2">
          Select a flag:
        </label>
        <select
          value={selectedFlag}
          onChange={(e) => setSelectedFlag(e.target.value as FeatureFlagKey)}
          className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg"
        >
          {Object.keys(FEATURE_FLAGS)
            .filter((key) => key !== "debug-panel")
            .map((key) => (
              <option key={key} value={key}>
                {FEATURE_FLAGS[key as FeatureFlagKey].name}
              </option>
            ))}
        </select>
      </div>

      {/* Flag Info */}
      <div className="bg-neutral-800 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">{flagDef.name}</span>
          <span
            className={`px-2 py-1 text-xs rounded ${
              flags[selectedFlag]
                ? "bg-green-500/20 text-green-400"
                : "bg-neutral-700 text-neutral-400"
            }`}
          >
            {flags[selectedFlag] ? "Enabled" : "Disabled"}
          </span>
        </div>
        <p className="text-sm text-neutral-400 mb-3">{flagDef.description}</p>
        <div className="flex items-center gap-4 text-xs text-neutral-500">
          <span>Category: {flagDef.category}</span>
          <span>Default: {flagDef.defaultValue ? "on" : "off"}</span>
          {isOverridden(selectedFlag) && (
            <span className="text-blue-400">Overridden</span>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => toggleFlag(selectedFlag)}
        className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
      >
        Toggle {flagDef.name}
      </button>

      {/* Feature Component Demo */}
      <div className="mt-4 p-4 bg-neutral-800 rounded-lg">
        <p className="text-sm text-neutral-400 mb-2">
          Feature component output:
        </p>
        <Feature flag={selectedFlag} fallback={<span className="text-red-400">Feature is disabled</span>}>
          <span className="text-green-400">Feature is enabled!</span>
        </Feature>
      </div>
    </div>
  );
}
