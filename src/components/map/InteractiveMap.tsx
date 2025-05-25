
'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L, { type LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { School } from '@/types';
import { useEffect, useState, useMemo } from 'react';

// Leaflet icon fix for bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

const DEFAULT_CENTER: LatLngExpression = [20, 0]; // Centered broadly on the world
const DEFAULT_ZOOM = 2;

// Component to handle map view changes (fit bounds, set default view)
function ChangeView({ schools }: { schools: School[] }) {
  const map = useMap();

  useEffect(() => {
    if (schools.length > 0) {
      const validSchoolsWithCoords = schools.filter(
        (school) => typeof school.lat === 'number' && typeof school.lng === 'number'
      );

      if (validSchoolsWithCoords.length > 0) {
        const bounds = L.latLngBounds(
          validSchoolsWithCoords.map((s) => [s.lat!, s.lng!])
        );
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      } else {
        // No valid schools with coordinates, reset to default view
        map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      }
    } else {
      // No schools in filter, reset to default view
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    }
  }, [schools, map]);

  return null;
}

interface ActualMapComponentProps {
  schools: School[];
  mapStyle: React.CSSProperties;
}

function ActualMapComponent({ schools, mapStyle }: ActualMapComponentProps) {
  return (
    <MapContainer
      key="leaflet-map-container-instance" // Static key for React reconciliation
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom={true}
      style={mapStyle}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ChangeView schools={schools} />
      {schools
        .filter((school) => typeof school.lat === 'number' && typeof school.lng === 'number')
        .map((school) => (
          <Marker key={school.id} position={[school.lat!, school.lng!]}>
            <Popup>
              <strong>{school.name}</strong>
              <br />
              {school.city}, {school.country}
              <br />
              <a href={`/find-school/${school.id}`} target="_blank" rel="noopener noreferrer" style={{color: 'hsl(var(--accent))', textDecoration: 'underline'}}>View Details</a>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}


interface InteractiveMapProps {
  schools: School[];
}

export default function InteractiveMap({ schools }: InteractiveMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const mapStyle = useMemo(() => ({
    height: '100%',
    width: '100%',
    borderRadius: '0.5rem', // Match card rounding
  }), []);

  if (!isClient) {
    return null; // Or a placeholder/skeleton if preferred, parent already handles loading state
  }

  return <ActualMapComponent schools={schools} mapStyle={mapStyle} />;
}
