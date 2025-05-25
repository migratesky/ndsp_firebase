'use client';

import { useEffect, useRef } from 'react';
import type { School } from '@/types';

// Import CSS in your global CSS file instead
// import 'leaflet/dist/leaflet.css';

export default function MapComponent({ schools, onMapInit }: { schools: School[]; onMapInit?: (map: any) => void }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && mapContainer.current && !mapRef.current && !initializedRef.current) {
      initializedRef.current = true;
      
      const initMap = async () => {
        try {
          const L = await import('leaflet');
          
          if (mapContainer.current && !mapRef.current) {
            const map = L.default.map(mapContainer.current).setView([20, 0], 2);
            L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            
            mapRef.current = map;
            if (onMapInit) onMapInit(map);
          }
        } catch (error) {
          console.error('Failed to initialize map:', error);
          initializedRef.current = false; // Reset flag on error
        }
      };
      
      initMap();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        initializedRef.current = false;
      }
    };
  }, [onMapInit]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full"
      data-testid="map-container"
    />
  );
}