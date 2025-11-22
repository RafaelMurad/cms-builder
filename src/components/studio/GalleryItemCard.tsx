"use client";

import { useState } from "react";
import type { GalleryItem } from "@/types/studio";

interface GalleryItemCardProps {
  item: GalleryItem;
  isCover: boolean;
  onDelete: () => void;
  onSetCover: () => void;
  onUpdate: (updates: Partial<GalleryItem>) => void;
}

export function GalleryItemCard({
  item,
  isCover,
  onDelete,
  onSetCover,
  onUpdate,
}: GalleryItemCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(item.title || "");
  const [description, setDescription] = useState(item.description || "");

  const handleSaveEdit = () => {
    onUpdate({ title: title.trim() || undefined, description: description.trim() || undefined });
    setEditMode(false);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden bg-neutral-700">
      {/* Image */}
      <div className="aspect-square">
        {item.type === "image" ? (
          <img
            src={item.url}
            alt={item.title || "Gallery item"}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={item.url}
            className="w-full h-full object-cover"
            muted
          />
        )}
      </div>

      {/* Cover Badge */}
      {isCover && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-white text-black text-xs font-medium rounded">
          Cover
        </div>
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button
          onClick={() => setEditMode(true)}
          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          title="Edit"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        {!isCover && (
          <button
            onClick={onSetCover}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            title="Set as Cover"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        )}
        <button
          onClick={onDelete}
          className="p-2 bg-red-500/50 hover:bg-red-500/70 rounded-lg transition-colors"
          title="Delete"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Title/Description Display */}
      {(item.title || item.description) && !editMode && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
          {item.title && <p className="text-sm font-medium truncate">{item.title}</p>}
          {item.description && (
            <p className="text-xs text-neutral-300 truncate">{item.description}</p>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editMode && (
        <div className="absolute inset-0 bg-neutral-900/95 p-4 flex flex-col">
          <h3 className="text-sm font-medium mb-3">Edit Item</h3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full px-2 py-1 text-sm bg-neutral-700 border border-neutral-600 rounded mb-2"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={2}
            className="w-full px-2 py-1 text-sm bg-neutral-700 border border-neutral-600 rounded resize-none flex-1"
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSaveEdit}
              className="flex-1 py-1 text-sm bg-white text-black rounded hover:bg-neutral-200 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="px-3 py-1 text-sm bg-neutral-700 rounded hover:bg-neutral-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
