"use client";

import { useState, useEffect } from "react";

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fluid scroll effects
  const contentOpacity = Math.max(1 - scrollY / 700, 0);
  const blurAmount = Math.min(scrollY / 100, 8);

  return (
    <section className="min-h-screen flex items-center justify-center relative bg-white pt-32 pb-24 px-8 md:px-12 lg:px-16 overflow-hidden">
      {/* Floating ambient shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-luxury-gold/5 blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-luxury-gray/5 blur-3xl animate-float-slower" />
      </div>

      <div
        className="max-w-screen-xl mx-auto text-center relative z-20"
        style={{
          opacity: contentOpacity,
          filter: `blur(${blurAmount}px)`,
          transition: 'filter 0.1s linear',
        }}
      >
        <div className="space-y-20">
          {/* Overline with wave reveal */}
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            <p className="text-luxury-gray text-xs tracking-luxury uppercase font-light kinetic-text">
              Creative Direction + Design
            </p>
          </div>

          {/* Kinetic typography - letters appear with stagger */}
          <div className="font-times">
            <div className="overflow-hidden">
              <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-light tracking-tighter leading-none text-luxury-black mb-6">
                {mounted && "STUDIO".split("").map((letter, i) => (
                  <span
                    key={i}
                    className="inline-block opacity-0 animate-letter-appear kinetic-letter"
                    style={{
                      animationDelay: `${0.4 + i * 0.08}s`,
                      animationFillMode: "forwards",
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </h1>
            </div>
            <div className="overflow-hidden">
              <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-light tracking-tighter leading-none text-luxury-black">
                {mounted && "HAUS".split("").map((letter, i) => (
                  <span
                    key={i}
                    className="inline-block opacity-0 animate-letter-appear kinetic-letter"
                    style={{
                      animationDelay: `${0.9 + i * 0.08}s`,
                      animationFillMode: "forwards",
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </h1>
            </div>
          </div>

          {/* Divider with liquid expand */}
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}>
            <div className="relative overflow-hidden h-px">
              <div className="absolute left-1/2 top-0 -translate-x-1/2 w-0 h-px bg-luxury-gold animate-expand-elastic" style={{ animationDelay: "1.4s" }} />
            </div>
          </div>

          {/* Subtitle with wave appearance */}
          <div className="opacity-0 animate-wave-in" style={{ animationDelay: "1.3s", animationFillMode: "forwards" }}>
            <p className="text-luxury-gray text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
              Crafting timeless visual narratives for the world&apos;s most
              <br />
              discerning brands. Where elegance meets innovation.
            </p>
          </div>

          {/* CTA with fluid reveal */}
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: "1.6s", animationFillMode: "forwards" }}>
            <a
              href="#work"
              className="inline-block text-luxury-black hover:text-luxury-gray transition-all duration-700 text-xs tracking-luxury uppercase font-light luxury-underline hover:tracking-wide group"
            >
              <span className="inline-block transition-transform duration-700 group-hover:translate-x-1">Explore Our Work</span>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator with fluid pulse */}
      <div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 animate-fade-in transition-opacity duration-500"
        style={{
          animationDelay: "1.8s",
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
