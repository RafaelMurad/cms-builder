"use client";

import { StudioProvider } from "@/context/StudioContext";
import { StudioSidebar } from "@/components/studio/StudioSidebar";
import { StudioHeader } from "@/components/studio/StudioHeader";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudioProvider>
      <div className="flex h-screen bg-neutral-950 text-white">
        {/* Sidebar Navigation */}
        <StudioSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <StudioHeader />
          <main className="flex-1 overflow-auto bg-neutral-900 p-6">
            {children}
          </main>
        </div>
      </div>
    </StudioProvider>
  );
}
