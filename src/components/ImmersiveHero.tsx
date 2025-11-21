"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ImmersiveHeroProps {
  videoUrl?: string;
  imageUrl?: string;
  title: string;
  subtitle?: string;
}

export default function ImmersiveHero({
  videoUrl,
  imageUrl,
  title,
  subtitle,
}: ImmersiveHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax and fade effects
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden snap-start"
    >
      {/* Media Background */}
      <motion.div
        style={{ scale }}
        className="absolute inset-0 w-full h-full"
      >
        {videoUrl ? (
          <div className="relative w-full h-full">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ) : imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        )}
      </motion.div>

      {/* Text Overlay */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex items-center justify-center px-8 md:px-12"
      >
        <div className="text-center max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight text-white mb-6"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-base md:text-lg text-white/80 tracking-wide font-light"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          <div className="w-px h-16 bg-gradient-to-b from-white/60 to-transparent" />
          <p className="text-white/60 text-xs tracking-widest uppercase mt-4">
            Scroll
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
