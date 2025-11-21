"use client";

import { motion } from "framer-motion";
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
  const firstItem = gallery.items[0];

  if (!firstItem) return null;

  const isVideo = firstItem.type === "video" || firstItem.url?.endsWith(".mp4") || firstItem.url?.endsWith(".webm");

  return (
    <section className="relative h-screen w-full overflow-hidden snap-start">
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

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      </div>

      {/* Project Info - Slides in when section enters view, then STAYS */}
      <div className="absolute inset-0 flex items-end">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="p-8 md:p-12 lg:p-16 pb-20 md:pb-24 lg:pb-28"
        >
          <div className="space-y-4">
            {/* Project Number */}
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-white/50 text-xs tracking-[0.3em] uppercase font-light"
            >
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </motion.p>

            {/* Project Title */}
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight leading-none"
            >
              {gallery.title}
            </motion.h2>

            {/* Project Description */}
            {gallery.description && (
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                className="text-white/60 text-sm md:text-base font-light leading-relaxed max-w-lg pt-2"
              >
                {gallery.description}
              </motion.p>
            )}

            {/* Category Tag */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="pt-4"
            >
              <span className="text-white/40 text-[10px] tracking-[0.2em] uppercase font-light border-b border-white/30 pb-1">
                {gallery.layout || "Creative Direction"}
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
