"use client";

import { useRef } from "react";
import SimplifiedGallery from "./SimplifiedGallery";
import { GalleryConfig } from "../types";

interface GalleryProps {
  galleries: GalleryConfig[];
  className?: string;
}

const Gallery = ({ galleries, className = "" }: GalleryProps) => {
  const galleryRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={galleryRef} className={`gallery-container ${className}`}>
      {galleries.map((gallery) => (
        <SimplifiedGallery key={gallery.id} gallery={gallery} />
      ))}
    </div>
  );
};

export default Gallery;
