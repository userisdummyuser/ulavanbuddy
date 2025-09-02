
'use server';

import { ai } from "@/ai/genkit";
import { z } from "zod";
import { getMarketAnalysis } from "../flows/market-analysis";

const MarketAnalysisToolInputSchema = z.object({
  cropType: z.string().describe('The crop for which to generate the market analysis.'),
  region: z.string().describe('The geographical region for the analysis (e.g., a state or district in India).'),
});

export const marketAnalysisTool = ai.defineTool(
  {
    name: 'getMarketAnalysisTool',
    description: 'Get a simulated market analysis for a crop in a specific region of India.',
    inputSchema: MarketAnalysisToolInputSchema,
    outputSchema: z.string().describe("A summary of the market analysis, including price, trend, and recommendation."),
  },
  async ({ cropType, region }) => {
    console.log(`Fetching market analysis for: crop=${cropType}, region=${region}`);
    
    const analysis = await getMarketAnalysis({ cropType, region });
    if (!analysis) {
      return "I couldn't find any market data for that crop and region.";
    }

    // Format a natural language response
    const { priceTrend, demandForecast, recommendation } = analysis;
    return `The current average price for ${cropType} is ₹${priceTrend.currentPrice} and the trend is ${priceTrend.trend}. The demand is expected to be ${demandForecast.toLowerCase()}. My recommendation is to ${recommendation.toLowerCase()}.`;
  }
);
