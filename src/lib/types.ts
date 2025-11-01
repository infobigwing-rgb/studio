import { z } from 'zod';

export type Property = {
  value: any;
  type: 'text' | 'number' | 'color' | 'slider';
  label: string;
  options?: {
    min?: number;
    max?: number;
    step?: number;
  };
};

export type Layer = {
  id: string;
  name: string;
  type: 'text' | 'image' | 'shape';
  properties: Record<string, Property>;
};

export type Template = {
  id: string;
  name: string;
  thumbnailUrl: string;
  thumbnailHint: string;
  layers: Layer[];
};


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

// Define the input schema for searching templates
export const SearchEnvatoTemplatesInputSchema = z.object({
  query: z.string().optional().describe('The search query for templates.'),
  // Add other parameters like category, etc. as needed
});
export type SearchEnvatoTemplatesInput = z.infer<typeof SearchEnvatoTemplatesInputSchema>;


// Define a basic output schema. This will be expanded later.
export const SearchEnvatoTemplatesOutputSchema = z.object({
  templates: z.array(z.object({
    id: z.string(),
    name: z.string(),
    author: z.string(),
    thumbnailUrl: z.string().url(),
    priceCents: z.number(),
    numberOfSales: z.number(),
    rating: z.number().optional(),
    url: z.string().url(),
  })).describe('A list of templates from Envato.'),
});
export type SearchEnvatoTemplatesOutput = z.infer<typeof SearchEnvatoTemplatesOutputSchema>;
