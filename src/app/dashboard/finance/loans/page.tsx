
"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, HandCoins } from "lucide-react";
import { useUserData } from "@/context/UserDataProvider";

export default function LoansPage() {
  const { translate } = useUserData();

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center gap-4">
        <HandCoins className="w-10 h-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{translate("Apply for a Loan")}</h1>
          <p className="text-muted-foreground">{translate("Get an instant AI-powered assessment for your credit needs.")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{translate("Coming Soon")}</CardTitle>
          <CardDescription>
            {translate("This feature is currently under development.")}
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col items-center justify-center text-center h-96 border-2 border-dashed rounded-lg bg-muted/50 overflow-hidden">
             <Image 
              src="https://picsum.photos/800/400"
              alt="Illustration of a bank and farm"
              width={800}
              height={400}
              className="w-full h-2/3 object-cover"
              data-ai-hint="bank farm"
            />
            <div className="p-6">
              <Bot className="w-12 h-12 mx-auto text-muted-foreground animate-pulse" />
              <p className="mt-4 text-muted-foreground">
                {translate("Our team is working on bringing you direct loan applications. Please check back later.")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const InfoBox = ({label, value}: {label: string, value: string}) => (
    <div className="p-3 bg-muted/50 rounded-md">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold text-lg text-primary">{value}</p>
    </div>
)
