import React, { useState } from 'react';
import { Fingerprint, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface BiometricTaskProps {
  onSuccess: () => void;
}

export const Stage1BiometricTask: React.FC<BiometricTaskProps> = ({ onSuccess }) => {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [verified, setVerified] = useState(false);

  const timerRef = React.useRef<number | null>(null);

  const startHold = () => {
    if (verified) return;
    setHolding(true);
    soundEngine.playClick();

    const interval = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(interval);
          setVerified(true);
          soundEngine.playUnlockShatter();
          setTimeout(() => {
            onSuccess();
          }, 400);
          return 100;
        }
        return prev + 5;
      });
    }, 40);
    timerRef.current = interval;
  };

  const endHold = () => {
    if (verified) return;
    setHolding(false);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    setProgress(0);
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-6 p-4 rounded-2xl bg-black/60 border border-cyan-500/40 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.25)] text-center animate-fade-in">
      <div className="flex items-center justify-center gap-2 mb-2 text-cyan-300 text-xs font-mono uppercase tracking-widest">
        <Zap className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
        <span>Step 1: Bio-Resonance Sync</span>
      </div>

      <p className="text-xs text-cyan-100/70 mb-4 font-mono">
        Hold finger/mouse down on sensor to calibrate frequency:
      </p>

      {/* Sensor Pad */}
      <div className="relative flex flex-col items-center">
        <button
          type="button"
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          className={`relative w-20 h-20 rounded-2xl flex items-center justify-center transition-all cursor-pointer select-none ${
            holding
              ? 'scale-95 bg-cyan-950 border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.8)]'
              : 'bg-black/80 border border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
          }`}
        >
          {verified ? (
            <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
          ) : (
            <Fingerprint
              className={`w-10 h-10 transition-colors ${
                holding ? 'text-cyan-300 animate-pulse' : 'text-cyan-500/70'
              }`}
            />
          )}

          {/* Progress Circular border or overlay */}
          <div
            className="absolute inset-0 rounded-2xl bg-cyan-400/20 transition-all pointer-events-none"
            style={{ height: `${progress}%`, bottom: 0, top: 'auto' }}
          />
        </button>

        {/* Progress Bar */}
        <div className="w-36 h-2 mt-3 bg-white/10 rounded-full overflow-hidden border border-cyan-500/30">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[11px] font-mono text-cyan-300/80 mt-1">
          {verified ? 'SYNCHRONIZED ✅' : holding ? `Scanning... ${progress}%` : 'PRESS & HOLD'}
        </span>
      </div>
    </div>
  );
};
