"use client";

import { useProject } from "@/contexts/ProjectContext";
import Image from 'next/image';

export default function Canvas() {
  const { activeTemplate } = useProject();

  const textLayers = activeTemplate?.layers.filter(l => l.type === 'text') || [];
  const imageLayer = activeTemplate?.layers.find(l => l.type === 'image');

  return (
    <div className="relative flex flex-1 items-center justify-center bg-muted/20 p-8">
      <div className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-lg bg-black shadow-2xl">
        {imageLayer && (
          <Image
            src={imageLayer.properties.source.value}
            alt="Canvas background"
            fill
            className="object-cover"
            style={{ opacity: imageLayer.properties.opacity.value / 100 }}
            data-ai-hint="city skyline"
          />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            {textLayers.map((layer, index) => (
                <div
                    key={layer.id}
                    className="select-none text-center"
                    style={{
                        fontSize: `${layer.properties.fontSize.value}px`,
                        color: layer.properties.color.value,
                        lineHeight: 1.2,
                        fontWeight: 'bold',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        position: 'absolute',
                        top: `${30 + index * 20}%`,
                    }}
                >
                    {layer.properties.content.value}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
