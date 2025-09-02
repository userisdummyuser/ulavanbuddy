
"use client";

import * as React from "react";
import { useUserData } from "@/context/UserDataProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Map, PlusCircle, ArrowRight } from "lucide-react";
import Link from 'next/link';

export default function DashboardFieldSummary() {
    const { fields, translate } = useUserData();

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <Map className="w-6 h-6 text-primary"/>
                    {translate("My Fields")}
                </CardTitle>
                 <CardDescription>
                    {fields.length > 0 
                        ? `${translate("You have")} ${fields.length} ${translate("field(s) defined.")}`
                        : translate("Get started by adding your first field.")
                    }
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                {fields.length > 0 ? (
                    <div className="space-y-2">
                       {fields.slice(0, 2).map(field => (
                           <div key={field.id} className="p-3 rounded-md bg-muted/50 flex items-center justify-between">
                               <p className="font-semibold">{field.name}</p>
                               <p className="text-sm text-muted-foreground">{translate(field.cropType)}</p>
                           </div>
                       ))}
                       {fields.length > 2 && (
                           <p className="text-sm text-center text-muted-foreground pt-2">
                                + {fields.length - 2} {translate("more fields...")}
                           </p>
                       )}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-muted-foreground text-center">{translate("Add a field to see personalized insights and recommendations here.")}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                 <Button asChild className="w-full">
                  <Link href="/dashboard/smart-fields">
                    {fields.length > 0 ? translate("Manage Fields") : translate("Add New Field")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
