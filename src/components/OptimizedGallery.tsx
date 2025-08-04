"use client";

import { useRef } from "react";
import { GalleryConfig } from "../types";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import LazyGallery from "./LazyGallery";

interface GalleryProps {
  galleries: GalleryConfig[];
  className?: string;
}

// Placeholder component for galleries not yet loaded
const GalleryPlaceholder = ({ galleryId }: { galleryId: string }) => (
  <section className="w-full h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
      <p className="text-gray-400 text-sm mt-2">{galleryId}</p>
    </div>
  </section>
);

// Individual gallery wrapper with intersection observer
function OptimizedGalleryItem({ gallery }: { gallery: GalleryConfig }) {
  const { elementRef, isVisible } = useIntersectionObserver({
    rootMargin: "200px", // Start loading 200px before entering viewport
    triggerOnce: true,
  });

  return (
    <div ref={elementRef}>
      {isVisible ? (
        <LazyGallery gallery={gallery} />
      ) : (
        <GalleryPlaceholder galleryId={gallery.id} />
      )}
    </div>
  );
}

const Gallery = ({ galleries, className = "" }: GalleryProps) => {
  const galleryRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={galleryRef} className={`gallery-container ${className}`}>
      {galleries.map((gallery) => (
        <OptimizedGalleryItem key={gallery.id} gallery={gallery} />
      ))}
    </div>
  );
};

export default Gallery;
