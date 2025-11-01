'use server';

/**
 * @fileOverview A secure proxy for interacting with the Envato API.
 *
 * This file defines a Genkit flow that will handle all communication
 * with the Envato API to search for and retrieve templates.
 *
 * @exports {
 *   searchEnvatoTemplates: function
 * }
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { SearchEnvatoTemplatesInputSchema, SearchEnvatoTemplatesOutputSchema, type SearchEnvatoTemplatesInput, type SearchEnvatoTemplatesOutput } from '@/lib/types';


export async function searchEnvatoTemplates(
  input: SearchEnvatoTemplatesInput
): Promise<SearchEnvatoTemplatesOutput> {
  return searchEnvatoTemplatesFlow(input);
}


// This is the main flow that will act as our secure backend proxy
const searchEnvatoTemplatesFlow = ai.defineFlow(
  {
    name: 'searchEnvatoTemplatesFlow',
    inputSchema: SearchEnvatoTemplatesInputSchema,
    outputSchema: SearchEnvatoTemplatesOutputSchema,
  },
  async (input) => {
    const envatoToken = process.env.ENVATO_TOKEN;

    if (!envatoToken) {
      throw new Error('Envato API token is not configured.');
    }

    const { query } = input;
    const site = 'videohive.net';

    const url = `https://api.envato.com/v1/discovery/search/search/item?site=${site}&term=${encodeURIComponent(query || '')}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${envatoToken}`,
          'User-Agent': 'Remian-Edit-Studio/1.0',
        }
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Envato API Error: ${response.status} ${response.statusText}`, errorBody);
        throw new Error(`Envato API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Transform the response to match our output schema
      const templates = data.matches.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        author: item.author_username,
        thumbnailUrl: item.previews?.icon_with_video_preview?.icon_url || 'https://picsum.photos/seed/placeholder/256/144',
        priceCents: item.price_cents,
        numberOfSales: item.number_of_sales,
        rating: item.rating?.rating,
        url: item.url,
      }));

      return {
        templates,
      };

    } catch (error) {
      console.error('Failed to fetch from Envato API:', error);
      // Return empty array on error to prevent crashing the client
      return { templates: [] };
    }
  }
);
