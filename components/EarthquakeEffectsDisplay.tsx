'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, MapPin, Users, Skull } from 'lucide-react';
import { EarthquakeEffect, getEarthquakeSummary } from '@/utils/earthquakeEffects';

interface EarthquakeEffectsDisplayProps {
  effects: EarthquakeEffect[];
  className?: string;
}

export function EarthquakeEffectsDisplay({ effects, className }: EarthquakeEffectsDisplayProps) {
  const summary = getEarthquakeSummary(effects);

  const getDamageColor = (damage: EarthquakeEffect['damage']) => {
    switch (damage) {
      case 'catastrophic': return 'text-red-500 bg-red-900/20';
      case 'severe': return 'text-red-400 bg-red-800/20';
      case 'moderate': return 'text-orange-400 bg-orange-800/20';
      case 'light': return 'text-yellow-400 bg-yellow-800/20';
      default: return 'text-gray-400 bg-gray-800/20';
    }
  };

  const getDamageIcon = (damage: EarthquakeEffect['damage']) => {
    switch (damage) {
      case 'catastrophic':
      case 'severe':
        return <Skull className="w-3 h-3" />;
      case 'moderate':
        return <AlertTriangle className="w-3 h-3" />;
      default:
        return <MapPin className="w-3 h-3" />;
    }
  };

  if (effects.length === 0) {
    return (
      <Card className={`bg-slate-800/50 border-slate-700 ${className}`}>
        <CardContent className="p-4">
          <p className="text-slate-400 text-center">No significant earthquake effects detected in major population centers.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-slate-800/50 border-slate-700 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          Secondary Earthquake Effects
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-700/50 p-2 rounded text-center">
            <div className="text-white font-bold">{effects.length}</div>
            <div className="text-slate-300">Cities Affected</div>
          </div>
          <div className="bg-red-900/30 p-2 rounded text-center">
            <div className="text-red-400 font-bold">{summary.severelyCritical}</div>
            <div className="text-slate-300">Critical Zones</div>
          </div>
          <div className="bg-orange-900/30 p-2 rounded text-center">
            <div className="text-orange-400 font-bold">{(summary.totalAffected / 1000000).toFixed(1)}M</div>
            <div className="text-slate-300">People Affected</div>
          </div>
          <div className="bg-slate-900/50 p-2 rounded text-center">
            <div className="text-yellow-400 font-bold">{(summary.estimatedCasualties / 1000).toFixed(0)}K</div>
            <div className="text-slate-300">Est. Casualties</div>
          </div>
        </div>

        {/* Affected Cities List */}
        <div className="max-h-48 overflow-y-auto space-y-2">
          <h4 className="text-sm font-medium text-white sticky top-0 bg-slate-800 py-1">
            Most Affected Cities:
          </h4>
          {effects.slice(0, 12).map((effect, index) => (
            <div 
              key={`${effect.city.name}-${effect.city.country}`}
              className={`flex items-center justify-between p-2 rounded text-xs ${getDamageColor(effect.damage)}`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {getDamageIcon(effect.damage)}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {effect.city.name}, {effect.city.country}
                  </div>
                  <div className="text-xs opacity-75 truncate">
                    {effect.distance.toFixed(0)} km away • {effect.intensity}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">
                  {effect.magnitude.toFixed(1)} M
                </div>
                <div className="text-xs opacity-75">
                  {(effect.city.population / 1000000).toFixed(1)}M pop
                </div>
              </div>
            </div>
          ))}
          
          {effects.length > 12 && (
            <div className="text-center text-slate-400 text-xs py-2">
              ... and {effects.length - 12} more cities affected
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="destructive" className="text-xs">
            <Skull className="w-3 h-3 mr-1" />
            Severe/Catastrophic
          </Badge>
          <Badge variant="secondary" className="text-xs bg-orange-800/20 text-orange-400">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Moderate
          </Badge>
          <Badge variant="outline" className="text-xs">
            <MapPin className="w-3 h-3 mr-1" />
            Light Effects
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}