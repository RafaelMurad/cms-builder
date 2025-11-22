"use client";

import { useRef, useState } from "react";

/**
 * =============================================================================
 * MAGNETIC BUTTON COMPONENT - Educational Implementation
 * =============================================================================
 *
 * WHAT IS A MAGNETIC BUTTON?
 * --------------------------
 * A magnetic button creates an effect where the button (and optionally its
 * content) appears to be attracted to the cursor when hovering nearby.
 * This creates a playful, premium interaction commonly seen on award-winning
 * creative studio websites.
 *
 * HOW IT WORKS:
 * -------------
 * 1. We track the mouse position relative to the button's center
 * 2. We calculate the distance from center
 * 3. Within a certain radius, we apply a transform that moves the button
 *    toward the cursor
 * 4. The movement is proportional to how far the cursor is from center
 *
 * KEY CONCEPTS:
 * -------------
 * - getBoundingClientRect(): Gets element position and dimensions
 * - CSS transform: translate() for smooth GPU-accelerated movement
 * - Transition timing: Creates smooth, organic movement
 * - Math for calculating direction and distance
 *
 * WHEN TO USE:
 * ------------
 * - Call-to-action buttons
 * - Navigation links
 * - Interactive icons
 * - Any element you want to draw attention to
 *
 * ACCESSIBILITY CONSIDERATIONS:
 * -----------------------------
 * - Effect is purely visual enhancement
 * - Button remains fully functional without the effect
 * - Consider reducing motion for users who prefer it
 */

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  /** Strength of the magnetic effect (0-1). Default: 0.3 */
  strength?: number;
  /** Radius in pixels where the effect activates. Default: 100 */
  radius?: number;
  /** Whether the inner content also moves. Default: true */
  moveContent?: boolean;
}

export default function MagneticButton({
  children,
  className = "",
  strength = 0.3,
  radius = 100,
  moveContent = true,
}: MagneticButtonProps) {
  // Refs to store the button element
  const buttonRef = useRef<HTMLButtonElement>(null);

  // State for the transform values
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [contentPosition, setContentPosition] = useState({ x: 0, y: 0 });

  /**
   * Calculate the magnetic effect based on mouse position
   *
   * MATH EXPLANATION:
   * -----------------
   * 1. Get button's bounding rectangle
   * 2. Calculate the center point of the button
   * 3. Calculate mouse offset from center
   * 4. Apply strength multiplier to create movement
   *
   * The closer the mouse is to the edge of the button,
   * the stronger the pull effect (up to our strength limit)
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    // Get button's position and dimensions
    const rect = buttonRef.current.getBoundingClientRect();

    // Calculate the center of the button
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate how far the mouse is from center
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    // Calculate distance from center
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Only apply effect within our radius
    if (distance < radius) {
      // Calculate the movement amount (proportional to distance)
      // The strength parameter controls maximum movement
      const moveX = deltaX * strength;
      const moveY = deltaY * strength;

      setPosition({ x: moveX, y: moveY });

      // Content moves slightly more for a layered effect
      if (moveContent) {
        setContentPosition({ x: moveX * 1.5, y: moveY * 1.5 });
      }
    }
  };

  /**
   * Reset position when mouse leaves
   * The transition CSS will animate back smoothly
   */
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setContentPosition({ x: 0, y: 0 });
  };

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        relative
        transition-transform duration-300 ease-out
        motion-reduce:transition-none
        ${className}
      `}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {/* Inner content with additional movement for layered effect */}
      <span
        className="block transition-transform duration-300 ease-out motion-reduce:transition-none"
        style={{
          transform: moveContent
            ? `translate(${contentPosition.x}px, ${contentPosition.y}px)`
            : "none",
        }}
      >
        {children}
      </span>
    </button>
  );
}

/**
 * =============================================================================
 * USAGE EXAMPLES
 * =============================================================================
 *
 * Basic Usage:
 * ------------
 * <MagneticButton className="px-8 py-4 bg-black text-white">
 *   Click Me
 * </MagneticButton>
 *
 * Custom Strength:
 * ----------------
 * <MagneticButton strength={0.5} radius={150}>
 *   Strong Effect
 * </MagneticButton>
 *
 * Without Content Movement:
 * -------------------------
 * <MagneticButton moveContent={false}>
 *   Button Only Moves
 * </MagneticButton>
 *
 * =============================================================================
 * CUSTOMIZATION IDEAS
 * =============================================================================
 *
 * 1. Add scale effect on hover:
 *    - Add scale transform when mouse enters
 *
 * 2. Add background color shift:
 *    - Change background based on cursor position
 *
 * 3. Add glow effect:
 *    - Add box-shadow that follows cursor
 *
 * 4. Add sound effects:
 *    - Play subtle hover sound for feedback
 */
