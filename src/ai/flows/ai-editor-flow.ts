'use server';
/**
 * @fileOverview An AI flow for editing video templates using natural language.
 *
 * This file defines a Genkit flow that interprets a user's command
 * to modify a structured Template object.
 *
 * @exports {
 *   editTemplateWithAI: function
 * }
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { EditWithAIInput, EditWithAIOutput } from '@/lib/types';
import { EditWithAIInputSchema, EditWithAIOutputSchema, LayerSchema, TemplateSchema } from '@/lib/types';


export async function editTemplateWithAI(input: EditWithAIInput): Promise<EditWithAIOutput> {
  return editTemplateFlow(input);
}

const editTemplatePrompt = ai.definePrompt({
  name: 'editTemplatePrompt',
  input: { schema: EditWithAIInputSchema },
  output: { schema: EditWithAIOutputSchema },
  prompt: `You are an expert video editing assistant AI. Your task is to modify a video template based on a user's natural language command.
  
  You will be given a JSON object representing the current video template and a text command from the user.
  
  Analyze the user's command and the template structure. Modify the JSON object to reflect the requested changes.
  
  Your response MUST be ONLY the modified JSON object for the entire template, conforming to the template schema. Do not add any conversational text or explanations.
  
  Here are the schemas for your reference:
  Template Schema: ${JSON.stringify(TemplateSchema.describe())}
  Layer Schema: ${JSON.stringify(LayerSchema.describe())}

  USER COMMAND:
  "{{{command}}}"

  CURRENT TEMPLATE:
  {{{jsonStringifiedTemplate}}}
  `,
});


const editTemplateFlow = ai.defineFlow(
  {
    name: 'editTemplateFlow',
    inputSchema: EditWithAIInputSchema,
    outputSchema: EditWithAIOutputSchema,
  },
  async (input) => {
    const { output } = await editTemplatePrompt({
        command: input.command,
        jsonStringifiedTemplate: JSON.stringify(input.template, null, 2)
    });

    if (!output) {
        throw new Error("The AI failed to return an updated template.");
    }

    // The output from the LLM is the template itself
    return { updatedTemplate: output.updatedTemplate };
  }
);
