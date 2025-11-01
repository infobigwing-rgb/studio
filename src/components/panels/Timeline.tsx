"use client";

import { GripVertical, Layers, Music, Text } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";

export default function Timeline() {
  const { activeTemplate, setActiveLayer, activeLayer } = useProject();
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
          {activeTemplate?.layers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer)}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-md p-2 text-left text-sm ${
                activeLayer?.id === layer.id ? 'bg-primary/10' : 'hover:bg-muted'
              }`}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded bg-secondary">
                {layer.type === 'text' && <Text className="h-4 w-4 text-muted-foreground" />}
                {layer.type === 'image' && <Layers className="h-4 w-4 text-muted-foreground" />}
                {layer.type === 'shape' && <Layers className="h-4 w-4 text-muted-foreground" />}
              </div>
              <span className="font-medium">{layer.name}</span>
              <div className="ml-4 flex-1 rounded-full bg-accent/50" style={{ height: '8px' }}>
                <div className="h-full w-3/4 rounded-full bg-accent"></div>
              </div>
            </button>
          ))}
          <div className="flex items-center gap-3 rounded-md p-2 text-sm text-muted-foreground">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-secondary">
                <Music className="h-4 w-4" />
              </div>
              <span>Background Music.mp3</span>
               <div className="ml-4 flex-1 rounded-full bg-primary/20" style={{ height: '8px' }}>
                <div className="h-full w-full rounded-full bg-primary/80"></div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
