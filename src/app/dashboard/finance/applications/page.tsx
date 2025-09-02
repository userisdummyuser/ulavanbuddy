
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useUserData, type LoanApplication } from "@/context/UserDataProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, PlusCircle, CheckCircle, Clock, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const statusConfig: Record<LoanApplication['status'], { icon: React.ElementType, className: string }> = {
    Pending: { icon: Clock, className: "bg-yellow-500 hover:bg-yellow-500/90" },
    Approved: { icon: CheckCircle, className: "bg-green-500 hover:bg-green-500/90" },
    Rejected: { icon: XCircle, className: "bg-red-600 hover:bg-red-600/90" },
};


export default function ApplicationsPage() {
    const router = useRouter();
    const { loanApplications, updateLoanApplicationStatus, translate } = useUserData();

    // Simulate status changes for demo purposes
    React.useEffect(() => {
        if (typeof window === 'undefined') return;

        const interval = setInterval(() => {
            const pendingApps = loanApplications.filter(app => app.status === 'Pending');
            if (pendingApps.length > 0) {
                const appToUpdate = pendingApps[Math.floor(Math.random() * pendingApps.length)];
                // Only update if it hasn't been updated recently to avoid flicker
                 if (Date.now() - new Date(appToUpdate.submittedAt).getTime() > 5000) {
                    const newStatus = Math.random() > 0.4 ? 'Approved' : 'Rejected';
                    updateLoanApplicationStatus(appToUpdate.id, newStatus as LoanApplication['status']);
                 }
            }
        }, 8000); // Check every 8 seconds

        return () => clearInterval(interval);
    }, [loanApplications, updateLoanApplicationStatus]);

    return (
    <div className="flex flex-1 flex-col gap-6">
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <FileText className="w-10 h-10 text-primary" />
                <div>
                <h1 className="text-3xl font-bold">{translate("My Loan Applications")}</h1>
                <p className="text-muted-foreground">{translate("Track the status of your submitted loan applications.")}</p>
                </div>
            </div>
            <Button asChild className="w-full sm:w-auto">
                <Link href="/dashboard/finance/credit">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {translate("New Loan Application")}
                </Link>
            </Button>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>{translate("Application History")}</CardTitle>
                <CardDescription>{translate("Here is a list of all your loan applications.")}</CardDescription>
            </CardHeader>
            <CardContent>
                {loanApplications.length > 0 ? (
                    <div className="w-full overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{translate("Application ID")}</TableHead>
                                    <TableHead>{translate("Bank")}</TableHead>
                                    <TableHead>{translate("Amount")}</TableHead>
                                    <TableHead>{translate("Submitted On")}</TableHead>
                                    <TableHead>{translate("Status")}</TableHead>
                                    <TableHead className="text-right">{translate("Actions")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loanApplications.map((app) => {
                                    const StatusIcon = statusConfig[app.status].icon;
                                    const statusClassName = statusConfig[app.status].className;
                                    return (
                                    <TableRow key={app.id}>
                                        <TableCell className="font-medium break-words">{app.id}</TableCell>
                                        <TableCell>{app.bankName}</TableCell>
                                        <TableCell>₹{app.approvedAmount.toLocaleString('en-IN')}</TableCell>
                                        <TableCell>{new Date(app.submittedAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge className={cn("text-white", statusClassName)}>
                                                <StatusIcon className="w-4 h-4 mr-1" />
                                                {translate(app.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" asChild>
                                                 <Link href={`/dashboard/finance/status/${app.id}`}>
                                                    {translate("View Details")} <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )})}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg bg-muted/50">
                        <p className="text-muted-foreground">{translate("You have not submitted any loan applications yet.")}</p>
                        <p className="text-sm text-muted-foreground">{translate("Start by getting a credit assessment.")}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
