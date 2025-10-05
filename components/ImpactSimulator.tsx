'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Asteroid, calculateImpactEnergy } from '@/lib/nasa-api';
import { AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';


interface ImpactSimulatorProps {
  asteroid?: Asteroid;
  selectedLocation?: {
    lat: number;
    lng: number;
    name: string;
  };
}

export function ImpactSimulator({ asteroid, selectedLocation }: ImpactSimulatorProps) {
  const router = useRouter();
  const [impactAngle, setImpactAngle] = useState(45);
  const [impactVelocity, setImpactVelocity] = useState(
    asteroid?.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour 
      ? Math.round(parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour) / 3600) // Convert to km/s
      : 20
  );
  const [isSimulating, setIsSimulating] = useState(false);

  const getDiameter = () => {
    if (!asteroid?.estimated_diameter?.kilometers) return 1;
    const { estimated_diameter_min, estimated_diameter_max } = asteroid.estimated_diameter.kilometers;
    return (estimated_diameter_min + estimated_diameter_max) / 2;
  };

  const runSimulation = async () => {
    if (!asteroid || !selectedLocation) {
      alert('Please select both an asteroid and impact location before running simulation.');
      return;
    }

    setIsSimulating(true);

    try {
      // Get impact data from Gemini AI
      const response = await fetch('/api/gemini-impact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          asteroidName: asteroid.name.replace(/[()]/g, ''),
          asteroidDiameter: getDiameter(),
          asteroidVelocity: impactVelocity,
          locationName: selectedLocation.name,
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          impactAngle: impactAngle,
          hazardous: asteroid.is_potentially_hazardous_asteroid,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to get impact data');
      }

      // Store the impact data in localStorage to pass to results page
      localStorage.setItem('impactSimulationData', JSON.stringify({
        asteroid: {
          name: asteroid.name.replace(/[()]/g, ''),
          diameter: getDiameter(),
          velocity: impactVelocity,
          hazardous: asteroid.is_potentially_hazardous_asteroid,
        },
        location: selectedLocation,
        parameters: {
          angle: impactAngle,
          velocity: impactVelocity,
        },
        geminiData: result.data,
        timestamp: result.timestamp,
      }));

      // Navigate to results page
      router.push('/results');
      
    } catch (error) {
      console.error('Simulation error:', error);
      alert(`Simulation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white font-orbitron">
              
              Impact Simulation
              {asteroid && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {asteroid.name.replace(/[()]/g, '')}
                </Badge>
              )}
              {selectedLocation && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {selectedLocation.name}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Asteroid Info */}
            {asteroid && (
              <div className="bg-zinc-900 p-4 rounded-lg space-y-2">
                <h4 className="text-sm font-semibold text-zinc-300 font-orbitron">Asteroid Properties</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-zinc-400">Diameter:</span>
                    <span className="text-white ml-2">{getDiameter().toFixed(2)} km</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Default Velocity:</span>
                    <span className="text-white ml-2">{impactVelocity} km/s</span>
                  </div>
                </div>
              </div>
            )}

            {/* Impact Location Info */}
            {selectedLocation && (
              <div className="bg-red-900/20 p-4 rounded-lg border border-red-800/50 space-y-2">
                <h4 className="text-sm font-semibold text-red-300 font-orbitron">Impact Target</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-zinc-400">Location:</span>
                    <span className="text-white ml-2">{selectedLocation.name}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Latitude:</span>
                    <span className="text-white ml-2">{selectedLocation.lat.toFixed(2)}°</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Longitude:</span>
                    <span className="text-white ml-2">{selectedLocation.lng.toFixed(2)}°</span>
                  </div>
                </div>
              </div>
            )}

            {/* Simulation Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="angle" className="text-zinc-300 font-orbitron">Impact Angle (degrees)</Label>
                <Input
                  id="angle"
                  type="number"
                  min="1"
                  max="90"
                  value={impactAngle}
                  onChange={(e) => setImpactAngle(Number(e.target.value))}
                  className="bg-zinc-800 border-zinc-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="velocity" className="text-zinc-300 font-orbitron">Impact Velocity (km/s)</Label>
                <Input
                  id="velocity"
                  type="number"
                  min="1"
                  max="100"
                  value={impactVelocity}
                  onChange={(e) => setImpactVelocity(Number(e.target.value))}
                  className="bg-zinc-800 border-zinc-600 text-white"
                />
              </div>
              
            </div>

            <Button 
              onClick={runSimulation} 
              className="w-full bg-white text-black border-2 border-zinc-300 hover:bg-zinc-50 hover:border-zinc-400"
            >
              Run Impact Simulation
            </Button>

            {/* Simulation Loading State */}
            {isSimulating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-zinc-950 p-6 rounded-lg border border-zinc-800"
              >
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <h4 className="text-lg font-bold text-white mb-2 font-orbitron">
                    Calculating Impact Effects...
                  </h4>
                  <p className="text-zinc-300">
                    Analyzing asteroid trajectory, impact dynamics, and secondary effects
                  </p>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}