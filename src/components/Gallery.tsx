"use client";

import { useRef } from "react";
import BentoGrid from "./BentoGrid";
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
        <p className="text-white/50 text-xl">No galleries found.</p>
      </div>
    );
  }

  return (
    <div ref={galleryRef} className={`w-full ${className}`}>
      {/* Bento Grid showcase */}
      <BentoGrid galleries={galleries.slice(0, 6)} />

      {/* Full gallery layouts */}
      <div id="all-work">
        {galleries.map((gallery) => (
          <SimplifiedGallery key={gallery.id} gallery={gallery} />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
