import { GalleryConfig } from "../types";
import FullViewportGallery from "./FullViewportGallery";
import { SimpleGalleryService } from "../services/simpleGalleryService";

// Initialize simplified service
const galleryService = new SimpleGalleryService();

async function loadGalleryConfigurations(): Promise<GalleryConfig[]> {
  return await galleryService.loadGalleries();
}

export default async function GalleryLoader() {
  // Load galleries from folders
  const galleries = await loadGalleryConfigurations();

  // Display a message if no galleries were found
  if (galleries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-black text-white">
        <h2 className="text-xl font-semibold mb-2">No galleries found</h2>
        <p className="mb-4">
          Please create folders in the <code>/public/assets/</code> directory to
          automatically generate galleries.
        </p>
        <p className="text-sm opacity-75">
          Example: <code>/public/assets/gallery1/image1.jpg</code>
        </p>
      </div>
    );
  }

  // Render the gallery component with loaded data
  return <FullViewportGallery galleries={galleries} />;
}
