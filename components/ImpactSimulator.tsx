'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Asteroid, calculateImpactEnergy } from '@/lib/nasa-api';
import { Calculator, Target, Zap, Mountain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ImpactSimulatorProps {
  asteroid?: Asteroid;
}

export function ImpactSimulator({ asteroid }: ImpactSimulatorProps) {
  const [impactAngle, setImpactAngle] = useState(45);
  const [impactVelocity, setImpactVelocity] = useState(
    asteroid?.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour 
      ? Math.round(parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour) / 3600) // Convert to km/s
      : 20
  );
  const [targetType, setTargetType] = useState('land');
  const [results, setResults] = useState<{
    energy: number;
    craterDiameter: number;
    magnitude: string;
    description: string;
  } | null>(null);

  const getDiameter = () => {
    if (!asteroid?.estimated_diameter?.kilometers) return 1;
    const { estimated_diameter_min, estimated_diameter_max } = asteroid.estimated_diameter.kilometers;
    return (estimated_diameter_min + estimated_diameter_max) / 2;
  };

  const runSimulation = () => {
    const diameter = getDiameter();
    const velocity = impactVelocity;
    
    // Calculate impact energy (in megatons of TNT)
    const energy = calculateImpactEnergy(diameter, velocity);
    
    // Estimate crater diameter (simplified formula)
    const craterDiameter = Math.pow(energy, 0.25) * diameter * 20;
    
    // Determine magnitude and description
    let magnitude = '';
    let description = '';
    
    if (energy < 1) {
      magnitude = 'Minor';
      description = 'Local damage, similar to a small building collapse';
    } else if (energy < 100) {
      magnitude = 'Moderate';
      description = 'City-wide destruction, similar to the Hiroshima bomb';
    } else if (energy < 10000) {
      magnitude = 'Major';
      description = 'Regional devastation, affects entire metropolitan areas';
    } else if (energy < 1000000) {
      magnitude = 'Catastrophic';
      description = 'Continental damage, climate effects for years';
    } else {
      magnitude = 'Extinction Level';
      description = 'Global catastrophe, mass extinction event';
    }
    
    setResults({
      energy,
      craterDiameter,
      magnitude,
      description
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calculator className="w-5 h-5 text-blue-400" />
              Impact Simulation
              {asteroid && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {asteroid.name.replace(/[()]/g, '')}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Asteroid Info */}
            {asteroid && (
              <div className="bg-slate-800/50 p-4 rounded-lg space-y-2">
                <h4 className="text-sm font-semibold text-slate-300">Asteroid Properties</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Diameter:</span>
                    <span className="text-white ml-2">{getDiameter().toFixed(2)} km</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Default Velocity:</span>
                    <span className="text-white ml-2">{impactVelocity} km/s</span>
                  </div>
                </div>
              </div>
            )}

            {/* Simulation Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="angle" className="text-slate-300">Impact Angle (degrees)</Label>
                <Input
                  id="angle"
                  type="number"
                  min="1"
                  max="90"
                  value={impactAngle}
                  onChange={(e) => setImpactAngle(Number(e.target.value))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="velocity" className="text-slate-300">Impact Velocity (km/s)</Label>
                <Input
                  id="velocity"
                  type="number"
                  min="1"
                  max="100"
                  value={impactVelocity}
                  onChange={(e) => setImpactVelocity(Number(e.target.value))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="target" className="text-slate-300">Target Type</Label>
                <Select value={targetType} onValueChange={setTargetType}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="land">Land</SelectItem>
                    <SelectItem value="ocean">Ocean</SelectItem>
                    <SelectItem value="urban">Urban Area</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={runSimulation} 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Target className="w-4 h-4 mr-2" />
              Run Impact Simulation
            </Button>

            {/* Results */}
            {results && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-red-900/30 to-orange-900/30 p-6 rounded-lg border border-red-800/50"
              >
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Impact Results
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="text-sm text-slate-300">
                      <span className="font-medium">Energy Released:</span>
                      <span className="text-white ml-2">
                        {results.energy.toLocaleString()} megatons TNT
                      </span>
                    </div>
                    <div className="text-sm text-slate-300">
                      <span className="font-medium">Crater Diameter:</span>
                      <span className="text-white ml-2">
                        {results.craterDiameter.toFixed(1)} km
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-slate-300">
                      <span className="font-medium">Impact Magnitude:</span>
                      <Badge 
                        variant={results.magnitude === 'Extinction Level' ? 'destructive' : 'secondary'}
                        className="ml-2"
                      >
                        {results.magnitude}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-slate-300 bg-slate-800/50 p-3 rounded">
                  <span className="font-medium">Impact Description:</span>
                  <p className="text-white mt-1">{results.description}</p>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}