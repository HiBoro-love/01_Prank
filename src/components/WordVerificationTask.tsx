import React, { useState } from 'react';
import { Sparkles, Terminal, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface MiniTaskProps {
  senderName: string;
  onSuccess: () => void;
}

export const WordVerificationTask: React.FC<MiniTaskProps> = ({ senderName, onSuccess }) => {
  const [inputVal, setInputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Users can type their own phrase or any of the suggested words
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputVal.trim();
    if (!clean) {
      soundEngine.playComicalFakeout();
      setErrorMsg('Kuch toh likho bhai! Khali dimaag mat chalao 😜');
      return;
    }

    if (clean.length < 2) {
      soundEngine.playComicalFakeout();
      setErrorMsg('Thoda bada word likho… at least 2 characters! 🧐');
      return;
    }

    setErrorMsg('');
    setIsVerifying(true);
    soundEngine.playClick();

    setTimeout(() => {
      setIsVerifying(false);
      soundEngine.playUnlockShatter();
      onSuccess();
    }, 700);
  };

  const handleQuickWord = (word: string) => {
    setInputVal(word);
    setErrorMsg('');
    soundEngine.playClick();
  };

  return (
    <div className="w-full max-w-md mx-auto my-4 p-5 rounded-2xl bg-black/75 border border-indigo-500/40 backdrop-blur-xl shadow-[0_0_35px_rgba(99,102,241,0.25)] text-left animate-fade-in">
      <div className="flex items-center gap-2 mb-3 text-indigo-300">
        <Terminal className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-mono uppercase tracking-wider font-semibold">
          Security Test: "Say The Magic Words"
        </span>
      </div>

      <p className="text-xs sm:text-sm text-indigo-100/90 mb-3 leading-relaxed">
        {senderName} ne password lock laga diya hai! Agla mystery portal kholne ke liye koi bhi word ya dialogue type karo:
      </p>

      {/* Quick Word chips */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {['Khul Ja Sim Sim 🪄', 'Anshuman OP 🔥', 'Pakka Last Hai? 😂', 'Secret 777'].map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleQuickWord(chip)}
            className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-indigo-950/70 border border-indigo-500/30 text-indigo-200 hover:bg-indigo-900/60 hover:border-cyan-400 transition-all cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      <form onSubmit={handleVerify} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            placeholder="Type your word here (e.g. Please Dikhao)..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-indigo-400/40 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm font-medium transition-all"
            autoFocus
          />
        </div>

        {errorMsg && (
          <div className="flex items-center gap-1.5 text-xs text-rose-300 bg-rose-950/60 p-2 rounded-lg border border-rose-500/30 animate-bounce-short">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isVerifying}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          {isVerifying ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-white" />
              <span>Checking with {senderName}…</span>
            </>
          ) : (
            <>
              <span>UNCLOCK PORTAL 🔓</span>
              <ArrowRight className="w-4 h-4 text-cyan-200" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
