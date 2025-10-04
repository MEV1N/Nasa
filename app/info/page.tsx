"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TriangleAlert as AlertTriangle, Database, Globe, BookOpen, Shield, Zap } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-black py-16">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h1 className="text-5xl font-bold mb-4 font-orbitron text-center text-gradient">
            INFORMATION CENTER
          </h1>
          <p className="text-center text-neutral-400 text-lg">
            Learn about asteroid threats, impact physics, and how this simulator works
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-orbitron text-white glow-on-hover">
                <AlertTriangle className="h-6 w-6 glow-icon-hover" />
                Understanding Asteroid Threats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-neutral-300">
              <p>
                Asteroids are rocky remnants from the early solar system, most orbiting between Mars and Jupiter.
                However, some asteroids have orbits that bring them close to Earth, making them Near-Earth Objects (NEOs).
              </p>
              <p>
                A <strong className="text-white">Potentially Hazardous Asteroid (PHA)</strong> is defined as an asteroid
                larger than approximately 140 meters that comes within 0.05 AU (7.5 million kilometers) of Earth&apos;s orbit.
                While most PHAs will never actually hit Earth, they warrant careful monitoring.
              </p>
              <div className="bg-card p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-white mb-2">Historical Impact Events:</h4>
                <ul className="space-y-2 list-disc list-inside text-sm">
                  <li><strong>Chicxulub Impact (66 million years ago):</strong> 10-15 km asteroid that caused the extinction of dinosaurs</li>
                  <li><strong>Tunguska Event (1908):</strong> ~50-meter object flattened 2,000 km² of Siberian forest</li>
                  <li><strong>Chelyabinsk Meteor (2013):</strong> 20-meter meteor airburst injured over 1,500 people</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-orbitron text-white glow-on-hover">
                <Zap className="h-6 w-6 glow-icon-hover" />
                Impact Physics & Calculations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-neutral-300">
              <p>
                When an asteroid strikes Earth, it releases tremendous kinetic energy. This simulator uses
                physics-based calculations to estimate the consequences:
              </p>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="energy" className="border-border">
                  <AccordionTrigger className="text-white glow-on-hover">
                    Impact Energy Calculation
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-300">
                    <p className="mb-2">
                      The kinetic energy is calculated using: <strong>E = ½mv²</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Mass (m) = Volume × Density</li>
                      <li>Volume = (4/3)πr³ for spherical asteroids</li>
                      <li>Typical asteroid density: 2,000-3,500 kg/m³</li>
                      <li>Velocity ranges from 11 km/s to 70 km/s</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="crater" className="border-border">
                  <AccordionTrigger className="text-white glow-on-hover">
                    Crater Size Estimation
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-300">
                    <p className="mb-2">
                      Crater dimensions depend on impact energy and angle:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Crater radius ≈ E^0.25 × scaling factor</li>
                      <li>Crater depth ≈ radius / 3</li>
                      <li>Impact angle affects crater shape and ejecta pattern</li>
                      <li>Most impacts occur at 45° angle statistically</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="effects" className="border-border">
                  <AccordionTrigger className="text-white glow-on-hover">
                    Environmental Effects
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-300">
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>Small impacts (&lt;1 megaton):</strong> Localized destruction, minimal global effects</li>
                      <li><strong>Medium impacts (1-100 megatons):</strong> Regional devastation, temporary climate effects</li>
                      <li><strong>Large impacts (100-10,000 megatons):</strong> Continental damage, years of climate disruption</li>
                      <li><strong>Catastrophic impacts (&gt;10,000 megatons):</strong> Mass extinction event, nuclear winter scenario</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-orbitron text-white glow-on-hover">
                <Database className="h-6 w-6 glow-icon-hover" />
                Data Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-neutral-300">
              <div className="space-y-3">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2 glow-on-hover">
                    <Globe className="h-4 w-4 text-white glow-icon-hover" />
                    NASA Near-Earth Object API
                  </h4>
                  <p className="text-sm">
                    Real-time data on asteroids tracked by NASA&apos;s Center for Near-Earth Object Studies (CNEOS).
                    Includes orbital parameters, size estimates, close approach dates, and hazard classifications.
                  </p>
                  <a
                    href="https://api.nasa.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-sm mt-2 inline-block glow-on-hover"
                  >
                    api.nasa.gov →
                  </a>
                </div>

                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2 glow-on-hover">
                    <BookOpen className="h-4 w-4 text-white glow-icon-hover" />
                    Impact Simulation Models
                  </h4>
                  <p className="text-sm">
                    Physics calculations based on research from planetary science and impact cratering studies.
                    Models simplified for educational purposes while maintaining scientific accuracy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-orbitron text-white glow-on-hover">
                <Shield className="h-6 w-6 glow-icon-hover" />
                Planetary Defense
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-neutral-300">
              <p>
                Earth is constantly monitored for potential asteroid threats. NASA and international partners
                track thousands of NEOs and develop deflection strategies:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-semibold text-white mb-2">Detection Systems</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Ground-based telescopes</li>
                    <li>Space-based infrared surveys</li>
                    <li>Radar tracking systems</li>
                  </ul>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-semibold text-white mb-2">Deflection Methods</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Kinetic impactor (DART mission)</li>
                    <li>Gravity tractor</li>
                    <li>Nuclear deflection (last resort)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-orbitron text-white glow-on-hover">
                <BookOpen className="h-6 w-6 glow-icon-hover" />
                How to Use This Simulator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-neutral-300">
              <ol className="list-decimal list-inside space-y-3">
                <li className="text-white">
                  <strong>Browse the Database:</strong>
                  <p className="ml-6 mt-1 text-neutral-300 text-sm">
                    Explore real NASA-tracked asteroids with detailed information about size, velocity, and close approaches.
                  </p>
                </li>
                <li className="text-white">
                  <strong>Run a Simulation:</strong>
                  <p className="ml-6 mt-1 text-neutral-300 text-sm">
                    Select an asteroid, click on the map to choose an impact location, and adjust parameters like velocity,
                    angle, and density to see how they affect the outcome.
                  </p>
                </li>
                <li className="text-white">
                  <strong>Analyze Results:</strong>
                  <p className="ml-6 mt-1 text-neutral-300 text-sm">
                    Review impact energy, crater dimensions, affected area, and environmental consequences. The crater
                    radius will be displayed on the map to visualize the scale of destruction.
                  </p>
                </li>
              </ol>

              <div className="bg-card border border-border p-4 rounded-lg mt-4">
                <p className="text-sm text-neutral-200">
                  <strong>Note:</strong> This simulator uses the NASA DEMO_KEY for API access. For production use,
                  obtain a free API key at api.nasa.gov and replace the placeholder in the codebase.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
