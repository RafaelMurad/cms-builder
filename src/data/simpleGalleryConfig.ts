import { SimpleAnimationType } from '../utils/animationConfigs';

// Simplified gallery configuration - focus on content, not complex styling
export interface SimpleGalleryConfig {
    id: string;
    title?: string;
    description?: string;

    // Essential layout properties only
    layout: 'carousel' | 'grid' | 'fullscreen';

    // Simplified animation
    animation: SimpleAnimationType;

    // Auto-advance timing for carousels (in milliseconds)
    autoAdvanceTime?: number;

    // Layout-specific settings
    style?: 'default' | 'fullscreen' | 'contained' | 'wide';

    // Items are dynamically loaded from assets folder
    // No need to define them in config
}

// Simple gallery configurations - much cleaner than the complex enhanced data
export const simpleGalleryConfigs: SimpleGalleryConfig[] = [
    {
        id: 'gallery1',
        title: 'Gallery 1',
        layout: 'fullscreen',
        animation: 'fade',
        autoAdvanceTime: 2000,
        style: 'fullscreen'
    },
    {
        id: 'gallery2',
        title: 'Product Collection',
        layout: 'carousel',
        animation: 'none',
        autoAdvanceTime: 800,
        style: 'contained'
    },
    {
        id: 'gallery3',
        title: 'Video Gallery',
        layout: 'carousel',
        animation: 'none',
        style: 'wide'
        // No autoAdvanceTime for videos - they loop continuously
    },
    {
        id: 'gallery4',
        title: 'Image Slideshow',
        layout: 'carousel',
        animation: 'fade',
        autoAdvanceTime: 1000,
        style: 'contained'
    },
    {
        id: 'gallery5',
        title: 'Video Gallery 5',
        layout: 'carousel',
        animation: 'none',
        style: 'contained'
    },
    {
        id: 'gallery6',
        title: 'Magazine Cover Treadmill',
        layout: 'carousel',
        animation: 'slide',
        autoAdvanceTime: 2500,
        style: 'fullscreen'
    },
    {
        id: 'gallery7',
        title: 'Gallery 7',
        layout: 'fullscreen',
        animation: 'fade',
        autoAdvanceTime: 2000,
        style: 'fullscreen'
    },
    {
        id: 'gallery8',
        title: 'Static Image Gallery',
        layout: 'carousel',
        animation: 'fade',
        autoAdvanceTime: 3000,
        style: 'wide'
    },
    {
        id: 'gallery9',
        title: 'Video Gallery 9',
        layout: 'carousel',
        animation: 'none',
        style: 'wide'
    },
    {
        id: 'gallery10',
        title: 'Video Gallery 10',
        layout: 'carousel',
        animation: 'none',
        style: 'wide'
    },
    {
        id: 'gallery11',
        title: 'Gallery 11',
        layout: 'carousel',
        animation: 'slide',
        autoAdvanceTime: 2500,
        style: 'fullscreen'
    },
    {
        id: 'gallery12',
        title: 'Gallery 12',
        layout: 'fullscreen',
        animation: 'fade',
        autoAdvanceTime: 2000,
        style: 'fullscreen'
    }
];

// Style presets for consistent styling without complex configurations
export const GALLERY_STYLE_PRESETS = {
    default: {
        containerClass: 'w-full h-screen flex items-center justify-center',
        innerClass: 'w-full h-full'
    },
    fullscreen: {
        containerClass: 'w-full h-screen flex items-center justify-center p-0',
        innerClass: 'w-full h-full'
    },
    contained: {
        containerClass: 'w-full h-screen flex items-center justify-center p-8',
        innerClass: 'w-full max-w-6xl h-full'
    },
    wide: {
        containerClass: 'w-full h-screen flex items-center justify-center p-4',
        innerClass: 'w-full max-w-7xl h-full'
    }
} as const;
