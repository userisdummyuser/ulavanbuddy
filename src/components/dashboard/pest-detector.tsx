"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { analyzeUploadedImage } from "@/lib/actions";
import type { AnalyzeUploadedImageOutput } from "@/ai/flows/analyze-uploaded-image";
import { Upload, X, Bot, AlertTriangle, Syringe, History, FileText, Camera } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { useUserData } from "@/context/UserDataProvider";

type AnalysisResult = AnalyzeUploadedImageOutput & {
  id: string;
  timestamp: string;
  image: string;
};

export default function PestDetector() {
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [analysis, setAnalysis] = React.useState<AnalyzeUploadedImageOutput | null>(null);
  const [history, setHistory] = React.useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { translate } = useUserData();

  React.useEffect(() => {
    const storedHistory = localStorage.getItem("pestDetectionHistory");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

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

  const handlePhotoTaken = (dataUri: string) => {
    setPreviewUrl(dataUri);
    // Convert base64 to a File object for consistency, though not strictly necessary if `handleAnalyze` just needs the data URI.
    fetch(dataUri)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
        setFile(file);
      });
  };

  const handleAnalyze = async () => {
    if (!previewUrl) {
      toast({
        title: translate("No file selected"),
        description: translate("Please upload or take a photo to analyze."),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnalysis(null);

    try {
      const result = await analyzeUploadedImage({ photoDataUri: previewUrl });
      setAnalysis(result);
      const newAnalysis: AnalysisResult = {
        ...result,
        id: new Date().toISOString(),
        timestamp: new Date().toLocaleString(),
        image: previewUrl,
      };
      const updatedHistory = [newAnalysis, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("pestDetectionHistory", JSON.stringify(updatedHistory));
    } catch (error) {
      console.error(error);
      toast({
        title: translate("Analysis Failed"),
        description: (error as Error).message || translate("An unknown error occurred."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

  return (
    <div className="flex flex-col gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-4">
             <Card
              className="relative flex h-64 flex-col items-center justify-center border-2 border-dashed bg-muted/50"
            >
              {previewUrl ? (
                <>
                  <Image
                    src={previewUrl}
                    alt="Crop preview"
                    fill
                    style={{ objectFit: "contain" }}
                    className="rounded-lg p-2"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full"
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
                <div className="text-center text-muted-foreground p-4">
                    <div className="flex items-center justify-center gap-8">
                       <div 
                         className="flex flex-col items-center gap-2 cursor-pointer p-4 rounded-lg hover:bg-muted"
                         onClick={() => fileInputRef.current?.click()}
                       >
                         <Upload className="mx-auto h-12 w-12" />
                         <p className="mt-2 font-semibold">{translate("Click to upload an image")}</p>
                         <p className="text-xs">{translate("PNG, JPG, or WEBP")}</p>
                       </div>
                       <div className="border-l h-24"></div>
                       <CameraCapture onPhotoTaken={handlePhotoTaken} />
                    </div>
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
            <Button onClick={handleAnalyze} disabled={!previewUrl || isLoading} size="lg">
              {isLoading ? (
                <>
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  {translate("Analyzing...")}
                </>
              ) : (
                translate("Analyze Crop Image")
              )}
            </Button>
          </div>

          <div className="flex flex-col">
            {isLoading ? (
              <div className="flex h-full items-center justify-center rounded-lg bg-muted/50">
                <div className="text-center">
                  <Bot className="mx-auto h-12 w-12 animate-pulse text-primary" />
                  <p className="mt-4 font-semibold">{translate("AI is analyzing your image...")}</p>
                  <p className="text-sm text-muted-foreground">{translate("This may take a moment.")}</p>
                </div>
              </div>
            ) : analysis ? (
              <Card className="h-full bg-card">
                <CardContent className="p-6">
                    <Alert variant={analysis.pestOrDisease.toLowerCase() === 'none' ? 'default' : 'destructive'}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>
                        {analysis.pestOrDisease}
                      </AlertTitle>
                      <AlertDescription>
                        {translate("This is the pest or disease identified by the AI.")}
                      </AlertDescription>
                    </Alert>

                    <div className="mt-6">
                        <h3 className="font-semibold text-lg flex items-center gap-2"><FileText className="text-primary"/>{translate("Summary")}</h3>
                        <p className="mt-2 text-muted-foreground">{analysis.summary}</p>
                    </div>

                    <div className="mt-6">
                        <h3 className="font-semibold text-lg flex items-center gap-2"><Syringe className="text-primary"/>{translate("Recommended Actions")}</h3>
                        <p className="mt-2 text-muted-foreground whitespace-pre-wrap">{analysis.recommendedActions}</p>
                    </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex h-full flex-col justify-center rounded-lg border-2 border-dashed bg-muted/50 p-8">
                 <div className="flex items-center gap-4">
                    <Bot className="h-12 w-12 text-muted-foreground" />
                    <div className="text-muted-foreground">
                        <p className="font-semibold text-lg">{translate("Awaiting Analysis")}</p>
                        <p className="mt-1 text-sm">{translate("Upload an image and click \"Analyze\" to see AI insights.")}</p>
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {history.length > 0 && (
           <Card>
            <CardContent className="pt-6">
                <Accordion type="single" collapsible>
                  <AccordionItem value="history">
                    <AccordionTrigger>
                      <h3 className="text-lg flex items-center gap-2">
                        <History className="h-5 w-5 text-primary" />
                        {translate("Detection History")}
                      </h3>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="mt-4 space-y-4 max-h-96 overflow-y-auto pr-4">
                        {history.map((item) => (
                           <Card key={item.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50">
                              <div className="relative h-40 md:h-auto rounded-md overflow-hidden">
                                  <Image src={item.image} alt="Analyzed crop" fill style={{objectFit: 'cover'}} />
                              </div>
                              <div className="md:col-span-2">
                                  <p className="text-sm text-muted-foreground">{item.timestamp}</p>
                                  <p className="font-bold mt-1">
                                    <span className={item.pestOrDisease.toLowerCase() === 'none' ? 'text-green-600' : 'text-destructive'}>
                                        {item.pestOrDisease}
                                    </span>
                                  </p>
                                  <p className="font-semibold text-sm mt-2">{item.summary}</p>
                                  <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{item.recommendedActions}</p>
                              </div>
                           </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
            </CardContent>
           </Card>
        )}
    </div>
  );
}


function CameraCapture({ onPhotoTaken }: { onPhotoTaken: (dataUri: string) => void; }) {
  const { translate } = useUserData();
  const { toast } = useToast();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  React.useEffect(() => {
    // Stop camera stream when dialog is closed
    if (!isDialogOpen && videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, [isDialogOpen]);

  const getCameraPermission = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast({
        variant: "destructive",
        title: "Camera Not Supported",
        description: "Your browser does not support camera access.",
      });
      setHasCameraPermission(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasCameraPermission(false);
      toast({
        variant: "destructive",
        title: "Camera Access Denied",
        description: "Please enable camera permissions in your browser settings.",
      });
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUri = canvas.toDataURL('image/jpeg');
    onPhotoTaken(dataUri);
    setIsDialogOpen(false); // Close dialog after capture
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div
            className="flex flex-col items-center gap-2 cursor-pointer p-4 rounded-lg hover:bg-muted"
            onClick={getCameraPermission}
        >
            <Camera className="mx-auto h-12 w-12" />
            <p className="mt-2 font-semibold">{translate("Take a Photo")}</p>
            <p className="text-xs">{translate("Use your device camera")}</p>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{translate("Take a Photo")}</DialogTitle>
        </DialogHeader>
        <div className="relative">
            <video ref={videoRef} className="w-full aspect-video rounded-md bg-black" autoPlay muted playsInline />
            <canvas ref={canvasRef} className="hidden" />
            {hasCameraPermission === false && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white flex-col p-4 rounded-md">
                   <Camera className="w-12 h-12 mb-4 text-destructive" />
                   <p className="text-center font-bold">{translate("Camera Access Denied")}</p>
                   <p className="text-center text-sm">{translate("Please enable camera permissions in your browser settings.")}</p>
                </div>
            )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">{translate("Cancel")}</Button>
          </DialogClose>
          <Button onClick={handleCapture} disabled={!hasCameraPermission}>
            {translate("Capture Photo")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const translate = (text: string) => {
    // This is a placeholder for the actual translation logic
    return text;
}
