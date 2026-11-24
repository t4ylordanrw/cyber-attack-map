'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

const categoryColors = {
  Financial: '#ef4444',
  'Private Organisation': '#3b82f6',
  'Critical Infrastructure': '#f97316',
  Healthcare: '#10b981',
  'Government / Public Sector': '#a855f7',
  'Technology / Supply Chain': '#06b6d4',
};

function createIcon(color, isRecent) {
  const pulseClass = isRecent ? 'pulse' : '';
  return L.divIcon({
    className: `custom-marker ${pulseClass}`,
    html: `<div class="marker-dot" style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px ${color};"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function FlyTo({ selectedAttack }) {
  const map = useMap();
  useEffect(() => {
    if (selectedAttack) {
      map.flyTo([selectedAttack.lat, selectedAttack.lng], 6, { duration: 1 });
    }
  }, [selectedAttack, map]);
  return null;
}

export default function Map({ attacks, selectedAttack, onSelect }) {
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyTo selectedAttack={selectedAttack} />
      {attacks.map(attack => {
        const isRecent = new Date(attack.date) >= twoDaysAgo;
        return (
          <Marker
            key={attack.id}
            position={[attack.lat, attack.lng]}
            icon={createIcon(categoryColors[attack.category] || '#ffffff', isRecent)}
            eventHandlers={{
              click: () => onSelect(attack),
            }}
          >
            <Popup className="custom-popup">
              <div className="text-sm">
                <strong>{attack.title}</strong>
                {isRecent && <span className="ml-2 text-xs bg-red-500 text-white px-1 rounded">NEW</span>}
                <br />
                <span className="text-xs px-1 py-0.5 rounded" style={{ backgroundColor: categoryColors[attack.category] + '40' }}>
                  {attack.category}
                </span>
                <p className="mt-1">{attack.location} • {attack.date}</p>
                <p className="mt-1 text-gray-300">{attack.description}</p>
                <p className="mt-1 text-xs text-gray-400">Impact: {attack.impact}</p>
                <p className="mt-1 text-xs">Source: {attack.source}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
