'use client';

import { Metadata } from 'next';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import RootLayout from '../layout';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Administration panel',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RootLayout>
      <div className="min-h-screen bg-white">
        <main className="container mx-auto px-4 py-8">
          <ErrorBoundary fallback={<div className="p-4">An error occurred...</div>}>
            <Suspense fallback={<div className="p-4">Loading...</div>}>
              <Toaster />
              {children}
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </RootLayout>
  );
}
