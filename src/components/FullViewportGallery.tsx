"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GalleryConfig } from "../types";

interface FullViewportGalleryProps {
  galleries: GalleryConfig[];
}

export default function FullViewportGallery({ galleries }: FullViewportGalleryProps) {
  return (
    <div className="bg-black">
      {galleries.map((gallery, index) => (
        <FullViewportSection
          key={gallery.id}
          gallery={gallery}
          index={index}
        />
      ))}
    </div>
  );
}

interface FullViewportSectionProps {
  gallery: GalleryConfig;
  index: number;
}

function FullViewportSection({ gallery, index }: FullViewportSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const firstItem = gallery.items[0];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Text slides in from left when section enters viewport
  const textX = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [-100, 0, 0, 100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  if (!firstItem) return null;

  const isVideo = firstItem.type === "video" || firstItem.url?.endsWith(".mp4") || firstItem.url?.endsWith(".webm");
  const isGif = firstItem.type === "gif" || firstItem.url?.endsWith(".gif");

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Full Viewport Media - No animations, static display */}
      <div className="absolute inset-0 w-full h-full">
        {isVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={firstItem.url || firstItem.imageUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={firstItem.url || firstItem.imageUrl}
            alt={firstItem.title || gallery.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Subtle dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Project Info - Slides in from left on scroll */}
      <motion.div
        style={{ x: textX, opacity: textOpacity }}
        className="absolute bottom-0 left-0 z-10 p-8 md:p-16 lg:p-24 max-w-2xl"
      >
        <div className="space-y-4">
          {/* Project Number */}
          <p className="text-white/50 text-sm tracking-[0.3em] uppercase font-light">
            {String(index + 1).padStart(2, "0")}
          </p>

          {/* Project Title */}
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight leading-none">
            {gallery.title}
          </h2>

          {/* Project Description */}
          {gallery.description && (
            <p className="text-white/70 text-base md:text-lg font-light leading-relaxed max-w-md">
              {gallery.description}
            </p>
          )}

          {/* Category/Layout Tag */}
          <p className="text-white/40 text-xs tracking-[0.2em] uppercase font-light pt-4">
            {gallery.layout || "Creative Direction"}
          </p>
        </div>
      </motion.div>

      {/* Scroll Progress Indicator */}
      <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 z-10">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-white/30 text-xs tracking-widest uppercase rotate-90 origin-center whitespace-nowrap">
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}
