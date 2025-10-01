"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Rocket, Globe, Target, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 font-orbitron text-gradient">
            ASTEROID IMPACT SIMULATOR
          </h1>
          <p className="text-xl md:text-2xl text-neutral-200 max-w-3xl mx-auto mb-8 leading-relaxed">
            Explore near-Earth objects, simulate asteroid impacts anywhere on Earth,
            and visualize the catastrophic consequences of cosmic collisions.
          </p>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto mb-12">
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
                className="text-xl px-12 py-8 bg-white text-black hover:bg-neutral-200 font-orbitron border-0 hover-lift"
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
        </motion.div>

        
          
      
      </div>
    </div>
  );
}
