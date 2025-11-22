/**
 * Static Site Configuration
 *
 * Fallback configuration used when CMS data is unavailable.
 * This ensures the site always works, even without a database.
 */

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  media: {
    type: "video" | "image" | "gif";
    src: string;
    srcMobile?: string;
    poster?: string;
    alt?: string;
  };
}

export interface SocialLink {
  title: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  description: string;
  email: string;
  copyright: string;
  socialLinks: SocialLink[];
}

// Default site configuration
export const siteConfig: SiteConfig = {
  name: "Haus Creative",
  description: "Visual narratives for luxury brands",
  email: "hello@hauscreative.com",
  copyright: `© ${new Date().getFullYear()} Haus Creative. All rights reserved.`,
  socialLinks: [
    { title: "Instagram", href: "https://instagram.com/hauscreative" },
    { title: "Behance", href: "https://behance.net/hauscreative" },
    { title: "LinkedIn", href: "https://linkedin.com/company/hauscreative" },
  ],
};

// Default featured projects (fallback when CMS unavailable)
export const featuredProjects: Project[] = [
  {
    id: "gallery1",
    title: "Gallery 1",
    subtitle: "Creative Direction",
    href: "/work/gallery1",
    media: {
      type: "image",
      src: "/assets/gallery1/cover.jpg",
      alt: "Gallery 1",
    },
  },
  {
    id: "gallery2",
    title: "Gallery 2",
    subtitle: "Brand Identity",
    href: "/work/gallery2",
    media: {
      type: "image",
      src: "/assets/gallery2/cover.jpg",
      alt: "Gallery 2",
    },
  },
  {
    id: "gallery3",
    title: "Gallery 3",
    subtitle: "Digital Experience",
    href: "/work/gallery3",
    media: {
      type: "image",
      src: "/assets/gallery3/cover.jpg",
      alt: "Gallery 3",
    },
  },
];
