import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { usePlayerStore } from '../state/playerStore';
import { useGameStore } from '../state/gameStore';

export function useGameLoop() {
  const lastTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);
  const fpsRef = useRef(60);
  
  const { stamina, maxStamina, isRunning, regenerateStamina, useStamina } = usePlayerStore();
  const { isPaused, updateStats, timeOfDay, setTimeOfDay } = useGameStore();

  useFrame((state, delta) => {
    if (isPaused) return;

    frameCountRef.current++;
    const currentTime = performance.now();
    
    if (currentTime - lastTimeRef.current >= 1000) {
      fpsRef.current = frameCountRef.current;
      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;
      
      updateStats({
        fps: fpsRef.current,
        drawCalls: state.gl.info.render.calls,
        triangles: state.gl.info.render.triangles,
      });
    }

    if (isRunning && stamina > 0) {
      useStamina(delta * 20);
    } else if (!isRunning && stamina < maxStamina) {
      regenerateStamina(delta * 10);
    }

    const newTime = (timeOfDay + delta * 0.01) % 1;
    setTimeOfDay(newTime);
  });

  return { fps: fpsRef.current };
}
