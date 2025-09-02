
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Sprout, ArrowRight } from "lucide-react";
import WeatherWidget from "@/components/dashboard/weather-widget";
import IrrigationManagement from "@/components/dashboard/irrigation-management";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FarmingNews from "@/components/dashboard/farming-news";
import { useUserData } from "@/context/UserDataProvider";

export default function KnowledgePage() {
  const { translate } = useUserData();
  return (
    <div className="flex flex-1 flex-col gap-6">
       <div className="relative h-32 md:h-40 rounded-xl overflow-hidden mb-6 animate-slide-in-up border bg-secondary/50">
        <div className="absolute inset-0 z-0">
             <svg
                className="w-full h-full"
                preserveAspectRatio="none"
                viewBox="0 0 1440 250"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="skyGradient" x1="0.5" y1="0" x2="0.5" y2="1">
                    <stop stopColor="hsl(200 100% 90%)" />
                    <stop offset="1" stopColor="hsl(var(--background))" />
                  </linearGradient>
                  <radialGradient id="sunGradient" cx="0" cy="0" r="1">
                    <stop stopColor="hsl(45 90% 70%)" stopOpacity="0.8" />
                    <stop offset="1" stopColor="hsl(45 90% 70% / 0)" />
                  </radialGradient>
                </defs>
                <rect width="1440" height="250" fill="url(#skyGradient)" />
                <circle cx="1300" cy="60" r="120" fill="url(#sunGradient)" opacity="0.7" />

                {/* Rain Clouds */}
                <path d="M 200 150 C 150 150, 150 100, 230 100 C 250 50, 350 50, 370 100 C 450 100, 450 150, 400 150 Z" fill="hsl(var(--muted-foreground) / 0.4)" />
                <path d="M 350 120 C 300 120, 300 80, 380 80 C 400 40, 480 40, 500 80 C 580 80, 580 120, 530 120 Z" fill="hsl(var(--muted-foreground) / 0.5)" />

                {/* Rain streaks */}
                 <line x1="220" y1="160" x2="210" y2="180" stroke="hsl(var(--muted-foreground) / 0.6)" strokeWidth="1.5" />
                <line x1="240" y1="160" x2="230" y2="190" stroke="hsl(var(--muted-foreground) / 0.5)" strokeWidth="1.5" />
                <line x1="260" y1="160" x2="250" y2="180" stroke="hsl(var(--muted-foreground) / 0.6)" strokeWidth="1.5" />
                <line x1="280" y1="160" x2="270" y2="190" stroke="hsl(var(--muted-foreground) / 0.5)" strokeWidth="1.5" />
                <line x1="300" y1="160" x2="290" y2="180" stroke="hsl(var(--muted-foreground) / 0.6)" strokeWidth="1.5" />
                <line x1="320" y1="160" x2="310" y2="190" stroke="hsl(var(--muted-foreground) / 0.5)" strokeWidth="1.5" />
                <line x1="340" y1="160" x2="330" y2="180" stroke="hsl(var(--muted-foreground) / 0.6)" strokeWidth="1.5" />
                <line x1="360" y1="160" x2="350" y2="190" stroke="hsl(var(--muted-foreground) / 0.5)" strokeWidth="1.5" />
                <line x1="380" y1="160" x2="370" y2="180" stroke="hsl(var(--muted-foreground) / 0.6)" strokeWidth="1.5" />
                <line x1="400" y1="160" x2="390" y2="190" stroke="hsl(var(--muted-foreground) / 0.5)" strokeWidth="1.5" />
                <line x1="420" y1="160" x2="410" y2="180" stroke="hsl(var(--muted-foreground) / 0.6)" strokeWidth="1.5" />

                {/* Hills */}
                <path d="M-22 250H1450C1450 250 1200 180 1000 200C800 220 600 170 400 210C200 250 0 200 -22 250Z" fill="hsl(var(--primary) / 0.3)" />
                <path d="M-22 250H1450C1450 250 1150 200 950 220C750 240 650 190 450 230C250 270 0 220 -22 250Z" fill="hsl(var(--primary) / 0.4)" />
                
                {/* Detailed Long Farmland */}
                <g>
                  {/* Field 1 */}
                  <path d="M 0 220 C 100 230, 200 210, 300 215 C 400 220, 500 200, 600 205 L 600 250 H 0 Z" fill="hsl(95 40% 50% / 0.7)" />
                  {Array.from({ length: 20 }).map((_, i) => (
                    <path
                      key={`f1-${i}`}
                      d={`M ${i * 30} 250 L ${300 + i * 2} 205`}
                      stroke="hsl(95 44% 65% / 0.5)"
                      strokeWidth="1.5"
                    />
                  ))}
                  
                  {/* Field 2 */}
                  <path d="M 600 205 C 700 200, 800 220, 900 215 C 1000 210, 1100 230, 1200 225 L 1200 250 H 600 Z" fill="hsl(95 45% 55% / 0.7)" />
                   {Array.from({ length: 20 }).map((_, i) => (
                    <path
                      key={`f2-${i}`}
                      d={`M ${600 + i * 30} 250 L ${900 + i * 1.5} 210`}
                      stroke="hsl(95 35% 65% / 0.6)"
                      strokeWidth="1.5"
                    />
                  ))}

                   {/* Field 3 */}
                   <path d="M 1200 225 C 1250 230, 1300 220, 1350 225 C 1400 230, 1420 220, 1440 222 L 1440 250 H 1200 Z" fill="hsl(95 40% 50% / 0.7)" />
                   {Array.from({ length: 8 }).map((_, i) => (
                    <path
                      key={`f3-${i}`}
                      d={`M ${1200 + i * 30} 250 L ${1320 + i} 220`}
                      stroke="hsl(95 44% 65% / 0.5)"
                      strokeWidth="1.5"
                    />
                  ))}
                </g>
              </svg>
        </div>
        <div className="relative z-10 flex flex-col justify-center p-6 h-full">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/80 rounded-full border-2 border-primary-foreground/50 shadow-lg">
                   <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground" style={{textShadow: '1px 1px 3px hsl(var(--background))'}}>{translate("Crop & Weather Info")}</h1>
                  <p className="text-foreground/80" style={{textShadow: '1px 1px 2px hsl(var(--background))'}}>{translate("Your center for agricultural wisdom and insights.")}</p>
                </div>
            </div>
        </div>
      </div>

       <Card className="animate-slide-in-up" style={{animationDelay: '100ms'}}>
        <CardHeader>
            <CardTitle className="flex items-center gap-3"><Sprout className="text-primary"/>{translate("AI Crop Advisory")}</CardTitle>
            <CardDescription>{translate("Get personalized recommendations for your crops by managing your smart fields.")}</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground mb-4">{translate("Detailed field analysis, including health summaries and suggested actions, are available in the My Fields section.")}</p>
            <Button asChild>
                <Link href="/dashboard/smart-fields">{translate("Manage My Fields")} <ArrowRight /></Link>
            </Button>
        </CardContent>
      </Card>

      <div className="animate-slide-in-up" style={{animationDelay: '200ms'}}>
        <WeatherWidget />
      </div>
      <div className="animate-slide-in-up" style={{animationDelay: '300ms'}}>
        <IrrigationManagement />
      </div>
      <div className="animate-slide-in-up" style={{animationDelay: '400ms'}}>
        <FarmingNews />
      </div>
    </div>
  );
}

    