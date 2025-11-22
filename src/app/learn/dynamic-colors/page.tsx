"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

/**
 * DYNAMIC COLOR EXTRACTION LEARNING MODULE
 *
 * Learn how to extract dominant colors from images to dynamically
 * theme UI elements and create cohesive designs.
 */

// Sample images for demo
const sampleImages = [
  { id: 1, url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", name: "Mountains" },
  { id: 2, url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop", name: "Portrait" },
  { id: 3, url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop", name: "Ocean" },
  { id: 4, url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&h=300&fit=crop", name: "Plant" },
];

/**
 * Extract dominant color from an image using Canvas API
 *
 * HOW IT WORKS:
 * 1. Draw the image onto a hidden canvas
 * 2. Get pixel data using getImageData()
 * 3. Sample pixels and find the most common color
 * 4. Return as RGB values
 */
function extractDominantColor(img: HTMLImageElement): Promise<{ r: number; g: number; b: number }> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      resolve({ r: 128, g: 128, b: 128 });
      return;
    }

    // Use small size for performance
    const size = 50;
    canvas.width = size;
    canvas.height = size;

    // Draw scaled image
    ctx.drawImage(img, 0, 0, size, size);

    // Get pixel data
    const imageData = ctx.getImageData(0, 0, size, size);
    const pixels = imageData.data;

    // Calculate average color (simple approach)
    let r = 0, g = 0, b = 0;
    let count = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      // Skip very dark or very light pixels
      const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      if (brightness > 20 && brightness < 235) {
        r += pixels[i];
        g += pixels[i + 1];
        b += pixels[i + 2];
        count++;
      }
    }

    if (count > 0) {
      resolve({
        r: Math.round(r / count),
        g: Math.round(g / count),
        b: Math.round(b / count),
      });
    } else {
      resolve({ r: 128, g: 128, b: 128 });
    }
  });
}

// Convert RGB to HSL for better color manipulation
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function DynamicColorsPage() {
  const [selectedImage, setSelectedImage] = useState(sampleImages[0]);
  const [dominantColor, setDominantColor] = useState({ r: 128, g: 128, b: 128 });
  const [isLoading, setIsLoading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Extract color when image loads
  const handleImageLoad = async () => {
    if (imgRef.current) {
      setIsLoading(true);
      const color = await extractDominantColor(imgRef.current);
      setDominantColor(color);
      setIsLoading(false);
    }
  };

  const hsl = rgbToHsl(dominantColor.r, dominantColor.g, dominantColor.b);

  // Generate color palette from dominant color
  const palette = {
    primary: `rgb(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b})`,
    light: `hsl(${hsl.h}, ${hsl.s}%, ${Math.min(hsl.l + 30, 95)}%)`,
    dark: `hsl(${hsl.h}, ${hsl.s}%, ${Math.max(hsl.l - 30, 10)}%)`,
    complement: `hsl(${(hsl.h + 180) % 360}, ${hsl.s}%, ${hsl.l}%)`,
  };

  return (
    <div
      className="min-h-screen transition-colors duration-700"
      style={{ backgroundColor: palette.light }}
    >
      {/* Header */}
      <header
        className="border-b py-6 px-8 transition-colors duration-700"
        style={{ backgroundColor: palette.primary, borderColor: palette.dark }}
      >
        <div className="max-w-6xl mx-auto">
          <Link href="/learn" className="text-white/80 hover:text-white text-sm mb-4 inline-block">
            ← Back to Learning Lab
          </Link>
          <h1 className="text-4xl font-light text-white">Dynamic Color Extraction</h1>
          <p className="text-white/80 mt-2">Extract colors from images to theme your UI</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-12 px-8">
        {/* Demo Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-light text-neutral-900 mb-6">Interactive Demo</h2>
          <p className="text-neutral-600 mb-8">
            Click on different images to see how the page theme changes based on the dominant color.
          </p>

          {/* Image Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {sampleImages.map((img) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className={`relative overflow-hidden rounded-lg transition-transform hover:scale-105 ${
                  selectedImage.id === img.id ? "ring-4 ring-black" : ""
                }`}
              >
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-32 object-cover"
                  crossOrigin="anonymous"
                />
                <span className="absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded">
                  {img.name}
                </span>
              </button>
            ))}
          </div>

          {/* Selected Image and Color Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                ref={imgRef}
                src={selectedImage.url}
                alt={selectedImage.name}
                className="w-full h-64 object-cover"
                crossOrigin="anonymous"
                onLoad={handleImageLoad}
              />
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Extracted Colors</h3>

              {isLoading ? (
                <p className="text-neutral-500">Analyzing image...</p>
              ) : (
                <div className="space-y-4">
                  {/* Color Swatches */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div
                        className="w-full h-20 rounded mb-2"
                        style={{ backgroundColor: palette.primary }}
                      />
                      <p className="text-sm text-neutral-600">Primary</p>
                      <p className="text-xs font-mono">{palette.primary}</p>
                    </div>
                    <div>
                      <div
                        className="w-full h-20 rounded mb-2"
                        style={{ backgroundColor: palette.complement }}
                      />
                      <p className="text-sm text-neutral-600">Complement</p>
                      <p className="text-xs font-mono">{palette.complement}</p>
                    </div>
                    <div>
                      <div
                        className="w-full h-20 rounded mb-2"
                        style={{ backgroundColor: palette.light }}
                      />
                      <p className="text-sm text-neutral-600">Light</p>
                      <p className="text-xs font-mono">{palette.light}</p>
                    </div>
                    <div>
                      <div
                        className="w-full h-20 rounded mb-2"
                        style={{ backgroundColor: palette.dark }}
                      />
                      <p className="text-sm text-neutral-600">Dark</p>
                      <p className="text-xs font-mono">{palette.dark}</p>
                    </div>
                  </div>

                  {/* Raw Values */}
                  <div className="pt-4 border-t">
                    <p className="text-sm text-neutral-600">
                      RGB: ({dominantColor.r}, {dominantColor.g}, {dominantColor.b})
                    </p>
                    <p className="text-sm text-neutral-600">
                      HSL: ({hsl.h}°, {hsl.s}%, {hsl.l}%)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-2xl font-light text-neutral-900 mb-6">How It Works</h2>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-neutral-900 mb-3">1. Canvas API for Pixel Access</h3>
              <pre className="bg-neutral-900 text-green-400 p-4 text-sm overflow-x-auto rounded">
{`// Draw image to canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
ctx.drawImage(img, 0, 0, 50, 50); // Small size for speed

// Get pixel data
const imageData = ctx.getImageData(0, 0, 50, 50);
const pixels = imageData.data; // [R,G,B,A, R,G,B,A, ...]`}
              </pre>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-neutral-900 mb-3">2. Calculate Average Color</h3>
              <pre className="bg-neutral-900 text-green-400 p-4 text-sm overflow-x-auto rounded">
{`let r = 0, g = 0, b = 0, count = 0;

for (let i = 0; i < pixels.length; i += 4) {
  r += pixels[i];     // Red
  g += pixels[i + 1]; // Green
  b += pixels[i + 2]; // Blue
  count++;
}

const avgColor = {
  r: Math.round(r / count),
  g: Math.round(g / count),
  b: Math.round(b / count),
};`}
              </pre>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-neutral-900 mb-3">3. Apply to CSS Variables</h3>
              <pre className="bg-neutral-900 text-green-400 p-4 text-sm overflow-x-auto rounded">
{`// Set CSS variables for dynamic theming
document.documentElement.style.setProperty(
  '--primary-color',
  \`rgb(\${r}, \${g}, \${b})\`
);

// Use in CSS
.themed-element {
  background-color: var(--primary-color);
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section>
          <h2 className="text-2xl font-light text-neutral-900 mb-6">Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-medium mb-2">Portfolio Projects</h3>
              <p className="text-neutral-600 text-sm">
                Theme each project page based on the hero image for a cohesive look.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-medium mb-2">Music Players</h3>
              <p className="text-neutral-600 text-sm">
                Match the UI to album artwork like Spotify does.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-medium mb-2">E-commerce</h3>
              <p className="text-neutral-600 text-sm">
                Adapt product page colors to match the featured item.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
