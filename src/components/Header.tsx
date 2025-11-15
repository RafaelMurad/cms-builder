"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkClass =
    "relative text-white text-sm tracking-widest uppercase font-medium transition-all duration-300 hover:text-accent-purple group";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        isScrolled
          ? "glass-effect shadow-lg shadow-accent-purple/10"
          : "bg-transparent"
      }`}
    >
      {/* Animated gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-fire opacity-50" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className={`flex items-center justify-between transition-all duration-500 ${
          isScrolled ? "py-4" : "py-8"
        }`}>
          <Link href="/" className="relative group">
            <Logo />
            <div className="absolute inset-0 bg-gradient-fire opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-12">
            <Link href="/" className={navLinkClass}>
              <span className="relative z-10">Home</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-fire transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link href="/about" className={navLinkClass}>
              <span className="relative z-10">About</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-fire transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 glass-effect text-white border border-accent-purple/30 hover:border-accent-purple transition-all duration-300 text-sm tracking-widest uppercase magnetic group relative overflow-hidden"
            >
              <span className="relative z-10">Work</span>
              <div className="absolute inset-0 bg-gradient-fire opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden text-white p-2 glass-effect rounded-lg transition-all duration-300 ${
              isMenuOpen ? "rotate-90" : ""
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-6 border-t border-white/10">
            <nav className="flex flex-col space-y-6">
              <Link
                href="/"
                className="text-white hover:text-accent-purple transition-colors text-lg tracking-wider uppercase animate-slide-up"
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: "0.1s" }}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-white hover:text-accent-purple transition-colors text-lg tracking-wider uppercase animate-slide-up"
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: "0.2s" }}
              >
                About
              </Link>
              <Link
                href="/about"
                className="inline-block px-6 py-3 glass-effect text-white border border-accent-purple/30 hover:border-accent-purple transition-all duration-300 text-sm tracking-widest uppercase text-center animate-slide-up"
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: "0.3s" }}
              >
                Work
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
