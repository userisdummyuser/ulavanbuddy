
"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserData } from "@/context/UserDataProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Upload, File as FileIcon, Landmark, IndianRupee, Percent, User, MapPin, Wheat, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ApplicationSchema = z.object({
  idCard: z.any().refine(file => file instanceof File, "ID Card copy is required."),
  landRecords: z.any().refine(file => file instanceof File, "Land records copy is required."),
});

type ApplicationFormValues = z.infer<typeof ApplicationSchema>;

export default function ApplyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getApplication, updateLoanApplicationStatus, translate } = useUserData();
  const { toast } = useToast();
  
  const appId = searchParams.get('appId');
  const application = React.useMemo(() => {
    return getApplication(appId || '');
  }, [appId, getApplication]);

  const { control, handleSubmit, formState: { errors } } = useForm<ApplicationFormValues>({
    resolver: zodResolver(ApplicationSchema),
  });

  if (!application) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-2xl font-bold">{translate("Application Not Found")}</h1>
            <p className="text-muted-foreground">{translate("The requested loan application could not be found.")}</p>
            <Button onClick={() => router.push('/dashboard/finance/credit')} className="mt-4">{translate("Go Back")}</Button>
        </div>
    );
  }

  const onSubmit = (data: ApplicationFormValues) => {
    console.log("Simulating document submission:", data);
    // In a real app, you'd upload these files. Here we just move to the next step.
    updateLoanApplicationStatus(application.id, 'Pending');
    toast({
      title: translate("Application Submitted"),
      description: translate("Your loan application has been submitted for review."),
    });
    router.push(`/dashboard/finance/status/${application.id}`);
  };

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center gap-4">
        <FileText className="w-10 h-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{translate("Loan Application")}</h1>
          <p className="text-muted-foreground">{translate("Complete the final steps to submit your application to")} {application.bankName}.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{translate("Application Summary")}</CardTitle>
            <CardDescription>{translate("Please review your details and upload the required documents.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoItem icon={Landmark} label={translate("Applying to")} value={application.bankName} />
              <InfoItem icon={User} label={translate("Applicant Name")} value={application.name} />
              <InfoItem icon={MapPin} label={translate("State")} value={application.state} />
              <InfoItem icon={Wheat} label={translate("Primary Crop")} value={application.cropType} />
              <InfoItem icon={IndianRupee} label={translate("Approved Amount")} value={`₹${application.approvedAmount.toLocaleString('en-IN')}`} />
              <InfoItem icon={Percent} label={translate("Interest Rate")} value={`${application.interestRate}% p.a.`} />
            </div>

            <Separator />
            
            <div>
              <h3 className="text-lg font-medium">{translate("Document Upload")}</h3>
              <p className="text-sm text-muted-foreground">
                {translate("Please upload clear copies of the following documents. This is a simulation.")}
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  name="idCard"
                  control={control}
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FileUpload
                      label={translate("Copy of Aadhaar Card / Voter ID")}
                      onFileChange={(file) => onChange(file)}
                      error={errors.idCard?.message as string}
                      translate={translate}
                    />
                  )}
                />
                 <Controller
                  name="landRecords"
                  control={control}
                  render={({ field: { onChange, value, ...rest } }) => (
                     <FileUpload
                        label={translate("Copy of Land Ownership Records (e.g., Patta)")}
                        onFileChange={(file) => onChange(file)}
                        error={errors.landRecords?.message as string}
                        translate={translate}
                    />
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" size="lg" className="w-full md:w-auto">
                {translate("Submit Application")}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
    <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-semibold">{value}</p>
        </div>
    </div>
);


const FileUpload = ({ label, onFileChange, error, translate }: { label: string, onFileChange: (file: File | null) => void, error?: string, translate: (text: string) => string }) => {
    const [file, setFile] = React.useState<File | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
        onFileChange(selectedFile);
    };

    return (
        <div>
            <Label className={error ? 'text-destructive' : ''}>{label}</Label>
            <div
                className={`mt-2 flex justify-center rounded-lg border-2 ${error ? 'border-destructive' : 'border-dashed border-input'} px-6 py-10 cursor-pointer bg-muted/30 hover:bg-muted/60`}
                onClick={() => fileInputRef.current?.click()}
            >
                <div className="text-center">
                    {file ? (
                        <>
                            <FileIcon className="mx-auto h-10 w-10 text-primary" />
                            <p className="mt-2 text-sm font-medium text-foreground">{file.name}</p>
                             <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                        </>
                    ) : (
                        <>
                            <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">{translate("Click to upload a file")}</p>
                        </>
                    )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            </div>
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </div>
    );
};
