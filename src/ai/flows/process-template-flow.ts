'use server';
/**
 * @fileOverview Simulates processing a video template file.
 *
 * This file defines a Genkit flow that takes a filename and simulates
 * extracting layers and properties from it, returning a structured Template object.
 *
 * @exports {
 *   processTemplateFile: function
 *   ProcessTemplateFileInput: type
 *   ProcessTemplateFileOutput: type
 * }
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PropertySchema = z.object({
  value: z.any(),
  type: z.enum(['text', 'number', 'color', 'slider']),
  label: z.string(),
  options: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().optional(),
  }).optional(),
});

const LayerSchema = z.object({
  id: z.string().describe("A unique ID for the layer, e.g., 'layer_new_1'"),
  name: z.string().describe("A descriptive name for the layer, e.g., 'Main Title'"),
  type: z.enum(['text', 'image', 'shape']),
  properties: z.record(PropertySchema),
});

export const ProcessTemplateFileInputSchema = z.object({
  fileName: z.string().describe('The name of the file to process.'),
});
export type ProcessTemplateFileInput = z.infer<typeof ProcessTemplateFileInputSchema>;

export const ProcessTemplateFileOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  thumbnailUrl: z.string().url(),
  thumbnailHint: z.string(),
  layers: z.array(LayerSchema),
});
export type ProcessTemplateFileOutput = z.infer<typeof ProcessTemplateFileOutputSchema>;

export async function processTemplateFile(input: ProcessTemplateFileInput): Promise<ProcessTemplateFileOutput> {
  return processTemplateFlow(input);
}

const processTemplatePrompt = ai.definePrompt({
  name: 'processTemplatePrompt',
  input: { schema: ProcessTemplateFileInputSchema },
  output: { schema: ProcessTemplateFileOutputSchema },
  prompt: `You are an AI that simulates a video template file processor.
  Given a filename, generate a plausible template structure.
  The template should have a unique ID, a name derived from the filename, a placeholder thumbnail URL from unsplash, a two-word hint for the thumbnail, and at least two layers with properties.
  
  For example, for a file named 'modern_intro.aep', you could generate a template named 'Modern Intro' with text and image layers.
  Generate realistic properties for each layer. For image layers, use a placeholder from unsplash.

  Filename: {{{fileName}}}
  `,
});

const processTemplateFlow = ai.defineFlow(
  {
    name: 'processTemplateFlow',
    inputSchema: ProcessTemplateFileInputSchema,
    outputSchema: ProcessTemplateFileOutputSchema,
  },
  async (input) => {
    const { output } = await processTemplatePrompt(input);
    return output!;
  }
);
