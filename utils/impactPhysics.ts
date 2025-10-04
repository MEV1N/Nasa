// utils/impactPhysics.ts

// Constants
const EARTH_GRAVITY = 9.81; // m/s²
const DENSITY_ROCK = 3000; // kg/m³ (average asteroid density)
const TNT_EQUIVALENT = 4.184e9; // 1 megaton TNT in joules

export interface ImpactParams {
  diameter: number; // Asteroid diameter in meters
  density?: number; // Density in kg/m³ (default ~3000 for rock)
  velocity: number; // Impact velocity in km/s
  angle?: number; // Impact angle in degrees (90 = straight down)
}

export interface ImpactResults {
  mass: number;
  energyJoules: number;
  energyMt: number;
  craterDiameter: number;
  radii: {
    severe: number;
    moderate: number;
    light: number;
  };
}

/**
 * Calculates impact effects based on asteroid parameters.
 */
export function calculateImpact({
  diameter,
  density = DENSITY_ROCK,
  velocity,
  angle = 90,
}: ImpactParams): ImpactResults {
  // Convert units
  const radius = diameter / 2;
  const velocityMS = velocity * 1000; // km/s → m/s
  const angleRad = (angle * Math.PI) / 180;

  // Mass of asteroid
  const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
  const mass = density * volume;

  // Kinetic energy
  const energyJoules = 0.5 * mass * Math.pow(velocityMS, 2);

  // TNT equivalent (megaton)
  const energyMt = energyJoules / TNT_EQUIVALENT;

  // Crater diameter (simplified scaling law)
  const craterDiameter =
    1.8 *
    Math.pow(energyJoules / (EARTH_GRAVITY * density), 0.25) *
    Math.pow(Math.sin(angleRad), 1 / 3);

  // Damage radii (VERY simplified estimates)
  const severeRadius = Math.cbrt(energyMt) * 2; // km - destruction
  const moderateRadius = Math.cbrt(energyMt) * 5; // km - high damage
  const lightRadius = Math.cbrt(energyMt) * 10; // km - evacuation zone

  return {
    mass,
    energyJoules,
    energyMt,
    craterDiameter,
    radii: {
      severe: severeRadius,
      moderate: moderateRadius,
      light: lightRadius,
    },
  };
}