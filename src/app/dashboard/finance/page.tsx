
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Banknote, HandCoins, ShieldCheck, Landmark, ArrowRight, FileText, Gift } from "lucide-react";
import Link from 'next/link';
import Image from "next/image";
import { useUserData } from "@/context/UserDataProvider";
import { Badge } from "@/components/ui/badge";

export default function FinancePage() {
  const { translate } = useUserData();
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
                  <linearGradient id="skyGradient" x1="0.5" y1="0" x2="0.5" y2="1">
                    <stop stopColor="hsl(120 60% 90%)" />
                    <stop offset="1" stopColor="hsl(var(--background))" />
                  </linearGradient>
                  <radialGradient id="sunGradient" cx="0" cy="0" r="1">
                    <stop stopColor="hsl(45 100% 80%)" stopOpacity="0.8" />
                    <stop offset="1" stopColor="hsl(45 100% 80% / 0)" />
                  </radialGradient>
                </defs>
                <rect width="1440" height="250" fill="url(#skyGradient)" />
                <circle cx="100" cy="50" r="150" fill="url(#sunGradient)" opacity="0.6" />

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
              <Banknote className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground" style={{textShadow: '1px 1px 3px hsl(var(--background))'}}>{translate("Loans & Insurance")}</h1>
              <p className="text-foreground/80" style={{textShadow: '1px 1px 2px hsl(var(--background))'}}>{translate("Access to credit, insurance, and government schemes.")}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow md:col-span-2 animate-slide-in-up" style={{animationDelay: '100ms'}}>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="p-3 bg-accent/20 rounded-full">
              <HandCoins className="w-8 h-8 text-accent" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {translate("Apply for a Loan")}
                <Badge variant="outline">Demo</Badge>
              </CardTitle>
              <CardDescription className="mt-1">{translate("Get an instant AI-powered credit assessment and apply for loans directly through our platform.")}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/dashboard/finance/credit">
                  {translate("Apply for Credit")} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/finance/applications">
                  {translate("My Loan Applications")} <FileText className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow animate-slide-in-up" style={{animationDelay: '200ms'}}>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-full">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle>{translate("Find Crop Insurance")}</CardTitle>
              <CardDescription className="mt-1">{translate("Find relevant government insurance schemes for your crops.")}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/finance/insurance">
                {translate("Find Insurance Schemes")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow animate-slide-in-up" style={{animationDelay: '300ms'}}>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-full">
              <Landmark className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle>{translate("Find Government Subsidies")}</CardTitle>
              <CardDescription className="mt-1">{translate("Discover and apply for government schemes and subsidies.")}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
             <Button asChild>
              <Link href="/dashboard/finance/subsidy">
                {translate("Find Subsidies")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

         <Card className="hover:shadow-lg transition-shadow md:col-span-2 animate-slide-in-up" style={{animationDelay: '400ms'}}>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
             <div className="p-3 bg-accent/20 rounded-full">
              <Gift className="w-8 h-8 text-accent" />
            </div>
            <div>
              <CardTitle>{translate("Government Scheme Tracker")}</CardTitle>
              <CardDescription className="mt-1">{translate("Track the status of your submitted scheme applications.")}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/dashboard/finance/scheme-applications">
                {translate("My Scheme Applications")} <FileText className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
