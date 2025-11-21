"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GalleryConfig } from "../types";

interface FullViewportGalleryProps {
  galleries: GalleryConfig[];
}

export default function FullViewportGallery({ galleries }: FullViewportGalleryProps) {
  return (
    <div
      className="bg-black snap-y snap-mandatory"
      style={{
        scrollSnapType: "y mandatory",
      }}
    >
      {galleries.map((gallery, index) => (
        <FullViewportSection
          key={gallery.id}
          gallery={gallery}
          index={index}
          total={galleries.length}
        />
      ))}
    </div>
  );
}

interface FullViewportSectionProps {
  gallery: GalleryConfig;
  index: number;
  total: number;
}

function FullViewportSection({ gallery, index, total }: FullViewportSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const firstItem = gallery.items[0];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Text animation: slides in from left, centered when section is in view
  // 0 = section entering from bottom, 0.5 = section centered, 1 = section leaving top
  const textX = useTransform(
    scrollYProgress,
    [0, 0.35, 0.5, 0.65, 1],
    [-80, -20, 0, -20, -80]
  );
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.5, 0.65, 1],
    [0, 0.8, 1, 0.8, 0]
  );

  if (!firstItem) return null;

  const isVideo = firstItem.type === "video" || firstItem.url?.endsWith(".mp4") || firstItem.url?.endsWith(".webm");

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden snap-center"
      style={{
        scrollSnapAlign: "center",
        scrollSnapStop: "always",
      }}
    >
      {/* Full Viewport Media - Static, no animations */}
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

        {/* Subtle gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
      </div>

      {/* Project Info - Slides in from left, synced with scroll */}
      <div className="absolute inset-0 flex items-end">
        <motion.div
          style={{ x: textX, opacity: textOpacity }}
          className="p-8 md:p-12 lg:p-16 pb-16 md:pb-20 lg:pb-24"
        >
          <div className="space-y-3">
            {/* Project Number */}
            <p className="text-white/40 text-xs tracking-[0.3em] uppercase font-light">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>

            {/* Project Title */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-white tracking-tight leading-tight">
              {gallery.title}
            </h2>

            {/* Project Description */}
            {gallery.description && (
              <p className="text-white/60 text-sm md:text-base font-light leading-relaxed max-w-md pt-2">
                {gallery.description}
              </p>
            )}

            {/* Category Tag */}
            <div className="pt-4">
              <span className="text-white/30 text-[10px] tracking-[0.2em] uppercase font-light border-b border-white/20 pb-1">
                {gallery.layout || "Creative Direction"}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
