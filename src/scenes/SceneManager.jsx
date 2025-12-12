import React, { Suspense } from 'react';
import { useGameStore } from '../state/gameStore';
import CityScene from './CityScene';
import ForestScene from './ForestScene';
import SpaceScene from './SpaceScene';

const scenes = {
  city: CityScene,
  forest: ForestScene,
  space: SpaceScene,
};

export default function SceneManager() {
  const currentScene = useGameStore((state) => state.currentScene);
  const SceneComponent = scenes[currentScene] || CityScene;

  return (
    <Suspense fallback={null}>
      <SceneComponent />
    </Suspense>
  );
}
