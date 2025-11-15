"use client";

import { useState, useEffect } from "react";

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [spotlightVisible, setSpotlightVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setSpotlightVisible(true);
    const handleMouseLeave = () => setSpotlightVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseenter", handleMouseEnter);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative bg-white pt-32 pb-24 px-8 md:px-12 lg:px-16 overflow-hidden">
      {/* Subtle spotlight effect following mouse */}
      <div
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: spotlightVisible ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(201, 165, 90, 0.03), transparent 80%)`,
        }}
      />

      <div className="max-w-screen-xl mx-auto text-center relative z-20">
        <div className="space-y-20 animate-fade-in-slow">
          {/* Overline */}
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
            <p className="text-luxury-gray text-xs tracking-luxury uppercase font-light">
              Creative Direction + Design
            </p>
          </div>

          {/* Main heading with magnetic letters */}
          <div className="font-times">
            <div className="opacity-0 animate-slide-up" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
              <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-light tracking-tighter leading-none text-luxury-black mb-6 hover-magnetic-container">
                STUDIO
              </h1>
            </div>
            <div className="opacity-0 animate-slide-up" style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}>
              <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-light tracking-tighter leading-none text-luxury-black hover-magnetic-container">
                HAUS
              </h1>
            </div>
          </div>

          {/* Divider with subtle animation */}
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}>
            <div className="relative">
              <div className="luxury-divider" />
              <div className="absolute left-1/2 top-0 -translate-x-1/2 w-0 h-px bg-luxury-gold animate-expand" style={{ animationDelay: "1.2s" }} />
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-luxury-gray text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-light tracking-wide opacity-0 animate-fade-in" style={{ animationDelay: "1.1s", animationFillMode: "forwards" }}>
            Crafting timeless visual narratives for the world&apos;s most
            <br />
            discerning brands. Where elegance meets innovation.
          </p>

          {/* CTA with glow effect */}
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: "1.4s", animationFillMode: "forwards" }}>
            <a
              href="#work"
              className="inline-block relative group"
            >
              <span className="text-luxury-black hover:text-luxury-gray transition-colors duration-500 text-xs tracking-luxury uppercase font-light luxury-underline">
                Explore Our Work
              </span>
              <span className="absolute inset-0 blur-xl bg-luxury-gold opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator with pulse */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 animate-fade-in" style={{ animationDelay: "1.6s", animationFillMode: "forwards" }}>
        <div className="flex flex-col items-center">
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-luxury-lightgray to-transparent animate-scroll-pulse" />
          <p className="text-luxury-gray text-[10px] tracking-luxury uppercase font-light mt-4">Scroll</p>
        </div>
      </div>
    </section>
  );
}
