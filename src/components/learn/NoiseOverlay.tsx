"use client";

/**
 * =============================================================================
 * NOISE/GRAIN TEXTURE OVERLAY - Educational Implementation
 * =============================================================================
 *
 * WHAT IS A NOISE OVERLAY?
 * ------------------------
 * A noise or film grain overlay adds a subtle texture layer on top of your
 * design, creating a more organic, editorial, or vintage aesthetic. This
 * technique is popular with luxury brands and creative studios.
 *
 * HOW IT WORKS:
 * -------------
 * There are several approaches:
 *
 * 1. SVG Filter (this implementation):
 *    - Uses SVG <feTurbulence> to generate noise
 *    - Applied via CSS filter or as an overlay
 *    - Pros: Vector-based, customizable, animatable
 *    - Cons: Can be performance-heavy if animated
 *
 * 2. CSS Background Image:
 *    - Uses a small repeating noise PNG
 *    - Pros: Simple, performant
 *    - Cons: Less customizable
 *
 * 3. Canvas:
 *    - Programmatically generates noise pixels
 *    - Pros: Fully customizable, can animate
 *    - Cons: More complex implementation
 *
 * VISUAL IMPACT:
 * --------------
 * - Adds depth and texture to flat designs
 * - Creates a premium, editorial feel
 * - Can mask imperfections in images
 * - Softens digital harshness
 *
 * PERFORMANCE TIPS:
 * -----------------
 * - Keep opacity very low (0.03-0.1)
 * - Avoid animating at high frequencies
 * - Use will-change sparingly
 * - Consider reduced motion preferences
 */

interface NoiseOverlayProps {
  /** Opacity of the noise effect (0-1). Default: 0.05 */
  opacity?: number;
  /** Base frequency of the noise. Lower = larger grain. Default: 0.65 */
  baseFrequency?: number;
  /** Number of octaves. More = more detail. Default: 4 */
  numOctaves?: number;
  /** Blend mode for the overlay. Default: "overlay" */
  blendMode?: "overlay" | "multiply" | "screen" | "soft-light" | "normal";
  /** Whether to animate the noise. Default: false */
  animate?: boolean;
  /** Fixed position (covers viewport) or absolute (covers parent). Default: "fixed" */
  position?: "fixed" | "absolute";
}

export default function NoiseOverlay({
  opacity = 0.05,
  baseFrequency = 0.65,
  numOctaves = 4,
  blendMode = "overlay",
  animate = false,
  position = "fixed",
}: NoiseOverlayProps) {
  return (
    <>
      {/*
        SVG FILTER DEFINITION
        ---------------------
        This SVG defines the noise pattern. It's placed in the DOM but
        visually hidden. The filter is then referenced by its ID.

        <feTurbulence> parameters:
        - type: "fractalNoise" creates organic noise, "turbulence" is more chaotic
        - baseFrequency: Controls grain size (0.5-1 for fine grain)
        - numOctaves: Adds detail layers (1-4 is typical)
        - stitchTiles: "stitch" makes the noise seamlessly tile
      */}
      <svg className="hidden" aria-hidden="true">
        <filter id="noise-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={baseFrequency}
            numOctaves={numOctaves}
            stitchTiles="stitch"
          />
          {/* Convert to grayscale and adjust contrast */}
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      {/*
        NOISE OVERLAY LAYER
        -------------------
        This div covers the entire viewport (or parent) and displays
        the noise pattern. Key styling:

        - pointer-events: none - Allows clicking through the overlay
        - mix-blend-mode - Controls how noise interacts with content below
        - Very low opacity - Subtle effect is key
      */}
      <div
        className={`
          ${position} inset-0 z-50
          pointer-events-none
          motion-reduce:hidden
          ${animate ? "animate-noise" : ""}
        `}
        style={{
          opacity,
          mixBlendMode: blendMode,
          filter: "url(#noise-filter)",
          // Cover entire area
          width: "100%",
          height: "100%",
        }}
        aria-hidden="true"
      />

      {/*
        ANIMATION KEYFRAMES (if needed)
        Add this to your global CSS:

        @keyframes noise {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -1%); }
          20% { transform: translate(1%, 1%); }
          30% { transform: translate(-1%, 1%); }
          40% { transform: translate(1%, -1%); }
          50% { transform: translate(-1%, 0); }
          60% { transform: translate(1%, 0); }
          70% { transform: translate(0, 1%); }
          80% { transform: translate(0, -1%); }
          90% { transform: translate(1%, 1%); }
        }

        .animate-noise {
          animation: noise 0.5s steps(3) infinite;
        }
      */}
    </>
  );
}

/**
 * =============================================================================
 * ALTERNATIVE: CSS-ONLY NOISE
 * =============================================================================
 *
 * For simpler implementations, you can use a base64 encoded noise image:
 *
 * .noise-overlay {
 *   position: fixed;
 *   inset: 0;
 *   pointer-events: none;
 *   opacity: 0.05;
 *   background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E");
 *   mix-blend-mode: overlay;
 * }
 */

/**
 * =============================================================================
 * USAGE EXAMPLES
 * =============================================================================
 *
 * Basic Usage (add to layout):
 * ----------------------------
 * <NoiseOverlay />
 *
 * Stronger Effect:
 * ----------------
 * <NoiseOverlay opacity={0.1} blendMode="soft-light" />
 *
 * Animated Film Grain:
 * --------------------
 * <NoiseOverlay animate opacity={0.08} />
 *
 * Local to a Section:
 * -------------------
 * <div className="relative">
 *   <NoiseOverlay position="absolute" />
 *   <YourContent />
 * </div>
 */
