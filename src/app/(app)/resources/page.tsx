import Breadcrumbs from '@/components/layout/Breadcrumbs';
import type { BreadcrumbItem, Resource as ResourceType } from '@/types';
import { mockResources } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ExternalLink, FileText, Book, Users, Info } from 'lucide-react';

const BREADCRUMB_ITEMS: BreadcrumbItem[] = [
  { label: 'Resources', href: '/resources' },
];

const getIconForResourceType = (type: ResourceType['type']) => {
  switch (type) {
    case 'Fact Sheet':
    case 'Overview':
      return FileText;
    case 'Digital Booklet':
    case 'Guide':
    case 'Flipbook':
      return Book;
    case 'Infographic':
    case 'Brochure':
    case 'Support Material':
    case 'Transition Info':
    case 'Country Info':
      return Info;
    default:
      return FileText;
  }
};

export default function ResourcesPage() {
  const resourcesByCategory: { [category: string]: ResourceType[] } = mockResources.reduce((acc, resource) => {
    const category = resource.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(resource);
    return acc;
  }, {} as { [category: string]: ResourceType[] });

  return (
    <div>
      <Breadcrumbs items={BREADCRUMB_ITEMS} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 text-primary">Program Resources</h1>

        {Object.entries(resourcesByCategory).map(([category, resources]) => (
          <section key={category} id={category.toLowerCase().replace(/\s+/g, '-')} className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-primary border-b pb-2">
              {category === 'Fact Sheets & Overviews' && <FileText className="inline-block h-6 w-6 mr-2 text-accent" />}
              {category === 'School Listings & Guidance' && <Book className="inline-block h-6 w-6 mr-2 text-accent" />}
              {category === 'Supplemental Information & Support Materials' && <Info className="inline-block h-6 w-6 mr-2 text-accent" />}
              {category}
              {category === 'Fact Sheets & Overviews' && <cite className="text-xs not-italic text-muted-foreground ml-2">[cite: 35]</cite>}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map(resource => {
                const Icon = getIconForResourceType(resource.type);
                return (
                  <Card key={resource.id} className="shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
                    <CardHeader>
                      <div className="flex items-center space-x-3 mb-2">
                        <Icon className="h-8 w-8 text-accent flex-shrink-0" />
                        <CardTitle className="text-lg text-primary">{resource.title}</CardTitle>
                      </div>
                      <CardDescription className="text-sm h-12 overflow-hidden text-ellipsis">
                        {resource.description || `Access the ${resource.type.toLowerCase()} for ${resource.title}.`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                       {/* Placeholder for any additional content if needed */}
                    </CardContent>
                    <CardContent className="pt-0"> {/* Use CardContent for Button for consistent padding */}
                      <Button asChild variant="outline" className="w-full">
                        <Link href={resource.link} target={resource.link.startsWith('http') ? '_blank' : '_self'} rel={resource.link.startsWith('http') ? 'noopener noreferrer' : ''}>
                          {resource.link.startsWith('http') || resource.link.endsWith('.pdf') ? 'View/Download' : 'Access Resource'}
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            {category === 'School Listings & Guidance' && (
                 <p className="text-xs text-muted-foreground mt-2">
                    Digital Booklet: <cite>[cite: 41]</cite>, Orientation Flipbook: <cite>[cite: 45]</cite>, Desk Guides: <cite>[cite: 48]</cite>
                </p>
            )}
             {category === 'Supplemental Information & Support Materials' && (
                 <p className="text-xs text-muted-foreground mt-2">
                    Supplemental Info: <cite>[cite: 59]</cite>
                </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
