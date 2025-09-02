

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Home,
  Leaf,
  Menu,
  ScanEye,
  BookOpen,
  Banknote,
  Store,
  Map,
  Sprout,
  Globe,
  MessageSquare,
  CloudSun,
} from "lucide-react";
import { useUserData, supportedLanguages, type SupportedLanguage } from "@/context/UserDataProvider";
import { DashboardDataProvider } from "@/context/DashboardDataProvider";
import NotificationManager from "@/components/dashboard/notification-manager";
import KrishiAssistant from "@/components/dashboard/krishi-assistant";
import { cn } from "@/lib/utils";


function DashboardLayoutContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { farmerName, isLoading, logout, language, setLanguage, translate } = useUserData();
  const router = useRouter();
  const [isAssistantOpen, setIsAssistantOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && !farmerName) {
      router.push("/");
    }
  }, [isLoading, farmerName, router]);

  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };


  if (isLoading || !farmerName) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
    )
  }

  return (
    <DashboardDataProvider>
      <div className="relative min-h-screen w-full bg-background">
        <NotificationManager />
        <DesktopSidebar />

        <div className="flex flex-1 flex-col md:ml-[220px] lg:ml-[280px]">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-card px-4 sm:h-[60px] sm:px-6">
            <MobileSidebar />
            <div className="w-full flex-1">
                {/* Can add breadcrumbs or search here */}
            </div>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                       <Globe className="h-[1.2rem] w-[1.2rem]" />
                       <span className="sr-only">Select language</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Select Language</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={language} onValueChange={(value) => setLanguage(value as SupportedLanguage)}>
                    {supportedLanguages.options.map((lang) => (
                       <DropdownMenuRadioItem key={lang} value={lang}>{lang}</DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                    <Avatar>
                    <AvatarFallback className="bg-primary/20">{getInitials(farmerName || '')}</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuLabel>{farmerName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard/finance/applications')}>{translate("My Loan Applications")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/dashboard/finance/scheme-applications')}>{translate("My Scheme Applications")}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>{translate("Logout")}</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 md:gap-8 md:p-8 mb-20 md:mb-0">
            {children}
          </main>
        </div>

        <div className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-20">
          <Button
            size="icon"
            className="rounded-full w-16 h-16 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg animate-pulse-subtle"
            onClick={() => setIsAssistantOpen(true)}
          >
            <MessageSquare className="w-8 h-8" />
          </Button>
        </div>
        <KrishiAssistant open={isAssistantOpen} onOpenChange={setIsAssistantOpen} />
        <BottomNavBar />
      </div>
    </DashboardDataProvider>
  );
}


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardLayoutContainer>{children}</DashboardLayoutContainer>
    )
}

const NavLink = ({ href, icon: Icon, children, exact = false }: { href: string; icon: React.ElementType; children: React.ReactNode; exact?: boolean }) => {
    const pathname = usePathname();
    const { translate } = useUserData();
    const isActive = exact ? pathname === href : pathname.startsWith(href);
    
    const text = children as string;
    const translatedText = translate(text);

    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
          isActive && "bg-primary/10 text-primary"
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{translatedText}</span>
      </Link>
    )
}

const BottomNavLink = ({ href, icon: Icon, children, exact = false }: { href: string; icon: React.ElementType; children: React.ReactNode; exact?: boolean }) => {
    const pathname = usePathname();
    const { translate } = useUserData();
    const isActive = exact ? pathname === href : pathname.startsWith(href);
    
    const text = children as string;
    const translatedText = translate(text);

    return (
        <Link
            href={href}
            className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs text-foreground/70 transition-colors hover:text-primary h-full",
                isActive ? "text-primary" : ""
            )}
        >
            <Icon className="h-6 w-6" />
            <span className="truncate">{translatedText}</span>
        </Link>
    );
};


const sidebarLinks = [
    { type: 'link', href: "/dashboard", icon: Home, text: "Dashboard", exact: true },
    { type: 'link', href: "/dashboard/knowledge", icon: BookOpen, text: "Crop & Weather Info" },
    { type: 'link', href: "/dashboard/finance", icon: Banknote, text: "Loans & Insurance" },
    { type: 'link', href: "/dashboard/market", icon: Store, text: "Market Prices" },
    { type: 'link', href: "/dashboard/pest-detection", icon: ScanEye, text: "Crop Doctor" },
    { type: 'link', href: "/dashboard/smart-fields", icon: Map, text: "My Fields" },
];

const bottomNavLinks = [
  { href: "/dashboard", icon: Home, text: "Dashboard", exact: true },
  { href: "/dashboard/knowledge", icon: CloudSun, text: "Weather" },
  { href: "/dashboard/finance", icon: Banknote, text: "Finance" },
  { href: "/dashboard/market", icon: Store, text: "Market" },
  { href: "/dashboard/smart-fields", icon: Sprout, text: "Fields" },
];

const DesktopSidebar = () => (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[220px] flex-col border-r bg-card md:flex lg:w-[280px]">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-primary">
                <Leaf className="h-6 w-6" />
                <span>UlavanBuddy</span>
            </Link>
        </div>
        <nav className="flex-1 space-y-1 p-2 text-sm font-medium lg:p-4">
           {sidebarLinks.map((item, index) => {
               if (item.type === 'link') {
                   return <NavLink key={index} href={item.href} icon={item.icon} exact={item.exact}>{item.text}</NavLink>
               }
               return null;
           })}
        </nav>
    </aside>
)


const MobileSidebar = () => {
    const { translate } = useUserData();
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden"
                >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col bg-card w-[280px] p-0">
                 <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-lg font-semibold text-primary"
                         onClick={() => setIsOpen(false)}
                    >
                        <Leaf className="h-6 w-6" />
                        <span>UlavanBuddy</span>
                    </Link>
                </div>
                <nav className="flex-1 space-y-1 p-2">
                    {sidebarLinks.map((item, index) => {
                        if (item.type === 'link') {
                            return (
                                <Link
                                    key={index}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground/80 transition-all hover:text-primary"
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span>{translate(item.text)}</span>
                                </Link>
                            )
                        }
                        return null;
                    })}
                </nav>
            </SheetContent>
        </Sheet>
    )
}

const BottomNavBar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <div className="grid h-16 grid-cols-5 gap-1">
        {bottomNavLinks.map((item) => (
          <BottomNavLink key={item.href} href={item.href} icon={item.icon} exact={item.exact}>
            {item.text}
          </BottomNavLink>
        ))}
      </div>
    </nav>
  );
};
