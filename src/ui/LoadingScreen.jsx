import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    const texts = [
      'Initializing...',
      'Loading assets...',
      'Building world...',
      'Preparing physics...',
      'Almost ready...',
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + Math.random() * 15, 100);
        const textIndex = Math.floor((newProgress / 100) * (texts.length - 1));
        setLoadingText(texts[textIndex]);
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-game-dark flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        {/* Logo */}
        <motion.div
          animate={{ 
            rotateY: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-32 h-32 mx-auto mb-8 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-game-primary to-game-secondary rounded-2xl transform rotate-45" />
          <div className="absolute inset-2 bg-game-dark rounded-xl transform rotate-45" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-game font-bold text-game-primary neon-text">R3F</span>
          </div>
        </motion.div>

        <h1 className="text-3xl font-game font-bold text-white mb-2">
          World Engine
        </h1>
        <p className="text-game-primary mb-8 font-game">{loadingText}</p>

        {/* Progress bar */}
        <div className="w-80 h-2 bg-gray-800 rounded-full overflow-hidden mx-auto mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-game-primary to-game-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <p className="text-gray-400 font-game text-sm">{Math.round(progress)}%</p>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-gray-500 text-sm max-w-md"
        >
          <p className="font-game">
            💡 Tip: Use WASD to move, SHIFT to run, SPACE to jump
          </p>
        </motion.div>
      </motion.div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-game-primary rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 10,
              opacity: 0.3,
            }}
            animate={{
              y: -10,
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
}
