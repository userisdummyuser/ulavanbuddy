
'use server';

/**
 * @fileOverview Provides an AI-powered credit assessment for farmers.
 * 
 * - getCreditAssessment - A function that returns a credit assessment.
 * - CreditAdvisorInput - The input type for the getCreditAssessment function.
 * - CreditAdvisorOutput - The return type for the getCreditAssessment function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const CreditAdvisorInputSchema = z.object({
  name: z.string().describe("The farmer's full name."),
  state: z.string().describe("The state where the farmer resides."),
  cropType: z.string().describe("The primary crop the farmer cultivates."),
  loanAmount: z.number().describe("The requested loan amount in INR."),
  landSize: z.number().describe("The size of the farmer's land in acres."),
});
export type CreditAdvisorInput = z.infer<typeof CreditAdvisorInputSchema>;

const PartnerBankSchema = z.object({
    name: z.string().describe("The name of the partner bank."),
    website: z.string().url().describe("The official website URL for the bank's agricultural loan section."),
    contactInfo: z.string().describe("A brief contact instruction, e.g., 'Visit branch' or a (simulated) phone number.")
});

const CreditAdvisorOutputSchema = z.object({
  isEligible: z.boolean().describe("Whether the farmer is deemed eligible for the loan based on the AI assessment."),
  approvedAmount: z.number().describe("The recommended loan amount in INR. This can be the same as or lower than the requested amount."),
  interestRate: z.number().describe("A simulated annual interest rate for the loan."),
  reasoning: z.string().describe("A brief, 1-2 sentence explanation for the decision, highlighting key positive or negative factors."),
  nextSteps: z.string().describe("Clear, actionable next steps for the farmer to take, such as 'Prepare land ownership documents' or 'Contact a partner bank'."),
  partnerBanks: z.array(PartnerBankSchema).describe("A list of up to 3 recommended partner banks that are a good fit for the farmer's profile and loan request.")
});
export type CreditAdvisorOutput = z.infer<typeof CreditAdvisorOutputSchema>;

export async function getCreditAssessment(input: CreditAdvisorInput): Promise<CreditAdvisorOutput> {
  return creditAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'creditAdvisorPrompt',
  input: { schema: CreditAdvisorInputSchema },
  output: { schema: CreditAdvisorOutputSchema },
  prompt: `You are an AI credit advisor for an agricultural finance company.
  
  Your task is to perform a simulated creditworthiness assessment for a farmer based on the information provided. This is a simulation, so you should generate a realistic but not real assessment.
  
  Consider the following factors in your decision:
  -   **Loan Amount:** Higher amounts might carry more risk.
  -   **Crop Type:** Certain crops might be considered more stable or profitable.
  -   **Land Size:** Larger land holdings may indicate a greater capacity for repayment.
  -   **State:** You can invent plausible risk factors based on simulated regional economic conditions.
  
  Based on your assessment, decide if the farmer is eligible. Determine an appropriate approved loan amount (which may be less than requested) and a reasonable interest rate.
  
  Provide a concise reasoning for your decision and clear next steps for the farmer.

  **Crucially, if the farmer is eligible, you must recommend up to 3 of the most suitable partner banks from the list below.** Base your recommendation on the farmer's state, crop type, and loan amount.

  List of Potential Partner Banks:
  1.  **State Bank of India (SBI)** - Website: https://sbi.co.in/web/agri-rural - Contact: Visit nearest branch - Specialty: Nationwide presence, wide range of agri loans. Good for all crop types.
  2.  **HDFC Bank** - Website: https://www.hdfcbank.com/agri - Contact: Online application - Specialty: Focus on technology-driven farming, horticulture, and high-value crops. Prefers medium to large land holdings.
  3.  **Punjab National Bank (PNB)** - Website: https://www.pnbindia.in/agriculture-banking.html - Contact: Visit nearest branch - Specialty: Strong presence in Northern India, good for staple crops like wheat and rice.
  4.  **ICICI Bank** - Website: https://www.icicibank.com/rural/agri-business/index.page - Contact: Online application or call virtual RM - Specialty: Agri-business loans, good for farmers with secondary income sources.
  5.  **Bank of Baroda** - Website: https://www.bankofbaroda.in/agriculture-banking - Contact: Visit nearest branch - Specialty: Strong in Western and Southern India, good for cotton, sugarcane, and spices.
  
  Farmer's Name: {{{name}}}
  State: {{{state}}}
  Primary Crop: {{{cropType}}}
  Requested Loan Amount: {{{loanAmount}}} INR
  Land Size (acres): {{{landSize}}}
  `,
});

const creditAdvisorFlow = ai.defineFlow(
  {
    name: 'creditAdvisorFlow',
    inputSchema: CreditAdvisorInputSchema,
    outputSchema: CreditAdvisorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
