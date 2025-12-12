import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import Lighting from '../components/environment/Lighting';
import CharacterController from '../components/physics/CharacterController';
import Interactable from '../components/physics/Interactable';
import { randomRange, randomInt } from '../utils/math';

function SpacePlatform() {
  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[30, 1, 30]} position={[0, -1, 0]} />
      
      <mesh receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[30, 32, 2, 32]} />
        <meshStandardMaterial 
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      
      <mesh position={[0, 0.1, 0]}>
        <ringGeometry args={[25, 30, 32]} />
        <meshStandardMaterial 
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * 28;
        const z = Math.sin(rad) * 28;
        return (
          <group key={i} position={[x, 1, z]}>
            <mesh castShadow>
              <boxGeometry args={[2, 4, 2]} />
              <meshStandardMaterial 
                color="#2d2d44"
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            <pointLight 
              position={[0, 3, 0]} 
              color="#00d4ff" 
              intensity={10} 
              distance={15}
            />
          </group>
        );
      })}
    </RigidBody>
  );
}

function FloatingPlatforms() {
  const platforms = useMemo(() => [
    { position: [40, 5, 0], size: [10, 1, 10] },
    { position: [-35, 8, 20], size: [8, 1, 8] },
    { position: [20, 12, -40], size: [12, 1, 12] },
    { position: [-45, 15, -30], size: [6, 1, 6] },
    { position: [50, 20, 30], size: [8, 1, 8] },
  ], []);

  return (
    <>
      {platforms.map((platform, i) => (
        <RigidBody key={i} type="fixed" position={platform.position}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={platform.size} />
            <meshStandardMaterial 
              color="#2d2d44"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, 0.6, 0]}>
            <boxGeometry args={[platform.size[0] - 1, 0.1, platform.size[2] - 1]} />
            <meshStandardMaterial 
              color="#7c3aed"
              emissive="#7c3aed"
              emissiveIntensity={0.8}
            />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}

function Asteroids() {
  const asteroidsRef = useRef([]);
  
  const asteroids = useMemo(() => {
    const result = [];
    
    for (let i = 0; i < 50; i++) {
      result.push({
        id: i,
        position: [
          randomRange(-100, 100),
          randomRange(20, 80),
          randomRange(-100, 100)
        ],
        scale: randomRange(0.5, 3),
        rotation: [randomRange(0, Math.PI), randomRange(0, Math.PI), randomRange(0, Math.PI)],
        rotationSpeed: [randomRange(-0.01, 0.01), randomRange(-0.01, 0.01), randomRange(-0.01, 0.01)],
      });
    }
    
    return result;
  }, []);

  useFrame(() => {
    asteroidsRef.current.forEach((mesh, i) => {
      if (mesh) {
        mesh.rotation.x += asteroids[i].rotationSpeed[0];
        mesh.rotation.y += asteroids[i].rotationSpeed[1];
        mesh.rotation.z += asteroids[i].rotationSpeed[2];
      }
    });
  });

  return (
    <>
      {asteroids.map((asteroid, i) => (
        <mesh
          key={asteroid.id}
          ref={(el) => (asteroidsRef.current[i] = el)}
          position={asteroid.position}
          rotation={asteroid.rotation}
          scale={asteroid.scale}
        >
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial 
            color="#4a4a5e"
            roughness={0.9}
            metalness={0.3}
          />
        </mesh>
      ))}
    </>
  );
}

function SpaceStation() {
  const stationRef = useRef();

  useFrame((state) => {
    if (stationRef.current) {
      stationRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={stationRef} position={[0, 50, -80]}>
      <mesh>
        <torusGeometry args={[15, 3, 16, 100]} />
        <meshStandardMaterial 
          color="#3d3d5c"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      
      <mesh>
        <cylinderGeometry args={[2, 2, 40, 16]} />
        <meshStandardMaterial 
          color="#2d2d44"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      
      {[0, 90, 180, 270].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * 15;
        const z = Math.sin(rad) * 15;
        return (
          <mesh key={i} position={[x, 0, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1, 1, 8, 8]} />
            <meshStandardMaterial 
              color="#2d2d44"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        );
      })}
      
      <pointLight position={[0, 0, 0]} color="#00d4ff" intensity={50} distance={100} />
    </group>
  );
}

function SpaceCollectibles() {
  const collectibles = useMemo(() => [
    { id: 'crystal-1', position: [10, 1.5, 10], type: 'gem', value: 200 },
    { id: 'crystal-2', position: [-15, 1.5, -10], type: 'gem', value: 200 },
    { id: 'crystal-3', position: [40, 6.5, 0], type: 'gem', value: 500 },
    { id: 'health-1', position: [-35, 9.5, 20], type: 'health', value: 100 },
    { id: 'health-2', position: [20, 13.5, -40], type: 'health', value: 100 },
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

function Planet() {
  const planetRef = useRef();

  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group position={[150, 30, -150]}>
      <mesh ref={planetRef}>
        <sphereGeometry args={[40, 64, 64]} />
        <meshStandardMaterial 
          color="#4a2c7a"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[60, 8, 2, 100]} />
        <meshStandardMaterial 
          color="#7c5caa"
          transparent
          opacity={0.6}
          roughness={0.5}
        />
      </mesh>
    </group>
  );
}

export default function SpaceScene() {
  return (
    <>
      <Stars 
        radius={300} 
        depth={100} 
        count={10000} 
        factor={6} 
        saturation={0} 
        fade 
        speed={0.5}
      />
      
      <Lighting preset="space" />
      
      <SpacePlatform />
      <FloatingPlatforms />
      <Asteroids />
      <SpaceStation />
      <Planet />
      <SpaceCollectibles />
      
      <CharacterController position={[0, 2, 0]} />
      
      <ambientLight intensity={0.1} />
    </>
  );
}
