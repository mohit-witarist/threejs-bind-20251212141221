import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Map, 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Camera,
  Download,
  Trash2
} from 'lucide-react';
import { useGameStore } from '../state/gameStore';
import { useAudio } from '../hooks/useAudio';

const scenes = [
  { id: 'city', name: 'City', description: 'Neon-lit urban environment' },
  { id: 'forest', name: 'Forest', description: 'Mystical woodland realm' },
  { id: 'space', name: 'Space', description: 'Orbital space station' },
];

const weatherOptions = [
  { id: 'clear', name: 'Clear', icon: Sun },
  { id: 'rain', name: 'Rain', icon: CloudRain },
  { id: 'snow', name: 'Snow', icon: CloudSnow },
  { id: 'storm', name: 'Storm', icon: Cloud },
];

export default function Dashboard() {
  const { 
    toggleDashboard, 
    currentScene, 
    setCurrentScene, 
    weather, 
    setWeather,
    timeOfDay,
    setTimeOfDay,
    screenshots
  } = useGameStore();
  
  const { playUIClick } = useAudio();

  const handleSceneChange = (sceneId) => {
    playUIClick();
    setCurrentScene(sceneId);
  };

  const handleWeatherChange = (weatherId) => {
    playUIClick();
    setWeather(weatherId);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={() => toggleDashboard()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass rounded-2xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto m-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-game font-bold text-white">
              <span className="text-game-primary">World</span> Dashboard
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleDashboard()}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scene Selection */}
            <div>
              <h3 className="text-lg font-game text-game-primary mb-4 flex items-center gap-2">
                <Map className="w-5 h-5" />
                Select World
              </h3>
              <div className="space-y-3">
                {scenes.map((scene) => (
                  <motion.button
                    key={scene.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSceneChange(scene.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      currentScene === scene.id
                        ? 'bg-game-primary/20 border-2 border-game-primary'
                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                    }`}
                  >
                    <div className="font-game font-bold text-white">{scene.name}</div>
                    <div className="text-sm text-gray-400">{scene.description}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Weather Control */}
            <div>
              <h3 className="text-lg font-game text-game-primary mb-4 flex items-center gap-2">
                <Sun className="w-5 h-5" />
                Weather
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {weatherOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleWeatherChange(option.id)}
                      className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                        weather === option.id
                          ? 'bg-game-primary/20 border-2 border-game-primary'
                          : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                      }`}
                    >
                      <Icon className={`w-8 h-8 ${weather === option.id ? 'text-game-primary' : 'text-gray-400'}`} />
                      <span className="font-game text-sm text-white">{option.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Time of Day */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-game text-game-primary mb-4">Time of Day</h3>
              <div className="flex items-center gap-4">
                <span className="text-yellow-400">🌅</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:bg-game-primary
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <span className="text-blue-400">🌙</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2 font-game">
                <span>Dawn</span>
                <span>Noon</span>
                <span>Dusk</span>
                <span>Midnight</span>
              </div>
            </div>

            {/* Screenshots Gallery */}
            {screenshots.length > 0 && (
              <div className="md:col-span-2">
                <h3 className="text-lg font-game text-game-primary mb-4 flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Screenshots ({screenshots.length})
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {screenshots.slice(-8).map((screenshot) => (
                    <div key={screenshot.id} className="relative group">
                      <img
                        src={screenshot.dataUrl}
                        alt="Screenshot"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            const link = document.createElement('a');
                            link.download = `screenshot-${screenshot.id}.png`;
                            link.href = screenshot.dataUrl;
                            link.click();
                          }}
                          className="p-2 bg-game-primary rounded-lg"
                        >
                          <Download className="w-4 h-4 text-white" />
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
