"use client";

import { GripVertical } from "lucide-react";
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
        <GripVertical className="h-5 w-5 cursor-row-resize text-muted-foreground" />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {activeTemplate?.layers.map((layer, index) => (
            <TimelineLayer key={layer.id} layer={layer} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
