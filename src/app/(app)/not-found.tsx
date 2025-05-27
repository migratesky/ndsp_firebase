import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center flex flex-col items-center">
      <AlertTriangle className="w-24 h-24 text-destructive mb-8" />
      <h1 className="text-5xl font-bold text-primary mb-4">404 - Page Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Button asChild size="lg">
        <Link href="/">Go back to Homepage</Link>
      </Button>
    </div>
  );
}
