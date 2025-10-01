"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Rocket, Globe, Target, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 font-orbitron bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
            ASTEROID IMPACT SIMULATOR
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Explore near-Earth objects, simulate asteroid impacts anywhere on Earth,
            and visualize the catastrophic consequences of cosmic collisions.
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
            Powered by NASA&apos;s Near-Earth Object API, this simulator provides real asteroid data
            combined with physics-based impact calculations to help understand the threats from space.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link href="/simulation">
              <Button
                size="lg"
                className="text-xl px-12 py-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 font-orbitron"
              >
                <Rocket className="mr-2 h-6 w-6" />
                START SIMULATION
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
        >
          <Card className="bg-gray-900/50 border-gray-800 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-blue-400" />
              </div>
              <CardTitle className="text-2xl font-orbitron">Impact Simulation</CardTitle>
              <CardDescription className="text-gray-400">
                Choose any location on Earth and select from real NASA-tracked asteroids
                to simulate impact scenarios with accurate physics calculations.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 hover:border-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
            <CardHeader>
              <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-cyan-400" />
              </div>
              <CardTitle className="text-2xl font-orbitron">Asteroid Database</CardTitle>
              <CardDescription className="text-gray-400">
                Browse thousands of near-Earth asteroids with real-time data including
                size, velocity, close approach dates, and hazard classifications.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
            <CardHeader>
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
                <Info className="h-6 w-6 text-green-400" />
              </div>
              <CardTitle className="text-2xl font-orbitron">Learn & Understand</CardTitle>
              <CardDescription className="text-gray-400">
                Understand asteroid risks, impact physics, and what makes these space rocks
                potentially hazardous to life on Earth.
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="inline-block bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4 font-orbitron text-blue-400">Did You Know?</h3>
            <p className="text-gray-300 max-w-2xl">
              An asteroid just 1 kilometer in diameter hitting Earth would release energy equivalent
              to millions of nuclear bombs, causing global climate disruption and potential mass extinction.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
