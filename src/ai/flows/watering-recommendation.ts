
'use server';

/**
 * @fileOverview Provides AI-powered watering recommendations for crops.
 *
 * - getWateringRecommendation - A function that returns a watering recommendation.
 * - WateringRecommendationInput - The input type for the getWateringRecommendation function.
 * - WateringRecommendationOutput - The return type for the getWateringRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { getCurrentWeather } from '../tools/weather';

const WateringRecommendationInputSchema = z.object({
  cropType: z.string().describe('The type of crop planted in the field.'),
  plantingDate: z.string().describe('The planting date of the crop.'),
  latitude: z.number().describe('The latitude of the field.'),
  longitude: z.number().describe('The longitude of the field.'),
});
export type WateringRecommendationInput = z.infer<typeof WateringRecommendationInputSchema>;

const WateringRecommendationOutputSchema = z.object({
  recommendation: z.string().describe('A concise watering recommendation for the next 24-48 hours.'),
});
export type WateringRecommendationOutput = z.infer<typeof WateringRecommendationOutputSchema>;


export async function getWateringRecommendation(input: WateringRecommendationInput): Promise<WateringRecommendationOutput> {
  return wateringRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'wateringRecommendationPrompt',
  input: {schema: z.object({
    cropType: WateringRecommendationInputSchema.shape.cropType,
    daysSincePlanting: z.number().describe('The number of days that have passed since the crop was planted.'),
    weather: z.string().describe('A summary of the current weather conditions, including temperature, wind speed, and condition.')
  })},
  output: {schema: WateringRecommendationOutputSchema.pick({recommendation: true})},
  prompt: `You are an expert agronomist AI specializing in irrigation management.
  
  Your goal is to provide a clear, actionable watering recommendation for the next 24-48 hours.
  Base your recommendation on the crop's specific needs at its current growth stage, determined by the days since planting, and the current weather conditions.

  - A crop planted only a few days ago needs very little water.
  - A crop in its peak growth phase will require more.
  - Hot and windy conditions increase water needs.

  Crop Type: {{{cropType}}}
  Days Since Planting: {{{daysSincePlanting}}}
  Current Weather: {{{weather}}}
  
  Example recommendations:
  - "The crop is in its early seedling stage. The soil should be moist enough. No immediate watering is needed."
  - "The crop is in its peak vegetative growth phase. Watering is recommended within the next 24 hours to prevent stress due to high temperatures."
  - "Given the crop's maturity and the rainy forecast, withhold watering for at least 3 days."
`,
});

const wateringRecommendationFlow = ai.defineFlow(
  {
    name: 'wateringRecommendationFlow',
    inputSchema: WateringRecommendationInputSchema,
    outputSchema: WateringRecommendationOutputSchema,
  },
  async (input) => {
    const currentWeather = await getCurrentWeather({latitude: input.latitude, longitude: input.longitude});
    
    const weatherSummary = `Temperature: ${currentWeather.temperature}°C, Wind: ${currentWeather.windSpeed} km/h, Condition: ${currentWeather.condition}`;

    const plantingDate = new Date(input.plantingDate);
    const today = new Date();
    const daysSincePlanting = Math.floor((today.getTime() - plantingDate.getTime()) / (1000 * 60 * 60 * 24));

    const {output} = await prompt({
      cropType: input.cropType,
      daysSincePlanting: daysSincePlanting,
      weather: weatherSummary,
    });
    
    if (!output) {
      throw new Error("Could not generate a recommendation.");
    }
    
    return {
      recommendation: output.recommendation,
    };
  }
);
