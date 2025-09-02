
"use client";

import * as React from "react";
import { useUserData, type SchemeApplication } from "@/context/UserDataProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, CheckCircle, Clock, XCircle, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig: Record<SchemeApplication['status'], { icon: React.ElementType, className: string }> = {
    'In Progress': { icon: Clock, className: "bg-yellow-500 hover:bg-yellow-500/90" },
    Approved: { icon: CheckCircle, className: "bg-green-500 hover:bg-green-500/90" },
    Rejected: { icon: XCircle, className: "bg-red-600 hover:bg-red-600/90" },
};


export default function SchemeApplicationsPage() {
    const { schemeApplications, updateSchemeApplicationStatus, translate } = useUserData();

    // Simulate status changes for demo purposes
    React.useEffect(() => {
        if (typeof window === 'undefined') return;

        const interval = setInterval(() => {
            const pendingApps = schemeApplications.filter(app => app.status === 'In Progress');
            if (pendingApps.length > 0) {
                const appToUpdate = pendingApps[Math.floor(Math.random() * pendingApps.length)];
                // Only update if it hasn't been updated recently to avoid flicker
                 if (Date.now() - new Date(appToUpdate.submittedAt).getTime() > 5000) {
                    const newStatus = Math.random() > 0.4 ? 'Approved' : 'Rejected';
                    updateSchemeApplicationStatus(appToUpdate.id, newStatus as SchemeApplication['status']);
                 }
            }
        }, 10000); // Check every 10 seconds

        return () => clearInterval(interval);
    }, [schemeApplications, updateSchemeApplicationStatus]);

    return (
    <div className="flex flex-1 flex-col gap-6">
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <Gift className="w-10 h-10 text-primary" />
                <div>
                <h1 className="text-3xl font-bold">{translate("My Scheme Applications")}</h1>
                <p className="text-muted-foreground">{translate("Track the status of your submitted scheme applications.")}</p>
                </div>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>{translate("Application History")}</CardTitle>
                <CardDescription>{translate("Here is a list of all your scheme applications.")}</CardDescription>
            </CardHeader>
            <CardContent>
                {schemeApplications.length > 0 ? (
                    <div className="w-full overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{translate("Application ID")}</TableHead>
                                    <TableHead>{translate("Scheme Name")}</TableHead>
                                    <TableHead>{translate("Submitted On")}</TableHead>
                                    <TableHead>{translate("Status")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {schemeApplications.map((app) => {
                                    const StatusIcon = statusConfig[app.status].icon;
                                    const statusClassName = statusConfig[app.status].className;
                                    return (
                                    <TableRow key={app.id}>
                                        <TableCell className="font-medium break-words">{app.id}</TableCell>
                                        <TableCell>{app.schemeName}</TableCell>
                                        <TableCell>{new Date(app.submittedAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge className={cn("text-white", statusClassName)}>
                                                <StatusIcon className="w-4 h-4 mr-1" />
                                                {translate(app.status)}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                )})}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg bg-muted/50">
                        <p className="text-muted-foreground">{translate("You have not applied for any schemes yet.")}</p>
                        <p className="text-sm text-muted-foreground">{translate("Find subsidies or insurance to get started.")}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
