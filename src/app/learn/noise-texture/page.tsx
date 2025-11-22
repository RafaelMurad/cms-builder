"use client";

import { useState } from "react";
import NoiseOverlay from "../../../components/learn/NoiseOverlay";
import Link from "next/link";

export default function NoiseTexturePage() {
  const [opacity, setOpacity] = useState(0.05);
  const [baseFrequency, setBaseFrequency] = useState(0.65);
  const [blendMode, setBlendMode] = useState<"overlay" | "multiply" | "screen" | "soft-light">("overlay");
  const [showNoise, setShowNoise] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 to-neutral-200 relative">
      {/* Noise Overlay - Toggleable */}
      {showNoise && (
        <NoiseOverlay
          opacity={opacity}
          baseFrequency={baseFrequency}
          blendMode={blendMode}
          position="fixed"
        />
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-neutral-200 py-6 px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Link href="/learn" className="text-neutral-500 hover:text-neutral-900 text-sm mb-4 inline-block">
            ← Back to Learning Lab
          </Link>
          <h1 className="text-4xl font-light text-neutral-900">Noise & Grain Textures</h1>
          <p className="text-neutral-600 mt-2">Add subtle film grain for a luxury, editorial aesthetic</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-12 px-8 relative z-10">
        {/* Demo Area */}
        <section className="mb-16">
          <h2 className="text-2xl font-light text-neutral-900 mb-6">Interactive Demo</h2>
          <p className="text-neutral-600 mb-8">
            This entire page has a noise overlay applied. Adjust the controls below to see how different settings affect the texture.
          </p>

          {/* Sample Content to Show Noise Effect */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-8 shadow-lg">
              <h3 className="text-xl font-light mb-4">White Background</h3>
              <p className="text-neutral-600">
                Notice how the noise adds subtle texture to flat white areas, making them feel more organic and less digital.
              </p>
            </div>
            <div className="bg-black p-8 shadow-lg">
              <h3 className="text-xl font-light text-white mb-4">Dark Background</h3>
              <p className="text-neutral-400">
                On dark backgrounds, the noise creates a cinematic, film-like quality that&apos;s popular with luxury brands.
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white/90 backdrop-blur p-6 border border-neutral-200 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Show Noise
              </label>
              <button
                onClick={() => setShowNoise(!showNoise)}
                className={`px-4 py-2 text-sm w-full ${showNoise ? "bg-black text-white" : "bg-white text-black border border-black"}`}
              >
                {showNoise ? "On" : "Off"}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Opacity: {opacity.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.01"
                max="0.2"
                step="0.01"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Grain Size: {baseFrequency.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.3"
                max="1.5"
                step="0.05"
                value={baseFrequency}
                onChange={(e) => setBaseFrequency(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Blend Mode</label>
              <select
                value={blendMode}
                onChange={(e) => setBlendMode(e.target.value as any)}
                className="w-full px-3 py-2 border border-neutral-300"
              >
                <option value="overlay">Overlay</option>
                <option value="multiply">Multiply</option>
                <option value="screen">Screen</option>
                <option value="soft-light">Soft Light</option>
              </select>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-2xl font-light text-neutral-900 mb-6">How It Works</h2>

          <div className="space-y-8">
            <div className="bg-white/90 backdrop-blur p-6 border border-neutral-200">
              <h3 className="text-lg font-medium text-neutral-900 mb-3">SVG feTurbulence Filter</h3>
              <p className="text-neutral-600 mb-4">
                We use SVG&apos;s built-in turbulence generator to create organic noise patterns.
              </p>
              <pre className="bg-neutral-900 text-green-400 p-4 text-sm overflow-x-auto">
{`<svg>
  <filter id="noise-filter">
    <!-- Generate fractal noise pattern -->
    <feTurbulence
      type="fractalNoise"
      baseFrequency="0.65"  <!-- Grain size -->
      numOctaves="4"        <!-- Detail levels -->
      stitchTiles="stitch"  <!-- Seamless tiling -->
    />
    <!-- Convert to grayscale -->
    <feColorMatrix type="saturate" values="0" />
  </filter>
</svg>`}
              </pre>
            </div>

            <div className="bg-white/90 backdrop-blur p-6 border border-neutral-200">
              <h3 className="text-lg font-medium text-neutral-900 mb-3">Overlay Layer</h3>
              <p className="text-neutral-600 mb-4">
                A full-screen div applies the filter and blends it with your content.
              </p>
              <pre className="bg-neutral-900 text-green-400 p-4 text-sm overflow-x-auto">
{`<div
  style={{
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',  // Click through
    opacity: 0.05,          // Very subtle!
    mixBlendMode: 'overlay', // How it blends
    filter: 'url(#noise-filter)',
  }}
/>`}
              </pre>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section>
          <h2 className="text-2xl font-light text-neutral-900 mb-6">Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/90 backdrop-blur p-6 border border-neutral-200">
              <h3 className="text-lg font-medium text-neutral-900 mb-3">Do</h3>
              <ul className="text-neutral-600 space-y-2">
                <li>✓ Keep opacity very low (0.03-0.08)</li>
                <li>✓ Use overlay or soft-light blend modes</li>
                <li>✓ Hide for users who prefer reduced motion</li>
                <li>✓ Test on different backgrounds</li>
              </ul>
            </div>
            <div className="bg-white/90 backdrop-blur p-6 border border-neutral-200">
              <h3 className="text-lg font-medium text-neutral-900 mb-3">Don&apos;t</h3>
              <ul className="text-neutral-600 space-y-2">
                <li>✗ Make the noise too visible/distracting</li>
                <li>✗ Animate at high frame rates (performance)</li>
                <li>✗ Apply to text-heavy interfaces</li>
                <li>✗ Use on mobile without testing</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
