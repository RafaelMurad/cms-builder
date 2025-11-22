"use client";

import Link from "next/link";
import { useStudio } from "@/context/StudioContext";
import type { Gallery, GalleryLayout } from "@/types/studio";

const layoutLabels: Record<GalleryLayout, string> = {
  grid: "Grid",
  masonry: "Masonry",
  carousel: "Carousel",
  fullscreen: "Fullscreen",
  split: "Split",
  stacked: "Stacked",
};

export default function GalleriesPage() {
  const { galleries, deleteGallery, updateGallery } = useStudio();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this gallery?")) {
      deleteGallery(id);
    }
  };

  const handleTogglePublish = (gallery: Gallery) => {
    updateGallery(gallery.id, { isPublished: !gallery.isPublished });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Galleries</h1>
          <p className="text-neutral-400">
            Create and manage your portfolio galleries
          </p>
        </div>
        <Link
          href="/studio/galleries/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-neutral-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Gallery
        </Link>
      </div>

      {/* Gallery Grid */}
      {galleries.length === 0 ? (
        <div className="text-center py-20 bg-neutral-800 rounded-xl">
          <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">No galleries yet</h2>
          <p className="text-neutral-400 mb-6">
            Create your first gallery to start showcasing your work
          </p>
          <Link
            href="/studio/galleries/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-neutral-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Gallery
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <div
              key={gallery.id}
              className="bg-neutral-800 rounded-xl overflow-hidden group"
            >
              {/* Cover Image */}
              <Link
                href={`/studio/galleries/${gallery.id}`}
                className="block aspect-video relative bg-neutral-700"
              >
                {gallery.coverImage ? (
                  <img
                    src={gallery.coverImage}
                    alt={gallery.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-medium">Edit Gallery</span>
                </div>
              </Link>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold truncate">{gallery.title}</h3>
                    <p className="text-sm text-neutral-400">
                      {gallery.items.length} items
                    </p>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded ${
                    gallery.isPublished
                      ? "bg-green-500/20 text-green-400"
                      : "bg-neutral-700 text-neutral-400"
                  }`}>
                    {gallery.isPublished ? "Published" : "Draft"}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-neutral-400 mb-4">
                  <span className="capitalize">{layoutLabels[gallery.layout]}</span>
                  <span>-</span>
                  <span>{gallery.category || "Uncategorized"}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/studio/galleries/${gallery.id}`}
                    className="flex-1 px-3 py-2 text-sm font-medium bg-neutral-700 hover:bg-neutral-600 rounded-lg text-center transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleTogglePublish(gallery)}
                    className="px-3 py-2 text-sm font-medium bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors"
                    title={gallery.isPublished ? "Unpublish" : "Publish"}
                  >
                    {gallery.isPublished ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(gallery.id)}
                    className="px-3 py-2 text-sm font-medium bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
