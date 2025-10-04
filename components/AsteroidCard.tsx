'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Asteroid } from '@/lib/nasa-api';
import { AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface AsteroidCardProps {
  asteroid: Asteroid;
  index: number;
  onSelect?: (asteroid: Asteroid) => void;
}

export function AsteroidCard({ asteroid, index, onSelect }: AsteroidCardProps) {

  // Get the most recent close approach data
  const latestApproach = asteroid.close_approach_data?.[0];
  
  // Calculate average diameter
  const avgDiameter = asteroid.estimated_diameter?.kilometers
    ? (asteroid.estimated_diameter.kilometers.estimated_diameter_min + 
       asteroid.estimated_diameter.kilometers.estimated_diameter_max) / 2
    : 0;

  // Format velocity
  const velocity = latestApproach?.relative_velocity?.kilometers_per_hour
    ? Math.round(parseFloat(latestApproach.relative_velocity.kilometers_per_hour))
    : 0;

  // Format date
  const approachDate = latestApproach?.close_approach_date
    ? format(new Date(latestApproach.close_approach_date), 'MMM dd, yyyy')
    : 'N/A';

  const initialState = { 
    opacity: 0, 
    y: 50,
    scale: 0.9
  };
  
  const animateState = { 
    opacity: 1, 
    y: 0,
    scale: 1
  };
  
  const transition = {
    duration: 0.5,
    delay: index * 0.1
  };

  const hoverState = {
    scale: 1.05,
    y: -10
  };

  return (
    <motion.div
      initial={initialState}
      animate={animateState}
      transition={transition}
      whileHover={{
        ...hoverState,
        boxShadow: "0 0 30px rgba(255, 255, 255, 0.1)"
      }}
      className="cursor-pointer"
      onClick={() => onSelect?.(asteroid)}
    >
      <motion.div>
        <Card className="h-full card-hover bg-card border-border overflow-hidden relative min-h-[280px]">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-black/40" />

          {/* Hazardous asteroid indicator */}
          {asteroid.is_potentially_hazardous_asteroid && (
            <motion.div
              className="absolute top-2 right-2 z-10"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Badge variant="destructive" className="bg-red-600/90 hover:bg-red-600">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Hazardous
              </Badge>
            </motion.div>
          )}

          <CardHeader className="relative z-10 pb-2">
            <CardTitle className="text-white text-lg font-bold truncate">
              {asteroid.name.replace(/[()]/g, '')}
            </CardTitle>
            <div className="text-sm text-neutral-400">
              ID: {asteroid.id}
            </div>
          </CardHeader>

          <CardContent className="relative z-10 space-y-6">
            {/* Diameter */}
            <div className="flex items-center gap-2 text-neutral-300">
              <span className="text-sm">
                Diameter: <span className="font-semibold text-white">
                  {avgDiameter > 0 ? `${avgDiameter.toFixed(2)} km` : 'Unknown'}
                </span>
              </span>
            </div>

            {/* Velocity */}
            {velocity > 0 && (
              <div className="flex items-center gap-2 text-neutral-300">
                <span className="text-sm">
                  Velocity: <span className="font-semibold text-white">
                    {velocity.toLocaleString()} km/h
                  </span>
                </span>
              </div>
            )}

            {/* Closest approach date */}
            <div className="flex items-center gap-2 text-neutral-300">
              <span className="text-sm">
                Next approach: <span className="font-semibold text-white">
                  {approachDate}
                </span>
              </span>
            </div>

            {/* Magnitude */}
            <div className="text-xs text-neutral-400 mt-3">
              Absolute Magnitude: {asteroid.absolute_magnitude_h.toFixed(2)}
            </div>

            {/* Hover overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}