import "./globals.css";
import Header from "../components/Header";
import { ReactNode } from "react";
import { inter } from "../fonts/fonts";

export const metadata = {
  title: "Studio Haus | Creative Direction + Design",
  description: "Creative direction and design studio",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`bg-neutral-50 font-sans overflow-x-hidden ${inter.className}`}
      >
        <Header />
        <main className="relative">
          {children}
        </main>
        <a
          href="mailto:contact@studiohaus.com"
          className="fixed bottom-8 left-8 z-50 px-6 py-3 bg-white/90 backdrop-blur-sm text-black hover:bg-white transition-all duration-300 text-sm tracking-wide"
        >
          Contact
        </a>
      </body>
    </html>
  );
}
