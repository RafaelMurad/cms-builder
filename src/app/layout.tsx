import "./globals.css";
import Header from "../components/Header";
import { ReactNode } from "react";

export const metadata = {
  title: "Studio Haus | Creative Direction + Design",
  description: "Luxury creative direction and design studio",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="smooth-scroll">
      <body
        className="bg-white font-sans overflow-x-hidden text-luxury-black antialiased"
      >
        <Header />
        <main className="relative">{children}</main>
        <a
          href="mailto:contact@studiohaus.com"
          className="fixed bottom-12 right-12 z-50 text-luxury-black hover:text-luxury-gray transition-colors duration-300 text-xs tracking-luxury uppercase font-light luxury-underline"
        >
          Contact
        </a>
      </body>
    </html>
  );
}
