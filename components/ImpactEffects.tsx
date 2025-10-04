import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Waves, 
  Wind, 
  Thermometer, 
  Zap, 
  Globe, 
  AlertTriangle,
  Calculator,
  TrendingDown
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ImpactEffectsProps {
  impactLat: number;
  impactLng: number;
  asteroidDiameter?: number; // in km
  impactVelocity?: number; // in km/s
  impactAngle?: number; // in degrees
  averagedEnergyMt?: number; // Pre-calculated averaged energy in MT
  className?: string;
}

interface EffectsData {
  tsunamiHeight: number; // meters
  airblastRadius: number; // km
  temperatureDrop: number; // degrees C
  seismicMagnitude: number; // Richter scale
  debrisThickness: number; // cm globally
  impactWinter: number; // duration in months
  energyMegatons: number; // MT TNT equivalent
}

function ImpactEffects({ 
  impactLat, 
  impactLng, 
  asteroidDiameter = 5, 
  impactVelocity = 20,
  impactAngle = 45,
  averagedEnergyMt,
  className 
}: ImpactEffectsProps) {
  const [effects, setEffects] = useState<EffectsData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate kinetic energy in Joules
  const calculateKineticEnergy = () => {
    const radius = (asteroidDiameter * 1000) / 2; // convert km to meters, then to radius
    const volume = (4/3) * Math.PI * Math.pow(radius, 3); // m³
    const density = 3000; // kg/m³ (rocky asteroid)
    const mass = density * volume; // kg
    const velocityMs = impactVelocity * 1000; // convert km/s to m/s
    
    return 0.5 * mass * Math.pow(velocityMs, 2); // Joules
  };

  // Enhanced effects calculation based on scientific models
  const calculateEffects = () => {
    setIsCalculating(true);
    
    // Use averaged energy if provided, otherwise calculate kinetic energy
    const energy = averagedEnergyMt ? averagedEnergyMt * 4.184e15 : calculateKineticEnergy(); // Convert MT back to Joules if needed
    const energyMt = averagedEnergyMt || (energy / (4.184e15)); // Use provided energy or convert calculated energy
    
    // Normalized energy for scaling (reference: 1e20 J = ~24 MT)
    const energyScale = energy / 1e20;
    
    // Tsunami height calculation (Collins et al. 2005)
    // H = 0.1 * (E/1e20)^(1/3) km for deep water impact
    const isOceanImpact = true; // Simplified - in real app, check if coordinates are over ocean
    let tsunamiHeight = 0;
    if (isOceanImpact) {
      tsunamiHeight = 0.1 * Math.pow(energyScale, 1/3) * 1000; // convert km to meters
      // Apply angle correction (oblique impacts reduce tsunami efficiency)
      const angleEffect = Math.sin(impactAngle * Math.PI / 180);
      tsunamiHeight *= Math.pow(angleEffect, 0.5);
    }

    // Airblast radius (Toon et al. 1997)
    // R = 50 * (E/1e20)^(1/3) km for 1 bar overpressure
    const airblastRadius = 50 * Math.pow(energyScale, 1/3);

    // Seismic magnitude (Schultz & Gault 1975)
    // M = 0.67 * log10(E) - 5.87 (where E is in Joules)
    const seismicMagnitude = 0.67 * Math.log10(energy) - 5.87;

    // Global temperature drop (Toon et al. 1997)
    // Simplified model based on dust injection
    const temperatureDrop = Math.min(10, 2 * Math.pow(energyScale, 1/4));

    // Global debris thickness (Alvarez et al. 1980)
    // Simplified: thickness ~ (diameter/10km)^3 cm
    const debrisThickness = Math.pow(asteroidDiameter / 10, 3);

    // Impact winter duration (Toon et al. 1997)
    // Duration scales with energy and debris production
    let impactWinter = 0;
    if (asteroidDiameter > 1) {
      impactWinter = Math.min(24, 6 * Math.pow(energyScale, 1/5));
    }

    setEffects({
      tsunamiHeight: Math.round(tsunamiHeight),
      airblastRadius: Math.round(airblastRadius * 10) / 10,
      temperatureDrop: Math.round(temperatureDrop * 10) / 10,
      seismicMagnitude: Math.round(seismicMagnitude * 10) / 10,
      debrisThickness: Math.round(debrisThickness * 100) / 100,
      impactWinter: Math.round(impactWinter),
      energyMegatons: Math.round(energyMt)
    });

    setIsCalculating(false);
  };

  // Auto-calculate when props change
  useEffect(() => {
    calculateEffects();
  }, [asteroidDiameter, impactVelocity, impactAngle, impactLat, impactLng]);

  const getSeverityColor = (value: number, thresholds: number[]) => {
    if (value >= thresholds[2]) return "text-red-400 bg-red-900/20";
    if (value >= thresholds[1]) return "text-orange-400 bg-orange-900/20";
    if (value >= thresholds[0]) return "text-yellow-400 bg-yellow-900/20";
    return "text-green-400 bg-green-900/20";
  };

  const getImpactClass = () => {
    if (!effects) return "Minor";
    if (effects.energyMegatons < 1) return "Local";
    if (effects.energyMegatons < 100) return "Regional";
    if (effects.energyMegatons < 10000) return "Continental";
    if (effects.energyMegatons < 1000000) return "Global";
    return "Extinction Event";
  };

  return (
    <Card className={`bg-card border-border ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Globe className="w-5 h-5 text-purple-400" />
          Global Impact Effects Analysis
          <Badge variant="outline" className="ml-2">
            {getImpactClass()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Impact Parameters Summary */}
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-slate-300 mb-3">Impact Parameters</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Diameter:</span>
              <div className="text-white font-medium">{asteroidDiameter} km</div>
            </div>
            <div>
              <span className="text-slate-400">Velocity:</span>
              <div className="text-white font-medium">{impactVelocity} km/s</div>
            </div>
            <div>
              <span className="text-slate-400">Angle:</span>
              <div className="text-white font-medium">{impactAngle}°</div>
            </div>
            <div>
              <span className="text-slate-400">Energy:</span>
              <div className="text-white font-medium">
                {effects ? `${effects.energyMegatons.toLocaleString()} MT` : 'Calculating...'}
              </div>
              {averagedEnergyMt && (
                <div className="text-xs text-green-400 mt-1"></div>
              )}
            </div>
          </div>
        </div>

    

        {effects && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Primary Effects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tsunami Effects */}
              <div className={`p-4 rounded-lg border ${getSeverityColor(effects.tsunamiHeight, [10, 100, 500])}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Waves className="w-5 h-5" />
                  <span className="font-semibold">Tsunami Height</span>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {effects.tsunamiHeight > 0 ? `${effects.tsunamiHeight} meters` : 'N/A'}
                </div>
                <div className="text-xs opacity-80">
                  {effects.tsunamiHeight > 500 ? 'Catastrophic coastal devastation' :
                   effects.tsunamiHeight > 100 ? 'Severe coastal flooding' :
                   effects.tsunamiHeight > 10 ? 'Significant coastal damage' :
                   effects.tsunamiHeight > 0 ? 'Minor coastal effects' : 'Land impact - no tsunami'}
                </div>
              </div>

              {/* Airblast Radius */}
              <div className={`p-4 rounded-lg border ${getSeverityColor(effects.airblastRadius, [50, 200, 1000])}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="w-5 h-5" />
                  <span className="font-semibold">Airblast Radius</span>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {effects.airblastRadius} km
                </div>
                <div className="text-xs opacity-80">
                  Destructive shockwave zone (1 bar overpressure)
                </div>
              </div>

              {/* Temperature Drop */}
              <div className={`p-4 rounded-lg border ${getSeverityColor(effects.temperatureDrop, [1, 3, 8])}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="w-5 h-5" />
                  <span className="font-semibold">Global Cooling</span>
                </div>
                <div className="text-2xl font-bold mb-1">
                  -{effects.temperatureDrop}°C
                </div>
                <div className="text-xs opacity-80">
                  {effects.temperatureDrop > 8 ? 'Mass extinction level' :
                   effects.temperatureDrop > 3 ? 'Severe climate disruption' :
                   effects.temperatureDrop > 1 ? 'Agricultural impact' : 'Minimal climate effect'}
                </div>
              </div>

              {/* Seismic Magnitude */}
              <div className={`p-4 rounded-lg border ${getSeverityColor(effects.seismicMagnitude, [6, 8, 10])}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5" />
                  <span className="font-semibold">Seismic Impact</span>
                </div>
                <div className="text-2xl font-bold mb-1">
                  M {effects.seismicMagnitude}
                </div>
                <div className="text-xs opacity-80">
                  Equivalent earthquake magnitude
                </div>
              </div>
            </div>

            {/* Secondary Effects */}
            {effects.impactWinter > 0 && (
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Long-term Effects
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Impact Winter Duration:</span>
                    <div className="text-orange-300 font-medium">
                      {effects.impactWinter} months
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Global Debris Layer:</span>
                    <div className="text-yellow-300 font-medium">
                      {effects.debrisThickness} cm
                    </div>
                  </div>
                </div>
                {effects.impactWinter > 12 && (
                  <div className="mt-3 p-3 bg-red-900/20 border border-red-800 rounded text-red-300 text-xs">
                    <AlertTriangle className="w-4 h-4 inline mr-2" />
                    Extended impact winter may cause mass extinction event
                  </div>
                )}
              </div>
            )}

            {/* Impact Classification */}
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-4 rounded-lg border border-purple-800/50">
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-300 mb-2">
                  Impact Classification: {getImpactClass()}
                </div>
                <div className="text-sm text-slate-300">
                  {getImpactClass() === 'Extinction Event' ? 'This impact would cause a mass extinction event similar to the Chicxulub asteroid that killed the dinosaurs.' :
                   getImpactClass() === 'Global' ? 'This impact would have severe global consequences affecting all life on Earth.' :
                   getImpactClass() === 'Continental' ? 'This impact would devastate an entire continent and affect global climate.' :
                   getImpactClass() === 'Regional' ? 'This impact would cause regional devastation and significant environmental effects.' :
                   getImpactClass() === 'Local' ? 'This impact would cause local to city-wide destruction.' :
                   'This impact would cause minimal localized damage.'}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

export default ImpactEffects;