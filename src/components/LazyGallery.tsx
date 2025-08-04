"use client";

import { Suspense, lazy } from "react";
import { GalleryConfig } from "../types";

// Lazy load the SimplifiedGallery component
const SimplifiedGallery = lazy(() => import("./SimplifiedGallery"));

interface LazyGalleryProps {
  gallery: GalleryConfig;
}

// Loading fallback component
const GalleryLoadingFallback = ({ galleryId }: { galleryId: string }) => (
  <section className="w-full h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-pulse">
        <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-24 mx-auto"></div>
      </div>
      <p className="text-gray-500 mt-4">Loading {galleryId}...</p>
    </div>
  </section>
);

export default function LazyGallery({ gallery }: LazyGalleryProps) {
  return (
    <Suspense fallback={<GalleryLoadingFallback galleryId={gallery.id} />}>
      <SimplifiedGallery gallery={gallery} />
    </Suspense>
  );
}
