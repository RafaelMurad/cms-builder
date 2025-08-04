"use client";

import { GalleryConfig } from "../types";
import SimpleCarousel from "./SimpleCarousel";
import MediaItem from "./MediaItem";
import { getSimpleAnimation } from "../utils/animationConfigs";
import { GALLERY_STYLE_PRESETS } from "../data/simpleGalleryConfig";

interface SimplifiedGalleryProps {
  gallery: GalleryConfig & { stylePreset?: string };
}

export default function SimplifiedGallery({ gallery }: SimplifiedGalleryProps) {
  // Early return if no items
  if (!gallery.items || gallery.items.length === 0) {
    return (
      <section className="flex items-center justify-center h-screen bg-neutral-50">
        <div className="text-center">
          <h2 className="text-xl font-medium text-neutral-600 mb-2">
            {gallery.title || "Gallery"}
          </h2>
          <p className="text-neutral-400">No content available</p>
        </div>
      </section>
    );
  }

  // Get simplified animation type
  const animationType =
    gallery.animation?.effect === "slide"
      ? "slide"
      : gallery.animation?.effect === "none"
      ? "none"
      : "fade";

  // Get style preset
  const stylePreset = gallery.stylePreset || "default";
  const styles =
    GALLERY_STYLE_PRESETS[stylePreset as keyof typeof GALLERY_STYLE_PRESETS] ||
    GALLERY_STYLE_PRESETS.default;

  // Render based on layout type
  const renderContent = () => {
    switch (gallery.layout) {
      case "carousel":
      case "fullscreen":
        return (
          <SimpleCarousel
            items={gallery.items}
            animationType={animationType}
            autoAdvanceTime={gallery.transitionTime}
            className="w-full h-full"
          />
        );

      case "grid":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {gallery.items.map((item, index) => (
              <div key={item.id} className="aspect-square relative">
                <MediaItem item={item} priority={index < 6} />
              </div>
            ))}
          </div>
        );

      default:
        return (
          <SimpleCarousel
            items={gallery.items}
            animationType="fade"
            autoAdvanceTime={gallery.transitionTime}
            className="w-full h-full"
          />
        );
    }
  };

  return (
    <section className="h-screen w-full flex items-center justify-center bg-neutral-50 relative">
      <div className="w-full h-full">{renderContent()}</div>
    </section>
  );
}
