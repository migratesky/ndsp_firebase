'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = (
    <>
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "px-3 py-2 rounded-md text-sm font-medium transition-colors",
            pathname === link.href
              ? "bg-accent text-accent-foreground"
              : "hover:bg-accent/50 hover:text-accent-foreground/80"
          )}
        >
          {link.label}
        </Link>
      ))}
    </>
  );

  return (
    <nav className="bg-card text-card-foreground shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden md:flex h-14 items-center justify-center space-x-1 lg:space-x-4">
          {navItems}
        </div>
        <div className="md:hidden flex items-center justify-end h-14">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] bg-card p-4">
              <div className="flex flex-col space-y-2 mt-6">
                {navItems}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
