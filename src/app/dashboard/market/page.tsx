
"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, LineChart, TrendingUp, TrendingDown, Minus, Wallet, Building, Leaf } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { MarketAnalysisOutput } from "@/ai/flows/market-analysis";
import { useUserData } from "@/context/UserDataProvider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cropTypes } from "../smart-fields/page";
import { getMarketAnalysis } from "@/ai/flows/market-analysis";
import { useToast } from "@/hooks/use-toast";
import { states, districts } from "@/lib/india-states-districts";

const trendIcons = {
    up: <TrendingUp className="w-5 h-5 text-green-500" />,
    down: <TrendingDown className="w-5 h-5 text-red-500" />,
    stable: <Minus className="w-5 h-5 text-gray-500" />,
};


export default function MarketPage() {
    const { fields, isLoading: isUserLoading, translate } = useUserData();
    
    const [selectedCrop, setSelectedCrop] = React.useState<string | undefined>();
    const [selectedState, setSelectedState] = React.useState<string | undefined>();
    const [selectedDistrict, setSelectedDistrict] = React.useState<string | undefined>();
    const [availableDistricts, setAvailableDistricts] = React.useState<{value: string, label: string}[]>([]);
    
    const [analysisData, setAnalysisData] = React.useState<MarketAnalysisOutput | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const { toast } = useToast();
    
    React.useEffect(() => {
        if (!isUserLoading && fields.length > 0 && !selectedCrop) {
            setSelectedCrop(fields[0].cropType);
        }
    }, [isUserLoading, fields, selectedCrop])
    
    React.useEffect(() => {
        if (selectedState) {
            setAvailableDistricts(districts[selectedState] || []);
            setSelectedDistrict(undefined); // Reset district when state changes
        } else {
            setAvailableDistricts([]);
            setSelectedDistrict(undefined);
        }
    }, [selectedState]);
    
    const handleGetAnalysis = async () => {
        if (!selectedCrop) {
            toast({ title: translate("No Crop Selected"), description: translate("Please select a crop to get a market analysis."), variant: "destructive" });
            return;
        }
        if (!selectedState) {
            toast({ title: translate("No State Selected"), description: translate("Please select a state for the analysis."), variant: "destructive" });
            return;
        }

        setIsLoading(true);
        setAnalysisData(null); 
        const region = selectedDistrict ? `${selectedDistrict}, ${selectedState}` : selectedState;
        try {
            const result = await getMarketAnalysis({cropType: selectedCrop, region});
            setAnalysisData(result);
        } catch (error) {
            toast({ title: translate("Analysis Failed"), description: (error as Error).message, variant: "destructive" });
            setAnalysisData(null);
        } finally {
            setIsLoading(false);
        }
    }


  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="relative h-48 md:h-56 rounded-xl overflow-hidden mb-6 animate-slide-in-up border bg-card">
          <div className="absolute inset-0 z-0">
            <svg
              className="w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 1440 250"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="market-glow" cx="0" cy="0" r="1">
                    <stop stopColor="hsl(var(--accent))" stopOpacity="0.2" />
                    <stop offset="1" stopColor="hsl(var(--accent) / 0)" />
                </radialGradient>
                 <linearGradient id="market-bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary) / 0.1)" />
                    <stop offset="100%" stopColor="hsl(var(--background) / 0.1)" />
                </linearGradient>
              </defs>
               <rect width="1440" height="250" fill="url(#market-bg)" />
               <rect x="-100" y="-50" width="800" height="400" fill="url(#market-glow)" transform="rotate(10)" />
               <rect x="800" y="0" width="800" height="400" fill="url(#market-glow)" transform="rotate(-20)" />

                {/* Stacked Grains */}
                <g transform="translate(150 100) scale(1.4)" opacity="0.8" className="drop-shadow-lg">
                    <path d="M40 80 C 20 80, 20 40, 40 40 L60 40 C80 40, 80 80, 60 80 Z" fill="hsl(var(--accent) / 0.6)" />
                    <path d="M42 45 L58 45" stroke="hsl(var(--accent-foreground) / 0.3)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M40 80 C 40 90, 60 90, 60 80" stroke="hsl(var(--accent-foreground) / 0.2)" strokeWidth="3" fill="none" />
                </g>
                <g transform="translate(100 130) scale(1.8)" opacity="0.9" className="drop-shadow-lg">
                    <path d="M40 80 C 20 80, 20 40, 40 40 L60 40 C80 40, 80 80, 60 80 Z" fill="hsl(var(--accent) / 0.7)" />
                    <path d="M42 45 L58 45" stroke="hsl(var(--accent-foreground) / 0.4)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M40 80 C 40 90, 60 90, 60 80" stroke="hsl(var(--accent-foreground) / 0.3)" strokeWidth="3" fill="none" />
                </g>
                 <g transform="translate(200 140) scale(1.2)" opacity="0.7" className="drop-shadow-lg">
                    <path d="M40 80 C 20 80, 20 40, 40 40 L60 40 C80 40, 80 80, 60 80 Z" fill="hsl(var(--accent) / 0.5)" />
                    <path d="M42 45 L58 45" stroke="hsl(var(--accent-foreground) / 0.2)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M40 80 C 40 90, 60 90, 60 80" stroke="hsl(var(--accent-foreground) / 0.2)" strokeWidth="3" fill="none" />
                </g>

                {/* Money Bag */}
                <g transform="translate(1100 80) scale(2.2)" opacity="0.9" className="drop-shadow-lg">
                    <path d="M50 90 C 20 90, 20 50, 40 50 L60 50 C80 50, 80 90, 50 90 Z" fill="hsl(var(--primary) / 0.7)"/>
                    <rect x="35" y="40" width="30" height="10" rx="5" fill="hsl(var(--primary) / 0.9)"/>
                    <path d="M45 40 L55 40" stroke="hsl(var(--primary-foreground) / 0.5)" strokeWidth="2" strokeLinecap="round" />
                    <text x="50" y="78" fontFamily="sans-serif" fontSize="14" fill="hsl(var(--primary-foreground))" textAnchor="middle" fontWeight="bold">₹</text>
                </g>
            </svg>
          </div>
        <div className="relative z-10 flex flex-col justify-center p-6 h-full">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/80 rounded-full border-2 border-primary-foreground/50 shadow-lg">
               <Store className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground" style={{textShadow: '1px 1px 3px hsl(var(--background))'}}>{translate("Market Prices")}</h1>
              <p className="text-foreground/80" style={{textShadow: '1px 1px 2px hsl(var(--background))'}}>{translate("Connect to markets and get the best price for your produce.")}</p>
            </div>
          </div>
        </div>
      </div>

       <Card>
          <CardHeader>
            <CardTitle>{translate("Crop Market Analysis")}</CardTitle>
            <CardDescription>{translate("Select a crop and location to view a detailed market analysis and price trends.")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <Select onValueChange={setSelectedCrop} value={selectedCrop}>
                    <SelectTrigger>
                        <SelectValue placeholder={translate("Select a crop...")} />
                    </SelectTrigger>
                    <SelectContent>
                        {cropTypes.map(crop => (
                            <SelectItem key={crop.value} value={crop.value}>
                                <div className="flex items-center gap-2">
                                    <crop.icon className="h-4 w-4 text-muted-foreground" />
                                    <span>{translate(crop.label)}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <Select onValueChange={setSelectedState} value={selectedState}>
                    <SelectTrigger>
                        <SelectValue placeholder={translate("Select a state...")} />
                    </SelectTrigger>
                    <SelectContent>
                        {states.map(state => (
                            <SelectItem key={state.value} value={state.value}>
                                {state.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <Select onValueChange={setSelectedDistrict} value={selectedDistrict} disabled={!selectedState || availableDistricts.length === 0}>
                    <SelectTrigger>
                        <SelectValue placeholder={translate("Select a district (optional)...")} />
                    </SelectTrigger>
                    <SelectContent>
                        {availableDistricts.map(district => (
                            <SelectItem key={district.value} value={district.value}>
                                {district.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
              <Button onClick={handleGetAnalysis} disabled={isLoading || !selectedCrop || !selectedState} className="w-full md:w-auto self-end">
                  {isLoading && <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />}
                  {isLoading ? translate("Analyzing...") : translate("Get Analysis")}
              </Button>
          </CardContent>
      </Card>
      
      {isLoading ? (
          <MarketAnalysisSkeleton />
      ) : analysisData ? (
          <MarketAnalysisView analysis={analysisData} />
      ) : (
        <Card className="text-center py-10">
            <CardContent>
                <Leaf className="mx-auto w-12 h-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">{translate("Select a crop and location, then click \"Get Analysis\".")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{translate("Add a field in 'My Fields' to pre-select your crop.")}</p>
                 <Button asChild className="mt-4" variant="outline">
                    <Link href="/dashboard/smart-fields">{translate("Go to My Fields")}</Link>
                </Button>
            </CardContent>
        </Card>
      )}

    </div>
  );
}

const MarketAnalysisView = ({ analysis }: { analysis: MarketAnalysisOutput }) => {
    const { translate } = useUserData();
    const trendIcon = trendIcons[analysis.priceTrend.trend];
    const trendColor = analysis.priceTrend.trend === 'up' ? 'text-green-500' : analysis.priceTrend.trend === 'down' ? 'text-red-500' : 'text-gray-500';

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>{translate("Price Details for")} {translate(analysis.cropName)}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-3">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                        <Wallet className="w-8 h-8 text-primary" />
                        <div>
                            <div className="text-sm text-muted-foreground">{translate("Current Avg. Price")}</div>
                            <div className="text-2xl font-bold">₹{analysis.priceTrend.currentPrice}</div>
                        </div>
                    </div>
                     <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                        {trendIcon}
                        <div>
                            <div className="text-sm text-muted-foreground">{translate("Weekly Trend")}</div>
                            <div className={cn("text-2xl font-bold", trendColor)}>{analysis.priceTrend.change}%</div>
                        </div>
                    </div>
                     <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                        <LineChart className="w-8 h-8 text-primary" />
                        <div>
                            <div className="text-sm text-muted-foreground">{translate("Demand Forecast")}</div>
                            <div className="font-semibold">{analysis.demandForecast}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>{translate("Top Buyers & Recommendation")}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div>
                        <h3 className="font-semibold mb-2">{translate("Top Mandis/Buyers by Price")}</h3>
                        <div className="space-y-3">
                            {analysis.topBuyers.map(buyer => (
                                <div key={buyer.name} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                                    <div className="flex items-center gap-3">
                                        <Building className="w-5 h-5 text-primary"/>
                                        <span>{buyer.name}</span>
                                    </div>
                                    <div className="font-bold text-primary">₹{buyer.price}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="p-4 rounded-lg bg-accent/10">
                        <h3 className="font-semibold mb-2 text-accent-foreground/80">{translate("AI Recommendation")}</h3>
                        <p className="text-accent-foreground/90">{analysis.recommendation}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

const MarketAnalysisSkeleton = () => (
    <div className="grid gap-6">
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/3" />
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
                 <Skeleton className="h-40" />
                 <Skeleton className="h-40" />
            </CardContent>
        </Card>
    </div>
);
