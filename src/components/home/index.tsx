"use client";

// Re-export other home components
export { VideoHero } from "./VideoHero";
export { VideoSection as VideoCollection } from "./VideoSection";
export { CTALinks } from "./CTALinks";

import Link from "next/link";
import { motion } from "framer-motion";

interface MediaProject {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  media: {
    type: "video" | "image" | "gif";
    src: string;
    srcMobile?: string;
    poster?: string;
    alt?: string;
  };
}

interface MediaCollectionProps {
  projects: MediaProject[];
}

/**
 * MediaCollection Component
 *
 * Displays a grid of featured projects with media (images/videos)
 * Used on homepage to showcase CMS-managed galleries
 */
export function MediaCollection({ projects }: MediaCollectionProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="bg-black py-12 md:py-20">
      <div className="px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                href={project.href}
                className="group relative block aspect-[4/3] overflow-hidden bg-white/5"
              >
                {/* Media */}
                {project.media.type === "video" ? (
                  <video
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={project.media.src}
                    poster={project.media.poster}
                    muted
                    playsInline
                    loop
                    autoPlay
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.media.src}
                    alt={project.media.alt || project.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <h3 className="text-2xl font-light text-white mb-1">
                      {project.title}
                    </h3>
                    {project.subtitle && (
                      <p className="text-white/70">{project.subtitle}</p>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            href="/work"
            className="inline-flex items-center gap-3 text-white/70 hover:text-white transition-colors"
          >
            <span className="text-sm uppercase tracking-widest">View all projects</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="transform group-hover:translate-x-1 transition-transform"
            >
              <path
                d="M4 10H16M16 10L10 4M16 10L10 16"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
