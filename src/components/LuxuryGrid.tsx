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
  const sectionRef = useRef<HTMLElement>(null);

  // Fluid grid reveal with elastic timing
  useEffect(() => {
    const observers = itemRefs.current.map((item, index) => {
      if (!item) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Staggered elastic reveal
              setTimeout(() => {
                entry.target.classList.add("visible");
              }, index * 60); // Wave-like stagger
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(item);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [galleries]);

  // Ripple effect calculation for neighboring items
  const getRippleScale = (index: number) => {
    if (hoveredIndex === null) return 1;

    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return 1.02; // Hovered item
    if (distance === 1) return 1.01; // Adjacent items
    return 1; // Others
  };

  return (
    <section ref={sectionRef} className="min-h-screen py-32 px-8 md:px-12 lg:px-16 bg-white">
      <div className="max-w-screen-2xl mx-auto">
        {/* Section Header */}
        <div className="mb-24 text-center">
          <div className="luxury-divider mb-8 animate-expand" />
          <h2 className="text-5xl md:text-7xl font-times font-light tracking-tight text-luxury-black mb-6 animate-fade-in">
            Selected Works
          </h2>
          <p className="text-luxury-gray text-sm tracking-wide font-light max-w-xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "forwards", opacity: 0 }}>
            A curated collection of our recent creative collaborations
          </p>
        </div>

        {/* Fluid Grid with ripple interactions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {galleries.map((gallery, index) => {
            const firstItem = gallery.items[0];
            if (!firstItem) return null;

            const rippleScale = getRippleScale(index);

            return (
              <div
                key={gallery.id}
                ref={(el) => { itemRefs.current[index] = el; }}
                className="gallery-item-fluid group relative aspect-[3/4] overflow-hidden cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  transform: `scale(${rippleScale})`,
                  transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                {/* Media with liquid scale */}
                <div className="absolute inset-0 transition-all duration-[900ms] cubic-bezier(0.34, 1.56, 0.64, 1) group-hover:scale-110">
                  <MediaItem
                    item={firstItem}
                    className="w-full h-full"
                    isActive={true}
                  />
                </div>

                {/* Liquid gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-luxury-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-[900ms] cubic-bezier(0.23, 1, 0.32, 1)" />

                {/* Info with elastic reveal */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-[900ms] cubic-bezier(0.34, 1.56, 0.64, 1) transform translate-y-8 group-hover:translate-y-0">
                  <div className="text-white transform transition-all duration-[900ms] cubic-bezier(0.34, 1.56, 0.64, 1)">
                    <p className="text-[10px] tracking-luxury uppercase font-light mb-2 opacity-70 kinetic-text">
                      {gallery.layout}
                    </p>
                    <h3 className="text-2xl font-times font-light tracking-tight">
                      {gallery.title.split(" ").map((word, i) => (
                        <span
                          key={i}
                          className="inline-block mr-2 transform transition-all duration-700"
                          style={{
                            transitionDelay: `${i * 50}ms`,
                          }}
                        >
                          {word}
                        </span>
                      ))}
                    </h3>
                  </div>
                </div>

                {/* Subtle border with fluid expand */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-[900ms] cubic-bezier(0.23, 1, 0.32, 1)">
                  <div className="absolute inset-0 border border-luxury-gold/30" />
                </div>
              </div>
            );
          })}
        </div>

        {/* View More with kinetic reveal */}
        <div className="mt-24 text-center">
          <div className="luxury-divider mb-8" />
          <a
            href="#all-work"
            className="inline-block text-luxury-black hover:text-luxury-gray transition-all duration-700 text-xs tracking-luxury uppercase font-light luxury-underline hover:tracking-wide group"
          >
            <span className="inline-block transition-transform duration-700 group-hover:translate-x-1">View All Projects</span>
          </a>
        </div>
      </div>
    </section>
  );
}
