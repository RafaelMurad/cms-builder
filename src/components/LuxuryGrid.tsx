"use client";

import { useState } from "react";
import MediaItem from "./MediaItem";
import { GalleryConfig } from "../types";

interface LuxuryGridProps {
  galleries: GalleryConfig[];
}

export default function LuxuryGrid({ galleries }: LuxuryGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="min-h-screen py-32 px-8 md:px-12 lg:px-16 bg-white">
      <div className="max-w-screen-2xl mx-auto">
        {/* Section Header */}
        <div className="mb-24 text-center">
          <div className="luxury-divider mb-8" />
          <h2 className="text-4xl md:text-6xl font-times font-light tracking-tight text-luxury-black mb-6">
            Selected Works
          </h2>
          <p className="text-luxury-gray text-sm tracking-wide font-light max-w-xl mx-auto">
            A curated collection of our recent creative collaborations
          </p>
        </div>

        {/* Clean Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {galleries.map((gallery, index) => {
            const firstItem = gallery.items[0];
            if (!firstItem) return null;

            return (
              <div
                key={gallery.id}
                className="group relative aspect-[3/4] overflow-hidden image-overlay cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Media */}
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                  <MediaItem
                    item={firstItem}
                    className="w-full h-full"
                    isActive={true}
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-500" />

                {/* Info */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="text-white">
                    <p className="text-[10px] tracking-luxury uppercase font-light mb-2">
                      {gallery.layout}
                    </p>
                    <h3 className="text-2xl font-light tracking-tight">
                      {gallery.title}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
