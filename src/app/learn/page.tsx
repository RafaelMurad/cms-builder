import Link from "next/link";

/**
 * LEARNING LAB - Interactive Guide to Modern Web Immersive Trends
 *
 * This page serves as an educational hub for learning modern web development
 * techniques used in high-end creative studio websites.
 *
 * Each section includes:
 * - Interactive demos you can play with
 * - Detailed code explanations
 * - Best practices and when to use each technique
 */

const learningModules = [
  {
    id: "magnetic-cursor",
    title: "Magnetic Cursor Effects",
    description:
      "Learn how to create buttons and elements that attract the cursor on hover, creating a playful, interactive experience.",
    difficulty: "Beginner",
    topics: ["Mouse Events", "CSS Transform", "Animation"],
  },
  {
    id: "page-transitions",
    title: "Page Transitions",
    description:
      "Smooth transitions between pages using Framer Motion's AnimatePresence for a premium app-like feel.",
    difficulty: "Intermediate",
    topics: ["Framer Motion", "Next.js", "AnimatePresence"],
  },
  {
    id: "scroll-video",
    title: "Scroll-Linked Video",
    description:
      "Videos that scrub through frames based on scroll position, creating cinematic storytelling experiences.",
    difficulty: "Intermediate",
    topics: ["Scroll Events", "Video API", "useScroll"],
  },
  {
    id: "noise-texture",
    title: "Noise & Grain Textures",
    description:
      "Add subtle film grain and noise overlays to create a luxury, editorial aesthetic.",
    difficulty: "Beginner",
    topics: ["SVG Filters", "CSS", "Canvas"],
  },
  {
    id: "dynamic-colors",
    title: "Dynamic Color Extraction",
    description:
      "Extract dominant colors from images to dynamically theme UI elements and create cohesive designs.",
    difficulty: "Advanced",
    topics: ["Canvas API", "Color Theory", "CSS Variables"],
  },
  {
    id: "webgl-basics",
    title: "WebGL & Three.js Basics",
    description:
      "Introduction to 3D graphics on the web with Three.js for creating immersive backgrounds and effects.",
    difficulty: "Advanced",
    topics: ["Three.js", "WebGL", "3D Graphics"],
  },
];

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-20 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-16">
          <h1 className="text-5xl md:text-7xl font-light text-neutral-900 mb-6">
            Learning Lab
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl">
            Interactive guides to modern web development techniques used by
            top creative studios. Each module includes working demos,
            commented code, and best practices.
          </p>
        </header>

        {/* Learning Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {learningModules.map((module) => (
            <Link
              key={module.id}
              href={`/learn/${module.id}`}
              className="group block bg-white p-8 hover:shadow-xl transition-all duration-500 border border-neutral-200 hover:border-neutral-400"
            >
              <div className="mb-4">
                <span
                  className={`text-xs tracking-wider uppercase px-2 py-1 ${
                    module.difficulty === "Beginner"
                      ? "bg-green-100 text-green-700"
                      : module.difficulty === "Intermediate"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {module.difficulty}
                </span>
              </div>

              <h2 className="text-2xl font-light text-neutral-900 mb-3 group-hover:text-neutral-600 transition-colors">
                {module.title}
              </h2>

              <p className="text-neutral-600 text-sm mb-6 leading-relaxed">
                {module.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {module.topics.map((topic) => (
                  <span
                    key={topic}
                    className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              <div className="mt-6 text-sm text-neutral-400 group-hover:text-neutral-600 transition-colors">
                Start Learning →
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Note */}
        <footer className="mt-20 pt-10 border-t border-neutral-200">
          <p className="text-neutral-500 text-sm">
            These learning modules are designed to help you understand the
            techniques behind modern, immersive web experiences. Each includes
            working code you can copy and adapt for your own projects.
          </p>
        </footer>
      </div>
    </div>
  );
}
