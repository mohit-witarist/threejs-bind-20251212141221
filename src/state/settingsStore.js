import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      graphicsQuality: 'high',
      shadowQuality: 'high',
      postProcessing: true,
      particleEffects: true,
      soundEnabled: true,
      musicVolume: 0.7,
      sfxVolume: 0.8,
      mouseSensitivity: 0.5,
      invertY: false,
      showFPS: true,
      
      setGraphicsQuality: (quality) => set({ graphicsQuality: quality }),
      setShadowQuality: (quality) => set({ shadowQuality: quality }),
      setPostProcessing: (enabled) => set({ postProcessing: enabled }),
      setParticleEffects: (enabled) => set({ particleEffects: enabled }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setMusicVolume: (volume) => set({ musicVolume: volume }),
      setSfxVolume: (volume) => set({ sfxVolume: volume }),
      setMouseSensitivity: (sensitivity) => set({ mouseSensitivity: sensitivity }),
      setInvertY: (invert) => set({ invertY: invert }),
      setShowFPS: (show) => set({ showFPS: show }),
      
      resetToDefaults: () => set({
        graphicsQuality: 'high',
        shadowQuality: 'high',
        postProcessing: true,
        particleEffects: true,
        soundEnabled: true,
        musicVolume: 0.7,
        sfxVolume: 0.8,
        mouseSensitivity: 0.5,
        invertY: false,
        showFPS: true,
      }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
