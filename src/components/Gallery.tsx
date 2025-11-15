"use client";

import { useRef } from "react";
import LuxuryGrid from "./LuxuryGrid";
import SimplifiedGallery from "./SimplifiedGallery";
import { GalleryConfig } from "../types";

interface GalleryProps {
  galleries: GalleryConfig[];
  className?: string;
}

const Gallery = ({ galleries, className = "" }: GalleryProps) => {
  const galleryRef = useRef<HTMLDivElement>(null);

  if (!galleries || galleries.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-luxury-gray text-sm">No galleries found.</p>
      </div>
    );
  }

  return (
    <div ref={galleryRef} className={`w-full ${className}`}>
      {/* Luxury Grid showcase */}
      <LuxuryGrid galleries={galleries.slice(0, 9)} />

      {/* Full gallery layouts */}
      <div id="all-work" className="bg-luxury-cream">
        {galleries.map((gallery) => (
          <SimplifiedGallery key={gallery.id} gallery={gallery} />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
