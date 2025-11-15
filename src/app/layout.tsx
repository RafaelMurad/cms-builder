import "./globals.css";
import Header from "../components/Header";
import CustomCursor from "../components/CustomCursor";
import { ReactNode } from "react";

export const metadata = {
  title: "Studio Haus | Creative Direction + Design",
  description: "Immersive creative direction and design studio experience",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="smooth-scroll">
      <body
        className="bg-dark-100 font-sans overflow-x-hidden text-white"
      >
        <CustomCursor />
        <Header />
        <main className="relative">{children}</main>
        <a
          href="mailto:contact@studiohaus.com"
          className="fixed bottom-8 left-8 z-50 px-8 py-4 glass-effect text-white hover:glass-dark transition-all duration-500 text-sm tracking-widest uppercase font-semibold magnetic group overflow-hidden"
        >
          <span className="relative z-10">Contact</span>
          <div className="absolute inset-0 bg-gradient-fire opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
        </a>
      </body>
    </html>
  );
}
