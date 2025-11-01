'use server';
/**
 * @fileOverview A secure proxy for interacting with the Shotstack API.
 *
 * This file defines a Genkit flow that will handle all communication
 * with the Shotstack API to render a video.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Shotstack, type Edit } from 'shotstack-sdk';
import type { Layer, Template } from '@/lib/types';


const ShotstackRenderInputSchema = z.custom<Template>();
export type ShotstackRenderInput = z.infer<typeof ShotstackRenderInputSchema>;

const ShotstackRenderOutputSchema = z.object({
    renderId: z.string(),
    status: z.string(),
    message: z.string(),
});
export type ShotstackRenderOutput = z.infer<typeof ShotstackRenderOutputSchema>;

const ShotstackStatusInputSchema = z.string();
const ShotstackStatusOutputSchema = z.object({
    status: z.enum(['submitted', 'queued', 'rendering', 'done', 'failed']),
    progress: z.number(),
    url: z.string().optional(),
});
export type ShotstackStatusOutput = z.infer<typeof ShotstackStatusOutputSchema>;


export async function shotstackRender(
    input: ShotstackRenderInput
): Promise<ShotstackRenderOutput> {
    return shotstackRenderFlow(input);
}

export async function getShotstackRenderStatus(renderId: string): Promise<ShotstackStatusOutput> {
    return shotstackStatusFlow(renderId);
}

const convertToShotstackFormat = (template: Template): Edit => {
    const tracks: any[] = [];
  
    // Sort layers by z-index (reverse order for shotstack)
    const sortedLayers = [...template.layers].sort((a, b) => (b.properties.zIndex?.value ?? 0) - (a.properties.zIndex?.value ?? 0));

    sortedLayers.forEach((layer) => {
      let asset;
      const start = 0; // Simplified for now
      const length = 5; // Simplified for now

      if (layer.type === 'text') {
        const properties = layer.properties;
        asset = {
            type: 'title',
            text: properties.content.value,
            style: 'minimal', // More mapping needed for fonts
            color: properties.color.value,
            size: `${properties.fontSize.value}px`, // This might not be a direct mapping
            position: 'center', // More complex mapping needed
            offset: { // Example positioning, needs real logic
              x: (properties.x.value / 50) - 1,
              y: (properties.y.value / 50) - 1,
            }
        };
      } else if (layer.type === 'image') {
        const properties = layer.properties;
        asset = {
            type: 'image',
            src: properties.source.value,
            scale: { // Example scaling
                width: 1,
            }
        };
      }

      if (asset) {
        tracks.push({
            clips: [{
                asset: asset,
                start: start,
                length: length,
            }]
        });
      }
    });
  
    return {
      timeline: {
        background: "#000000",
        tracks,
      },
      output: {
        format: 'mp4',
        resolution: 'hd'
      }
    };
  };


const shotstackRenderFlow = ai.defineFlow(
    {
        name: 'shotstackRenderFlow',
        inputSchema: ShotstackRenderInputSchema,
        outputSchema: ShotstackRenderOutputSchema,
    },
    async (template) => {
        const apiKey = process.env.SHOTSTACK_API_KEY;
        if (!apiKey) {
            throw new Error('SHOTSTACK_API_KEY is not configured.');
        }

        const shotstack = new Shotstack({ apiKey });
        const edit = convertToShotstackFormat(template);

        try {
            const response = await shotstack.render(edit);
            return {
                renderId: response.id,
                status: response.status,
                message: response.message,
            };
        } catch (error: any) {
            console.error('Shotstack API Error:', error?.response?.data || error);
            throw new Error('Failed to submit render to Shotstack.');
        }
    }
);


const shotstackStatusFlow = ai.defineFlow(
    {
        name: 'shotstackStatusFlow',
        inputSchema: ShotstackStatusInputSchema,
        outputSchema: ShotstackStatusOutputSchema,
    },
    async (renderId) => {
        const apiKey = process.env.SHOTSTACK_API_KEY;
        if (!apiKey) {
            throw new Error('SHOTSTACK_API_KEY is not configured.');
        }

        const shotstack = new Shotstack({ apiKey });

        try {
            const status = await shotstack.getStatus(renderId);
            return {
                status: status.status,
                progress: (status.progress || 0) * 100,
                url: status.url,
            };
        } catch (error) {
            console.error('Error fetching Shotstack status:', error);
            throw new Error('Failed to get render status from Shotstack.');
        }
    }
);
