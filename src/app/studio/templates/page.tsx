"use client";

import { useState } from "react";
import { useStudio } from "@/context/StudioContext";
import type { TemplateId } from "@/types/studio";

interface TemplateOption {
  id: TemplateId;
  name: string;
  description: string;
  category: "minimal" | "creative" | "professional";
  features: string[];
  preview: {
    layout: string;
    accent: string;
  };
}

const templates: TemplateOption[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple design with focus on content",
    category: "minimal",
    features: ["Full-screen hero", "Grid galleries", "Subtle animations", "Light/dark mode"],
    preview: { layout: "centered", accent: "#000000" },
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Magazine-style layout with editorial typography",
    category: "creative",
    features: ["Typography-focused", "Long-form content", "Image captions", "Reading mode"],
    preview: { layout: "asymmetric", accent: "#1a1a1a" },
  },
  {
    id: "bold",
    name: "Bold",
    description: "High-impact design with bold colors and typography",
    category: "creative",
    features: ["Large typography", "Color overlays", "Animated transitions", "Statement pieces"],
    preview: { layout: "dynamic", accent: "#ff3366" },
  },
  {
    id: "gallery-focus",
    name: "Gallery Focus",
    description: "Image-first design perfect for photographers",
    category: "minimal",
    features: ["Full-bleed images", "Lightbox viewer", "Slideshow mode", "EXIF data"],
    preview: { layout: "grid", accent: "#333333" },
  },
  {
    id: "agency",
    name: "Agency",
    description: "Professional layout for studios and agencies",
    category: "professional",
    features: ["Case studies", "Team section", "Client logos", "Process showcase"],
    preview: { layout: "sections", accent: "#0066ff" },
  },
  {
    id: "photographer",
    name: "Photographer",
    description: "Elegant design tailored for photography portfolios",
    category: "professional",
    features: ["Photo series", "Before/after", "Client galleries", "Print shop ready"],
    preview: { layout: "masonry", accent: "#8b7355" },
  },
];

const categoryLabels = {
  minimal: "Minimal",
  creative: "Creative",
  professional: "Professional",
};

export default function TemplatesPage() {
  const { site, updateTheme } = useStudio();
  const [filter, setFilter] = useState<"all" | "minimal" | "creative" | "professional">("all");
  const [previewTemplate, setPreviewTemplate] = useState<TemplateId | null>(null);

  const filteredTemplates = filter === "all"
    ? templates
    : templates.filter((t) => t.category === filter);

  const handleSelectTemplate = (templateId: TemplateId) => {
    updateTheme({ template: templateId });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Templates</h1>
        <p className="text-neutral-400">
          Choose a template that matches your style
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-8">
        {(["all", "minimal", "creative", "professional"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === cat
                ? "bg-white text-black"
                : "bg-neutral-800 hover:bg-neutral-700"
            }`}
          >
            {cat === "all" ? "All Templates" : categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className={`bg-neutral-800 rounded-xl overflow-hidden border-2 transition-all ${
              site.theme.template === template.id
                ? "border-white"
                : "border-transparent hover:border-neutral-600"
            }`}
          >
            {/* Preview */}
            <div
              className="aspect-[4/3] relative"
              style={{ backgroundColor: template.preview.accent }}
            >
              <TemplatePreview template={template} />

              {site.theme.template === template.id && (
                <div className="absolute top-3 right-3 px-3 py-1 bg-white text-black text-xs font-medium rounded-full">
                  Active
                </div>
              )}

              {/* Preview Button */}
              <button
                onClick={() => setPreviewTemplate(template.id)}
                className="absolute bottom-3 right-3 px-3 py-1 bg-black/50 hover:bg-black/70 rounded text-sm transition-colors"
              >
                Preview
              </button>
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{template.name}</h3>
                <span className="text-xs text-neutral-400 capitalize">
                  {template.category}
                </span>
              </div>
              <p className="text-sm text-neutral-400 mb-4">
                {template.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-1 mb-4">
                {template.features.slice(0, 3).map((feature) => (
                  <span
                    key={feature}
                    className="px-2 py-1 text-xs bg-neutral-700 rounded"
                  >
                    {feature}
                  </span>
                ))}
                {template.features.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-neutral-700 rounded">
                    +{template.features.length - 3}
                  </span>
                )}
              </div>

              {/* Action */}
              <button
                onClick={() => handleSelectTemplate(template.id)}
                disabled={site.theme.template === template.id}
                className={`w-full py-2 rounded-lg font-medium transition-colors ${
                  site.theme.template === template.id
                    ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                    : "bg-white text-black hover:bg-neutral-200"
                }`}
              >
                {site.theme.template === template.id ? "Currently Active" : "Use Template"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          templateId={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onSelect={() => {
            handleSelectTemplate(previewTemplate);
            setPreviewTemplate(null);
          }}
          isActive={site.theme.template === previewTemplate}
        />
      )}
    </div>
  );
}

// Simple template preview component
function TemplatePreview({ template }: { template: TemplateOption }) {
  // Create visual representation based on template type
  const renderLayout = () => {
    switch (template.id) {
      case "minimal":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-8">
            <div className="w-16 h-1 bg-white/30 mb-4" />
            <div className="w-24 h-1 bg-white/20" />
            <div className="grid grid-cols-3 gap-2 mt-8 w-3/4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-white/10 rounded" />
              ))}
            </div>
          </div>
        );
      case "editorial":
        return (
          <div className="w-full h-full p-6">
            <div className="w-1/2 h-2 bg-white/30 mb-3" />
            <div className="flex gap-4">
              <div className="w-1/2 aspect-[3/4] bg-white/10 rounded" />
              <div className="w-1/2 space-y-2">
                <div className="h-1.5 bg-white/20 w-full" />
                <div className="h-1.5 bg-white/20 w-4/5" />
                <div className="h-1.5 bg-white/20 w-3/4" />
              </div>
            </div>
          </div>
        );
      case "bold":
        return (
          <div className="w-full h-full flex items-center p-6">
            <div className="w-1/2">
              <div className="h-4 bg-white/40 w-3/4 mb-2" />
              <div className="h-4 bg-white/40 w-1/2" />
            </div>
            <div className="w-1/2 aspect-square bg-white/20 rounded-lg" />
          </div>
        );
      case "gallery-focus":
        return (
          <div className="w-full h-full grid grid-cols-2 gap-1 p-4">
            <div className="col-span-2 aspect-[2/1] bg-white/10" />
            <div className="aspect-square bg-white/10" />
            <div className="aspect-square bg-white/10" />
          </div>
        );
      case "agency":
        return (
          <div className="w-full h-full p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="w-8 h-8 bg-white/20 rounded" />
              <div className="flex gap-2">
                <div className="w-12 h-1.5 bg-white/20 rounded" />
                <div className="w-12 h-1.5 bg-white/20 rounded" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[4/3] bg-white/10 rounded" />
              ))}
            </div>
          </div>
        );
      case "photographer":
        return (
          <div className="w-full h-full p-4">
            <div className="grid grid-cols-3 gap-1 h-full">
              <div className="row-span-2 bg-white/10" />
              <div className="bg-white/10" />
              <div className="bg-white/10" />
              <div className="col-span-2 bg-white/10" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="w-full h-full">{renderLayout()}</div>;
}

// Full preview modal
function TemplatePreviewModal({
  templateId,
  onClose,
  onSelect,
  isActive,
}: {
  templateId: TemplateId;
  onClose: () => void;
  onSelect: () => void;
  isActive: boolean;
}) {
  const template = templates.find((t) => t.id === templateId)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-neutral-900 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div>
            <h2 className="text-lg font-semibold">{template.name}</h2>
            <p className="text-sm text-neutral-400">{template.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Preview Area */}
        <div
          className="aspect-video"
          style={{ backgroundColor: template.preview.accent }}
        >
          <TemplatePreview template={template} />
        </div>

        {/* Features */}
        <div className="p-4 border-t border-neutral-800">
          <h3 className="text-sm font-medium mb-2">Features</h3>
          <div className="flex flex-wrap gap-2">
            {template.features.map((feature) => (
              <span
                key={feature}
                className="px-3 py-1 text-sm bg-neutral-800 rounded-full"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
          >
            Close
          </button>
          <button
            onClick={onSelect}
            disabled={isActive}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isActive
                ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                : "bg-white text-black hover:bg-neutral-200"
            }`}
          >
            {isActive ? "Currently Active" : "Use This Template"}
          </button>
        </div>
      </div>
    </div>
  );
}
