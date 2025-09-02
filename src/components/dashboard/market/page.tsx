

"use client";

import * as React from "react";
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
            toast({ title: "No Crop Selected", description: "Please select a crop to get a market analysis.", variant: "destructive" });
            return;
        }
        if (!selectedState) {
            toast({ title: "No State Selected", description: "Please select a state for the analysis.", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        setAnalysisData(null); 
        const region = selectedDistrict ? `${selectedDistrict}, ${selectedState}` : selectedState;
        try {
            const result = await getMarketAnalysis({cropType: selectedCrop, region});
            setAnalysisData(result);
        } catch (error) {
            toast({ title: "Analysis Failed", description: (error as Error).message, variant: "destructive" });
            setAnalysisData(null);
        } finally {
            setIsLoading(false);
        }
    }


  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center gap-4">
        <Store className="w-10 h-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{translate("Market Prices")}</h1>
          <p className="text-muted-foreground">{translate("Connect to markets and get the best price for your produce.")}</p>
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
                    <CardTitle>{translate("Price Details for")} {analysis.cropName}</CardTitle>
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
