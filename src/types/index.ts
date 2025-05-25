export interface School {
  id: string;
  name: string;
  country: string;
  city: string;
  address: string;
  website: string;
  phone?: string;
  gradesServed: string; // e.g., "PK - 12"
  instructionInEnglish: boolean;
  publicPrivate: 'Public' | 'Private';
  boardingOption: boolean;
  boardingDetails?: string;
  accreditation: string;
  genderSpecificPolicies?: string;
  religiousAffiliation?: string;
  typicalClassSizes?: string; // e.g., "15-20"
  estimatedEnrollmentCount?: string; // e.g., "300-400"
  lat?: number; // For map coordinates
  lng?: number; // For map coordinates
  isVirtual?: boolean;
}

export interface StateGraduationRequirement {
  id: string;
  name: string; // State Name
  officialRequirementsUrl: string;
  transcriptInfoGuidelines?: string; // Link or summary
  gradingScalesOverview?: string; // Link or summary
  courseDescriptionsLink?: string; // Link or summary
}

export interface Resource {
  id: string;
  title: string;
  type: 'Fact Sheet' | 'Overview' | 'Digital Booklet' | 'Guide' | 'Flipbook' | 'Infographic' | 'Brochure' | 'Support Material' | 'Transition Info' | 'Country Info';
  description?: string;
  link: string; // URL to view/download
  category: 'Fact Sheets & Overviews' | 'School Listings & Guidance' | 'Supplemental Information & Support Materials';
}

export interface Announcement {
  id: string;
  date: string; // e.g., "YYYY-MM-DD"
  content: string;
  cite?: string;
}

export interface ContactRegion {
  id: string;
  regionName: string;
  services: {
    education: string; // Contact details
    invoices: string;
    management: string;
    administration: string;
  };
}

export type BreadcrumbItem = {
  label: string;
  href: string;
};
