"use client";

import Link from "next/link";
import { Project, createMediaSource } from "@/config/site";
import { MediaRenderer } from "@/components/ui";

interface MediaSectionProps {
  project: Project;
}

/**
 * MediaSection - Renders a full-viewport section with any media type
 * Supports: video, image, and gif backgrounds
 */
export function MediaSection({ project }: MediaSectionProps) {
  // Get media source (handles both new format and legacy format)
  const media = createMediaSource(project);

  return (
    <Link
      href={project.href}
      className="block relative w-full h-screen bg-black group"
    >
      {/* Background Media - Video, Image, or GIF */}
      <MediaRenderer
        media={media}
        className="absolute inset-0 w-full h-full object-cover object-center"
        priority={false}
      />

      {/* Overlay with gradient and content */}
      <div className="absolute inset-0 z-10">
        {/* Left side gradient for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(293.88% 100% at 0% 50%, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0) 100%)",
          }}
        />

        {/* Project Title - Sticky positioned */}
        <div className="sticky top-1/2 px-2 md:px-2.5 -translate-y-1/2">
          <div className="max-w-full md:max-w-[50%]">
            <div className="rounded-[40px] px-2 md:px-2.5 pt-[0.4em] transition-all duration-250 hover:bg-black/10 hover:backdrop-blur-[50px]">
              <h2 className="text-white text-2xl leading-[125%] m-0 inline sm:block">
                {project.title}
              </h2>
              {project.subtitle && (
                <h3 className="text-white text-2xl leading-[125%] m-0 inline sm:block">
                  <span className="inline sm:hidden"> </span>
                  {project.subtitle}
                </h3>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Legacy alias for backward compatibility
export const VideoSection = MediaSection;

// Collection of media sections
interface MediaCollectionProps {
  projects: Project[];
}

/**
 * MediaCollection - Renders a collection of full-viewport media sections
 * Each project can use video, image, or gif media
 */
export function MediaCollection({ projects }: MediaCollectionProps) {
  return (
    <div>
      {projects.map((project) => (
        <MediaSection key={project.id} project={project} />
      ))}
    </div>
  );
}

// Legacy alias for backward compatibility
export const VideoCollection = MediaCollection;
