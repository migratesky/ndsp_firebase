'use client';

import { Toaster } from '@/components/ui/toaster';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r bg-gray-100">
        {/* Sidebar content */}
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-8">
        <Toaster />
        {children}
      </div>
    </div>
  );
}
