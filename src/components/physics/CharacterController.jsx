import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { usePlayerStore } from '../../state/playerStore';
import { useGameStore } from '../../state/gameStore';
import { useSettingsStore } from '../../state/settingsStore';
import { useAudio } from '../../hooks/useAudio';

const MOVE_SPEED = 6;
const RUN_MULTIPLIER = 1.8;
const JUMP_FORCE = 8;

export default function CharacterController({ position = [0, 2, 0] }) {
  const bodyRef = useRef();
  const meshRef = useRef();
  const { camera } = useThree();
  const { world } = useRapier();
  
  const [, getKeys] = useKeyboardControls();
  const { playJump, playStep } = useAudio();
  
  const { 
    isRunning, 
    isGrounded, 
    setIsRunning, 
    setIsGrounded, 
    useStamina,
    stamina 
  } = usePlayerStore();
  
  const { setPlayerPosition, cameraMode, isPaused } = useGameStore();
  const { mouseSensitivity, invertY } = useSettingsStore();
  
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const stepTimer = useRef(0);
  const velocityRef = useRef(new THREE.Vector3());

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isPaused || cameraMode !== 'first-person') return;
      
      const sensitivity = mouseSensitivity * 0.002;
      
      setRotation((prev) => ({
        x: Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, 
          prev.x + (invertY ? e.movementY : -e.movementY) * sensitivity)),
        y: prev.y - e.movementX * sensitivity,
      }));
    };

    const handleClick = () => {
      if (cameraMode === 'first-person') {
        document.body.requestPointerLock();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
    };
  }, [isPaused, cameraMode, mouseSensitivity, invertY]);

  useFrame((state, delta) => {
    if (!bodyRef.current || isPaused) return;

    const { forward, backward, left, right, jump, run } = getKeys();
    
    const bodyPosition = bodyRef.current.translation();
    const velocity = bodyRef.current.linvel();

    // Ground check
    const ray = world.castRay(
      { origin: { x: bodyPosition.x, y: bodyPosition.y, z: bodyPosition.z }, dir: { x: 0, y: -1, z: 0 } },
      2,
      true
    );
    const grounded = ray && ray.toi < 1.1;
    setIsGrounded(grounded);

    // Movement direction
    const direction = new THREE.Vector3();
    
    if (cameraMode === 'first-person') {
      const forwardDir = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.y);
      const rightDir = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.y);
      
      if (forward) direction.add(forwardDir);
      if (backward) direction.sub(forwardDir);
      if (right) direction.add(rightDir);
      if (left) direction.sub(rightDir);
    } else {
      const cameraDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraDirection);
      cameraDirection.y = 0;
      cameraDirection.normalize();
      
      const rightDir = new THREE.Vector3().crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0));
      
      if (forward) direction.add(cameraDirection);
      if (backward) direction.sub(cameraDirection);
      if (right) direction.add(rightDir);
      if (left) direction.sub(rightDir);
    }
    
    direction.normalize();

    // Running
    const canRun = run && stamina > 0 && grounded;
    setIsRunning(canRun);
    
    const speed = canRun ? MOVE_SPEED * RUN_MULTIPLIER : MOVE_SPEED;
    
    // Apply movement
    if (direction.length() > 0) {
      bodyRef.current.setLinvel({
        x: direction.x * speed,
        y: velocity.y,
        z: direction.z * speed,
      }, true);
      
      // Footstep sounds
      stepTimer.current += delta;
      if (grounded && stepTimer.current > (canRun ? 0.25 : 0.4)) {
        playStep();
        stepTimer.current = 0;
      }
    } else {
      bodyRef.current.setLinvel({
        x: velocity.x * 0.9,
        y: velocity.y,
        z: velocity.z * 0.9,
      }, true);
    }

    // Jump
    if (jump && grounded) {
      bodyRef.current.setLinvel({
        x: velocity.x,
        y: JUMP_FORCE,
        z: velocity.z,
      }, true);
      playJump();
    }

    // Update camera
    if (cameraMode === 'first-person') {
      camera.position.set(bodyPosition.x, bodyPosition.y + 0.8, bodyPosition.z);
      camera.rotation.order = 'YXZ';
      camera.rotation.y = rotation.y;
      camera.rotation.x = rotation.x;
    } else {
      const offset = new THREE.Vector3(0, 8, 12);
      camera.position.lerp(
        new THREE.Vector3(bodyPosition.x + offset.x, bodyPosition.y + offset.y, bodyPosition.z + offset.z),
        0.1
      );
      camera.lookAt(bodyPosition.x, bodyPosition.y + 1, bodyPosition.z);
    }

    // Update player position in store
    setPlayerPosition([bodyPosition.x, bodyPosition.y, bodyPosition.z]);

    // Rotate mesh to face movement direction
    if (meshRef.current && direction.length() > 0 && cameraMode !== 'first-person') {
      const targetRotation = Math.atan2(direction.x, direction.z);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotation,
        0.1
      );
    }
  });

  return (
    <RigidBody
      ref={bodyRef}
      position={position}
      colliders={false}
      mass={1}
      linearDamping={0.5}
      angularDamping={0.5}
      enabledRotations={[false, false, false]}
    >
      <CapsuleCollider args={[0.5, 0.5]} position={[0, 1, 0]} />
      
      {cameraMode !== 'first-person' && (
        <group ref={meshRef}>
          {/* Body */}
          <mesh castShadow position={[0, 1, 0]}>
            <capsuleGeometry args={[0.4, 0.8, 8, 16]} />
            <meshStandardMaterial 
              color="#00d4ff"
              emissive="#00d4ff"
              emissiveIntensity={0.3}
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>
          
          {/* Head */}
          <mesh castShadow position={[0, 1.8, 0]}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial 
              color="#00d4ff"
              emissive="#00d4ff"
              emissiveIntensity={0.3}
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>
          
          {/* Eyes */}
          <mesh position={[0.1, 1.85, 0.2]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial 
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={1}
            />
          </mesh>
          <mesh position={[-0.1, 1.85, 0.2]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial 
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={1}
            />
          </mesh>
          
          <pointLight 
            position={[0, 1.5, 0]} 
            color="#00d4ff" 
            intensity={5} 
            distance={10}
          />
        </group>
      )}
    </RigidBody>
  );
}
