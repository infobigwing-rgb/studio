"use server";

import {
  aiAssetRecommendations,
  AIAssetRecommendationsInput,
} from "@/ai/flows/ai-asset-recommendations";

export async function getAssetRecommendations(
  input: AIAssetRecommendationsInput
) {
  return await aiAssetRecommendations(input);
}
