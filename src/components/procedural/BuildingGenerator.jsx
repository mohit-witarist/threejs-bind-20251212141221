import React, { useMemo } from 'react';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { randomRange, randomInt } from '../../utils/math';

export default function BuildingGenerator({ 
  position = [0, 0, 0], 
  height = 30, 
  width = 10, 
  depth = 10,
  style = 0 
}) {
  const building = useMemo(() => {
    const windows = [];
    const floors = Math.floor(height / 4);
    
    for (let floor = 1; floor < floors; floor++) {
      const y = floor * 4 - height / 2 + 2;
      
      for (let x = -width / 2 + 1.5; x < width / 2 - 1; x += 3) {
        windows.push({ position: [x, y, depth / 2 + 0.01], lit: Math.random() > 0.3 });
        windows.push({ position: [x, y, -depth / 2 - 0.01], lit: Math.random() > 0.3 });
      }
      
      for (let z = -depth / 2 + 1.5; z < depth / 2 - 1; z += 3) {
        windows.push({ position: [width / 2 + 0.01, y, z], lit: Math.random() > 0.3, rotated: true });
        windows.push({ position: [-width / 2 - 0.01, y, z], lit: Math.random() > 0.3, rotated: true });
      }
    }

    const colors = [
      '#2d2d44',
      '#3d3d5c',
      '#4a4a6a',
      '#252538',
      '#35354d',
    ];

    return {
      windows,
      color: colors[style % colors.length],
      hasAntenna: Math.random() > 0.7,
      hasRoofLight: Math.random() > 0.5,
    };
  }, [height, width, depth, style]);

  return (
    <RigidBody type="fixed" position={position} colliders="cuboid">
      <group>
        {/* Main building */}
        <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial 
            color={building.color}
            roughness={0.8}
            metalness={0.3}
          />
        </mesh>

        {/* Windows */}
        {building.windows.map((window, i) => (
          <mesh 
            key={i} 
            position={[
              window.position[0], 
              window.position[1] + height / 2, 
              window.position[2]
            ]}
            rotation={window.rotated ? [0, Math.PI / 2, 0] : [0, 0, 0]}
          >
            <planeGeometry args={[1.5, 2]} />
            <meshStandardMaterial
              color={window.lit ? '#ffcc88' : '#1a1a2e'}
              emissive={window.lit ? '#ffaa44' : '#000000'}
              emissiveIntensity={window.lit ? 0.5 : 0}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}

        {/* Roof details */}
        <mesh position={[0, height + 0.25, 0]}>
          <boxGeometry args={[width - 1, 0.5, depth - 1]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.9} />
        </mesh>

        {/* Antenna */}
        {building.hasAntenna && (
          <group position={[width / 4, height, depth / 4]}>
            <mesh>
              <cylinderGeometry args={[0.1, 0.15, 8, 8]} />
              <meshStandardMaterial color="#444" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 4.5, 0]}>
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshStandardMaterial 
                color="#ff0000"
                emissive="#ff0000"
                emissiveIntensity={1}
              />
            </mesh>
            <pointLight position={[0, 4.5, 0]} color="#ff0000" intensity={5} distance={10} />
          </group>
        )}

        {/* Roof light */}
        {building.hasRoofLight && (
          <pointLight 
            position={[0, height + 1, 0]} 
            color="#00d4ff" 
            intensity={20} 
            distance={30}
          />
        )}
      </group>
    </RigidBody>
  );
}
