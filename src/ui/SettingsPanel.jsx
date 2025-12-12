import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Monitor, 
  Volume2, 
  VolumeX,
  MousePointer,
  RotateCcw,
  Sparkles,
  Sun,
  Cpu
} from 'lucide-react';
import { useGameStore } from '../state/gameStore';
import { useSettingsStore } from '../state/settingsStore';
import { useAudio } from '../hooks/useAudio';

export default function SettingsPanel() {
  const { toggleSettings } = useGameStore();
  const {
    graphicsQuality,
    setGraphicsQuality,
    shadowQuality,
    setShadowQuality,
    postProcessing,
    setPostProcessing,
    particleEffects,
    setParticleEffects,
    soundEnabled,
    setSoundEnabled,
    musicVolume,
    setMusicVolume,
    sfxVolume,
    setSfxVolume,
    mouseSensitivity,
    setMouseSensitivity,
    invertY,
    setInvertY,
    showFPS,
    setShowFPS,
    resetToDefaults,
  } = useSettingsStore();

  const { playUIClick } = useAudio();

  const handleToggle = (setter, value) => {
    playUIClick();
    setter(value);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={() => toggleSettings()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, x: 100 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          exit={{ scale: 0.9, opacity: 0, x: 100 }}
          className="glass rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto m-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-game font-bold text-white">
              <span className="text-game-primary">Settings</span>
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleSettings()}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </motion.button>
          </div>

          <div className="space-y-6">
            {/* Graphics Section */}
            <div>
              <h3 className="text-lg font-game text-game-primary mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Graphics
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 font-game mb-2 block">Quality Preset</label>
                  <div className="flex gap-2">
                    {['low', 'medium', 'high'].map((quality) => (
                      <motion.button
                        key={quality}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleToggle(setGraphicsQuality, quality)}
                        className={`flex-1 py-2 rounded-lg font-game text-sm capitalize transition-all ${
                          graphicsQuality === quality
                            ? 'bg-game-primary text-black'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {quality}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 font-game mb-2 block">Shadow Quality</label>
                  <div className="flex gap-2">
                    {['off', 'low', 'medium', 'high'].map((quality) => (
                      <motion.button
                        key={quality}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleToggle(setShadowQuality, quality)}
                        className={`flex-1 py-2 rounded-lg font-game text-xs capitalize transition-all ${
                          shadowQuality === quality
                            ? 'bg-game-primary text-black'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {quality}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <ToggleOption
                  icon={<Sparkles className="w-5 h-5" />}
                  label="Post Processing"
                  description="Bloom, vignette, and effects"
                  value={postProcessing}
                  onChange={() => handleToggle(setPostProcessing, !postProcessing)}
                />

                <ToggleOption
                  icon={<Sun className="w-5 h-5" />}
                  label="Particle Effects"
                  description="Dust, rain, and atmospheric particles"
                  value={particleEffects}
                  onChange={() => handleToggle(setParticleEffects, !particleEffects)}
                />

                <ToggleOption
                  icon={<Cpu className="w-5 h-5" />}
                  label="Show FPS"
                  description="Display performance stats"
                  value={showFPS}
                  onChange={() => handleToggle(setShowFPS, !showFPS)}
                />
              </div>
            </div>

            {/* Audio Section */}
            <div>
              <h3 className="text-lg font-game text-game-primary mb-4 flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Audio
              </h3>

              <div className="space-y-4">
                <ToggleOption
                  icon={soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  label="Sound"
                  description="Enable all game sounds"
                  value={soundEnabled}
                  onChange={() => handleToggle(setSoundEnabled, !soundEnabled)}
                />

                <SliderOption
                  label="Music Volume"
                  value={musicVolume}
                  onChange={setMusicVolume}
                />

                <SliderOption
                  label="SFX Volume"
                  value={sfxVolume}
                  onChange={setSfxVolume}
                />
              </div>
            </div>

            {/* Controls Section */}
            <div>
              <h3 className="text-lg font-game text-game-primary mb-4 flex items-center gap-2">
                <MousePointer className="w-5 h-5" />
                Controls
              </h3>

              <div className="space-y-4">
                <SliderOption
                  label="Mouse Sensitivity"
                  value={mouseSensitivity}
                  onChange={setMouseSensitivity}
                />

                <ToggleOption
                  icon={<MousePointer className="w-5 h-5" />}
                  label="Invert Y-Axis"
                  description="Inverted vertical mouse movement"
                  value={invertY}
                  onChange={() => handleToggle(setInvertY, !invertY)}
                />
              </div>
            </div>

            {/* Reset Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                playUIClick();
                resetToDefaults();
              }}
              className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-game text-white flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Reset to Defaults
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ToggleOption({ icon, label, description, value, onChange }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="text-game-primary">{icon}</div>
        <div>
          <div className="font-game text-white text-sm">{label}</div>
          {description && <div className="text-xs text-gray-500">{description}</div>}
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onChange}
        className={`w-12 h-6 rounded-full transition-colors ${
          value ? 'bg-game-primary' : 'bg-gray-600'
        }`}
      >
        <motion.div
          className="w-5 h-5 bg-white rounded-full shadow-lg"
          animate={{ x: value ? 26 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </div>
  );
}

function SliderOption({ label, value, onChange }) {
  return (
    <div className="p-3 bg-white/5 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="font-game text-white text-sm">{label}</span>
        <span className="text-game-primary font-game text-sm">{Math.round(value * 100)}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:bg-game-primary
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  );
}
