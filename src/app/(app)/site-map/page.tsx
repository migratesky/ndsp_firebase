import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import type { BreadcrumbItem } from '@/types';
import { NAV_LINKS, FOOTER_LINKS } from '@/lib/constants';

const BREADCRUMB_ITEMS: BreadcrumbItem[] = [
  { label: 'Site Map', href: '/site-map' },
];

export default function SiteMapPage() {
  return (
    <div>
      <Breadcrumbs items={BREADCRUMB_ITEMS} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6 text-primary">Site Map</h1>
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold mt-4 mb-2">Main Navigation</h2>
          <ul>
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link href={link.href} className="text-accent hover:underline">{link.label}</Link>
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">Footer Links</h2>
          <h3 className="text-lg font-medium mt-4 mb-1">DoDEA Links</h3>
          <ul>
            {FOOTER_LINKS.dodea.map(link => (
              <li key={link.href}>
                <Link href={link.href} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{link.label}</Link>
              </li>
            ))}
          </ul>
          <h3 className="text-lg font-medium mt-4 mb-1">Legal &amp; Site Info</h3>
          <ul>
            {FOOTER_LINKS.legal.map(link => (
              <li key={link.href}>
                <Link href={link.href} className="text-accent hover:underline">{link.label}</Link>
              </li>
            ))}
             {FOOTER_LINKS.site.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-accent hover:underline">{link.label}</Link>
                </li>
              ))}
          </ul>
          
          {/* Add other sections if the site grows, e.g., specific resource categories */}
          <h2 className="text-xl font-semibold mt-6 mb-2">Other Pages</h2>
          <ul>
            <li><Link href="/login" className="text-accent hover:underline">Login</Link> (Placeholder)</li>
            {/* Add links to specific resource detail pages or other dynamic content areas if applicable */}
          </ul>
        </div>
      </div>
    </div>
  );
}
