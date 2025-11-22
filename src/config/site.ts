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

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  videoSrc: string;
  videoSrcMobile?: string;
  posterSrc?: string;
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
    videoSrc: "/videos/project-1.mp4",
    posterSrc: "/images/project-1-poster.jpg",
  },
  {
    id: "project-2",
    title: "Immersive Gallery",
    subtitle: "Interactive Installation",
    href: "/work/immersive-gallery",
    videoSrc: "/videos/project-2.mp4",
    posterSrc: "/images/project-2-poster.jpg",
  },
  {
    id: "project-3",
    title: "Motion Identity",
    subtitle: "Brand System",
    href: "/work/motion-identity",
    videoSrc: "/videos/project-3.mp4",
    posterSrc: "/images/project-3-poster.jpg",
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
