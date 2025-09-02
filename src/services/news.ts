
'use server';

/**
 * @fileOverview Service for fetching farming news from an external API.
 * 
 * Implements a caching mechanism to fetch news only once per day.
 */

import {unstable_cache as cache} from 'next/cache';

const getFarmingNewsFromApi = cache(
    async () => {
        console.log("Fetching fresh news from TheNewsApi...");
        const apiKey = process.env.NEWS_API_KEY;
        if (!apiKey) {
            console.error("NEWS_API_KEY is not set.");
            return [];
        }

        const searchTerms = "agriculture,farming,crops,mandi,rural";
        const url = `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&search=${searchTerms}&language=en&locale=in&limit=5`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API request failed with status ${response.status}: ${errorText}`);
            }
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error("Failed to fetch news from TheNewsApi:", error);
            // Return empty array on error to avoid breaking the app
            return [];
        }
    },
    ['farming-news'], // Cache key
    {
        revalidate: 3600, // 1 hour in seconds
        tags: ['news'],
    }
);


export async function getLatestFarmingNews() {
    return await getFarmingNewsFromApi();
}
