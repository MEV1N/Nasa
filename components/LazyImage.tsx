'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({ 
  src, 
  alt, 
  className = '', 
  placeholderClassName = '',
  fill = false,
  width,
  height,
  priority = false,
  onLoad,
  onError
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority); // If priority, start loading immediately
  const [loadProgress, setLoadProgress] = useState(0);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return; // Skip intersection observer if priority loading
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start loading 50px before the image is visible
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Handle image load with progress simulation
  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
    setLoadProgress(100);
    onLoad?.();
  }, [onLoad]);

  const handleImageError = useCallback(() => {
    console.error(`Failed to load image: ${src}`);
    setHasError(true);
    onError?.();
  }, [onError, src]);

  // Simulate loading progress (for better UX)
  useEffect(() => {
    if (isInView && !isLoaded && !hasError) {
      const interval = setInterval(() => {
        setLoadProgress(prev => {
          if (prev >= 90) return prev; // Stop at 90%, complete on actual load
          return prev + Math.random() * 10;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isInView, isLoaded, hasError]);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        {/* Loading placeholder with progress */}
        {!isLoaded && !hasError && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-neutral-700 to-neutral-800 ${placeholderClassName}`}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mb-2"
            >

            </motion.div>
            
            {/* Progress bar */}
            <div className="w-16 h-1 bg-neutral-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${loadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            <span className="text-xs text-neutral-400 mt-1">
              {Math.round(loadProgress)}%
            </span>
          </motion.div>
        )}

        {/* Error fallback */}
        {hasError && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900 ${placeholderClassName}`}
          >
            <AlertCircle className="w-6 h-6 text-neutral-500 mb-1" />
            <span className="text-xs text-neutral-500">Failed to load</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual image - only load when in view */}
      {isInView && !hasError && (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          width={width}
          height={height}
          priority={priority}
          className={`transition-all duration-700 ease-out ${
            isLoaded 
              ? 'opacity-100 scale-100 blur-0' 
              : 'opacity-0 scale-105 blur-sm'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading={priority ? "eager" : "lazy"}
          unoptimized={true} // Allow external images
        />
      )}

      {/* Shimmer effect for loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
      )}
    </div>
  );
}