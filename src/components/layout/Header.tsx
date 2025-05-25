import Link from 'next/link';
import { APP_NAME, APP_SUBTITLE } from '@/lib/constants';
import { UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg sm:text-xl lg:text-2xl font-bold hover:opacity-90 transition-opacity">
          {APP_SUBTITLE}
        </Link>
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Placeholder for User Login/Links */}
          <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80 px-2 sm:px-3">
            <UserCircle className="h-5 w-5 sm:h-6 sm:w-6 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">Login</span>
          </Button>
          {/* Add other links if necessary */}
        </div>
      </div>
    </header>
  );
}
