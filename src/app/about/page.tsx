"use client";

import { useEffect, useRef } from "react";

export default function About() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observers = sectionRefs.current.map((section, index) => {
      if (!section) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
            }
          });
        },
        { threshold: 0.2 }
      );

      observer.observe(section);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  return (
    <div className="min-h-screen bg-dark-100">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/20 via-transparent to-accent-pink/20 animate-gradient" style={{ backgroundSize: "400% 400%" }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 lg:px-16 text-center">
          <div className="space-y-12 animate-on-scroll visible">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-none">
              <span className="block gradient-text">Crafting</span>
              <span className="block text-white">Digital</span>
              <span className="block gradient-text">Narratives</span>
            </h1>
            <p className="text-2xl md:text-3xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Where vision meets innovation, and creativity knows no bounds
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-float">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-accent-purple rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Story Sections */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16 py-32 space-y-48">
        {/* Who We Are */}
        <section
          ref={(el) => { sectionRefs.current[0] = el; }}
          className="grid md:grid-cols-2 gap-16 items-center animate-on-scroll"
        >
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-16 h-px bg-gradient-fire" />
              <span className="text-accent-purple text-sm tracking-widest uppercase font-semibold">
                Who We Are
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              A collective of
              <span className="gradient-text"> creative minds</span>
            </h2>
            <p className="text-xl text-white/70 leading-relaxed">
              Studio Haus is a creative direction and design studio with a focus on branding,
              digital design, and experiential projects for fashion, beauty, and lifestyle clients.
            </p>
          </div>
          <div className="relative h-96 glass-effect rounded-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-fire opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-9xl font-bold text-white/5">01</div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section
          ref={(el) => { sectionRefs.current[1] = el; }}
          className="grid md:grid-cols-2 gap-16 items-center animate-on-scroll"
        >
          <div className="relative h-96 glass-effect rounded-2xl overflow-hidden group md:order-1">
            <div className="absolute inset-0 bg-gradient-ocean opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-9xl font-bold text-white/5">02</div>
            </div>
          </div>
          <div className="space-y-8 md:order-2">
            <div className="flex items-center gap-4">
              <span className="w-16 h-px bg-gradient-fire" />
              <span className="text-accent-purple text-sm tracking-widest uppercase font-semibold">
                Our Mission
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Transforming
              <span className="gradient-text"> visions into reality</span>
            </h2>
            <p className="text-xl text-white/70 leading-relaxed">
              We leverage our expertise across physical and digital channels to create cohesive
              brand experiences that tell compelling stories and build lasting connections with audiences.
            </p>
          </div>
        </section>

        {/* Our Approach */}
        <section
          ref={(el) => { sectionRefs.current[2] = el; }}
          className="grid md:grid-cols-2 gap-16 items-center animate-on-scroll"
        >
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-16 h-px bg-gradient-fire" />
              <span className="text-accent-purple text-sm tracking-widest uppercase font-semibold">
                Our Approach
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Strategic thinking meets
              <span className="gradient-text"> creative execution</span>
            </h2>
            <p className="text-xl text-white/70 leading-relaxed">
              We believe in a collaborative process that puts your brand story at the center.
              Through thoughtful design and strategic thinking, we create authentic experiences
              that resonate with your audience and elevate your brand presence.
            </p>
          </div>
          <div className="relative h-96 glass-effect rounded-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-mesh opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-9xl font-bold text-white/5">03</div>
            </div>
          </div>
        </section>

        {/* Values Grid */}
        <section
          ref={(el) => { sectionRefs.current[3] = el; }}
          className="animate-on-scroll space-y-16"
        >
          <div className="text-center space-y-6">
            <h2 className="text-5xl md:text-7xl font-bold">
              <span className="gradient-text">Our Values</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              The principles that guide everything we create
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Innovation",
                description: "Pushing boundaries and exploring new creative frontiers",
                gradient: "from-accent-purple to-accent-pink",
              },
              {
                title: "Excellence",
                description: "Delivering exceptional quality in every project",
                gradient: "from-accent-pink to-accent-orange",
              },
              {
                title: "Collaboration",
                description: "Working together to achieve extraordinary results",
                gradient: "from-accent-blue to-accent-purple",
              },
            ].map((value, index) => (
              <div
                key={value.title}
                className="group relative p-8 glass-effect rounded-2xl hover:glass-dark transition-all duration-500 overflow-hidden"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                <div className="relative z-10 space-y-4">
                  <h3 className="text-2xl font-bold text-white">{value.title}</h3>
                  <p className="text-white/70">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          ref={(el) => { sectionRefs.current[4] = el; }}
          className="text-center space-y-12 py-24 animate-on-scroll"
        >
          <h2 className="text-5xl md:text-7xl font-bold">
            <span className="text-white">Ready to</span>
            <br />
            <span className="gradient-text">create together?</span>
          </h2>
          <a
            href="mailto:contact@studiohaus.com"
            className="inline-block px-12 py-6 border-2 border-accent-purple text-white hover:bg-accent-purple/10 transition-all duration-500 text-sm tracking-widest uppercase font-semibold magnetic group relative overflow-hidden"
          >
            <span className="relative z-10">Let&apos;s Talk</span>
            <div className="absolute inset-0 bg-gradient-fire opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
          </a>
        </section>
      </div>
    </div>
  );
}
