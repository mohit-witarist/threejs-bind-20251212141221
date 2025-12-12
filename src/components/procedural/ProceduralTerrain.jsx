import React, { useMemo, useRef } from 'react';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { fbm2D } from '../../utils/noise';

export default function ProceduralTerrain({ 
  size = 100, 
  segments = 50, 
  heightScale = 10,
  position = [0, 0, 0]
}) {
  const meshRef = useRef();

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    const positions = geo.attributes.position.array;
    const colors = new Float32Array(positions.length);

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 1];
      
      const height = fbm2D(x * 0.02, z * 0.02, 6) * heightScale;
      positions[i + 2] = height;

      const normalizedHeight = (height / heightScale + 1) / 2;
      
      if (normalizedHeight < 0.3) {
        colors[i] = 0.1;
        colors[i + 1] = 0.3;
        colors[i + 2] = 0.1;
      } else if (normalizedHeight < 0.5) {
        colors[i] = 0.2;
        colors[i + 1] = 0.5;
        colors[i + 2] = 0.2;
      } else if (normalizedHeight < 0.7) {
        colors[i] = 0.4;
        colors[i + 1] = 0.4;
        colors[i + 2] = 0.3;
      } else {
        colors[i] = 0.9;
        colors[i + 1] = 0.9;
        colors[i + 2] = 0.95;
      }
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    
    return geo;
  }, [size, segments, heightScale]);

  return (
    <RigidBody type="fixed" position={position} colliders="trimesh">
      <mesh 
        ref={meshRef}
        geometry={geometry}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial 
          vertexColors
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
    </RigidBody>
  );
}
