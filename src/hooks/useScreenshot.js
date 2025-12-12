import { useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import { useGameStore } from '../state/gameStore';

export function useScreenshot() {
  const { gl, scene, camera } = useThree();
  const addScreenshot = useGameStore((state) => state.addScreenshot);

  const takeScreenshot = useCallback(() => {
    gl.render(scene, camera);
    const dataUrl = gl.domElement.toDataURL('image/png');
    
    const screenshot = {
      id: Date.now(),
      dataUrl,
      timestamp: new Date().toISOString(),
    };
    
    addScreenshot(screenshot);
    
    return screenshot;
  }, [gl, scene, camera, addScreenshot]);

  const downloadScreenshot = useCallback((dataUrl, filename = 'screenshot.png') => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }, []);

  return { takeScreenshot, downloadScreenshot };
}
