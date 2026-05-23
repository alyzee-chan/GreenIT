import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';

/**
 * Reusable Leaflet map. Uses CircleMarker (no image assets needed, avoids the
 * default-marker-icon bundling issue with Vite).
 *
 * points: [{ latitude, longitude, label, color, radius, detail }]
 */
const MapView = ({ points = [], center = [10, 10], zoom = 2, height = 420 }) => {
  return (
    <div style={{ height, borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((p, i) => (
          <CircleMarker
            key={i}
            center={[p.latitude, p.longitude]}
            radius={p.radius || 8}
            pathOptions={{
              color: p.color || '#10B981',
              fillColor: p.color || '#10B981',
              fillOpacity: 0.6,
              weight: 2,
            }}
          >
            <Tooltip>
              <strong>{p.label}</strong>
              {p.detail ? <div style={{ fontSize: '0.8rem' }}>{p.detail}</div> : null}
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
