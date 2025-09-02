
"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Sprout } from "lucide-react";

export default function CropCarePage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center gap-4">
        <Sprout className="w-10 h-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Crop Care</h1>
          <p className="text-muted-foreground">
            Detailed, AI-powered guides for managing your crops.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            This section is under development.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center h-96 border-2 border-dashed rounded-lg bg-muted/50 overflow-hidden">
            <Image 
              src="https://picsum.photos/800/400"
              alt="Illustration of a farmer studying plants"
              width={800}
              height={400}
              className="w-full h-2/3 object-cover"
              data-ai-hint="farmer studying plants"
            />
            <div className="p-6">
              <Bot className="w-12 h-12 mx-auto text-muted-foreground animate-pulse" />
              <p className="mt-4 text-muted-foreground">
                Our AI is cultivating new crop care guides. Please check back later.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
