"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { AsteroidList } from "@/components/AsteroidList";
import { ImpactSimulator } from "@/components/ImpactSimulator";
import { CraterVisualization } from "@/components/CraterVisualization";
import { Asteroid } from "@/lib/nasa-api";

// Dynamically import InteractiveGlobe with SSR disabled
const InteractiveGlobe = dynamic(() => import("@/components/InteractiveGlobe"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-neutral-900 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white">Loading Interactive Globe...</p>
      </div>
    </div>
  ),
});
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Rocket, Target, Mountain, AlertTriangle, Globe } from "lucide-react";
import Link from "next/link";

type SimulationStep = 'select' | 'location' | 'simulate' | 'results';

export default function SimulationPage() {
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);
  const [simulationStep, setSimulationStep] = useState<SimulationStep>('select');
  const [simulationResults, setSimulationResults] = useState<{
    energy: number;
    craterDiameter: number;
    magnitude: string;
  } | null>(null);

  const handleAsteroidSelect = (asteroid: Asteroid) => {
    setSelectedAsteroid(asteroid);
    setSimulationStep('location');
  };

  const handleLocationSelect = (lat: number, lng: number, locationName: string) => {
    setSelectedLocation({ lat, lng, name: locationName });
    setSimulationStep('simulate');
  };

  const handleSimulationComplete = (results: { energy: number; craterDiameter: number; magnitude: string }) => {
    setSimulationResults(results);
    setSimulationStep('results');
  };

  const resetSimulation = () => {
    setSelectedAsteroid(null);
    setSelectedLocation(null);
    setSimulationResults(null);
    setSimulationStep('select');
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-12">
            <Link href="/">
              <Button variant="outline" className="bg-card border-border text-white hover:bg-white/5 px-6 py-3">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            
            {selectedAsteroid && (
              <Button 
                onClick={resetSimulation}
                variant="outline" 
                className="bg-card border-border text-white hover:bg-white/5 px-6 py-3"
              >
                New Simulation
              </Button>
            )}
          </div>

          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">
              Asteroid Impact Simulator
            </h1>
            <p className="text-lg text-neutral-400 max-w-4xl mx-auto leading-relaxed">
              Select an asteroid from NASA&apos;s database, configure impact parameters, and visualize the devastating consequences
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-6">
              <div className={`flex items-center space-x-3 px-6 py-3 rounded-full transition-all ${
                simulationStep === 'select' ? 'bg-white text-black shadow-lg' : 
                (simulationStep === 'location' || simulationStep === 'simulate' || simulationStep === 'results') ? 'bg-white/80 text-black' : 'bg-neutral-700/50 text-white/70'
              }`}>
                <Target className="w-4 h-4" />
                <span className="font-medium">Select Asteroid</span>
              </div>
              
              <div className="w-8 h-0.5 bg-neutral-600"></div>
              
              <div className={`flex items-center space-x-3 px-6 py-3 rounded-full transition-all ${
                simulationStep === 'location' ? 'bg-white text-black shadow-lg' : 
                (simulationStep === 'simulate' || simulationStep === 'results') ? 'bg-white/80 text-black' : 'bg-neutral-700/50 text-white/70'
              }`}>
                <Globe className="w-4 h-4" />
                <span className="font-medium">Choose Location</span>
              </div>
              
              <div className="w-8 h-0.5 bg-neutral-600"></div>
              
              <div className={`flex items-center space-x-3 px-6 py-3 rounded-full transition-all ${
                simulationStep === 'simulate' ? 'bg-white text-black shadow-lg' : 
                simulationStep === 'results' ? 'bg-white/80 text-black' : 'bg-neutral-700/50 text-white/70'
              }`}>
                <Rocket className="w-4 h-4" />
                <span className="font-medium">Configure Impact</span>
              </div>
              
              <div className="w-8 h-0.5 bg-neutral-600"></div>
              
              <div className={`flex items-center space-x-3 px-6 py-3 rounded-full transition-all ${
                simulationStep === 'results' ? 'bg-white text-black shadow-lg' : 'bg-neutral-700/50 text-white/70'
              }`}>
                <Mountain className="w-4 h-4" />
                <span className="font-medium">View Results</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {simulationStep === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              <AsteroidList onAsteroidSelect={handleAsteroidSelect} />
            </motion.div>
          )}

          {simulationStep === 'location' && selectedAsteroid && (
            <motion.div
              key="location"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Selected Asteroid Info */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <Target className="w-6 h-6 text-white" />
                    Selected Asteroid
                    {selectedAsteroid.is_potentially_hazardous_asteroid && (
                      <Badge variant="destructive" className="bg-red-600/90">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Hazardous
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-400">Name:</span>
                      <div className="text-white font-semibold text-lg">
                        {selectedAsteroid.name.replace(/[()]/g, '')}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-400">Diameter:</span>
                      <div className="text-white font-semibold">
                        {selectedAsteroid.estimated_diameter?.kilometers
                          ? `${((selectedAsteroid.estimated_diameter.kilometers.estimated_diameter_min + 
                               selectedAsteroid.estimated_diameter.kilometers.estimated_diameter_max) / 2).toFixed(2)} km`
                          : 'Unknown'}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-400">Velocity:</span>
                      <div className="text-white font-semibold">
                        {selectedAsteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour
                          ? `${Math.round(parseFloat(selectedAsteroid.close_approach_data[0].relative_velocity.kilometers_per_hour)).toLocaleString()} km/h`
                          : 'Unknown'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Back Button */}
              <div className="flex justify-start mb-4">
                <Button 
                  onClick={() => setSimulationStep('select')}
                  variant="outline"
                  className="bg-card border-border text-white hover:bg-white/5"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Choose Different Asteroid
                </Button>
              </div>

              {/* Interactive Globe for Location Selection */}
              <div className="w-full h-[600px]">
                <InteractiveGlobe 
                  className="w-full h-full"
                  onLocationSelect={handleLocationSelect}
                  selectedAsteroid={selectedAsteroid}
                />
              </div>
            </motion.div>
          )}

          {simulationStep === 'simulate' && selectedAsteroid && selectedLocation && (
            <motion.div
              key="simulate"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Selected Asteroid Info */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <Target className="w-6 h-6 text-white" />
                    Selected Asteroid
                    {selectedAsteroid.is_potentially_hazardous_asteroid && (
                      <Badge variant="destructive" className="bg-red-600/90">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Hazardous
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-400">Name:</span>
                      <div className="text-white font-semibold text-lg">
                        {selectedAsteroid.name.replace(/[()]/g, '')}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-400">Diameter:</span>
                      <div className="text-white font-semibold">
                        {selectedAsteroid.estimated_diameter?.kilometers
                          ? `${((selectedAsteroid.estimated_diameter.kilometers.estimated_diameter_min + 
                               selectedAsteroid.estimated_diameter.kilometers.estimated_diameter_max) / 2).toFixed(2)} km`
                          : 'Unknown'}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-400">Velocity:</span>
                      <div className="text-white font-semibold">
                        {selectedAsteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour
                          ? `${Math.round(parseFloat(selectedAsteroid.close_approach_data[0].relative_velocity.kilometers_per_hour)).toLocaleString()} km/h`
                          : 'Unknown'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Back Button */}
              <div className="flex justify-start mb-4">
                <Button 
                  onClick={() => setSimulationStep('location')}
                  variant="outline"
                  className="bg-card border-border text-white hover:bg-white/5"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Choose Different Location
                </Button>
              </div>

              {/* Impact Simulator */}
              <ImpactSimulator asteroid={selectedAsteroid} selectedLocation={selectedLocation} />
            </motion.div>
          )}

          {simulationStep === 'results' && selectedAsteroid && simulationResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Results Header */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <AlertTriangle className="w-6 h-6 text-white" />
                    Impact Analysis Results
                    <Badge variant="destructive">
                      {simulationResults.magnitude}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">
                        {simulationResults.energy.toLocaleString()}
                      </div>
                      <div className="text-sm text-neutral-400">Megatons TNT</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">
                        {simulationResults.craterDiameter.toFixed(1)}
                      </div>
                      <div className="text-sm text-neutral-400">km Crater Diameter</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">
                        {selectedAsteroid.name.replace(/[()]/g, '').substring(0, 15)}...
                      </div>
                      <div className="text-sm text-neutral-400">Impacting Asteroid</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Crater Visualization */}
              <CraterVisualization 
                craterDiameter={simulationResults.craterDiameter}
                impactEnergy={simulationResults.energy}
                targetType="land"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
