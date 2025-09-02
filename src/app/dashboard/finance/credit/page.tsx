
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HandCoins, Bot, CheckCircle, XCircle, ArrowRight, Landmark, User, MapPin, Wheat, IndianRupee, Percent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserData } from "@/context/UserDataProvider";
import { cropTypes } from "../../smart-fields/page";
import { getCreditAssessment } from "@/ai/flows/credit-advisor";
import type { CreditAdvisorOutput } from "@/ai/flows/credit-advisor";
import { useRouter } from "next/navigation";


const CreditAdvisorInputSchema = z.object({
  name: z.string().min(1, "Full name is required."),
  state: z.string().min(1, "State is required."),
  cropType: z.string().min(1, "Please select a crop type."),
  loanAmount: z.number().min(1000, "Loan amount must be at least 1,000."),
  landSize: z.number().min(0.1, "Land size must be greater than zero."),
});

type CreditAdvisorFormValues = z.infer<typeof CreditAdvisorInputSchema>;

export default function CreditPage() {
  const { farmerName, saveLoanApplication, translate } = useUserData();
  const router = useRouter();
  const { toast } = useToast();
  const [assessment, setAssessment] = React.useState<CreditAdvisorOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<CreditAdvisorFormValues>({
    resolver: zodResolver(CreditAdvisorInputSchema),
    defaultValues: {
      name: farmerName || "",
      state: "",
      cropType: "",
      loanAmount: 100000,
      landSize: 5,
    },
  });

  React.useEffect(() => {
    if (farmerName) {
      form.reset({ ...form.getValues(), name: farmerName });
    }
  }, [farmerName, form]);

  async function onSubmit(data: CreditAdvisorFormValues) {
    setIsLoading(true);
    setAssessment(null);
    try {
        const result = await getCreditAssessment(data);
        setAssessment(result);
        toast({
            title: translate("Assessment Complete"),
            description: translate("Your credit assessment is ready."),
        });
    } catch (error) {
        toast({
            title: translate("Assessment Failed"),
            description: (error as Error).message,
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  }

  const handleApplyNow = (bankName: string) => {
    const applicationData = {
        ...form.getValues(),
        bankName,
        approvedAmount: assessment?.approvedAmount || 0,
        interestRate: assessment?.interestRate || 0,
    };
    const appId = saveLoanApplication(applicationData);
    router.push(`/dashboard/finance/apply?appId=${appId}`);
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/20 rounded-full">
            <HandCoins className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{translate("Digital Credit Access")}</h1>
          <p className="text-muted-foreground text-sm sm:text-base">{translate("Get an instant AI-powered assessment for your credit needs.")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>{translate("Credit Application Form")}</CardTitle>
            <CardDescription>{translate("Fill in your details to receive a simulated credit assessment from our AI advisor.")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><User />{translate("Full Name")}</FormLabel>
                      <FormControl>
                        <Input placeholder={translate("Enter your full name")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><MapPin />{translate("State")}</FormLabel>
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
                        <FormLabel className="flex items-center gap-2"><Wheat />{translate("Primary Crop Type")}</FormLabel>
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
                                            <span>{crop.label}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                  control={form.control}
                  name="loanAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><IndianRupee />{translate("Loan Amount Requested (INR)")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={e => field.onChange(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="landSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><MapPin />{translate("Total Land Size (in acres)")}</FormLabel>
                      <FormControl>
                         <Input
                          type="number"
                          {...field}
                          onChange={e => field.onChange(e.target.value === '' ? '' : parseFloat(e.target.value))}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />}
                    {isLoading ? translate('Assessing...') : translate('Get AI Credit Assessment')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div>
            {isLoading ? (
                 <div className="flex h-full items-center justify-center rounded-lg bg-muted/50 min-h-[500px]">
                    <div className="text-center">
                    <Bot className="mx-auto h-12 w-12 animate-pulse text-primary" />
                    <p className="mt-4 font-semibold">{translate("AI is reviewing your application...")}</p>
                    <p className="text-sm text-muted-foreground">{translate("This may take a moment.")}</p>
                    </div>
                </div>
            ) : assessment ? (
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>{translate("AI Credit Assessment Result")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert variant={assessment.isEligible ? "default" : "destructive"}>
                            {assessment.isEligible ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            <AlertTitle>{assessment.isEligible ? translate("Congratulations! You are eligible.") : translate("Assessment: Not Eligible")}</AlertTitle>
                        </Alert>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <InfoBox label={translate("Approved Amount")} value={`₹${assessment.approvedAmount.toLocaleString('en-IN')}`} icon={IndianRupee} />
                            <InfoBox label={translate("Interest Rate")} value={`${assessment.interestRate}% p.a.`} icon={Percent} />
                        </div>
                        
                        <div>
                            <h4 className="font-semibold">{translate("Reasoning")}</h4>
                            <p className="text-sm text-muted-foreground">{assessment.reasoning}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold">{translate("Next Steps")}</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{assessment.nextSteps}</p>
                        </div>
                        {assessment.isEligible && assessment.partnerBanks && assessment.partnerBanks.length > 0 && (
                            <div>
                                <h4 className="font-semibold">{translate("Recommended Partner Banks")}</h4>
                                <div className="mt-2 space-y-3">
                                    {assessment.partnerBanks.map((bank) => (
                                        <div key={bank.name} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-md bg-muted/50 gap-3">
                                           <div className="flex items-center gap-3">
                                                <Landmark className="w-5 h-5 text-primary"/>
                                                <div>
                                                    <p className="font-semibold">{bank.name}</p>
                                                    <p className="text-xs text-muted-foreground">{bank.contactInfo}</p>
                                                </div>
                                            </div>
                                            <Button size="sm" onClick={() => handleApplyNow(bank.name)} className="w-full sm:w-auto">
                                                {translate("Apply Now")} <ArrowRight className="ml-2 h-4 w-4"/>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 text-center min-h-[500px] p-4">
                    <div className="text-muted-foreground">
                        <Bot className="mx-auto h-12 w-12" />
                        <p className="mt-4 font-semibold">{translate("Awaiting Application")}</p>
                        <p className="mt-1 text-sm">{translate("Fill out the form to see your AI-powered credit assessment.")}</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}


const InfoBox = ({label, value, icon: Icon}: {label: string, value: string, icon: React.ElementType}) => (
    <div className="p-3 bg-muted/50 rounded-md flex items-start gap-3">
        <Icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-semibold text-lg text-primary">{value}</p>
        </div>
    </div>
)
