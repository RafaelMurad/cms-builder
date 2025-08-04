import { GalleryFileService } from './galleryFileService';
import { SimpleGalleryConfig, simpleGalleryConfigs } from '../data/simpleGalleryConfig';
import { GalleryConfig, MediaItem } from '../types';
import { detectFileType } from '../utils/galleryGenerator';
import { getAssetPath } from '../utils/assetPath';

export class SimpleGalleryService {
    private fileService: GalleryFileService;

    constructor() {
        this.fileService = new GalleryFileService();
    }

    /**
     * Load all galleries with simplified configuration
     * No complex merging - just simple config + dynamic items
     */
    async loadGalleries(): Promise<GalleryConfig[]> {
        try {
            // Ensure assets directory exists
            await this.fileService.ensureAssetsDirectory();

            // Get available gallery directories
            const galleryDirs = await this.fileService.getGalleryDirectories();

            if (galleryDirs.length === 0) {
                console.warn('No gallery directories found in assets folder');
                return [];
            }

            // Process each gallery directory
            const galleries = await Promise.all(
                galleryDirs.map(async (galleryId) => {
                    return await this.createGalleryConfig(galleryId);
                })
            );

            // Sort galleries by numerical order
            return galleries.sort((a, b) => {
                const aNum = parseInt(a.id.replace('gallery', '')) || 0;
                const bNum = parseInt(b.id.replace('gallery', '')) || 0;
                return aNum - bNum;
            });

        } catch (error) {
            console.error('Error loading galleries:', error);
            return [];
        }
    }

    /**
     * Create a single gallery configuration
     * Simple: config + items, no complex merging
     */
    private async createGalleryConfig(galleryId: string): Promise<GalleryConfig> {
        // Get simple config for this gallery
        const simpleConfig = simpleGalleryConfigs.find(config => config.id === galleryId);

        // Get media files from the directory
        const mediaFiles = await this.fileService.getGalleryFiles(galleryId);

        // Create media items
        const items = mediaFiles.map((filename, index) =>
            this.createMediaItem(galleryId, filename, index)
        );

        // Convert simple config to full config format
        return {
            id: galleryId,
            title: simpleConfig?.title || `Gallery ${galleryId.replace('gallery', '')}`,
            description: simpleConfig?.description || '',
            layout: simpleConfig?.layout || 'carousel',
            animation: {
                effect: simpleConfig?.animation || 'fade',
                duration: 0.6,
                ease: 'power2.inOut'
            },
            transitionTime: simpleConfig?.autoAdvanceTime,
            items,
            // Store the style preset for the component to use
            stylePreset: simpleConfig?.style || 'default'
        } as GalleryConfig & { stylePreset: string };
    }

    /**
     * Create a media item from filename
     * Simplified version of the gallery generator logic
     */
    private createMediaItem(galleryId: string, filename: string, index: number): MediaItem {
        const type = detectFileType(filename);
        const url = getAssetPath(galleryId, filename);

        // For videos, try to find a cover image
        let thumbUrl: string | undefined;
        if (type === 'video') {
            // Simple cover naming pattern
            const coverName = `${galleryId.charAt(0).toUpperCase() + galleryId.slice(1)}-Cover.png`;

            // Known galleries with covers
            const galleriesWithCovers = ['gallery3', 'gallery5', 'gallery9', 'gallery10'];
            if (galleriesWithCovers.includes(galleryId)) {
                thumbUrl = getAssetPath(galleryId, coverName);
            }
        }

        return {
            id: `${galleryId}-${index}`,
            title: '',
            description: '',
            type,
            url,
            thumbUrl,
            category: galleryId
        };
    }
}
