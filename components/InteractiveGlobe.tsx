'use client';

import React, { useEffect, useRef, useState } from 'react';
import Globe from 'globe.gl';
import * as THREE from 'three';

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: string;
  message: string;
}

interface InteractiveGlobeProps {
  className?: string;
  onLocationSelect?: (lat: number, lng: number, locationName: string) => void;
  selectedAsteroid?: any;
}

const InteractiveGlobe: React.FC<InteractiveGlobeProps> = ({ className, onLocationSelect, selectedAsteroid }) => {
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!globeContainerRef.current) return;

    // Initialize Globe
    const globe = new Globe(globeContainerRef.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .width(globeContainerRef.current.clientWidth)
      .height(globeContainerRef.current.clientHeight);

    // Add click event listener
    globe.onGlobeClick((coords: { lat: number; lng: number }, event: any) => {
      handleGlobeClick(coords.lat, coords.lng);
    });

    globeRef.current = globe;

    // Auto-rotate
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;
    globe.controls().enableDamping = true;
    globe.controls().dampingFactor = 0.02;
    globe.controls().enableZoom = true;
    globe.controls().minDistance = 200;
    globe.controls().maxDistance = 800;

    // Cleanup function
    return () => {
      if (globeRef.current && globeContainerRef.current) {
        globeContainerRef.current.innerHTML = '';
      }
    };
  }, []);

  const handleGlobeClick = async (lat: number, lng: number) => {
    setIsLoading(true);
    
    try {
      // Get location name (simplified - in a real app you'd use reverse geocoding)
      const locationName = getLocationName(lat, lng);
      
      const locationData: LocationData = {
        latitude: lat,
        longitude: lng,
        timestamp: new Date().toISOString(),
        message: `Impact location selected: ${locationName}`
      };
      
      setSelectedLocation(locationData);
      
      // Add a marker to the globe at the clicked location
      if (globeRef.current) {
        const markers = [{
          lat: lat,
          lng: lng,
          size: 0.1,
          color: '#ff6b6b'
        }];
        
        globeRef.current.pointsData(markers)
          .pointAltitude('size')
          .pointColor('color')
          .pointRadius(2);
      }

      // Call the callback if provided
      if (onLocationSelect) {
        onLocationSelect(lat, lng, locationName);
      }
    } catch (error) {
      console.error('Error handling globe click:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocationName = (lat: number, lng: number): string => {
    // Simplified location naming - in a real app you'd use reverse geocoding API
    const regions = [
      { name: 'Pacific Ocean', bounds: { latMin: -60, latMax: 60, lngMin: -180, lngMax: -80 } },
      { name: 'Atlantic Ocean', bounds: { latMin: -60, latMax: 60, lngMin: -80, lngMax: 20 } },
      { name: 'Indian Ocean', bounds: { latMin: -60, latMax: 30, lngMin: 20, lngMax: 120 } },
      { name: 'North America', bounds: { latMin: 15, latMax: 75, lngMin: -170, lngMax: -50 } },
      { name: 'South America', bounds: { latMin: -60, latMax: 15, lngMin: -90, lngMax: -30 } },
      { name: 'Europe', bounds: { latMin: 35, latMax: 75, lngMin: -10, lngMax: 40 } },
      { name: 'Africa', bounds: { latMin: -35, latMax: 40, lngMin: -20, lngMax: 55 } },
      { name: 'Asia', bounds: { latMin: 5, latMax: 75, lngMin: 40, lngMax: 180 } },
      { name: 'Australia', bounds: { latMin: -45, latMax: -10, lngMin: 110, lngMax: 160 } },
      { name: 'Antarctica', bounds: { latMin: -90, latMax: -60, lngMin: -180, lngMax: 180 } }
    ];

    for (const region of regions) {
      const { bounds } = region;
      if (lat >= bounds.latMin && lat <= bounds.latMax && 
          lng >= bounds.lngMin && lng <= bounds.lngMax) {
        return region.name;
      }
    }
    
    return 'Unknown Location';
  };

  const clearSelection = () => {
    setSelectedLocation(null);
    if (globeRef.current) {
      globeRef.current.pointsData([]);
    }
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div 
        ref={globeContainerRef} 
        className="w-full h-full"
        style={{ background: 'radial-gradient(circle, #001122 0%, #000 100%)' }}
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute top-4 left-4 bg-black/80 text-white px-4 py-2 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Loading location data...
          </div>
        </div>
      )}

      {/* Location info panel */}
      {selectedLocation && (
        <div className="absolute top-4 right-4 bg-black/90 text-white p-4 rounded-lg max-w-sm border border-red-500/50">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-red-400">Impact Target Selected</h3>
            <button 
              onClick={clearSelection}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <p><strong>Location:</strong> {getLocationName(selectedLocation.latitude, selectedLocation.longitude)}</p>
            <p><strong>Latitude:</strong> {selectedLocation.latitude.toFixed(4)}°</p>
            <p><strong>Longitude:</strong> {selectedLocation.longitude.toFixed(4)}°</p>
            {selectedAsteroid && (
              <div className="mt-3 p-2 bg-red-900/30 rounded border border-red-700/50">
                <p className="text-xs text-red-300">
                  <strong>Incoming Asteroid:</strong> {selectedAsteroid.name.replace(/[()]/g, '')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-black/80 text-white px-4 py-2 rounded-lg text-sm">
        Click anywhere on Earth to select the impact location
      </div>
    </div>
  );
};

export default InteractiveGlobe;