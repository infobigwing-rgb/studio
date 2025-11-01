"use server";

import {
  aiAssetRecommendations,
  AIAssetRecommendationsInput,
} from "@/ai/flows/ai-asset-recommendations";

import {
  processTemplateFile,
} from "@/ai/flows/process-template-flow";
import type { ProcessTemplateFileInput, ProcessTemplateFileOutput } from "@/lib/types";

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
