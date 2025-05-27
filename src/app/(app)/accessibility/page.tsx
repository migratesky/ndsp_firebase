import Breadcrumbs from '@/components/layout/Breadcrumbs';
import type { BreadcrumbItem } from '@/types';

const BREADCRUMB_ITEMS: BreadcrumbItem[] = [
  { label: 'Accessibility Statement', href: '/accessibility' },
];

export default function AccessibilityPage() {
  return (
    <div>
      <Breadcrumbs items={BREADCRUMB_ITEMS} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6 text-primary">Accessibility Statement (Section 508)</h1>
        <div className="prose max-w-none">
          <p>NDSP Navigator is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">Conformance Status</h2>
          <p>The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. We aim to conform with WCAG 2.1 level AA. This statement will be updated as conformance efforts progress.</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Measures to Support Accessibility</h2>
          <p>NDSP Navigator takes the following measures to ensure accessibility:</p>
          <ul>
            <li>Include accessibility as part of our design and development processes.</li>
            <li>Employ semantic HTML and ARIA attributes where appropriate.</li>
            <li>Ensure keyboard navigability.</li>
            <li>Provide sufficient color contrast.</li>
            <li>Offer text alternatives for non-text content.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">Feedback</h2>
          <p>We welcome your feedback on the accessibility of NDSP Navigator. Please let us know if you encounter accessibility barriers:</p>
          <ul>
            <li><strong>E-mail:</strong> accessibility@ndsp.example.com (placeholder)</li>
            <li><strong>Phone:</strong> +1-XXX-XXX-XXXX (placeholder)</li>
            <li><strong>Contact Form:</strong> <a href="/contact">Link to Contact Page</a></li>
          </ul>
          <p>We try to respond to feedback within 5 business days.</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Technical Specifications</h2>
          <p>Accessibility of NDSP Navigator relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:</p>
          <ul>
            <li>HTML</li>
            <li>WAI-ARIA</li>
            <li>CSS</li>
            <li>JavaScript</li>
          </ul>
          <p>These technologies are relied upon for conformance with the accessibility standards used.</p>
        </div>
      </div>
    </div>
  );
}
