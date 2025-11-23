/**
 * Component Template
 *
 * Copy this file to: src/components/[ComponentName].tsx
 *
 * Patterns included:
 * - TypeScript props interface
 * - Accessibility attributes
 * - Tailwind styling
 * - Optional variants
 */

"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// =============================================================================
// TYPES
// =============================================================================

interface ComponentNameProps {
  /** Primary content */
  title: string;
  /** Optional description */
  description?: string;
  /** Visual variant */
  variant?: "default" | "primary" | "secondary";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Children content */
  children?: React.ReactNode;
}

// =============================================================================
// STYLES
// =============================================================================

const variants = {
  default: "bg-white text-black border border-neutral-200",
  primary: "bg-black text-white",
  secondary: "bg-neutral-100 text-neutral-800",
};

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-base",
  lg: "px-6 py-4 text-lg",
};

// =============================================================================
// COMPONENT
// =============================================================================

export function ComponentName({
  title,
  description,
  variant = "default",
  size = "md",
  onClick,
  className = "",
  children,
}: ComponentNameProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  return (
    <motion.div
      className={`
        rounded-lg transition-shadow
        ${variants[variant]}
        ${sizes[size]}
        ${onClick ? "cursor-pointer hover:shadow-lg" : ""}
        ${className}
      `}
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-pressed={onClick ? isHovered : undefined}
    >
      {/* Header */}
      <h3 className="font-medium">{title}</h3>

      {/* Description */}
      {description && (
        <p className="mt-1 text-sm opacity-70">{description}</p>
      )}

      {/* Children content */}
      {children && <div className="mt-3">{children}</div>}

      {/* Animated indicator (example) */}
      <AnimatePresence>
        {isHovered && onClick && (
          <motion.div
            className="mt-2 h-0.5 bg-current"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            exit={{ width: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default ComponentName;
