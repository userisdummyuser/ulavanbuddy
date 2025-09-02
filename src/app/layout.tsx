
import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { PT_Sans } from 'next/font/google'
import { UserDataProvider } from '@/context/UserDataProvider';

const ptSans = PT_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pt-sans',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'UlavanBuddy',
  description: 'AI-Powered Agricultural Intelligence',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>&#127807;</text></svg>',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ptSans.variable}`}>
      <body className="font-sans antialiased">
        <UserDataProvider>
          {children}
        </UserDataProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
