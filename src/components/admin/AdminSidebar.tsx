
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, School, Users, FileEdit, LogOut } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/schools', label: 'School DB Mgt', icon: School },
  { href: '/admin/user-management', label: 'User Mgt', icon: Users },
  { href: '/admin/content-management', label: 'Content Mgt', icon: FileEdit },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-primary text-primary-foreground p-4 space-y-2 hidden md:flex flex-col">
      <h2 className="text-xl font-semibold mb-6 px-2">{APP_NAME} Admin</h2>
      <nav className="flex-grow space-y-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/admin/dashboard' && pathname.startsWith(link.href));
          return (
            <Button
              key={link.href}
              variant="ghost"
              className={cn(
                "w-full justify-start text-primary-foreground hover:bg-primary/80",
                isActive && "bg-accent text-accent-foreground hover:bg-accent/90"
              )}
              asChild
            >
              <Link href={link.href}>
                <link.icon className="mr-2 h-4 w-4" /> {link.label}
              </Link>
            </Button>
          );
        })}
      </nav>
      <div className="mt-auto">
        <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-primary/80" asChild>
          <Link href="/">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Link>
        </Button>
      </div>
    </aside>
  );
}
