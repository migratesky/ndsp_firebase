import Link from 'next/link';
import { FOOTER_LINKS, APP_NAME } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground mt-auto py-8 shadow-inner">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">DoDEA Links</h3>
            <ul className="space-y-1">
              {FOOTER_LINKS.dodea.map(link => (
                <li key={link.href}>
                  <Link href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline opacity-90 hover:opacity-100 transition-opacity">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Legal &amp; Site Info</h3>
            <ul className="space-y-1">
              {FOOTER_LINKS.legal.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:underline opacity-90 hover:opacity-100 transition-opacity">
                    {link.label}
                  </Link>
                </li>
              ))}
               {FOOTER_LINKS.site.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:underline opacity-90 hover:opacity-100 transition-opacity">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            {/* Add additional footer content if needed */}
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 pt-6 text-center text-sm opacity-80">
          <p>&copy; {currentYear} {APP_NAME}. All rights reserved.</p>
          <p>Supporting military and DoD civilian families.</p>
        </div>
      </div>
    </footer>
  );
}
