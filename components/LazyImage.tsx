'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  fill?: boolean;
  width?: number;
  height?: number;
}

export function LazyImage({ 
  src, 
  alt, 
  className = '', 
  placeholderClassName = '',
  fill = false,
  width,
  height 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div className={`absolute inset-0 flex items-center justify-center bg-slate-800 ${placeholderClassName}`}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <ImageIcon className="w-8 h-8 text-slate-500" />
          </motion.div>
        </div>
      )}

      {/* Error fallback */}
      {hasError && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 ${placeholderClassName}`}>
          <ImageIcon className="w-8 h-8 text-slate-500" />
        </div>
      )}

      {/* Actual image - only load when in view */}
      {isInView && !hasError && (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          width={width}
          height={height}
          className={`transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          loading="lazy"
        />
      )}
    </div>
  );
}