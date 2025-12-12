import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useGameStore = create(
  persist(
    (set, get) => ({
      currentScene: 'city',
      cameraMode: 'third-person',
      weather: 'clear',
      timeOfDay: 0.5,
      isPaused: false,
      showDashboard: false,
      showSettings: false,
      showMinimap: true,
      
      interactableObjects: [],
      collectedItems: [],
      screenshots: [],
      
      playerPosition: [0, 2, 0],
      playerRotation: [0, 0, 0],
      
      stats: {
        fps: 60,
        drawCalls: 0,
        triangles: 0,
      },

      setCurrentScene: (scene) => set({ currentScene: scene }),
      setCameraMode: (mode) => set({ cameraMode: mode }),
      setWeather: (weather) => set({ weather }),
      setTimeOfDay: (time) => set({ timeOfDay: time }),
      togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
      toggleDashboard: () => set((state) => ({ showDashboard: !state.showDashboard })),
      toggleSettings: () => set((state) => ({ showSettings: !state.showSettings })),
      toggleMinimap: () => set((state) => ({ showMinimap: !state.showMinimap })),
      
      setPlayerPosition: (pos) => set({ playerPosition: pos }),
      setPlayerRotation: (rot) => set({ playerRotation: rot }),
      
      addCollectedItem: (item) => set((state) => ({
        collectedItems: [...state.collectedItems, item]
      })),
      
      addScreenshot: (screenshot) => set((state) => ({
        screenshots: [...state.screenshots, screenshot]
      })),
      
      updateStats: (stats) => set({ stats }),
      
      resetGame: () => set({
        playerPosition: [0, 2, 0],
        collectedItems: [],
        timeOfDay: 0.5,
        weather: 'clear',
      }),
    }),
    {
      name: 'game-storage',
      partialize: (state) => ({
        currentScene: state.currentScene,
        collectedItems: state.collectedItems,
        screenshots: state.screenshots,
      }),
    }
  )
);
