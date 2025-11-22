"use client";

import { useState, useRef, useCallback } from "react";
import { useStudio } from "@/context/StudioContext";
import type { MediaFile } from "@/types/studio";

export default function MediaPage() {
  const { media, addMedia, deleteMedia } = useStudio();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredMedia = filter === "all"
    ? media
    : media.filter((m) => m.type === filter);

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      Array.from(files).forEach((file) => {
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");

        if (isImage || isVideo) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              addMedia({
                name: file.name,
                url: e.target.result as string,
                type: isImage ? "image" : "video",
                size: file.size,
                tags: [],
              });
            }
          };
          reader.readAsDataURL(file);
        }
      });
    },
    [addMedia]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDeleteSelected = () => {
    if (confirm(`Delete ${selectedMedia.length} item(s)?`)) {
      selectedMedia.forEach((id) => deleteMedia(id));
      setSelectedMedia([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedMedia((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Media Library</h1>
          <p className="text-neutral-400">
            {media.length} file{media.length !== 1 ? "s" : ""} uploaded
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-neutral-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Filter */}
          <div className="flex gap-1 bg-neutral-800 rounded-lg p-1">
            {(["all", "image", "video"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  filter === f ? "bg-white text-black" : "hover:bg-neutral-700"
                }`}
              >
                {f === "all" ? "All" : f === "image" ? "Images" : "Videos"}
              </button>
            ))}
          </div>

          {/* View Mode */}
          <div className="flex gap-1 bg-neutral-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition-colors ${
                viewMode === "grid" ? "bg-white text-black" : "hover:bg-neutral-700"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition-colors ${
                viewMode === "list" ? "bg-white text-black" : "hover:bg-neutral-700"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedMedia.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-400">
              {selectedMedia.length} selected
            </span>
            <button
              onClick={() => setSelectedMedia([])}
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleDeleteSelected}
              className="px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-sm font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Drop Zone / Content */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`min-h-[400px] rounded-xl transition-colors ${
          isDragging ? "border-2 border-dashed border-white bg-white/5" : ""
        }`}
      >
        {filteredMedia.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 bg-neutral-800 rounded-xl">
            <svg className="w-16 h-16 text-neutral-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">No media yet</h2>
            <p className="text-neutral-400 mb-6">
              Drag and drop files here or click to upload
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-neutral-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload Files
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredMedia.map((file) => (
              <MediaCard
                key={file.id}
                file={file}
                isSelected={selectedMedia.includes(file.id)}
                onSelect={() => toggleSelect(file.id)}
                onDelete={() => {
                  if (confirm("Delete this file?")) {
                    deleteMedia(file.id);
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-neutral-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="w-10 p-4">
                    <input
                      type="checkbox"
                      checked={selectedMedia.length === filteredMedia.length && filteredMedia.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMedia(filteredMedia.map((f) => f.id));
                        } else {
                          setSelectedMedia([]);
                        }
                      }}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Name</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Type</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Size</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Date</th>
                  <th className="w-20 p-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredMedia.map((file) => (
                  <tr
                    key={file.id}
                    className="border-b border-neutral-700 hover:bg-neutral-750"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedMedia.includes(file.id)}
                        onChange={() => toggleSelect(file.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-700 rounded overflow-hidden">
                          {file.type === "image" ? (
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              src={file.url}
                              className="w-full h-full object-cover"
                              muted
                            />
                          )}
                        </div>
                        <span className="font-medium truncate max-w-[200px]">
                          {file.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-neutral-400 capitalize">
                      {file.type}
                    </td>
                    <td className="p-4 text-sm text-neutral-400">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="p-4 text-sm text-neutral-400">
                      {formatDate(file.uploadedAt)}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          if (confirm("Delete this file?")) {
                            deleteMedia(file.id);
                          }
                        }}
                        className="p-2 text-neutral-400 hover:text-red-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Grid view card component
function MediaCard({
  file,
  isSelected,
  onSelect,
  onDelete,
}: {
  file: MediaFile;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`relative rounded-lg overflow-hidden group ${
        isSelected ? "ring-2 ring-white" : ""
      }`}
    >
      <div className="aspect-square bg-neutral-700">
        {file.type === "image" ? (
          <img
            src={file.url}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={file.url}
            className="w-full h-full object-cover"
            muted
          />
        )}
      </div>

      {/* Checkbox */}
      <div className="absolute top-2 left-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 rounded opacity-0 group-hover:opacity-100 transition-opacity checked:opacity-100"
        />
      </div>

      {/* Actions */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onDelete}
          className="p-1.5 bg-black/60 hover:bg-red-500/80 rounded transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Video indicator */}
      {file.type === "video" && (
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 rounded text-xs">
          Video
        </div>
      )}
    </div>
  );
}
