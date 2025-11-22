import { Suspense } from "react";
import ImmersiveHero from "../components/ImmersiveHero";
import GalleryLoader from "../components/GalleryLoader";
import { getSiteConfig, getFeaturedProjects, REVALIDATE_TIME } from "@/lib/cms";
import { MediaCollection } from "@/components/home";

// Enable ISR - revalidate every 60 seconds
export const revalidate = REVALIDATE_TIME;

// CMS-powered gallery section
async function CMSGallerySection() {
  const projects = await getFeaturedProjects(6);

  // If we have CMS projects, use the MediaCollection component
  if (projects.length > 0) {
    // Convert to the format MediaCollection expects
    const formattedProjects = projects.map((project) => ({
      id: project.id,
      title: project.title,
      subtitle: project.subtitle || undefined,
      href: project.href,
      media: project.media,
    }));

    return <MediaCollection projects={formattedProjects} />;
  }

  // Fallback to GalleryLoader for static galleries
  return <GalleryLoader />;
}

// Loading fallback
function GalleryLoading() {
  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="text-white/50 animate-pulse">Loading galleries...</div>
    </div>
  );
}

export default async function Home() {
  // Fetch site config from CMS
  const config = await getSiteConfig();

  return (
    <main>
      <ImmersiveHero
        imageUrl="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2400"
        title={config.name.toUpperCase()}
        subtitle={config.tagline || "Visual narratives for luxury brands"}
      />
      <div id="work">
        <Suspense fallback={<GalleryLoading />}>
          <CMSGallerySection />
        </Suspense>
      </div>
    </main>
  );
}