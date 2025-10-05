"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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
          <p className="text-xl md:text-2xl text-gradient-subtle max-w-4xl mx-auto mb-12 leading-relaxed">
            Explore near-Earth objects, simulate asteroid impacts anywhere on Earth,
            and visualize the catastrophic consequences of cosmic collisions.
          </p>
          <p className="text-base text-gradient-accent max-w-3xl mx-auto mb-16 leading-relaxed">
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
                START SIMULATION
              </Button>
            </Link>
          </motion.div>
        </motion.div>

       
      </div>
    </div>
  );
}
