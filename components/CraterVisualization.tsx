'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';


interface CraterVisualizationProps {
  craterDiameter?: number;
  impactEnergy?: number;
  targetType?: string;
}

export function CraterVisualization({ 
  craterDiameter = 10, 
  impactEnergy = 100,
  targetType = 'land' 
}: CraterVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const drawCrater = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Save context for transformations
    ctx.save();
    
    // Apply zoom and rotation
    ctx.translate(centerX, centerY);
    ctx.scale(zoom, zoom);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.translate(-centerX, -centerY);

    // Draw background terrain
    drawTerrain(ctx, width, height, targetType);
    
    // Draw crater
    drawCraterShape(ctx, centerX, centerY, craterDiameter, impactEnergy);
    
    // Draw debris field
    drawDebrisField(ctx, centerX, centerY, craterDiameter * 1.5);
    
    // Restore context
    ctx.restore();

    // Draw scale reference
    drawScale(ctx, width, height, craterDiameter);
  };

  const drawTerrain = (ctx: CanvasRenderingContext2D, width: number, height: number, type: string) => {
    // Base terrain color
    let baseColor = '#8B7355'; // default land
    if (type === 'ocean') baseColor = '#1E40AF';
    if (type === 'urban') baseColor = '#6B7280';

    // Create gradient background
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
    gradient.addColorStop(0, baseColor);
    gradient.addColorStop(1, '#2D1810');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add terrain texture
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 3;
      ctx.fillRect(x, y, size, size);
    }
  };

  const drawCraterShape = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, diameter: number, energy: number) => {
    const radius = (diameter / 10) * 20; // Scale for visualization
    
    // Outer crater rim (raised edge)
    const rimGradient = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius * 1.2);
    rimGradient.addColorStop(0, 'rgba(139, 115, 85, 0.3)');
    rimGradient.addColorStop(0.5, 'rgba(180, 150, 120, 0.8)');
    rimGradient.addColorStop(1, 'rgba(139, 115, 85, 0.2)');
    
    ctx.fillStyle = rimGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.2, 0, 2 * Math.PI);
    ctx.fill();

    // Main crater bowl
    const craterGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    craterGradient.addColorStop(0, '#1A0F0A');
    craterGradient.addColorStop(0.3, '#2D1810');
    craterGradient.addColorStop(0.7, '#4A3728');
    craterGradient.addColorStop(1, '#8B7355');
    
    ctx.fillStyle = craterGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();

    // Central peak (for larger craters)
    if (diameter > 5) {
      const peakRadius = radius * 0.15;
      const peakGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, peakRadius);
      peakGradient.addColorStop(0, '#D4C4B0');
      peakGradient.addColorStop(1, '#8B7355');
      
      ctx.fillStyle = peakGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, peakRadius, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Add crater details (terracing)
    for (let i = 1; i <= 3; i++) {
      const terraceDadius = radius * (0.3 + i * 0.2);
      ctx.strokeStyle = `rgba(139, 115, 85, ${0.3 - i * 0.08})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, terraceDadius, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };

  const drawDebrisField = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, fieldRadius: number) => {
    // Draw ejecta rays
    ctx.strokeStyle = 'rgba(180, 150, 120, 0.4)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const startX = centerX + Math.cos(angle) * fieldRadius * 0.6;
      const startY = centerY + Math.sin(angle) * fieldRadius * 0.6;
      const endX = centerX + Math.cos(angle) * fieldRadius * 1.5;
      const endY = centerY + Math.sin(angle) * fieldRadius * 1.5;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }

    // Draw scattered debris
    ctx.fillStyle = 'rgba(139, 115, 85, 0.6)';
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = fieldRadius * 0.7 + Math.random() * fieldRadius * 0.8;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      const size = Math.random() * 4 + 1;
      
      ctx.fillRect(x, y, size, size);
    }
  };

  const drawScale = (ctx: CanvasRenderingContext2D, width: number, height: number, diameter: number) => {
    // Draw scale bar
    const scaleLength = 100;
    const scaleX = 20;
    const scaleY = height - 40;
    
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(scaleX, scaleY);
    ctx.lineTo(scaleX + scaleLength, scaleY);
    ctx.stroke();
    
    // Add scale markers
    ctx.moveTo(scaleX, scaleY - 5);
    ctx.lineTo(scaleX, scaleY + 5);
    ctx.moveTo(scaleX + scaleLength, scaleY - 5);
    ctx.lineTo(scaleX + scaleLength, scaleY + 5);
    ctx.stroke();
    
    // Scale text
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.fillText(`${Math.round(diameter * 0.1)} km`, scaleX + 10, scaleY + 20);
  };

  useEffect(() => {
    drawCrater();
  }, [craterDiameter, impactEnergy, targetType, zoom, rotation]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 45) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white font-orbitron">
            
            Crater Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Canvas */}
            <div className="relative bg-slate-800 rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="w-full max-w-md mx-auto block"
              />
              
              {/* Overlay info */}
              <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                Crater Diameter: {craterDiameter.toFixed(1)} km
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              >
                Zoom In
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              >
                Zoom Out
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRotate}
                className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              >
                Reset View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              >
                Reset
              </Button>
            </div>

            {/* Description */}
            <div className="text-sm text-slate-400 bg-slate-800/50 p-3 rounded">
              <p>
                This visualization shows the estimated crater formation from the asteroid impact.
                The visualization includes the main crater bowl, raised rim, potential central peak,
                and debris field (ejecta rays).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}