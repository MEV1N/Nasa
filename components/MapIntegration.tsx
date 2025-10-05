// Example integration with react-leaflet map components
// This shows how to integrate ImpactEffects with basic Leaflet components

import React, { useState, useEffect } from 'react';
import { Circle, Marker, Popup } from 'react-leaflet';
import ImpactEffects from './ImpactEffects';

interface MapIntegrationProps {
  impactLat: number;
  impactLng: number;
  asteroidDiameter?: number;
  impactVelocity?: number;
  impactAngle?: number;
}

function MapIntegration({ 
  impactLat, 
  impactLng, 
  asteroidDiameter = 1,
  impactVelocity = 20,
  impactAngle = 45
}: MapIntegrationProps) {
  const [effects, setEffects] = useState({
    airblastRadius: 0,
    tsunamiHeight: 0,
    seismicRadius: 0
  });

  // Calculate effects when parameters change
  useEffect(() => {
    const calculateBasicEffects = () => {
      // Simple calculations for demo
      const diameter = asteroidDiameter;
      const velocity = impactVelocity;
      
      // Energy calculation (simplified)
      const radius = (diameter * 1000) / 2;
      const volume = (4/3) * Math.PI * Math.pow(radius, 3);
      const mass = 3000 * volume; // 3000 kg/m³ density
      const energy = 0.5 * mass * Math.pow(velocity * 1000, 2);
      const energyScale = energy / 1e20;

      // Effect calculations
      const airblastRadius = 50 * Math.pow(energyScale, 1/3);
      const tsunamiHeight = 0.1 * Math.pow(energyScale, 1/3) * 1000;
      const seismicRadius = 200 * Math.pow(energyScale, 1/5);

      setEffects({
        airblastRadius: airblastRadius,
        tsunamiHeight: tsunamiHeight,
        seismicRadius: seismicRadius
      });
    };

    calculateBasicEffects();
  }, [asteroidDiameter, impactVelocity, impactAngle]);

  return (
    <>
      {/* Impact point marker */}
      <Marker position={[impactLat, impactLng]}>
        <Popup>
          <div>
            <h3 className="font-orbitron">Impact Location</h3>
            <p>Asteroid: {asteroidDiameter} km diameter</p>
            <p>Velocity: {impactVelocity} km/s</p>
            <p>Angle: {impactAngle}°</p>
          </div>
        </Popup>
      </Marker>

      {/* Airblast/Shockwave circle */}
      {effects.airblastRadius > 0 && (
        <Circle
          center={[impactLat, impactLng]}
          radius={effects.airblastRadius * 1000} // convert km to meters
          pathOptions={{ 
            color: '#8b5cf6', 
            fillColor: '#8b5cf6',
            fillOpacity: 0.1,
            weight: 2,
            dashArray: '10, 5'
          }}
        >
          <Popup>
            <div>
              <h4 className="font-orbitron">Airblast Zone</h4>
              <p>Radius: {effects.airblastRadius.toFixed(1)} km</p>
              <p>Destructive shockwave effects</p>
            </div>
          </Popup>
        </Circle>
      )}

      {/* Tsunami affected area (rough approximation) */}
      {effects.tsunamiHeight > 10 && (
        <Circle
          center={[impactLat, impactLng]}
          radius={effects.tsunamiHeight * 500} // rough approximation for affected coastline
          pathOptions={{ 
            color: '#0ea5e9', 
            fillColor: '#0ea5e9',
            fillOpacity: 0.05,
            weight: 2,
            dashArray: '15, 10'
          }}
        >
          <Popup>
            <div>
              <h4 className="font-orbitron">Tsunami Zone</h4>
              <p>Wave Height: {effects.tsunamiHeight.toFixed(0)} meters</p>
              <p>Coastal flooding risk</p>
            </div>
          </Popup>
        </Circle>
      )}

      {/* Seismic effects circle */}
      {effects.seismicRadius > 0 && (
        <Circle
          center={[impactLat, impactLng]}
          radius={effects.seismicRadius * 1000}
          pathOptions={{ 
            color: '#eab308', 
            fillColor: '#eab308',
            fillOpacity: 0.03,
            weight: 1,
            dashArray: '5, 15'
          }}
        >
          <Popup>
            <div>
              <h4 className="font-orbitron">Seismic Effects</h4>
              <p>Radius: {effects.seismicRadius.toFixed(1)} km</p>
              <p>Earthquake damage from impact</p>
            </div>
          </Popup>
        </Circle>
      )}

      {/* Impact Effects Component */}
      <div style={{ 
        position: 'absolute', 
        top: '10px', 
        right: '10px', 
        zIndex: 1000,
        maxWidth: '400px'
      }}>
        <ImpactEffects 
          impactLat={impactLat}
          impactLng={impactLng}
          asteroidDiameter={asteroidDiameter}
          impactVelocity={impactVelocity}
          impactAngle={impactAngle}
        />
      </div>
    </>
  );
}

export default MapIntegration;