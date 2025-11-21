import "./globals.css";
import MinimalNav from "../components/MinimalNav";
import { ReactNode } from "react";

export const metadata = {
  title: "Studio Haus | Creative Direction + Design",
  description: "Immersive creative studio crafting visual narratives for luxury brands",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="scroll-smooth snap-y snap-mandatory">
      <body className="bg-black font-sans overflow-x-hidden text-white antialiased">
        {/* Skip to main content link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
        >
          Skip to main content
        </a>
        <MinimalNav />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  );
}
