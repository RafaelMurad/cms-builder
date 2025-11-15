"use client";

import { useEffect, useState } from "react";

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden scroll-section">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-200 via-dark-100 to-dark-50">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.2) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)",
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent-purple rounded-full animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 text-center">
        <div className="space-y-8">
          {/* Overline */}
          <div className="animate-fade-in opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            <span className="inline-block px-6 py-2 glass-effect text-accent-purple text-sm tracking-[0.3em] uppercase font-semibold">
              Creative Studio
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-none">
            <div className="animate-slide-up opacity-0" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
              <span className="block gradient-text">We Create</span>
            </div>
            <div className="animate-slide-up opacity-0" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
              <span className="block text-white">Experiences</span>
            </div>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed animate-fade-in opacity-0" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
            Transforming visions into immersive digital experiences
            that captivate, inspire, and elevate brands to new heights
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 animate-fade-in opacity-0" style={{ animationDelay: "1s", animationFillMode: "forwards" }}>
            <a
              href="#work"
              className="group relative px-10 py-5 overflow-hidden text-white border-2 border-accent-purple hover:border-accent-pink transition-all duration-500 text-sm tracking-widest uppercase font-semibold magnetic"
            >
              <span className="relative z-10">Explore Work</span>
              <div className="absolute inset-0 bg-gradient-fire opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </a>
            <a
              href="#contact"
              className="px-10 py-5 glass-effect text-white hover:glass-dark transition-all duration-300 text-sm tracking-widest uppercase font-semibold magnetic"
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-float">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-accent-purple rounded-full mt-2 animate-pulse" />
          </div>
          <p className="text-white/50 text-xs tracking-widest uppercase mt-4">Scroll</p>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-100 to-transparent" />
    </section>
  );
}
