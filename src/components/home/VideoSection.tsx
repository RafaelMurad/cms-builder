"use client";

import Link from "next/link";
import { Project } from "@/config/site";

interface VideoSectionProps {
  project: Project;
}

export function VideoSection({ project }: VideoSectionProps) {
  return (
    <Link
      href={project.href}
      className="block relative w-full h-screen bg-black group"
    >
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover object-center"
        playsInline
        autoPlay
        loop
        muted
        poster={project.posterSrc}
      >
        {project.videoSrcMobile && (
          <source
            src={project.videoSrcMobile}
            type="video/mp4"
            media="(max-width: 768px)"
          />
        )}
        <source src={project.videoSrc} type="video/mp4" />
      </video>

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

// Collection of video sections
interface VideoCollectionProps {
  projects: Project[];
}

export function VideoCollection({ projects }: VideoCollectionProps) {
  return (
    <div>
      {projects.map((project) => (
        <VideoSection key={project.id} project={project} />
      ))}
    </div>
  );
}
