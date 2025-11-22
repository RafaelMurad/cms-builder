import { getSiteConfig, getNavConfig, REVALIDATE_TIME } from "@/lib/cms";

// Enable ISR
export const revalidate = REVALIDATE_TIME;

export default async function ContactPage() {
  const [config, nav] = await Promise.all([
    getSiteConfig(),
    getNavConfig(),
  ]);

  return (
    <main className="min-h-screen bg-black text-white pt-20">
      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-light mb-8">Get in Touch</h1>

          <p className="text-lg md:text-xl text-white/60 mb-16 max-w-2xl">
            We&apos;re always interested in hearing about new projects and opportunities.
            Drop us a line and let&apos;s create something amazing together.
          </p>

          {/* Contact Info */}
          <div className="space-y-12">
            {/* Email */}
            <div>
              <h2 className="text-sm uppercase tracking-widest text-white/40 mb-3">
                Email
              </h2>
              <a
                href={`mailto:${config.email}`}
                className="text-2xl md:text-3xl font-light hover:text-white/70 transition-colors"
              >
                {config.email}
              </a>
            </div>

            {/* Phone */}
            {config.phone && (
              <div>
                <h2 className="text-sm uppercase tracking-widest text-white/40 mb-3">
                  Phone
                </h2>
                <a
                  href={`tel:${config.phone}`}
                  className="text-2xl md:text-3xl font-light hover:text-white/70 transition-colors"
                >
                  {config.phone}
                </a>
              </div>
            )}

            {/* Social */}
            {nav.socialLinks.length > 0 && (
              <div>
                <h2 className="text-sm uppercase tracking-widest text-white/40 mb-4">
                  Follow Us
                </h2>
                <div className="flex gap-6">
                  {nav.socialLinks.map((social) => (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg capitalize hover:text-white/70 transition-colors"
                    >
                      {social.platform}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Careers */}
            <div id="careers" className="pt-12 border-t border-white/10">
              <h2 className="text-2xl md:text-3xl font-light mb-4">Careers</h2>
              <p className="text-white/60 mb-6 max-w-xl">
                We&apos;re always looking for talented individuals to join our team.
                If you&apos;re passionate about design and technology, we&apos;d love to hear from you.
              </p>
              <a
                href={`mailto:${config.email}?subject=Career Inquiry`}
                className="inline-flex items-center gap-2 text-white hover:text-white/70 transition-colors"
              >
                Send your portfolio
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M3 8H13M13 8L8 3M13 8L8 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
