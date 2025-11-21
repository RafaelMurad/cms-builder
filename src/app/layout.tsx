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
        <MinimalNav />
        <main>{children}</main>
      </body>
    </html>
  );
}
