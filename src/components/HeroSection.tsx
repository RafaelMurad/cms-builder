"use client";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center relative bg-white pt-32 pb-24 px-8 md:px-12 lg:px-16">
      <div className="max-w-screen-xl mx-auto text-center">
        <div className="space-y-16 animate-fade-in-slow">
          {/* Overline */}
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
            <p className="text-luxury-gray text-xs tracking-luxury uppercase font-light">
              Creative Direction + Design
            </p>
          </div>

          {/* Main heading */}
          <h1 className="font-times">
            <div className="opacity-0 animate-slide-up" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
              <span className="block text-6xl md:text-8xl lg:text-9xl font-light tracking-tight leading-none text-luxury-black mb-4">
                STUDIO
              </span>
            </div>
            <div className="opacity-0 animate-slide-up" style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}>
              <span className="block text-6xl md:text-8xl lg:text-9xl font-light tracking-tight leading-none text-luxury-black">
                HAUS
              </span>
            </div>
          </h1>

          {/* Divider */}
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}>
            <div className="luxury-divider" />
          </div>

          {/* Subtitle */}
          <p className="text-luxury-gray text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-light tracking-wide opacity-0 animate-fade-in" style={{ animationDelay: "1.1s", animationFillMode: "forwards" }}>
            Crafting timeless visual narratives for discerning brands.
            <br />
            Where elegance meets innovation.
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 animate-fade-in" style={{ animationDelay: "1.5s", animationFillMode: "forwards" }}>
        <div className="flex flex-col items-center">
          <div className="w-px h-16 bg-luxury-lightgray mb-4" />
          <p className="text-luxury-gray text-[10px] tracking-luxury uppercase font-light">Scroll</p>
        </div>
      </div>
    </section>
  );
}
