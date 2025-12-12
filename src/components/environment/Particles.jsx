import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSettingsStore } from '../../state/settingsStore';

function DustParticles({ count = 500 }) {
  const ref = useRef();
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = Math.random() * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
      speeds[i] = 0.001 + Math.random() * 0.002;
    }
    
    return { positions, speeds };
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      const positions = ref.current.geometry.attributes.position.array;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < count; i++) {
        positions[i * 3] += Math.sin(time * 0.5 + i) * particles.speeds[i];
        positions[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.005;
        positions[i * 3 + 2] += Math.cos(time * 0.5 + i) * particles.speeds[i];
      }
      
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#ffffff"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
}

function Fireflies({ count = 100 }) {
  const ref = useRef();
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = 1 + Math.random() * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      phases[i] = Math.random() * Math.PI * 2;
    }
    
    return { positions, phases };
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      const positions = ref.current.geometry.attributes.position.array;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < count; i++) {
        const phase = particles.phases[i];
        positions[i * 3] += Math.sin(time * 0.5 + phase) * 0.01;
        positions[i * 3 + 1] += Math.sin(time * 2 + phase) * 0.005;
        positions[i * 3 + 2] += Math.cos(time * 0.5 + phase) * 0.01;
      }
      
      ref.current.geometry.attributes.position.needsUpdate = true;
      
      const opacity = (Math.sin(time * 3) + 1) * 0.3 + 0.4;
      ref.current.material.opacity = opacity;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        color="#ffff00"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

export default function Particles({ type = 'dust' }) {
  const { particleEffects } = useSettingsStore();

  if (!particleEffects) return null;

  switch (type) {
    case 'dust':
      return <DustParticles />;
    case 'fireflies':
      return <Fireflies />;
    default:
      return <DustParticles />;
  }
}
