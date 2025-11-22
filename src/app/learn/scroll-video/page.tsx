"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";

/**
 * SCROLL-LINKED VIDEO LEARNING MODULE
 *
 * This module teaches how to create videos that scrub based on scroll position,
 * creating cinematic storytelling experiences popular on creative studio sites.
 */

export default function ScrollVideoPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

    if (!video || !container) return;

    // When video metadata loads, store duration
    const handleLoadedMetadata = () => {
      setVideoDuration(video.duration);
      video.pause(); // Ensure video is paused - we control it via scroll
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    // Handle scroll
    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress through the section
      // 0 when top of container hits bottom of viewport
      // 1 when bottom of container hits top of viewport
      const totalScrollDistance = rect.height + windowHeight;
      const scrolled = windowHeight - rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollDistance));

      setScrollProgress(progress);

      // Set video currentTime based on scroll progress
      if (video.duration) {
        video.currentTime = progress * video.duration;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  return (
    <div className="bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 py-6 px-8 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto">
          <Link href="/learn" className="text-neutral-500 hover:text-neutral-900 text-sm mb-4 inline-block">
            ← Back to Learning Lab
          </Link>
          <h1 className="text-4xl font-light text-neutral-900">Scroll-Linked Video</h1>
          <p className="text-neutral-600 mt-2">Videos that scrub based on scroll position</p>
        </div>
      </header>

      {/* Intro Section */}
      <section className="max-w-6xl mx-auto py-20 px-8">
        <h2 className="text-3xl font-light text-neutral-900 mb-6">Scroll Down to See the Effect</h2>
        <p className="text-neutral-600 max-w-2xl">
          The video below is linked to your scroll position. As you scroll through this section,
          the video will scrub forward and backward, creating a cinematic storytelling experience.
        </p>
      </section>

      {/* Scroll Video Section */}
      <div ref={containerRef} className="h-[300vh] relative">
        <div className="sticky top-0 h-screen flex items-center justify-center bg-black">
          {/* Video */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            playsInline
            preload="auto"
          >
            {/* Using a sample video - replace with your own */}
            <source
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          {/* Progress Indicator */}
          <div className="absolute bottom-8 left-8 right-8 bg-white/20 h-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>

          {/* Scroll Progress Display */}
          <div className="absolute top-8 right-8 bg-black/80 text-white px-4 py-2 rounded font-mono text-sm">
            {Math.round(scrollProgress * 100)}% | {(scrollProgress * videoDuration).toFixed(1)}s
          </div>
        </div>
      </div>

      {/* Explanation Section */}
      <section className="max-w-6xl mx-auto py-20 px-8">
        <h2 className="text-2xl font-light text-neutral-900 mb-6">How It Works</h2>

        <div className="space-y-8">
          <div className="bg-white p-6 border border-neutral-200">
            <h3 className="text-lg font-medium text-neutral-900 mb-3">1. Calculate Scroll Progress</h3>
            <p className="text-neutral-600 mb-4">
              Track how far through the scroll section the user has progressed (0 to 1).
            </p>
            <pre className="bg-neutral-900 text-green-400 p-4 text-sm overflow-x-auto">
{`const handleScroll = () => {
  const rect = container.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Calculate total scroll distance for this section
  const totalScrollDistance = rect.height + windowHeight;

  // How much we've scrolled through
  const scrolled = windowHeight - rect.top;

  // Progress from 0 to 1
  const progress = Math.max(0, Math.min(1, scrolled / totalScrollDistance));
};`}
            </pre>
          </div>

          <div className="bg-white p-6 border border-neutral-200">
            <h3 className="text-lg font-medium text-neutral-900 mb-3">2. Map Progress to Video Time</h3>
            <p className="text-neutral-600 mb-4">
              Set the video&apos;s currentTime based on scroll progress.
            </p>
            <pre className="bg-neutral-900 text-green-400 p-4 text-sm overflow-x-auto">
{`// Map scroll progress (0-1) to video duration
video.currentTime = progress * video.duration;

// Example:
// progress = 0.5 (halfway through section)
// video.duration = 10 (10 second video)
// video.currentTime = 5 (play at 5 seconds)`}
            </pre>
          </div>

          <div className="bg-white p-6 border border-neutral-200">
            <h3 className="text-lg font-medium text-neutral-900 mb-3">3. Sticky Positioning</h3>
            <p className="text-neutral-600 mb-4">
              Use a tall container with sticky positioning to keep the video visible while scrolling.
            </p>
            <pre className="bg-neutral-900 text-green-400 p-4 text-sm overflow-x-auto">
{`{/* Tall container for scroll distance */}
<div className="h-[300vh] relative">
  {/* Sticky video stays in viewport */}
  <div className="sticky top-0 h-screen">
    <video ref={videoRef} ... />
  </div>
</div>`}
            </pre>
          </div>

          <div className="bg-white p-6 border border-neutral-200">
            <h3 className="text-lg font-medium text-neutral-900 mb-3">4. Video Optimization Tips</h3>
            <ul className="text-neutral-600 space-y-2">
              <li>• Use <code className="bg-neutral-100 px-1">preload=&quot;auto&quot;</code> to load the full video</li>
              <li>• Keep videos short (5-15 seconds) for smooth scrubbing</li>
              <li>• Compress videos well - they need to load fully before scrubbing works smoothly</li>
              <li>• Consider using video sequences (image frames) for very smooth scrubbing</li>
              <li>• Test on mobile - performance varies significantly</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="max-w-6xl mx-auto py-12 px-8 mb-20">
        <h2 className="text-2xl font-light text-neutral-900 mb-6">When to Use This</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-6 border border-green-200">
            <h3 className="text-lg font-medium text-green-800 mb-3">Great For</h3>
            <ul className="text-green-700 space-y-2">
              <li>• Product reveals and showcases</li>
              <li>• Storytelling landing pages</li>
              <li>• Behind-the-scenes content</li>
              <li>• Process explanations</li>
            </ul>
          </div>
          <div className="bg-red-50 p-6 border border-red-200">
            <h3 className="text-lg font-medium text-red-800 mb-3">Avoid When</h3>
            <ul className="text-red-700 space-y-2">
              <li>• Video is the primary content (let it play normally)</li>
              <li>• Mobile is the primary audience (performance)</li>
              <li>• Video has important audio</li>
              <li>• Users need to control playback</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
