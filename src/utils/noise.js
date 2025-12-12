import { createNoise2D, createNoise3D } from 'simplex-noise';

const noise2D = createNoise2D();
const noise3D = createNoise3D();

export function fbm2D(x, y, octaves = 6, lacunarity = 2, persistence = 0.5) {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise2D(x * frequency, y * frequency);
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }

  return value / maxValue;
}

export function fbm3D(x, y, z, octaves = 6, lacunarity = 2, persistence = 0.5) {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise3D(x * frequency, y * frequency, z * frequency);
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }

  return value / maxValue;
}

export function ridgedNoise2D(x, y, octaves = 6) {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;

  for (let i = 0; i < octaves; i++) {
    let n = noise2D(x * frequency, y * frequency);
    n = 1 - Math.abs(n);
    n = n * n;
    value += amplitude * n;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value;
}

export function turbulence2D(x, y, octaves = 6) {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;

  for (let i = 0; i < octaves; i++) {
    value += amplitude * Math.abs(noise2D(x * frequency, y * frequency));
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value;
}

export { noise2D, noise3D };
