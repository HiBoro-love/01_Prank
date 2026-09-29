import React, { useState } from 'react';
import { Copy, Check, Sparkles, Send, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getShareUrl } from '../utils/url';

interface CustomPrankModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSender: string;
}

export const CustomPrankModal: React.FC<CustomPrankModalProps> = ({
  isOpen,
  onClose,
  currentSender,
}) => {
  const [name, setName] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const targetName = name.trim() || currentSender || 'Anshuman';
  const customUrl = getShareUrl(targetName);

  const handleCopy = () => {
    navigator.clipboard.writeText(customUrl);
    setCopied(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    const message = `Bhai ${targetName} ne tumhare liye kuch bheja hai… ek baar khol ke dekh 👀: ${customUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#181829] to-[#0d0d17] border border-cyan-500/40 rounded-2xl p-6 text-white shadow-[0_0_60px_rgba(6,182,212,0.3)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-cyan-400 mb-1">
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="text-xs uppercase tracking-widest font-mono font-semibold">Prank Engine</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-white mb-2">
          Apne Dosto Ka Time Barbaad Karo 😈
        </h3>

        <p className="text-xs sm:text-sm text-white/70 mb-5 leading-relaxed">
          Apna naam daalo aur personal link generate karke dosto ko bhejo. Website unko bolega:
          <span className="block mt-1 text-cyan-300 font-medium italic">
            "{targetName} Has Something For You…"
          </span>
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-cyan-300/80 mb-1.5 uppercase tracking-wider">
              Sender Ka Naam (Your Name):
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul, Priya, Boss..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-cyan-500/30 text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-medium text-sm transition-all"
            />
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-white/80 break-all select-all flex items-center justify-between gap-2">
            <span className="truncate">{customUrl}</span>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 shrink-0 transition-colors"
              title="Copy Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-medium text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
            >
              <Send className="w-4 h-4" />
              WhatsApp Par Bhejo
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-medium text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
