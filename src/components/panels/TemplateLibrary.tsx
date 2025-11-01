"use client";

import Image from "next/image";
import { useProject } from "@/contexts/ProjectContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Template } from "@/lib/types";
import TemplateUploader from "../TemplateUploader";

export default function TemplateLibrary() {
  const { templates, activeTemplate, setActiveTemplate } = useProject();

  return (
    <aside className="flex w-72 shrink-0 flex-col bg-secondary/50">
      <div className="flex h-12 shrink-0 items-center justify-between border-b px-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Templates
        </h2>
        <TemplateUploader />
      </div>
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-1 gap-4 p-4">
          {templates.map((template: Template) => (
            <button
              key={template.id}
              onClick={() => setActiveTemplate(template)}
              className={cn(
                "group relative block w-full overflow-hidden rounded-lg border-2 text-left transition-all",
                activeTemplate?.id === template.id
                  ? "border-primary shadow-lg"
                  : "border-transparent hover:border-primary/50"
              )}
            >
              <Image
                src={template.thumbnailUrl}
                alt={template.name}
                width={256}
                height={144}
                data-ai-hint={template.thumbnailHint}
                className="w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-3">
                <h3 className="text-sm font-semibold text-white">
                  {template.name}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
