"use client";

import React, { createContext, useContext, useReducer, useCallback, useEffect } from "react";
import type {
  StudioState,
  StudioActions,
  SiteConfig,
  ThemeConfig,
  Gallery,
  GalleryItem,
  Page,
  MediaFile,
} from "@/types/studio";

// ============================================================================
// STORAGE KEY
// ============================================================================

const STORAGE_KEY = "haus-studio-data";

// ============================================================================
// DEFAULT STATE
// ============================================================================

const defaultSiteConfig: SiteConfig = {
  id: "default",
  name: "My Portfolio",
  tagline: "Creative Work",
  description: "A beautiful portfolio showcasing my work",
  socialLinks: [],
  contact: {
    email: "hello@example.com",
  },
  theme: {
    template: "minimal",
    colors: {
      primary: "#000000",
      secondary: "#666666",
      background: "#ffffff",
      text: "#1a1a1a",
      accent: "#0066ff",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    spacing: "normal",
    borderRadius: "small",
  },
  seo: {
    title: "My Portfolio",
    description: "A beautiful portfolio showcasing my work",
    keywords: ["portfolio", "creative", "design"],
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const defaultState: StudioState = {
  site: defaultSiteConfig,
  galleries: [],
  pages: [],
  media: [],
  isLoading: false,
  isSaving: false,
};

// ============================================================================
// ACTION TYPES
// ============================================================================

type StudioAction =
  | { type: "SET_STATE"; payload: StudioState }
  | { type: "UPDATE_SITE"; payload: Partial<SiteConfig> }
  | { type: "UPDATE_THEME"; payload: Partial<ThemeConfig> }
  | { type: "SET_GALLERIES"; payload: Gallery[] }
  | { type: "ADD_GALLERY"; payload: Gallery }
  | { type: "UPDATE_GALLERY"; payload: { id: string; updates: Partial<Gallery> } }
  | { type: "DELETE_GALLERY"; payload: string }
  | { type: "ADD_GALLERY_ITEM"; payload: { galleryId: string; item: GalleryItem } }
  | { type: "UPDATE_GALLERY_ITEM"; payload: { galleryId: string; itemId: string; updates: Partial<GalleryItem> } }
  | { type: "REMOVE_GALLERY_ITEM"; payload: { galleryId: string; itemId: string } }
  | { type: "REORDER_GALLERY_ITEMS"; payload: { galleryId: string; itemIds: string[] } }
  | { type: "SET_PAGES"; payload: Page[] }
  | { type: "ADD_PAGE"; payload: Page }
  | { type: "UPDATE_PAGE"; payload: { id: string; updates: Partial<Page> } }
  | { type: "DELETE_PAGE"; payload: string }
  | { type: "ADD_MEDIA"; payload: MediaFile }
  | { type: "DELETE_MEDIA"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SAVING"; payload: boolean }
  | { type: "SET_LAST_SAVED"; payload: string };

// ============================================================================
// REDUCER
// ============================================================================

function studioReducer(state: StudioState, action: StudioAction): StudioState {
  switch (action.type) {
    case "SET_STATE":
      return action.payload;

    case "UPDATE_SITE":
      return {
        ...state,
        site: {
          ...state.site,
          ...action.payload,
          updatedAt: new Date().toISOString(),
        },
      };

    case "UPDATE_THEME":
      return {
        ...state,
        site: {
          ...state.site,
          theme: { ...state.site.theme, ...action.payload },
          updatedAt: new Date().toISOString(),
        },
      };

    case "SET_GALLERIES":
      return { ...state, galleries: action.payload };

    case "ADD_GALLERY":
      return { ...state, galleries: [...state.galleries, action.payload] };

    case "UPDATE_GALLERY":
      return {
        ...state,
        galleries: state.galleries.map((g) =>
          g.id === action.payload.id
            ? { ...g, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : g
        ),
      };

    case "DELETE_GALLERY":
      return {
        ...state,
        galleries: state.galleries.filter((g) => g.id !== action.payload),
      };

    case "ADD_GALLERY_ITEM": {
      return {
        ...state,
        galleries: state.galleries.map((g) =>
          g.id === action.payload.galleryId
            ? {
                ...g,
                items: [...g.items, action.payload.item],
                updatedAt: new Date().toISOString(),
              }
            : g
        ),
      };
    }

    case "UPDATE_GALLERY_ITEM": {
      return {
        ...state,
        galleries: state.galleries.map((g) =>
          g.id === action.payload.galleryId
            ? {
                ...g,
                items: g.items.map((item) =>
                  item.id === action.payload.itemId
                    ? { ...item, ...action.payload.updates }
                    : item
                ),
                updatedAt: new Date().toISOString(),
              }
            : g
        ),
      };
    }

    case "REMOVE_GALLERY_ITEM": {
      return {
        ...state,
        galleries: state.galleries.map((g) =>
          g.id === action.payload.galleryId
            ? {
                ...g,
                items: g.items.filter((item) => item.id !== action.payload.itemId),
                updatedAt: new Date().toISOString(),
              }
            : g
        ),
      };
    }

    case "REORDER_GALLERY_ITEMS": {
      return {
        ...state,
        galleries: state.galleries.map((g) => {
          if (g.id !== action.payload.galleryId) return g;
          const reorderedItems = action.payload.itemIds
            .map((id, index) => {
              const item = g.items.find((i) => i.id === id);
              return item ? { ...item, order: index } : null;
            })
            .filter((item): item is GalleryItem => item !== null);
          return { ...g, items: reorderedItems, updatedAt: new Date().toISOString() };
        }),
      };
    }

    case "SET_PAGES":
      return { ...state, pages: action.payload };

    case "ADD_PAGE":
      return { ...state, pages: [...state.pages, action.payload] };

    case "UPDATE_PAGE":
      return {
        ...state,
        pages: state.pages.map((p) =>
          p.id === action.payload.id
            ? { ...p, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : p
        ),
      };

    case "DELETE_PAGE":
      return {
        ...state,
        pages: state.pages.filter((p) => p.id !== action.payload),
      };

    case "ADD_MEDIA":
      return { ...state, media: [...state.media, action.payload] };

    case "DELETE_MEDIA":
      return {
        ...state,
        media: state.media.filter((m) => m.id !== action.payload),
      };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_SAVING":
      return { ...state, isSaving: action.payload };

    case "SET_LAST_SAVED":
      return { ...state, lastSaved: action.payload };

    default:
      return state;
  }
}

// ============================================================================
// CONTEXT
// ============================================================================

interface StudioContextValue extends StudioState, StudioActions {}

const StudioContext = createContext<StudioContextValue | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(studioReducer, defaultState);

  // Generate unique IDs
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Load from localStorage on mount
  useEffect(() => {
    load();
  }, []);

  // Auto-save on state changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (state.galleries.length > 0 || state.pages.length > 0) {
        save();
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [state.site, state.galleries, state.pages, state.media]);

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const updateSite = useCallback((updates: Partial<SiteConfig>) => {
    dispatch({ type: "UPDATE_SITE", payload: updates });
  }, []);

  const updateTheme = useCallback((updates: Partial<ThemeConfig>) => {
    dispatch({ type: "UPDATE_THEME", payload: updates });
  }, []);

  const createGallery = useCallback(
    (gallery: Omit<Gallery, "id" | "createdAt" | "updatedAt">): Gallery => {
      const now = new Date().toISOString();
      const newGallery: Gallery = {
        ...gallery,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      dispatch({ type: "ADD_GALLERY", payload: newGallery });
      return newGallery;
    },
    []
  );

  const updateGallery = useCallback((id: string, updates: Partial<Gallery>) => {
    dispatch({ type: "UPDATE_GALLERY", payload: { id, updates } });
  }, []);

  const deleteGallery = useCallback((id: string) => {
    dispatch({ type: "DELETE_GALLERY", payload: id });
  }, []);

  const reorderGalleries = useCallback((ids: string[]) => {
    const reorderedGalleries = ids
      .map((id, index) => {
        const gallery = state.galleries.find((g) => g.id === id);
        return gallery ? { ...gallery, order: index } : null;
      })
      .filter((g): g is Gallery => g !== null);
    dispatch({ type: "SET_GALLERIES", payload: reorderedGalleries });
  }, [state.galleries]);

  const addGalleryItem = useCallback(
    (galleryId: string, item: Omit<GalleryItem, "id" | "order">) => {
      const gallery = state.galleries.find((g) => g.id === galleryId);
      const newItem: GalleryItem = {
        ...item,
        id: generateId(),
        order: gallery?.items.length ?? 0,
      };
      dispatch({ type: "ADD_GALLERY_ITEM", payload: { galleryId, item: newItem } });
    },
    [state.galleries]
  );

  const updateGalleryItem = useCallback(
    (galleryId: string, itemId: string, updates: Partial<GalleryItem>) => {
      dispatch({ type: "UPDATE_GALLERY_ITEM", payload: { galleryId, itemId, updates } });
    },
    []
  );

  const removeGalleryItem = useCallback((galleryId: string, itemId: string) => {
    dispatch({ type: "REMOVE_GALLERY_ITEM", payload: { galleryId, itemId } });
  }, []);

  const reorderGalleryItems = useCallback((galleryId: string, itemIds: string[]) => {
    dispatch({ type: "REORDER_GALLERY_ITEMS", payload: { galleryId, itemIds } });
  }, []);

  const createPage = useCallback(
    (page: Omit<Page, "id" | "createdAt" | "updatedAt">): Page => {
      const now = new Date().toISOString();
      const newPage: Page = {
        ...page,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      dispatch({ type: "ADD_PAGE", payload: newPage });
      return newPage;
    },
    []
  );

  const updatePage = useCallback((id: string, updates: Partial<Page>) => {
    dispatch({ type: "UPDATE_PAGE", payload: { id, updates } });
  }, []);

  const deletePage = useCallback((id: string) => {
    dispatch({ type: "DELETE_PAGE", payload: id });
  }, []);

  const addMedia = useCallback(
    (file: Omit<MediaFile, "id" | "uploadedAt">): MediaFile => {
      const newMedia: MediaFile = {
        ...file,
        id: generateId(),
        uploadedAt: new Date().toISOString(),
      };
      dispatch({ type: "ADD_MEDIA", payload: newMedia });
      return newMedia;
    },
    []
  );

  const deleteMedia = useCallback((id: string) => {
    dispatch({ type: "DELETE_MEDIA", payload: id });
  }, []);

  // ============================================================================
  // PERSISTENCE
  // ============================================================================

  const save = useCallback(async () => {
    dispatch({ type: "SET_SAVING", payload: true });
    try {
      const dataToSave = {
        site: state.site,
        galleries: state.galleries,
        pages: state.pages,
        media: state.media,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      dispatch({ type: "SET_LAST_SAVED", payload: new Date().toISOString() });
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      dispatch({ type: "SET_SAVING", payload: false });
    }
  }, [state.site, state.galleries, state.pages, state.media]);

  const load = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        dispatch({
          type: "SET_STATE",
          payload: {
            ...defaultState,
            ...data,
            isLoading: false,
            isSaving: false,
          },
        });
      }
    } catch (error) {
      console.error("Failed to load:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const exportData = useCallback(() => {
    return JSON.stringify(
      {
        site: state.site,
        galleries: state.galleries,
        pages: state.pages,
        media: state.media,
      },
      null,
      2
    );
  }, [state.site, state.galleries, state.pages, state.media]);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: StudioContextValue = {
    ...state,
    updateSite,
    updateTheme,
    createGallery,
    updateGallery,
    deleteGallery,
    reorderGalleries,
    addGalleryItem,
    updateGalleryItem,
    removeGalleryItem,
    reorderGalleryItems,
    createPage,
    updatePage,
    deletePage,
    addMedia,
    deleteMedia,
    save,
    load,
    export: exportData,
  };

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

// ============================================================================
// HOOK
// ============================================================================

export function useStudio() {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error("useStudio must be used within a StudioProvider");
  }
  return context;
}
