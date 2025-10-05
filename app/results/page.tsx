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
  MapPin, 
  Map,
  Share2,
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
    <div className="w-full h-[400px] bg-zinc-900 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-zinc-300">Loading damage zone visualization...</p>
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

  // Utility function to calculate physics-based energy
  const calculatePhysicsEnergy = (diameter: number, velocity: number): number => {
    const radius = (diameter * 1000) / 2; // convert km to meters, then to radius
    const volume = (4/3) * Math.PI * Math.pow(radius, 3); // m³
    const density = 3000; // kg/m³ (rocky asteroid)
    const mass = density * volume; // kg
    const velocityMs = velocity * 1000; // convert km/s to m/s
    const energyJoules = 0.5 * mass * Math.pow(velocityMs, 2); // Joules
    return energyJoules / (4.184e15); // Convert to megatons TNT
  };

  // Physics-based crater diameter calculation (Collins et al. scaling)
  const calculatePhysicsCraterDiameter = (energy: number): number => {
    // D = 1.8 * (E/4.2e12)^0.25 for complex craters (km)
    const energyJoules = energy * 4.184e15;
    return 1.8 * Math.pow(energyJoules / 4.2e12, 0.25);
  };

  // Physics-based damage radii calculations
  const calculatePhysicsDamageRadii = (energy: number) => {
    const cubeRootEnergy = Math.pow(energy, 1/3);
    return {
      severe: cubeRootEnergy * 0.56, // >100 kPa overpressure
      moderate: cubeRootEnergy * 1.78, // 10-100 kPa overpressure  
      light: cubeRootEnergy * 4.71 // 1-10 kPa overpressure
    };
  };

  // Physics-based thermal radius calculation
  const calculatePhysicsThermalRadius = (energy: number): number => {
    return Math.pow(energy, 0.4) * 7.2; // 1st/2nd degree burns radius
  };

  // Physics-based surface velocity (atmospheric deceleration)
  const calculatePhysicsSurfaceVelocity = (initialVelocity: number, diameter: number): number => {
    // Simplified atmospheric deceleration model
    const dragCoeff = Math.min(0.3, 1000 / (diameter * 1000)); // Larger objects less affected
    return initialVelocity * (1 - dragCoeff);
  };

  // Utility function to get averaged energy between Gemini and physics calculations
  const getAveragedEnergy = (geminiEnergy: number | null, simData: SimulationData): number => {
    const physicsEnergy = calculatePhysicsEnergy(
      simData.asteroid.diameter, 
      simData.parameters.velocity
    );
    
    if (geminiEnergy && geminiEnergy > 0) {
      // Average between Gemini and physics calculations
      return (geminiEnergy + physicsEnergy) / 2;
    }
    
    // Fallback to physics calculation if Gemini data unavailable
    return physicsEnergy;
  };

  // Utility function to get averaged crater diameter
  const getAveragedCraterDiameter = (geminiDiameter: number | null, averagedEnergy: number): number => {
    const physicsDiameter = calculatePhysicsCraterDiameter(averagedEnergy);
    
    if (geminiDiameter && geminiDiameter > 0) {
      return (geminiDiameter + physicsDiameter) / 2;
    }
    
    return physicsDiameter;
  };

  // Utility function to get averaged damage radii
  const getAveragedDamageRadii = (geminiRadii: any, averagedEnergy: number) => {
    const physicsRadii = calculatePhysicsDamageRadii(averagedEnergy);
    
    if (geminiRadii && geminiRadii.severe && geminiRadii.moderate && geminiRadii.light) {
      return {
        severe: (geminiRadii.severe + physicsRadii.severe) / 2,
        moderate: (geminiRadii.moderate + physicsRadii.moderate) / 2,
        light: (geminiRadii.light + physicsRadii.light) / 2
      };
    }
    
    return physicsRadii;
  };

  // Utility function to get averaged thermal radius
  const getAveragedThermalRadius = (geminiThermal: number | null, averagedEnergy: number): number => {
    const physicsThermal = calculatePhysicsThermalRadius(averagedEnergy);
    
    if (geminiThermal && geminiThermal > 0) {
      return (geminiThermal + physicsThermal) / 2;
    }
    
    return physicsThermal;
  };

  // Utility function to get averaged surface velocity
  const getAveragedSurfaceVelocity = (geminiVelocity: number | null, simData: SimulationData): number => {
    const physicsVelocity = calculatePhysicsSurfaceVelocity(
      simData.parameters.velocity,
      simData.asteroid.diameter
    );
    
    if (geminiVelocity && geminiVelocity > 0) {
      return (geminiVelocity + physicsVelocity) / 2;
    }
    
    return physicsVelocity;
  };
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
    // Get simulation data from localStorage
    const storedData = localStorage.getItem('impactSimulationData');
    
    if (!storedData) {
      // Redirect back if no simulation data
      router.push('/simulation');
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      
      const data: SimulationData = {
        asteroid: parsedData.asteroid,
        location: parsedData.location,
        parameters: parsedData.parameters
      };

      setSimulationData(data);

      // Use Gemini-generated impact data
      const geminiData = parsedData.geminiData;
      
      // Convert Gemini data to our internal format
      const impactData = {
        energyMt: geminiData.impactEnergy,
        energyJoules: geminiData.energyJoules,
        craterDiameter: geminiData.craterDiameter * 1000, // Convert km to meters for display consistency
        mass: geminiData.impactMass,
        radii: {
          severe: geminiData.damageRadii.severe,
          moderate: geminiData.damageRadii.moderate,
          light: geminiData.damageRadii.light
        }
      };

      // Calculate earthquake effects using Gemini data
      const earthquakeEffects = calculateEarthquakeEffects(
        data.location,
        geminiData.impactEnergy,
        2000
      );

      // Calculate affected cities using Gemini damage radii
      const citiesInDamageZone = findAffectedCities(
        data.location.lat,
        data.location.lng,
        geminiData.damageRadii
      );
      setAffectedCities(citiesInDamageZone);

      // Set additional effects from Gemini data
      setAdditionalEffects({
        airblastRadius: geminiData.airblastRadius,
        tsunamiRadius: geminiData.tsunamiRisk ? geminiData.thermalRadius * 2 : 0,
        seismicRadius: geminiData.debrisField
      });

      // Determine magnitude and description based on Gemini energy data
      let magnitude = '';
      let description = '';
      
      if (geminiData.impactEnergy < 1) {
        magnitude = 'Minor';
        description = 'Local damage, similar to a small building collapse';
      } else if (geminiData.impactEnergy < 100) {
        magnitude = 'Moderate';
        description = 'City-wide destruction, similar to the Hiroshima bomb';
      } else if (geminiData.impactEnergy < 10000) {
        magnitude = 'Major';
        description = 'Regional devastation, affects entire metropolitan areas';
      } else if (geminiData.impactEnergy < 1000000) {
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

    } catch (error) {
      console.error('Failed to parse simulation data:', error);
      router.push('/simulation');
      return;
    }
  }, [router]);

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
              className="bg-zinc-950 border-zinc-700 text-white hover:bg-zinc-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              New Simulation
            </Button>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleShareResults}
                variant="outline"
                className="bg-zinc-950 border-zinc-700 text-white hover:bg-zinc-900"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Results
              </Button>
            </div>
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-gradient font-orbitron">
              Impact Analysis Results
            </h1>
            <div className="flex items-center justify-center gap-4 text-lg text-zinc-400">
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
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mb-8"
        >
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white text-2xl font-orbitron">
            
                Impact Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const storedData = localStorage.getItem('impactSimulationData');
                const geminiData = storedData ? JSON.parse(storedData).geminiData : null;
                
                if (!geminiData) return <p className="text-zinc-400">No enhanced data available</p>;
                
                return (
                  <div className="space-y-6">
                    {/* Core Impact Metrics - Priority Data */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center bg-zinc-900 p-4 rounded-lg border border-zinc-700">
                        <div className="text-2xl font-bold text-white font-orbitron">
                          {getAveragedEnergy(geminiData.impactEnergy, simulationData).toFixed(1)} MT
                        </div>
                        <div className="text-sm text-zinc-400">Energy Produced</div>
                        
                      </div>
                      <div className="text-center bg-zinc-900 p-4 rounded-lg border border-zinc-700">
                        <div className="text-2xl font-bold text-white font-orbitron">
                          {(() => {
                            const averagedEnergy = getAveragedEnergy(geminiData.impactEnergy, simulationData);
                            const averagedRadii = getAveragedDamageRadii(geminiData.damageRadii, averagedEnergy);
                            return averagedRadii.severe.toFixed(1);
                          })()} km
                        </div>
                        <div className="text-sm text-zinc-400">Destruction Radius</div>
                        
                      </div>
                      <div className="text-center bg-zinc-900 p-4 rounded-lg border border-zinc-700">
                        <div className="text-2xl font-bold text-white font-orbitron">
                          {(() => {
                            const averagedEnergy = getAveragedEnergy(geminiData.impactEnergy, simulationData);
                            return getAveragedCraterDiameter(geminiData.craterDiameter, averagedEnergy).toFixed(2);
                          })()} km
                        </div>
                        <div className="text-sm text-zinc-400">Crater Diameter</div>
                        
                      </div>
                      <div className="text-center bg-zinc-900 p-4 rounded-lg border border-zinc-700">
                        <div className="text-2xl font-bold text-white font-orbitron">
                          {affectedCities.length}
                        </div>
                        <div className="text-sm text-zinc-400">Cities Affected</div>
                        
                      </div>
                    </div>

                    {/* Precision Physical Data */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-center bg-zinc-900 p-4 rounded-lg border border-zinc-700">
                        <div className="text-xl font-bold text-white font-orbitron">
                          {getAveragedSurfaceVelocity(geminiData.impactVelocityAtSurface, simulationData).toFixed(1)} km/s
                        </div>
                        <div className="text-sm text-zinc-400">Surface Velocity</div>
                        
                      </div>
                      <div className="text-center bg-zinc-900 p-4 rounded-lg border border-zinc-700">
                        <div className="text-xl font-bold text-white font-orbitron">
                          {geminiData.thermalRadius?.toFixed(1) || 'N/A'} km
                        </div>
                        <div className="text-sm text-zinc-400">Thermal Radius</div>
                        
                      </div>
                    </div>


                  </div>
                );
              })()
            }
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
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white font-orbitron">
                <Target className="w-5 h-5 text-white" />
                Damage Zone Classifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex items-start gap-3 p-3 bg-zinc-900 rounded-lg border border-zinc-700">
                  <div className="w-4 h-4 bg-white rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold text-sm font-orbitron">Severe Destruction</span>
                    <p className="text-zinc-300 text-xs mt-1">Radius: {(() => {
                      const storedData = localStorage.getItem('impactSimulationData');
                      const geminiData = storedData ? JSON.parse(storedData).geminiData : null;
                      const averagedEnergy = getAveragedEnergy(geminiData?.impactEnergy, simulationData);
                      const averagedRadii = getAveragedDamageRadii(geminiData?.damageRadii, averagedEnergy);
                      return averagedRadii.severe.toFixed(1);
                    })()} km</p>
                    <p className="text-zinc-400 text-xs mt-1">Complete devastation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-zinc-900 rounded-lg border border-zinc-700">
                  <div className="w-4 h-4 bg-zinc-400 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold text-sm font-orbitron">Major Damage</span>
                    <p className="text-zinc-300 text-xs mt-1">Radius: {(() => {
                      const storedData = localStorage.getItem('impactSimulationData');
                      const geminiData = storedData ? JSON.parse(storedData).geminiData : null;
                      const averagedEnergy = getAveragedEnergy(geminiData?.impactEnergy, simulationData);
                      const averagedRadii = getAveragedDamageRadii(geminiData?.damageRadii, averagedEnergy);
                      return averagedRadii.moderate.toFixed(1);
                    })()} km</p>
                    <p className="text-zinc-400 text-xs mt-1">Structural damage</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-zinc-900 rounded-lg border border-zinc-700">
                  <div className="w-4 h-4 bg-zinc-600 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold text-sm font-orbitron">Evacuation Zone</span>
                    <p className="text-zinc-300 text-xs mt-1">Radius: {(() => {
                      const storedData = localStorage.getItem('impactSimulationData');
                      const geminiData = storedData ? JSON.parse(storedData).geminiData : null;
                      const averagedEnergy = getAveragedEnergy(geminiData?.impactEnergy, simulationData);
                      const averagedRadii = getAveragedDamageRadii(geminiData?.damageRadii, averagedEnergy);
                      return averagedRadii.light.toFixed(1);
                    })()} km</p>
                    <p className="text-zinc-400 text-xs mt-1">Light damage</p>
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
            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white font-orbitron">
                  <Map className="w-5 h-5 text-white" />
                  Damage Zone Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DamageZoneMap 
                  location={simulationData.location}
                  damageRadii={(() => {
                    const storedData = localStorage.getItem('impactSimulationData');
                    const geminiData = storedData ? JSON.parse(storedData).geminiData : null;
                    const averagedEnergy = getAveragedEnergy(geminiData?.impactEnergy, simulationData);
                    return getAveragedDamageRadii(geminiData?.damageRadii, averagedEnergy);
                  })()}
                  additionalEffects={additionalEffects || undefined}
                  className="h-96"
                />
                <div className="mt-3 text-xs text-zinc-400 text-center">
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
            averagedEnergyMt={(() => {
              const storedData = localStorage.getItem('impactSimulationData');
              const geminiData = storedData ? JSON.parse(storedData).geminiData : null;
              return getAveragedEnergy(geminiData?.impactEnergy, simulationData);
            })()}
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
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white font-orbitron">
                
                Technical Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-2 font-orbitron">Asteroid Properties</h4>
                  <div className="space-y-1 text-sm text-zinc-300">
                    <div>Name: {simulationData.asteroid.name}</div>
                    <div>Diameter: {simulationData.asteroid.diameter.toFixed(3)} km</div>
                    <div>Velocity: {simulationData.parameters.velocity} km/s</div>
                    <div>Hazardous: {simulationData.asteroid.hazardous ? 'Yes' : 'No'}</div>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2 font-orbitron">Impact Parameters</h4>
                  <div className="space-y-1 text-sm text-zinc-300">
                    <div>Angle: {simulationData.parameters.angle}°</div>
                    <div>Mass: {results.mass.toExponential(2)} kg</div>
                    <div>Energy: {results.energyJoules.toExponential(2)} J</div>
                    <div>Location: {simulationData.location.lat.toFixed(4)}, {simulationData.location.lng.toFixed(4)}</div>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2 font-orbitron">Environmental Impact</h4>
                  <div className="space-y-1 text-sm text-zinc-300">
                    <div>Crater Depth: {(results.craterDiameter / 3000).toFixed(2)} km</div>
                    <div>Seismic Events: {results.earthquakeEffects.length}</div>
                    <div>Max Earthquake: {results.earthquakeEffects[0]?.magnitude.toFixed(1) || '0.0'} M</div>
                    <div>Affected Region: {(() => {
                      const storedData = localStorage.getItem('impactSimulationData');
                      const geminiData = storedData ? JSON.parse(storedData).geminiData : null;
                      const averagedEnergy = getAveragedEnergy(geminiData?.impactEnergy, simulationData);
                      const averagedRadii = getAveragedDamageRadii(geminiData?.damageRadii, averagedEnergy);
                      return Math.max(averagedRadii.severe, averagedRadii.moderate, averagedRadii.light).toFixed(0);
                    })()} km radius</div>
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
        <h2 className="text-2xl font-bold text-white mb-2 font-orbitron">Loading Impact Results</h2>
        <p className="text-zinc-300">Analyzing simulation parameters...</p>
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