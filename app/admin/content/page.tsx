import { ContentTable } from '@/components/admin/content/ContentTable';
import { AdminLayout } from '@/components/admin/layout';

export default function ContentPage() {
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Content Management</h1>
        <ContentTable />
      </div>
    </AdminLayout>
  );
}
