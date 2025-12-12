import React, { useMemo } from 'react';
import { RigidBody, CylinderCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { randomRange } from '../../utils/math';

export default function TreeGenerator({ 
  position = [0, 0, 0], 
  scale = 1, 
  type = 0,
  rotation = 0 
}) {
  const tree = useMemo(() => {
    const trunkHeight = 3 + Math.random() * 2;
    const trunkRadius = 0.2 + Math.random() * 0.1;
    
    const foliageLayers = [];
    
    if (type === 0) {
      // Pine tree
      for (let i = 0; i < 4; i++) {
        foliageLayers.push({
          y: trunkHeight * 0.4 + i * 1.2,
          radius: 2 - i * 0.4,
          height: 1.5,
        });
      }
    } else if (type === 1) {
      // Oak tree
      foliageLayers.push({
        y: trunkHeight,
        radius: 2.5,
        height: 3,
        sphere: true,
      });
    } else {
      // Birch tree
      foliageLayers.push({
        y: trunkHeight * 0.8,
        radius: 1.5,
        height: 2,
        sphere: true,
      });
      foliageLayers.push({
        y: trunkHeight * 1.1,
        radius: 1,
        height: 1.5,
        sphere: true,
      });
    }

    return {
      trunkHeight,
      trunkRadius,
      foliageLayers,
      trunkColor: type === 2 ? '#f5f5f5' : '#4a3728',
      foliageColor: `hsl(${100 + Math.random() * 40}, ${50 + Math.random() * 20}%, ${25 + Math.random() * 15}%)`,
    };
  }, [type]);

  return (
    <RigidBody type="fixed" position={position} colliders={false}>
      <CylinderCollider args={[tree.trunkHeight * scale / 2, tree.trunkRadius * scale]} position={[0, tree.trunkHeight * scale / 2, 0]} />
      
      <group scale={scale} rotation={[0, rotation, 0]}>
        {/* Trunk */}
        <mesh castShadow position={[0, tree.trunkHeight / 2, 0]}>
          <cylinderGeometry args={[tree.trunkRadius * 0.7, tree.trunkRadius, tree.trunkHeight, 8]} />
          <meshStandardMaterial 
            color={tree.trunkColor}
            roughness={0.9}
            metalness={0}
          />
        </mesh>

        {/* Foliage */}
        {tree.foliageLayers.map((layer, i) => (
          <mesh key={i} castShadow position={[0, layer.y, 0]}>
            {layer.sphere ? (
              <sphereGeometry args={[layer.radius, 8, 8]} />
            ) : (
              <coneGeometry args={[layer.radius, layer.height, 8]} />
            )}
            <meshStandardMaterial 
              color={tree.foliageColor}
              roughness={0.8}
              metalness={0}
            />
          </mesh>
        ))}
      </group>
    </RigidBody>
  );
}
