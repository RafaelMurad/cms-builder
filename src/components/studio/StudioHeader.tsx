"use client";

import { useStudio } from "@/context/StudioContext";

export function StudioHeader() {
  const { site, isSaving, lastSaved } = useStudio();

  const formatLastSaved = (date: string) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <header className="h-16 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between px-6">
      {/* Site Name */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-medium">{site.name}</h1>
        <span className="px-2 py-1 text-xs bg-neutral-800 rounded text-neutral-400">
          {site.theme.template}
        </span>
      </div>

      {/* Status & Actions */}
      <div className="flex items-center gap-4">
        {/* Save Status */}
        <div className="flex items-center gap-2 text-sm">
          {isSaving ? (
            <>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-neutral-400">Saving...</span>
            </>
          ) : lastSaved ? (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-neutral-400">
                Saved at {formatLastSaved(lastSaved)}
              </span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-neutral-500 rounded-full" />
              <span className="text-neutral-400">Not saved</span>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-neutral-800" />

        {/* Actions */}
        <button className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors">
          Export
        </button>
        <button className="px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors">
          Publish
        </button>
      </div>
    </header>
  );
}
