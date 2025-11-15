"use client";

import { useState, useEffect } from "react";

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parallaxOffset = scrollY * 0.5;
  const opacity = Math.max(1 - scrollY / 600, 0);
  const scale = Math.max(1 - scrollY / 2000, 0.95);

  return (
    <section className="min-h-screen flex items-center justify-center relative bg-white pt-32 pb-24 px-8 md:px-12 lg:px-16 overflow-hidden">
      {/* Parallax background layers */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
          opacity: opacity * 0.3,
        }}
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-luxury-gold/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-luxury-gray/5 blur-3xl" />
      </div>

      <div
        className="max-w-screen-xl mx-auto text-center relative z-20"
        style={{
          transform: `translateY(${parallaxOffset * 0.3}px) scale(${scale})`,
          opacity,
        }}
      >
        <div className="space-y-20 animate-fade-in-slow">
          {/* Overline */}
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
            <p className="text-luxury-gray text-xs tracking-luxury uppercase font-light">
              Creative Direction + Design
            </p>
          </div>

          {/* Main heading */}
          <div className="font-times">
            <div className="opacity-0 animate-slide-up" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
              <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-light tracking-tighter leading-none text-luxury-black mb-6 transition-all duration-700 hover:tracking-tight">
                STUDIO
              </h1>
            </div>
            <div className="opacity-0 animate-slide-up" style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}>
              <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-light tracking-tighter leading-none text-luxury-black transition-all duration-700 hover:tracking-tight">
                HAUS
              </h1>
            </div>
          </div>

          {/* Divider */}
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}>
            <div className="relative overflow-hidden h-px">
              <div className="luxury-divider" />
              <div className="absolute left-1/2 top-0 -translate-x-1/2 w-0 h-px bg-luxury-gold animate-expand-full" style={{ animationDelay: "1.2s" }} />
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-luxury-gray text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-light tracking-wide opacity-0 animate-fade-in" style={{ animationDelay: "1.1s", animationFillMode: "forwards" }}>
            Crafting timeless visual narratives for the world&apos;s most
            <br />
            discerning brands. Where elegance meets innovation.
          </p>

          {/* CTA */}
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: "1.4s", animationFillMode: "forwards" }}>
            <a
              href="#work"
              className="inline-block text-luxury-black hover:text-luxury-gray transition-all duration-500 text-xs tracking-luxury uppercase font-light luxury-underline hover:tracking-wide"
            >
              Explore Our Work
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 animate-fade-in transition-opacity duration-500"
        style={{
          animationDelay: "1.6s",
          animationFillMode: "forwards",
          opacity: Math.max(1 - scrollY / 300, 0),
        }}
      >
        <div className="flex flex-col items-center">
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-luxury-lightgray to-transparent animate-scroll-pulse" />
          <p className="text-luxury-gray text-[10px] tracking-luxury uppercase font-light mt-4">Scroll</p>
        </div>
      </div>
    </section>
  );
}
