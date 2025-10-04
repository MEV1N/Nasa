'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Target, 
  Zap, 
  Mountain, 
  AlertTriangle, 
  MapPin, 
  Map,
  RotateCcw,
  Download,
  Share2
} from 'lucide-react';
import { calculateImpact, type ImpactResults } from '@/utils/impactPhysics';
import { calculateEarthquakeEffects, type EarthquakeEffect } from '@/utils/earthquakeEffects';
import { EarthquakeEffectsDisplay } from '@/components/EarthquakeEffectsDisplay';
import { findAffectedCities, type AffectedCity } from '@/utils/citiesDatabase';
import { AffectedCitiesDisplay } from '@/components/AffectedCitiesDisplay';
import ImpactEffects from '@/components/ImpactEffects';
import { SecondaryEffectsDisplay } from '@/components/SecondaryEffectsDisplay';
import dynamic from 'next/dynamic';

// Dynamic import for map component (client-side only)
const DamageZoneMap = dynamic(() => import('@/components/DamageZoneMap').then(mod => ({ default: mod.DamageZoneMap })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-slate-800/50 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-slate-300">Loading damage zone visualization...</p>
      </div>
    </div>
  ),
});

interface SimulationData {
  asteroid: {
    name: string;
    diameter: number; // km
    velocity: number; // km/s
    hazardous: boolean;
  };
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  parameters: {
    angle: number;
    velocity: number;
  };
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [results, setResults] = useState<(ImpactResults & {
    magnitude: string;
    description: string;
    earthquakeEffects: EarthquakeEffect[];
  }) | null>(null);
  const [affectedCities, setAffectedCities] = useState<AffectedCity[]>([]);
  const [additionalEffects, setAdditionalEffects] = useState<{
    airblastRadius: number;
    tsunamiRadius: number;
    seismicRadius: number;
  } | null>(null);

  useEffect(() => {
    // Parse URL parameters
    const asteroidName = searchParams.get('asteroid') || '';
    const asteroidDiameter = parseFloat(searchParams.get('diameter') || '1');
    const asteroidVelocity = parseFloat(searchParams.get('asteroidVelocity') || '20');
    const hazardous = searchParams.get('hazardous') === 'true';
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const locationName = searchParams.get('location') || 'Unknown Location';
    const angle = parseFloat(searchParams.get('angle') || '45');
    const velocity = parseFloat(searchParams.get('velocity') || '20');

    if (!asteroidName || !lat || !lng) {
      // Redirect back if no valid data
      router.push('/simulation');
      return;
    }

    const data: SimulationData = {
      asteroid: {
        name: asteroidName,
        diameter: asteroidDiameter,
        velocity: asteroidVelocity,
        hazardous
      },
      location: { lat, lng, name: locationName },
      parameters: { angle, velocity }
    };

    setSimulationData(data);

    // Run the simulation
    const impactData = calculateImpact({
      diameter: asteroidDiameter * 1000, // Convert km to meters
      density: 3000,
      velocity,
      angle
    });

    // Calculate earthquake effects
    const earthquakeEffects = calculateEarthquakeEffects(
      { lat, lng },
      impactData.energyMt,
      2000
    );

    // Calculate affected cities
    const citiesInDamageZone = findAffectedCities(
      lat,
      lng,
      impactData.radii
    );
    setAffectedCities(citiesInDamageZone);

    // Calculate additional effects for map display
    const energyScale = impactData.energyMt / 24; // Normalized to reference impact
    const airblastRadius = 50 * Math.pow(energyScale, 1/3);
    const tsunamiRadius = velocity > 15 ? 100 * Math.pow(energyScale, 1/4) : 0; // Only if high velocity
    const seismicRadius = 200 * Math.pow(energyScale, 1/5);
    
    setAdditionalEffects({
      airblastRadius: Math.round(airblastRadius * 10) / 10,
      tsunamiRadius: Math.round(tsunamiRadius * 10) / 10,
      seismicRadius: Math.round(seismicRadius * 10) / 10
    });

    // Determine magnitude and description
    let magnitude = '';
    let description = '';
    
    if (impactData.energyMt < 1) {
      magnitude = 'Minor';
      description = 'Local damage, similar to a small building collapse';
    } else if (impactData.energyMt < 100) {
      magnitude = 'Moderate';
      description = 'City-wide destruction, similar to the Hiroshima bomb';
    } else if (impactData.energyMt < 10000) {
      magnitude = 'Major';
      description = 'Regional devastation, affects entire metropolitan areas';
    } else if (impactData.energyMt < 1000000) {
      magnitude = 'Catastrophic';
      description = 'Continental damage, climate effects for years';
    } else {
      magnitude = 'Extinction Level';
      description = 'Global catastrophe, mass extinction event';
    }

    setResults({
      ...impactData,
      magnitude,
      description,
      earthquakeEffects
    });
  }, [searchParams, router]);

  const handleNewSimulation = () => {
    router.push('/simulation');
  };

  const handleShareResults = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    // You could add a toast notification here
    alert('Results URL copied to clipboard!');
  };

  if (!simulationData || !results) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading simulation results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <Button 
              onClick={handleNewSimulation}
              variant="outline" 
              className="bg-card border-border text-white hover:bg-white/5"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              New Simulation
            </Button>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleShareResults}
                variant="outline"
                className="bg-card border-border text-white hover:bg-white/5"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Results
              </Button>
            </div>
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-gradient">
              Impact Analysis Results
            </h1>
            <div className="flex items-center justify-center gap-4 text-lg text-neutral-400">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                {simulationData.asteroid.name}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {simulationData.location.name}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Impact Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border-red-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white text-2xl">
                <Zap className="w-6 h-6 text-yellow-400" />
                Impact Summary
                <Badge variant={results.magnitude === 'Extinction Level' ? 'destructive' : 'secondary'} className="text-lg px-3 py-1">
                  {results.magnitude}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">
                    {results.energyMt.toLocaleString()}
                  </div>
                  <div className="text-sm text-neutral-400">Megatons TNT</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">
                    {(results.craterDiameter / 1000).toFixed(2)}
                  </div>
                  <div className="text-sm text-neutral-400">km Crater Diameter</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400">
                    {results.radii.severe.toFixed(1)}
                  </div>
                  <div className="text-sm text-neutral-400">km Destruction Radius</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    {results.earthquakeEffects.length}
                  </div>
                  <div className="text-sm text-neutral-400">Cities Affected</div>
                </div>
              </div>
              
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-white text-lg">{results.description}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Damage Zone Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="w-5 h-5 text-red-400" />
                Damage Zone Classifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex items-start gap-3 p-3 bg-red-900/20 rounded-lg border border-red-800/50">
                  <div className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <span className="text-red-200 font-semibold text-sm">Severe Destruction</span>
                    <p className="text-slate-300 text-xs mt-1">Radius: {results.radii.severe.toFixed(1)} km</p>
                    <p className="text-slate-400 text-xs mt-1">Complete devastation, total structural collapse</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-900/20 rounded-lg border border-orange-800/50">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <span className="text-orange-200 font-semibold text-sm">Major Damage</span>
                    <p className="text-slate-300 text-xs mt-1">Radius: {results.radii.moderate.toFixed(1)} km</p>
                    <p className="text-slate-400 text-xs mt-1">Severe structural damage, infrastructure failure</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-yellow-900/20 rounded-lg border border-yellow-800/50">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <span className="text-yellow-200 font-semibold text-sm">Evacuation Zone</span>
                    <p className="text-slate-300 text-xs mt-1">Radius: {results.radii.light.toFixed(1)} km</p>
                    <p className="text-slate-400 text-xs mt-1">Light damage, evacuation recommended</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {/* Damage Zone Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Map className="w-5 h-5 text-blue-400" />
                  Interactive Damage Zone Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DamageZoneMap 
                  location={simulationData.location}
                  damageRadii={results.radii}
                  additionalEffects={additionalEffects || undefined}
                  className="h-96"
                />
                <div className="mt-3 text-xs text-slate-400 text-center">
                  Click on circles and markers for detailed information
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Earthquake Effects */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <EarthquakeEffectsDisplay effects={results.earthquakeEffects} />
          </motion.div>
        </div>

        {/* Global Impact Effects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-8"
        >
          <ImpactEffects 
            impactLat={simulationData.location.lat}
            impactLng={simulationData.location.lng}
            asteroidDiameter={simulationData.asteroid.diameter}
            impactVelocity={simulationData.parameters.velocity}
            impactAngle={simulationData.parameters.angle}
          />
        </motion.div>

        {/* Secondary Effects Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-8"
        >
          <SecondaryEffectsDisplay 
            impactLocation={simulationData.location}
            asteroidData={{
              diameter: simulationData.asteroid.diameter,
              velocity: simulationData.parameters.velocity,
              energyMt: results.energyMt
            }}
          />
        </motion.div>

        {/* Affected Cities Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-8"
        >
          <AffectedCitiesDisplay affectedCities={affectedCities} />
        </motion.div>

        {/* Additional Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8"
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Mountain className="w-5 h-5 text-green-400" />
                Technical Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-2">Asteroid Properties</h4>
                  <div className="space-y-1 text-sm text-slate-300">
                    <div>Name: {simulationData.asteroid.name}</div>
                    <div>Diameter: {simulationData.asteroid.diameter.toFixed(3)} km</div>
                    <div>Velocity: {simulationData.parameters.velocity} km/s</div>
                    <div>Hazardous: {simulationData.asteroid.hazardous ? 'Yes' : 'No'}</div>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Impact Parameters</h4>
                  <div className="space-y-1 text-sm text-slate-300">
                    <div>Angle: {simulationData.parameters.angle}°</div>
                    <div>Mass: {results.mass.toExponential(2)} kg</div>
                    <div>Energy: {results.energyJoules.toExponential(2)} J</div>
                    <div>Location: {simulationData.location.lat.toFixed(4)}, {simulationData.location.lng.toFixed(4)}</div>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Environmental Impact</h4>
                  <div className="space-y-1 text-sm text-slate-300">
                    <div>Crater Depth: {(results.craterDiameter / 3000).toFixed(2)} km</div>
                    <div>Seismic Events: {results.earthquakeEffects.length}</div>
                    <div>Max Earthquake: {results.earthquakeEffects[0]?.magnitude.toFixed(1) || '0.0'} M</div>
                    <div>Affected Region: {Math.max(...Object.values(results.radii)).toFixed(0)} km radius</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function LoadingResults() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-white mb-2">Loading Impact Results</h2>
        <p className="text-slate-300">Analyzing simulation parameters...</p>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function ResultsPage() {
  return (
    <Suspense fallback={<LoadingResults />}>
      <ResultsContent />
    </Suspense>
  );
}