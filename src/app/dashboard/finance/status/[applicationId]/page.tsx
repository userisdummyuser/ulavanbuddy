
"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserData } from "@/context/UserDataProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Landmark, IndianRupee, Percent, User, MapPin, Wheat, FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const statusConfig = {
    Pending: { icon: Clock, color: "bg-yellow-500", text: "text-yellow-500" },
    Approved: { icon: CheckCircle, color: "bg-green-500", text: "text-green-600" },
    Rejected: { icon: XCircle, color: "bg-red-500", text: "text-red-600" },
};

export default function StatusPage() {
  const router = useRouter();
  const params = useParams();
  const { getApplication, translate } = useUserData();
  
  const appId = params.applicationId as string;
  const application = React.useMemo(() => {
    return getApplication(appId);
  }, [appId, getApplication]);

  if (!application) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-2xl font-bold">{translate("Application Not Found")}</h1>
            <p className="text-muted-foreground">{translate("The requested loan application could not be found.")}</p>
            <Button onClick={() => router.push('/dashboard/finance/credit')} className="mt-4">{translate("Go Back")}</Button>
        </div>
    );
  }
  
  const StatusIcon = statusConfig[application.status].icon;
  const statusColor = statusConfig[application.status].color;
  const statusTextColor = statusConfig[application.status].text;

  const statusMessages = {
      Pending: {
          title: translate("Your application is under review."),
          description: translate("The bank will contact you within 5-7 business days.")
      },
      Approved: {
          title: translate("Congratulations! Your loan is approved."),
          description: translate("The approved amount will be disbursed shortly.")
      },
      Rejected: {
          title: translate("Your application has been rejected."),
          description: translate("The bank was unable to approve your application at this time.")
      }
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center gap-4">
        <FileText className="w-10 h-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{translate("Loan Application Status")}</h1>
          <p className="text-muted-foreground">{translate("Application ID")}: {application.id}</p>
        </div>
      </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                    <CardTitle>{translate("Application to")} {application.bankName}</CardTitle>
                    <CardDescription>{translate("Submitted on")} {new Date(application.submittedAt).toLocaleDateString()}</CardDescription>
                </div>
                <Badge className={cn("text-lg self-start sm:self-center", statusColor)}>
                    <StatusIcon className="w-5 h-5 mr-2" />
                    {translate(application.status)}
                </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-6 rounded-lg flex flex-col sm:flex-row items-center gap-6">
                <StatusIcon className={cn("w-16 h-16", statusTextColor)} />
                <div className="text-center sm:text-left">
                    <p className={cn("text-2xl font-bold", statusTextColor)}>
                       {statusMessages[application.status].title}
                    </p>
                    <p className="text-muted-foreground mt-1">
                       {statusMessages[application.status].description}
                    </p>
                </div>
            </div>
            
            <Separator />

            <div>
                <h3 className="text-lg font-medium mb-4">{translate("Submitted Details")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoItem icon={Landmark} label={translate("Bank")} value={application.bankName} />
                    <InfoItem icon={User} label={translate("Applicant Name")} value={application.name} />
                    <InfoItem icon={MapPin} label={translate("State")} value={application.state} />
                    <InfoItem icon={Wheat} label={translate("Primary Crop")} value={application.cropType} />
                    <InfoItem icon={IndianRupee} label={translate("Approved Amount")} value={`₹${application.approvedAmount.toLocaleString('en-IN')}`} />
                    <InfoItem icon={Percent} label={translate("Interest Rate")} value={`${application.interestRate}% p.a.`} />
                </div>
            </div>
          </CardContent>
          <CardFooter>
             <Button asChild>
                <Link href="/dashboard/finance/applications">
                   {translate("View All Applications")}
                </Link>
            </Button>
          </CardFooter>
        </Card>
    </div>
  );
}

const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
    <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-md">
        <Icon className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-semibold">{value}</p>
        </div>
    </div>
);
