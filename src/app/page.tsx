import { Suspense } from "react";
import { VideoHero, VideoCollection, CTALinks, MediaCollection } from "@/components/home";
import { featuredProjects, ctaLinks } from "@/config/site";
import { getSiteConfig, getFeaturedProjects, REVALIDATE_TIME } from "@/lib/cms";

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

  // Fallback to static video collection
  return <VideoCollection projects={featuredProjects} />;
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
  // Fetch site config from CMS (used for dynamic metadata via layout)
  await getSiteConfig();

  return (
    <>
      {/* Hero Video Section */}
      <VideoHero
        videoSrc="/videos/hero-reel.mp4"
        posterSrc="/images/hero-poster.jpg"
        fullVideoSrc="/videos/hero-full.mp4"
      />

      {/* Featured Projects - CMS-powered with static fallback */}
      <Suspense fallback={<GalleryLoading />}>
        <CMSGallerySection />
      </Suspense>

      {/* Call to Action Links */}
      <CTALinks links={ctaLinks} />
    </>
  );
}
