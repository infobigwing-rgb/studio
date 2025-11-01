"use client";

import { useProject } from "@/contexts/ProjectContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Layers, Upload, AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";


export default function PropertyInspector() {
  const { activeTemplate, activeLayer, updateLayerProperty } = useProject();

  const handlePropertyChange = (layerId: string, propKey: string, value: any) => {
    updateLayerProperty(layerId, propKey, value);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, layerId: string, propKey: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target?.result) {
            // For now, we just use the data URL. Later this would upload to storage.
            handlePropertyChange(layerId, propKey, loadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const selectedLayer = activeLayer;

  if (!activeTemplate) {
    return (
      <aside className="flex w-80 shrink-0 flex-col border-l bg-secondary/50">
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
  
  if (!selectedLayer) {
    return (
       <aside className="flex w-80 shrink-0 flex-col border-l bg-secondary/50">
        <div className="flex h-12 shrink-0 items-center border-b px-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Properties
          </h2>
        </div>
        <div className="flex flex-1 items-center justify-center p-4 text-center">
            <p className="text-sm text-muted-foreground">Select a layer to see its properties.</p>
        </div>
      </aside>
    )
  }

  return (
    <aside className="flex w-80 shrink-0 flex-col border-l bg-secondary/50">
      <div className="flex h-12 shrink-0 items-center border-b px-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Properties
        </h2>
      </div>
      <ScrollArea className="flex-1">
        <Accordion type="single" collapsible className="w-full" defaultValue="layer-properties">
          <AccordionItem value="layer-properties">
            <AccordionTrigger 
              className="border-b px-4 py-3 text-sm font-medium hover:no-underline"
            >
              <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  {selectedLayer.name}
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-background/50 p-4">
              <div className="space-y-6">
                {Object.entries(selectedLayer.properties).map(([key, prop]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={`${selectedLayer.id}-${key}`}>{prop.label}</Label>
                    {prop.type === 'text' && (
                      <Input
                        id={`${selectedLayer.id}-${key}`}
                        type="text"
                        value={prop.value}
                        onChange={(e) => handlePropertyChange(selectedLayer.id, key, e.target.value)}
                      />
                    )}
                    {prop.type === 'number' && (
                      <Input
                        id={`${selectedLayer.id}-${key}`}
                        type="number"
                        value={prop.value}
                        onChange={(e) => handlePropertyChange(selectedLayer.id, key, parseFloat(e.target.value))}
                      />
                    )}
                    {prop.type === 'color' && (
                       <div className="relative">
                          <Input
                              id={`${selectedLayer.id}-${key}`}
                              type="text"
                              value={prop.value}
                              onChange={(e) => handlePropertyChange(selectedLayer.id, key, e.target.value)}
                              className="pr-10"
                          />
                          <Input
                              type="color"
                              value={prop.value}
                              onChange={(e) => handlePropertyChange(selectedLayer.id, key, e.target.value)}
                              className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 cursor-pointer appearance-none border-none bg-transparent p-0"
                          />
                      </div>
                    )}
                    {prop.type === 'slider' && (
                       <div className="flex items-center gap-2">
                          <Slider
                              id={`${selectedLayer.id}-${key}`}
                              min={prop.options?.min ?? 0}
                              max={prop.options?.max ?? 100}
                              step={prop.options?.step ?? 1}
                              value={[prop.value]}
                              onValueChange={([val]) => handlePropertyChange(selectedLayer.id, key, val)}
                          />
                           <Input
                            type="number"
                            className="h-8 w-16"
                            value={prop.value}
                            onChange={(e) => handlePropertyChange(selectedLayer.id, key, parseFloat(e.target.value))}
                            min={prop.options?.min ?? 0}
                            max={prop.options?.max ?? 100}
                          />
                      </div>
                    )}
                    {prop.type === 'file' && (
                       <div className="flex items-center gap-2">
                           <Input
                              id={`${selectedLayer.id}-${key}-display`}
                              type="text"
                              readOnly
                              value={prop.value.length > 30 ? '...' + prop.value.slice(-30) : prop.value}
                              className="flex-1"
                          />
                           <Button asChild variant="outline" size="icon">
                             <label htmlFor={`${selectedLayer.id}-${key}-file`}>
                               <Upload className="h-4 w-4" />
                               <span className="sr-only">Upload</span>
                             </label>
                           </Button>
                           <Input
                              id={`${selectedLayer.id}-${key}-file`}
                              type="file"
                              className="hidden"
                              accept="image/*,video/*"
                              onChange={(e) => handleFileChange(e, selectedLayer.id, key)}
                           />
                      </div>
                    )}
                    {prop.type === 'select' && (
                      <Select
                        value={prop.value}
                        onValueChange={(value) => handlePropertyChange(selectedLayer.id, key, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${prop.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {prop.options?.items?.map(item => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {prop.type === 'toggle-group' && (
                      <ToggleGroup
                        type="single"
                        variant="outline"
                        value={prop.value}
                        onValueChange={(value) => {
                          if (value) handlePropertyChange(selectedLayer.id, key, value)
                        }}
                      >
                        {prop.options?.items?.map(item => (
                           <ToggleGroupItem key={item.value} value={item.value} aria-label={item.label}>
                             {item.value === 'left' && <AlignLeft className="h-4 w-4" />}
                             {item.value === 'center' && <AlignCenter className="h-4 w-4" />}
                             {item.value === 'right' && <AlignRight className="h-4 w-4" />}
                           </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </aside>
  );
}
