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
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm border-b border-luxury-lightgray"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-8 md:px-12 lg:px-16">
        <div className={`flex items-center justify-between transition-all duration-500 ${
          isScrolled ? "py-6" : "py-10"
        }`}>
          <Link href="/" className="relative">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-16">
            <Link
              href="/"
              className="text-luxury-black hover:text-luxury-gray transition-colors duration-300 text-xs tracking-luxury uppercase font-light luxury-underline"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-luxury-black hover:text-luxury-gray transition-colors duration-300 text-xs tracking-luxury uppercase font-light luxury-underline"
            >
              About
            </Link>
            <Link
              href="#work"
              className="text-luxury-black hover:text-luxury-gray transition-colors duration-300 text-xs tracking-luxury uppercase font-light luxury-underline"
            >
              Work
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-luxury-black transition-transform duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pb-8 border-t border-luxury-lightgray pt-8">
            <nav className="flex flex-col space-y-8">
              <Link
                href="/"
                className="text-luxury-black hover:text-luxury-gray transition-colors text-sm tracking-luxury uppercase font-light"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-luxury-black hover:text-luxury-gray transition-colors text-sm tracking-luxury uppercase font-light"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="#work"
                className="text-luxury-black hover:text-luxury-gray transition-colors text-sm tracking-luxury uppercase font-light"
                onClick={() => setIsMenuOpen(false)}
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
