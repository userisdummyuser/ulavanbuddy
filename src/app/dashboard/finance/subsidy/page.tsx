
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Landmark, Bot, ArrowRight, CheckCircle, Info, Gift, MapPin, Wheat } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cropTypes } from "../../smart-fields/page";
import { findSchemes } from "@/ai/flows/find-schemes";
import type { FindSchemesOutput } from "@/ai/flows/find-schemes";
import { useUserData } from "@/context/UserDataProvider";


const FindSchemesInputSchema = z.object({
  state: z.string().min(1, "State is required."),
  cropType: z.string().min(1, "Please select a crop type."),
});

type FindSchemesFormValues = z.infer<typeof FindSchemesInputSchema>;

export default function SubsidyPage() {
  const { toast } = useToast();
  const { translate, addSchemeApplication } = useUserData();
  const [schemes, setSchemes] = React.useState<FindSchemesOutput['schemes'] | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<FindSchemesFormValues>({
    resolver: zodResolver(FindSchemesInputSchema),
    defaultValues: {
      state: "",
      cropType: "",
    },
  });


  async function onSubmit(data: FindSchemesFormValues) {
    setIsLoading(true);
    setSchemes(null);
    try {
        const result = await findSchemes(data);
        setSchemes(result.schemes);
        toast({
            title: translate("Schemes Found"),
            description: `${translate("Found")} ${result.schemes.length} ${translate("relevant schemes.")}`,
        });
    } catch (error) {
        toast({
            title: translate("Search Failed"),
            description: (error as Error).message,
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  }

  const handleApply = (schemeName: string) => {
    addSchemeApplication(schemeName);
    toast({
      title: translate("Application Started"),
      description: `${translate("Your application for")} "${schemeName}" ${translate("has been logged.")}`,
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/20 rounded-full">
            <Landmark className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{translate("Find Government Subsidies")}</h1>
          <p className="text-muted-foreground text-sm sm:text-base">{translate("Find government subsidies for seeds, fertilizers, and equipment.")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{translate("Find Subsidies")}</CardTitle>
            <CardDescription>{translate("Enter your details to find relevant subsidy options from our AI assistant.")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><MapPin/>{translate("State")}</FormLabel>
                      <FormControl>
                        <Input placeholder={translate("e.g., Punjab, Maharashtra")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="cropType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center gap-2"><Wheat/>{translate("Primary Crop Type")}</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder={translate("Select a crop")} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {cropTypes.map(crop => (
                                    <SelectItem key={crop.value} value={crop.value}>
                                        <div className="flex items-center gap-2">
                                            <crop.icon className="h-4 w-4 text-muted-foreground" />
                                            <span>{translate(crop.label)}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />}
                    {isLoading ? translate('Finding Subsidies...') : translate('Find Subsidies')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
            {isLoading ? (
                 <div className="flex h-full items-center justify-center rounded-lg bg-muted/50 min-h-[400px]">
                    <div className="text-center">
                    <Bot className="mx-auto h-12 w-12 animate-pulse text-primary" />
                    <p className="mt-4 font-semibold">{translate("AI is searching for subsidies...")}</p>
                    <p className="text-sm text-muted-foreground">{translate("This may take a moment.")}</p>
                    </div>
                </div>
            ) : schemes ? (
                <div className="space-y-4">
                  {schemes.length > 0 ? (
                    schemes.map((scheme) => (
                      <Card key={scheme.name}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2"><Gift className="text-primary"/>{scheme.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-muted-foreground">{scheme.description}</p>
                          <div>
                            <h4 className="font-semibold text-foreground">{translate("Key Benefit")}</h4>
                            <p className="text-sm text-muted-foreground">{scheme.benefit}</p>
                          </div>
                           <div>
                            <h4 className="font-semibold text-foreground">{translate("Eligibility")}</h4>
                            <p className="text-sm text-muted-foreground">{scheme.eligibility}</p>
                          </div>
                        </CardContent>
                         <CardFooter>
                            <Button onClick={() => handleApply(scheme.name)}>
                                {translate("Apply Now")} <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                     <div className="flex h-full flex-col justify-center rounded-lg border-2 border-dashed bg-muted/50 p-8 min-h-[400px]">
                        <div className="flex items-center gap-4">
                            <Info className="h-12 w-12 text-muted-foreground" />
                            <div className="text-muted-foreground">
                                <p className="font-semibold text-lg">{translate("No Subsidies Found")}</p>
                                <p className="mt-1 text-sm">{translate("The AI could not find any specific subsidies for the selected criteria.")}</p>
                            </div>
                        </div>
                    </div>
                  )}
                </div>
            ) : (
                <div className="flex h-full flex-col justify-center rounded-lg border-2 border-dashed bg-muted/50 p-8 min-h-[400px]">
                    <div className="flex items-center gap-4">
                        <Bot className="h-12 w-12 text-muted-foreground" />
                        <div className="text-muted-foreground">
                            <p className="font-semibold text-lg">{translate("Awaiting Information")}</p>
                            <p className="mt-1 text-sm">{translate("Fill out the form to find relevant subsidy schemes.")}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
