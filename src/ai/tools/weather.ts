
'use server';

import { ai } from "@/ai/genkit";
import { z } from "zod";
import { getWeatherForecast } from "../flows/weather-forecast";

const WeatherInputSchema = z.object({
  latitude: z.number().describe("The latitude for the weather forecast."),
  longitude: z.number().describe("The longitude for the weather forecast."),
});

const WeatherOutputSchema = z.object({
  temperature: z.number().describe("The current temperature in Celsius."),
  windSpeed: z.number().describe("The current wind speed in km/h."), // Note: This is simulated as forecast doesn't provide it.
  condition: z.string().describe("A brief description of the weather condition (e.g., 'Sunny', 'Cloudy')."),
  locationName: z.string().describe('The name of the location for the forecast.')
});

export const weatherTool = ai.defineTool(
  {
    name: 'getCurrentWeatherTool',
    description: 'Get the current weather for a specific location. This is a simulation and not real-time data.',
    inputSchema: WeatherInputSchema,
    outputSchema: z.string().describe("A summary of the weather including temperature, condition, and location."),
  },
  async ({ latitude, longitude }) => {
    console.log(`Fetching weather forecast for: lat=${latitude}, lon=${longitude}`);
    
    const forecast = await getWeatherForecast({ latitude, longitude });
    if (!forecast) {
      throw new Error("Could not retrieve forecast.");
    }
    const today = forecast.forecast[0];

    return `The weather in ${forecast.locationName} is currently ${today.condition.toLowerCase()} with a high of ${today.highTemp}°C.`;
  }
);


export async function getCurrentWeather(input: z.infer<typeof WeatherInputSchema>): Promise<z.infer<typeof WeatherOutputSchema>> {
    const forecast = await getWeatherForecast({ latitude: input.latitude, longitude: input.longitude });
    if (!forecast) {
      throw new Error("Could not retrieve forecast.");
    }
    const today = forecast.forecast[0];

    // Simulate windspeed as it's not in the forecast data
    const windSpeed = 5 + (Math.random() * 10); 

    return {
      temperature: today.highTemp,
      windSpeed: parseFloat(windSpeed.toFixed(1)),
      condition: today.condition,
      locationName: forecast.locationName,
    };
}
