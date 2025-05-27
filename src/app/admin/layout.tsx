'use client';

import { Metadata } from 'next';
import { Suspense } from 'react';
import RootLayout from '../layout';

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
          <Suspense fallback={<div className="p-4">Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </RootLayout>
  );
}
