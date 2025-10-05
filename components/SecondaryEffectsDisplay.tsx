'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Waves, 
  Mountain, 
  Wind, 
  Thermometer, 
  MapPin,
  Globe,
  AlertTriangle,
  Users
} from 'lucide-react';

interface SecondaryEffectsLocation {
  name: string;
  country: string;
  region: string;
  latitude: number;
  longitude: number;
  population: number;
  coastalRisk: boolean;
  elevation: number; // meters above sea level
  distanceFromImpact: number; // km
}

interface SecondaryEffectsData {
  tsunamiAffectedCoasts: SecondaryEffectsLocation[];
  seismicAffectedRegions: SecondaryEffectsLocation[];
  climateAffectedAreas: SecondaryEffectsLocation[];
  airblastAffectedZones: SecondaryEffectsLocation[];
}

interface SecondaryEffectsDisplayProps {
  impactLocation: {
    lat: number;
    lng: number;
    name: string;
  };
  asteroidData: {
    diameter: number; // km
    velocity: number; // km/s
    energyMt: number; // megatons
  };
  className?: string;
}

// Global locations database with coastal, seismic, and climate data
const GLOBAL_LOCATIONS: SecondaryEffectsLocation[] = [
  // Major Coastal Cities (Tsunami Risk)
  { name: "Tokyo", country: "Japan", region: "East Asia", latitude: 35.6762, longitude: 139.6503, population: 37435191, coastalRisk: true, elevation: 40, distanceFromImpact: 0 },
  { name: "New York", country: "USA", region: "North America", latitude: 40.7128, longitude: -74.0060, population: 8336817, coastalRisk: true, elevation: 10, distanceFromImpact: 0 },
  { name: "Los Angeles", country: "USA", region: "North America", latitude: 34.0522, longitude: -118.2437, population: 3979576, coastalRisk: true, elevation: 87, distanceFromImpact: 0 },
  { name: "Miami", country: "USA", region: "North America", latitude: 25.7617, longitude: -80.1918, population: 470914, coastalRisk: true, elevation: 2, distanceFromImpact: 0 },
  { name: "San Francisco", country: "USA", region: "North America", latitude: 37.7749, longitude: -122.4194, population: 883305, coastalRisk: true, elevation: 16, distanceFromImpact: 0 },
  { name: "Sydney", country: "Australia", region: "Oceania", latitude: -33.8688, longitude: 151.2093, population: 5312163, coastalRisk: true, elevation: 58, distanceFromImpact: 0 },
  { name: "Mumbai", country: "India", region: "South Asia", latitude: 19.0760, longitude: 72.8777, population: 20667656, coastalRisk: true, elevation: 14, distanceFromImpact: 0 },
  { name: "Rio de Janeiro", country: "Brazil", region: "South America", latitude: -22.9068, longitude: -43.1729, population: 6748000, coastalRisk: true, elevation: 2, distanceFromImpact: 0 },
  { name: "London", country: "UK", region: "Europe", latitude: 51.5074, longitude: -0.1278, population: 9304016, coastalRisk: true, elevation: 35, distanceFromImpact: 0 },
  { name: "Barcelona", country: "Spain", region: "Europe", latitude: 41.3851, longitude: 2.1734, population: 1620343, coastalRisk: true, elevation: 12, distanceFromImpact: 0 },
  { name: "Singapore", country: "Singapore", region: "Southeast Asia", latitude: 1.3521, longitude: 103.8198, population: 5453566, coastalRisk: true, elevation: 15, distanceFromImpact: 0 },
  { name: "Hong Kong", country: "China", region: "East Asia", latitude: 22.3193, longitude: 114.1694, population: 7428887, coastalRisk: true, elevation: 22, distanceFromImpact: 0 },
  { name: "Cape Town", country: "South Africa", region: "Africa", latitude: -33.9249, longitude: 18.4241, population: 4617560, coastalRisk: true, elevation: 25, distanceFromImpact: 0 },
  { name: "Istanbul", country: "Turkey", region: "Europe/Asia", latitude: 41.0082, longitude: 28.9784, population: 15636243, coastalRisk: true, elevation: 39, distanceFromImpact: 0 },
  
  // Major Inland Cities (Seismic/Climate Risk)
  { name: "Mexico City", country: "Mexico", region: "North America", latitude: 19.4326, longitude: -99.1332, population: 9209944, coastalRisk: false, elevation: 2240, distanceFromImpact: 0 },
  { name: "Delhi", country: "India", region: "South Asia", latitude: 28.7041, longitude: 77.1025, population: 32941308, coastalRisk: false, elevation: 216, distanceFromImpact: 0 },
  { name: "São Paulo", country: "Brazil", region: "South America", latitude: -23.5505, longitude: -46.6333, population: 12325232, coastalRisk: false, elevation: 760, distanceFromImpact: 0 },
  { name: "Moscow", country: "Russia", region: "Europe", latitude: 55.7558, longitude: 37.6176, population: 12615279, coastalRisk: false, elevation: 156, distanceFromImpact: 0 },
  { name: "Beijing", country: "China", region: "East Asia", latitude: 39.9042, longitude: 116.4074, population: 21766214, coastalRisk: false, elevation: 43, distanceFromImpact: 0 },
  { name: "Cairo", country: "Egypt", region: "Africa", latitude: 30.0444, longitude: 31.2357, population: 21750020, coastalRisk: false, elevation: 74, distanceFromImpact: 0 },
  { name: "Tehran", country: "Iran", region: "Middle East", latitude: 35.6892, longitude: 51.3890, population: 8693706, coastalRisk: false, elevation: 1200, distanceFromImpact: 0 },
  { name: "Johannesburg", country: "South Africa", region: "Africa", latitude: -26.2041, longitude: 28.0473, population: 4803262, coastalRisk: false, elevation: 1753, distanceFromImpact: 0 },
  
  // Strategic Island Nations (High Tsunami Risk)
  { name: "Honolulu", country: "USA", region: "Pacific", latitude: 21.3099, longitude: -157.8581, population: 345064, coastalRisk: true, elevation: 6, distanceFromImpact: 0 },
  { name: "Manila", country: "Philippines", region: "Southeast Asia", latitude: 14.5995, longitude: 120.9842, population: 14808137, coastalRisk: true, elevation: 16, distanceFromImpact: 0 },
  { name: "Jakarta", country: "Indonesia", region: "Southeast Asia", latitude: -6.2088, longitude: 106.8456, population: 10562088, coastalRisk: true, elevation: 8, distanceFromImpact: 0 },
  { name: "Maldives", country: "Maldives", region: "Indian Ocean", latitude: 3.2028, longitude: 73.2207, population: 540544, coastalRisk: true, elevation: 1, distanceFromImpact: 0 },
];

// Calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function calculateSecondaryEffects(
  impactLocation: { lat: number; lng: number },
  asteroidData: { diameter: number; velocity: number; energyMt: number }
): SecondaryEffectsData {
  const locations = GLOBAL_LOCATIONS.map(loc => ({
    ...loc,
    distanceFromImpact: calculateDistance(impactLocation.lat, impactLocation.lng, loc.latitude, loc.longitude)
  }));

  // Calculate effect radii based on asteroid energy
  const energyScale = asteroidData.energyMt / 100; // Normalized scale
  const tsunamiMaxRange = Math.min(10000, 2000 * Math.pow(energyScale, 1/3)); // Max 10,000 km
  const seismicMaxRange = Math.min(15000, 3000 * Math.pow(energyScale, 1/4)); // Max 15,000 km
  const climateGlobalThreshold = 1000; // MT - global climate effects
  const airblastMaxRange = 500 * Math.pow(energyScale, 1/3); // Airblast range

  // Tsunami affected coasts (coastal cities within range)
  const tsunamiAffectedCoasts = locations.filter(loc => 
    loc.coastalRisk && 
    loc.distanceFromImpact <= tsunamiMaxRange &&
    loc.elevation < 100 // Low elevation coastal areas more at risk
  ).sort((a, b) => a.distanceFromImpact - b.distanceFromImpact);

  // Seismic affected regions (all locations within seismic range)
  const seismicAffectedRegions = locations.filter(loc => 
    loc.distanceFromImpact <= seismicMaxRange
  ).sort((a, b) => a.distanceFromImpact - b.distanceFromImpact);

  // Climate affected areas (global for large impacts)
  const climateAffectedAreas = asteroidData.energyMt >= climateGlobalThreshold 
    ? locations.slice() // All locations for global climate effects
    : locations.filter(loc => loc.distanceFromImpact <= 5000); // Regional for smaller impacts

  // Airblast affected zones (close range, high population density)
  const airblastAffectedZones = locations.filter(loc => 
    loc.distanceFromImpact <= airblastMaxRange
  ).sort((a, b) => a.distanceFromImpact - b.distanceFromImpact);

  return {
    tsunamiAffectedCoasts: tsunamiAffectedCoasts.slice(0, 15), // Top 15 most at risk
    seismicAffectedRegions: seismicAffectedRegions.slice(0, 20), // Top 20 closest
    climateAffectedAreas: climateAffectedAreas.slice(0, 25), // Top 25 populated areas
    airblastAffectedZones: airblastAffectedZones.slice(0, 10) // Top 10 closest
  };
}

export function SecondaryEffectsDisplay({ 
  impactLocation, 
  asteroidData, 
  className 
}: SecondaryEffectsDisplayProps) {
  const effects = calculateSecondaryEffects(impactLocation, asteroidData);

  const formatDistance = (km: number) => {
    if (km < 1000) return `${km.toFixed(0)} km`;
    return `${(km / 1000).toFixed(1)}K km`;
  };

  const formatPopulation = (pop: number) => {
    if (pop >= 1000000) return `${(pop / 1000000).toFixed(1)}M`;
    if (pop >= 1000) return `${(pop / 1000).toFixed(0)}K`;
    return pop.toLocaleString();
  };

  const getTsunamiRisk = (elevation: number, distance: number) => {
    if (elevation <= 5 && distance <= 1000) return 'extreme';
    if (elevation <= 20 && distance <= 3000) return 'high';
    if (elevation <= 50 && distance <= 5000) return 'moderate';
    return 'low';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'extreme': return 'text-red-400 bg-red-900/30 border-red-800';
      case 'high': return 'text-orange-400 bg-orange-900/30 border-orange-800';
      case 'moderate': return 'text-yellow-400 bg-yellow-900/30 border-yellow-800';
      default: return 'text-blue-400 bg-blue-900/30 border-blue-800';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Tsunami Affected Coastal Areas */}
      {effects.tsunamiAffectedCoasts.length > 0 && (
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white font-orbitron">
              Tsunami Affected Coastal Areas
              <Badge variant="outline" className="ml-2">
                {effects.tsunamiAffectedCoasts.length} Locations
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {effects.tsunamiAffectedCoasts.map((location, index) => {
                const risk = getTsunamiRisk(location.elevation, location.distanceFromImpact);
                return (
                  <div
                    key={index}
                    className="p-3 rounded-lg border border-zinc-800 bg-zinc-950"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="font-semibold text-white">
                          {location.name}, {location.country}
                        </span>
                        <Badge variant="outline" className={`text-xs ${
                          risk === 'extreme' ? 'text-red-400 border-red-700' :
                          risk === 'high' ? 'text-red-400 border-red-700' :
                          risk === 'moderate' ? 'text-yellow-400 border-yellow-700' :
                          'text-white border-zinc-700'
                        }`}>
                          {risk.toUpperCase()} RISK
                        </Badge>
                      </div>
                      <span className="text-xs text-zinc-400">
                        {formatDistance(location.distanceFromImpact)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-zinc-400">Population:</span>
                        <div className="text-white font-medium">
                          {formatPopulation(location.population)}
                        </div>
                      </div>
                      <div>
                        <span className="text-zinc-400">Elevation:</span>
                        <div className="text-white font-medium">
                          {location.elevation}m above sea
                        </div>
                      </div>
                      <div>
                        <span className="text-zinc-400">Region:</span>
                        <div className="text-white font-medium">
                          {location.region}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-zinc-300">
                      {risk === 'extreme' && 'Catastrophic tsunami waves expected - immediate evacuation required'}
                      {risk === 'high' && 'Major tsunami flooding likely - evacuation recommended'}
                      {risk === 'moderate' && 'Tsunami waves possible - coastal areas at risk'}
                      {risk === 'low' && 'Minor tsunami effects possible'}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seismic Affected Regions */}
      {effects.seismicAffectedRegions.length > 0 && (
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white font-orbitron">
              Seismic Affected Regions
              <Badge variant="outline" className="ml-2">
                {effects.seismicAffectedRegions.length} Locations
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 max-h-64 overflow-y-auto">
              {effects.seismicAffectedRegions.map((location, index) => (
                <div
                  key={index}
                  className="p-2 rounded bg-zinc-950 border border-zinc-800"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-medium">
                        {location.name}, {location.country}
                      </span>
                      <span className="text-xs text-zinc-400">
                        Pop: {formatPopulation(location.population)}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-400">
                      {formatDistance(location.distanceFromImpact)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Climate Affected Areas */}
      {asteroidData.energyMt >= 1000 && (
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white font-orbitron">
              Global Climate Impact Zones
              <Badge variant="outline" className="ml-2 text-white-400">
                GLOBAL EFFECT
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-white">Worldwide Climate Disruption</span>
              </div>
              <p className="text-sm text-zinc-300">
                This impact will cause global climate effects affecting all inhabited regions worldwide. 
                Major population centers will experience temperature drops, reduced sunlight, and agricultural disruption.
              </p>
            </div>
            
            <div className="text-sm text-zinc-400 mb-3">
              Most Vulnerable Population Centers:
            </div>
            <div className="grid grid-cols-2 gap-2">
              {effects.climateAffectedAreas.slice(0, 12).map((location, index) => (
                <div
                  key={index}
                  className="p-2 rounded bg-zinc-950 border border-zinc-800 text-xs"
                >
                  <div className="text-white font-medium">
                    {location.name}, {location.country}
                  </div>
                  <div className="text-zinc-300">
                    {formatPopulation(location.population)} people at risk
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Airblast Affected Zones */}
      {effects.airblastAffectedZones.length > 0 && (
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white font-orbitron">
              <Wind className="w-5 h-5 text-gray-400" />
              Airblast/Shockwave Zones
              <Badge variant="outline" className="ml-2">
                {effects.airblastAffectedZones.length} Locations
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {effects.airblastAffectedZones.map((location, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border border-gray-700 bg-gray-900/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-white">
                        {location.name}, {location.country}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-400">
                      {formatDistance(location.distanceFromImpact)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-zinc-400">Population at Risk:</span>
                      <div className="text-red-300 font-medium">
                        {formatPopulation(location.population)}
                      </div>
                    </div>
                    <div>
                      <span className="text-zinc-400">Expected Effect:</span>
                      <div className="text-gray-300 font-medium">
                        {location.distanceFromImpact <= 100 ? 'Severe damage' :
                         location.distanceFromImpact <= 300 ? 'Major damage' : 'Moderate damage'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Statistics */}
      <Card className="bg-gradient-to-r from-zinc-950 to-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white font-orbitron">
            Secondary Effects Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">
                {effects.tsunamiAffectedCoasts.length}
              </div>
              <div className="text-xs text-zinc-400">Coastal Areas</div>
              <div className="text-xs text-zinc-300">Tsunami Risk</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {effects.seismicAffectedRegions.length}
              </div>
              <div className="text-xs text-zinc-400">Regions</div>
              <div className="text-xs text-zinc-300">Seismic Effects</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {asteroidData.energyMt >= 1000 ? 'GLOBAL' : effects.climateAffectedAreas.length}
              </div>
              <div className="text-xs text-zinc-400">Areas</div>
              <div className="text-xs text-zinc-300">Climate Impact</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {effects.airblastAffectedZones.length}
              </div>
              <div className="text-xs text-zinc-400">Zones</div>
              <div className="text-xs text-zinc-300">Airblast Damage</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}