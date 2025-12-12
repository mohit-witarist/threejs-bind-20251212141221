import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../state/gameStore';
import { useSettingsStore } from '../../state/settingsStore';
import { lerp } from '../../utils/math';

export default function Lighting({ preset = 'city' }) {
  const directionalRef = useRef();
  const { timeOfDay } = useGameStore();
  const { shadowQuality } = useSettingsStore();

  const lightConfig = useMemo(() => {
    switch (preset) {
      case 'forest':
        return {
          sunColor: new THREE.Color('#fffaf0'),
          ambientColor: new THREE.Color('#2d4a2d'),
          sunIntensity: 1.5,
          ambientIntensity: 0.4,
        };
      case 'space':
        return {
          sunColor: new THREE.Color('#ffffff'),
          ambientColor: new THREE.Color('#1a1a2e'),
          sunIntensity: 0.8,
          ambientIntensity: 0.1,
        };
      default:
        return {
          sunColor: new THREE.Color('#ffeedd'),
          ambientColor: new THREE.Color('#1a1a2e'),
          sunIntensity: 2,
          ambientIntensity: 0.3,
        };
    }
  }, [preset]);

  useFrame(() => {
    if (directionalRef.current && preset !== 'space') {
      const angle = timeOfDay * Math.PI * 2 - Math.PI / 2;
      const height = Math.sin(timeOfDay * Math.PI) * 50 + 20;
      
      directionalRef.current.position.x = Math.cos(angle) * 50;
      directionalRef.current.position.y = Math.max(height, 5);
      directionalRef.current.position.z = 30;
      
      const dayFactor = Math.max(0, Math.sin(timeOfDay * Math.PI));
      directionalRef.current.intensity = lightConfig.sunIntensity * dayFactor;
      
      const nightColor = new THREE.Color('#ff6600');
      const dayColor = lightConfig.sunColor;
      directionalRef.current.color.lerpColors(nightColor, dayColor, dayFactor);
    }
  });

  const shadowMapSize = useMemo(() => {
    switch (shadowQuality) {
      case 'low': return 512;
      case 'medium': return 1024;
      case 'high': return 2048;
      default: return 0;
    }
  }, [shadowQuality]);

  return (
    <>
      <ambientLight 
        color={lightConfig.ambientColor} 
        intensity={lightConfig.ambientIntensity} 
      />
      
      <directionalLight
        ref={directionalRef}
        position={[50, 50, 30]}
        intensity={lightConfig.sunIntensity}
        color={lightConfig.sunColor}
        castShadow={shadowQuality !== 'off'}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-far={200}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-bias={-0.0001}
      />
      
      <hemisphereLight
        skyColor={preset === 'space' ? '#1a1a3e' : '#87ceeb'}
        groundColor={preset === 'forest' ? '#2d4a2d' : '#1a1a2e'}
        intensity={0.3}
      />
    </>
  );
}
