"use client";

import Link from "next/link";
import { useStudio } from "@/context/StudioContext";

export default function StudioDashboard() {
  const { site, galleries, pages, media } = useStudio();

  const stats = [
    {
      label: "Galleries",
      value: galleries.length,
      href: "/studio/galleries",
      color: "bg-blue-500",
    },
    {
      label: "Pages",
      value: pages.length,
      href: "/studio/pages",
      color: "bg-purple-500",
    },
    {
      label: "Media Files",
      value: media.length,
      href: "/studio/media",
      color: "bg-green-500",
    },
    {
      label: "Published",
      value: galleries.filter((g) => g.isPublished).length + pages.filter((p) => p.isPublished).length,
      href: "#",
      color: "bg-orange-500",
    },
  ];

  const quickActions = [
    {
      title: "Create Gallery",
      description: "Add a new gallery to showcase your work",
      href: "/studio/galleries/new",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "Add Page",
      description: "Create a new page for your portfolio",
      href: "/studio/pages/new",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: "Upload Media",
      description: "Add images and videos to your library",
      href: "/studio/media",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      ),
    },
    {
      title: "Choose Template",
      description: "Change your portfolio&apos;s look and feel",
      href: "/studio/templates",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-neutral-400">
          Manage your portfolio and galleries from here.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-neutral-800 rounded-xl p-6 hover:bg-neutral-750 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-3 h-3 rounded-full ${stat.color}`} />
              <span className="text-neutral-400 text-sm">{stat.label}</span>
            </div>
            <p className="text-4xl font-bold">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="bg-neutral-800 rounded-xl p-6 hover:bg-neutral-750 transition-colors group border border-neutral-700 hover:border-neutral-600"
            >
              <div className="w-12 h-12 bg-neutral-700 rounded-lg flex items-center justify-center mb-4 group-hover:bg-neutral-600 transition-colors">
                {action.icon}
              </div>
              <h3 className="font-semibold mb-1">{action.title}</h3>
              <p className="text-sm text-neutral-400">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Galleries */}
        <div className="bg-neutral-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Galleries</h2>
            <Link
              href="/studio/galleries"
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              View all
            </Link>
          </div>
          {galleries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-neutral-500 mb-4">No galleries yet</p>
              <Link
                href="/studio/galleries/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Gallery
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {galleries.slice(0, 5).map((gallery) => (
                <li key={gallery.id}>
                  <Link
                    href={`/studio/galleries/${gallery.id}`}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-700 transition-colors"
                  >
                    <div className="w-12 h-12 bg-neutral-700 rounded-lg overflow-hidden">
                      {gallery.coverImage ? (
                        <img
                          src={gallery.coverImage}
                          alt={gallery.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{gallery.title}</p>
                      <p className="text-sm text-neutral-400">
                        {gallery.items.length} items
                      </p>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded ${
                      gallery.isPublished
                        ? "bg-green-500/20 text-green-400"
                        : "bg-neutral-600 text-neutral-400"
                    }`}>
                      {gallery.isPublished ? "Published" : "Draft"}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Site Info */}
        <div className="bg-neutral-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Site Settings</h2>
            <Link
              href="/studio/settings"
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              Edit
            </Link>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-neutral-400">Site Name</label>
              <p className="font-medium">{site.name}</p>
            </div>
            <div>
              <label className="text-sm text-neutral-400">Tagline</label>
              <p className="font-medium">{site.tagline}</p>
            </div>
            <div>
              <label className="text-sm text-neutral-400">Template</label>
              <p className="font-medium capitalize">{site.theme.template}</p>
            </div>
            <div>
              <label className="text-sm text-neutral-400">Contact Email</label>
              <p className="font-medium">{site.contact.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
