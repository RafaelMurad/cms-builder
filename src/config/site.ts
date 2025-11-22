/**
 * Site Configuration
 *
 * Centralized configuration for site-wide settings.
 * Easy to customize - just update the values here.
 */

export interface NavLink {
  title: string;
  href: string;
  isExternal?: boolean;
}

export interface SocialLink {
  title: string;
  href: string;
  icon?: string;
}

// =============================================================================
// MEDIA TYPES - Support for images, videos, and GIFs
// =============================================================================

export type MediaType = "video" | "image" | "gif";

export interface MediaSource {
  type: MediaType;
  src: string;
  srcMobile?: string;      // Optional mobile-specific source
  poster?: string;         // Poster/thumbnail for videos
  alt?: string;            // Alt text for images/gifs
  autoPlay?: boolean;      // For videos/gifs - default true
  loop?: boolean;          // For videos/gifs - default true
  muted?: boolean;         // For videos - default true
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  media: MediaSource;      // Primary media (can be video, image, or gif)
  // Legacy support - will be converted to media internally
  videoSrc?: string;
  videoSrcMobile?: string;
  posterSrc?: string;
  imageSrc?: string;
}

// Helper to determine media type from file extension
export function getMediaType(src: string): MediaType {
  const ext = src.split(".").pop()?.toLowerCase();
  if (ext === "gif") return "gif";
  if (["mp4", "webm", "ogg", "mov"].includes(ext || "")) return "video";
  return "image";
}

// Helper to create media source from legacy project format
export function createMediaSource(project: Partial<Project>): MediaSource {
  if (project.media) return project.media;

  if (project.videoSrc) {
    return {
      type: "video",
      src: project.videoSrc,
      srcMobile: project.videoSrcMobile,
      poster: project.posterSrc,
      autoPlay: true,
      loop: true,
      muted: true,
    };
  }

  if (project.imageSrc) {
    const type = getMediaType(project.imageSrc);
    return {
      type,
      src: project.imageSrc,
      alt: project.title,
      autoPlay: type === "gif",
      loop: type === "gif",
    };
  }

  // Default fallback
  return {
    type: "image",
    src: "/images/placeholder.jpg",
    alt: project.title || "Project",
  };
}

export interface SiteConfig {
  name: string;
  description: string;
  email: string;
  copyright: string;
  mainMenu: NavLink[];
  footerMenu: NavLink[];
  socialLinks: SocialLink[];
}

// =============================================================================
// SITE CONFIGURATION - Customize these values for your site
// =============================================================================

export const siteConfig: SiteConfig = {
  name: "HAUS",
  description:
    "We are a creative studio specializing in digital experiences, brand identity, and immersive design for forward-thinking brands.",
  email: "hello@haus-creative.com",
  copyright: `© ${new Date().getFullYear()} Haus Creative`,

  mainMenu: [
    { title: "Work", href: "/work" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ],

  footerMenu: [
    { title: "Careers", href: "/contact#careers" },
  ],

  socialLinks: [
    { title: "Instagram", href: "https://www.instagram.com/haus.creative" },
    { title: "LinkedIn", href: "https://www.linkedin.com/company/haus-creative" },
  ],
};

// =============================================================================
// FEATURED PROJECTS - For homepage video sections
// =============================================================================

export const featuredProjects: Project[] = [
  {
    id: "project-1",
    title: "Brand Evolution",
    subtitle: "Digital Experience",
    href: "/work/brand-evolution",
    media: {
      type: "video",
      src: "/videos/project-1.mp4",
      srcMobile: "/videos/project-1-mobile.mp4",
      poster: "/images/project-1-poster.jpg",
      autoPlay: true,
      loop: true,
      muted: true,
    },
  },
  {
    id: "project-2",
    title: "Immersive Gallery",
    subtitle: "Interactive Installation",
    href: "/work/immersive-gallery",
    media: {
      type: "image",
      src: "/images/project-2.jpg",
      srcMobile: "/images/project-2-mobile.jpg",
      alt: "Immersive Gallery installation view",
    },
  },
  {
    id: "project-3",
    title: "Motion Identity",
    subtitle: "Brand System",
    href: "/work/motion-identity",
    media: {
      type: "gif",
      src: "/images/project-3.gif",
      alt: "Motion Identity animation preview",
      autoPlay: true,
      loop: true,
    },
  },
];

// =============================================================================
// CTA LINKS - For homepage call-to-action section
// =============================================================================

export const ctaLinks = [
  {
    title: "View all works",
    href: "/work",
    variant: "default" as const,
  },
  {
    title: "Work with us",
    href: "/contact",
    variant: "highlight" as const,
  },
];
