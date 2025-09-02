'use server';

/**
 * @fileOverview AI agent that analyzes uploaded images of crops for potential pest or disease issues and recommends actions.
 *
 * - analyzeUploadedImage - A function that handles the analysis of uploaded crop images.
 * - AnalyzeUploadedImageInput - The input type for the analyzeUploadedImage function.
 * - AnalyzeUploadedImageOutput - The return type for the analyzeUploadedImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUploadedImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of the crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type AnalyzeUploadedImageInput = z.infer<typeof AnalyzeUploadedImageInputSchema>;

const AnalyzeUploadedImageOutputSchema = z.object({
  pestOrDisease: z.string().describe('The identified pest or disease affecting the crop, or "None" if the image shows a healthy crop.'),
  summary: z.string().describe('A one or two sentence summary of the recommended actions.'),
  recommendedActions: z.string().describe('Recommended actions to address the identified pest or disease. If no pest or disease is detected, suggest general crop health maintenance.'),
  healthPercentage: z.number().describe('The estimated health of the crop as a percentage from 0 to 100.'),
  riskLevel: z.enum(["Good", "Ok", "Medium", "Risk", "High Risk"]).describe('The risk level for the crop\'s health.'),
});
export type AnalyzeUploadedImageOutput = z.infer<typeof AnalyzeUploadedImageOutputSchema>;

export async function analyzeUploadedImage(input: AnalyzeUploadedImageInput): Promise<AnalyzeUploadedImageOutput> {
  return analyzeUploadedImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeUploadedImagePrompt',
  input: {schema: AnalyzeUploadedImageInputSchema},
  output: {schema: AnalyzeUploadedImageOutputSchema},
  prompt: `You are an expert in agricultural plant pathology. A farmer has uploaded an image of their crops, and your task is to analyze the image for any signs of pests or diseases.

  Based on the image, identify any potential pest or disease issues and provide recommended actions to address them. If the image shows a healthy crop, indicate that no issues were detected and provide general crop health maintenance tips.
  
  Provide a one or two sentence summary of your recommended actions.
  
  Also, provide an estimated health of the crop as a percentage from 0 to 100, where 100 is perfectly healthy.
  Based on the health percentage and visible issues, classify the risk level as "Good", "Ok", "Medium", "Risk", or "High Risk".

  Here is the uploaded image:
  {{media url=photoDataUri}}
  
  Respond with specific pest or disease names if identified, and practical, actionable steps the farmer can take.
`,
});

const analyzeUploadedImageFlow = ai.defineFlow(
  {
    name: 'analyzeUploadedImageFlow',
    inputSchema: AnalyzeUploadedImageInputSchema,
    outputSchema: AnalyzeUploadedImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
