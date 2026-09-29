import React, { useState } from 'react';
import { Sparkles, HeartHandshake, CheckCircle2, Star } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface CelestialOathTaskProps {
  senderName: string;
  onSuccess: () => void;
}

export const Stage5CelestialOathTask: React.FC<CelestialOathTaskProps> = ({
  senderName,
  onSuccess,
}) => {
  const [pledges, setPledges] = useState({
    laugh: false,
    noAnger: false,
    friendship: false,
  });

  const toggle = (key: keyof typeof pledges) => {
    soundEngine.playClick();
    setPledges((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecked = pledges.laugh && pledges.noAnger && pledges.friendship;

  const handleAscend = () => {
    if (allChecked) {
      soundEngine.playCelestialChords();
      onSuccess();
    } else {
      soundEngine.playComicalFakeout();
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-4 p-4 sm:p-5 rounded-2xl bg-black/75 border border-amber-400/50 backdrop-blur-xl shadow-[0_0_35px_rgba(245,158,11,0.3)] text-left animate-fade-in">
      <div className="flex items-center gap-2 text-amber-300 text-xs font-mono uppercase tracking-widest mb-2">
        <Star className="w-4 h-4 text-amber-400 animate-spin" />
        <span>Heavenly Gateway: Solemn Oath</span>
      </div>

      <p className="text-xs text-amber-100/80 mb-3.5 leading-relaxed">
        {senderName} ka final surprise dekhne se pehle in 3 sharto pe agree karo:
      </p>

      <div className="space-y-2 mb-4">
        {[
          {
            key: 'laugh' as const,
            text: '1. Jo bhi dikhega, main hasunga gussa nahi hounga 😂',
          },
          {
            key: 'noAnger' as const,
            text: `2. Main ${senderName} ko block nahi karunga 🤝`,
          },
          {
            key: 'friendship' as const,
            text: '3. Mera time barbaad hua toh dosto ka bhi karwaunga 😈',
          },
        ].map((item) => (
          <label
            key={item.key}
            onClick={() => toggle(item.key)}
            className={`flex items-start gap-2.5 p-2 rounded-xl border text-xs cursor-pointer select-none transition-all ${
              pledges[item.key]
                ? 'bg-amber-950/60 border-amber-400/80 text-amber-200'
                : 'bg-white/5 border-white/10 text-white/60 hover:border-amber-400/30'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-md mt-0.5 shrink-0 flex items-center justify-center border transition-all ${
                pledges[item.key]
                  ? 'bg-amber-400 border-amber-400 text-black'
                  : 'border-white/30 bg-transparent'
              }`}
            >
              {pledges[item.key] && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <span className="leading-snug">{item.text}</span>
          </label>
        ))}
      </div>

      <button
        type="button"
        disabled={!allChecked}
        onClick={handleAscend}
        className={`w-full py-3 px-4 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
          allChecked
            ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-black shadow-[0_0_25px_rgba(245,158,11,0.6)] hover:brightness-110 active:scale-95 animate-pulse'
            : 'bg-white/10 text-white/30 cursor-not-allowed'
        }`}
      >
        {allChecked ? 'I SWEAR! REVEAL THE TRUTH ✨' : 'TICK ALL 3 OATHS TO PROCEED'}
      </button>
    </div>
  );
};
