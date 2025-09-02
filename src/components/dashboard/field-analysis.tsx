
"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { analyzeUploadedImage, predictHarvestTime } from "@/lib/actions";
import type { AnalyzeUploadedImageOutput } from "@/ai/flows/analyze-uploaded-image";
import type { HarvestTimeOutput } from "@/ai/flows/harvest-time-prediction";
import { Upload, X, Bot, HeartPulse, FileText, Syringe, Calendar, Percent } from "lucide-react";
import type { Field } from "@/app/dashboard/smart-fields/page";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useUserData } from "@/context/UserDataProvider";

type AnalysisResult = AnalyzeUploadedImageOutput;
type HarvestResult = HarvestTimeOutput;

const riskLevelColors: Record<string, { text: string, bg: string }> = {
    "Good": { text: "text-green-600", bg: "bg-green-500" },
    "Ok": { text: "text-yellow-500", bg: "bg-yellow-400" },
    "Medium": { text: "text-yellow-600", bg: "bg-yellow-500" },
    "Risk": { text: "text-orange-600", bg: "bg-orange-500" },
    "High Risk": { text: "text-red-700", bg: "bg-red-600" },
}


export function FieldAnalysis({ field }: { field: Field }) {
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [analysis, setAnalysis] = React.useState<AnalysisResult | null>(null);
  const [harvestInfo, setHarvestInfo] = React.useState<HarvestResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [isFetchingHarvest, setIsFetchingHarvest] = React.useState(true);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { translate } = useUserData();
  const [translatedHarvestDate, setTranslatedHarvestDate] = React.useState<string | undefined>();

  React.useEffect(() => {
    async function fetchHarvestInfo() {
        setIsFetchingHarvest(true);
        try {
            const result = await predictHarvestTime({
                cropType: field.cropType,
                plantingDate: field.plantingDate.toISOString(),
            });
            setHarvestInfo(result);
            if(result.estimatedHarvestDate) {
              setTranslatedHarvestDate(result.estimatedHarvestDate)
            }
        } catch (error) {
            toast({
                title: translate("Harvest Prediction Failed"),
                description: (error as Error).message || translate("An unknown error occurred."),
                variant: "destructive",
            });
        } finally {
            setIsFetchingHarvest(false);
        }
    }

    fetchHarvestInfo();
  }, [field, toast, translate]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAnalysis(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !previewUrl) {
      toast({
        title: translate("No file selected"),
        description: translate("Please upload an image to analyze."),
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const result = await analyzeUploadedImage({ photoDataUri: previewUrl });
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      toast({
        title: translate("Analysis Failed"),
        description: (error as Error).message || translate("An unknown error occurred."),
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearSelection = () => {
    setFile(null);
    setPreviewUrl(null);
    setAnalysis(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const riskLevel = analysis?.riskLevel ? riskLevelColors[analysis.riskLevel] : undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-1">
       <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-2"><Calendar className="text-primary"/>{translate("Time to Harvest")}</CardTitle>
          </CardHeader>
          <CardContent>
            {isFetchingHarvest ? (
                <div className="flex items-center justify-center h-24">
                    <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            ) : (
                 <Alert>
                    <Bot className="h-4 w-4" />
                    <AlertTitle>{translate("AI Prediction")}</AlertTitle>
                    <AlertDescription>
                       {harvestInfo ? `${translate("Estimated")} ${harvestInfo.daysToHarvest} ${translate("days until harvest.")}` : translate("Could not fetch prediction.")}
                    </AlertDescription>
                </Alert>
            )}
             <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2 font-medium text-foreground"><Calendar className="w-4 h-4 text-accent"/>{translate("Est. Harvest Date")}: {translatedHarvestDate || 'N/A'}</p>
             </div>
          </CardContent>
      </Card>

      <Card className="lg:col-span-1">
          <CardHeader>
             <CardTitle className="flex items-center gap-2"><HeartPulse className="text-primary"/>{translate("Crop Health Analysis")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <Card
              className="relative flex h-48 cursor-pointer flex-col items-center justify-center border-2 border-dashed bg-muted/50 hover:border-primary"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <>
                  <Image
                    src={previewUrl}
                    alt="Crop preview"
                    fill
                    style={{objectFit: 'contain'}}
                    className="rounded-lg p-2"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 z-10 h-6 w-6 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSelection();
                    }}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">{translate("Clear image")}</span>
                  </Button>
                </>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Upload className="mx-auto h-10 w-10" />
                  <p className="mt-2 text-sm font-semibold">{translate("Click to upload an image")}</p>
                  <p className="text-xs">{translate("Upload a recent photo of your crops")}</p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
              />
            </Card>
            <Button onClick={handleAnalyze} disabled={!file || isAnalyzing} className="w-full">
              {isAnalyzing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  {translate("Analyzing...")}
                </>
              ) : (
                translate("Analyze Crop Health")
              )}
            </Button>
          </CardContent>
      </Card>

      {(isAnalyzing || analysis) && (
        <div className="lg:col-span-3">
            {isAnalyzing ? (
              <div className="flex h-full min-h-64 items-center justify-center rounded-lg bg-muted/50">
                <div className="text-center">
                  <Bot className="mx-auto h-12 w-12 animate-pulse text-primary" />
                  <p className="mt-4 font-semibold">{translate("AI is analyzing your image...")}</p>
                  <p className="text-sm text-muted-foreground">{translate("This may take a moment.")}</p>
                </div>
              </div>
            ) : analysis ? (
              <Card className="h-full bg-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText />{translate("Analysis Result")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-semibold flex items-center gap-2"><Percent/>{translate("Overall Health")}</h3>
                            <span 
                                className={cn(
                                    "font-bold text-lg",
                                    riskLevel?.text
                                )}
                            >
                                {analysis.healthPercentage}%
                            </span>
                        </div>
                        <Progress value={analysis.healthPercentage} className="h-3" indicatorClassName={riskLevel?.bg} />
                        <div className="flex justify-between text-sm">
                            <span className={cn("font-medium px-2 py-0.5 rounded-full text-white", riskLevel?.bg)}>
                                {analysis.riskLevel}
                            </span>
                            <span className="text-muted-foreground">{analysis.pestOrDisease}</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2"><FileText className="text-primary"/>{translate("Summary")}</h3>
                        <p className="mt-2 text-muted-foreground">{analysis.summary}</p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2"><Syringe className="text-primary"/>{translate("Recommended Actions")}</h3>
                        <p className="mt-2 text-muted-foreground whitespace-pre-wrap">{analysis.recommendedActions}</p>
                    </div>
                </CardContent>
              </Card>
            ) : null}
        </div>
      )}
    </div>
  );
}
