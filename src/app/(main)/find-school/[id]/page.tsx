'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSchoolById } from '@/data/mockData';
import type { School, BreadcrumbItem } from '@/types';
import { ArrowLeft, AlertTriangle, MapPin, Globe as WebIcon, Phone, BookOpen, Building, Users, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SchoolDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [school, setSchool] = useState<School | null | undefined>(undefined); // undefined for loading, null for not found
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    if (params.id) {
      const schoolId = Array.isArray(params.id) ? params.id[0] : params.id;
      const foundSchool = getSchoolById(schoolId);
      setSchool(foundSchool);

      if (foundSchool) {
        setBreadcrumbItems([
          { label: 'Find an International School', href: '/find-school' },
          { label: foundSchool.country, href: `/find-school?country=${encodeURIComponent(foundSchool.country)}` },
          { label: foundSchool.city, href: `/find-school?country=${encodeURIComponent(foundSchool.country)}&city=${encodeURIComponent(foundSchool.city)}` },
          { label: foundSchool.name, href: `/find-school/${foundSchool.id}` },
        ]);
      } else {
         setBreadcrumbItems([{ label: 'Find an International School', href: '/find-school' }]);
      }
    }
  }, [params.id]);

  if (school === undefined) { // Loading state
    return (
      <div>
        <Breadcrumbs items={[{ label: 'Find an International School', href: '/find-school' }]} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-3/4 mb-6" />
          <Card className="shadow-lg">
            <CardHeader>
              <Skeleton className="h-8 w-1/2 mb-2" />
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
              <Skeleton className="h-40 w-full mt-6" />
              <div className="mt-8 flex space-x-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-40" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (school === null) { // Not found state
    return (
      <div>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4 text-destructive">School Not Found</h1>
          <p className="text-lg text-muted-foreground mb-8">The school you are looking for could not be found.</p>
          <Button onClick={() => router.push('/find-school')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-primary">{school.name} <cite className="text-xs not-italic text-muted-foreground">[cite: 27]</cite></h1>

        <Card className="shadow-lg overflow-hidden">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-2xl text-primary">School Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-4">
              <InfoItem icon={MapPin} label="Address" value={`${school.address}, ${school.city}, ${school.country}`} cite="42" />
              {school.website && <InfoItem icon={WebIcon} label="Website" value={<a href={school.website} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center">{school.website} <ExternalLink className="h-4 w-4 ml-1" /></a>} cite="27" />}
              {school.phone && <InfoItem icon={Phone} label="Phone" value={school.phone} />}
              <InfoItem icon={BookOpen} label="Grades Served" value={school.gradesServed} cite="31" />
              <InfoItem icon={school.instructionInEnglish ? CheckCircle : XCircle} label="Instruction in English" value={school.instructionInEnglish ? 'Yes' : 'No'} cite="27" className={school.instructionInEnglish ? 'text-green-600' : 'text-red-600'} />
              <InfoItem icon={Building} label="Public/Private" value={school.publicPrivate} cite="27" />
              <InfoItem icon={school.boardingOption ? CheckCircle : XCircle} label="Boarding Option" value={school.boardingOption ? `Yes ${school.boardingDetails ? `(${school.boardingDetails})` : ''}` : 'No'} cite="27, 31" className={school.boardingOption ? 'text-green-600' : 'text-red-600'} />
              <InfoItem icon={Users} label="Accreditation" value={school.accreditation} cite="27" />
            </div>
            
            <div className="space-y-4">
               <h2 className="text-xl font-semibold text-primary border-b pb-2 mb-3">Additional Details <cite className="text-xs not-italic text-muted-foreground">[cite: 31]</cite></h2>
              {school.genderSpecificPolicies && <InfoItem label="Gender-Specific Policies" value={school.genderSpecificPolicies} />}
              {school.religiousAffiliation && <InfoItem label="Religious Affiliation/Restrictions" value={school.religiousAffiliation} />}
              {school.typicalClassSizes && <InfoItem label="Typical Class Sizes" value={school.typicalClassSizes} />}
              {school.estimatedEnrollmentCount && <InfoItem label="Estimated Enrollment Count" value={school.estimatedEnrollmentCount} />}
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-primary mb-2">Location</h3>
                <div className="relative h-64 w-full bg-muted rounded-md shadow-inner overflow-hidden">
                  <Image
                    src={`https://placehold.co/600x400.png`}
                    alt={`Map showing location of ${school.name}`}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="map school location"
                  />
                   <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <MapPin className="h-12 w-12 text-white/80" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search Results
          </Button>
          <Button variant="destructive" onClick={() => alert('Report issue form/link would be here.')}>
            <AlertTriangle className="mr-2 h-4 w-4" /> Report an issue <cite className="text-xs not-italic text-destructive-foreground/80 ml-1">[cite: 25]</cite>
          </Button>
        </div>
      </div>
    </div>
  );
}

interface InfoItemProps {
  icon?: React.ElementType;
  label: string;
  value: React.ReactNode;
  cite?: string;
  className?: string;
}

function InfoItem({ icon: Icon, label, value, cite, className }: InfoItemProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-start", className)}>
      <dt className="w-full sm:w-1/3 font-semibold text-muted-foreground flex items-center">
        {Icon && <Icon className="h-5 w-5 mr-2 flex-shrink-0" />}
        {label}:
      </dt>
      <dd className="w-full sm:w-2/3 text-foreground mt-1 sm:mt-0">
        {value}
        {cite && <cite className="text-xs not-italic text-muted-foreground ml-1">[cite: {cite}]</cite>}
      </dd>
    </div>
  );
}
