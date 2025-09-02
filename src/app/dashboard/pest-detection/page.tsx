
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PestDetector from "@/components/dashboard/pest-detector";
import { ScanEye } from "lucide-react";
import { useUserData } from "@/context/UserDataProvider";
import Image from "next/image";

export default function PestDetectionPage() {
  const { translate } = useUserData();
  return (
    <div className="relative flex flex-1 flex-col gap-6">
      <Image
        src="https://picsum.photos/1200/800"
        alt="A doctor examining a plant"
        fill
        className="object-cover opacity-10 z-0"
        data-ai-hint="doctor examining plant"
      />
      <div className="relative z-10 flex flex-1 flex-col gap-6">
        <div className="flex items-center gap-4">
          <ScanEye className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">{translate("Crop Doctor")}</h1>
            <p className="text-muted-foreground">
              {translate("Upload a photo of your crop to identify potential issues and get recommended actions.")}
            </p>
          </div>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>{translate("Analyze a New Crop Image")}</CardTitle>
            <CardDescription>
              {translate("Your past analyses will be saved in the \"Detection History\" section below.")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PestDetector />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
