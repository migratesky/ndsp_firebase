import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import QuickLinkCard from '@/components/page-specific/QuickLinkCard';
import { Globe, Map, FileText, Info, CalendarDays } from 'lucide-react';
import { mockAnnouncements } from '@/data/mockData';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full">
        <Image
          src="https://placehold.co/1600x500.png"
          alt="Welcome to NDSP Community Profiles"
          layout="fill"
          objectFit="cover"
          priority
          data-ai-hint="global education diverse students"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 shadow-text">
            Welcome to the Non-DoD Schools Program (NDSP) Community Profiles!
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-3xl shadow-text">
            Supporting military and DoD civilian families with PK-12 educational options
            overseas where no DoDEA schools are operated. <cite className="text-xs not-italic">[cite: 4]</cite>
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Quick Links Section */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-primary">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickLinkCard
              icon={Globe}
              title="Find an International School"
              linkText="Search World Map"
              linkHref="/find-school"
            />
            <QuickLinkCard
              icon={Map}
              title="US State Graduation Requirements"
              linkText="Search US Map"
              linkHref="/us-grad-requirements"
            />
            <QuickLinkCard
              icon={FileText}
              title="Program Resources & Fact Sheets"
              linkText="View Resources"
              linkHref="/resources"
            />
            <QuickLinkCard
              icon={Info}
              title="NDSP Orientation & Policies"
              linkText="View Orientation"
              linkHref="/resources#orientation" // Assuming orientation is a part of resources
            />
          </div>
        </section>

        {/* Latest Updates / Announcements Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-primary">Latest Updates & Announcements</h2>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <ul className="space-y-4">
                {mockAnnouncements.map((announcement) => (
                  <li key={announcement.id} className="pb-4 border-b last:border-b-0 border-border">
                    <div className="flex items-start space-x-3">
                      <CalendarDays className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">{new Date(announcement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="text-foreground">
                          {announcement.content}
                          {announcement.cite && <cite className="text-xs not-italic ml-1">[cite: {announcement.cite}]</cite>}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
