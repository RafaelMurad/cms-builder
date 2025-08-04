"use client";

import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

export function useIntersectionObserver(
    options: UseIntersectionObserverOptions = {}
) {
    const {
        threshold = 0.1,
        rootMargin = "100px", // Start loading 100px before element enters viewport
        triggerOnce = true,
    } = options;

    const [isIntersecting, setIsIntersecting] = useState(false);
    const [hasIntersected, setHasIntersected] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const isCurrentlyIntersecting = entry.isIntersecting;
                setIsIntersecting(isCurrentlyIntersecting);

                if (isCurrentlyIntersecting && !hasIntersected) {
                    setHasIntersected(true);
                }
            },
            {
                threshold,
                rootMargin,
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [threshold, rootMargin, hasIntersected]);

    // Return isIntersecting or hasIntersected based on triggerOnce setting
    return {
        elementRef,
        isVisible: triggerOnce ? hasIntersected : isIntersecting,
        isCurrentlyVisible: isIntersecting,
    };
}
