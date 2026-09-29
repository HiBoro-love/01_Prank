import React, { useState } from 'react';
import { KeyRound, ShieldAlert, CheckCircle2, RotateCw } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface VaultTumblerTaskProps {
  onSuccess: () => void;
}

export const Stage2VaultTumblerTask: React.FC<VaultTumblerTaskProps> = ({ onSuccess }) => {
  // Target sequence e.g. 7 - 3 - 9
  const targets = [7, 3, 9];
  const [currentPins, setCurrentPins] = useState([1, 1, 1]);
  const [errorMsg, setErrorMsg] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const rotatePin = (index: number) => {
    soundEngine.playClick();
    setErrorMsg(false);
    setCurrentPins((prev) => {
      const next = [...prev];
      next[index] = (next[index] % 9) + 1; // 1 to 9
      return next;
    });
  };

  const handleVerify = () => {
    if (
      currentPins[0] === targets[0] &&
      currentPins[1] === targets[1] &&
      currentPins[2] === targets[2]
    ) {
      soundEngine.playUnlockShatter();
      setIsUnlocked(true);
      setTimeout(() => {
        onSuccess();
      }, 500);
    } else {
      soundEngine.playComicalFakeout();
      setErrorMsg(true);
    }
  };

  const handleHint = () => {
    soundEngine.playClick();
    setCurrentPins([7, 3, 9]);
    setErrorMsg(false);
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-4 p-4 rounded-2xl bg-black/75 border border-purple-500/40 backdrop-blur-xl shadow-[0_0_30px_rgba(168,85,247,0.3)] text-center animate-fade-in">
      <div className="flex items-center justify-center gap-1.5 text-purple-300 text-xs font-mono uppercase tracking-widest mb-1.5">
        <KeyRound className="w-3.5 h-3.5 text-amber-400" />
        <span>Vault Security: Align 3 Rune Rings</span>
      </div>

      <p className="text-xs text-purple-200/80 mb-3">
        Rune frequencies align at <span className="font-bold font-mono text-amber-300 px-1.5 py-0.5 rounded bg-purple-950 border border-purple-500/30">7 - 3 - 9</span>. Click each dial to rotate:
      </p>

      {/* Tumblers */}
      <div className="flex justify-center gap-3 my-3">
        {currentPins.map((val, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => rotatePin(idx)}
              className="w-14 h-16 rounded-xl bg-gradient-to-b from-[#2a133d] to-[#12081c] border-2 border-purple-400 hover:border-amber-400 text-white font-mono font-black text-2xl flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)] active:scale-95 transition-all cursor-pointer group"
            >
              <span className="group-hover:scale-110 transition-transform text-amber-300">
                {val}
              </span>
            </button>
            <span className="text-[10px] text-purple-400/80 font-mono mt-1">Tap to turn</span>
          </div>
        ))}
      </div>

      {errorMsg && (
        <div className="text-xs text-rose-300 font-mono flex items-center justify-center gap-1 mb-2 animate-bounce-short">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Combinations match nahi ho rahi! Hint: 7 - 3 - 9</span>
        </div>
      )}

      <div className="flex gap-2 justify-center mt-3">
        <button
          type="button"
          onClick={handleVerify}
          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95 transition-all cursor-pointer"
        >
          {isUnlocked ? 'VAULT UNLOCKED 🔓' : 'DISENGAGE TUMBLERS ⚡'}
        </button>

        <button
          type="button"
          onClick={handleHint}
          title="Auto-solve hint"
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 hover:text-white transition-colors"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
