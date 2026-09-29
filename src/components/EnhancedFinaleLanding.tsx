import React, { useState } from 'react';
import {
  Award,
  Share2,
  RefreshCw,
  Clock,
  CheckCircle2,
  PartyPopper,
  Sparkles,
  Flame,
  Volume2,
  MessageCircle,
  ThumbsUp,
  Laugh,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audio';
import { getShareUrl } from '../utils/url';

interface EnhancedFinaleLandingProps {
  senderName: string;
  stageProgress: number;
  secondsElapsed: number;
  onOpenCertificate: () => void;
  onOpenPrankModal: () => void;
  onReplay: () => void;
}

export const EnhancedFinaleLanding: React.FC<EnhancedFinaleLandingProps> = ({
  senderName,
  stageProgress,
  secondsElapsed,
  onOpenCertificate,
  onOpenPrankModal,
  onReplay,
}) => {
  const [reactionGiven, setReactionGiven] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const minutes = Math.floor(secondsElapsed / 60);
  const remainingSecs = secondsElapsed % 60;
  const timeFormatted = `${minutes > 0 ? `${minutes}m ` : ''}${remainingSecs}s`;

  const handleQuickShare = () => {
    const url = getShareUrl(senderName);
    const message = `Bhai ${senderName} ne mujhe ${timeFormatted} tak ghumaya aur last me sabse funny surprise diya 😂🔥 Ek baar khud dekh: ${url}`;

    if (navigator.share) {
      navigator.share({
        title: `${senderName} Has Something For You…`,
        text: message,
        url: url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${message}\n${url}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }

    soundEngine.playTrollCelebration();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleReaction = (emoji: string) => {
    setReactionGiven(emoji);
    soundEngine.playUnlockShatter();
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 },
    });
  };

  return (
    <div className="pointer-events-auto w-full max-w-3xl mx-auto flex flex-col items-center animate-fade-in px-2 sm:px-4 py-4">
      {/* 1. Sequential Punchline Banner */}
      <div className="w-full space-y-3.5 mb-6 text-center">
        {stageProgress >= 1 && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs sm:text-sm font-mono tracking-widest uppercase shadow-[0_0_25px_rgba(244,63,94,0.3)] animate-fade-in backdrop-blur-md">
            <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>Honest Evaluation Protocol</span>
          </div>
        )}

        {stageProgress >= 1 && (
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-serif tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-100 to-amber-200 drop-shadow-[0_0_40px_rgba(244,63,94,0.6)] leading-tight animate-fade-in">
            YOU ARE DOING GREAT, MAN ❤️
          </h1>
        )}

        {stageProgress >= 2 && (
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-orange-400 drop-shadow-[0_0_30px_rgba(245,158,11,0.5)] animate-fade-in">
            KEEP WASTING YOUR TIME 😂
          </h2>
        )}

        {stageProgress >= 3 && (
          <p className="text-sm sm:text-lg text-white/90 max-w-lg mx-auto bg-black/60 px-5 py-3 rounded-2xl border border-white/15 backdrop-blur-xl shadow-lg leading-relaxed animate-fade-in">
            <span className="font-extrabold text-cyan-300 tracking-wide">{senderName}</span>{' '}
            ne tumhara keemti time successfully aur bohot pyaar se barbaad kar diya hai.
          </p>
        )}

        {stageProgress >= 4 && (
          <div className="pt-1 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-2xl bg-emerald-950/80 border-2 border-emerald-400 text-emerald-300 font-mono font-black text-sm sm:text-base tracking-widest shadow-[0_0_35px_rgba(16,185,129,0.5)] animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>MISSION ACCOMPLISHED 100%</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Interactive "Verdict & Stats" Card (Rich, engaging, zero-boring UI) */}
      {stageProgress >= 4 && (
        <div className="w-full bg-gradient-to-b from-[#18182e]/90 via-[#0e0e1c]/90 to-[#080812]/95 border border-amber-400/40 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.25)] backdrop-blur-2xl animate-fade-in mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {/* Stat 1 */}
            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 flex flex-col items-center text-center">
              <Clock className="w-5 h-5 text-amber-400 mb-1" />
              <span className="text-[11px] font-mono uppercase text-white/60">Time Dedicated</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-amber-300 mt-0.5">
                {timeFormatted}
              </span>
            </div>

            {/* Stat 2 */}
            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 flex flex-col items-center text-center">
              <PartyPopper className="w-5 h-5 text-cyan-400 mb-1" />
              <span className="text-[11px] font-mono uppercase text-white/60">Levels Cleared</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-cyan-300 mt-0.5">
                6 / 6 Max
              </span>
            </div>

            {/* Stat 3 */}
            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 flex flex-col items-center text-center">
              <Laugh className="w-5 h-5 text-pink-400 mb-1" />
              <span className="text-[11px] font-mono uppercase text-white/60">Patience Level</span>
              <span className="text-xl sm:text-2xl font-black font-serif text-pink-300 mt-0.5">
                God Level 👑
              </span>
            </div>
          </div>

          {/* Quick Reaction Meter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 mb-5">
            <span className="text-xs sm:text-sm font-medium text-white/80">
              Kaisa laga {senderName} ka surprise? Ek react do:
            </span>
            <div className="flex items-center gap-2">
              {[
                { emoji: '😂', label: 'Hasi aagyi' },
                { emoji: '🤡', label: 'Kat gaya' },
                { emoji: '🔥', label: 'OP Troll' },
                { emoji: '💀', label: 'Dead' },
              ].map((item) => (
                <button
                  key={item.emoji}
                  type="button"
                  onClick={() => handleReaction(item.emoji)}
                  className={`px-3 py-1.5 rounded-xl border text-sm transition-all cursor-pointer ${
                    reactionGiven === item.emoji
                      ? 'bg-amber-400/20 border-amber-400 scale-110 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                      : 'bg-black/40 border-white/10 hover:border-white/30 hover:scale-105'
                  }`}
                  title={item.label}
                >
                  <span className="text-base">{item.emoji}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Certificate Button */}
            <button
              type="button"
              onClick={onOpenCertificate}
              className="flex items-center justify-center gap-2.5 py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black font-extrabold text-sm tracking-wide shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:brightness-110 active:scale-95 transition-all cursor-pointer group"
            >
              <Award className="w-5 h-5 text-black group-hover:rotate-12 transition-transform" />
              <span>Claim Official Certificate 📜</span>
            </button>

            {/* Prank A Friend Button */}
            <button
              type="button"
              onClick={onOpenPrankModal}
              className="flex items-center justify-center gap-2.5 py-4 px-5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-sm tracking-wide shadow-[0_0_30px_rgba(6,182,212,0.4)] active:scale-95 transition-all cursor-pointer group"
            >
              <Share2 className="w-5 h-5 text-cyan-200 group-hover:scale-110 transition-transform" />
              <span>Prank Your Own Friends 😈</span>
            </button>
          </div>

          {/* Secondary Quick Share & Replay bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4 pt-4 border-t border-white/10 text-xs">
            <button
              type="button"
              onClick={handleQuickShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Prank Link'}</span>
            </button>

            <button
              type="button"
              onClick={onReplay}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white font-medium transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Replay 3D Experience 🔄</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
