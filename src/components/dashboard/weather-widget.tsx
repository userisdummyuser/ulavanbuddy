

'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSun,
  Sun,
  Cloudy,
  CloudDrizzle,
  MapPin,
  RefreshCw,
  Wind,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { useUserData } from '@/context/UserDataProvider';
import { getWeatherForecast } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

const weatherIconMap: { [key: string]: React.ElementType } = {
  sunny: Sun,
  'partly cloudy': CloudSun,
  cloudy: Cloud,
  showers: CloudRain,
  'light rain': CloudDrizzle,
  rain: CloudRain,
  thunderstorms: CloudLightning,
  overcast: Cloudy,
};

type CurrentWeather = {
    temperature: number;
    windSpeed: number;
    condition: string;
    locationName: string;
} | null;

const WeatherWidget = () => {
  const { fields, isLoading: isUserLoading, translate } = useUserData();
  const { toast } = useToast();
  const [weatherData, setWeatherData] = React.useState<CurrentWeather>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchWeather = React.useCallback(async () => {
    if (isUserLoading) return;
    setIsLoading(true);

    // Use the first field's location, or default if no fields.
    const latitude = fields.length > 0 ? fields[0].latitude : 25.98;
    const longitude = fields.length > 0 ? fields[0].longitude : 85.67;

    try {
      const forecast = await getWeatherForecast({ latitude, longitude });
       if (!forecast || !forecast.forecast || forecast.forecast.length === 0) {
        throw new Error("Could not retrieve forecast data.");
       }
      const today = forecast.forecast[0];
      // Simulate windspeed as it's not in the forecast data
      const windSpeed = 5 + (Math.random() * 10);
      const newWeatherData = {
          temperature: today.highTemp,
          windSpeed: parseFloat(windSpeed.toFixed(1)),
          condition: today.condition,
          locationName: forecast.locationName,
      };
      setWeatherData(newWeatherData);


    } catch (error) {
        toast({
            title: "Weather Failed",
            description: (error as Error).message || "Could not fetch weather data.",
            variant: "destructive",
        });
        setWeatherData(null);
    } finally {
        setIsLoading(false);
    }
  }, [fields, isUserLoading, toast]);


  React.useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const handleRefresh = () => {
    fetchWeather();
  }

  const getWeatherIcon = (condition: string) => {
    const normalizedCondition = condition.toLowerCase();
    for (const key in weatherIconMap) {
        if (normalizedCondition.includes(key)) {
            return weatherIconMap[key];
        }
    }
    return Cloud;
  }

  const Icon = weatherData ? getWeatherIcon(weatherData.condition) : Cloud;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle className="flex items-center gap-2">
                    <CloudSun className="text-primary" />
                    {translate('Current Weather')}
                </CardTitle>
                {isLoading ? (
                    <Skeleton className='h-5 w-48 mt-2' />
                ) : weatherData ? (
                    <CardDescription className="flex items-center gap-2 mt-2">
                        <MapPin className="w-4 h-4" />
                        {weatherData.locationName}
                    </CardDescription>
                ) : (
                    <CardDescription className="flex items-center gap-2 mt-2">
                       {translate('Simulated Data')}
                    </CardDescription>
                )}
            </div>
             <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? translate('Refreshing...') : translate('Refresh')}
             </Button>
        </div>

      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="flex items-center justify-center h-24 gap-8">
                <Skeleton className="w-20 h-20 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="w-32 h-8" />
                    <Skeleton className="w-48 h-6" />
                </div>
            </div>
        ) : weatherData ? (
          <div className="flex items-center gap-6">
            <Icon className="w-20 h-20 text-accent" />
            <div>
                <p className="text-5xl font-bold">{weatherData.temperature}°C</p>
                <p className="text-muted-foreground capitalize">{weatherData.condition}</p>
                 <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                    <Wind className="w-4 h-4" />
                    <span>{weatherData.windSpeed.toFixed(1)} km/h</span>
                </div>
            </div>
          </div>
        ) : (
             <div className="flex items-center justify-center h-24">
                <p className="text-muted-foreground">{translate('Could not load weather data.')}</p>
             </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
