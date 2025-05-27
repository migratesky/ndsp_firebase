import type { Metadata } from 'next';
import AdminNav from '../../components/AdminNav';

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
    <div className="admin-layout">
      <AdminNav />
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}
