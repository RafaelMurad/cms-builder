/**
 * CMS Content Provider
 *
 * Provides a unified API for fetching content that:
 * 1. First tries to fetch from CMS database
 * 2. Falls back to static config if CMS unavailable
 *
 * This ensures the site always works, even without database.
 */

import {
  getSiteConfig as getCMSSiteConfig,
  getNavigation as getCMSNavigation,
  getSocialLinks as getCMSSocialLinks,
  getFeaturedGalleries as getCMSFeaturedGalleries,
  getAllGalleries as getCMSAllGalleries,
  getGalleryBySlug as getCMSGalleryBySlug,
  getPageBySlug as getCMSPageBySlug,
  REVALIDATE_TIME,
  type CMSSiteConfig,
  type CMSNavLink,
  type CMSSocialLink,
  type CMSGallery,
  type CMSGalleryItem,
  type CMSPage,
} from "./content";

import {
  siteConfig as staticSiteConfig,
  featuredProjects as staticFeaturedProjects,
  type Project,
} from "@/config/site";

// Re-export types
export type {
  CMSSiteConfig,
  CMSNavLink,
  CMSSocialLink,
  CMSGallery,
  CMSGalleryItem,
  CMSPage,
};

export { REVALIDATE_TIME };

// =============================================================================
// SITE CONFIG
// =============================================================================

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  logo: string | null;
  email: string;
  phone: string | null;
  copyright: string;
  // Theme
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
  // SEO
  seoTitle: string | null;
  seoDescription: string | null;
}

/**
 * Get site configuration, falling back to static config
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  const cmsConfig = await getCMSSiteConfig();

  if (cmsConfig) {
    return {
      name: cmsConfig.name,
      tagline: cmsConfig.tagline,
      description: cmsConfig.description,
      logo: cmsConfig.logo,
      email: cmsConfig.email,
      phone: cmsConfig.phone,
      copyright: `© ${new Date().getFullYear()} ${cmsConfig.name}`,
      primaryColor: cmsConfig.primaryColor,
      secondaryColor: cmsConfig.secondaryColor,
      accentColor: cmsConfig.accentColor,
      backgroundColor: cmsConfig.backgroundColor,
      textColor: cmsConfig.textColor,
      headingFont: cmsConfig.headingFont,
      bodyFont: cmsConfig.bodyFont,
      seoTitle: cmsConfig.seoTitle,
      seoDescription: cmsConfig.seoDescription,
    };
  }

  // Fallback to static config
  return {
    name: staticSiteConfig.name,
    tagline: "",
    description: staticSiteConfig.description,
    logo: null,
    email: staticSiteConfig.email,
    phone: null,
    copyright: staticSiteConfig.copyright,
    primaryColor: "#000000",
    secondaryColor: "#666666",
    accentColor: "#0066FF",
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
    headingFont: "Inter",
    bodyFont: "Inter",
    seoTitle: staticSiteConfig.name,
    seoDescription: staticSiteConfig.description,
  };
}

// =============================================================================
// NAVIGATION
// =============================================================================

export interface NavConfig {
  mainMenu: CMSNavLink[];
  footerMenu: CMSNavLink[];
  socialLinks: CMSSocialLink[];
}

/**
 * Get navigation configuration, falling back to static config
 */
export async function getNavConfig(): Promise<NavConfig> {
  const [navigation, socialLinks] = await Promise.all([
    getCMSNavigation(),
    getCMSSocialLinks(),
  ]);

  // Use CMS social links or fall back to static
  const social = socialLinks.length > 0
    ? socialLinks
    : staticSiteConfig.socialLinks.map((link) => ({
        platform: link.title.toLowerCase(),
        url: link.href,
      }));

  return {
    mainMenu: navigation.mainMenu,
    footerMenu: navigation.footerMenu,
    socialLinks: social,
  };
}

// =============================================================================
// GALLERIES / PROJECTS
// =============================================================================

export interface FeaturedProject {
  id: string;
  title: string;
  subtitle: string | null;
  href: string;
  media: {
    type: "video" | "image" | "gif";
    src: string;
    srcMobile?: string;
    poster?: string;
    alt?: string;
  };
}

/**
 * Convert CMS gallery to featured project format
 */
function cmsGalleryToProject(gallery: CMSGallery): FeaturedProject {
  const coverItem = gallery.items.find((item) => item.isCover) || gallery.items[0];
  const isVideo = coverItem?.type === "video";

  return {
    id: gallery.id,
    title: gallery.title,
    subtitle: gallery.category,
    href: `/work/${gallery.slug}`,
    media: {
      type: isVideo ? "video" : "image",
      src: coverItem?.url || "/images/placeholder.jpg",
      poster: coverItem?.thumbnailUrl || undefined,
      alt: coverItem?.altText || gallery.title,
    },
  };
}

/**
 * Convert static project to featured project format
 */
function staticProjectToFeatured(project: Project): FeaturedProject {
  return {
    id: project.id,
    title: project.title,
    subtitle: project.subtitle || null,
    href: project.href,
    media: project.media,
  };
}

/**
 * Get featured projects for homepage
 */
export async function getFeaturedProjects(limit = 6): Promise<FeaturedProject[]> {
  const cmsGalleries = await getCMSFeaturedGalleries(limit);

  if (cmsGalleries.length > 0) {
    return cmsGalleries.map(cmsGalleryToProject);
  }

  // Fallback to static projects
  return staticFeaturedProjects.slice(0, limit).map(staticProjectToFeatured);
}

/**
 * Get all projects for work page
 */
export async function getAllProjects(): Promise<FeaturedProject[]> {
  const cmsGalleries = await getCMSAllGalleries();

  if (cmsGalleries.length > 0) {
    return cmsGalleries.map(cmsGalleryToProject);
  }

  // Fallback to static projects
  return staticFeaturedProjects.map(staticProjectToFeatured);
}

/**
 * Get a single project by slug
 */
export async function getProjectBySlug(slug: string): Promise<CMSGallery | null> {
  return getCMSGalleryBySlug(slug);
}

// =============================================================================
// PAGES
// =============================================================================

/**
 * Get a page by slug
 */
export async function getPage(slug: string): Promise<CMSPage | null> {
  return getCMSPageBySlug(slug);
}

// =============================================================================
// CTA LINKS
// =============================================================================

export interface CTALink {
  title: string;
  href: string;
  variant: "default" | "highlight";
}

/**
 * Get CTA links for homepage
 */
export function getCTALinks(): CTALink[] {
  return [
    { title: "View all works", href: "/work", variant: "default" },
    { title: "Work with us", href: "/contact", variant: "highlight" },
  ];
}
