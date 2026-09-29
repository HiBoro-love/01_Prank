import React from 'react';
import { Eye } from 'lucide-react';

interface EasterEggBannerProps {
  message: string | null;
}

export const EasterEggBanner: React.FC<EasterEggBannerProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-bounce pointer-events-none">
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-200 text-xs font-mono shadow-[0_0_25px_rgba(6,182,212,0.4)] backdrop-blur-md">
        <Eye className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  );
};
