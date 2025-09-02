
"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf } from "lucide-react";
import { useUserData } from "@/context/UserDataProvider";

export default function LoginPage() {
  const { login, isLoading, farmerName } = useUserData();
  const [name, setName] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    // If user is already logged in (e.g. from localStorage), redirect to dashboard
    if (farmerName && !isLoading) {
      router.push('/dashboard');
    }
  }, [farmerName, isLoading, router]);

  const handleContinue = async () => {
    if (name.trim()) {
      await login(name.trim());
    }
  };

  if (isLoading || farmerName) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
    )
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4 overflow-hidden">
      <div className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 text-lg font-bold text-primary-foreground bg-primary/80 px-4 py-2 rounded-lg animate-slide-in-up">
        <Leaf className="h-6 w-6" />
        <span className="font-sans">UlavanBuddy</span>
      </div>
      <Card className="z-10 w-full max-w-md shadow-2xl bg-card animate-slide-in-up" style={{animationDelay: '200ms'}}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl font-sans text-primary">Welcome, Farmer</CardTitle>
          <CardDescription>Enter your name to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-base">What should we call you?</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Ramesh Kumar"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleContinue()}
                className="h-12 text-lg"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full h-12 text-lg font-bold bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleContinue} disabled={!name.trim() || isLoading}>
            {isLoading ? "Logging in..." : "Continue"}
          </Button>
        </CardFooter>
      </Card>
      <footer className="absolute bottom-4 text-center text-sm text-foreground/70 font-semibold animate-fade-in" style={{animationDelay: '400ms'}}>
        &copy; {new Date().getFullYear()} UlavanBuddy. Smart farming for a better future.
      </footer>
    </main>
  );
}
