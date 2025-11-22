"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useStudio } from "@/context/StudioContext";
import { GalleryItemCard } from "@/components/studio/GalleryItemCard";
import { ImageUploader } from "@/components/studio/ImageUploader";
import type { Gallery, GalleryLayout, GalleryItem } from "@/types/studio";

const layouts: { id: GalleryLayout; name: string }[] = [
  { id: "grid", name: "Grid" },
  { id: "masonry", name: "Masonry" },
  { id: "carousel", name: "Carousel" },
  { id: "fullscreen", name: "Fullscreen" },
  { id: "split", name: "Split" },
  { id: "stacked", name: "Stacked" },
];

export default function GalleryEditorPage() {
  const router = useRouter();
  const params = useParams();
  const galleryId = params.id as string;

  const { galleries, updateGallery, addGalleryItem, removeGalleryItem, updateGalleryItem } = useStudio();
  const gallery = galleries.find((g) => g.id === galleryId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [layout, setLayout] = useState<GalleryLayout>("grid");
  const [showUploader, setShowUploader] = useState(false);

  useEffect(() => {
    if (gallery) {
      setTitle(gallery.title);
      setDescription(gallery.description);
      setCategory(gallery.category);
      setLayout(gallery.layout);
    }
  }, [gallery]);

  const handleSave = useCallback(() => {
    if (!gallery) return;
    updateGallery(gallery.id, {
      title,
      description,
      category,
      layout,
      slug: title.toLowerCase().replace(/\s+/g, "-"),
    });
  }, [gallery, title, description, category, layout, updateGallery]);

  const handleAddImages = (urls: string[]) => {
    urls.forEach((url) => {
      addGalleryItem(galleryId, {
        type: "image",
        url,
      });
    });
    setShowUploader(false);
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm("Remove this item from the gallery?")) {
      removeGalleryItem(galleryId, itemId);
    }
  };

  const handleSetCover = (item: GalleryItem) => {
    updateGallery(galleryId, { coverImage: item.url });
  };

  const handleTogglePublish = () => {
    if (!gallery) return;
    updateGallery(gallery.id, { isPublished: !gallery.isPublished });
  };

  if (!gallery) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-neutral-400 mb-4">Gallery not found</p>
          <button
            onClick={() => router.push("/studio/galleries")}
            className="text-white underline"
          >
            Back to galleries
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/studio/galleries")}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold">{gallery.title}</h1>
            <p className="text-sm text-neutral-400">
              {gallery.items.length} items - {gallery.isPublished ? "Published" : "Draft"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleTogglePublish}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              gallery.isPublished
                ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                : "bg-neutral-700 hover:bg-neutral-600"
            }`}
          >
            {gallery.isPublished ? "Published" : "Publish"}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-neutral-200 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gallery Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:border-white transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Layout</label>
                <select
                  value={layout}
                  onChange={(e) => setLayout(e.target.value as GalleryLayout)}
                  className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:border-white transition-colors"
                >
                  {layouts.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Cover Image</h2>
            {gallery.coverImage ? (
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <img
                  src={gallery.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => updateGallery(galleryId, { coverImage: undefined })}
                  className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <p className="text-sm text-neutral-400">
                Click &quot;Set as Cover&quot; on any image below
              </p>
            )}
          </div>
        </div>

        {/* Gallery Items */}
        <div className="lg:col-span-2">
          <div className="bg-neutral-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Gallery Items</h2>
              <button
                onClick={() => setShowUploader(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-neutral-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Images
              </button>
            </div>

            {gallery.items.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-neutral-700 rounded-lg">
                <svg className="w-12 h-12 mx-auto mb-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-neutral-400 mb-4">No items in this gallery yet</p>
                <button
                  onClick={() => setShowUploader(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg font-medium transition-colors"
                >
                  Add your first image
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.items.map((item) => (
                  <GalleryItemCard
                    key={item.id}
                    item={item}
                    isCover={gallery.coverImage === item.url}
                    onDelete={() => handleDeleteItem(item.id)}
                    onSetCover={() => handleSetCover(item)}
                    onUpdate={(updates) => updateGalleryItem(galleryId, item.id, updates)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Uploader Modal */}
      {showUploader && (
        <ImageUploader
          onUpload={handleAddImages}
          onClose={() => setShowUploader(false)}
        />
      )}
    </div>
  );
}
