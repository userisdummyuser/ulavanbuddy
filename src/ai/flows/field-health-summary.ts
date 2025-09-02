'use server';

/**
 * @fileOverview Generates a summarized report on a field's health using AI analysis of satellite imagery and weather data.
 *
 * - getFieldHealthSummary - A function that retrieves the field health summary.
 * - FieldHealthSummaryInput - The input type for the getFieldHealthSummary function.
 * - FieldHealthSummaryOutput - The return type for the getFieldHealthSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FieldHealthSummaryInputSchema = z.object({
  fieldId: z.string().describe('The ID of the field to analyze.'),
  satelliteImageryDataUri: z
    .string()
    .describe(
      "Satellite imagery of the field, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  weatherData: z.string().describe('Weather data for the field.'),
  cropType: z.string().describe('The type of crop planted in the field.'),
  plantingDate: z.string().describe('The planting date of the crop.'),
});
export type FieldHealthSummaryInput = z.infer<typeof FieldHealthSummaryInputSchema>;

const FieldHealthSummaryOutputSchema = z.object({
  summary: z.string().describe('A comprehensive, multi-sentence summary of the overall field health, including key findings and potential issues.'),
  ndvi: z.number().min(0).max(1).describe('The Normalized Difference Vegetation Index (NDVI) of the field, as a value between 0 and 1. This indicates vegetation density and health.'),
  soilMoisture: z.number().min(0).max(100).describe('The estimated soil moisture level of the field as a percentage.'),
  cropStress: z.string().describe('A qualitative assessment of crop stress (e.g., "Low", "Moderate", "High").'),
  droughtRisk: z.string().describe('The predicted drought risk for the field (e.g., "Low", "Medium", "High").'),
  floodRisk: z.string().describe('The predicted flood risk for the field (e.g., "Low", "Medium", "High").'),
  pestDiseaseLikelihood: z.string().describe('The likelihood of pest and disease infestation (e.g., "Low", "Medium", "High").'),
  yieldAnomalyPrediction: z.string().describe('The predicted yield anomaly for the field (e.g., "Normal", "Slightly Below Average", "Above Average").'),
  suggestedActions: z.string().describe('A bulleted or numbered list of clear, actionable, and prioritized suggestions for the farmer to improve field health.'),
});
export type FieldHealthSummaryOutput = z.infer<typeof FieldHealthSummaryOutputSchema>;

export async function getFieldHealthSummary(input: FieldHealthSummaryInput): Promise<FieldHealthSummaryOutput> {
  return fieldHealthSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fieldHealthSummaryPrompt',
  input: {schema: FieldHealthSummaryInputSchema},
  output: {schema: FieldHealthSummaryOutputSchema},
  prompt: `You are a world-class agronomist AI assistant. Your purpose is to provide farmers with a detailed and accurate health assessment of their fields.

  You will be given satellite imagery, weather data, the crop type, and its planting date.
  Analyze all the provided data to generate a robust and insightful field health summary.

  Your analysis must include:
  1.  **NDVI:** A precise value between 0 and 1.
  2.  **Soil Moisture:** An estimated percentage.
  3.  **Crop Stress:** A qualitative assessment.
  4.  **Risks:** Evaluate drought, flood, and pest/disease likelihood.
  5.  **Yield Prediction:** Anomaly prediction.
  6.  **Summary:** A detailed paragraph explaining the key findings.
  7.  **Suggested Actions:** A clear, prioritized list of actions the farmer should take.

  Field ID: {{{fieldId}}}
  Satellite Imagery: {{media url=satelliteImageryDataUri}}
  Weather Data: {{{weatherData}}}
  Crop Type: {{{cropType}}}
  Planting Date: {{{plantingDate}}}

  Generate the most accurate and comprehensive field health summary possible based on the provided information.
  The output MUST be in JSON format according to the FieldHealthSummaryOutputSchema schema. Use the descriptions in the schema to guide the content.
  `,
});

const fieldHealthSummaryFlow = ai.defineFlow(
  {
    name: 'fieldHealthSummaryFlow',
    inputSchema: FieldHealthSummaryInputSchema,
    outputSchema: FieldHealthSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
