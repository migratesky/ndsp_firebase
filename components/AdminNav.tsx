import Link from 'next/link';

export default function AdminNav() {
  return (
    <nav className="admin-nav">
      <Link href="/admin/dashboard">Dashboard</Link>
      <Link href="/admin/users">Users</Link>
      <Link href="/admin/content">Content</Link>
      <Link href="/admin/schools">Schools</Link>
    </nav>
  );
}
