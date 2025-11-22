import Link from "next/link";
import { getAllProjects, getSiteConfig, REVALIDATE_TIME } from "@/lib/cms";

// Enable ISR
export const revalidate = REVALIDATE_TIME;

export default async function WorkPage() {
  const [projects, config] = await Promise.all([
    getAllProjects(),
    getSiteConfig(),
  ]);

  return (
    <main className="min-h-screen bg-black text-white pt-20">
      {/* Header */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-light mb-4">Our Work</h1>
        <p className="text-lg md:text-xl text-white/60 max-w-2xl">
          A selection of projects showcasing our expertise in digital experiences,
          brand identity, and creative design.
        </p>
      </section>

      {/* Projects Grid */}
      <section className="px-6 md:px-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={project.href}
              className="group relative aspect-[4/3] bg-white/5 overflow-hidden"
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
                />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <h2 className="text-2xl font-light text-white mb-1">
                    {project.title}
                  </h2>
                  {project.subtitle && (
                    <p className="text-white/70">{project.subtitle}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-24">
            <p className="text-white/50">No projects available yet.</p>
            <p className="text-white/30 mt-2 text-sm">
              Add galleries in the Studio and mark them as featured.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
