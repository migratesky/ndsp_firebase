
'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type L from 'leaflet'; // Import Leaflet type for mapRef
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import SchoolCard from '@/components/page-specific/SchoolCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { mockSchools, mockCountries, mockCities } from '@/data/mockData';
import type { School, BreadcrumbItem } from '@/types';
import { Search, ZoomIn, ZoomOut } from 'lucide-react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import the InteractiveMap component
const InteractiveMap = dynamic(() => import('@/components/map/InteractiveMap'), {
  ssr: false, // Leaflet relies on window object, so disable SSR
  loading: () => <Skeleton className="h-[400px] md:h-[500px] w-full rounded-lg" />,
});

const BREADCRUMB_ITEMS: BreadcrumbItem[] = [
  { label: 'Find an International School', href: '/find-school' },
];

const ITEMS_PER_PAGE = 5;

export default function FindSchoolPage() {
  const [country, setCountry] = useState<string>('all');
  const [city, setCity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showBoarding, setShowBoarding] = useState<boolean>(false);
  const [showVirtual, setShowVirtual] = useState<boolean>(false);
  const [filteredSchools, setFilteredSchools] = useState<School[]>(mockSchools);
  const [currentPage, setCurrentPage] = useState(1);
  // mapRef is kept for potential future use, but not passed to InteractiveMap for now.
  const mapRef = useRef<L.Map | null>(null); 

  useEffect(() => {
    let schools = mockSchools;
    if (country && country !== 'all') {
      schools = schools.filter(school => school.country === country || (country === 'Online' && school.isVirtual));
    }
    if (country && country !== 'all' && country !== 'Online' && city && city !== 'all') {
      schools = schools.filter(school => school.city === city);
    }
    if (searchTerm) {
      schools = schools.filter(school =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (school.city && school.city.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (showBoarding) {
      schools = schools.filter(school => school.boardingOption);
    }
    if (showVirtual) {
      // Ensure only virtual schools are shown, regardless of country selection if "Online" is not selected
      schools = schools.filter(school => school.isVirtual);
    } else if (country !== 'Online') {
      // If not showing only virtual, and not explicitly looking for 'Online', filter out virtual schools
      schools = schools.filter(school => !school.isVirtual);
    }
    setFilteredSchools(schools);
    setCurrentPage(1); 
  }, [country, city, searchTerm, showBoarding, showVirtual]);

  const totalPages = Math.ceil(filteredSchools.length / ITEMS_PER_PAGE);
  const paginatedSchools = filteredSchools.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const selectedLocationText = country === 'all'
    ? 'Worldwide'
    : country === 'Online'
      ? 'Online Schools'
      : (city === 'all' || !city ? country : `${city}, ${country}`);

  // Zoom button handlers are temporarily disabled as mapRef is not connected
  const handleZoomIn = () => {
    // mapRef.current?.zoomIn(); 
    console.warn("Zoom In functionality temporarily adjusted. mapRef not connected.");
  };

  const handleZoomOut = () => {
    // mapRef.current?.zoomOut();
    console.warn("Zoom Out functionality temporarily adjusted. mapRef not connected.");
  };


  return (
    <div>
      <Breadcrumbs items={BREADCRUMB_ITEMS} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6 text-primary">
          Find PK-12 Educational Options Worldwide <cite className="text-xs not-italic text-muted-foreground">[cite: 13]</cite>
        </h1>

        <section className="mb-8 p-6 bg-card rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
            <div>
              <Label htmlFor="country" className="text-sm font-medium">Country:</Label>
              <Select value={country} onValueChange={(value) => { setCountry(value); if (value === 'all' || value === 'Online') setCity('all'); }}>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {mockCountries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="city" className="text-sm font-medium">City/Duty Station:</Label>
               <Select value={city} onValueChange={setCity} disabled={country === 'all' || country === 'Online' || !mockCities[country]?.length}>
                <SelectTrigger id="city">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {country && country !== 'all' && country !== 'Online' && mockCities[country]?.map(ci => <SelectItem key={ci} value={ci}>{ci}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="search" className="text-sm font-medium">Search by Name/City:</Label>
              <div className="flex">
                <Input
                  id="search"
                  type="text"
                  placeholder="Enter School or City Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-r-none"
                />
                <Button type="button" className="rounded-l-none" aria-label="Search schools">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
               <cite className="text-xs not-italic text-muted-foreground">[cite: 28]</cite>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox id="boarding" checked={showBoarding} onCheckedChange={(checked) => setShowBoarding(Boolean(checked))} />
              <Label htmlFor="boarding" className="text-sm font-medium">Show only Boarding Schools <cite className="text-xs not-italic text-muted-foreground">[cite: 32]</cite></Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="virtual" checked={showVirtual} onCheckedChange={(checked) => setShowVirtual(Boolean(checked))} />
              <Label htmlFor="virtual" className="text-sm font-medium">Show only Virtual Schools <cite className="text-xs not-italic text-muted-foreground">[cite: 28]</cite></Label>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">School Locations <span className="text-muted-foreground text-lg">({selectedLocationText})</span></h2>
          <div className="relative h-[400px] md:h-[500px] w-full bg-muted rounded-lg shadow-inner overflow-hidden">
            <InteractiveMap schools={filteredSchools} />
            <div className="absolute top-2 right-2 flex flex-col space-y-2 z-[401]"> {/* Increased z-index */}
              <Button size="icon" variant="outline" className="bg-card" aria-label="Zoom In" onClick={handleZoomIn}>
                <ZoomIn className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="outline" className="bg-card" aria-label="Zoom Out" onClick={handleZoomOut}>
                <ZoomOut className="h-5 w-5" />
              </Button>
            </div>
            <div className="absolute bottom-2 left-2 bg-card/80 p-2 rounded text-xs z-[401]"> {/* Increased z-index */}
              Hover/click on a pin to see School Name, City. <cite className="text-xs not-italic text-muted-foreground">[cite: 30]</cite><br/>
              Map shows locations based on search. <cite className="text-xs not-italic text-muted-foreground">[cite: 29]</cite>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-primary">
            Displaying Schools for: <span className="text-accent">{selectedLocationText}</span>
            <span className="text-base font-normal text-muted-foreground ml-2">({filteredSchools.length} results)</span>
          </h2>
          {paginatedSchools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedSchools.map(school => (
                <SchoolCard key={school.id} school={school} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No schools found matching your criteria.</p>
          )}

          {totalPages > 1 && (
             <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} aria-disabled={currentPage === 1} />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }} isActive={currentPage === i + 1}>
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} aria-disabled={currentPage === totalPages}/>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </section>
      </div>
    </div>
  );
}
