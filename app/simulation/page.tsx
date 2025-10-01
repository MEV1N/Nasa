"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AsteroidList } from "@/components/AsteroidList";
import { ImpactSimulator } from "@/components/ImpactSimulator";
import { CraterVisualization } from "@/components/CraterVisualization";
import { Asteroid } from "@/lib/nasa-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Rocket, Target, Mountain, AlertTriangle } from "lucide-react";
import Link from "next/link";

type SimulationStep = 'select' | 'simulate' | 'results';

export default function SimulationPage() {
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null);
  const [simulationStep, setSimulationStep] = useState<SimulationStep>('select');
  const [simulationResults, setSimulationResults] = useState<{
    energy: number;
    craterDiameter: number;
    magnitude: string;
  } | null>(null);

  const handleAsteroidSelect = (asteroid: Asteroid) => {
    setSelectedAsteroid(asteroid);
    setSimulationStep('simulate');
  };

  const handleSimulationComplete = (results: { energy: number; craterDiameter: number; magnitude: string }) => {
    setSimulationResults(results);
    setSimulationStep('results');
  };

  const resetSimulation = () => {
    setSelectedAsteroid(null);
    setSimulationResults(null);
    setSimulationStep('select');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Button variant="outline" className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            
            {selectedAsteroid && (
              <Button 
                onClick={resetSimulation}
                variant="outline" 
                className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              >
                New Simulation
              </Button>
            )}
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Asteroid Impact Simulator
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Select an asteroid from NASA&apos;s database, configure impact parameters, and visualize the devastating consequences
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                simulationStep === 'select' ? 'bg-blue-600' : 
                (simulationStep === 'simulate' || simulationStep === 'results') ? 'bg-green-600' : 'bg-slate-700'
              }`}>
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">Select Asteroid</span>
              </div>
              
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                simulationStep === 'simulate' ? 'bg-blue-600' : 
                simulationStep === 'results' ? 'bg-green-600' : 'bg-slate-700'
              }`}>
                <Rocket className="w-4 h-4" />
                <span className="text-sm font-medium">Configure Impact</span>
              </div>
              
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                simulationStep === 'results' ? 'bg-blue-600' : 'bg-slate-700'
              }`}>
                <Mountain className="w-4 h-4" />
                <span className="text-sm font-medium">View Results</span>
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

          {simulationStep === 'simulate' && selectedAsteroid && (
            <motion.div
              key="simulate"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Selected Asteroid Info */}
              <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <Target className="w-6 h-6 text-blue-400" />
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
                      <span className="text-slate-400">Name:</span>
                      <div className="text-white font-semibold text-lg">
                        {selectedAsteroid.name.replace(/[()]/g, '')}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Diameter:</span>
                      <div className="text-white font-semibold">
                        {selectedAsteroid.estimated_diameter?.kilometers
                          ? `${((selectedAsteroid.estimated_diameter.kilometers.estimated_diameter_min + 
                               selectedAsteroid.estimated_diameter.kilometers.estimated_diameter_max) / 2).toFixed(2)} km`
                          : 'Unknown'}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Velocity:</span>
                      <div className="text-white font-semibold">
                        {selectedAsteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour
                          ? `${Math.round(parseFloat(selectedAsteroid.close_approach_data[0].relative_velocity.kilometers_per_hour)).toLocaleString()} km/h`
                          : 'Unknown'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Impact Simulator */}
              <ImpactSimulator asteroid={selectedAsteroid} />
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
              <Card className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border-red-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
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
                      <div className="text-sm text-slate-400">Megatons TNT</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">
                        {simulationResults.craterDiameter.toFixed(1)}
                      </div>
                      <div className="text-sm text-slate-400">km Crater Diameter</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">
                        {selectedAsteroid.name.replace(/[()]/g, '').substring(0, 15)}...
                      </div>
                      <div className="text-sm text-slate-400">Impacting Asteroid</div>
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
