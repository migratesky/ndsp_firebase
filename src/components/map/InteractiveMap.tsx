'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { School } from '@/types';
import ErrorBoundary from '@/components/ErrorBoundary';

const MapComponent = dynamic(
  () => import('./MapComponent'),
  { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>
  }
);

interface InteractiveMapProps {
  schools: School[];
  'data-testid'?: string;
}

export default function InteractiveMap({ schools, 'data-testid': testId }: InteractiveMapProps) {
  const [hasError, setHasError] = useState(false);
  const [errorDetails, setErrorDetails] = useState('');

  const onMapInit = (map: any) => {
    console.log('[InteractiveMap] Map initialized successfully');
    console.log('[InteractiveMap] Map container dimensions:', map.getSize());
  };

  if (hasError) {
    return (
      <div data-testid="map-error">
        <h3>Map Error</h3>
        <p>{errorDetails}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full" data-testid={testId || "interactive-map"}>
      <ErrorBoundary 
        onError={(error) => {
          console.error('[InteractiveMap] Error rendering MapComponent:', error);
          setErrorDetails(error?.message || 'Component rendering failed');
          setHasError(true);
        }}
      >
        <MapComponent 
          schools={schools} 
          onMapInit={onMapInit}
        />
      </ErrorBoundary>
    </div>
  );
}
