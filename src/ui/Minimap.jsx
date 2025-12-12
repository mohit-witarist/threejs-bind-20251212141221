import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../state/gameStore';

export default function Minimap() {
  const { showMinimap, playerPosition, currentScene } = useGameStore();

  const mapConfig = useMemo(() => {
    switch (currentScene) {
      case 'city':
        return { 
          bgColor: '#1a1a2e', 
          gridColor: '#2d2d44',
          playerColor: '#00d4ff',
          scale: 0.8 
        };
      case 'forest':
        return { 
          bgColor: '#1a3d2a', 
          gridColor: '#2d5a3d',
          playerColor: '#4ade80',
          scale: 0.8 
        };
      case 'space':
        return { 
          bgColor: '#0a0a1a', 
          gridColor: '#1a1a3a',
          playerColor: '#7c3aed',
          scale: 0.5 
        };
      default:
        return { 
          bgColor: '#1a1a2e', 
          gridColor: '#2d2d44',
          playerColor: '#00d4ff',
          scale: 0.8 
        };
    }
  }, [currentScene]);

  const normalizedPosition = useMemo(() => {
    const x = (playerPosition[0] / 100) * 50 + 50;
    const y = (playerPosition[2] / 100) * 50 + 50;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  }, [playerPosition]);

  return (
    <AnimatePresence>
      {showMinimap && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-4 left-4 z-40"
        >
          <div 
            className="w-40 h-40 rounded-xl overflow-hidden border-2 border-game-primary/30 shadow-lg"
            style={{ backgroundColor: mapConfig.bgColor }}
          >
            {/* Grid */}
            <svg className="absolute inset-0 w-full h-full">
              {[...Array(5)].map((_, i) => (
                <React.Fragment key={i}>
                  <line
                    x1={`${(i + 1) * 20}%`}
                    y1="0"
                    x2={`${(i + 1) * 20}%`}
                    y2="100%"
                    stroke={mapConfig.gridColor}
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1={`${(i + 1) * 20}%`}
                    x2="100%"
                    y2={`${(i + 1) * 20}%`}
                    stroke={mapConfig.gridColor}
                    strokeWidth="1"
                  />
                </React.Fragment>
              ))}
            </svg>

            {/* Static objects representation */}
            {currentScene === 'city' && (
              <>
                {[-40, -20, 20, 40].map((pos, i) => (
                  <div
                    key={i}
                    className="absolute w-1 bg-gray-600"
                    style={{
                      left: `${50 + pos * 0.5}%`,
                      top: '10%',
                      height: '80%',
                      opacity: 0.3,
                    }}
                  />
                ))}
                {[-40, -20, 20, 40].map((pos, i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute h-1 bg-gray-600"
                    style={{
                      top: `${50 + pos * 0.5}%`,
                      left: '10%',
                      width: '80%',
                      opacity: 0.3,
                    }}
                  />
                ))}
              </>
            )}

            {/* Player indicator */}
            <motion.div
              className="absolute w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: mapConfig.playerColor,
                boxShadow: `0 0 10px ${mapConfig.playerColor}`,
                left: `${normalizedPosition.x}%`,
                top: `${normalizedPosition.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />

            {/* Compass */}
            <div className="absolute top-2 right-2 text-xs font-game text-gray-500">
              N
            </div>

            {/* Coordinates */}
            <div className="absolute bottom-1 left-1 text-[8px] font-game text-gray-500">
              {Math.round(playerPosition[0])}, {Math.round(playerPosition[2])}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
