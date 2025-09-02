
'use server';

/**
 * @fileOverview A friendly and intelligent voice assistant for Indian farmers.
 * 
 * - krishiAssistantFlow - A function that provides answers to farming-related questions.
 * - KrishiAssistantInput - The input type for the krishiAssistantFlow function.
 * - KrishiAssistantOutput - The return type for the krishiAssistantFlow function.
 */

import { ai } from '@/ai/genkit';
import { weatherTool } from '@/ai/tools/weather';
import { marketAnalysisTool } from '@/ai/tools/market-analysis';
import { z } from 'zod';

const KrishiAssistantInputSchema = z.object({
  query: z.string().describe('The user\'s query in Tamil or English.'),
});
export type KrishiAssistantInput = z.infer<typeof KrishiAssistantInputSchema>;

const KrishiAssistantOutputSchema = z.object({
  response: z.string().describe('The assistant\'s response in the same language as the query.'),
});
export type KrishiAssistantOutput = z.infer<typeof KrishiAssistantOutputSchema>;

const farmingTipsTool = ai.defineTool(
    {
        name: 'getFarmingTip',
        description: 'Provides a general farming tip when the user asks for advice.',
        inputSchema: z.object({}),
        outputSchema: z.string(),
    },
    async () => {
        const tips = [
            "Regularly test your soil's pH and nutrient levels to ensure optimal crop growth. Use organic compost to improve soil structure.",
            "Utilize drip irrigation or sprinkler systems to reduce water wastage. Mulching can also help retain soil moisture.",
            "Combine biological, cultural, and chemical practices to manage pests effectively while minimizing environmental impact.",
            "Practice crop rotation to prevent soil depletion and reduce the buildup of pests and diseases.",
            "Ensure proper spacing between plants to allow for adequate sunlight, air circulation, and growth."
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    }
);


export async function krishiAssistantFlow(input: KrishiAssistantInput): Promise<KrishiAssistantOutput> {
    const llmResponse = await ai.generate({
        prompt: `You are Krishi, a friendly and intelligent voice assistant designed to help Indian farmers. You speak in simple, clear Tamil or English based on the user's language. Your job is to answer questions about crop health, irrigation, weather, market prices, and farming tips. Be concise, respectful, and practical.

        User Query: "${input.query}"
        
        Respond in the same language as the query. If the query is in Tamil, reply in Tamil. If in English, reply in English. Keep your tone warm, helpful, and easy to understand. Avoid technical jargon unless asked.`,
        tools: [weatherTool, marketAnalysisTool, farmingTipsTool],
    });

    const text = llmResponse.text();
    if (!text) {
        throw new Error('The model did not return a response.');
    }
    
    return { response: text };
}
