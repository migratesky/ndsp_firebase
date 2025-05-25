'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import StateGraduationInfo from '@/components/page-specific/StateGraduationInfo';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockStateRequirements, getStateByName } from '@/data/mockData';
import type { StateGraduationRequirement, BreadcrumbItem } from '@/types';
import { MapPin, Info } from 'lucide-react';

const BREADCRUMB_ITEMS: BreadcrumbItem[] = [
  { label: 'US Graduation Requirements', href: '/us-grad-requirements' },
];

export default function USGradRequirementsPage() {
  const [selectedStateName, setSelectedStateName] = useState<string>('');
  const [selectedStateInfo, setSelectedStateInfo] = useState<StateGraduationRequirement | null>(null);

  useEffect(() => {
    if (selectedStateName) {
      const stateData = getStateByName(selectedStateName);
      setSelectedStateInfo(stateData || null);
    } else {
      setSelectedStateInfo(null);
    }
  }, [selectedStateName]);

  const handleSelectAnotherState = () => {
    setSelectedStateName('');
    setSelectedStateInfo(null);
  };
  
  // Handler for simulated map click
  const handleMapStateClick = (stateName: string) => {
    setSelectedStateName(stateName);
  };


  return (
    <div>
      <Breadcrumbs items={BREADCRUMB_ITEMS} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6 text-primary">
          United States Graduation Requirements <cite className="text-xs not-italic text-muted-foreground">[cite: 33]</cite>
        </h1>

        {/* Selection Method Section */}
        <section className="mb-8 p-6 bg-card rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-primary">Select a State</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <Label htmlFor="state-select" className="text-sm font-medium">Method 1: Select from dropdown</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Select value={selectedStateName} onValueChange={setSelectedStateName}>
                  <SelectTrigger id="state-select" className="flex-grow">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStateRequirements.map(state => (
                      <SelectItem key={state.id} value={state.name}>{state.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => { /* View requirements is handled by useEffect */ }} disabled={!selectedStateName}>View</Button>
              </div>
               <cite className="text-xs not-italic text-muted-foreground">[cite: 33]</cite>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Method 2: Click on a State in the map below <cite className="text-xs not-italic text-muted-foreground">[cite: 33]</cite></p>
              <p className="text-xs text-muted-foreground">(Map interaction is simulated. Use dropdown for functionality.)</p>
            </div>
          </div>
        </section>

        {/* Map Display Area */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Interactive US Map</h2>
          <div className="relative h-[400px] md:h-[500px] w-full bg-muted rounded-lg shadow-inner overflow-hidden">
            <Image
              src="https://placehold.co/1200x500.png"
              alt="Interactive US Map Placeholder"
              layout="fill"
              objectFit="cover"
              data-ai-hint="US map states"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 p-4">
                <p className="text-center text-white text-lg bg-black/50 p-2 rounded">Click on a state (simulated) or use dropdown.</p>
            </div>
             {/* Example of how clickable states might be simulated - for demo only */}
            <button onClick={() => handleMapStateClick('California')} className="absolute top-1/2 left-1/4 p-2 bg-accent/70 text-white rounded text-xs hover:bg-accent">CA (Sim)</button>
            <button onClick={() => handleMapStateClick('Texas')} className="absolute top-2/3 left-1/2 p-2 bg-accent/70 text-white rounded text-xs hover:bg-accent">TX (Sim)</button>

            <div className="absolute bottom-2 left-2 bg-card/80 p-2 rounded text-xs">
              Hovering over a state shows State Name.
            </div>
          </div>
        </section>

        {/* State Requirements Display Area */}
        <section className="min-h-[300px] flex items-center justify-center">
          {selectedStateInfo ? (
            <StateGraduationInfo state={selectedStateInfo} onSelectAnother={handleSelectAnotherState} />
          ) : (
            <div className="text-center p-8 border-2 border-dashed border-border rounded-lg">
              <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                Please select a state using the dropdown menu or by clicking on the map
                to view its high school graduation requirements.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
