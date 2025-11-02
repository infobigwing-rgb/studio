import { z } from 'zod';

export const PropertySchemaLoose = z.object({
  value: z.any(),
  type: z.enum(['text', 'number', 'color', 'slider', 'file', 'select', 'toggle-group']),
  label: z.string(),
  options: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().optional(),
    items: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  }).optional(),
});
export type Property = z.infer<typeof PropertySchemaLoose>;


export const LayerSchema = z.object({
  id: z.string().describe("A unique ID for the layer, e.g., 'layer_new_1'"),
  name: z.string().describe("A descriptive name for the layer, e.g., 'Main Title'"),
  type: z.enum(['text', 'image', 'shape']),
  properties: z.record(PropertySchemaLoose).describe("An object where keys are property names (e.g., 'content', 'fontSize') and values are the property definitions."),
});
export type Layer = z.infer<typeof LayerSchema>;


export const TemplateSchema = z.object({
  id:z.string(),
  name: z.string(),
  thumbnailUrl: z.string().url(),
  thumbnailHint: z.string(),
  layers: z.array(LayerSchema),
});
export type Template = z.infer<typeof TemplateSchema>;


export const ProcessTemplateFileInputSchema = z.object({
  fileName: z.string().describe('The name of the file to process.'),
});
export type ProcessTemplateFileInput = z.infer<typeof ProcessTemplateFileInputSchema>;

export const ProcessTemplateFileOutputSchema = TemplateSchema;
export type ProcessTemplateFileOutput = z.infer<typeof ProcessTemplateFileOutputSchema>;

// Define the input schema for searching templates
export const SearchEnvatoTemplatesInputSchema = z.object({
  query: z.string().optional().describe('The search query for templates.'),
  token: z.string().optional().describe('The user-specific Envato API token.'),
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


export const EditWithAIInputSchema = z.object({
  command: z.string().describe("The user's natural language command for the edit."),
  template: TemplateSchema.describe("The current state of the template to be edited."),
  jsonStringifiedTemplate: z.string().optional().describe("A JSON string representation of the template. This is used internally for the prompt and should not be provided by the client.")
});
export type EditWithAIInput = z.infer<typeof EditWithAIInputSchema>;

export const EditWithAIOutputSchema = z.object({
  updatedTemplate: TemplateSchema.describe("The full template object, modified by the AI according to the user's command."),
});
export type EditWithAIOutput = z.infer<typeof EditWithAIOutputSchema>;
