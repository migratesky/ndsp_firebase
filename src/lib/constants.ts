export type NavLink = {
  href: string;
  label: string;
};

export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/find-school', label: 'Find a School (World)' },
  { href: '/us-grad-requirements', label: 'US Grad Requirements' },
  { href: '/resources', label: 'Resources' },
  { href: '/contact', label: 'Contact Us' },
];

export const FOOTER_LINKS = {
  dodea: [
    { label: 'DoDEA Home', href: 'https://www.dodea.edu' },
    { label: 'About DoDEA', href: 'https://www.dodea.edu/aboutDoDEA/' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Accessibility/508 Statement', href: '/accessibility' },
  ],
  site: [
     { label: 'Site Map', href: '/site-map' },
  ]
};

export const APP_NAME = "NDSP Navigator";
export const APP_SUBTITLE = "DoDEA NDSP Community Profiles";
