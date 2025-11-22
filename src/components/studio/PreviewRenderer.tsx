"use client";

import type { SiteConfig, Gallery } from "@/types/studio";

interface PreviewRendererProps {
  site: SiteConfig;
  galleries: Gallery[];
  showGrid: boolean;
}

export function PreviewRenderer({ site, galleries, showGrid }: PreviewRendererProps) {
  const { theme } = site;
  const publishedGalleries = galleries.filter((g) => g.isPublished);

  // Generate CSS variables from theme
  const themeStyles: React.CSSProperties = {
    "--color-primary": theme.colors.primary,
    "--color-secondary": theme.colors.secondary,
    "--color-background": theme.colors.background,
    "--color-text": theme.colors.text,
    "--color-accent": theme.colors.accent,
    "--font-heading": theme.fonts.heading,
    "--font-body": theme.fonts.body,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontFamily: theme.fonts.body,
  } as React.CSSProperties;

  const spacingMultiplier = {
    compact: 0.75,
    normal: 1,
    relaxed: 1.5,
  }[theme.spacing];

  const borderRadius = {
    none: "0",
    small: "0.25rem",
    medium: "0.5rem",
    large: "1rem",
  }[theme.borderRadius];

  return (
    <div style={themeStyles} className="min-h-screen relative">
      {/* Grid Overlay */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none z-50 opacity-20">
          <div className="h-full mx-auto max-w-7xl px-4 grid grid-cols-12 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-blue-500 h-full" />
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav
        className="sticky top-0 z-40 border-b"
        style={{
          backgroundColor: theme.colors.background,
          borderColor: `${theme.colors.text}10`,
        }}
      >
        <div
          className="max-w-7xl mx-auto flex items-center justify-between"
          style={{ padding: `${1 * spacingMultiplier}rem` }}
        >
          <div className="flex items-center gap-4">
            {site.logo ? (
              <img src={site.logo} alt={site.name} className="h-8" />
            ) : (
              <span
                className="text-xl font-bold"
                style={{ fontFamily: theme.fonts.heading }}
              >
                {site.name}
              </span>
            )}
          </div>
          <div className="flex items-center" style={{ gap: `${1.5 * spacingMultiplier}rem` }}>
            <a href="#work" style={{ color: theme.colors.text }} className="hover:opacity-70 transition-opacity">
              Work
            </a>
            <a href="#about" style={{ color: theme.colors.text }} className="hover:opacity-70 transition-opacity">
              About
            </a>
            <a href="#contact" style={{ color: theme.colors.text }} className="hover:opacity-70 transition-opacity">
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="flex items-center justify-center text-center"
        style={{
          minHeight: "70vh",
          padding: `${4 * spacingMultiplier}rem ${1 * spacingMultiplier}rem`,
        }}
      >
        <div className="max-w-4xl">
          <h1
            className="text-5xl md:text-7xl font-bold mb-6"
            style={{ fontFamily: theme.fonts.heading }}
          >
            {site.name}
          </h1>
          <p
            className="text-xl md:text-2xl opacity-70 mb-8"
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            {site.tagline}
          </p>
          {site.description && (
            <p className="opacity-50 max-w-2xl mx-auto">
              {site.description}
            </p>
          )}
        </div>
      </section>

      {/* Galleries Section */}
      {publishedGalleries.length > 0 && (
        <section id="work" style={{ padding: `${4 * spacingMultiplier}rem ${1 * spacingMultiplier}rem` }}>
          <div className="max-w-7xl mx-auto">
            <h2
              className="text-3xl font-bold mb-12 text-center"
              style={{ fontFamily: theme.fonts.heading }}
            >
              Selected Work
            </h2>

            {/* Render galleries based on template */}
            {theme.template === "minimal" && (
              <MinimalGalleryLayout galleries={publishedGalleries} borderRadius={borderRadius} />
            )}
            {theme.template === "editorial" && (
              <EditorialGalleryLayout galleries={publishedGalleries} borderRadius={borderRadius} />
            )}
            {theme.template === "bold" && (
              <BoldGalleryLayout galleries={publishedGalleries} theme={theme} borderRadius={borderRadius} />
            )}
            {theme.template === "gallery-focus" && (
              <GalleryFocusLayout galleries={publishedGalleries} borderRadius={borderRadius} />
            )}
            {theme.template === "agency" && (
              <AgencyGalleryLayout galleries={publishedGalleries} theme={theme} borderRadius={borderRadius} />
            )}
            {theme.template === "photographer" && (
              <PhotographerGalleryLayout galleries={publishedGalleries} borderRadius={borderRadius} />
            )}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section
        id="contact"
        className="border-t"
        style={{
          padding: `${4 * spacingMultiplier}rem ${1 * spacingMultiplier}rem`,
          borderColor: `${theme.colors.text}10`,
        }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ fontFamily: theme.fonts.heading }}
          >
            Get in Touch
          </h2>
          <p className="opacity-70 mb-8">
            Interested in working together? Let&apos;s talk.
          </p>
          <a
            href={`mailto:${site.contact.email}`}
            className="inline-block px-8 py-4 font-medium transition-opacity hover:opacity-80"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.background,
              borderRadius,
            }}
          >
            {site.contact.email}
          </a>

          {/* Social Links */}
          {site.socialLinks.length > 0 && (
            <div className="flex justify-center gap-4 mt-8">
              {site.socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-50 hover:opacity-100 transition-opacity capitalize"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t text-center"
        style={{
          padding: `${2 * spacingMultiplier}rem`,
          borderColor: `${theme.colors.text}10`,
        }}
      >
        <p className="opacity-50 text-sm">
          &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

// Template-specific gallery layouts

function MinimalGalleryLayout({ galleries, borderRadius }: { galleries: Gallery[]; borderRadius: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {galleries.map((gallery) => (
        <div key={gallery.id} className="group cursor-pointer">
          <div
            className="aspect-[4/3] overflow-hidden mb-4"
            style={{ borderRadius }}
          >
            {gallery.coverImage ? (
              <img
                src={gallery.coverImage}
                alt={gallery.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">No cover</span>
              </div>
            )}
          </div>
          <h3 className="font-medium">{gallery.title}</h3>
          <p className="text-sm opacity-50">{gallery.category}</p>
        </div>
      ))}
    </div>
  );
}

function EditorialGalleryLayout({ galleries, borderRadius }: { galleries: Gallery[]; borderRadius: string }) {
  return (
    <div className="space-y-24">
      {galleries.map((gallery, index) => (
        <div
          key={gallery.id}
          className={`flex flex-col md:flex-row gap-8 items-center ${
            index % 2 === 1 ? "md:flex-row-reverse" : ""
          }`}
        >
          <div className="md:w-1/2">
            <div className="aspect-[4/5] overflow-hidden" style={{ borderRadius }}>
              {gallery.coverImage && (
                <img
                  src={gallery.coverImage}
                  alt={gallery.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
          <div className="md:w-1/2 space-y-4">
            <span className="text-sm opacity-50">{gallery.category}</span>
            <h3 className="text-3xl font-bold">{gallery.title}</h3>
            <p className="opacity-70">{gallery.description}</p>
            <p className="text-sm">{gallery.items.length} images</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function BoldGalleryLayout({
  galleries,
  theme,
  borderRadius,
}: {
  galleries: Gallery[];
  theme: SiteConfig["theme"];
  borderRadius: string;
}) {
  return (
    <div className="space-y-4">
      {galleries.map((gallery) => (
        <div
          key={gallery.id}
          className="relative overflow-hidden group cursor-pointer"
          style={{ borderRadius }}
        >
          <div className="aspect-[21/9]">
            {gallery.coverImage && (
              <img
                src={gallery.coverImage}
                alt={gallery.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            )}
          </div>
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: `${theme.colors.accent}80` }}
          >
            <h3 className="text-4xl md:text-6xl font-bold text-white text-center">
              {gallery.title}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}

function GalleryFocusLayout({ galleries, borderRadius }: { galleries: Gallery[]; borderRadius: string }) {
  return (
    <div className="space-y-16">
      {galleries.map((gallery) => (
        <div key={gallery.id}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">{gallery.title}</h3>
            <span className="opacity-50">{gallery.items.length} images</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {gallery.items.slice(0, 8).map((item) => (
              <div
                key={item.id}
                className="aspect-square overflow-hidden"
                style={{ borderRadius }}
              >
                <img
                  src={item.url}
                  alt={item.title || "Gallery image"}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AgencyGalleryLayout({
  galleries,
  theme,
  borderRadius,
}: {
  galleries: Gallery[];
  theme: SiteConfig["theme"];
  borderRadius: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {galleries.map((gallery) => (
        <div
          key={gallery.id}
          className="border p-6 hover:shadow-lg transition-shadow"
          style={{
            borderRadius,
            borderColor: `${theme.colors.text}20`,
          }}
        >
          <div className="aspect-video overflow-hidden mb-6" style={{ borderRadius }}>
            {gallery.coverImage && (
              <img
                src={gallery.coverImage}
                alt={gallery.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <span
            className="inline-block px-3 py-1 text-xs font-medium mb-3"
            style={{
              backgroundColor: `${theme.colors.accent}20`,
              color: theme.colors.accent,
              borderRadius,
            }}
          >
            {gallery.category}
          </span>
          <h3 className="text-xl font-bold mb-2">{gallery.title}</h3>
          <p className="opacity-70 text-sm">{gallery.description}</p>
        </div>
      ))}
    </div>
  );
}

function PhotographerGalleryLayout({ galleries, borderRadius }: { galleries: Gallery[]; borderRadius: string }) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
      {galleries.flatMap((gallery) =>
        gallery.items.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="break-inside-avoid overflow-hidden"
            style={{ borderRadius }}
          >
            <img
              src={item.url}
              alt={item.title || "Photo"}
              className="w-full hover:opacity-90 transition-opacity"
            />
          </div>
        ))
      )}
    </div>
  );
}
