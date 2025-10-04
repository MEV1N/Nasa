"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Brain, 
  Code, 
  Loader2, 
  Copy,
  CheckCircle
} from "lucide-react";

export default function APIDemo() {
  const [asteroid, setAsteroid] = useState({
    name: "2023 BU",
    diameter: 5000, // meters
    velocity: 25, // km/s
    hazardous: true
  });
  
  const [location, setLocation] = useState({
    lat: 40.7128,
    lng: -74.0060,
    name: "New York City"
  });
  
  const [impactData, setImpactData] = useState({
    energyMt: 24.5,
    craterDiameter: 3.2,
    radii: {
      severe: 15.5,
      moderate: 35.8,
      light: 78.2
    }
  });

  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const sampleCode = `import { useState } from "react";

export default function ImpactAnalysis({ asteroid, location, impactData }) {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/asteroid-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asteroid, location, impactData })
      });

      const data = await res.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleAnalyze}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze Impact"}
      </button>

      {analysis && (
        <div className="mt-4 p-4 bg-gray-800 text-white rounded shadow">
          <pre>{analysis}</pre>
        </div>
      )}
    </div>
  );
}`;

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    setAnalysis("");

    try {
      const res = await fetch("/api/asteroid-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asteroid, location, impactData })
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

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(sampleCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Asteroid Analysis API Demo
          </h1>
          <p className="text-slate-300 text-lg">
            Test the AI-powered asteroid impact analysis API with sample data
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* API Parameters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  API Test Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Asteroid Parameters */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-300">Asteroid Data</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Name</Label>
                      <Input
                        value={asteroid.name}
                        onChange={(e) => setAsteroid({...asteroid, name: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Diameter (m)</Label>
                      <Input
                        type="number"
                        value={asteroid.diameter}
                        onChange={(e) => setAsteroid({...asteroid, diameter: Number(e.target.value)})}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Velocity (km/s)</Label>
                      <Input
                        type="number"
                        value={asteroid.velocity}
                        onChange={(e) => setAsteroid({...asteroid, velocity: Number(e.target.value)})}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Hazardous</Label>
                      <select
                        value={asteroid.hazardous.toString()}
                        onChange={(e) => setAsteroid({...asteroid, hazardous: e.target.value === 'true'})}
                        className="w-full bg-slate-700 border-slate-600 text-white rounded px-3 py-2"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Location Parameters */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-300">Location Data</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label className="text-slate-300">Location Name</Label>
                      <Input
                        value={location.name}
                        onChange={(e) => setLocation({...location, name: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">Latitude</Label>
                        <Input
                          type="number"
                          step="0.0001"
                          value={location.lat}
                          onChange={(e) => setLocation({...location, lat: Number(e.target.value)})}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Longitude</Label>
                        <Input
                          type="number"
                          step="0.0001"
                          value={location.lng}
                          onChange={(e) => setLocation({...location, lng: Number(e.target.value)})}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Impact Data Parameters */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-300">Impact Data</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Energy (MT)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={impactData.energyMt}
                        onChange={(e) => setImpactData({...impactData, energyMt: Number(e.target.value)})}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Crater Diameter (km)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={impactData.craterDiameter}
                        onChange={(e) => setImpactData({...impactData, craterDiameter: Number(e.target.value)})}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-300">Damage Radii (km)</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <Input
                        placeholder="Severe"
                        type="number"
                        step="0.1"
                        value={impactData.radii.severe}
                        onChange={(e) => setImpactData({
                          ...impactData, 
                          radii: {...impactData.radii, severe: Number(e.target.value)}
                        })}
                        className="bg-slate-700 border-slate-600 text-white text-sm"
                      />
                      <Input
                        placeholder="Moderate"
                        type="number"
                        step="0.1"
                        value={impactData.radii.moderate}
                        onChange={(e) => setImpactData({
                          ...impactData, 
                          radii: {...impactData.radii, moderate: Number(e.target.value)}
                        })}
                        className="bg-slate-700 border-slate-600 text-white text-sm"
                      />
                      <Input
                        placeholder="Light"
                        type="number"
                        step="0.1"
                        value={impactData.radii.light}
                        onChange={(e) => setImpactData({
                          ...impactData, 
                          radii: {...impactData.radii, light: Number(e.target.value)}
                        })}
                        className="bg-slate-700 border-slate-600 text-white text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Test Button */}
                <Button
                  onClick={handleAnalyze}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Test API Analysis
                    </>
                  )}
                </Button>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-900/20 border border-red-800/50 p-3 rounded text-red-200 text-sm">
                    <strong>Error:</strong> {error}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Code Example & Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Code Example */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-green-400" />
                    Sample Integration Code
                  </div>
                  <Button
                    onClick={copyCode}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900/70 p-4 rounded border border-slate-600 overflow-x-auto">
                  <pre className="text-sm text-slate-200 font-mono whitespace-pre-wrap">
                    {sampleCode}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* API Results */}
            {(analysis || loading) && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    API Response
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900/70 p-4 rounded border border-slate-600 max-h-96 overflow-y-auto">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                        <span className="ml-3 text-slate-300">Generating AI analysis...</span>
                      </div>
                    ) : (
                      <pre className="text-sm text-slate-200 font-mono whitespace-pre-wrap">
                        {analysis}
                      </pre>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}