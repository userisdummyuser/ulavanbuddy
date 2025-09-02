
'use server';

/**
 * @fileOverview Provides a market analysis for a specific crop.
 * 
 * - getMarketAnalysis - A function that returns market analysis data.
 * - MarketAnalysisInput - The input type for the getMarketAnalysis function.
 * - MarketAnalysisOutput - The return type for the getMarketAnalysis function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const MarketAnalysisInputSchema = z.object({
  cropType: z.string().describe('The crop for which to generate the market analysis.'),
  region: z.string().describe('The geographical region for the analysis (e.g., a state or district in India).'),
});
export type MarketAnalysisInput = z.infer<typeof MarketAnalysisInputSchema>;

const MarketAnalysisOutputSchema = z.object({
  cropName: z.string().describe("The name of the crop analyzed."),
  priceTrend: z.object({
    currentPrice: z.number().describe("The current average price in INR."),
    trend: z.enum(["up", "down", "stable"]).describe("The price trend direction."),
    change: z.number().describe("The percentage change over the last week.")
  }),
  demandForecast: z.string().describe("A 1-2 sentence forecast of market demand for the next few weeks."),
  topBuyers: z.array(z.object({
    name: z.string().describe("The name of the mandi or major buyer."),
    price: z.number().describe("The offered price in INR at that location.")
  })).describe("A list of the top 3-4 mandis or buyers with the best prices currently."),
  recommendation: z.string().describe("A clear, actionable recommendation for the farmer (e.g., 'Sell now', 'Hold for 2 weeks', 'Sell partially').")
});
export type MarketAnalysisOutput = z.infer<typeof MarketAnalysisOutputSchema>;

export async function getMarketAnalysis(input: MarketAnalysisInput): Promise<MarketAnalysisOutput> {
    return marketAnalysisFlow(input);
}

const prompt = ai.definePrompt({
    name: 'marketAnalysisPrompt',
    input: { schema: MarketAnalysisInputSchema },
    output: { schema: MarketAnalysisOutputSchema },
    prompt: `You are an expert agricultural market analyst AI.
    
    Generate a concise, simulated market analysis report for the specified crop in the given region of India. Prices should be provided in INR.
    If a district is provided, focus the analysis on that district and its nearest major mandis. If only a state is provided, give a state-level overview.
    
    IMPORTANT: This is a simulation based on plausible market conditions. The data does not have to be real-time, but it should be realistic and internally consistent.
    
    The analysis must include:
    1.  Current average price trend (up, down, or stable) with a weekly percentage change.
    2.  A brief demand forecast.
    3.  A list of the top 3-4 mandis (markets) or major buyers with the best simulated prices relevant to the specified region.
    4.  A clear, actionable recommendation for the farmer.
    
    Crop: {{{cropType}}}
    Region: {{{region}}}
    
    Today's date is ${new Date().toDateString()}.
    `,
});

const marketAnalysisFlow = ai.defineFlow(
    {
        name: 'marketAnalysisFlow',
        inputSchema: MarketAnalysisInputSchema,
        outputSchema: MarketAnalysisOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);

    