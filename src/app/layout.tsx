import "./globals.css";
import { Providers } from "../components/Providers";
import { Header, Footer } from "../components/layout";
import { ReactNode } from "react";
import { Metadata } from "next";
import { getSiteConfig, REVALIDATE_TIME } from "@/lib/cms";

// Enable ISR for layout
export const revalidate = REVALIDATE_TIME;

// Dynamic metadata from CMS
export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();

  return {
    title: config.seoTitle || `${config.name} | Creative Direction + Design`,
    description: config.seoDescription || config.description,
    openGraph: {
      title: config.seoTitle || config.name,
      description: config.seoDescription || config.description,
      siteName: config.name,
    },
    twitter: {
      card: "summary_large_image",
      title: config.seoTitle || config.name,
      description: config.seoDescription || config.description,
    },
  };
}

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  // Fetch site config for theming
  const config = await getSiteConfig();

  // Generate CSS variables from CMS theme
  const themeStyles = `
    :root {
      --color-primary: ${config.primaryColor};
      --color-secondary: ${config.secondaryColor};
      --color-accent: ${config.accentColor};
      --color-background: ${config.backgroundColor};
      --color-text: ${config.textColor};
      --font-heading: ${config.headingFont}, sans-serif;
      --font-body: ${config.bodyFont}, sans-serif;
    }
  `;

  return (
    <html lang="en" className="scroll-smooth snap-y snap-mandatory">
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
      </head>
      <body className="bg-black font-sans overflow-x-hidden text-white antialiased">
        <Providers>
          {/* Skip to main content link for keyboard users */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded"
          >
            Skip to main content
          </a>
          <Header variant="transparent" />
          <main id="main-content" tabIndex={-1} className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
