
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
  },
  {
    id: '4',
    name: 'Roma International School',
    country: 'Italy',
    city: 'Rome',
    address: '789 Via Veneto, Rome, Italy',
    website: 'https://romaschool.example.it',
    phone: '+39 06 9876543',
    gradesServed: 'PK-12',
    instructionInEnglish: true,
    publicPrivate: 'Private',
    boardingOption: true,
    boardingDetails: 'Weekly boarding options for high school students.',
    accreditation: 'New England Association of Schools and Colleges (NEASC)',
    typicalClassSizes: '18-22 students',
    estimatedEnrollmentCount: '650 students',
    lat: 41.9028,
    lng: 12.4964,
  },
  {
    id: '5',
    name: 'Seoul Global Academy',
    country: 'South Korea',
    city: 'Seoul',
    address: '101 Gangnam Blvd, Seoul, South Korea',
    website: 'https://seoulacademy.example.kr',
    gradesServed: 'K-12',
    instructionInEnglish: true,
    publicPrivate: 'Private',
    boardingOption: false,
    accreditation: 'Western Association of Schools and Colleges (WASC)',
    typicalClassSizes: '20-25 students',
    estimatedEnrollmentCount: '900 students',
    lat: 37.5665,
    lng: 126.9780,
  },
  {
    id: '6',
    name: 'UK Online High',
    country: 'Online',
    city: 'Global',
    address: 'N/A - Virtual School',
    website: 'https://ukonlinehigh.example.co.uk',
    gradesServed: '9-12',
    instructionInEnglish: true,
    publicPrivate: 'Private',
    boardingOption: false,
    accreditation: 'Cambridge International',
    isVirtual: true,
  },
];

export const mockCountries: string[] = ['Germany', 'Japan', 'Italy', 'South Korea', 'United Kingdom', 'Spain', 'Online'];
export const mockCities: { [country: string]: string[] } = {
  'Germany': ['Frankfurt', 'Berlin', 'Munich'],
  'Japan': ['Tokyo', 'Osaka', 'Kyoto'],
  'Italy': ['Rome', 'Milan', 'Florence'],
  'South Korea': ['Seoul', 'Busan', 'Incheon'],
  'United Kingdom': ['London', 'Manchester', 'Edinburgh'],
  'Spain': ['Madrid', 'Barcelona'],
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
  {
    id: 'texas',
    name: 'Texas',
    officialRequirementsUrl: 'https://tea.texas.gov/academics/graduation-information/state-graduation-requirements',
    transcriptInfoGuidelines: 'See TEA website for details.',
    gradingScalesOverview: 'Local districts set grading policies; common 100-point scale.',
  },
  {
    id: 'newyork',
    name: 'New York',
    officialRequirementsUrl: 'http://www.nysed.gov/curriculum-instruction/general-education-and-diploma-requirements',
    courseDescriptionsLink: 'http://www.nysed.gov/curriculum-instruction/learning-standards',
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
    link: '/resources/orientation-flipbook', // This might be a path to a specific page or component
    category: 'School Listings & Guidance',
    description: 'User-friendly digital orientation flipbook outlining NDSP policies and procedures.'
  },
  {
    id: '4',
    title: 'Guide to Choosing an International School',
    type: 'Guide',
    link: '/resources/guide-choosing-school.pdf',
    category: 'School Listings & Guidance',
    description: 'A helpful guide for families on selecting the right international school.'
  },
  {
    id: '5',
    title: 'Country Info: Japan',
    type: 'Country Info',
    link: '/resources/country-info-japan.pdf',
    category: 'Supplemental Information & Support Materials',
    description: 'Specific information and resources for families relocating to Japan.'
  },
   {
    id: '6',
    title: 'Transition Support Materials',
    type: 'Support Material',
    link: '/resources/transition-support.pdf',
    category: 'Supplemental Information & Support Materials',
    description: 'Materials to help students and families during educational transitions.'
  }
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
    content: 'Updated NDSP Program Overview available in Resources.',
    cite: '14',
  },
  {
    id: '3',
    date: '2024-07-05',
    content: 'Reminder: Technical assistance available via the Contact Us page.',
    cite: '25',
  },
  {
    id: '4',
    date: '2024-07-20',
    content: 'Welcome to the new NDSP Navigator portal! We are excited to share this resource with you.',
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
  {
    id: 'americas',
    regionName: 'Americas Region',
    services: {
      education: 'americas.edu@ndsp.example.com / +1-345-678-9012',
      invoices: 'americas.inv@ndsp.example.com / +1-345-678-9013',
      management: 'americas.mgmt@ndsp.example.com / +1-345-678-9014',
      administration: 'americas.admin@ndsp.example.com / +1-345-678-9015',
    },
  },
];

export const getSchoolById = (id: string): School | undefined => mockSchools.find(school => school.id === id);
export const getStateByName = (name: string): StateGraduationRequirement | undefined => mockStateRequirements.find(state => state.name.toLowerCase() === name.toLowerCase());

    