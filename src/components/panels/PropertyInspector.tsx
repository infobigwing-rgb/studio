"use client";

import { useProject } from "@/contexts/ProjectContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Layers, AlignCenter, AlignLeft, AlignRight, TextIcon, Scaling, Clock, Image as ImageIcon, FileUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Textarea } from "../ui/textarea";

const formatTime = (seconds: number = 0) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const parseTime = (timeString: string) => {
    if (!timeString || !timeString.includes(':')) return parseFloat(timeString) || 0;
    const parts = timeString.split(':').map(Number);
    const mins = parts[0] || 0;
    const secs = parts[1] || 0;
    return mins * 60 + secs;
  };


export default function PropertyInspector() {
  const { activeLayer, updateLayerProperty } = useProject();

  const handlePropertyChange = (layerId: string, propKey: string, value: any) => {
    updateLayerProperty(layerId, propKey, value);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, layerId: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      // In a real app, you would upload this file to cloud storage and get a permanent URL
      // For now, we'll just use the local object URL for preview.
      handlePropertyChange(layerId, 'source', objectUrl);
    }
  };


  if (!activeLayer) {
    return (
      <aside className="flex w-80 shrink-0 flex-col border-l bg-secondary/50">
        <div className="flex h-12 shrink-0 items-center border-b px-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Properties
          </h2>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
            <Layers className="h-10 w-10 text-muted-foreground/50 mb-4" />
            <h4 className="font-semibold text-lg mb-1">No Layer Selected</h4>
            <p className="text-sm text-muted-foreground">Select a layer in the timeline to edit its properties.</p>
        </div>
      </aside>
    )
  }

  const layer = activeLayer;
  const props = layer.properties;

  return (
    <aside className="flex w-80 shrink-0 flex-col border-l bg-secondary/50">
      <div className="flex h-12 shrink-0 items-center justify-between border-b px-4">
        <h2 className="text-lg font-semibold capitalize tracking-tight">
          {layer.name}
        </h2>
        <span className="text-xs uppercase text-muted-foreground bg-secondary px-2 py-1 rounded-md">{layer.type}</span>
      </div>
      <ScrollArea className="flex-1">
        <Accordion type="multiple" defaultValue={['text-properties', 'image-properties', 'transform-properties', 'timing-properties']} className="w-full">
         
         {/* Text Properties */}
          {layer.type === 'text' && props.content && (
            <AccordionItem value="text-properties">
                <AccordionTrigger className="px-4 py-2 text-sm font-medium hover:no-underline">
                    <div className="flex items-center gap-2">
                        <TextIcon className="h-4 w-4" /> Text
                    </div>
                </AccordionTrigger>
                <AccordionContent className="bg-background/30 p-4 space-y-4">
                    {props.content && <div className="space-y-2"><Label>Content</Label><Textarea value={props.content.value} onChange={(e) => handlePropertyChange(layer.id, 'content', e.target.value)} rows={3} /></div>}
                    {props.fontFamily && <div className="space-y-2"><Label>Font</Label><Select value={props.fontFamily.value} onValueChange={v => handlePropertyChange(layer.id, 'fontFamily', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{props.fontFamily.options?.items?.map(i => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectContent></Select></div>}
                    <div className="flex gap-4">
                        {props.fontSize && <div className="flex-1 space-y-2"><Label>Size</Label><Input type="number" value={props.fontSize.value} onChange={e => handlePropertyChange(layer.id, 'fontSize', parseFloat(e.target.value))} /></div>}
                        {props.color && <div className="flex-1 space-y-2"><Label>Color</Label><div className="relative"><Input value={props.color.value} onChange={e => handlePropertyChange(layer.id, 'color', e.target.value)} /><Input type="color" className="absolute right-1 top-1 h-8 w-8 p-0 appearance-none bg-transparent border-none cursor-pointer" value={props.color.value} onChange={e => handlePropertyChange(layer.id, 'color', e.target.value)} /></div></div>}
                    </div>
                    {props.textAlign && <div className="space-y-2"><Label>Align</Label><ToggleGroup type="single" value={props.textAlign.value} onValueChange={v => v && handlePropertyChange(layer.id, 'textAlign', v)} variant="outline" className="w-full"><ToggleGroupItem value="left" className="flex-1"><AlignLeft/></ToggleGroupItem><ToggleGroupItem value="center" className="flex-1"><AlignCenter/></ToggleGroupItem><ToggleGroupItem value="right" className="flex-1"><AlignRight/></ToggleGroupItem></ToggleGroup></div>}
                </AccordionContent>
            </AccordionItem>
          )}

          {/* Image Properties */}
          {layer.type === 'image' && props.source && (
            <AccordionItem value="image-properties">
              <AccordionTrigger className="px-4 py-2 text-sm font-medium hover:no-underline">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" /> Image
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-background/30 p-4 space-y-4">
                <div className="space-y-2">
                  <Label>Source</Label>
                  <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, layer.id)} className="text-xs"/>
                  <div className="mt-2 rounded border p-2">
                      <img src={props.source.value} alt="Preview" className="w-full h-auto rounded-sm" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Transform Properties */}
          <AccordionItem value="transform-properties">
             <AccordionTrigger className="px-4 py-2 text-sm font-medium hover:no-underline">
                <div className="flex items-center gap-2">
                    <Scaling className="h-4 w-4" /> Transform
                </div>
            </AccordionTrigger>
             <AccordionContent className="bg-background/30 p-4 space-y-4">
                <div className="flex gap-4">
                    {props.x && <div className="flex-1 space-y-2"><Label>Position X (%)</Label><Input type="number" value={props.x.value} onChange={e => handlePropertyChange(layer.id, 'x', parseFloat(e.target.value))} /></div>}
                    {props.y && <div className="flex-1 space-y-2"><Label>Position Y (%)</Label><Input type="number" value={props.y.value} onChange={e => handlePropertyChange(layer.id, 'y', parseFloat(e.target.value))} /></div>}
                </div>
                 {props.opacity && <div className="space-y-2"><Label>Opacity</Label><div className="flex items-center gap-2"><Slider min={0} max={100} step={1} value={[props.opacity.value]} onValueChange={([v]) => handlePropertyChange(layer.id, 'opacity', v)} /><span className="text-xs text-muted-foreground w-12 text-right">{props.opacity.value}%</span></div></div>}
                 {props.zIndex && <div className="space-y-2"><Label>Layer Order (Z-Index)</Label><Input type="number" value={props.zIndex.value} onChange={e => handlePropertyChange(layer.id, 'zIndex', parseFloat(e.target.value))} /></div>}
             </AccordionContent>
          </AccordionItem>

          {/* Timing Properties */}
          <AccordionItem value="timing-properties">
             <AccordionTrigger className="px-4 py-2 text-sm font-medium hover:no-underline">
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Timing
                </div>
            </AccordionTrigger>
             <AccordionContent className="bg-background/30 p-4 space-y-4">
                 <div className="flex gap-4">
                     {props.start && <div className="flex-1 space-y-2"><Label>Start</Label><Input defaultValue={formatTime(props.start.value)} onBlur={e => handlePropertyChange(layer.id, 'start', parseTime(e.target.value))} /></div>}
                     {props.duration && <div className="flex-1 space-y-2"><Label>Duration</Label><Input defaultValue={formatTime(props.duration.value)} onBlur={e => handlePropertyChange(layer.id, 'duration', parseTime(e.target.value))} /></div>}
                 </div>
                 {props.start && props.duration && <div className="space-y-2"><Label>End</Label><Input value={formatTime(props.start.value + props.duration.value)} readOnly disabled /></div>}
            </AccordionContent>
          </AccordionItem>
          
        </Accordion>
      </ScrollArea>
    </aside>
  );
}
