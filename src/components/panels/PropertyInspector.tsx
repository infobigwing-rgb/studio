"use client";

import { useProject } from "@/contexts/ProjectContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Layers } from "lucide-react";

export default function PropertyInspector() {
  const { activeTemplate, activeLayer, setActiveLayer, updateLayerProperty } = useProject();

  const handlePropertyChange = (layerId: string, propKey: string, value: any) => {
    updateLayerProperty(layerId, propKey, value);
  };

  if (!activeTemplate) {
    return (
      <aside className="flex w-80 shrink-0 flex-col bg-secondary/50">
        <div className="flex h-12 shrink-0 items-center border-b px-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Properties
          </h2>
        </div>
        <div className="flex flex-1 items-center justify-center p-4 text-center">
            <p className="text-sm text-muted-foreground">Select a template to see its layers and properties.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex w-80 shrink-0 flex-col bg-secondary/50">
      <div className="flex h-12 shrink-0 items-center border-b px-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Properties
        </h2>
      </div>
      <ScrollArea className="flex-1">
        <Accordion type="multiple" className="w-full" defaultValue={activeLayer ? [activeLayer.id] : []}>
          {activeTemplate.layers.map((layer) => (
            <AccordionItem value={layer.id} key={layer.id} className="border-b-0">
              <AccordionTrigger 
                className="border-b px-4 py-3 text-sm font-medium hover:no-underline [&[data-state=open]]:bg-muted"
                onClick={() => setActiveLayer(layer)}
              >
                <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    {layer.name}
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-background/50 p-4">
                <div className="space-y-4">
                  {Object.entries(layer.properties).map(([key, prop]) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={`${layer.id}-${key}`}>{prop.label}</Label>
                      {prop.type === 'text' && (
                        <Input
                          id={`${layer.id}-${key}`}
                          type="text"
                          value={prop.value}
                          onChange={(e) => handlePropertyChange(layer.id, key, e.target.value)}
                        />
                      )}
                      {prop.type === 'color' && (
                         <div className="relative">
                            <Input
                                id={`${layer.id}-${key}`}
                                type="text"
                                value={prop.value}
                                onChange={(e) => handlePropertyChange(layer.id, key, e.target.value)}
                                className="pr-10"
                            />
                            <Input
                                type="color"
                                value={prop.value}
                                onChange={(e) => handlePropertyChange(layer.id, key, e.target.value)}
                                className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 cursor-pointer appearance-none border-none bg-transparent p-0"
                            />
                        </div>
                      )}
                      {prop.type === 'slider' && (
                         <div className="flex items-center gap-2">
                            <Slider
                                id={`${layer.id}-${key}`}
                                min={prop.options?.min ?? 0}
                                max={prop.options?.max ?? 100}
                                step={prop.options?.step ?? 1}
                                value={[prop.value]}
                                onValueChange={([val]) => handlePropertyChange(layer.id, key, val)}
                            />
                            <span className="text-xs text-muted-foreground">{prop.value}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </aside>
  );
}
