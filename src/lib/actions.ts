

"use server";

import { analyzeUploadedImage as analyzeUploadedImageFlow, AnalyzeUploadedImageInput } from "@/ai/flows/analyze-uploaded-image";
import { getWateringRecommendation as getWateringRecommendationFlow, WateringRecommendationInput } from "@/ai/flows/watering-recommendation";
import { predictHarvestTime as predictHarvestTimeFlow, HarvestTimeInput } from "@/ai/flows/harvest-time-prediction";
import { findSchemes as findSchemesFlow, FindSchemesInput } from "@/ai/flows/find-schemes";
import { getMarketAnalysis as getMarketAnalysisFlow, MarketAnalysisInput } from "@/ai/flows/market-analysis";
import { getCreditAssessment as getCreditAssessmentFlow, CreditAdvisorInput } from "@/ai/flows/credit-advisor";
import { getWeatherForecast as getWeatherForecastFlow, WeatherForecastInput } from "@/ai/flows/weather-forecast";
import { getFarmingNews as getFarmingNewsFlow } from "@/ai/flows/get-farming-news";
import { krishiAssistantFlow as krishiAssistantFlowFn, KrishiAssistantInput } from "@/ai/flows/krishi-assistant";

// The actions now directly call the AI flows.
// Components calling these actions are responsible for their own try/catch blocks.

export async function analyzeUploadedImage(input: AnalyzeUploadedImageInput){
    return await analyzeUploadedImageFlow(input);
}

export async function getWateringRecommendation(input: WateringRecommendationInput) {
    return await getWateringRecommendationFlow(input);
}

export async function predictHarvestTime(input: HarvestTimeInput) {
    return await predictHarvestTimeFlow(input);
}

export async function findSchemes(input: FindSchemesInput) {
    return await findSchemesFlow(input);
}

export async function getMarketAnalysis(input: MarketAnalysisInput) {
    return await getMarketAnalysisFlow(input);
}

export async function getCreditAssessment(input: CreditAdvisorInput) {
    return await getCreditAssessmentFlow(input);
}

export async function getWeatherForecast(input: WeatherForecastInput) {
    return await getWeatherForecastFlow(input);
}

export async function getFarmingNews() {
    return await getFarmingNewsFlow();
}
    
export async function krishiAssistantFlow(input: KrishiAssistantInput) {
    return await krishiAssistantFlowFn(input);
}
