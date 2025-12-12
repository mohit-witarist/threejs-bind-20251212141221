import { useRef, useCallback, useEffect } from 'react';
import { useSettingsStore } from '../state/settingsStore';

export function useAudio() {
  const audioContextRef = useRef(null);
  const soundsRef = useRef({});
  const { soundEnabled, sfxVolume, musicVolume } = useSettingsStore();

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playTone = useCallback((frequency, duration, type = 'sine') => {
    if (!soundEnabled || !audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(sfxVolume * 0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, [soundEnabled, sfxVolume]);

  const playJump = useCallback(() => {
    playTone(400, 0.15, 'square');
    setTimeout(() => playTone(600, 0.1, 'square'), 50);
  }, [playTone]);

  const playStep = useCallback(() => {
    playTone(100 + Math.random() * 50, 0.05, 'triangle');
  }, [playTone]);

  const playInteract = useCallback(() => {
    playTone(800, 0.1, 'sine');
    setTimeout(() => playTone(1000, 0.1, 'sine'), 100);
    setTimeout(() => playTone(1200, 0.15, 'sine'), 200);
  }, [playTone]);

  const playCollect = useCallback(() => {
    playTone(523, 0.1, 'sine');
    setTimeout(() => playTone(659, 0.1, 'sine'), 100);
    setTimeout(() => playTone(784, 0.15, 'sine'), 200);
  }, [playTone]);

  const playUIClick = useCallback(() => {
    playTone(1000, 0.05, 'sine');
  }, [playTone]);

  return {
    playJump,
    playStep,
    playInteract,
    playCollect,
    playUIClick,
  };
}
