import React, { useState, useRef } from 'react';
import { Award, Share2, Check, Sparkles, X, Edit3, UserCheck, Camera, Upload, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audio';
import { getShareUrl } from '../utils/url';

interface TrollCertificateProps {
  senderName: string;
  isOpen: boolean;
  onClose: () => void;
  secondsElapsed: number;
}

export const TrollCertificate: React.FC<TrollCertificateProps> = ({
  senderName,
  isOpen,
  onClose,
  secondsElapsed,
}) => {
  const [copied, setCopied] = useState(false);
  // User name
  const [recipientName, setRecipientName] = useState('');
  const [isEditingName, setIsEditingName] = useState(true);
  // User custom photo upload
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsElapsed / 60);
  const remainingSecs = secondsElapsed % 60;
  const timeFormatted = `${minutes > 0 ? `${minutes}m ` : ''}${remainingSecs}s`;

  const displayName = recipientName.trim() || 'Curious Legend 🤡';

  const handleShare = () => {
    const url = getShareUrl(senderName);
    const text = `Bro ${senderName} made me (${displayName}) click mysterious 3D buttons for ${timeFormatted} and wasted my whole life 😂 Check what ${senderName} sent: ${url}`;

    if (navigator.share) {
      navigator.share({
        title: `${senderName} Has Something For You…`,
        text: text,
        url: url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }

    confetti({
      particleCount: 60,
      spread: 75,
      origin: { y: 0.6 },
    });
  };

  const handleNameConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick();
    setIsEditingName(false);
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.65 },
    });
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setUserPhoto(result);
        soundEngine.playUnlockShatter();
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.5 },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-lg p-1 bg-gradient-to-b from-amber-300 via-amber-600 to-amber-900 rounded-2xl shadow-[0_0_80px_rgba(245,158,11,0.4)] max-h-[92vh] flex flex-col">
        {/* Certificate Inner Frame */}
        <div className="relative bg-[#0c0c14] border-2 border-amber-400/40 rounded-xl p-5 sm:p-7 text-center text-amber-100 overflow-y-auto">
          {/* Subtle gold watermark pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-300 via-transparent to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-amber-400/70 hover:text-amber-200 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* User Photo Avatar / Ribbon Badge */}
          <div className="relative mx-auto mb-2 flex justify-center">
            {userPhoto ? (
              <div className="relative group">
                <img
                  src={userPhoto}
                  alt="Awardee"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.6)]"
                />
                <button
                  type="button"
                  onClick={() => setUserPhoto(null)}
                  title="Remove image"
                  className="absolute -top-1 -right-1 p-1 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-md transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.6)] group-hover:scale-105 transition-transform">
                  <Award className="w-8 h-8 text-black" />
                </div>
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-amber-950 border border-amber-400 text-amber-300 group-hover:bg-amber-800 transition-colors shadow">
                  <Camera className="w-3 h-3" />
                </div>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          {!userPhoto && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-300/80 hover:text-amber-200 underline underline-offset-2 mb-2 transition-colors cursor-pointer"
            >
              <Upload className="w-3 h-3" />
              <span>+ Add Your Photo on Certificate</span>
            </button>
          )}

          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-amber-400/90 font-mono font-semibold">
            Official Document of Distinction
          </p>
          <h2 className="text-xl sm:text-3xl font-serif font-black tracking-tight mt-1 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 drop-shadow-sm">
            CERTIFICATE OF WASTED TIME
          </h2>

          <div className="w-20 sm:w-28 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto my-2" />

          <p className="text-xs text-amber-200/70 italic">This prestigious award is bestowed upon</p>

          {/* User Name Input Section */}
          <div className="my-2.5">
            {isEditingName ? (
              <form onSubmit={handleNameConfirm} className="max-w-xs mx-auto space-y-2">
                <div className="text-[11px] text-amber-300/80 font-mono">
                  👇 Apna naam yaha likho certificate pe print karne ke liye:
                </div>
                <div className="flex items-center gap-1.5 bg-black/60 border border-amber-400/50 rounded-xl p-1 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Apna Naam Likho..."
                    className="flex-1 bg-transparent px-3 py-1.5 text-sm sm:text-base font-bold font-serif text-amber-100 placeholder-amber-400/30 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-300 text-black text-xs font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="inline-flex items-center gap-2 group">
                <p className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-wide underline decoration-amber-400/60 decoration-wavy underline-offset-4">
                  {displayName}
                </p>
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  title="Naam change karein"
                  className="p-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 hover:text-white hover:bg-amber-800/80 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-amber-200/80 max-w-sm mx-auto leading-relaxed my-2 sm:my-3">
            For demonstrating extraordinary patience by clicking through mysterious portals, fake endings, and cosmic illusions created by{' '}
            <span className="font-semibold text-amber-300 underline underline-offset-2">{senderName}</span> for exactly{' '}
            <span className="font-bold font-mono text-amber-300 text-xs sm:text-sm px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/30">
              {timeFormatted}
            </span>.
          </p>

          {/* Funny Stamp & Signatures */}
          <div className="mt-4 pt-3 border-t border-amber-400/20 grid grid-cols-2 gap-3 items-center text-left">
            <div>
              <p className="text-[9px] uppercase font-mono tracking-widest text-amber-400/60">Certified By Master Troll</p>
              <p className="text-xs sm:text-sm font-serif font-bold text-amber-200 italic mt-0.5">~ {senderName} ✍️</p>
              <p className="text-[9px] text-amber-300/50">Chief Time Wasting Officer</p>
            </div>

            <div className="flex justify-end">
              <div className="rotate-[-10deg] border-2 border-red-500/80 rounded-lg px-2 py-0.5 text-center bg-red-950/40 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                <p className="text-[8px] font-black uppercase tracking-wider text-red-400">100% NON-REFUNDABLE</p>
                <p className="text-[9px] font-bold text-red-200">TIME GONE FOREVER</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-5 flex flex-col sm:flex-row gap-2.5 justify-center">
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-semibold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(245,158,11,0.5)] cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-black" /> : <Share2 className="w-4 h-4 text-black" />}
              {copied ? 'Link & Certificate Copied! 🎉' : 'Share Certificate & Prank'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/90 text-xs sm:text-sm font-medium transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
