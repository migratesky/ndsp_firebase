
export interface School {
  _id?: string; // MongoDB ObjectId, optional on client before creation
  id?: string; // Original ID if migrating, or could be same as _id string
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
  createdAt?: string | Date; // Added by MongoDB
  updatedAt?: string | Date; // Added by MongoDB
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

export const UserRoles = ['School DB Editor', 'Content Approver', 'Admin', 'Reviewer', 'Viewer'] as const;
export type UserRole = typeof UserRoles[number];

export const UserAccountStatuses = ['Active', 'Disabled', 'Pwd Reset Req'] as const;
export type UserAccountStatus = typeof UserAccountStatuses[number];

// Basic User type for Admin - Manual User Management
export interface UserAccount {
  _id?: string;
  username: string; // Login ID, e.g., email format
  email: string;
  fullName?: string;
  roles: UserRole[];
  status: UserAccountStatus;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  lastLogin?: string | Date; // Optional, if tracked
}
