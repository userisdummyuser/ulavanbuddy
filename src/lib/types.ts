
import { z } from 'zod';
import { supportedLanguages } from '@/context/UserDataProvider';

/**
 * @fileOverview Shared type definitions and Zod schemas for the application.
 * This file does not contain "use client" or "use server" directives, making it
 * safe to import into both client and server components.
 */

// Schema for translating text - NO LONGER USED, KEPT FOR REFERENCE
export const TranslateTextInputSchema = z.object({
  text: z.string().describe('The text to be translated.'),
  targetLanguage: supportedLanguages,
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

export const TranslateTextOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;
