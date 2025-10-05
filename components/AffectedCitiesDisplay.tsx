'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { AffectedCity } from '@/utils/citiesDatabase';

interface AffectedCitiesDisplayProps {
  affectedCities: AffectedCity[];
  className?: string;
}

export function AffectedCitiesDisplay({ affectedCities, className }: AffectedCitiesDisplayProps) {
  if (affectedCities.length === 0) {
    return (
      <Card className={`bg-card border-border ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white font-orbitron">
        
            Affected Cities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            
            <p className="text-slate-300 text-lg">No major cities within damage zones</p>
            <p className="text-slate-400 text-sm mt-2">
              The impact location is in a remote area with minimal urban population exposure
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const severeCities = affectedCities.filter(city => city.damageLevel === 'severe');
  const moderateCities = affectedCities.filter(city => city.damageLevel === 'moderate');
  const lightCities = affectedCities.filter(city => city.damageLevel === 'light');

  const totalCasualties = affectedCities.reduce((sum, city) => sum + city.estimatedCasualties, 0);
  const totalPopulation = affectedCities.reduce((sum, city) => sum + city.population, 0);

  const getDamageColor = (level: string) => {
    switch (level) {
      case 'severe': return 'text-red-400 bg-red-900/20 border-red-800';
      case 'moderate': return 'text-orange-400 bg-orange-900/20 border-orange-800';
      case 'light': return 'text-yellow-400 bg-yellow-900/20 border-yellow-800';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-800';
    }
  };

  const getDamageIcon = (level: string) => {
    switch (level) {
      
      case 'moderate': return <AlertTriangle className="w-4 h-4" />;
      case 'light': return <AlertTriangle className="w-4 h-4" />;
      
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  return (
    <Card className={`bg-card border-border ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white font-orbitron">
          
          Affected Cities Analysis
          <Badge variant="outline" className="ml-2">
            {affectedCities.length} Cities
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Statistics */}
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white font-orbitron">
                {formatNumber(totalCasualties)}
              </div>
              <div className="text-xs text-slate-400">Est. Casualties</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-orbitron">
                {formatNumber(totalPopulation)}
              </div>
              <div className="text-xs text-slate-400">Total Population</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-orbitron">
                {((1 - totalCasualties / totalPopulation) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-slate-400">Survival Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-orbitron">
                {affectedCities.length}
              </div>
              <div className="text-xs text-slate-400">Cities Affected</div>
            </div>
          </div>
        </div>

        {/* Damage Level Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {severeCities.length > 0 && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3">
              <h4 className="text-white font-semibold text-sm mb-2 flex items-center gap-2 font-orbitron">
            
                Severe Destruction ({severeCities.length})
              </h4>
              <div className="text-xs text-zinc-300">
                80% casualty rate expected
              </div>
            </div>
          )}
          
          {moderateCities.length > 0 && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3">
              <h4 className="text-white font-semibold text-sm mb-2 flex items-center gap-2 font-orbitron">
                <AlertTriangle className="w-4 h-4" />
                Major Damage ({moderateCities.length})
              </h4>
              <div className="text-xs text-zinc-300">
                30% casualty rate expected
              </div>
            </div>
          )}
          
          {lightCities.length > 0 && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3">
              <h4 className="text-white font-semibold text-sm mb-2 flex items-center gap-2 font-orbitron">
                <AlertTriangle className="w-4 h-4" />
                Light Damage ({lightCities.length})
              </h4>
              <div className="text-xs text-zinc-300">
                5% casualty rate expected
              </div>
            </div>
          )}
        </div>

        {/* Cities List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {affectedCities.map((city, index) => (
            <div
              key={`${city.name}-${city.country}`}
              className="p-3 rounded-lg border border-zinc-800 bg-zinc-950"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getDamageIcon(city.damageLevel)}
                  <span className="font-semibold text-white">
                    {city.name}, {city.country}
                  </span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      city.damageLevel === 'severe' ? 'text-red-400 border-red-700' :
                      city.damageLevel === 'moderate' ? 'text-yellow-400 border-yellow-700' :
                      'text-white border-zinc-700'
                    }`}
                  >
                    {city.damageLevel.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs text-slate-400">
                  {city.distance.toFixed(1)} km from impact
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400">Population:</span>
                  <div className="text-white font-medium">
                    {formatNumber(city.population)}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Est. Casualties:</span>
                  <div className="text-white font-medium">
                    {formatNumber(city.estimatedCasualties)}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Survival Rate:</span>
                  <div className="text-white font-medium">
                    {(city.survivalRate * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Survivors:</span>
                  <div className="text-white font-medium">
                    {formatNumber(city.population - city.estimatedCasualties)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {affectedCities.length > 10 && (
          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-700">
            Showing top {affectedCities.length} affected cities by proximity and damage severity
          </div>
        )}
      </CardContent>
    </Card>
  );
}