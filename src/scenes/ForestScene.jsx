import React, { useMemo } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import Lighting from '../components/environment/Lighting';
import Sky from '../components/environment/Sky';
import Weather from '../components/environment/Weather';
import Particles from '../components/environment/Particles';
import CharacterController from '../components/physics/CharacterController';
import Interactable from '../components/physics/Interactable';
import TreeGenerator from '../components/procedural/TreeGenerator';
import ProceduralTerrain from '../components/procedural/ProceduralTerrain';
import { useGameStore } from '../state/gameStore';
import { randomRange, randomInt } from '../utils/math';
import { fbm2D } from '../utils/noise';

function ForestGround() {
  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[100, 0.5, 100]} position={[0, -0.5, 0]} />
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 200, 100, 100]} />
        <meshStandardMaterial 
          color="#1a3d1a"
          roughness={0.95}
          metalness={0}
        />
      </mesh>
    </RigidBody>
  );
}

function ForestTrees() {
  const trees = useMemo(() => {
    const result = [];
    const count = 150;
    
    for (let i = 0; i < count; i++) {
      const x = randomRange(-80, 80);
      const z = randomRange(-80, 80);
      
      if (Math.abs(x) < 8 && Math.abs(z) < 8) continue;
      
      const density = (fbm2D(x * 0.02, z * 0.02) + 1) / 2;
      if (Math.random() > density * 0.8) continue;
      
      result.push({
        id: `tree-${i}`,
        position: [x, 0, z],
        scale: randomRange(0.7, 1.5),
        type: randomInt(0, 2),
        rotation: randomRange(0, Math.PI * 2),
      });
    }
    
    return result;
  }, []);

  return (
    <>
      {trees.map((tree) => (
        <TreeGenerator key={tree.id} {...tree} />
      ))}
    </>
  );
}

function ForestRocks() {
  const rocks = useMemo(() => {
    const result = [];
    
    for (let i = 0; i < 30; i++) {
      result.push({
        id: `rock-${i}`,
        position: [randomRange(-70, 70), 0, randomRange(-70, 70)],
        scale: randomRange(0.5, 2.5),
        rotation: [randomRange(0, 0.3), randomRange(0, Math.PI * 2), randomRange(0, 0.3)],
      });
    }
    
    return result;
  }, []);

  return (
    <>
      {rocks.map((rock) => (
        <RigidBody key={rock.id} type="fixed" position={rock.position}>
          <mesh castShadow receiveShadow rotation={rock.rotation} scale={rock.scale}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial 
              color="#4a4a4a"
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}

function Mushrooms() {
  const mushrooms = useMemo(() => {
    const result = [];
    
    for (let i = 0; i < 40; i++) {
      result.push({
        id: `mushroom-${i}`,
        position: [randomRange(-60, 60), 0, randomRange(-60, 60)],
        scale: randomRange(0.3, 0.8),
        color: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a855f7'][randomInt(0, 3)],
      });
    }
    
    return result;
  }, []);

  return (
    <>
      {mushrooms.map((mushroom) => (
        <group key={mushroom.id} position={mushroom.position} scale={mushroom.scale}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.15, 0.6, 8]} />
            <meshStandardMaterial color="#f5deb3" />
          </mesh>
          <mesh position={[0, 0.7, 0]} castShadow>
            <coneGeometry args={[0.5, 0.5, 8]} />
            <meshStandardMaterial 
              color={mushroom.color}
              emissive={mushroom.color}
              emissiveIntensity={0.3}
            />
          </mesh>
          <pointLight 
            position={[0, 0.5, 0]} 
            color={mushroom.color} 
            intensity={2} 
            distance={5}
            decay={2}
          />
        </group>
      ))}
    </>
  );
}

function ForestCollectibles() {
  const collectibles = useMemo(() => [
    { id: 'gem-1', position: [15, 1.5, 12], type: 'gem', value: 150 },
    { id: 'gem-2', position: [-20, 1.5, 25], type: 'gem', value: 150 },
    { id: 'gem-3', position: [30, 1.5, -18], type: 'gem', value: 150 },
    { id: 'health-1', position: [-25, 1, -20], type: 'health', value: 50 },
    { id: 'health-2', position: [35, 1, 35], type: 'health', value: 50 },
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

export default function ForestScene() {
  const { weather } = useGameStore();

  return (
    <>
      <Sky preset="forest" />
      <Lighting preset="forest" />
      <Weather type={weather} />
      <Particles type="fireflies" />
      
      <ForestGround />
      <ForestTrees />
      <ForestRocks />
      <Mushrooms />
      <ForestCollectibles />
      
      <CharacterController position={[0, 2, 0]} />
      
      <fog attach="fog" args={['#1a3d2a', 20, 100]} />
    </>
  );
}
