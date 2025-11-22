"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/**
 * PAGE TRANSITIONS LEARNING MODULE
 *
 * This module teaches how to create smooth page transitions using
 * Framer Motion's AnimatePresence component.
 */

// Sample "pages" for the demo
const demoPages = [
  { id: "home", title: "Home", color: "bg-blue-500" },
  { id: "about", title: "About", color: "bg-green-500" },
  { id: "work", title: "Work", color: "bg-purple-500" },
  { id: "contact", title: "Contact", color: "bg-orange-500" },
];

// Different transition variants to demonstrate
const transitionVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 },
  },
  reveal: {
    initial: { clipPath: "inset(0 0 100% 0)" },
    animate: { clipPath: "inset(0 0 0% 0)" },
    exit: { clipPath: "inset(100% 0 0 0)" },
  },
};

export default function PageTransitionsPage() {
  const [currentPage, setCurrentPage] = useState("home");
  const [transitionType, setTransitionType] = useState<keyof typeof transitionVariants>("fade");
  const [duration, setDuration] = useState(0.5);

  const currentPageData = demoPages.find((p) => p.id === currentPage);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 py-6 px-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/learn" className="text-neutral-500 hover:text-neutral-900 text-sm mb-4 inline-block">
            ← Back to Learning Lab
          </Link>
          <h1 className="text-4xl font-light text-neutral-900">Page Transitions</h1>
          <p className="text-neutral-600 mt-2">Create smooth transitions between pages with Framer Motion</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-12 px-8">
        {/* Interactive Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-light text-neutral-900 mb-6">Interactive Demo</h2>

          {/* Navigation */}
          <div className="flex gap-2 mb-4">
            {demoPages.map((page) => (
              <button
                key={page.id}
                onClick={() => setCurrentPage(page.id)}
                className={`px-4 py-2 text-sm transition-colors ${
                  currentPage === page.id
                    ? "bg-black text-white"
                    : "bg-white text-black border border-neutral-200 hover:border-black"
                }`}
              >
                {page.title}
              </button>
            ))}
          </div>

          {/* Demo Area */}
          <div className="bg-neutral-200 h-80 relative overflow-hidden mb-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={transitionVariants[transitionType].initial}
                animate={transitionVariants[transitionType].animate}
                exit={transitionVariants[transitionType].exit}
                transition={{ duration, ease: "easeInOut" }}
                className={`absolute inset-0 ${currentPageData?.color} flex items-center justify-center`}
              >
                <h3 className="text-4xl font-light text-white">{currentPageData?.title}</h3>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="bg-white p-6 border border-neutral-200 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Transition Type</label>
              <select
                value={transitionType}
                onChange={(e) => setTransitionType(e.target.value as keyof typeof transitionVariants)}
                className="w-full px-3 py-2 border border-neutral-300"
              >
                <option value="fade">Fade</option>
                <option value="slideUp">Slide Up</option>
                <option value="slideLeft">Slide Left</option>
                <option value="scale">Scale</option>
                <option value="reveal">Reveal (Clip Path)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Duration: {duration.toFixed(1)}s
              </label>
              <input
                type="range"
                min="0.2"
                max="1.5"
                step="0.1"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </section>

        {/* Code Explanation */}
        <section className="mb-16">
          <h2 className="text-2xl font-light text-neutral-900 mb-6">How It Works</h2>

          <div className="space-y-8">
            <div className="bg-white p-6 border border-neutral-200">
              <h3 className="text-lg font-medium text-neutral-900 mb-3">1. AnimatePresence Wrapper</h3>
              <p className="text-neutral-600 mb-4">
                AnimatePresence tracks when children are added/removed and animates them.
                The <code className="bg-neutral-100 px-1">mode=&quot;wait&quot;</code> ensures exit animation
                completes before enter animation starts.
              </p>
              <pre className="bg-neutral-900 text-green-400 p-4 text-sm overflow-x-auto">
{`import { AnimatePresence, motion } from "framer-motion";

<AnimatePresence mode="wait">
  {/* Key must change when page changes */}
  <motion.div key={currentPage}>
    {/* Page content */}
  </motion.div>
</AnimatePresence>`}
              </pre>
            </div>

            <div className="bg-white p-6 border border-neutral-200">
              <h3 className="text-lg font-medium text-neutral-900 mb-3">2. Animation Variants</h3>
              <p className="text-neutral-600 mb-4">
                Define initial, animate, and exit states. Framer Motion interpolates between them.
              </p>
              <pre className="bg-neutral-900 text-green-400 p-4 text-sm overflow-x-auto">
{`const variants = {
  initial: { opacity: 0, y: 50 },   // Starting state
  animate: { opacity: 1, y: 0 },     // Active state
  exit: { opacity: 0, y: -50 },      // Leaving state
};

<motion.div
  initial="initial"
  animate="animate"
  exit="exit"
  variants={variants}
  transition={{ duration: 0.5 }}
/>`}
              </pre>
            </div>

            <div className="bg-white p-6 border border-neutral-200">
              <h3 className="text-lg font-medium text-neutral-900 mb-3">3. Next.js Integration</h3>
              <p className="text-neutral-600 mb-4">
                In Next.js App Router, wrap your page content in a client component with AnimatePresence.
              </p>
              <pre className="bg-neutral-900 text-green-400 p-4 text-sm overflow-x-auto">
{`// app/template.tsx - Wraps all pages
"use client";

export default function Template({ children }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={usePathname()} // Key changes on route change
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Transition Types Showcase */}
        <section>
          <h2 className="text-2xl font-light text-neutral-900 mb-6">Popular Transition Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(transitionVariants).map(([name, variant]) => (
              <div key={name} className="bg-white p-6 border border-neutral-200">
                <h3 className="text-lg font-medium text-neutral-900 mb-2 capitalize">{name}</h3>
                <pre className="text-xs text-neutral-600 bg-neutral-100 p-2 overflow-auto">
                  {JSON.stringify(variant, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
