// Enhanced CSS-only animation configuration
// Professional animations using only CSS transitions and transforms

export type SimpleAnimationType = 'none' | 'fade' | 'slide' | 'slideUp' | 'scale' | 'blur';

export interface SimpleAnimationConfig {
    type: SimpleAnimationType;
    duration: number; // in seconds
    easing: string; // CSS easing function
    delay?: number; // optional delay
}

// Enhanced animation presets for professional studio experience
export const SIMPLE_ANIMATIONS: Record<SimpleAnimationType, SimpleAnimationConfig> = {
    none: {
        type: 'none',
        duration: 0,
        easing: 'ease'
    },
    fade: {
        type: 'fade',
        duration: 0.8,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)' // Tailwind ease-out
    },
    slide: {
        type: 'slide',
        duration: 1.0,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    slideUp: {
        type: 'slideUp',
        duration: 0.9,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' // Professional ease
    },
    scale: {
        type: 'scale',
        duration: 0.7,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' // Slight bounce
    },
    blur: {
        type: 'blur',
        duration: 1.2,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
};

// Get animation config with fallback
export function getSimpleAnimation(type: string): SimpleAnimationConfig {
    const animationType = type as SimpleAnimationType;
    return SIMPLE_ANIMATIONS[animationType] || SIMPLE_ANIMATIONS.fade;
}