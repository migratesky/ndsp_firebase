
// This file is effectively replaced by /src/app/admin/schools/page.tsx
// Keeping a placeholder or redirecting might be an option,
// but for now, we'll assume /admin/schools is the primary list view.
// To avoid confusion, this file can be removed or left empty.
// For this operation, I will make it a simple redirect or placeholder.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function SchoolManagementRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/schools');
  }, [router]);

  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar />
      <main className="flex-1 p-6 text-center">
        <p>Redirecting to School List...</p>
      </main>
    </div>
  );
}
