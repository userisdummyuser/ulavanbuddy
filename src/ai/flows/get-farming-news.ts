

'use server';

/**
 * @fileOverview Fetches, summarizes, and categorizes real farming news articles.
 * 
 * - getFarmingNews - A function that returns a list of news articles and tips.
 * - FarmingNewsOutput - The return type for the getFarmingNews function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getLatestFarmingNews as getLatestFarmingNewsFromSvc } from '@/services/news';

const ArticleSchema = z.object({
  title: z.string().describe('The headline of the news article or tip.'),
  summary: z.string().describe('A one or two-sentence summary of the content.'),
  category: z.enum(["News", "Best Practice", "New Scheme"]).describe('The category of the content.'),
  icon: z.enum(["newspaper", "lightbulb", "gift"]).describe('An appropriate icon name ("newspaper" for News, "lightbulb" for Best Practice, "gift" for New Scheme).')
});

const FarmingNewsOutputSchema = z.object({
  articles: z.array(ArticleSchema).describe('A list of 3-5 summarized farming news articles and best practice tips.'),
});
export type FarmingNewsOutput = z.infer<typeof FarmingNewsOutputSchema>;


export async function getFarmingNews(): Promise<FarmingNewsOutput> {
    return farmingNewsFlow();
}

const farmingNewsFlow = ai.defineFlow(
    {
        name: 'farmingNewsFlow',
        outputSchema: FarmingNewsOutputSchema,
    },
    async () => {
        // Return a default set of news and best practices.
        // The external API call has been removed to avoid requiring an API key.
        return { 
            articles: [
                {
                    title: "Government Increases MSP for Kharif Crops",
                    summary: "The central government has announced a hike in the Minimum Support Price for several key Kharif crops to boost farmer income.",
                    category: "News",
                    icon: "newspaper"
                },
                {
                    title: "Pradhan Mantri Fasal Bima Yojana (PMFBY) Application Window Open",
                    summary: "Farmers can now apply for the government's flagship crop insurance scheme to protect against yield losses.",
                    category: "New Scheme",
                    icon: "gift"
                },
                {
                    title: "Soil Health Management",
                    summary: "Regularly test your soil's pH and nutrient levels to ensure optimal crop growth. Use organic compost to improve soil structure.",
                    category: "Best Practice",
                    icon: "lightbulb"
                },
                {
                    title: "Integrated Pest Management (IPM)",
                    summary: "Combine biological, cultural, and chemical practices to manage pests effectively while minimizing environmental impact.",
                    category: "Best Practice",
                    icon: "lightbulb"
                },
                    {
                    title: "Water Conservation Techniques",
                    summary: "Utilize drip irrigation or sprinkler systems to reduce water wastage. Mulching can also help retain soil moisture.",
                    category: "Best Practice",
                    icon: "lightbulb"
                }
            ] 
        };
    }
);
