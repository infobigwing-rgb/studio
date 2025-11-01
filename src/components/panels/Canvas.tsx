"use client";

import { useProject } from "@/contexts/ProjectContext";
import Image from 'next/image';

export default function Canvas() {
  const { activeTemplate } = useProject();

  // The timeline order is the source of truth. We don't need to sort here.
  // The user reorders layers in the timeline, and we render them in that order.
  // CSS/HTML stacking context means the last element in the DOM is rendered on top.
  const layersToRender = activeTemplate?.layers || [];

  return (
    <div className="relative flex flex-1 items-center justify-center bg-muted/20 p-8">
      <div className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-lg bg-black shadow-2xl">
        {layersToRender.map((layer) => {
          if (layer.type === 'image') {
            return (
              <div
                key={layer.id}
                className="absolute"
                style={{
                  width: '100%',
                  height: '100%',
                  opacity: (layer.properties.opacity?.value ?? 100) / 100,
                  // The z-index is implicitly handled by the render order in the array.
                }}
              >
                <Image
                  src={layer.properties.source.value}
                  alt={layer.name}
                  fill
                  className="object-cover"
                  data-ai-hint="city skyline"
                />
              </div>
            );
          }
          if (layer.type === 'text') {
            return (
              <div
                key={layer.id}
                className="select-none"
                style={{
                  fontFamily: layer.properties.fontFamily?.value || 'Inter',
                  fontSize: `${layer.properties.fontSize.value}px`,
                  color: layer.properties.color.value,
                  textAlign: layer.properties.textAlign?.value || 'center',
                  opacity: (layer.properties.opacity?.value ?? 100) / 100,
                  lineHeight: 1.2,
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  position: 'absolute',
                  top: `${layer.properties.y.value}%`,
                  left: `${layer.properties.x.value}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '90%'
                  // The z-index is implicitly handled by the render order.
                }}
              >
                {layer.properties.content.value}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
