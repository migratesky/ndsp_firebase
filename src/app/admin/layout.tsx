
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* <AdminSidebar /> */} {/* Sidebar is now included in each page or a more specific layout */}
      {children}
    </div>
  )
}
