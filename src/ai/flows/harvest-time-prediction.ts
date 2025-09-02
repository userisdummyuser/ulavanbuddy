'use server';

/**
 * @fileOverview Predicts the harvest time for a given crop.
 *
 * - predictHarvestTime - A function that returns the estimated harvest date and days remaining.
 * - HarvestTimeInput - The input type for the predictHarvestTime function.
 * - HarvestTimeOutput - The return type for the predictHarvestTime function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HarvestTimeInputSchema = z.object({
  cropType: z.string().describe('The type of crop planted in the field.'),
  plantingDate: z.string().describe('The planting date of the crop in ISO format.'),
});
export type HarvestTimeInput = z.infer<typeof HarvestTimeInputSchema>;

const HarvestTimeOutputSchema = z.object({
  estimatedHarvestDate: z.string().describe('The estimated harvest date in a readable format (e.g., "October 15, 2024").'),
  daysToHarvest: z.number().describe('The estimated number of days from today until the harvest.'),
});
export type HarvestTimeOutput = z.infer<typeof HarvestTimeOutputSchema>;

export async function predictHarvestTime(input: HarvestTimeInput): Promise<HarvestTimeOutput> {
  return harvestTimeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'harvestTimePrompt',
  input: {schema: HarvestTimeInputSchema},
  output: {schema: HarvestTimeOutputSchema},
  prompt: `You are an agricultural expert. Based on the provided crop type and planting date, predict the estimated harvest date.
  
  Today's date is ${new Date().toDateString()}.
  
  Crop Type: {{{cropType}}}
  Planting Date: {{{plantingDate}}}
  
  Calculate the estimated harvest date and the number of days from today until harvest. Provide a specific date for the harvest.
  `,
});

const harvestTimeFlow = ai.defineFlow(
  {
    name: 'harvestTimeFlow',
    inputSchema: HarvestTimeInputSchema,
    outputSchema: HarvestTimeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
