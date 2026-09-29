import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export const SoundToggle: React.FC = () => {
  const [isMuted, setIsMuted] = useState(soundEngine.getIsMuted());

  const toggle = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
    if (!next) {
      soundEngine.startAmbient();
      soundEngine.playClick();
    }
  };

  return (
    <button
      onClick={toggle}
      title={isMuted ? 'Turn Sound ON' : 'Turn Sound OFF'}
      className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-3.5 py-2 rounded-full backdrop-blur-md bg-black/40 border border-white/15 hover:border-cyan-400/50 hover:bg-black/60 text-white/90 hover:text-white transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-pointer group"
    >
      {isMuted ? (
        <VolumeX className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
      ) : (
        <Volume2 className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
      )}
      <span className="text-xs font-mono uppercase tracking-widest text-white/80 group-hover:text-cyan-300">
        {isMuted ? 'Sound: OFF' : 'Sound: ON'}
      </span>
      {!isMuted && (
        <div className="flex items-center gap-0.5 h-3 ml-0.5">
          <span className="w-0.5 h-2 bg-cyan-400 animate-pulse" />
          <span className="w-0.5 h-3 bg-cyan-300 animate-pulse delay-75" />
          <span className="w-0.5 h-1.5 bg-cyan-400 animate-pulse delay-150" />
        </div>
      )}
    </button>
  );
};
