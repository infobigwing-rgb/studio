"use client";

import { ProjectProvider } from "@/contexts/ProjectContext";
import Header from "@/components/layout/Header";
import TemplateLibrary from "@/components/panels/TemplateLibrary";
import Canvas from "@/components/panels/Canvas";
import Timeline from "@/components/panels/Timeline";
import PropertyInspector from "@/components/panels/PropertyInspector";

export default function Home() {
  return (
    <ProjectProvider>
      <div className="flex h-dvh w-full flex-col bg-background font-body text-foreground">
        <Header />
        <main className="flex flex-1 overflow-hidden">
          <TemplateLibrary />
          <div className="flex flex-1 flex-col overflow-hidden border-l border-r">
            <Canvas />
            <Timeline />
          </div>
          <PropertyInspector />
        </main>
      </div>
    </ProjectProvider>
  );
}
