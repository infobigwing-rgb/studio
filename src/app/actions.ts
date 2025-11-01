"use server";

import {
  aiAssetRecommendations,
  AIAssetRecommendationsInput,
} from "@/ai/flows/ai-asset-recommendations";

import {
  processTemplateFile,
} from "@/ai/flows/process-template-flow";
import type { ProcessTemplateFileInput, ProcessTemplateFileOutput, SearchEnvatoTemplatesInput, SearchEnvatoTemplatesOutput } from "@/lib/types";
import { searchEnvatoTemplates } from "@/ai/flows/envato-integration-flow";

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

export async function searchEnvato(input: SearchEnvatoTemplatesInput): Promise<SearchEnvatoTemplatesOutput> {
  return await searchEnvatoTemplates(input);
}
