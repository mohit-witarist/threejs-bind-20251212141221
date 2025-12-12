import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { usePlayerStore } from '../../state/playerStore';
import { useGameStore } from '../../state/gameStore';
import { useAudio } from '../../hooks/useAudio';

export default function Interactable({ position, type = 'gem', value = 100 }) {
  const meshRef = useRef();
  const [collected, setCollected] = useState(false);
  const { playCollect, playInteract } = useAudio();
  const { addToInventory, heal } = usePlayerStore();
  const { playerPosition, addCollectedItem } = useGameStore();

  useFrame((state) => {
    if (meshRef.current && !collected) {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;

      const distance = new THREE.Vector3(...playerPosition).distanceTo(new THREE.Vector3(...position));
      
      if (distance < 2) {
        handleCollect();
      }
    }
  });

  const handleCollect = () => {
    if (collected) return;
    setCollected(true);
    playCollect();

    switch (type) {
      case 'gem':
        addToInventory({ id: Date.now(), type: 'gem', value });
        addCollectedItem({ type: 'gem', value, timestamp: Date.now() });
        break;
      case 'health':
        heal(value);
        break;
      case 'crate':
        playInteract();
        addToInventory({ id: Date.now(), type: 'random', value: Math.floor(Math.random() * 200) });
        break;
    }
  };

  if (collected) return null;

  const renderItem = () => {
    switch (type) {
      case 'gem':
        return (
          <group ref={meshRef} position={position}>
            <mesh castShadow>
              <octahedronGeometry args={[0.5, 0]} />
              <meshStandardMaterial
                color="#00d4ff"
                emissive="#00d4ff"
                emissiveIntensity={1}
                metalness={0.9}
                roughness={0.1}
                transparent
                opacity={0.9}
              />
            </mesh>
            <pointLight color="#00d4ff" intensity={10} distance={8} />
          </group>
        );
      
      case 'health':
        return (
          <group ref={meshRef} position={position}>
            <mesh castShadow>
              <boxGeometry args={[0.6, 0.6, 0.6]} />
              <meshStandardMaterial
                color="#ff4444"
                emissive="#ff4444"
                emissiveIntensity={0.8}
              />
            </mesh>
            <mesh position={[0, 0, 0.31]}>
              <boxGeometry args={[0.4, 0.15, 0.01]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
            </mesh>
            <mesh position={[0, 0, 0.31]}>
              <boxGeometry args={[0.15, 0.4, 0.01]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
            </mesh>
            <pointLight color="#ff4444" intensity={8} distance={6} />
          </group>
        );
      
      case 'crate':
        return (
          <RigidBody type="fixed" position={position}>
            <group ref={meshRef}>
              <mesh castShadow>
                <boxGeometry args={[1.2, 1.2, 1.2]} />
                <meshStandardMaterial
                  color="#8b4513"
                  roughness={0.9}
                  metalness={0.1}
                />
              </mesh>
              <mesh position={[0, 0.61, 0]}>
                <boxGeometry args={[1.1, 0.05, 1.1]} />
                <meshStandardMaterial color="#654321" />
              </mesh>
            </group>
          </RigidBody>
        );
      
      default:
        return null;
    }
  };

  return renderItem();
}
