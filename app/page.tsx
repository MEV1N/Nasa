"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Rocket, Globe, Target, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-8 font-orbitron text-gradient">
            ASTEROID IMPACT SIMULATOR
          </h1>
          <p className="text-xl md:text-2xl text-neutral-200 max-w-4xl mx-auto mb-12 leading-relaxed">
            Explore near-Earth objects, simulate asteroid impacts anywhere on Earth,
            and visualize the catastrophic consequences of cosmic collisions.
          </p>
          <p className="text-base text-neutral-400 max-w-3xl mx-auto mb-16 leading-relaxed">
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
                className="text-xl px-16 py-6 bg-white text-black hover:bg-neutral-200 font-orbitron border-0 hover-lift shadow-2xl"
              >
                <Rocket className="mr-3 h-6 w-6" />
                START SIMULATION
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-32"
        >
          <Card className="bg-neutral-900/50 border-neutral-800 hover:border-neutral-700 transition-all duration-300 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-blue-400" />
              </div>
              <CardTitle className="text-white text-xl">Real NASA Data</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-neutral-400 leading-relaxed">
                Access live asteroid data from NASA's Near-Earth Object database with real-time tracking information.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900/50 border-neutral-800 hover:border-neutral-700 transition-all duration-300 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center">
                <Globe className="w-8 h-8 text-red-400" />
              </div>
              <CardTitle className="text-white text-xl">Global Impact Simulation</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-neutral-400 leading-relaxed">
                Simulate asteroid impacts anywhere on Earth with physics-based calculations and damage assessments.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900/50 border-neutral-800 hover:border-neutral-700 transition-all duration-300 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-6 bg-purple-500/10 rounded-full flex items-center justify-center">
                <Info className="w-8 h-8 text-purple-400" />
              </div>
              <CardTitle className="text-white text-xl">Educational Insights</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-neutral-400 leading-relaxed">
                Learn about asteroid threats, impact science, and planetary defense strategies through interactive visualization.
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
