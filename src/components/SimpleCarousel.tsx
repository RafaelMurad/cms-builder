"use client";

import { useState, useEffect, useRef } from "react";
import MediaItem from "./MediaItem";
import { MediaItem as MediaItemType } from "../types";
import { getSimpleAnimation, SimpleAnimationType } from "../utils/animationConfigs";

interface SimpleCarouselProps {
  items: MediaItemType[];
  animationType?: SimpleAnimationType;
  autoAdvanceTime?: number; // in milliseconds
  className?: string;
}

export default function SimpleCarousel({
  items,
  animationType = 'fade',
  autoAdvanceTime = 3000,
  className = ""
}: SimpleCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const animation = getSimpleAnimation(animationType);

  // Auto-advance slides
  useEffect(() => {
    if (!autoAdvanceTime || items.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, autoAdvanceTime);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoAdvanceTime, items.length]);

  // Handle transition state
  useEffect(() => {
    if (animation.type === 'none') return;

    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, animation.duration * 1000);

    return () => clearTimeout(timer);
  }, [activeIndex, animation.duration, animation.type]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (!items.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No items to display
      </div>
    );
  }

  const getTransitionStyles = (): React.CSSProperties => {
    if (animation.type === 'none') {
      return {};
    }

    return {
      transition: `all ${animation.duration}s ${animation.easing}`,
    };
  };

  const getSlideStyles = (index: number): React.CSSProperties => {
    const isActive = index === activeIndex;
    const baseStyles: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      ...getTransitionStyles()
    };

    switch (animation.type) {
      case 'fade':
        return {
          ...baseStyles,
          opacity: isActive ? 1 : 0,
          pointerEvents: isActive ? 'auto' : 'none'
        };

      case 'slide':
        return {
          ...baseStyles,
          transform: `translateX(${(index - activeIndex) * 100}%)`,
          opacity: 1
        };

      case 'none':
      default:
        return {
          ...baseStyles,
          opacity: isActive ? 1 : 0,
          transition: 'none',
          pointerEvents: isActive ? 'auto' : 'none'
        };
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {items.map((item, index) => (
        <div
          key={item.id}
          style={getSlideStyles(index)}
          className="relative"
        >
          <MediaItem
            item={item}
            isActive={index === activeIndex}
            priority={index === 0}
          />
        </div>
      ))}
      
      {/* Optional: Add simple navigation dots */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === activeIndex 
                  ? 'bg-white' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
