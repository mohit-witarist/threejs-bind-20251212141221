import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSettingsStore } from '../../state/settingsStore';

function Rain({ count = 5000 }) {
  const ref = useRef();
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = Math.random() * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      velocities[i] = 0.5 + Math.random() * 0.5;
    }
    
    return { positions, velocities };
  }, [count]);

  useFrame(() => {
    if (ref.current) {
      const positions = ref.current.geometry.attributes.position.array;
      
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] -= particles.velocities[i];
        
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 50;
          positions[i * 3] = (Math.random() - 0.5) * 100;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
        }
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
        size={0.1}
        color="#88ccff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function Snow({ count = 3000 }) {
  const ref = useRef();
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = Math.random() * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = 0.05 + Math.random() * 0.05;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    
    return { positions, velocities };
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      const positions = ref.current.geometry.attributes.position.array;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < count; i++) {
        positions[i * 3] += Math.sin(time + i) * 0.01 + particles.velocities[i * 3];
        positions[i * 3 + 1] -= particles.velocities[i * 3 + 1];
        positions[i * 3 + 2] += Math.cos(time + i) * 0.01 + particles.velocities[i * 3 + 2];
        
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 50;
          positions[i * 3] = (Math.random() - 0.5) * 100;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
        }
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
        size={0.2}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

export default function Weather({ type = 'clear' }) {
  const { particleEffects } = useSettingsStore();

  if (!particleEffects) return null;

  switch (type) {
    case 'rain':
      return <Rain />;
    case 'snow':
      return <Snow />;
    case 'storm':
      return <Rain count={10000} />;
    default:
      return null;
  }
}
