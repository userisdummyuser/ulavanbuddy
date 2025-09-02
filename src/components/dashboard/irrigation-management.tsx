

"use client";

import * as React from "react";
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { getWateringRecommendation } from "@/lib/actions";
import type { Field } from "@/app/dashboard/smart-fields/page";
import type { WateringRecommendationOutput } from "@/ai/flows/watering-recommendation";
import { Bot, Map, Droplets, Bell } from "lucide-react";
import { useUserData } from "@/context/UserDataProvider";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";

export default function IrrigationManagement() {
  const { fields, notificationsEnabled, toggleNotifications, isLoading: isUserLoading, translate } = useUserData();
  const [selectedFieldId, setSelectedFieldId] = React.useState<string | undefined>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [recommendation, setRecommendation] = React.useState<WateringRecommendationOutput | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    if (!isUserLoading && fields.length > 0 && !selectedFieldId) {
        setSelectedFieldId(fields[0].id);
    }
  }, [isUserLoading, fields, selectedFieldId]);

  const handleFetchRecommendation = React.useCallback(async (fieldId: string | undefined) => {
    if (!fieldId) return;

    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    setIsLoading(true);
    setRecommendation(null);

    try {
        const result = await getWateringRecommendation({
            cropType: field.cropType,
            plantingDate: new Date(field.plantingDate).toISOString(),
            latitude: field.latitude,
            longitude: field.longitude,
        });

        setRecommendation(result);

    } catch (error) {
        console.error(error);
        toast({
            title: "Recommendation Failed",
            description: (error as Error).message,
            variant: "destructive"
        });
        setRecommendation(null);
    } finally {
        setIsLoading(false);
    }
  }, [fields, toast]);

  React.useEffect(() => {
    // Automatically fetch recommendation when selected field changes
    if (selectedFieldId) {
        handleFetchRecommendation(selectedFieldId);
    }
  }, [selectedFieldId, handleFetchRecommendation]);


  if (isUserLoading) {
      return <IrrigationSkeleton />;
  }

  if (fields.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Droplets /> {translate("Watering Advice")}</CardTitle>
          <CardDescription>{translate("Get personalized watering recommendations for your crops.")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center gap-4 h-48">
            <Map className="w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground">{translate("You don't have any fields yet.")}</p>
            <Button asChild>
                <Link href="/dashboard/smart-fields">{translate("Add a Field to Get Started")}</Link>
            </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
        <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-3"><Droplets className="text-primary"/>{translate("Watering Advice")}</CardTitle>
                <CardDescription>
                    {translate("Get personalized watering recommendations for your crops.")}
                </CardDescription>
              </div>
               <div className="flex items-center space-x-2">
                <Switch 
                  id="notification-switch" 
                  checked={notificationsEnabled}
                  onCheckedChange={toggleNotifications}
                />
                <Label htmlFor="notification-switch" className="flex items-center gap-1"><Bell className="w-4 h-4" /> {translate("Daily Alerts")}</Label>
              </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow">
                    <label htmlFor="field-select-irrigation" className="text-sm font-medium text-muted-foreground">{translate("Select a Field")}</label>
                    <Select onValueChange={setSelectedFieldId} value={selectedFieldId}>
                        <SelectTrigger id="field-select-irrigation">
                            <SelectValue placeholder={translate("Choose a field...")} />
                        </SelectTrigger>
                        <SelectContent>
                            {fields.map(field => (
                                <SelectItem key={field.id} value={field.id}>{field.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            {isLoading ? (
                <div className="flex items-center justify-center h-24">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            ) : recommendation ? (
                <div className="space-y-4 pt-4 border-t">
                     <Alert>
                        <Bot className="h-4 w-4" />
                        <AlertTitle>{translate("AI Recommendation")}</AlertTitle>
                        <AlertDescription>
                            {recommendation.recommendation}
                        </AlertDescription>
                    </Alert>
                </div>
            ) : (
                 <div className="flex items-center justify-center h-24">
                    <p className="text-muted-foreground">{translate("Could not load recommendation.")}</p>
                </div>
            )}
        </CardContent>
    </Card>
  );
}

const IrrigationSkeleton = () => (
    <Card>
        <CardHeader>
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <Skeleton className="h-7 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <div className="space-y-4 pt-4 border-t">
                <Skeleton className="h-12 w-full" />
            </div>
        </CardContent>
    </Card>
)
