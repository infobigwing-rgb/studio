"use client";

import { useProject } from "@/contexts/ProjectContext";
import TimelineLayer from './TimelineLayer';

export default function Timeline() {
  const { activeTemplate } = useProject();

  return (
    <div className="flex h-56 shrink-0 flex-col border-t">
      <div className="flex h-12 shrink-0 items-center justify-between border-b px-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Timeline
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {activeTemplate?.layers.map((layer, index) => (
            <TimelineLayer key={layer.id} layer={layer} index={index} />
          ))}
          {activeTemplate && activeTemplate.layers.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">This template has no layers to display.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
