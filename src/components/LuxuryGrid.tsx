"use client";

import { useState, useEffect, useRef } from "react";
import MediaItem from "./MediaItem";
import { GalleryConfig } from "../types";

interface LuxuryGridProps {
  galleries: GalleryConfig[];
}

export default function LuxuryGrid({ galleries }: LuxuryGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = itemRefs.current.map((item, index) => {
      if (!item) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.classList.add("visible");
              }, index * 100); // Stagger the animations
            }
          });
        },
        { threshold: 0.2 }
      );

      observer.observe(item);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [galleries]);

  return (
    <section className="min-h-screen py-32 px-8 md:px-12 lg:px-16 bg-white">
      <div className="max-w-screen-2xl mx-auto">
        {/* Section Header */}
        <div className="mb-24 text-center">
          <div className="luxury-divider mb-8" />
          <h2 className="text-5xl md:text-7xl font-times font-light tracking-tight text-luxury-black mb-6">
            Selected Works
          </h2>
          <p className="text-luxury-gray text-sm tracking-wide font-light max-w-xl mx-auto">
            A curated collection of our recent creative collaborations
          </p>
        </div>

        {/* Clean Grid with Scroll Reveals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {galleries.map((gallery, index) => {
            const firstItem = gallery.items[0];
            if (!firstItem) return null;

            return (
              <div
                key={gallery.id}
                ref={(el) => { itemRefs.current[index] = el; }}
                className="gallery-item-reveal group relative aspect-[3/4] overflow-hidden cursor-pointer hover-glow"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Media */}
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-102">
                  <MediaItem
                    item={firstItem}
                    className="w-full h-full"
                    isActive={true}
                  />
                </div>

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 via-luxury-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Info */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <div className="text-white">
                    <p className="text-[10px] tracking-luxury uppercase font-light mb-2 opacity-70">
                      {gallery.layout}
                    </p>
                    <h3 className="text-2xl font-times font-light tracking-tight">
                      {gallery.title}
                    </h3>
                  </div>
                </div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-luxury-gold/5 via-transparent to-transparent" />
                </div>
              </div>
            );
          })}
        </div>

        {/* View More with subtle animation */}
        <div className="mt-24 text-center">
          <div className="luxury-divider mb-8" />
          <a
            href="#all-work"
            className="inline-block relative group"
          >
            <span className="text-luxury-black hover:text-luxury-gray transition-colors duration-500 text-xs tracking-luxury uppercase font-light luxury-underline">
              View All Projects
            </span>
            <span className="absolute inset-0 blur-xl bg-luxury-gold opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
          </a>
        </div>
      </div>
    </section>
  );
}
