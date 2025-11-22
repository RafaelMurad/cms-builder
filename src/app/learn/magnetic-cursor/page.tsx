"use client";

import { useState } from "react";
import MagneticButton from "../../../components/learn/MagneticButton";
import Link from "next/link";

/**
 * MAGNETIC CURSOR LEARNING PAGE
 *
 * This page teaches the magnetic cursor effect through:
 * 1. Interactive playground with adjustable parameters
 * 2. Live code preview
 * 3. Step-by-step explanation
 */

export default function MagneticCursorPage() {
  // Playground state for interactive controls
  const [strength, setStrength] = useState(0.3);
  const [radius, setRadius] = useState(100);
  const [moveContent, setMoveContent] = useState(true);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 py-6 px-8">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/learn"
            className="text-neutral-500 hover:text-neutral-900 text-sm mb-4 inline-block"
          >
            ← Back to Learning Lab
          </Link>
          <h1 className="text-4xl font-light text-neutral-900">
            Magnetic Cursor Effects
          </h1>
          <p className="text-neutral-600 mt-2">
            Create buttons that attract the cursor for a playful, premium feel
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-12 px-8">
        {/* Interactive Playground */}
        <section className="mb-16">
          <h2 className="text-2xl font-light text-neutral-900 mb-6">
            Interactive Playground
          </h2>
          <p className="text-neutral-600 mb-8">
            Hover over the buttons below and adjust the controls to see how
            different settings affect the magnetic effect.
          </p>

          <div className="bg-white p-12 border border-neutral-200 mb-8">
            <div className="flex flex-wrap gap-8 justify-center items-center min-h-[200px]">
              <MagneticButton
                strength={strength}
                radius={radius}
                moveContent={moveContent}
                className="px-8 py-4 bg-black text-white text-sm tracking-wider uppercase hover:bg-neutral-800"
              >
                Magnetic Button
              </MagneticButton>

              <MagneticButton
                strength={strength}
                radius={radius}
                moveContent={moveContent}
                className="px-8 py-4 border-2 border-black text-black text-sm tracking-wider uppercase hover:bg-black hover:text-white transition-colors"
              >
                Outlined Style
              </MagneticButton>

              <MagneticButton
                strength={strength}
                radius={radius}
                moveContent={moveContent}
                className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center"
              >
                <span className="text-2xl">→</span>
              </MagneticButton>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-neutral-100 p-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Strength: {strength.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={strength}
                onChange={(e) => setStrength(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-neutral-500 mt-1">
                How far the button moves toward cursor
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Radius: {radius}px
              </label>
              <input
                type="range"
                min="50"
                max="200"
                step="10"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-neutral-500 mt-1">
                Distance at which effect activates
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Move Content
              </label>
              <button
                onClick={() => setMoveContent(!moveContent)}
                className={`px-4 py-2 text-sm ${
                  moveContent
                    ? "bg-black text-white"
                    : "bg-white text-black border border-black"
                }`}
              >
                {moveContent ? "Enabled" : "Disabled"}
              </button>
              <p className="text-xs text-neutral-500 mt-1">
                Inner content moves more than container
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-2xl font-light text-neutral-900 mb-6">
            How It Works
          </h2>

          <div className="space-y-8">
            <div className="bg-white p-6 border border-neutral-200">
              <h3 className="text-lg font-medium text-neutral-900 mb-3">
                Step 1: Track Mouse Position
              </h3>
              <p className="text-neutral-600 mb-4">
                We use the <code className="bg-neutral-100 px-1">onMouseMove</code> event to
                track the cursor position relative to the button.
              </p>
              <pre className="bg-neutral-900 text-green-400 p-4 text-sm overflow-x-auto">
{`const handleMouseMove = (e: MouseEvent) => {
  const rect = buttonRef.current.getBoundingClientRect();

  // Calculate button center
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Calculate offset from center
  const deltaX = e.clientX - centerX;
  const deltaY = e.clientY - centerY;
};`}
              </pre>
            </div>

            <div className="bg-white p-6 border border-neutral-200">
              <h3 className="text-lg font-medium text-neutral-900 mb-3">
                Step 2: Calculate Movement
              </h3>
              <p className="text-neutral-600 mb-4">
                We apply a strength multiplier to the offset to determine how
                far the button should move.
              </p>
              <pre className="bg-neutral-900 text-green-400 p-4 text-sm overflow-x-auto">
{`// Strength controls how much the button moves
const strength = 0.3; // 0 to 1

// Calculate movement (30% of the way toward cursor)
const moveX = deltaX * strength;
const moveY = deltaY * strength;

// Apply via CSS transform
style={{ transform: \`translate(\${moveX}px, \${moveY}px)\` }}`}
              </pre>
            </div>

            <div className="bg-white p-6 border border-neutral-200">
              <h3 className="text-lg font-medium text-neutral-900 mb-3">
                Step 3: Smooth Transitions
              </h3>
              <p className="text-neutral-600 mb-4">
                CSS transitions make the movement feel organic rather than
                snapping to positions.
              </p>
              <pre className="bg-neutral-900 text-green-400 p-4 text-sm overflow-x-auto">
{`/* CSS for smooth animation */
.magnetic-button {
  transition: transform 300ms ease-out;
}

/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  .magnetic-button {
    transition: none;
  }
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="mb-16">
          <h2 className="text-2xl font-light text-neutral-900 mb-6">
            When to Use This Effect
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 border border-green-200">
              <h3 className="text-lg font-medium text-green-800 mb-3">
                ✓ Good Use Cases
              </h3>
              <ul className="text-green-700 space-y-2">
                <li>• Primary call-to-action buttons</li>
                <li>• Navigation links on creative portfolios</li>
                <li>• Interactive icons</li>
                <li>• Hero section buttons</li>
                <li>• &quot;View Project&quot; links</li>
              </ul>
            </div>

            <div className="bg-red-50 p-6 border border-red-200">
              <h3 className="text-lg font-medium text-red-800 mb-3">
                ✗ Avoid When
              </h3>
              <ul className="text-red-700 space-y-2">
                <li>• Form submit buttons (can feel unprofessional)</li>
                <li>• Dense UI with many buttons</li>
                <li>• E-commerce checkout flows</li>
                <li>• Mobile-only interfaces (no hover)</li>
                <li>• Accessibility-critical interfaces</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Full Code */}
        <section>
          <h2 className="text-2xl font-light text-neutral-900 mb-6">
            Complete Component Code
          </h2>
          <p className="text-neutral-600 mb-4">
            Copy this component to use in your own projects. The full source
            code is available at{" "}
            <code className="bg-neutral-100 px-1">
              src/components/learn/MagneticButton.tsx
            </code>
          </p>
          <div className="bg-neutral-900 text-neutral-100 p-4 text-sm">
            <p className="text-neutral-400">
              See the full implementation with detailed comments in the source
              file. Key features include:
            </p>
            <ul className="text-neutral-300 mt-2 space-y-1">
              <li>• Adjustable strength and radius</li>
              <li>• Optional content movement for layered effect</li>
              <li>• Motion reduction support</li>
              <li>• TypeScript types</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
