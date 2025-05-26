import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { setupErrorHandling } from '@/utils/errorLogger';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'NDSP Navigator',
  description: 'DoDEA NDSP Community Profiles',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize client-side error handling
  if (typeof window !== 'undefined') {
    setupErrorHandling();
  }

  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
