
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import type { BreadcrumbItem, ContactRegion } from '@/types';
import { mockContactRegions } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Users, Building, FileText } from 'lucide-react';

const BREADCRUMB_ITEMS: BreadcrumbItem[] = [
  { label: 'Contact Us', href: '/contact' },
];

export default function ContactPage() {
  return (
    <div>
      <Breadcrumbs items={BREADCRUMB_ITEMS} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2 text-primary">NDSP Contact Information <cite className="text-xs not-italic text-muted-foreground">[cite: 38]</cite></h1>
        <p className="text-muted-foreground mb-8">Based on the information provided by DoDEA NDSP.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mockContactRegions.map((region) => (
            <Card key={region.id} className="shadow-lg">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-xl text-primary">{region.regionName} <cite className="text-xs not-italic text-muted-foreground">[cite: 39]</cite></CardTitle>
                <CardDescription>Contact details for services in the {region.regionName}.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <ContactDetailItem icon={Users} label="Education" value={region.services.education} />
                <ContactDetailItem icon={FileText} label="Invoices" value={region.services.invoices} />
                <ContactDetailItem icon={Building} label="Management" value={region.services.management} />
                <ContactDetailItem icon={Users} label="Administration" value={region.services.administration} />
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground text-center">
          Minor text edits may occur throughout the year for revisions. <cite className="text-xs not-italic">[cite: 40]</cite>
        </p>
      </div>
    </div>
  );
}

interface ContactDetailItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function ContactDetailItem({ icon: Icon, label, value }: ContactDetailItemProps) {
  const parts = value.split('/');
  const email = parts.find(part => part.includes('@'));
  const phone = parts.find(part => !part.includes('@'));

  return (
    <div>
      <h4 className="text-md font-semibold text-foreground flex items-center mb-1">
        <Icon className="h-5 w-5 mr-2 text-accent" />
        {label}
      </h4>
      <div className="pl-7 text-sm text-muted-foreground space-y-1">
        {email && (
          <a href={`mailto:${email.trim()}`} className="flex items-center hover:text-accent transition-colors">
            <Mail className="h-4 w-4 mr-2" /> {email.trim()}
          </a>
        )}
        {phone && (
          <a href={`tel:${phone.trim().replace(/\s|-/g, '')}`} className="flex items-center hover:text-accent transition-colors">
            <Phone className="h-4 w-4 mr-2" /> {phone.trim()}
          </a>
        )}
      </div>
    </div>
  );
}
