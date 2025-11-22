"use client";

import { useState } from "react";
import { useStudio } from "@/context/StudioContext";
import type { SocialLink } from "@/types/studio";

type SocialPlatform = SocialLink["platform"];

const platforms: { id: SocialPlatform; name: string; icon: React.ReactNode }[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    id: "twitter",
    name: "Twitter",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    id: "behance",
    name: "Behance",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-1.16 1.35-.48.348-1.05.6-1.67.767-.61.165-1.252.254-1.91.254H0V4.51h6.938v-.007zM6.545 9.66c.555 0 1.01-.135 1.36-.407.348-.27.52-.678.52-1.22 0-.31-.06-.57-.175-.78-.116-.208-.27-.376-.47-.505-.2-.13-.427-.22-.69-.274-.26-.05-.54-.078-.84-.078H3.373v3.264h3.172zm.195 5.392c.34 0 .657-.04.95-.124.29-.08.545-.205.76-.373.21-.168.38-.39.5-.665.12-.27.18-.6.18-.99 0-.79-.22-1.36-.66-1.72-.44-.36-1.01-.54-1.71-.54H3.37v4.41h3.37zM15.93 5.54h5.31v1.6h-5.31V5.54zm6.18 4.815c.3.63.45 1.33.45 2.1h-6.36c.03.78.28 1.38.76 1.8.48.42 1.08.63 1.8.63.55 0 1.02-.13 1.4-.4.38-.27.64-.57.77-.92h2.42c-.39 1.14-1.01 2.01-1.87 2.6-.85.59-1.89.89-3.11.89-.85 0-1.62-.14-2.31-.43-.69-.29-1.28-.69-1.77-1.21-.49-.52-.87-1.14-1.14-1.87-.27-.73-.41-1.53-.41-2.4 0-.85.13-1.64.4-2.37.27-.73.65-1.36 1.13-1.89.49-.53 1.07-.95 1.76-1.25.68-.3 1.44-.45 2.26-.45.88 0 1.66.17 2.35.52.69.35 1.27.83 1.73 1.44.47.61.81 1.32 1.04 2.13zm-5.67-.46c-.41.38-.68.92-.8 1.62h4.02c-.05-.68-.28-1.21-.7-1.6-.42-.38-.95-.57-1.58-.57-.69 0-1.22.18-1.63.55h.69z" />
      </svg>
    ),
  },
  {
    id: "dribbble",
    name: "Dribbble",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z" />
      </svg>
    ),
  },
  {
    id: "github",
    name: "GitHub",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    id: "website",
    name: "Website",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
];

export default function SettingsPage() {
  const { site, updateSite, updateTheme } = useStudio();
  const [activeTab, setActiveTab] = useState<"general" | "appearance" | "seo" | "social">("general");

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-neutral-400">Configure your portfolio site</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-800 rounded-lg p-1 mb-8 w-fit">
        {(["general", "appearance", "seo", "social"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
              activeTab === tab ? "bg-white text-black" : "hover:bg-neutral-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-neutral-800 rounded-xl p-6">
        {activeTab === "general" && (
          <GeneralSettings site={site} updateSite={updateSite} />
        )}
        {activeTab === "appearance" && (
          <AppearanceSettings site={site} updateTheme={updateTheme} />
        )}
        {activeTab === "seo" && (
          <SEOSettings site={site} updateSite={updateSite} />
        )}
        {activeTab === "social" && (
          <SocialSettings site={site} updateSite={updateSite} />
        )}
      </div>
    </div>
  );
}

// General Settings Tab
function GeneralSettings({
  site,
  updateSite,
}: {
  site: ReturnType<typeof useStudio>["site"];
  updateSite: ReturnType<typeof useStudio>["updateSite"];
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-4">General Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Site Name</label>
          <input
            type="text"
            value={site.name}
            onChange={(e) => updateSite({ name: e.target.value })}
            className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:border-white transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tagline</label>
          <input
            type="text"
            value={site.tagline}
            onChange={(e) => updateSite({ tagline: e.target.value })}
            className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:border-white transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={site.description}
          onChange={(e) => updateSite({ description: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:border-white transition-colors resize-none"
        />
      </div>

      <div className="border-t border-neutral-700 pt-6">
        <h3 className="font-medium mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={site.contact.email}
              onChange={(e) =>
                updateSite({ contact: { ...site.contact, email: e.target.value } })
              }
              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone (optional)</label>
            <input
              type="tel"
              value={site.contact.phone || ""}
              onChange={(e) =>
                updateSite({
                  contact: { ...site.contact, phone: e.target.value || undefined },
                })
              }
              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:border-white transition-colors"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Address (optional)</label>
          <input
            type="text"
            value={site.contact.address || ""}
            onChange={(e) =>
              updateSite({
                contact: { ...site.contact, address: e.target.value || undefined },
              })
            }
            className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:border-white transition-colors"
          />
        </div>
      </div>
    </div>
  );
}

// Appearance Settings Tab
function AppearanceSettings({
  site,
  updateTheme,
}: {
  site: ReturnType<typeof useStudio>["site"];
  updateTheme: ReturnType<typeof useStudio>["updateTheme"];
}) {
  const colorOptions = [
    { key: "primary", label: "Primary Color" },
    { key: "secondary", label: "Secondary Color" },
    { key: "background", label: "Background" },
    { key: "text", label: "Text Color" },
    { key: "accent", label: "Accent Color" },
  ] as const;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-4">Appearance</h2>

      {/* Colors */}
      <div>
        <h3 className="font-medium mb-4">Colors</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {colorOptions.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs text-neutral-400 mb-2">{label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={site.theme.colors[key]}
                  onChange={(e) =>
                    updateTheme({
                      colors: { ...site.theme.colors, [key]: e.target.value },
                    })
                  }
                  className="w-10 h-10 rounded cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={site.theme.colors[key]}
                  onChange={(e) =>
                    updateTheme({
                      colors: { ...site.theme.colors, [key]: e.target.value },
                    })
                  }
                  className="flex-1 px-2 py-1 text-sm bg-neutral-700 border border-neutral-600 rounded focus:outline-none focus:border-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fonts */}
      <div className="border-t border-neutral-700 pt-6">
        <h3 className="font-medium mb-4">Typography</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Heading Font</label>
            <select
              value={site.theme.fonts.heading}
              onChange={(e) =>
                updateTheme({ fonts: { ...site.theme.fonts, heading: e.target.value } })
              }
              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:border-white"
            >
              <option value="Inter">Inter</option>
              <option value="Playfair Display">Playfair Display</option>
              <option value="Space Grotesk">Space Grotesk</option>
              <option value="DM Sans">DM Sans</option>
              <option value="Instrument Serif">Instrument Serif</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Body Font</label>
            <select
              value={site.theme.fonts.body}
              onChange={(e) =>
                updateTheme({ fonts: { ...site.theme.fonts, body: e.target.value } })
              }
              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:border-white"
            >
              <option value="Inter">Inter</option>
              <option value="DM Sans">DM Sans</option>
              <option value="IBM Plex Sans">IBM Plex Sans</option>
              <option value="Work Sans">Work Sans</option>
            </select>
          </div>
        </div>
      </div>

      {/* Spacing & Border Radius */}
      <div className="border-t border-neutral-700 pt-6">
        <h3 className="font-medium mb-4">Layout</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Spacing</label>
            <select
              value={site.theme.spacing}
              onChange={(e) =>
                updateTheme({ spacing: e.target.value as typeof site.theme.spacing })
              }
              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:border-white"
            >
              <option value="compact">Compact</option>
              <option value="normal">Normal</option>
              <option value="relaxed">Relaxed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Border Radius</label>
            <select
              value={site.theme.borderRadius}
              onChange={(e) =>
                updateTheme({
                  borderRadius: e.target.value as typeof site.theme.borderRadius,
                })
              }
              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:border-white"
            >
              <option value="none">None</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// SEO Settings Tab
function SEOSettings({
  site,
  updateSite,
}: {
  site: ReturnType<typeof useStudio>["site"];
  updateSite: ReturnType<typeof useStudio>["updateSite"];
}) {
  const [keywordsInput, setKeywordsInput] = useState(site.seo.keywords.join(", "));

  const handleKeywordsChange = (value: string) => {
    setKeywordsInput(value);
    const keywords = value
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    updateSite({ seo: { ...site.seo, keywords } });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-4">SEO Settings</h2>

      <div>
        <label className="block text-sm font-medium mb-2">Page Title</label>
        <input
          type="text"
          value={site.seo.title}
          onChange={(e) => updateSite({ seo: { ...site.seo, title: e.target.value } })}
          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:border-white transition-colors"
        />
        <p className="text-xs text-neutral-400 mt-1">
          {site.seo.title.length}/60 characters recommended
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Meta Description</label>
        <textarea
          value={site.seo.description}
          onChange={(e) =>
            updateSite({ seo: { ...site.seo, description: e.target.value } })
          }
          rows={3}
          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:border-white transition-colors resize-none"
        />
        <p className="text-xs text-neutral-400 mt-1">
          {site.seo.description.length}/160 characters recommended
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Keywords</label>
        <input
          type="text"
          value={keywordsInput}
          onChange={(e) => handleKeywordsChange(e.target.value)}
          placeholder="portfolio, design, photography"
          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:border-white transition-colors"
        />
        <p className="text-xs text-neutral-400 mt-1">
          Separate keywords with commas
        </p>
      </div>

      {/* Preview */}
      <div className="border-t border-neutral-700 pt-6">
        <h3 className="font-medium mb-4">Search Preview</h3>
        <div className="bg-white text-black p-4 rounded-lg">
          <div className="text-blue-600 text-lg hover:underline cursor-pointer">
            {site.seo.title || "Your Site Title"}
          </div>
          <div className="text-green-700 text-sm">yoursite.com</div>
          <div className="text-gray-600 text-sm mt-1">
            {site.seo.description || "Your site description will appear here..."}
          </div>
        </div>
      </div>
    </div>
  );
}

// Social Settings Tab
function SocialSettings({
  site,
  updateSite,
}: {
  site: ReturnType<typeof useStudio>["site"];
  updateSite: ReturnType<typeof useStudio>["updateSite"];
}) {
  const addSocialLink = (platform: SocialPlatform) => {
    if (site.socialLinks.some((l) => l.platform === platform)) return;
    updateSite({
      socialLinks: [...site.socialLinks, { platform, url: "" }],
    });
  };

  const updateSocialLink = (platform: SocialPlatform, url: string) => {
    updateSite({
      socialLinks: site.socialLinks.map((l) =>
        l.platform === platform ? { ...l, url } : l
      ),
    });
  };

  const removeSocialLink = (platform: SocialPlatform) => {
    updateSite({
      socialLinks: site.socialLinks.filter((l) => l.platform !== platform),
    });
  };

  const availablePlatforms = platforms.filter(
    (p) => !site.socialLinks.some((l) => l.platform === p.id)
  );

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-4">Social Links</h2>

      {/* Existing Links */}
      {site.socialLinks.length > 0 && (
        <div className="space-y-3">
          {site.socialLinks.map((link) => {
            const platform = platforms.find((p) => p.id === link.platform);
            return (
              <div key={link.platform} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-700 rounded-lg flex items-center justify-center">
                  {platform?.icon}
                </div>
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updateSocialLink(link.platform, e.target.value)}
                  placeholder={`${platform?.name} URL`}
                  className="flex-1 px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:border-white transition-colors"
                />
                <button
                  onClick={() => removeSocialLink(link.platform)}
                  className="p-2 text-neutral-400 hover:text-red-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Link */}
      {availablePlatforms.length > 0 && (
        <div className="border-t border-neutral-700 pt-6">
          <h3 className="font-medium mb-4">Add Social Link</h3>
          <div className="flex flex-wrap gap-2">
            {availablePlatforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => addSocialLink(platform.id)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors"
              >
                {platform.icon}
                <span>{platform.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {site.socialLinks.length === 0 && (
        <div className="text-center py-8 text-neutral-400">
          <p>No social links added yet</p>
          <p className="text-sm mt-1">Click a platform above to add it</p>
        </div>
      )}
    </div>
  );
}
