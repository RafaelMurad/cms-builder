"use client";

import { useState, useEffect, useRef } from "react";
import MediaItem from "./MediaItem";
import { GalleryConfig } from "../types";

interface LuxuryGridProps {
  galleries: GalleryConfig[];
}

export default function LuxuryGrid({ galleries }: LuxuryGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));
        setScrollY(scrollProgress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observers = itemRefs.current.map((item, index) => {
      if (!item) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.classList.add("visible");
              }, index * 80); // Faster stagger for smoother feel
            }
          });
        },
        { threshold: 0.15 }
      );

      observer.observe(item);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [galleries]);

  return (
    <section ref={sectionRef} className="min-h-screen py-32 px-8 md:px-12 lg:px-16 bg-white">
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

        {/* Parallax Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {galleries.map((gallery, index) => {
            const firstItem = gallery.items[0];
            if (!firstItem) return null;

            // Different parallax speeds for each item
            const parallaxSpeed = 0.5 + (index % 3) * 0.2;
            const parallaxY = scrollY * 30 * parallaxSpeed * (index % 2 === 0 ? 1 : -1);

            return (
              <div
                key={gallery.id}
                ref={(el) => { itemRefs.current[index] = el; }}
                className="gallery-item-reveal group relative aspect-[3/4] overflow-hidden cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  transform: `translateY(${parallaxY}px)`,
                  transition: 'transform 0.1s linear',
                }}
              >
                {/* Media with smooth scale */}
                <div className="absolute inset-0 transition-all duration-[800ms] ease-out group-hover:scale-105">
                  <MediaItem
                    item={firstItem}
                    className="w-full h-full"
                    isActive={true}
                  />
                </div>

                {/* Morphing overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/70 via-luxury-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />

                {/* Info with smooth morph */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-6 group-hover:translate-y-0">
                  <div className="text-white transform transition-transform duration-700 group-hover:scale-105">
                    <p className="text-[10px] tracking-luxury uppercase font-light mb-2 opacity-70">
                      {gallery.layout}
                    </p>
                    <h3 className="text-2xl font-times font-light tracking-tight">
                      {gallery.title}
                    </h3>
                  </div>
                </div>

                {/* Edge glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 border border-luxury-gold/20" />
                </div>
              </div>
            );
          })}
        </div>

        {/* View More */}
        <div className="mt-24 text-center">
          <div className="luxury-divider mb-8" />
          <a
            href="#all-work"
            className="inline-block text-luxury-black hover:text-luxury-gray transition-all duration-500 text-xs tracking-luxury uppercase font-light luxury-underline hover:tracking-wide"
          >
            View All Projects
          </a>
        </div>
      </div>
    </section>
  );
}
