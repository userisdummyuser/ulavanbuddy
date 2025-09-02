'use server';

/**
 * @fileOverview Provides a 5-day weather forecast for a given location.
 * 
 * - getWeatherForecast - A function that returns a 5-day weather forecast.
 * - WeatherForecastInput - The input type for the getWeatherForecast function.
 * - WeatherForecastOutput - The return type for the getWeatherForecast function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const WeatherForecastInputSchema = z.object({
  latitude: z.number().describe('The latitude of the location.'),
  longitude: z.number().describe('The longitude of the location.'),
});
export type WeatherForecastInput = z.infer<typeof WeatherForecastInputSchema>;

const DailyForecastSchema = z.object({
  day: z.string().describe('The day of the week (e.g., "Monday").'),
  date: z.string().describe('The date in a readable format (e.g., "August 26").'),
  highTemp: z.number().describe('The high temperature in Celsius.'),
  lowTemp: z.number().describe('The low temperature in Celsius.'),
  condition: z.string().describe('A brief description of the weather condition (e.g., "Partly Cloudy", "Showers", "Sunny").'),
  precipitationChance: z.number().describe('The chance of precipitation as a percentage (0-100).'),
});

const WeatherForecastOutputSchema = z.object({
  forecast: z.array(DailyForecastSchema).describe('A list of 5 daily forecast objects.'),
  locationName: z.string().describe('The name of the location for the forecast (e.g., "Pusa, Bihar, India").'),
});
export type WeatherForecastOutput = z.infer<typeof WeatherForecastOutputSchema>;

export async function getWeatherForecast(input: WeatherForecastInput): Promise<WeatherForecastOutput> {
    return weatherForecastFlow(input);
}

const prompt = ai.definePrompt({
    name: 'weatherForecastPrompt',
    input: { schema: WeatherForecastInputSchema },
    output: { schema: WeatherForecastOutputSchema },
    prompt: `You are a weather simulation AI. Provide a realistic, simulated 5-day weather forecast for the location at latitude {{{latitude}}} and longitude {{{longitude}}}.
    
IMPORTANT: This is a simulation based on typical weather patterns for the location and time of year. It is NOT real-time weather data.

First, perform a reverse geocoding lookup to identify the most accurate location name (city, region, country) from the coordinates.

Today's date is ${new Date().toDateString()}.
    
Generate a forecast for today and the next four days. Include the day of the week, date, high and low temperatures in Celsius, a brief weather condition description, and the chance of precipitation.
    `,
});

const weatherForecastFlow = ai.defineFlow(
    {
        name: 'weatherForecastFlow',
        inputSchema: WeatherForecastInputSchema,
        outputSchema: WeatherForecastOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
