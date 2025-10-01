"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Asteroid, fetchAsteroids } from "@/lib/nasa-api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, TriangleAlert as AlertTriangle, Calendar, Gauge, Ruler } from "lucide-react";

export default function DatabasePage() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadAsteroids = async () => {
      const data = await fetchAsteroids();
      setAsteroids(data.near_earth_objects);
      setLoading(false);
    };
    loadAsteroids();
  }, []);

  const filteredAsteroids = asteroids.filter((asteroid) =>
    asteroid.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold mb-4 font-orbitron text-center text-gradient">
            ASTEROID DATABASE
          </h1>
          <p className="text-center text-neutral-400 mb-8">
            Explore near-Earth asteroids tracked by NASA
          </p>

          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search asteroids by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-card border-border text-white placeholder:text-neutral-500 h-14 text-lg"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-white">{asteroids.length}</p>
                <p className="text-sm text-neutral-400 mt-2">Total Asteroids</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-white">
                  {asteroids.filter((a) => a.is_potentially_hazardous_asteroid).length}
                </p>
                <p className="text-sm text-neutral-400 mt-2">Potentially Hazardous</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-white">
                  {asteroids.filter((a) => !a.is_potentially_hazardous_asteroid).length}
                </p>
                <p className="text-sm text-neutral-400 mt-2">Non-Hazardous</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-card border-border">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 bg-gray-700" />
                  <Skeleton className="h-4 w-1/2 bg-gray-700 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 bg-gray-700" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredAsteroids.map((asteroid, index) => (
              <motion.div
                key={asteroid.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="bg-gray-900/80 border-gray-800 hover:border-blue-500 transition-all duration-300 h-full hover:shadow-lg hover:shadow-blue-500/10">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg font-orbitron text-blue-300 leading-tight pr-2">
                        {asteroid.name}
                      </CardTitle>
                      {asteroid.is_potentially_hazardous_asteroid && (
                        <Badge variant="destructive" className="text-xs shrink-0">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          PHA
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Ruler className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-400">Estimated Diameter</p>
                          <p className="text-sm text-white font-semibold">
                            {asteroid.estimated_diameter.kilometers.estimated_diameter_min.toFixed(3)} -{" "}
                            {asteroid.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3)} km
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Gauge className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-400">Absolute Magnitude</p>
                          <p className="text-sm text-white font-semibold">
                            {asteroid.absolute_magnitude_h.toFixed(2)} H
                          </p>
                        </div>
                      </div>

                      {asteroid.close_approach_data && asteroid.close_approach_data.length > 0 && (
                        <>
                          <div className="flex items-start gap-3">
                            <Calendar className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs text-gray-400">Next Close Approach</p>
                              <p className="text-sm text-white font-semibold">
                                {asteroid.close_approach_data[0].close_approach_date}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Gauge className="h-4 w-4 text-orange-400 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs text-gray-400">Relative Velocity</p>
                              <p className="text-sm text-white font-semibold">
                                {parseFloat(
                                  asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour
                                ).toLocaleString()}{" "}
                                km/h
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Ruler className="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs text-gray-400">Miss Distance</p>
                              <p className="text-sm text-white font-semibold">
                                {parseFloat(
                                  asteroid.close_approach_data[0].miss_distance.kilometers
                                ).toLocaleString()}{" "}
                                km
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <a
                      href={asteroid.nasa_jpl_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs text-blue-400 hover:text-blue-300 transition-colors mt-4"
                    >
                      View on NASA JPL →
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filteredAsteroids.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-gray-400 text-lg">No asteroids found matching your search.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
