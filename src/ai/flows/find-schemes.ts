
'use server';

/**
 * @fileOverview Finds relevant government schemes for farmers.
 *
 * - findSchemes - A function that returns a list of relevant schemes.
 * - FindSchemesInput - The input type for the findSchemes function.
 * - FindSchemesOutput - The return type for the findSchemes function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const FindSchemesInputSchema = z.object({
  state: z.string().describe('The state where the farmer resides.'),
  cropType: z.string().describe('The primary crop the farmer cultivates.'),
});
export type FindSchemesInput = z.infer<typeof FindSchemesInputSchema>;

const SchemeSchema = z.object({
    name: z.string().describe("The official name of the government scheme."),
    description: z.string().describe("A brief, one or two-sentence description of the scheme's purpose and benefits."),
    eligibility: z.string().describe("A concise summary of the key eligibility criteria for a farmer to apply."),
    benefit: z.string().describe("A summary of the primary financial or material benefit provided by the scheme.")
});

const FindSchemesOutputSchema = z.object({
  schemes: z.array(SchemeSchema).describe('A list of 2-3 relevant government schemes for the farmer.'),
});
export type FindSchemesOutput = z.infer<typeof FindSchemesOutputSchema>;

export async function findSchemes(input: FindSchemesInput): Promise<FindSchemesOutput> {
  return findSchemesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findSchemesPrompt',
  input: { schema: FindSchemesInputSchema },
  output: { schema: FindSchemesOutputSchema },
  prompt: `You are an expert on Indian agricultural policies and government schemes.
  
  A farmer has provided their state and primary crop type. Your task is to identify the top 2-3 most relevant and beneficial central and state-level government schemes available to them.
  
  For each scheme, provide a clear and concise summary covering its name, description, eligibility, and key benefits. Focus on schemes related to crop insurance, credit access, subsidies for seeds/fertilizers, and equipment.
  
  Farmer's State: {{{state}}}
  Primary Crop: {{{cropType}}}
  
  Generate a list of the most impactful schemes.
  `,
});


const findSchemesFlow = ai.defineFlow(
  {
    name: 'findSchemesFlow',
    inputSchema: FindSchemesInputSchema,
    outputSchema: FindSchemesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
