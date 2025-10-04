// components/ComprehensiveImpactDisplay.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Zap, 
  Users, 
  Skull, 
  AlertTriangle, 
  Map,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import type { ComprehensiveImpactResult } from '@/app/api/simulate-impact/route';
import dynamic from 'next/dynamic';

// Dynamic import for map component
const DamageZoneMap = dynamic(() => import('@/components/DamageZoneMap').then(mod => ({ default: mod.DamageZoneMap })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-slate-800/50 rounded-lg flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>
  ),
});

interface ComprehensiveImpactDisplayProps {
  results: ComprehensiveImpactResult;
  className?: string;
}

export function ComprehensiveImpactDisplay({ results, className }: ComprehensiveImpactDisplayProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toLocaleString();
  };

  const getSeverityBadge = (fatalities: number) => {
    if (fatalities >= 1000000) {
      return <Badge variant="destructive" className="bg-red-600">Extinction Level</Badge>;
    } else if (fatalities >= 100000) {
      return <Badge variant="destructive" className="bg-red-500">Catastrophic</Badge>;
    } else if (fatalities >= 10000) {
      return <Badge variant="destructive" className="bg-orange-600">Severe</Badge>;
    } else if (fatalities >= 1000) {
      return <Badge variant="secondary" className="bg-yellow-600">Moderate</Badge>;
    } else if (fatalities > 0) {
      return <Badge variant="outline" className="border-blue-500">Limited</Badge>;
    }
    return <Badge variant="outline" className="border-green-500">Minimal</Badge>;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with severity assessment */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-800/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <Target className="w-6 h-6 text-red-400" />
                Impact Assessment Results
              </CardTitle>
              {getSeverityBadge(results.summary.totalFatalities)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {formatNumber(results.physicsResults.energyMt)} MT
                </div>
                <div className="text-slate-300 text-sm">TNT Equivalent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {results.physicsResults.craterDiameter.toFixed(1)} km
                </div>
                <div className="text-slate-300 text-sm">Crater Diameter</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {formatNumber(results.summary.totalPopulation)}
                </div>
                <div className="text-slate-300 text-sm">People Affected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {results.summary.affectedArea.toFixed(0)} km²
                </div>
                <div className="text-slate-300 text-sm">Affected Area</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed casualty breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Skull className="w-5 h-5 text-red-400" />
              Casualty Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-900/20 p-4 rounded-lg border border-red-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <Skull className="w-4 h-4 text-red-400" />
                  <span className="text-red-200 font-medium">Fatalities</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {formatNumber(results.summary.totalFatalities)}
                </div>
                <div className="text-slate-400 text-sm">
                  {results.summary.totalPopulation > 0 
                    ? `${((results.summary.totalFatalities / results.summary.totalPopulation) * 100).toFixed(1)}% of affected`
                    : 'No population affected'
                  }
                </div>
              </div>

              <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-200 font-medium">Injuries</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {formatNumber(results.summary.totalInjuries)}
                </div>
                <div className="text-slate-400 text-sm">
                  {results.summary.totalPopulation > 0 
                    ? `${((results.summary.totalInjuries / results.summary.totalPopulation) * 100).toFixed(1)}% of affected`
                    : 'No population affected'
                  }
                </div>
              </div>

              <div className="bg-green-900/20 p-4 rounded-lg border border-green-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-green-400" />
                  <span className="text-green-200 font-medium">Survivors</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {formatNumber(results.summary.totalSurvivors)}
                </div>
                <div className="text-slate-400 text-sm">
                  {results.summary.totalPopulation > 0 
                    ? `${((results.summary.totalSurvivors / results.summary.totalPopulation) * 100).toFixed(1)}% of affected`
                    : 'No population affected'
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Zone-by-zone breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Impact Zone Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.zoneResults.map((zone, index) => {
                const zoneColors = {
                  severe: { bg: 'bg-red-900/20', border: 'border-red-800/50', text: 'text-red-200' },
                  moderate: { bg: 'bg-orange-900/20', border: 'border-orange-800/50', text: 'text-orange-200' },
                  light: { bg: 'bg-yellow-900/20', border: 'border-yellow-800/50', text: 'text-yellow-200' }
                };
                const colors = zoneColors[zone.zone];

                return (
                  <div key={index} className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`font-semibold capitalize ${colors.text}`}>
                        {zone.zone} Damage Zone
                      </h4>
                      <Badge variant="outline" className={`${colors.text} border-current`}>
                        {zone.damageRadius.toFixed(1)} km radius
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <div className="text-slate-400">Population</div>
                        <div className="text-white font-bold">{formatNumber(zone.population)}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Fatalities</div>
                        <div className="text-white font-bold">{formatNumber(zone.fatalities)}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Injuries</div>
                        <div className="text-white font-bold">{formatNumber(zone.injuries)}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Survivors</div>
                        <div className="text-white font-bold">{formatNumber(zone.survivors)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Interactive map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Map className="w-5 h-5 text-blue-400" />
              Impact Zone Visualization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DamageZoneMap 
              location={{
                lat: results.impactLocation.lat,
                lng: results.impactLocation.lon,
                name: 'Impact Point'
              }}
              damageRadii={results.physicsResults.radii}
              className="h-96"
            />
            <div className="mt-3 text-xs text-slate-400 text-center">
              Interactive map showing precise impact zones and affected areas
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Technical details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Technical Parameters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-slate-400">Asteroid Diameter</div>
                <div className="text-white font-bold">{results.asteroidData.diameter} m</div>
              </div>
              <div>
                <div className="text-slate-400">Impact Velocity</div>
                <div className="text-white font-bold">{results.asteroidData.velocity} km/s</div>
              </div>
              <div>
                <div className="text-slate-400">Impact Angle</div>
                <div className="text-white font-bold">{results.asteroidData.angle}°</div>
              </div>
              <div>
                <div className="text-slate-400">Material Density</div>
                <div className="text-white font-bold">{results.asteroidData.density} kg/m³</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}