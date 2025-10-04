"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  AlertTriangle, 
  Loader2, 
  MapPin, 
  Zap,
  TrendingUp,
  Globe,
  Users
} from "lucide-react";

interface ImpactAnalysisProps {
  asteroid: {
    name: string;
    diameter: number; // in km
    velocity: number; // in km/s
    hazardous: boolean;
  };
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  impactData: {
    energyMt: number;
    craterDiameter: number;
    radii: {
      severe: number;
      moderate: number;
      light: number;
    };
    summary?: {
      totalPopulation: number;
      totalFatalities: number;
      totalInjuries: number;
      affectedArea: number;
    };
  };
}

export default function ImpactAnalysis({ 
  asteroid, 
  location, 
  impactData 
}: ImpactAnalysisProps) {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    setAnalysis("");

    try {
      const res = await fetch("/api/asteroid-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          asteroid: {
            ...asteroid,
            diameter: asteroid.diameter * 1000 // Convert km to meters for API
          }, 
          location, 
          impactData 
        })
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setAnalysis(data.analysis || "No analysis received");
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err instanceof Error ? err.message : "Failed to analyze impact");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <Brain className="w-6 h-6 text-purple-400" />
            AI Impact Analysis
            <Badge variant="outline" className="text-purple-300 border-purple-400">
              GPT-4 Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Analysis Parameters Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Asteroid Data
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Name:</span>
                  <span className="text-white">{asteroid.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Diameter:</span>
                  <span className="text-white">{asteroid.diameter} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Velocity:</span>
                  <span className="text-white">{asteroid.velocity} km/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Classification:</span>
                  <Badge 
                    variant={asteroid.hazardous ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {asteroid.hazardous ? "Hazardous" : "Non-Hazardous"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-300 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Impact Location
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-white">{location.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Latitude:</span>
                  <span className="text-white">{location.lat.toFixed(3)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Longitude:</span>
                  <span className="text-white">{location.lng.toFixed(3)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Impact Energy:</span>
                  <span className="text-white">{impactData.energyMt.toFixed(1)} MT</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Impact Summary */}
          {impactData.summary && (
            <div className="bg-red-900/20 p-4 rounded-lg border border-red-800/50">
              <h4 className="text-sm font-semibold text-red-300 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Impact Overview
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-slate-400">Affected Area</div>
                  <div className="text-white font-medium">
                    {impactData.summary.affectedArea.toLocaleString()} km²
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-slate-400">Population at Risk</div>
                  <div className="text-white font-medium">
                    {impactData.summary.totalPopulation.toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-slate-400">Crater Diameter</div>
                  <div className="text-white font-medium">
                    {impactData.craterDiameter.toFixed(1)} km
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-slate-400">Severe Damage</div>
                  <div className="text-white font-medium">
                    {impactData.radii.severe.toFixed(1)} km radius
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Button */}
          <Button
            onClick={handleAnalyze}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Impact with AI...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Generate Comprehensive AI Analysis
              </>
            )}
          </Button>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-900/20 border border-red-800/50 p-4 rounded-lg"
            >
              <div className="flex items-center gap-2 text-red-300 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-semibold">Analysis Error</span>
              </div>
              <p className="text-red-200 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-900/70 border border-slate-700 rounded-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-4 border-b border-slate-700">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  Comprehensive Impact Analysis
                </h4>
                <p className="text-slate-300 text-sm mt-1">
                  AI-powered scientific assessment of impact consequences
                </p>
              </div>
              
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="prose prose-invert prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-slate-200 text-sm leading-relaxed font-mono bg-slate-800/50 p-4 rounded border border-slate-600">
                    {analysis}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}