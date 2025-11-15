"use client";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-32 pb-24 px-8 md:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-12">
            <div className="luxury-divider" />
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-times font-light tracking-tight leading-tight text-luxury-black">
              Defining
              <br />
              Luxury Through
              <br />
              Design
            </h1>
            <p className="text-luxury-gray text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
              Where vision meets innovation, and creativity knows no bounds
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Content */}
      <div className="max-w-4xl mx-auto px-8 md:px-12 lg:px-16 py-24 space-y-32">
        {/* Who We Are */}
        <section className="space-y-8">
          <div>
            <p className="text-luxury-gray text-[10px] tracking-luxury uppercase font-light mb-6">
              Who We Are
            </p>
            <div className="w-16 h-px bg-luxury-black mb-12" />
          </div>
          <div className="space-y-6">
            <p className="text-luxury-black text-lg md:text-xl font-light leading-relaxed">
              Studio Haus is a creative direction and design studio with a focus on branding,
              digital design, and experiential projects for fashion, beauty, and lifestyle clients.
            </p>
            <p className="text-luxury-gray text-base font-light leading-relaxed">
              We work with discerning brands like Dior, Gucci, and Prada to create timeless
              visual narratives that elevate their presence in the luxury market.
            </p>
          </div>
        </section>

        {/* Our Mission */}
        <section className="space-y-8">
          <div>
            <p className="text-luxury-gray text-[10px] tracking-luxury uppercase font-light mb-6">
              Our Mission
            </p>
            <div className="w-16 h-px bg-luxury-black mb-12" />
          </div>
          <div className="space-y-6">
            <p className="text-luxury-black text-lg md:text-xl font-light leading-relaxed">
              We believe in the power of thoughtful design to communicate complex ideas
              with clarity and elegance.
            </p>
            <p className="text-luxury-gray text-base font-light leading-relaxed">
              Our mission is to partner with forward-thinking luxury organizations to create
              work that resonates, inspires, and stands the test of time.
            </p>
          </div>
        </section>

        {/* Our Approach */}
        <section className="space-y-8">
          <div>
            <p className="text-luxury-gray text-[10px] tracking-luxury uppercase font-light mb-6">
              Our Approach
            </p>
            <div className="w-16 h-px bg-luxury-black mb-12" />
          </div>
          <div className="space-y-6">
            <p className="text-luxury-black text-lg md:text-xl font-light leading-relaxed">
              Every project begins with deep listening and research.
            </p>
            <p className="text-luxury-gray text-base font-light leading-relaxed">
              We take time to understand not just what you need, but why you need it.
              This foundation allows us to craft solutions that are both beautiful and effective,
              ensuring every detail reflects the sophistication of your brand.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="space-y-16">
          <div className="text-center">
            <div className="luxury-divider mb-12" />
            <h2 className="text-3xl md:text-5xl font-times font-light tracking-tight text-luxury-black">
              Our Principles
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            {[
              {
                title: "Excellence",
                description: "Uncompromising attention to detail in every project",
              },
              {
                title: "Timelessness",
                description: "Creating work that transcends fleeting trends",
              },
              {
                title: "Discretion",
                description: "Maintaining the highest standards of confidentiality",
              },
            ].map((value) => (
              <div key={value.title} className="text-center space-y-4">
                <h3 className="text-xl font-times font-light text-luxury-black">
                  {value.title}
                </h3>
                <div className="w-8 h-px bg-luxury-lightgray mx-auto" />
                <p className="text-luxury-gray text-sm font-light leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-12 py-24">
          <div className="luxury-divider" />
          <h2 className="text-3xl md:text-5xl font-times font-light tracking-tight text-luxury-black">
            Let&apos;s Create
            <br />
            Something Exceptional
          </h2>
          <a
            href="mailto:contact@studiohaus.com"
            className="inline-block text-luxury-black hover:text-luxury-gray transition-colors duration-300 text-xs tracking-luxury uppercase font-light luxury-underline"
          >
            Get in Touch
          </a>
        </section>
      </div>
    </div>
  );
}
