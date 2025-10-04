// hooks/useImpactSimulation.ts
'use client';

import { useState } from 'react';
import type { ComprehensiveImpactResult, ImpactSimulationParams } from '@/app/api/simulate-impact/route';

export interface UseImpactSimulationResult {
  simulate: (params: ImpactSimulationParams) => Promise<ComprehensiveImpactResult | null>;
  loading: boolean;
  error: string | null;
  results: ComprehensiveImpactResult | null;
  reset: () => void;
}

export function useImpactSimulation(): UseImpactSimulationResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ComprehensiveImpactResult | null>(null);

  const simulate = async (params: ImpactSimulationParams): Promise<ComprehensiveImpactResult | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/simulate-impact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Simulation failed');
      }

      setResults(data.results);
      return data.results;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Impact simulation error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResults(null);
    setError(null);
    setLoading(false);
  };

  return {
    simulate,
    loading,
    error,
    results,
    reset
  };
}

// Helper function for quick simulations with default parameters
export async function quickSimulateImpact(
  lat: number,
  lon: number,
  diameter: number,
  velocity: number,
  options: Partial<Pick<ImpactSimulationParams, 'angle' | 'density' | 'material'>> = {}
): Promise<ComprehensiveImpactResult | null> {
  const params: ImpactSimulationParams = {
    lat,
    lon,
    diameter,
    velocity,
    angle: options.angle || 45,
    density: options.density || 3000,
    material: options.material || 'rocky'
  };

  try {
    const response = await fetch('/api/simulate-impact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.success ? data.results : null;
    
  } catch (error) {
    console.error('Quick simulation error:', error);
    return null;
  }
}