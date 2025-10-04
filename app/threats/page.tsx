'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Skull, 
  Zap, 
  Target,
  Calendar,
  Ruler,
  Gauge,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Asteroid } from '@/lib/nasa-api';
import Link from 'next/link';

interface DangerLevel {
  level: 'critical' | 'high' | 'moderate' | 'low';
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: any;
  description: string;
}

const DANGER_LEVELS: Record<string, DangerLevel> = {
  critical: {
    level: 'critical',
    label: 'Critical Threat',
    color: 'text-red-200',
    bgColor: 'bg-red-900/30',
    borderColor: 'border-red-600',
    icon: Skull,
    description: 'Extinction-level threat with catastrophic global impact potential'
  },
  high: {
    level: 'high', 
    label: 'High Threat',
    color: 'text-orange-200',
    bgColor: 'bg-orange-900/30',
    borderColor: 'border-orange-600',
    icon: AlertTriangle,
    description: 'Significant regional devastation with major casualties expected'
  },
  moderate: {
    level: 'moderate',
    label: 'Moderate Threat', 
    color: 'text-yellow-200',
    bgColor: 'bg-yellow-900/30',
    borderColor: 'border-yellow-600',
    icon: Zap,
    description: 'Local to regional damage with substantial infrastructure impact'
  },
  low: {
    level: 'low',
    label: 'Low Threat',
    color: 'text-blue-200', 
    bgColor: 'bg-blue-900/30',
    borderColor: 'border-blue-600',
    icon: Target,
    description: 'Minimal damage expected, primarily atmospheric effects'
  }
};

function classifyAsteroidDanger(asteroid: Asteroid): DangerLevel {
  const diameter = asteroid.estimated_diameter?.kilometers ? 
    (asteroid.estimated_diameter.kilometers.estimated_diameter_min + asteroid.estimated_diameter.kilometers.estimated_diameter_max) / 2 : 0;
  
  const velocity = asteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour ?
    parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour) / 3600 : 0; // Convert to km/s
  
  const distance = asteroid.close_approach_data?.[0]?.miss_distance?.kilometers ?
    parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers) : Infinity;
  
  const isHazardous = asteroid.is_potentially_hazardous_asteroid;
  
  // Critical: Large asteroids (>1km) or extremely hazardous conditions
  if (diameter > 1.0 || (diameter > 0.5 && velocity > 25 && isHazardous)) {
    return DANGER_LEVELS.critical;
  }
  
  // High: Medium-large asteroids (300m-1km) with concerning characteristics
  if (diameter > 0.3 || (diameter > 0.15 && velocity > 20 && isHazardous) || (diameter > 0.1 && distance < 1000000)) {
    return DANGER_LEVELS.high;
  }
  
  // Moderate: Smaller asteroids (50m-300m) with some risk factors
  if (diameter > 0.05 || (diameter > 0.02 && velocity > 15) || (isHazardous && diameter > 0.01)) {
    return DANGER_LEVELS.moderate;
  }
  
  // Low: Small asteroids with minimal impact potential
  return DANGER_LEVELS.low;
}

function AsteroidCard({ asteroid, dangerLevel }: { asteroid: Asteroid; dangerLevel: DangerLevel }) {
  const diameter = asteroid.estimated_diameter?.kilometers ? 
    (asteroid.estimated_diameter.kilometers.estimated_diameter_min + asteroid.estimated_diameter.kilometers.estimated_diameter_max) / 2 : 0;
  
  const velocity = asteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour ?
    Math.round(parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour) / 3600) : 0;
  
  const distance = asteroid.close_approach_data?.[0]?.miss_distance?.kilometers ?
    parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers) : 0;
  
  const approachDate = asteroid.close_approach_data?.[0]?.close_approach_date || 'Unknown';
  const Icon = dangerLevel.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`${dangerLevel.bgColor} border-2 ${dangerLevel.borderColor} hover:scale-105 transition-transform duration-200`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Icon className={`w-5 h-5 ${dangerLevel.color}`} />
              <Badge 
                variant="outline" 
                className={`${dangerLevel.color} ${dangerLevel.borderColor} border`}
              >
                {dangerLevel.label}
              </Badge>
            </div>
            {asteroid.is_potentially_hazardous_asteroid && (
              <Badge variant="destructive" className="bg-red-600">
                HAZARDOUS
              </Badge>
            )}
          </div>
          <CardTitle className="text-white text-lg font-semibold">
            {asteroid.name.replace(/[()]/g, '')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">
                {diameter > 0 ? `${(diameter * 1000).toFixed(0)}m` : 'Unknown'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">
                {velocity > 0 ? `${velocity} km/s` : 'Unknown'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">
                {distance > 0 ? `${(distance / 1000000).toFixed(2)}M km` : 'Unknown'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">
                {new Date(approachDate).getFullYear()}
              </span>
            </div>
          </div>
          
          <p className="text-slate-400 text-xs">
            {dangerLevel.description}
          </p>
          
          <Link href={`/simulation?asteroid=${encodeURIComponent(asteroid.name)}`}>
            <Button 
              className="w-full mt-3 bg-slate-700 hover:bg-slate-600 text-white"
              size="sm"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Simulate Impact
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ThreatsPage() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState(true);
  const [categorizedAsteroids, setCategorizedAsteroids] = useState<Record<string, Asteroid[]>>({
    critical: [],
    high: [],
    moderate: [],
    low: []
  });

  const fetchAsteroids = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/asteroids?page=0&size=100');
      if (response.ok) {
        const data = await response.json();
        
        // Handle both possible response formats
        const asteroidsArray = data.near_earth_objects || data.asteroids || [];
        setAsteroids(asteroidsArray);
        
        // Categorize asteroids by danger level
        const categorized: Record<string, Asteroid[]> = {
          critical: [],
          high: [],
          moderate: [],
          low: []
        };
        
        asteroidsArray.forEach((asteroid: Asteroid) => {
          const dangerLevel = classifyAsteroidDanger(asteroid);
          categorized[dangerLevel.level].push(asteroid);
        });
        
        setCategorizedAsteroids(categorized);
      } else {
        console.error('Failed to fetch asteroids:', response.status, response.statusText);
        const errorData = await response.json();
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Error fetching asteroids:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsteroids();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Analyzing Asteroid Threats</h2>
          <p className="text-slate-300">Classifying danger levels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-orbitron">
            Asteroid Threat Assessment
          </h1>
          <p className="text-xl text-slate-300 mb-6 max-w-3xl mx-auto">
            Real-time analysis of potentially hazardous asteroids classified by impact danger levels
          </p>
          <Button 
            onClick={fetchAsteroids}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {Object.entries(DANGER_LEVELS).map(([key, level]) => {
            const count = categorizedAsteroids[key]?.length || 0;
            const Icon = level.icon;
            return (
              <Card key={key} className={`${level.bgColor} border-2 ${level.borderColor}`}>
                <CardContent className="p-4 text-center">
                  <Icon className={`w-8 h-8 ${level.color} mx-auto mb-2`} />
                  <div className="text-2xl font-bold text-white">{count}</div>
                  <div className={`text-sm ${level.color}`}>{level.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Asteroid Categories */}
        {Object.entries(DANGER_LEVELS).map(([key, level], index) => {
          const asteroids = categorizedAsteroids[key] || [];
          if (asteroids.length === 0) return null;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <level.icon className={`w-6 h-6 ${level.color}`} />
                <h2 className="text-2xl font-bold text-white">{level.label}</h2>
                <Badge variant="outline" className={`${level.color} ${level.borderColor}`}>
                  {asteroids.length} asteroid{asteroids.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {asteroids.slice(0, 12).map((asteroid) => (
                  <AsteroidCard 
                    key={asteroid.id} 
                    asteroid={asteroid} 
                    dangerLevel={level}
                  />
                ))}
              </div>
              
              {asteroids.length > 12 && (
                <div className="text-center mt-6">
                  <p className="text-slate-400">
                    Showing 12 of {asteroids.length} {level.label.toLowerCase()} asteroids
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}