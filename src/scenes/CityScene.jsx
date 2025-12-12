import React, { useMemo } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import Lighting from '../components/environment/Lighting';
import Sky from '../components/environment/Sky';
import Weather from '../components/environment/Weather';
import Particles from '../components/environment/Particles';
import CharacterController from '../components/physics/CharacterController';
import Interactable from '../components/physics/Interactable';
import BuildingGenerator from '../components/procedural/BuildingGenerator';
import Vehicle from '../components/physics/Vehicle';
import { useGameStore } from '../state/gameStore';
import { randomRange, randomInt } from '../utils/math';

function Ground() {
  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[100, 0.5, 100]} position={[0, -0.5, 0]} />
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 200, 100, 100]} />
        <meshStandardMaterial 
          color="#1a1a2e"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Road grid */}
      {[-40, -20, 0, 20, 40].map((x, i) => (
        <mesh key={`road-x-${i}`} position={[x, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8, 200]} />
          <meshStandardMaterial color="#2d2d44" roughness={0.7} />
        </mesh>
      ))}
      {[-40, -20, 0, 20, 40].map((z, i) => (
        <mesh key={`road-z-${i}`} position={[0, 0.01, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[200, 8]} />
          <meshStandardMaterial color="#2d2d44" roughness={0.7} />
        </mesh>
      ))}
    </RigidBody>
  );
}

function CityBuildings() {
  const buildings = useMemo(() => {
    const result = [];
    const gridPositions = [];
    
    for (let x = -80; x <= 80; x += 25) {
      for (let z = -80; z <= 80; z += 25) {
        if (Math.abs(x) < 15 && Math.abs(z) < 15) continue;
        if (x % 20 === 0 || z % 20 === 0) continue;
        
        gridPositions.push([x + randomRange(-5, 5), z + randomRange(-5, 5)]);
      }
    }
    
    gridPositions.forEach((pos, i) => {
      result.push({
        id: `building-${i}`,
        position: [pos[0], 0, pos[1]],
        height: randomRange(15, 60),
        width: randomRange(8, 20),
        depth: randomRange(8, 20),
        style: randomInt(0, 4),
      });
    });
    
    return result;
  }, []);

  return (
    <>
      {buildings.map((building) => (
        <BuildingGenerator key={building.id} {...building} />
      ))}
    </>
  );
}

function StreetLights() {
  const lights = useMemo(() => {
    const result = [];
    
    for (let x = -80; x <= 80; x += 20) {
      for (let z = -80; z <= 80; z += 20) {
        if (Math.abs(x) < 10 && Math.abs(z) < 10) continue;
        result.push({ position: [x, 0, z], id: `light-${x}-${z}` });
      }
    }
    
    return result;
  }, []);

  return (
    <>
      {lights.map((light) => (
        <group key={light.id} position={light.position}>
          <mesh position={[0, 4, 0]}>
            <cylinderGeometry args={[0.1, 0.15, 8, 8]} />
            <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 8.5, 0]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial 
              color="#ffaa00"
              emissive="#ffaa00"
              emissiveIntensity={2}
            />
          </mesh>
          <pointLight
            position={[0, 8, 0]}
            color="#ffaa00"
            intensity={15}
            distance={20}
            decay={2}
          />
        </group>
      ))}
    </>
  );
}

function Collectibles() {
  const collectibles = useMemo(() => [
    { id: 'gem-1', position: [10, 1.5, 10], type: 'gem', value: 100 },
    { id: 'gem-2', position: [-15, 1.5, 20], type: 'gem', value: 100 },
    { id: 'gem-3', position: [25, 1.5, -10], type: 'gem', value: 100 },
    { id: 'health-1', position: [-20, 1, -15], type: 'health', value: 25 },
    { id: 'health-2', position: [30, 1, 30], type: 'health', value: 25 },
    { id: 'crate-1', position: [5, 1.5, -20], type: 'crate' },
    { id: 'crate-2', position: [-30, 1.5, 5], type: 'crate' },
  ], []);

  return (
    <>
      {collectibles.map((item) => (
        <Interactable 
          key={item.id}
          position={item.position}
          type={item.type}
          value={item.value}
        />
      ))}
    </>
  );
}

export default function CityScene() {
  const { weather } = useGameStore();

  return (
    <>
      <Sky />
      <Lighting />
      <Weather type={weather} />
      <Particles type="dust" />
      
      <Ground />
      <CityBuildings />
      <StreetLights />
      <Collectibles />
      
      <Vehicle position={[15, 0.5, 0]} type="car" />
      <Vehicle position={[-25, 0.5, 15]} type="car" />
      
      <CharacterController position={[0, 2, 0]} />
      
      <fog attach="fog" args={['#0a0a1a', 50, 150]} />
    </>
  );
}
