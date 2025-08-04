// Simplified animation configuration
// Focus on essential transitions only

export type SimpleAnimationType = 'none' | 'fade' | 'slide';

export interface SimpleAnimationConfig {
    type: SimpleAnimationType;
    duration: number; // in seconds
    easing: string; // CSS easing function
}

// Simple animation presets - only what we actually need
export const SIMPLE_ANIMATIONS: Record<SimpleAnimationType, SimpleAnimationConfig> = {
    none: {
        type: 'none',
        duration: 0,
        easing: 'ease'
    },
    fade: {
        type: 'fade',
        duration: 0.6,
        easing: 'ease-in-out'
    },
    slide: {
        type: 'slide',
        duration: 0.8,
        easing: 'ease-in-out'
    }
};

// Get animation config with fallback
export function getSimpleAnimation(type: string): SimpleAnimationConfig {
    const animationType = type as SimpleAnimationType;
    return SIMPLE_ANIMATIONS[animationType] || SIMPLE_ANIMATIONS.fade;
}