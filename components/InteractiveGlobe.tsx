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
    // Check specific countries first (most precise)
    const countries = [
      // Indian Subcontinent
      { name: 'India', bounds: { latMin: 6, latMax: 38, lngMin: 68, lngMax: 98 } },
      { name: 'Pakistan', bounds: { latMin: 23, latMax: 37, lngMin: 60, lngMax: 78 } },
      { name: 'Bangladesh', bounds: { latMin: 20, latMax: 27, lngMin: 88, lngMax: 93 } },
      { name: 'Sri Lanka', bounds: { latMin: 5, latMax: 10, lngMin: 79, lngMax: 82 } },
      
      // East Asia
      { name: 'China', bounds: { latMin: 15, latMax: 54, lngMin: 73, lngMax: 135 } },
      { name: 'Japan', bounds: { latMin: 24, latMax: 46, lngMin: 123, lngMax: 146 } },
      { name: 'South Korea', bounds: { latMin: 33, latMax: 39, lngMin: 124, lngMax: 132 } },
      { name: 'North Korea', bounds: { latMin: 37, latMax: 43, lngMin: 124, lngMax: 131 } },
      { name: 'Mongolia', bounds: { latMin: 41, latMax: 52, lngMin: 87, lngMax: 120 } },
      
      // Southeast Asia
      { name: 'Thailand', bounds: { latMin: 5, latMax: 21, lngMin: 97, lngMax: 106 } },
      { name: 'Vietnam', bounds: { latMin: 8, latMax: 24, lngMin: 102, lngMax: 110 } },
      { name: 'Philippines', bounds: { latMin: 4, latMax: 21, lngMin: 116, lngMax: 127 } },
      { name: 'Indonesia', bounds: { latMin: -11, latMax: 6, lngMin: 95, lngMax: 141 } },
      { name: 'Malaysia', bounds: { latMin: 0, latMax: 8, lngMin: 99, lngMax: 120 } },
      { name: 'Singapore', bounds: { latMin: 1, latMax: 2, lngMin: 103, lngMax: 104 } },
      
      // Central Asia
      { name: 'Russia', bounds: { latMin: 41, latMax: 82, lngMin: 19, lngMax: 180 } },
      { name: 'Kazakhstan', bounds: { latMin: 40, latMax: 56, lngMin: 46, lngMax: 88 } },
      
      // Middle East
      { name: 'Iran', bounds: { latMin: 25, latMax: 40, lngMin: 44, lngMax: 64 } },
      { name: 'Saudi Arabia', bounds: { latMin: 16, latMax: 33, lngMin: 34, lngMax: 56 } },
      { name: 'Turkey', bounds: { latMin: 35, latMax: 43, lngMin: 25, lngMax: 45 } },
      
      // Europe
      { name: 'United Kingdom', bounds: { latMin: 49, latMax: 61, lngMin: -8, lngMax: 2 } },
      { name: 'France', bounds: { latMin: 41, latMax: 52, lngMin: -5, lngMax: 10 } },
      { name: 'Germany', bounds: { latMin: 47, latMax: 56, lngMin: 5, lngMax: 16 } },
      { name: 'Spain', bounds: { latMin: 35, latMax: 44, lngMin: -10, lngMax: 5 } },
      { name: 'Italy', bounds: { latMin: 35, latMax: 48, lngMin: 6, lngMax: 19 } },
      
      // Africa
      { name: 'Egypt', bounds: { latMin: 22, latMax: 32, lngMin: 24, lngMax: 37 } },
      { name: 'South Africa', bounds: { latMin: -35, latMax: -22, lngMin: 16, lngMax: 33 } },
      { name: 'Nigeria', bounds: { latMin: 4, latMax: 14, lngMin: 2, lngMax: 15 } },
      { name: 'Madagascar', bounds: { latMin: -26, latMax: -12, lngMin: 43, lngMax: 51 } },
      
      // Americas
      { name: 'United States', bounds: { latMin: 24, latMax: 50, lngMin: -125, lngMax: -66 } },
      { name: 'Canada', bounds: { latMin: 41, latMax: 84, lngMin: -141, lngMax: -52 } },
      { name: 'Mexico', bounds: { latMin: 14, latMax: 33, lngMin: -118, lngMax: -86 } },
      { name: 'Brazil', bounds: { latMin: -34, latMax: 6, lngMin: -74, lngMax: -32 } },
      { name: 'Argentina', bounds: { latMin: -56, latMax: -21, lngMin: -74, lngMax: -53 } },
      
      // Oceania
      { name: 'Australia', bounds: { latMin: -45, latMax: -10, lngMin: 110, lngMax: 160 } },
      { name: 'New Zealand', bounds: { latMin: -47, latMax: -34, lngMin: 166, lngMax: 179 } },
      
      // Other
      { name: 'Greenland', bounds: { latMin: 59, latMax: 84, lngMin: -73, lngMax: -12 } },
      { name: 'Antarctica', bounds: { latMin: -90, latMax: -60, lngMin: -180, lngMax: 180 } },
    ];
    
    // Check countries first (most specific)
    for (const country of countries) {
      const { bounds } = country;
      if (lat >= bounds.latMin && lat <= bounds.latMax && 
          lng >= bounds.lngMin && lng <= bounds.lngMax) {
        return country.name;
      }
    }
    
    // Then check broader regions for remaining areas
    const regions = [
      { name: 'North America', bounds: { latMin: 15, latMax: 75, lngMin: -170, lngMax: -50 } },
      { name: 'South America', bounds: { latMin: -60, latMax: 15, lngMin: -90, lngMax: -30 } },
      { name: 'Europe', bounds: { latMin: 35, latMax: 75, lngMin: -10, lngMax: 40 } },
      { name: 'Africa', bounds: { latMin: -35, latMax: 40, lngMin: -20, lngMax: 55 } },
      { name: 'Asia', bounds: { latMin: 5, latMax: 75, lngMin: 40, lngMax: 180 } },
    ];

    // Check broader regions
    for (const region of regions) {
      const { bounds } = region;
      if (lat >= bounds.latMin && lat <= bounds.latMax && 
          lng >= bounds.lngMin && lng <= bounds.lngMax) {
        return region.name;
      }
    }

    // Then check ocean regions (only if not on land)
    const oceanRegions = [
      // More precise ocean bounds that don't overlap major land masses
      { name: 'Pacific Ocean', bounds: { latMin: -60, latMax: 60, lngMin: -180, lngMax: -70 } }, // Western Pacific
      { name: 'Pacific Ocean', bounds: { latMin: -60, latMax: 60, lngMin: 120, lngMax: 180 } }, // Eastern Pacific
      { name: 'Atlantic Ocean', bounds: { latMin: -60, latMax: 60, lngMin: -70, lngMax: -10 } }, // Atlantic
      { name: 'Indian Ocean', bounds: { latMin: -60, latMax: 30, lngMin: 20, lngMax: 120 } }, // Indian Ocean
      { name: 'Arctic Ocean', bounds: { latMin: 60, latMax: 90, lngMin: -180, lngMax: 180 } },
      { name: 'Southern Ocean', bounds: { latMin: -90, latMax: -60, lngMin: -180, lngMax: 180 } }
    ];

    for (const region of oceanRegions) {
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