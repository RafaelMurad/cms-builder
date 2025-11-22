/**
 * CMS Data Fetching Layer
 *
 * Provides functions to fetch site content from the CMS database.
 * Uses ISR (Incremental Static Regeneration) for optimal performance.
 *
 * This layer abstracts the database queries and provides a clean API
 * for components to consume CMS-managed content.
 */

import { prisma } from "@/lib/db/client";
import { cache } from "react";

// =============================================================================
// TYPES
// =============================================================================

export interface CMSSiteConfig {
  name: string;
  tagline: string;
  description: string;
  logo: string | null;
  email: string;
  phone: string | null;
  // Theme
  template: string;
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
  seoKeywords: string[];
  ogImage: string | null;
}

export interface CMSNavLink {
  title: string;
  href: string;
  isExternal?: boolean;
}

export interface CMSSocialLink {
  platform: string;
  url: string;
}

export interface CMSGalleryItem {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnailUrl: string | null;
  title: string | null;
  description: string | null;
  altText: string | null;
  width: number | null;
  height: number | null;
  isCover: boolean;
}

export interface CMSGallery {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  layout: string;
  items: CMSGalleryItem[];
  coverImage: string | null;
}

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: any[]; // PageBlock[]
  isHomepage: boolean;
}

// =============================================================================
// SITE CONFIG
// =============================================================================

/**
 * Get the published site configuration
 * Uses React cache for request deduplication
 */
export const getSiteConfig = cache(async (siteSlug?: string): Promise<CMSSiteConfig | null> => {
  try {
    const site = await prisma.site.findFirst({
      where: siteSlug
        ? { slug: siteSlug, isPublished: true }
        : { isPublished: true },
      orderBy: { updatedAt: "desc" },
    });

    if (!site) {
      return null;
    }

    return {
      name: site.name,
      tagline: site.tagline || "",
      description: site.description || "",
      logo: site.logo,
      email: site.email || "",
      phone: site.phone,
      template: site.template,
      primaryColor: site.primaryColor,
      secondaryColor: site.secondaryColor,
      accentColor: site.accentColor,
      backgroundColor: site.backgroundColor,
      textColor: site.textColor,
      headingFont: site.headingFont,
      bodyFont: site.bodyFont,
      seoTitle: site.seoTitle,
      seoDescription: site.seoDescription,
      seoKeywords: site.seoKeywords,
      ogImage: site.ogImage,
    };
  } catch (error) {
    console.error("Error fetching site config:", error);
    return null;
  }
});

/**
 * Get navigation links for the site
 */
export const getNavigation = cache(async (siteSlug?: string): Promise<{
  mainMenu: CMSNavLink[];
  footerMenu: CMSNavLink[];
}> => {
  try {
    // For now, return default navigation
    // In a full implementation, this would come from a navigation table
    const pages = await prisma.page.findMany({
      where: {
        isPublished: true,
        ...(siteSlug && { site: { slug: siteSlug } }),
      },
      select: {
        title: true,
        slug: true,
      },
      orderBy: { sortOrder: "asc" },
    });

    const mainMenu: CMSNavLink[] = pages.map((page) => ({
      title: page.title,
      href: `/${page.slug}`,
    }));

    // Add default items if no pages exist
    if (mainMenu.length === 0) {
      mainMenu.push(
        { title: "Work", href: "/work" },
        { title: "About", href: "/about" },
        { title: "Contact", href: "/contact" }
      );
    }

    return {
      mainMenu,
      footerMenu: [{ title: "Careers", href: "/contact#careers" }],
    };
  } catch (error) {
    console.error("Error fetching navigation:", error);
    return {
      mainMenu: [
        { title: "Work", href: "/work" },
        { title: "About", href: "/about" },
        { title: "Contact", href: "/contact" },
      ],
      footerMenu: [],
    };
  }
});

/**
 * Get social links for the site
 */
export const getSocialLinks = cache(async (siteSlug?: string): Promise<CMSSocialLink[]> => {
  try {
    const site = await prisma.site.findFirst({
      where: siteSlug
        ? { slug: siteSlug, isPublished: true }
        : { isPublished: true },
      include: {
        socialLinks: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!site) {
      return [];
    }

    return site.socialLinks.map((link) => ({
      platform: link.platform,
      url: link.url,
    }));
  } catch (error) {
    console.error("Error fetching social links:", error);
    return [];
  }
});

// =============================================================================
// GALLERIES
// =============================================================================

/**
 * Get featured galleries for the homepage
 */
export const getFeaturedGalleries = cache(async (limit = 6): Promise<CMSGallery[]> => {
  try {
    const galleries = await prisma.gallery.findMany({
      where: {
        isPublished: true,
        isFeatured: true,
      },
      include: {
        items: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { sortOrder: "asc" },
      take: limit,
    });

    return galleries.map((gallery) => {
      const coverItem = gallery.items.find((item) => item.isCover) || gallery.items[0];

      return {
        id: gallery.id,
        title: gallery.title,
        slug: gallery.slug,
        description: gallery.description,
        category: gallery.category,
        layout: gallery.layout,
        items: gallery.items.map((item) => ({
          id: item.id,
          type: item.type as "image" | "video",
          url: item.url,
          thumbnailUrl: item.thumbnailUrl,
          title: item.title,
          description: item.description,
          altText: item.altText,
          width: item.width,
          height: item.height,
          isCover: item.isCover,
        })),
        coverImage: coverItem?.url || coverItem?.thumbnailUrl || null,
      };
    });
  } catch (error) {
    console.error("Error fetching featured galleries:", error);
    return [];
  }
});

/**
 * Get all published galleries
 */
export const getAllGalleries = cache(async (): Promise<CMSGallery[]> => {
  try {
    const galleries = await prisma.gallery.findMany({
      where: { isPublished: true },
      include: {
        items: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    return galleries.map((gallery) => {
      const coverItem = gallery.items.find((item) => item.isCover) || gallery.items[0];

      return {
        id: gallery.id,
        title: gallery.title,
        slug: gallery.slug,
        description: gallery.description,
        category: gallery.category,
        layout: gallery.layout,
        items: gallery.items.map((item) => ({
          id: item.id,
          type: item.type as "image" | "video",
          url: item.url,
          thumbnailUrl: item.thumbnailUrl,
          title: item.title,
          description: item.description,
          altText: item.altText,
          width: item.width,
          height: item.height,
          isCover: item.isCover,
        })),
        coverImage: coverItem?.url || coverItem?.thumbnailUrl || null,
      };
    });
  } catch (error) {
    console.error("Error fetching galleries:", error);
    return [];
  }
});

/**
 * Get a single gallery by slug
 */
export const getGalleryBySlug = cache(async (slug: string): Promise<CMSGallery | null> => {
  try {
    const gallery = await prisma.gallery.findFirst({
      where: {
        slug,
        isPublished: true,
      },
      include: {
        items: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!gallery) {
      return null;
    }

    const coverItem = gallery.items.find((item) => item.isCover) || gallery.items[0];

    return {
      id: gallery.id,
      title: gallery.title,
      slug: gallery.slug,
      description: gallery.description,
      category: gallery.category,
      layout: gallery.layout,
      items: gallery.items.map((item) => ({
        id: item.id,
        type: item.type as "image" | "video",
        url: item.url,
        thumbnailUrl: item.thumbnailUrl,
        title: item.title,
        description: item.description,
        altText: item.altText,
        width: item.width,
        height: item.height,
        isCover: item.isCover,
      })),
      coverImage: coverItem?.url || coverItem?.thumbnailUrl || null,
    };
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return null;
  }
});

// =============================================================================
// PAGES
// =============================================================================

/**
 * Get a page by slug
 */
export const getPageBySlug = cache(async (slug: string): Promise<CMSPage | null> => {
  try {
    const page = await prisma.page.findFirst({
      where: {
        slug,
        isPublished: true,
      },
    });

    if (!page) {
      return null;
    }

    return {
      id: page.id,
      title: page.title,
      slug: page.slug,
      description: page.description,
      content: JSON.parse(page.content || "[]"),
      isHomepage: page.isHomepage,
    };
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
});

/**
 * Get the homepage
 */
export const getHomepage = cache(async (): Promise<CMSPage | null> => {
  try {
    const page = await prisma.page.findFirst({
      where: {
        isHomepage: true,
        isPublished: true,
      },
    });

    if (!page) {
      return null;
    }

    return {
      id: page.id,
      title: page.title,
      slug: page.slug,
      description: page.description,
      content: JSON.parse(page.content || "[]"),
      isHomepage: true,
    };
  } catch (error) {
    console.error("Error fetching homepage:", error);
    return null;
  }
});

// =============================================================================
// REVALIDATION
// =============================================================================

/**
 * Revalidation time in seconds for ISR
 * Set to 60 seconds for near-real-time updates while maintaining performance
 */
export const REVALIDATE_TIME = 60;
