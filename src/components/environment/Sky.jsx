import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../state/gameStore';

export default function Sky({ preset = 'city' }) {
  const skyRef = useRef();
  const { timeOfDay } = useGameStore();

  const colors = useMemo(() => {
    switch (preset) {
      case 'forest':
        return {
          day: { top: '#4a90c2', bottom: '#8fbc8f' },
          night: { top: '#0a1628', bottom: '#1a3d2a' },
        };
      case 'space':
        return {
          day: { top: '#000011', bottom: '#000022' },
          night: { top: '#000011', bottom: '#000022' },
        };
      default:
        return {
          day: { top: '#1e90ff', bottom: '#87ceeb' },
          night: { top: '#0a0a1a', bottom: '#1a1a2e' },
        };
    }
  }, [preset]);

  useFrame(() => {
    if (skyRef.current && preset !== 'space') {
      const dayFactor = Math.sin(timeOfDay * Math.PI);
      
      const topColor = new THREE.Color();
      const bottomColor = new THREE.Color();
      
      topColor.lerpColors(
        new THREE.Color(colors.night.top),
        new THREE.Color(colors.day.top),
        dayFactor
      );
      
      bottomColor.lerpColors(
        new THREE.Color(colors.night.bottom),
        new THREE.Color(colors.day.bottom),
        dayFactor
      );
      
      const uniforms = skyRef.current.material.uniforms;
      uniforms.topColor.value = topColor;
      uniforms.bottomColor.value = bottomColor;
    }
  });

  const skyShader = useMemo(() => ({
    uniforms: {
      topColor: { value: new THREE.Color(colors.day.top) },
      bottomColor: { value: new THREE.Color(colors.day.bottom) },
      offset: { value: 20 },
      exponent: { value: 0.6 },
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition + offset).y;
        gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
      }
    `,
  }), [colors]);

  if (preset === 'space') {
    return null;
  }

  return (
    <mesh ref={skyRef}>
      <sphereGeometry args={[400, 32, 32]} />
      <shaderMaterial
        {...skyShader}
        side={THREE.BackSide}
      />
    </mesh>
  );
}
