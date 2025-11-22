/**
 * Studio Builder Type Definitions
 *
 * These types define the data models for the portfolio builder CMS.
 * Designed to be backend-agnostic - can work with localStorage, Supabase, etc.
 */

// ============================================================================
// SITE CONFIGURATION
// ============================================================================

export interface SiteConfig {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo?: string;
  favicon?: string;
  socialLinks: SocialLink[];
  contact: ContactInfo;
  theme: ThemeConfig;
  seo: SEOConfig;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLink {
  platform: "instagram" | "twitter" | "linkedin" | "behance" | "dribbble" | "github" | "website";
  url: string;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  address?: string;
}

export interface ThemeConfig {
  template: TemplateId;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: "compact" | "normal" | "relaxed";
  borderRadius: "none" | "small" | "medium" | "large";
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

// ============================================================================
// TEMPLATES
// ============================================================================

export type TemplateId =
  | "minimal"
  | "editorial"
  | "bold"
  | "gallery-focus"
  | "agency"
  | "photographer";

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  thumbnail: string;
  category: "minimal" | "creative" | "professional";
  features: string[];
}

// ============================================================================
// GALLERIES & PROJECTS
// ============================================================================

export interface Gallery {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  category: string;
  tags: string[];
  layout: GalleryLayout;
  items: GalleryItem[];
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type GalleryLayout =
  | "grid"
  | "masonry"
  | "carousel"
  | "fullscreen"
  | "split"
  | "stacked";

export interface GalleryItem {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  width?: number;
  height?: number;
  order: number;
}

// ============================================================================
// PAGES
// ============================================================================

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: PageBlock[];
  isPublished: boolean;
  isHomepage: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type PageBlock =
  | HeroBlock
  | TextBlock
  | GalleryBlock
  | ImageBlock
  | ContactBlock
  | SpacerBlock;

export interface HeroBlock {
  type: "hero";
  id: string;
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  alignment: "left" | "center" | "right";
}

export interface TextBlock {
  type: "text";
  id: string;
  content: string;
  alignment: "left" | "center" | "right";
}

export interface GalleryBlock {
  type: "gallery";
  id: string;
  galleryId: string;
  displayStyle: "full" | "preview";
}

export interface ImageBlock {
  type: "image";
  id: string;
  url: string;
  alt: string;
  caption?: string;
  fullWidth: boolean;
}

export interface ContactBlock {
  type: "contact";
  id: string;
  showEmail: boolean;
  showPhone: boolean;
  showAddress: boolean;
  showForm: boolean;
}

export interface SpacerBlock {
  type: "spacer";
  id: string;
  height: "small" | "medium" | "large";
}

// ============================================================================
// MEDIA LIBRARY
// ============================================================================

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: "image" | "video";
  size: number;
  width?: number;
  height?: number;
  uploadedAt: string;
  tags: string[];
}

// ============================================================================
// STUDIO STATE
// ============================================================================

export interface StudioState {
  site: SiteConfig;
  galleries: Gallery[];
  pages: Page[];
  media: MediaFile[];
  isLoading: boolean;
  isSaving: boolean;
  lastSaved?: string;
}

export interface StudioActions {
  // Site
  updateSite: (updates: Partial<SiteConfig>) => void;
  updateTheme: (updates: Partial<ThemeConfig>) => void;

  // Galleries
  createGallery: (gallery: Omit<Gallery, "id" | "createdAt" | "updatedAt">) => Gallery;
  updateGallery: (id: string, updates: Partial<Gallery>) => void;
  deleteGallery: (id: string) => void;
  reorderGalleries: (ids: string[]) => void;

  // Gallery Items
  addGalleryItem: (galleryId: string, item: Omit<GalleryItem, "id" | "order">) => void;
  updateGalleryItem: (galleryId: string, itemId: string, updates: Partial<GalleryItem>) => void;
  removeGalleryItem: (galleryId: string, itemId: string) => void;
  reorderGalleryItems: (galleryId: string, itemIds: string[]) => void;

  // Pages
  createPage: (page: Omit<Page, "id" | "createdAt" | "updatedAt">) => Page;
  updatePage: (id: string, updates: Partial<Page>) => void;
  deletePage: (id: string) => void;

  // Media
  addMedia: (file: Omit<MediaFile, "id" | "uploadedAt">) => MediaFile;
  deleteMedia: (id: string) => void;

  // Persistence
  save: () => Promise<void>;
  load: () => Promise<void>;
  export: () => string;
}
