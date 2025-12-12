import { useEffect, useState } from 'react';

export function useKeyboard() {
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    run: false,
    interact: false,
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.code;
      setKeys((prev) => {
        const newKeys = { ...prev };
        if (key === 'KeyW' || key === 'ArrowUp') newKeys.forward = true;
        if (key === 'KeyS' || key === 'ArrowDown') newKeys.backward = true;
        if (key === 'KeyA' || key === 'ArrowLeft') newKeys.left = true;
        if (key === 'KeyD' || key === 'ArrowRight') newKeys.right = true;
        if (key === 'Space') newKeys.jump = true;
        if (key === 'ShiftLeft') newKeys.run = true;
        if (key === 'KeyE') newKeys.interact = true;
        return newKeys;
      });
    };

    const handleKeyUp = (e) => {
      const key = e.code;
      setKeys((prev) => {
        const newKeys = { ...prev };
        if (key === 'KeyW' || key === 'ArrowUp') newKeys.forward = false;
        if (key === 'KeyS' || key === 'ArrowDown') newKeys.backward = false;
        if (key === 'KeyA' || key === 'ArrowLeft') newKeys.left = false;
        if (key === 'KeyD' || key === 'ArrowRight') newKeys.right = false;
        if (key === 'Space') newKeys.jump = false;
        if (key === 'ShiftLeft') newKeys.run = false;
        if (key === 'KeyE') newKeys.interact = false;
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
}
