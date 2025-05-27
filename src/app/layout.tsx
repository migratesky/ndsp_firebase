import type { Metadata } from 'next';
// import { Inter } from 'next/font/google'; // Removed Inter font
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { setupErrorHandling } from '@/utils/errorLogger';

// const inter = Inter({
//   subsets: ['latin'],
//   variable: '--font-inter',
// }); // Removed Inter font

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
    // <html lang="en" className={inter.variable}> // Removed inter.variable
    <html lang="en">
      <body className="font-sans"> {/* Ensures a fallback to system sans-serif fonts */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
