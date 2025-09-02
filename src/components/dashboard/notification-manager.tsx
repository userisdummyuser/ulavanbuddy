

"use client";

import * as React from "react";
import { useUserData } from "@/context/UserDataProvider";
import { getWateringRecommendation } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Leaf } from "lucide-react";

export default function NotificationManager() {
    const { fields, notificationsEnabled } = useUserData();
    const { toast } = useToast();

    React.useEffect(() => {
        if (!notificationsEnabled || !("Notification" in window)) {
            return;
        }

        const checkAndNotify = async () => {
            if (Notification.permission !== "granted") {
                return;
            }

            const today = new Date().toDateString();
            const lastCheck = localStorage.getItem("lastNotificationCheck");

            if (lastCheck === today) {
                return; // Already checked today
            }

            console.log("Checking watering recommendations for notifications...");

            for (const field of fields) {
                try {
                    const result = await getWateringRecommendation({
                        cropType: field.cropType,
                        plantingDate: new Date(field.plantingDate).toISOString(),
                        latitude: field.latitude,
                        longitude: field.longitude,
                    });

                    if (result) {
                        const recommendation = result.recommendation.toLowerCase();
                        // Simple check to see if watering is advised
                        if (recommendation.includes("water") || recommendation.includes("irrigate")) {
                             new Notification("UlavanBuddy Watering Alert", {
                                body: `For field "${field.name}": ${result.recommendation}`,
                                icon: "/favicon.ico", // Note: A real favicon would need to be in the public folder
                                tag: `watering-alert-${field.id}`
                            });
                        }
                    }
                } catch (error) {
                    console.error(`Failed to get recommendation for ${field.name}`, error);
                }
            }

            localStorage.setItem("lastNotificationCheck", today);
        };

        checkAndNotify();

    }, [fields, notificationsEnabled]);

    React.useEffect(() => {
        if (notificationsEnabled && "Notification" in window) {
            if (Notification.permission === "default") {
                toast({
                    title: "Enable Notifications?",
                    description: "Allow notifications to receive daily watering alerts.",
                    action: <button className="px-3 py-1 rounded-md bg-primary text-primary-foreground" onClick={() => Notification.requestPermission()}>Allow</button>,
                })
            } else if (Notification.permission === "denied") {
                toast({
                    title: "Notifications Blocked!",
                    description: "Please enable notifications in your browser settings to receive alerts.",
                    variant: "destructive",
                });
            }
        }
    }, [notificationsEnabled, toast]);


    return null; // This component does not render anything
}
