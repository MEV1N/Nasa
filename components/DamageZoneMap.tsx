'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface DamageZoneMapProps {
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  damageRadii: {
    severe: number; // km
    moderate: number; // km
    light: number; // km
  };
  additionalEffects?: {
    airblastRadius?: number; // km
    tsunamiRadius?: number; // km for coastal areas affected
    seismicRadius?: number; // km for earthquake effects
  };
  className?: string;
}

export function DamageZoneMap({ location, damageRadii, additionalEffects, className }: DamageZoneMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: [location.lat, location.lng],
      zoom: 8,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    // Custom icon for impact point
    const impactIcon = L.divIcon({
      className: 'custom-impact-marker',
      html: `<div style="
        width: 20px; 
        height: 20px; 
        background: #ff0000; 
        border: 3px solid #ffffff; 
        border-radius: 50%; 
        box-shadow: 0 0 10px rgba(255,0,0,0.8);
        animation: pulse 2s infinite;
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    // Add impact point marker
    L.marker([location.lat, location.lng], { icon: impactIcon })
      .addTo(map)
      .bindPopup(`<strong>Impact Point</strong><br/>${location.name}<br/>Lat: ${location.lat.toFixed(4)}<br/>Lng: ${location.lng.toFixed(4)}`, {
        offset: [0, -10]
      });

    // Add damage zone circles
    if (damageRadii.light > 0) {
      L.circle([location.lat, location.lng], {
        radius: damageRadii.light * 1000, // Convert km to meters
        fillColor: '#fef3c7', // Light yellow
        color: '#f59e0b',
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.2,
      }).addTo(map).bindPopup('Evacuation Zone<br/>Light damage and evacuation recommended');
    }

    if (damageRadii.moderate > 0) {
      L.circle([location.lat, location.lng], {
        radius: damageRadii.moderate * 1000,
        fillColor: '#fed7aa', // Light orange
        color: '#ea580c',
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.3,
      }).addTo(map).bindPopup('Major Damage Zone<br/>Severe structural damage expected');
    }

    if (damageRadii.severe > 0) {
      L.circle([location.lat, location.lng], {
        radius: damageRadii.severe * 1000,
        fillColor: '#fecaca', // Light red
        color: '#dc2626',
        weight: 3,
        opacity: 0.9,
        fillOpacity: 0.4,
      }).addTo(map).bindPopup('Severe Destruction Zone<br/>Complete devastation expected');
    }

    // Add additional effects if provided
    if (additionalEffects?.airblastRadius && additionalEffects.airblastRadius > 0) {
      L.circle([location.lat, location.lng], {
        radius: additionalEffects.airblastRadius * 1000,
        fillColor: '#8b5cf6', // Purple
        color: '#7c3aed',
        weight: 2,
        opacity: 0.7,
        fillOpacity: 0.1,
        dashArray: '10, 5'
      }).addTo(map).bindPopup('Airblast/Shockwave Zone<br/>Destructive overpressure effects');
    }

    if (additionalEffects?.tsunamiRadius && additionalEffects.tsunamiRadius > 0) {
      L.circle([location.lat, location.lng], {
        radius: additionalEffects.tsunamiRadius * 1000,
        fillColor: '#0ea5e9', // Blue
        color: '#0284c7',
        weight: 2,
        opacity: 0.6,
        fillOpacity: 0.05,
        dashArray: '15, 10'
      }).addTo(map).bindPopup('Tsunami Affected Zone<br/>Coastal areas at risk of flooding');
    }

    if (additionalEffects?.seismicRadius && additionalEffects.seismicRadius > 0) {
      L.circle([location.lat, location.lng], {
        radius: additionalEffects.seismicRadius * 1000,
        fillColor: '#eab308', // Yellow
        color: '#ca8a04',
        weight: 1,
        opacity: 0.5,
        fillOpacity: 0.03,
        dashArray: '5, 15'
      }).addTo(map).bindPopup('Seismic Effects Zone<br/>Earthquake damage from impact');
    }

    // Fit map to show all damage zones
    const allRadii = [damageRadii.light, damageRadii.moderate, damageRadii.severe];
    if (additionalEffects?.airblastRadius) allRadii.push(additionalEffects.airblastRadius);
    if (additionalEffects?.tsunamiRadius) allRadii.push(additionalEffects.tsunamiRadius);
    if (additionalEffects?.seismicRadius) allRadii.push(additionalEffects.seismicRadius);
    const maxRadius = Math.max(...allRadii);
    if (maxRadius > 0) {
      const bounds = L.latLngBounds(
        [location.lat - maxRadius/111, location.lng - maxRadius/111], // Rough conversion
        [location.lat + maxRadius/111, location.lng + maxRadius/111]
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }

    mapRef.current = map;

    // Add CSS for pulse animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.8; }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, [location, damageRadii]);

  return (
    <div className={`w-full h-full ${className}`}>
      <div 
        ref={mapContainerRef} 
        className="w-full h-full rounded-lg overflow-hidden border border-gray-600"
        style={{ minHeight: '300px' }}
      />
    </div>
  );
}