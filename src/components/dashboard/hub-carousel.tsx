
"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BookOpen, Banknote, Store, ArrowRight } from "lucide-react";
import { useUserData } from "@/context/UserDataProvider";
import Link from 'next/link';
import { Button } from "../ui/button";

const hubItems = [
    {
        title: "Crop & Weather Info",
        description: "Weather, crop advice, and irrigation management.",
        href: "/dashboard/knowledge",
        icon: BookOpen,
        color: "text-green-600",
        bgColor: "bg-green-100",
    },
    {
        title: "Loans & Insurance",
        description: "Apply for loans, find insurance, and check subsidies.",
        href: "/dashboard/finance",
        icon: Banknote,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
    },
    {
        title: "Market Prices",
        description: "Check mandi prices and connect with buyers.",
        href: "/dashboard/market",
        icon: Store,
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
    },
];

export default function HubCarousel() {
    const { translate } = useUserData();
    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
    );

    return (
        <Carousel
        plugins={[plugin.current]}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {hubItems.map((item, index) => {
            const Icon = item.icon;
            return (
                 <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="block group h-full">
                        <Card className="h-full hover:shadow-xl transition-shadow duration-300 flex flex-col">
                             <CardHeader>
                                <div className={`p-4 rounded-lg ${item.bgColor} self-start`}>
                                    <Icon className={`w-8 h-8 ${item.color}`} />
                                 </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <CardTitle className="text-xl group-hover:text-primary transition-colors">{translate(item.title)}</CardTitle>
                                <p className="text-muted-foreground mt-1 text-sm">{translate(item.description)}</p>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" asChild className="w-full">
                                    <Link href={item.href}>
                                        {translate("Go to Hub")} <ArrowRight className="ml-2"/>
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                 </CarouselItem>
            )
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    );
}
