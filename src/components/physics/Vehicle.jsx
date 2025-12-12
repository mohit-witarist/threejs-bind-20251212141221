import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

export default function Vehicle({ position = [0, 0, 0], type = 'car' }) {
  const bodyRef = useRef();
  const wheelsRef = useRef([]);

  useFrame((state) => {
    wheelsRef.current.forEach((wheel) => {
      if (wheel) {
        wheel.rotation.x += 0.05;
      }
    });
  });

  if (type === 'car') {
    return (
      <RigidBody ref={bodyRef} type="fixed" position={position}>
        <group>
          {/* Car Body */}
          <mesh castShadow position={[0, 0.6, 0]}>
            <boxGeometry args={[2, 0.6, 4]} />
            <meshStandardMaterial 
              color="#ff3333"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          
          {/* Car Top */}
          <mesh castShadow position={[0, 1.1, 0.2]}>
            <boxGeometry args={[1.8, 0.5, 2]} />
            <meshStandardMaterial 
              color="#ff3333"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          
          {/* Windshield */}
          <mesh position={[0, 1.1, 1.1]} rotation={[Math.PI / 6, 0, 0]}>
            <planeGeometry args={[1.6, 0.6]} />
            <meshStandardMaterial 
              color="#88ccff"
              transparent
              opacity={0.6}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          
          {/* Wheels */}
          {[
            [-0.9, 0.3, 1.4],
            [0.9, 0.3, 1.4],
            [-0.9, 0.3, -1.4],
            [0.9, 0.3, -1.4],
          ].map((pos, i) => (
            <mesh
              key={i}
              ref={(el) => (wheelsRef.current[i] = el)}
              position={pos}
              rotation={[0, 0, Math.PI / 2]}
              castShadow
            >
              <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
              <meshStandardMaterial color="#222" roughness={0.8} />
            </mesh>
          ))}
          
          {/* Headlights */}
          <mesh position={[0.6, 0.6, 2.01]}>
            <circleGeometry args={[0.15, 16]} />
            <meshStandardMaterial 
              color="#ffff00"
              emissive="#ffff00"
              emissiveIntensity={2}
            />
          </mesh>
          <mesh position={[-0.6, 0.6, 2.01]}>
            <circleGeometry args={[0.15, 16]} />
            <meshStandardMaterial 
              color="#ffff00"
              emissive="#ffff00"
              emissiveIntensity={2}
            />
          </mesh>
          
          {/* Taillights */}
          <mesh position={[0.7, 0.6, -2.01]}>
            <boxGeometry args={[0.3, 0.15, 0.01]} />
            <meshStandardMaterial 
              color="#ff0000"
              emissive="#ff0000"
              emissiveIntensity={1}
            />
          </mesh>
          <mesh position={[-0.7, 0.6, -2.01]}>
            <boxGeometry args={[0.3, 0.15, 0.01]} />
            <meshStandardMaterial 
              color="#ff0000"
              emissive="#ff0000"
              emissiveIntensity={1}
            />
          </mesh>
        </group>
      </RigidBody>
    );
  }

  return null;
}
