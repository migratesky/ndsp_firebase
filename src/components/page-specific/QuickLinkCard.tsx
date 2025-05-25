import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';

interface QuickLinkCardProps {
  icon: LucideIcon;
  title: string;
  linkText: string;
  linkHref: string;
}

export default function QuickLinkCard({ icon: Icon, title, linkText, linkHref }: QuickLinkCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <Icon className="h-10 w-10 text-accent" />
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button asChild variant="link" className="p-0 text-accent hover:text-accent/80">
          <Link href={linkHref}>{linkText}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
