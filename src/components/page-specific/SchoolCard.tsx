import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { School } from '@/types';
import { MapPin, BookOpen, ExternalLink, CheckCircle, XCircle } from 'lucide-react';

interface SchoolCardProps {
  school: School;
}

export default function SchoolCard({ school }: SchoolCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl text-primary">{school.name} <cite className="text-xs not-italic text-muted-foreground">[cite: 27]</cite></CardTitle>
        <CardDescription className="flex items-center text-sm">
          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
          {school.city}, {school.country}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center">
          <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
          Grades: {school.gradesServed} <cite className="text-xs not-italic text-muted-foreground ml-1">[cite: 27, 31]</cite>
        </div>
        <div className="flex items-center">
          {school.instructionInEnglish ? <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> : <XCircle className="h-4 w-4 mr-2 text-red-500" />}
          English Instruction: {school.instructionInEnglish ? 'Yes' : 'No'} <cite className="text-xs not-italic text-muted-foreground ml-1">[cite: 27, 31]</cite>
        </div>
        <div className="flex items-center">
          {school.boardingOption ? <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> : <XCircle className="h-4 w-4 mr-2 text-red-500" />}
          Boarding: {school.boardingOption ? 'Yes' : 'No'} <cite className="text-xs not-italic text-muted-foreground ml-1">[cite: 27, 31]</cite>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="mr-2">
          <Link href={`/find-school/${school.id}`}>
            View Details <cite className="text-xs not-italic text-muted-foreground ml-1">[cite: 27]</cite>
          </Link>
        </Button>
        <Button asChild variant="link" className="text-accent hover:text-accent/80">
          <a href={school.website} target="_blank" rel="noopener noreferrer">
            Visit Website <ExternalLink className="h-4 w-4 ml-2" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
