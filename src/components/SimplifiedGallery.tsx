"use client";

import { GalleryConfig } from "../types";
import SimpleCarousel from "./SimpleCarousel";
import MediaItem from "./MediaItem";
import { getSimpleAnimation } from "../utils/animationConfigs";

interface SimplifiedGalleryProps {
  gallery: GalleryConfig;
}

export default function SimplifiedGallery({ gallery }: SimplifiedGalleryProps) {
  // Early return if no items
  if (!gallery.items || gallery.items.length === 0) {
    return (
      <section className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            {gallery.title || 'Gallery'}
          </h2>
          <p className="text-gray-500">No content available</p>
        </div>
      </section>
    );
  }

  // Get simplified animation type
  const animationType = gallery.animation?.effect === 'slide' ? 'slide' : 
                       gallery.animation?.effect === 'none' ? 'none' : 'fade';

  // Build container styles from configuration
  const getContainerStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {};
    
    if (gallery.galleryContainer) {
      Object.entries(gallery.galleryContainer).forEach(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number') {
          (styles as any)[key] = value;
        }
      });
    }
    
    return styles;
  };

  const getInnerContainerStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {};
    
    if (gallery.container) {
      if (gallery.container.width) styles.width = gallery.container.width;
      if (gallery.container.maxWidth) styles.maxWidth = gallery.container.maxWidth;
      if (gallery.container.height) styles.height = gallery.container.height;
      if (gallery.container.minHeight) styles.minHeight = gallery.container.minHeight;
      if (gallery.container.maxHeight) styles.maxHeight = gallery.container.maxHeight;
      if (gallery.container.background) styles.backgroundColor = gallery.container.background;
      if (gallery.container.borderRadius) styles.borderRadius = gallery.container.borderRadius;
      if (gallery.container.padding) styles.padding = gallery.container.padding;
      if (gallery.container.margin) styles.margin = gallery.container.margin;
      if (gallery.container.aspectRatio) styles.aspectRatio = gallery.container.aspectRatio;
      
      // Handle alignment
      if (gallery.container.alignment === 'center') {
        styles.marginLeft = 'auto';
        styles.marginRight = 'auto';
      }
    }
    
    return styles;
  };

  // Render based on layout type
  const renderContent = () => {
    switch (gallery.layout) {
      case 'carousel':
      case 'fullscreen':
        return (
          <SimpleCarousel
            items={gallery.items}
            animationType={animationType}
            autoAdvanceTime={gallery.transitionTime}
            className="w-full h-full"
          />
        );

      case 'grid':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {gallery.items.map((item, index) => (
              <div key={item.id} className="aspect-square relative">
                <MediaItem item={item} priority={index < 6} />
              </div>
            ))}
          </div>
        );

      case 'masonry':
        return (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 p-4">
            {gallery.items.map((item, index) => (
              <div key={item.id} className="break-inside-avoid mb-4 relative">
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
    <section 
      className="relative"
      style={getContainerStyles()}
    >
      <div 
        className="relative"
        style={getInnerContainerStyles()}
      >
        {renderContent()}
      </div>
    </section>
  );
}
