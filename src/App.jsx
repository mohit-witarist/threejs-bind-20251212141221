import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { KeyboardControls } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

import SceneManager from './scenes/SceneManager';
import LoadingScreen from './ui/LoadingScreen';
import HUD from './ui/HUD';
import Dashboard from './ui/Dashboard';
import SettingsPanel from './ui/SettingsPanel';
import Minimap from './ui/Minimap';

import { useGameStore } from './state/gameStore';
import { useSettingsStore } from './state/settingsStore';

const keyboardMap = [
  { name: 'forward', keys: ['KeyW', 'ArrowUp'] },
  { name: 'backward', keys: ['KeyS', 'ArrowDown'] },
  { name: 'left', keys: ['KeyA', 'ArrowLeft'] },
  { name: 'right', keys: ['KeyD', 'ArrowRight'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'run', keys: ['ShiftLeft'] },
  { name: 'interact', keys: ['KeyE'] },
  { name: 'inventory', keys: ['KeyI'] },
  { name: 'pause', keys: ['Escape'] },
];

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { showDashboard, showSettings } = useGameStore();
  const { postProcessing, shadowQuality } = useSettingsStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full h-full relative">
      <KeyboardControls map={keyboardMap}>
        <Canvas
          shadows={shadowQuality !== 'off'}
          camera={{ fov: 75, near: 0.1, far: 1000 }}
          gl={{ 
            antialias: true, 
            alpha: false,
            powerPreference: 'high-performance'
          }}
          dpr={[1, 2]}
        >
          <color attach="background" args={['#0a0a0f']} />
          
          <Suspense fallback={null}>
            <Physics gravity={[0, -20, 0]} timeStep="vary">
              <SceneManager />
            </Physics>
          </Suspense>

          {postProcessing && (
            <EffectComposer>
              <Bloom
                luminanceThreshold={0.2}
                luminanceSmoothing={0.9}
                intensity={0.8}
              />
              <Vignette
                offset={0.3}
                darkness={0.5}
                blendFunction={BlendFunction.NORMAL}
              />
              <ChromaticAberration
                offset={[0.0005, 0.0005]}
                blendFunction={BlendFunction.NORMAL}
              />
            </EffectComposer>
          )}
        </Canvas>
      </KeyboardControls>

      <HUD />
      <Minimap />
      
      {showDashboard && <Dashboard />}
      {showSettings && <SettingsPanel />}
    </div>
  );
}
