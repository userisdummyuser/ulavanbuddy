
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ScanEye, ArrowRight, Map } from "lucide-react";
import { useUserData } from "@/context/UserDataProvider";
import HubCarousel from "@/components/dashboard/hub-carousel";
import DashboardFieldSummary from "@/components/dashboard/dashboard-field-summary";
import FarmingNews from "@/components/dashboard/farming-news";

export default function DashboardPage() {
  const { farmerName, translate } = useUserData();

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Welcome Header */}
      <div className="animate-slide-in-up">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground/90">
          {translate("Welcome back")}, {farmerName}!
        </h1>
        <p className="text-muted-foreground">
          {translate("Here's your farm's command center.")}
        </p>
      </div>

      {/* Hubs Carousel */}
      <div className="w-full animate-slide-in-up" style={{ animationDelay: '100ms' }}>
        <h2 className="text-xl font-bold mb-4">{translate("Hubs")}</h2>
        <HubCarousel />
      </div>
      
      {/* Main Content Sections */}
      <div className="w-full flex flex-col gap-6">
          <div className="animate-slide-in-up" style={{ animationDelay: '200ms' }}>
            <DashboardFieldSummary />
          </div>
          <div className="animate-slide-in-up" style={{ animationDelay: '300ms' }}>
            <FarmingNews />
          </div>
          <div className="animate-slide-in-up" style={{ animationDelay: '400ms' }}>
            <Card>
              <CardHeader>
                <CardTitle>{translate("Quick Tools")}</CardTitle>
                <CardDescription>{translate("Access essential tools quickly.")}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                    <ScanEye className="w-8 h-8 text-primary"/>
                    <div>
                        <h3 className="font-semibold">{translate("Crop Doctor")}</h3>
                        <p className="text-xs text-muted-foreground">{translate("Identify crop issues.")}</p>
                    </div>
                    <Button asChild size="sm" className="ml-auto flex-shrink-0">
                        <Link href="/dashboard/pest-detection"><ArrowRight/></Link>
                    </Button>
                </div>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                    <Map className="w-8 h-8 text-primary"/>
                    <div>
                        <h3 className="font-semibold">{translate("My Fields")}</h3>
                        <p className="text-xs text-muted-foreground">{translate("Manage your fields.")}</p>
                    </div>
                    <Button asChild size="sm" className="ml-auto flex-shrink-0">
                        <Link href="/dashboard/smart-fields"><ArrowRight/></Link>
                    </Button>
                </div>
              </CardContent>
            </Card>
          </div>
      </div>
    </div>
  );
}
