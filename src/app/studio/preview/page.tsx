"use client";

import { useState } from "react";
import { useStudio } from "@/context/StudioContext";
import { PreviewRenderer } from "@/components/studio/PreviewRenderer";

type DeviceMode = "desktop" | "tablet" | "mobile";

const deviceSizes: Record<DeviceMode, { width: string; label: string }> = {
  desktop: { width: "100%", label: "Desktop" },
  tablet: { width: "768px", label: "Tablet" },
  mobile: { width: "375px", label: "Mobile" },
};

export default function PreviewPage() {
  const { site, galleries } = useStudio();
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [showGrid, setShowGrid] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-neutral-950">
      {/* Preview Header */}
      <div className="h-14 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <a
            href="/studio"
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Studio
          </a>
          <div className="h-6 w-px bg-neutral-700" />
          <span className="text-sm font-medium">{site.name}</span>
        </div>

        {/* Device Selector */}
        <div className="flex items-center gap-2">
          {(["desktop", "tablet", "mobile"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              className={`p-2 rounded-lg transition-colors ${
                device === d
                  ? "bg-white text-black"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800"
              }`}
              title={deviceSizes[d].label}
            >
              {d === "desktop" && (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )}
              {d === "tablet" && (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              )}
              {d === "mobile" && (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-lg transition-colors ${
              showGrid
                ? "bg-blue-500/20 text-blue-400"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            }`}
            title="Toggle Grid"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </button>
          <button
            onClick={() => window.open("/studio/preview", "_blank")}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            title="Open in New Tab"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto bg-neutral-800 p-4 flex justify-center">
        <div
          className="bg-white transition-all duration-300 shadow-2xl"
          style={{
            width: deviceSizes[device].width,
            maxWidth: "100%",
            minHeight: "100%",
          }}
        >
          <PreviewRenderer
            site={site}
            galleries={galleries}
            showGrid={showGrid}
          />
        </div>
      </div>
    </div>
  );
}
