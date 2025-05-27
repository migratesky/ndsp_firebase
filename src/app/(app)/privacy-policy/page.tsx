import Breadcrumbs from '@/components/layout/Breadcrumbs';
import type { BreadcrumbItem } from '@/types';

const BREADCRUMB_ITEMS: BreadcrumbItem[] = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
];

export default function PrivacyPolicyPage() {
  return (
    <div>
      <Breadcrumbs items={BREADCRUMB_ITEMS} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6 text-primary">Privacy Policy</h1>
        <div className="prose max-w-none">
          <p>This is a placeholder for the Privacy Policy content.</p>
          <p>Information regarding the collection, use, and protection of personal data will be detailed here in accordance with applicable laws and DoDEA regulations.</p>
          <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
          <p>Details about what information is collected (e.g., usage data, contact information submitted through forms).</p>
          <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Information</h2>
          <p>Explanation of how the collected information is used (e.g., to improve the website, respond to inquiries).</p>
          <h2 className="text-xl font-semibold mt-6 mb-2">Data Security</h2>
          <p>Measures taken to protect user data.</p>
          <h2 className="text-xl font-semibold mt-6 mb-2">Third-Party Links</h2>
          <p>Disclaimer about links to external sites.</p>
          <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
          <p>How to contact for privacy-related questions.</p>
        </div>
      </div>
    </div>
  );
}
