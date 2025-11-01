'use server';

/**
 * @fileOverview Provides AI-powered recommendations for fonts, stock videos, and images.
 *
 * This file defines a Genkit flow that suggests suitable assets for a user's project.
 *
 * @exports {
 *   aiAssetRecommendations: function
 *   AIAssetRecommendationsInput: type
 *   AIAssetRecommendationsOutput: type
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIAssetRecommendationsInputSchema = z.object({
  projectDescription: z
    .string()
    .describe('A description of the project for which assets are needed.'),
  desiredStyle: z
    .string()
    .optional()
    .describe('The desired style or aesthetic of the assets.'),
  numRecommendations: z
    .number()
    .default(3)
    .describe('The number of recommendations to generate for each asset type.'),
});
export type AIAssetRecommendationsInput = z.infer<
  typeof AIAssetRecommendationsInputSchema
>;

const AIAssetRecommendationsOutputSchema = z.object({
  fontRecommendations: z.array(z.string()).describe('Recommended fonts.'),
  stockVideoRecommendations: z
    .array(z.string())
    .describe('Recommended stock videos.'),
  imageRecommendations: z.array(z.string()).describe('Recommended images.'),
});
export type AIAssetRecommendationsOutput = z.infer<
  typeof AIAssetRecommendationsOutputSchema
>;

export async function aiAssetRecommendations(
  input: AIAssetRecommendationsInput
): Promise<AIAssetRecommendationsOutput> {
  return aiAssetRecommendationsFlow(input);
}

const aiAssetRecommendationsPrompt = ai.definePrompt({
  name: 'aiAssetRecommendationsPrompt',
  input: {schema: AIAssetRecommendationsInputSchema},
  output: {schema: AIAssetRecommendationsOutputSchema},
  prompt: `You are an AI assistant designed to provide creative asset recommendations for video editing projects.

  Based on the project description and desired style, suggest a list of fonts, stock videos, and images that would be suitable for the project.

  Project Description: {{{projectDescription}}}
  Desired Style: {{{desiredStyle}}}
  Number of Recommendations: {{{numRecommendations}}}

  Format your response as a JSON object conforming to the following schema:
  ${JSON.stringify(AIAssetRecommendationsOutputSchema.describe())}
  `,
});

const aiAssetRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiAssetRecommendationsFlow',
    inputSchema: AIAssetRecommendationsInputSchema,
    outputSchema: AIAssetRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await aiAssetRecommendationsPrompt(input);
    return output!;
  }
);
