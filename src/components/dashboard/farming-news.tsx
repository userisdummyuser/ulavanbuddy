

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Newspaper, Lightbulb, Gift } from "lucide-react";
import { getFarmingNews } from "@/ai/flows/get-farming-news";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";
import { useUserData } from "@/context/UserDataProvider";

const iconMap = {
    newspaper: Newspaper,
    lightbulb: Lightbulb,
    gift: Gift,
};

type Article = {
    title: string;
    summary: string;
    category: "News" | "Best Practice" | "New Scheme";
    icon: "newspaper" | "lightbulb" | "gift";
};

export default function FarmingNews() {
    const [news, setNews] = React.useState<{ articles: Article[] } | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const { toast } = useToast();
    const { translate } = useUserData();

    React.useEffect(() => {
        async function loadNews() {
            setIsLoading(true);
            try {
                const newsData = await getFarmingNews();
                setNews(newsData);
            } catch (error) {
                toast({
                    title: "Failed to load news",
                    description: (error as Error).message,
                    variant: "destructive",
                });
                setNews(null);
            } finally {
                setIsLoading(false);
            }
        }
        loadNews();
    }, [toast]);
    
    if (isLoading) {
        return <FarmingNewsSkeleton />;
    }
    
    const newsArticles = news?.articles.filter(a => a.category === "News") || [];
    const bestPractices = news?.articles.filter(a => a.category === "Best Practice") || [];
    const newSchemes = news?.articles.filter(a => a.category === "New Scheme") || [];


    return (
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><Newspaper className="text-primary"/>{translate("Farming News & Best Practices")}</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="news">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="news">
                            <Newspaper className="mr-2 h-4 w-4" /> {translate("Latest News")}
                        </TabsTrigger>
                         <TabsTrigger value="schemes">
                            <Gift className="mr-2 h-4 w-4" /> {translate("New Schemes")}
                        </TabsTrigger>
                        <TabsTrigger value="practices">
                            <Lightbulb className="mr-2 h-4 w-4" /> {translate("Best Practices")}
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="news" className="mt-4 space-y-4">
                        {newsArticles.length > 0 ? (
                          newsArticles.map((article, index) => <ArticleCard key={index} article={article} />)
                        ) : (
                           <p className="text-muted-foreground text-center py-4">{translate("No news available.")}</p>
                        )}
                    </TabsContent>
                    <TabsContent value="schemes" className="mt-4 space-y-4">
                        {newSchemes.length > 0 ? (
                          newSchemes.map((article, index) => <ArticleCard key={index} article={article} />)
                        ) : (
                           <p className="text-muted-foreground text-center py-4">{translate("No new schemes available.")}</p>
                        )}
                    </TabsContent>
                    <TabsContent value="practices" className="mt-4 space-y-4">
                         {bestPractices.length > 0 ? (
                           bestPractices.map((article, index) => <ArticleCard key={index} article={article} />)
                         ) : (
                           <p className="text-muted-foreground text-center py-4">{translate("No best practices available.")}</p>
                         )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

const ArticleCard = ({ article }: { article: Article }) => {
    const Icon = iconMap[article.icon as keyof typeof iconMap] || Newspaper;
    const { translate } = useUserData();

    return (
        <div className="flex items-start gap-4 rounded-lg border p-4 bg-muted/30 hover:bg-muted/60 transition-colors">
            <div className="p-2 bg-primary/10 rounded-full">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
                <h3 className="font-semibold">{translate(article.title)}</h3>
                <p className="text-sm text-muted-foreground">{translate(article.summary)}</p>
            </div>
        </div>
    )
}


const FarmingNewsSkeleton = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><Newspaper className="text-primary"/>Farming News & Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center p-1">
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="mt-4 space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            </CardContent>
        </Card>
    )
}
