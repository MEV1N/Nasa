// utils/hazardPolygons.ts

import * as turf from "@turf/turf";
import { calculateImpact, type ImpactParams } from "./impactPhysics";

export interface HazardZone {
  type: "Feature";
  properties: {
    zone: "severe" | "moderate" | "light";
    radius: number;
    description: string;
    color: string;
    fillColor: string;
    fillOpacity: number;
  };
  geometry: any;
}

export interface HazardPolygonOptions {
  steps?: number; // Number of steps for circle approximation (default: 64)
  units?: "kilometers" | "miles" | "meters"; // Distance units (default: kilometers)
}

/**
 * Generates hazard polygons (circles) for asteroid impact zones
 * @param lat - Latitude of impact point
 * @param lon - Longitude of impact point  
 * @param asteroidParams - Asteroid impact parameters
 * @param options - Options for polygon generation
 * @returns Array of GeoJSON features representing hazard zones
 */
export function generateHazardPolygons(
  lat: number,
  lon: number,
  asteroidParams: ImpactParams,
  options: HazardPolygonOptions = {}
): HazardZone[] {
  const { steps = 64, units = "kilometers" } = options;
  
  // Calculate impact effects
  const impact = calculateImpact(asteroidParams);
  
  // Define zone properties with colors and descriptions
  const zoneConfigs = {
    light: {
      zone: "light" as const,
      radius: impact.radii.light,
      description: "Evacuation Zone - Light damage, broken windows, evacuation recommended",
      color: "#f59e0b", // Yellow-600
      fillColor: "#fef3c7", // Yellow-100
      fillOpacity: 0.2,
    },
    moderate: {
      zone: "moderate" as const,
      radius: impact.radii.moderate,
      description: "Major Damage Zone - Severe structural damage, widespread casualties",
      color: "#ea580c", // Orange-600
      fillColor: "#fed7aa", // Orange-200
      fillOpacity: 0.3,
    },
    severe: {
      zone: "severe" as const,
      radius: impact.radii.severe,
      description: "Severe Destruction Zone - Complete devastation, unsurvivable conditions",
      color: "#dc2626", // Red-600
      fillColor: "#fecaca", // Red-200
      fillOpacity: 0.4,
    },
  };

  // Generate polygons from outermost to innermost (so inner zones render on top)
  const polygons: HazardZone[] = [];
  
  // Only create polygons for zones with meaningful radius
  Object.entries(zoneConfigs).forEach(([key, config]) => {
    if (config.radius > 0) {
      const circle = turf.circle([lon, lat], config.radius, { 
        steps, 
        units 
      });
      
      polygons.push({
        type: "Feature",
        properties: {
          zone: config.zone,
          radius: config.radius,
          description: config.description,
          color: config.color,
          fillColor: config.fillColor,
          fillOpacity: config.fillOpacity,
        },
        geometry: circle.geometry,
      });
    }
  });

  // Return in order: light (outermost), moderate, severe (innermost)
  return polygons.reverse();
}

/**
 * Generates a single hazard polygon for a specific zone
 * @param lat - Latitude of impact point
 * @param lon - Longitude of impact point
 * @param radius - Radius of the hazard zone in kilometers
 * @param zone - Zone type
 * @param options - Options for polygon generation
 * @returns GeoJSON feature representing the hazard zone
 */
export function generateSingleHazardPolygon(
  lat: number,
  lon: number,
  radius: number,
  zone: "severe" | "moderate" | "light",
  options: HazardPolygonOptions = {}
): HazardZone {
  const { steps = 64, units = "kilometers" } = options;
  
  const zoneConfigs = {
    light: {
      description: "Evacuation Zone - Light damage expected",
      color: "#f59e0b",
      fillColor: "#fef3c7",
      fillOpacity: 0.2,
    },
    moderate: {
      description: "Major Damage Zone - Severe structural damage",
      color: "#ea580c",
      fillColor: "#fed7aa",
      fillOpacity: 0.3,
    },
    severe: {
      description: "Severe Destruction Zone - Complete devastation",
      color: "#dc2626",
      fillColor: "#fecaca",
      fillOpacity: 0.4,
    },
  };

  const config = zoneConfigs[zone];
  const circle = turf.circle([lon, lat], radius, { steps, units });

  return {
    type: "Feature",
    properties: {
      zone,
      radius,
      description: config.description,
      color: config.color,
      fillColor: config.fillColor,
      fillOpacity: config.fillOpacity,
    },
    geometry: circle.geometry,
  };
}

/**
 * Converts hazard polygons to a GeoJSON FeatureCollection
 * @param polygons - Array of hazard polygons
 * @returns GeoJSON FeatureCollection
 */
export function hazardPolygonsToGeoJSON(polygons: HazardZone[]) {
  return {
    type: "FeatureCollection" as const,
    features: polygons,
  };
}

/**
 * Calculates the area of a hazard zone in square kilometers
 * @param polygon - Hazard polygon
 * @returns Area in square kilometers
 */
export function calculateHazardZoneArea(polygon: HazardZone): number {
  return turf.area(polygon) / 1_000_000; // Convert from m² to km²
}

/**
 * Checks if a point (lat, lon) is within a hazard zone
 * @param lat - Latitude of the point
 * @param lon - Longitude of the point
 * @param polygon - Hazard polygon to check against
 * @returns True if point is within the hazard zone
 */
export function isPointInHazardZone(
  lat: number,
  lon: number,
  polygon: HazardZone
): boolean {
  const point = turf.point([lon, lat]);
  return turf.booleanPointInPolygon(point, polygon);
}

/**
 * Gets the most severe hazard zone that contains a given point
 * @param lat - Latitude of the point
 * @param lon - Longitude of the point
 * @param polygons - Array of hazard polygons
 * @returns The most severe zone containing the point, or null if none
 */
export function getPointHazardLevel(
  lat: number,
  lon: number,
  polygons: HazardZone[]
): HazardZone | null {
  // Check from most severe to least severe
  const severityOrder: Array<"severe" | "moderate" | "light"> = ["severe", "moderate", "light"];
  
  for (const severity of severityOrder) {
    const zone = polygons.find(p => p.properties.zone === severity);
    if (zone && isPointInHazardZone(lat, lon, zone)) {
      return zone;
    }
  }
  
  return null;
}