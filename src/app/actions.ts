"use server";

import {
  aiAssetRecommendations,
  AIAssetRecommendationsInput,
} from "@/ai/flows/ai-asset-recommendations";

import {
  processTemplateFile,
  ProcessTemplateFileInput,
  ProcessTemplateFileOutput,
} from "@/ai/flows/process-template-flow";

export async function getAssetRecommendations(
  input: AIAssetRecommendationsInput
) {
  return await aiAssetRecommendations(input);
}

export async function processTemplate(
  input: ProcessTemplateFileInput
): Promise<ProcessTemplateFileOutput> {
  return await processTemplateFile(input);
}
