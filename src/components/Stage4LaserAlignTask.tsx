import React, { useState } from 'react';
import { Radio, AlertOctagon, CheckCircle2, Zap } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface EnergyCableTaskProps {
  onSuccess: () => void;
}

export const Stage4LaserAlignTask: React.FC<EnergyCableTaskProps> = ({ onSuccess }) => {
  const [sliderVal, setSliderVal] = useState(20);
  const [isLocked, setIsLocked] = useState(false);
  const target = 88; // Target frequency 88%

  const isMatched = Math.abs(sliderVal - target) <= 3;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSliderVal(val);
    if (Math.abs(val - target) <= 3) {
      soundEngine.playClick();
    }
  };

  const handleFirePortal = () => {
    if (isMatched) {
      soundEngine.playUnlockShatter();
      setIsLocked(true);
      setTimeout(() => {
        onSuccess();
      }, 500);
    } else {
      soundEngine.playComicalFakeout();
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-4 p-4 rounded-2xl bg-black/75 border border-red-500/40 backdrop-blur-xl shadow-[0_0_30px_rgba(239,68,68,0.3)] text-center animate-fade-in">
      <div className="flex items-center justify-center gap-1.5 text-red-400 text-xs font-mono uppercase tracking-widest mb-1.5">
        <Radio className="w-3.5 h-3.5 text-red-400 animate-spin" />
        <span>Stargate Calibration: 88.0 GHz</span>
      </div>

      <p className="text-xs text-red-200/80 mb-3">
        Slider ko drag karke <span className="font-bold text-amber-300 font-mono">88%</span> resonance frequency par set karo:
      </p>

      {/* Frequency Meter Bar */}
      <div className="px-3 py-2 bg-red-950/40 border border-red-500/30 rounded-xl mb-3">
        <div className="flex justify-between items-center text-xs font-mono mb-1">
          <span className="text-red-300/80">CURRENT: {sliderVal}%</span>
          <span
            className={`font-bold ${
              isMatched ? 'text-emerald-400 animate-pulse' : 'text-amber-400'
            }`}
          >
            {isMatched ? 'HARMONIC LOCK! ✅' : `OFFSET: ${Math.abs(sliderVal - target)}%`}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={sliderVal}
          onChange={handleSliderChange}
          className="w-full h-2.5 bg-black/60 rounded-lg appearance-none cursor-pointer accent-red-500"
        />

        <div className="flex justify-between text-[10px] text-white/40 font-mono mt-1">
          <span>0%</span>
          <span className="text-amber-400 font-bold">🎯 88%</span>
          <span>100%</span>
        </div>
      </div>

      <button
        type="button"
        disabled={!isMatched || isLocked}
        onClick={handleFirePortal}
        className={`w-full py-3 px-4 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
          isMatched
            ? 'bg-gradient-to-r from-red-600 via-pink-600 to-amber-500 text-white shadow-[0_0_25px_rgba(239,68,68,0.7)] active:scale-95 animate-pulse'
            : 'bg-white/10 text-white/40 cursor-not-allowed'
        }`}
      >
        {isLocked ? 'WARP INITIATED! 🚀' : isMatched ? 'DISCHARGE ENERGY CONDUIT ⚡' : 'ALIGN SLIDER TO 88% FIRST'}
      </button>
    </div>
  );
};
