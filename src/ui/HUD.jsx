import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Zap, 
  Gem, 
  Camera, 
  Settings, 
  LayoutDashboard,
  Map,
  Eye,
  EyeOff
} from 'lucide-react';
import { usePlayerStore } from '../state/playerStore';
import { useGameStore } from '../state/gameStore';
import { useSettingsStore } from '../state/settingsStore';

function HealthBar() {
  const { health, maxHealth } = usePlayerStore();
  const percentage = (health / maxHealth) * 100;

  return (
    <div className="flex items-center gap-3">
      <Heart className="w-6 h-6 text-red-500" />
      <div className="w-40 h-3 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-red-600 to-red-400"
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <span className="text-white font-game text-sm w-12">{health}/{maxHealth}</span>
    </div>
  );
}

function StaminaBar() {
  const { stamina, maxStamina } = usePlayerStore();
  const percentage = (stamina / maxStamina) * 100;

  return (
    <div className="flex items-center gap-3">
      <Zap className="w-6 h-6 text-yellow-500" />
      <div className="w-40 h-3 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400"
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <span className="text-white font-game text-sm w-12">{Math.round(stamina)}/{maxStamina}</span>
    </div>
  );
}

function CollectiblesCounter() {
  const { collectedItems } = useGameStore();
  const gems = collectedItems.filter(item => item.type === 'gem');
  const totalValue = gems.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div 
      className="flex items-center gap-2 glass px-4 py-2 rounded-lg"
      whileHover={{ scale: 1.05 }}
    >
      <Gem className="w-5 h-5 text-cyan-400" />
      <span className="text-cyan-400 font-game font-bold">{totalValue}</span>
    </motion.div>
  );
}

function FPSCounter() {
  const { stats } = useGameStore();
  const { showFPS } = useSettingsStore();

  if (!showFPS) return null;

  return (
    <div className="glass px-3 py-1 rounded text-xs font-game">
      <span className="text-green-400">{stats.fps} FPS</span>
      <span className="text-gray-500 ml-2">|</span>
      <span className="text-gray-400 ml-2">{stats.drawCalls} draws</span>
    </div>
  );
}

function QuickActions() {
  const { toggleDashboard, toggleSettings, showMinimap, toggleMinimap, cameraMode, setCameraMode } = useGameStore();

  return (
    <div className="flex gap-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => toggleDashboard()}
        className="glass p-3 rounded-lg hover:bg-game-primary/20 transition-colors"
      >
        <LayoutDashboard className="w-5 h-5 text-game-primary" />
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => toggleSettings()}
        className="glass p-3 rounded-lg hover:bg-game-primary/20 transition-colors"
      >
        <Settings className="w-5 h-5 text-game-primary" />
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => toggleMinimap()}
        className="glass p-3 rounded-lg hover:bg-game-primary/20 transition-colors"
      >
        <Map className={`w-5 h-5 ${showMinimap ? 'text-game-primary' : 'text-gray-500'}`} />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCameraMode(cameraMode === 'first-person' ? 'third-person' : 'first-person')}
        className="glass p-3 rounded-lg hover:bg-game-primary/20 transition-colors"
      >
        {cameraMode === 'first-person' ? (
          <Eye className="w-5 h-5 text-game-primary" />
        ) : (
          <EyeOff className="w-5 h-5 text-gray-400" />
        )}
      </motion.button>
    </div>
  );
}

function ControlsHint() {
  const { cameraMode } = useGameStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass px-4 py-2 rounded-lg"
    >
      <div className="flex gap-4 text-xs font-game text-gray-400">
        <span><kbd className="bg-gray-700 px-2 py-1 rounded">WASD</kbd> Move</span>
        <span><kbd className="bg-gray-700 px-2 py-1 rounded">SHIFT</kbd> Run</span>
        <span><kbd className="bg-gray-700 px-2 py-1 rounded">SPACE</kbd> Jump</span>
        {cameraMode === 'first-person' && (
          <span><kbd className="bg-gray-700 px-2 py-1 rounded">MOUSE</kbd> Look</span>
        )}
      </div>
    </motion.div>
  );
}

export default function HUD() {
  const { isPaused, currentScene } = useGameStore();

  return (
    <AnimatePresence>
      {!isPaused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-40"
        >
          {/* Top Left - Status Bars */}
          <div className="absolute top-4 left-4 space-y-2 pointer-events-auto">
            <HealthBar />
            <StaminaBar />
          </div>

          {/* Top Right - Quick Actions & Stats */}
          <div className="absolute top-4 right-4 space-y-3 pointer-events-auto">
            <div className="flex items-center gap-3">
              <CollectiblesCounter />
              <FPSCounter />
            </div>
            <QuickActions />
          </div>

          {/* Bottom Center - Controls Hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
            <ControlsHint />
          </div>

          {/* Top Center - Scene Info */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <div className="glass px-4 py-2 rounded-lg">
              <span className="text-game-primary font-game font-bold capitalize">{currentScene} World</span>
            </div>
          </div>

          {/* Crosshair for first-person mode */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-1 h-1 bg-white rounded-full opacity-50" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
