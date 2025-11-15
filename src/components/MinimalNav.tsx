"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function MinimalNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Work", href: "#work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "mailto:contact@studiohaus.com" },
  ];

  return (
    <>
      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
        <div className="flex items-center justify-between px-8 md:px-12 py-8">
          {/* Logo */}
          <Link
            href="/"
            className="text-white text-sm tracking-[0.2em] uppercase font-light hover:opacity-60 transition-opacity duration-300"
          >
            Studio Haus
          </Link>

          {/* Hamburger Menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white hover:opacity-60 transition-opacity duration-300 relative w-8 h-8 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <div className="w-full">
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
                className="block w-full h-[1px] bg-white mb-2 origin-center"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block w-full h-[1px] bg-white mb-2"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -2 } : { rotate: 0, y: 4 }}
                className="block w-full h-[1px] bg-white origin-center"
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Fullscreen Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-black flex items-center justify-center"
          >
            <nav className="text-center">
              <ul className="space-y-8">
                {menuItems.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    {item.href.startsWith("mailto:") ? (
                      <a
                        href={item.href}
                        className="text-5xl md:text-7xl font-light text-white hover:text-gray-400 transition-colors duration-300 tracking-tight"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-5xl md:text-7xl font-light text-white hover:text-gray-400 transition-colors duration-300 tracking-tight"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
