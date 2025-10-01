'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AsteroidCard } from './AsteroidCard';
import { Asteroid, fetchAsteroids, AsteroidResponse } from '@/lib/nasa-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, AlertCircle, Rocket } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AsteroidListProps {
  onAsteroidSelect?: (asteroid: Asteroid) => void;
}

export function AsteroidList({ onAsteroidSelect }: AsteroidListProps) {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAsteroids, setFilteredAsteroids] = useState<Asteroid[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const lastAsteroidElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMoreAsteroids();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const loadAsteroids = async (pageNum: number = 0, reset: boolean = false) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response: AsteroidResponse = await fetchAsteroids(pageNum, 20);
      
      // Check if this is mock data
      if ((response as any)._isMockData) {
        setError('Using demo data due to NASA API limitations. Get your free API key at https://api.nasa.gov/ for real-time data.');
      }
      
      if (reset) {
        setAsteroids(response.near_earth_objects);
      } else {
        setAsteroids(prev => [...prev, ...response.near_earth_objects]);
      }
      
      // Check if there are more pages
      setHasMore(pageNum < response.page.total_pages - 1);
      setPage(pageNum);
      
    } catch (err) {
      let errorMessage = 'Failed to load asteroids';
      
      if (err instanceof Error) {
        if (err.message.includes('RATE_LIMITED') || err.message.includes('429')) {
          errorMessage = 'NASA API rate limit exceeded. Please get your own API key from https://api.nasa.gov/ and replace DEMO_KEY in .env.local';
        } else if (err.message.includes('INVALID_KEY') || err.message.includes('403')) {
          errorMessage = 'Invalid NASA API key. Please check your .env.local file';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      console.error('Error loading asteroids:', err);
    } finally {
      setLoading(false);
      if (initialLoad) setInitialLoad(false);
    }
  };

  const loadMoreAsteroids = () => {
    if (!loading && hasMore) {
      loadAsteroids(page + 1, false);
    }
  };

  const handleSearch = useCallback(() => {
    if (!searchTerm.trim()) {
      setFilteredAsteroids(asteroids);
      return;
    }

    const filtered = asteroids.filter(asteroid =>
      asteroid.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asteroid.id.includes(searchTerm)
    );
    setFilteredAsteroids(filtered);
  }, [asteroids, searchTerm]);

  const handleRefresh = () => {
    setAsteroids([]);
    setFilteredAsteroids([]);
    setPage(0);
    setHasMore(true);
    setSearchTerm('');
    loadAsteroids(0, true);
  };

  // Initial load
  useEffect(() => {
    loadAsteroids(0, true);
  }, []);

  // Update filtered asteroids when asteroids or search term changes
  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const displayAsteroids = searchTerm ? filteredAsteroids : asteroids;

  if (initialLoad && loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Rocket className="w-12 h-12 text-blue-500" />
        </motion.div>
        <p className="text-lg text-neutral-400">Loading asteroids from NASA...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h2 
          className="text-3xl font-bold text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Near-Earth Asteroids
        </motion.h2>
        <motion.p 
          className="text-neutral-400 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Explore real asteroids from NASA&apos;s database. Click on any asteroid to simulate its potential impact.
        </motion.p>
      </div>

      {/* Search and Controls */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-4 items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <Input
            placeholder="Search asteroids by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card border-border text-white placeholder-neutral-400"
          />
        </div>
        <Button 
          onClick={handleRefresh}
          variant="outline"
          className="bg-card border-border text-white hover:bg-white/5"
        >
          Refresh Data
        </Button>
      </motion.div>

      {/* Error/Warning Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Alert variant={error.includes('demo data') || error.includes('API key') ? 'default' : 'destructive'}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Asteroid Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <AnimatePresence>
          {displayAsteroids.map((asteroid, index) => (
            <motion.div
              key={asteroid.id}
              ref={index === displayAsteroids.length - 1 ? lastAsteroidElementRef : undefined}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AsteroidCard
                asteroid={asteroid}
                index={index}
                onSelect={onAsteroidSelect}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Loading More Indicator */}
      <AnimatePresence>
        {loading && !initialLoad && (
          <motion.div
            className="flex items-center justify-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
            <span className="text-slate-400">Loading more asteroids...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No More Data */}
      {!hasMore && asteroids.length > 0 && (
        <motion.div
          className="text-center py-8 text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>You&apos;ve reached the end of the asteroid database!</p>
          <p className="text-sm mt-2">Total asteroids loaded: {asteroids.length}</p>
        </motion.div>
      )}

      {/* No Results */}
      {searchTerm && filteredAsteroids.length === 0 && !loading && (
        <motion.div
          className="text-center py-12 text-slate-400"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Search className="w-12 h-12 mx-auto mb-4 text-slate-500" />
          <p className="text-lg">No asteroids found matching &quot;{searchTerm}&quot;</p>
          <p className="text-sm mt-2">Try a different search term or clear the search to see all asteroids.</p>
        </motion.div>
      )}
    </div>
  );
}