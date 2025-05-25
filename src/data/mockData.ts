import type { School, StateGraduationRequirement, Resource, Announcement, ContactRegion } from '@/types';

export const mockSchools: School[] = [
  {
    id: '1',
    name: 'Example International School',
    country: 'Germany',
    city: 'Frankfurt',
    address: '123 Main St, Frankfurt, Germany',
    website: 'https://school.example.com',
    phone: '+49 69 1234567',
    gradesServed: 'PK-12',
    instructionInEnglish: true,
    publicPrivate: 'Private',
    boardingOption: true,
    boardingDetails: 'Full boarding facilities available for grades 9-12.',
    accreditation: 'Council of International Schools (CIS)',
    typicalClassSizes: '15-20 students',
    estimatedEnrollmentCount: '500 students',
    lat: 50.1109,
    lng: 8.6821,
  },
  {
    id: '2',
    name: 'Global Learning Academy',
    country: 'Japan',
    city: 'Tokyo',
    address: '456 Sakura Ave, Tokyo, Japan',
    website: 'https://gla.example.jp',
    gradesServed: 'K-12',
    instructionInEnglish: true,
    publicPrivate: 'Private',
    boardingOption: false,
    accreditation: 'Western Association of Schools and Colleges (WASC)',
    typicalClassSizes: '20-25 students',
    estimatedEnrollmentCount: '800 students',
    lat: 35.6895,
    lng: 139.6917,
  },
  {
    id: '3',
    name: 'Sunshine Virtual School',
    country: 'Online',
    city: 'Global',
    address: 'N/A - Virtual School',
    website: 'https://sunshinevirtual.example.com',
    gradesServed: '6-12',
    instructionInEnglish: true,
    publicPrivate: 'Private',
    boardingOption: false,
    accreditation: 'Cognia',
    isVirtual: true,
  }
];

export const mockCountries: string[] = ['Germany', 'Japan', 'Italy', 'South Korea', 'United Kingdom', 'Online'];
export const mockCities: { [country: string]: string[] } = {
  'Germany': ['Frankfurt', 'Berlin', 'Munich'],
  'Japan': ['Tokyo', 'Osaka', 'Kyoto'],
  'Online': ['Global']
};


export const mockStateRequirements: StateGraduationRequirement[] = [
  {
    id: 'alabama',
    name: 'Alabama',
    officialRequirementsUrl: 'https://www.alabamaachieves.org/graduation-requirements/',
    transcriptInfoGuidelines: 'Refer to official state website for transcript guidelines.',
    gradingScalesOverview: 'Typically A=90-100, B=80-89, C=70-79, D=60-69, F<60.',
  },
  {
    id: 'alaska',
    name: 'Alaska',
    officialRequirementsUrl: 'https://education.alaska.gov/student-assessment/graduation-requirements',
    transcriptInfoGuidelines: 'Consult Alaska DEED for specifics.',
  },
  {
    id: 'california',
    name: 'California',
    officialRequirementsUrl: 'https://www.cde.ca.gov/ci/gs/hs/hsgrtable.asp',
    gradingScalesOverview: 'Varies by district, typically 4.0 scale.',
  },
];

export const mockResources: Resource[] = [
  {
    id: '1',
    title: 'NDSP Program-Wide Worldwide Data Fact Sheet',
    type: 'Fact Sheet',
    link: '/resources/factsheet-worldwide.pdf',
    category: 'Fact Sheets & Overviews',
    description: 'Comprehensive data about the NDSP program worldwide.',
  },
  {
    id: '2',
    title: 'International School Listings Digital Booklet',
    type: 'Digital Booklet',
    link: '/resources/booklet-international-schools.pdf',
    category: 'School Listings & Guidance',
    description: 'A digital booklet of international school listings.'
  },
  {
    id: '3',
    title: 'NDSP Orientation Flipbook',
    type: 'Flipbook',
    link: '/resources/orientation-flipbook',
    category: 'School Listings & Guidance',
    description: 'User-friendly digital orientation flipbook outlining NDSP policies and procedures.'
  },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    date: '2024-07-15',
    content: 'New schools added for Germany/Frankfurt',
    cite: '4',
  },
  {
    id: '2',
    date: '2024-07-10',
    content: 'Updated NDSP Program Overview available',
    cite: '14',
  },
  {
    id: '3',
    date: '2024-07-05',
    content: 'Reminder: Technical assistance available via the Contact Us page.',
    cite: '25',
  },
];

export const mockContactRegions: ContactRegion[] = [
  {
    id: 'pacific',
    regionName: 'Pacific Region',
    services: {
      education: 'pacific.edu@ndsp.example.com / +1-123-456-7890',
      invoices: 'pacific.inv@ndsp.example.com / +1-123-456-7891',
      management: 'pacific.mgmt@ndsp.example.com / +1-123-456-7892',
      administration: 'pacific.admin@ndsp.example.com / +1-123-456-7893',
    },
  },
  {
    id: 'europe',
    regionName: 'Europe Region',
    services: {
      education: 'europe.edu@ndsp.example.com / +1-234-567-8901',
      invoices: 'europe.inv@ndsp.example.com / +1-234-567-8902',
      management: 'europe.mgmt@ndsp.example.com / +1-234-567-8903',
      administration: 'europe.admin@ndsp.example.com / +1-234-567-8904',
    },
  },
];

export const getSchoolById = (id: string): School | undefined => mockSchools.find(school => school.id === id);
export const getStateByName = (name: string): StateGraduationRequirement | undefined => mockStateRequirements.find(state => state.name.toLowerCase() === name.toLowerCase());
