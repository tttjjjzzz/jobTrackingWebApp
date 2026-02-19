import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { useEffect } from 'react';

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}

interface LocationMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  height?: string;
  interactive?: boolean;
  className?: string;
}

export function LocationMap({
  lat,
  lng,
  zoom = 12,
  height = '200px',
  interactive = true,
  className = '',
}: LocationMapProps) {
  const center: [number, number] = [lat, lng];

  return (
    <div
      className={`rounded-xl overflow-hidden border border-white/10 ${className}`}
      style={{ height }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={interactive}
        dragging={interactive}
        scrollWheelZoom={interactive}
        doubleClickZoom={interactive}
        touchZoom={interactive}
        attributionControl={false}
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        <Marker position={center} />
      </MapContainer>
    </div>
  );
}
