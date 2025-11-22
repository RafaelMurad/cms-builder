"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStudio } from "@/context/StudioContext";
import type { GalleryLayout } from "@/types/studio";

const layouts: { id: GalleryLayout; name: string; description: string }[] = [
  { id: "grid", name: "Grid", description: "Classic responsive grid layout" },
  { id: "masonry", name: "Masonry", description: "Pinterest-style masonry layout" },
  { id: "carousel", name: "Carousel", description: "Horizontal scrolling carousel" },
  { id: "fullscreen", name: "Fullscreen", description: "Full-screen slideshow" },
  { id: "split", name: "Split", description: "Two-column split layout" },
  { id: "stacked", name: "Stacked", description: "Vertical stacked layout" },
];

export default function NewGalleryPage() {
  const router = useRouter();
  const { createGallery } = useStudio();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [layout, setLayout] = useState<GalleryLayout>("grid");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    const gallery = createGallery({
      title: title.trim(),
      slug: title.trim().toLowerCase().replace(/\s+/g, "-"),
      description: description.trim(),
      category: category.trim(),
      tags: [],
      layout,
      items: [],
      isPublished: false,
      order: 0,
    });

    router.push(`/studio/galleries/${gallery.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Gallery</h1>
        <p className="text-neutral-400">
          Set up your new gallery and start adding content
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Gallery Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Brand Identity Projects"
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-white transition-colors"
            autoFocus
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this gallery..."
            rows={3}
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-white transition-colors resize-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Branding, Photography, Web Design"
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-white transition-colors"
          />
        </div>

        {/* Layout Selection */}
        <div>
          <label className="block text-sm font-medium mb-4">Layout Style</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {layouts.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLayout(l.id)}
                className={`p-4 rounded-lg border text-left transition-colors ${
                  layout === l.id
                    ? "border-white bg-white/10"
                    : "border-neutral-700 hover:border-neutral-500"
                }`}
              >
                <div className="font-medium mb-1">{l.name}</div>
                <div className="text-xs text-neutral-400">{l.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-colors"
          >
            Create Gallery
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 text-neutral-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
