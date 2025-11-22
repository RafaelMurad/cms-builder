"use client";

import { useState } from "react";
import MediaItem from "./MediaItem";
import { GalleryConfig } from "../types";

interface BentoGridProps {
  galleries: GalleryConfig[];
}

export default function BentoGrid({ galleries }: BentoGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Bento grid pattern - varying sizes for visual interest
  const gridPatterns = [
    "md:col-span-2 md:row-span-2", // Large square
    "md:col-span-1 md:row-span-1", // Small
    "md:col-span-1 md:row-span-2", // Tall
    "md:col-span-2 md:row-span-1", // Wide
    "md:col-span-1 md:row-span-1", // Small
    "md:col-span-1 md:row-span-1", // Small
  ];

  return (
    <section className="min-h-screen py-24 px-6 md:px-12 lg:px-16 scroll-section">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Featured Work</span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Explore our portfolio of immersive digital experiences
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[300px]">
          {galleries.map((gallery, index) => {
            const pattern = gridPatterns[index % gridPatterns.length];
            const isHovered = hoveredIndex === index;
            const firstItem = gallery.items[0];

            if (!firstItem) return null;

            return (
              <div
                key={gallery.id}
                className={`group relative overflow-hidden rounded-2xl ${pattern} tilt-3d`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width;
                  const y = (e.clientY - rect.top) / rect.height;
                  const rotateY = (x - 0.5) * 10;
                  const rotateX = (0.5 - y) * 10;
                  e.currentTarget.style.setProperty("--rotate-x", `${rotateX}deg`);
                  e.currentTarget.style.setProperty("--rotate-y", `${rotateY}deg`);
                }}
              >
                {/* Media Background */}
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                  <MediaItem
                    item={firstItem}
                    className="w-full h-full"
                    isActive={true}
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-200 via-dark-200/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-fire opacity-0 group-hover:opacity-20 transition-opacity duration-500 mix-blend-overlay" />

                {/* Content */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                  <div className={`transform transition-all duration-500 ${
                    isHovered ? "translate-y-0" : "translate-y-4"
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-12 h-px bg-accent-purple" />
                      <span className="text-accent-purple text-sm tracking-widest uppercase font-semibold">
                        {gallery.layout}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {gallery.title}
                    </h3>
                    <p className={`text-white/70 text-sm md:text-base transition-all duration-500 ${
                      isHovered ? "opacity-100 max-h-20" : "opacity-0 max-h-0"
                    } overflow-hidden`}>
                      {gallery.description || `${gallery.items.length} items`}
                    </p>
                  </div>

                  {/* View button */}
                  <div className={`mt-4 transform transition-all duration-500 ${
                    isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}>
                    <button className="px-6 py-3 glass-effect text-white text-sm tracking-widest uppercase font-semibold hover:glass-dark transition-all duration-300 magnetic">
                      View Project
                    </button>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-fire opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500" />
              </div>
            );
          })}
        </div>

        {/* View all CTA */}
        <div className="mt-16 text-center">
          <a
            href="#all-work"
            className="inline-block px-10 py-5 border-2 border-accent-purple text-white hover:bg-accent-purple/10 transition-all duration-300 text-sm tracking-widest uppercase font-semibold magnetic group relative overflow-hidden"
          >
            <span className="relative z-10">View All Work</span>
            <div className="absolute inset-0 bg-gradient-fire opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
          </a>
        </div>
      </div>
    </section>
  );
}
