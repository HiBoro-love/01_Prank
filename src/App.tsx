/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Eye } from 'lucide-react';
import { ThreeCanvas } from './components/ThreeCanvas';
import { SoundToggle } from './components/SoundToggle';
import { TrollCertificate } from './components/TrollCertificate';
import { CustomPrankModal } from './components/CustomPrankModal';
import { EasterEggBanner } from './components/EasterEggBanner';
import { Stage1BiometricTask } from './components/Stage1BiometricTask';
import { Stage2VaultTumblerTask } from './components/Stage2VaultTumblerTask';
import { WordVerificationTask } from './components/WordVerificationTask';
import { Stage4LaserAlignTask } from './components/Stage4LaserAlignTask';
import { Stage5CelestialOathTask } from './components/Stage5CelestialOathTask';
import { EnhancedFinaleLanding } from './components/EnhancedFinaleLanding';
import { soundEngine } from './utils/audio';

export default function App() {
  // Extract sender name from URL ?from=... or default to "Anshuman"
  const [senderName, setSenderName] = useState('Anshuman');
  const [stage, setStage] = useState(1);
  const [stageSubstep, setStageSubstep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [boxOpened, setBoxOpened] = useState(false);
  const [screenFlash, setScreenFlash] = useState(false);
  const [timeFreeze, setTimeFreeze] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [easterEggMsg, setEasterEggMsg] = useState<string | null>(null);

  // Stage 6 sequential reveals
  const [stage6Progress, setStage6Progress] = useState(0);

  // Time tracking
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showPrankModal, setShowPrankModal] = useState(false);

  // Read URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromParam = params.get('from');
    if (fromParam && fromParam.trim()) {
      setSenderName(fromParam.trim());
    }
  }, []);

  // Update dynamic background soundtrack frequency & intensity whenever stage changes
  useEffect(() => {
    soundEngine.updateStage(stage);
  }, [stage]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Easter egg messages
  const secretClickCount = useRef(0);
  const triggerEasterEgg = () => {
    secretClickCount.current += 1;
    soundEngine.playClick();
    const secrets = [
      'Psst… Anshuman ne bohot socha tha iske baare mein 🤫',
      'Kaha click kar rahe ho? Main task neeche hai! 👀',
      'Lagta hai tumhe suspense pasand hai… thoda aur ruko 😏',
      'Har level pe ek naya 3D secret dimension hai ✨',
      'Anshuman is watching you solve these puzzles right now 😂',
    ];
    setEasterEggMsg(secrets[secretClickCount.current % secrets.length]);
    setTimeout(() => setEasterEggMsg(null), 3000);
  };

  // Stage 1 -> 2 transition (triggered after Stage 1 task is solved)
  const handleStage1TaskSuccess = () => {
    soundEngine.startAmbient();
    soundEngine.playCinematicWhoosh();
    setScreenShake(true);
    setIsTransitioning(true);

    setTimeout(() => {
      setScreenShake(false);
      setStage(2);
      setStageSubstep(0);
      setIsTransitioning(false);
    }, 900);
  };

  // Stage 2: Vault puzzle solved -> open vault
  const handleStage2VaultTaskSuccess = () => {
    soundEngine.playUnlockShatter();
    setBoxOpened(true);
    setScreenFlash(true);

    setTimeout(() => {
      setScreenFlash(false);
      setStageSubstep(1); // Reveals "Achha… tum itna patiently click bhi kar rahe ho? 😂"
    }, 600);
  };

  const handleStage2Proceed = () => {
    soundEngine.playCinematicWhoosh();
    setIsTransitioning(true);
    setTimeout(() => {
      setStage(3);
      setStageSubstep(0);
      setIsTransitioning(false);
    }, 800);
  };

  // Stage 3: Deep mystery & fake-out
  const handleStage3Click = () => {
    soundEngine.playClick();
    setIsTransitioning(true);
    setTimeout(() => {
      soundEngine.playComicalFakeout();
      setStageSubstep(1); // Fake-out: "Wait… ye nahi tha 😭" + Show WordVerificationTask
      setIsTransitioning(false);
    }, 500);
  };

  // Stage 3 task completed -> Proceed to Stage 4
  const handleStage3Proceed = () => {
    soundEngine.playCinematicWhoosh();
    setIsTransitioning(true);
    setTimeout(() => {
      setStage(4);
      setStageSubstep(0);
      setIsTransitioning(false);
    }, 800);
  };

  // Stage 4: Stargate alignment task completed -> Warp to Fake-Final reveal
  const handleStage4TaskSuccess = () => {
    soundEngine.playCinematicWhoosh();
    setScreenShake(true);
    setScreenFlash(true);

    setTimeout(() => {
      setScreenShake(false);
      setScreenFlash(false);
      soundEngine.playComicalFakeout();
      setStageSubstep(1); // "HAHA 😂 Tumhe laga sach mein final tha?"
    }, 900);
  };

  const handleStage4Proceed = () => {
    soundEngine.playCinematicWhoosh();
    setIsTransitioning(true);
    setTimeout(() => {
      setStage(5);
      setStageSubstep(0);
      setIsTransitioning(false);
      soundEngine.playCelestialChords();
    }, 900);
  };

  // Stage 5: Heavenly buildup -> Celestial oath passed -> Grand Finale
  const handleStage5AscendSuccess = () => {
    soundEngine.playClick();
    setTimeFreeze(true);

    // Dramatic slow-mo heart-beat pause
    setTimeout(() => {
      soundEngine.playCinematicWhoosh();
      setScreenFlash(true);

      setTimeout(() => {
        setTimeFreeze(false);
        setScreenFlash(false);
        setStage(6);
        setStage6Progress(1); // "YOU ARE DOING GREAT, MAN ❤️"

        setTimeout(() => {
          setStage6Progress(2); // "KEEP WASTING YOUR TIME 😂"
          soundEngine.playClick();
        }, 1800);

        setTimeout(() => {
          setStage6Progress(3); // "Anshuman ne tumhara keemti time successfully barbaad kar diya."
          soundEngine.playClick();
        }, 3400);

        setTimeout(() => {
          setStage6Progress(4); // "MISSION ACCOMPLISHED ✅"
          soundEngine.playTrollCelebration();

          confetti({
            particleCount: 130,
            spread: 90,
            origin: { y: 0.6 },
          });

          setTimeout(() => {
            confetti({
              particleCount: 90,
              angle: 60,
              spread: 60,
              origin: { x: 0 },
            });
            confetti({
              particleCount: 90,
              angle: 120,
              spread: 60,
              origin: { x: 1 },
            });
          }, 400);
        }, 4800);
      }, 700);
    }, 1200);
  };

  // Replay
  const handleReplay = () => {
    soundEngine.playClick();
    setStage(1);
    setStageSubstep(0);
    setBoxOpened(false);
    setStage6Progress(0);
    setSecondsElapsed(0);
  };

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden bg-black font-sans text-white select-none transition-transform duration-100 ${
        screenShake ? 'scale-105 animate-wiggle' : ''
      }`}
    >
      {/* 3D WebGL Canvas with Cursor-Reactive Particle Field */}
      <ThreeCanvas
        stage={stage}
        isTransitioning={isTransitioning}
        boxOpened={boxOpened}
        onObjectClick={triggerEasterEgg}
      />

      {/* Screen Flash Overlay */}
      <div
        className={`fixed inset-0 pointer-events-none z-50 bg-white transition-opacity duration-700 ${
          screenFlash ? 'opacity-90' : 'opacity-0'
        }`}
      />

      {/* Time-Freeze Halo effect for Stage 5 */}
      <div
        className={`fixed inset-0 pointer-events-none z-40 transition-opacity duration-1000 bg-[radial-gradient(ellipse_at_center,_rgba(255,215,0,0.35)_0%,_rgba(0,0,0,0.85)_80%)] ${
          timeFreeze ? 'opacity-100 backdrop-blur-sm' : 'opacity-0'
        }`}
      />

      {/* Top Header Controls */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-5 pointer-events-none">
        {/* Stage Indicator & Anomaly Inspector */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-white/80">
              Level 0{stage} / 06
            </span>
          </div>
          <button
            onClick={triggerEasterEgg}
            title="Inspect anomaly"
            className="p-1.5 rounded-full bg-black/50 border border-white/10 hover:border-cyan-400 text-white/50 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dynamic Music / Sound Toggle */}
        <div className="pointer-events-auto">
          <SoundToggle />
        </div>
      </div>

      {/* Progress Track Bar */}
      <div className="fixed top-0 left-0 right-0 z-30 h-1 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-400 transition-all duration-700 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
          style={{ width: `${(stage / 6) * 100}%` }}
        />
      </div>

      {/* Interactive Main Overlay Content */}
      <main className="relative z-20 w-full h-full flex flex-col items-center justify-center px-4 text-center pointer-events-none overflow-y-auto py-12">
        {/* ========================================================= */}
        {/* LEVEL 1: THE MYSTERIOUS ENTRY & BIOMETRIC SENSOR          */}
        {/* ========================================================= */}
        {stage === 1 && (
          <div className="pointer-events-auto max-w-xl mx-auto flex flex-col items-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-[0.25em] mb-4 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              Incoming 3D Quantum Transmission
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-serif text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_35px_rgba(6,182,212,0.4)] leading-tight">
              Ruko… {senderName} ne tumhare liye kuch bheja hai.
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-cyan-200/70 max-w-md font-mono tracking-wide">
              An encrypted 3D artifact was discovered in your space. Next level unlock karne ke liye sensor scan complete karo!
            </p>

            {/* Level 1 Task: Biometric Touch Sync */}
            <Stage1BiometricTask onSuccess={handleStage1TaskSuccess} />
          </div>
        )}

        {/* ========================================================= */}
        {/* LEVEL 2: ANCIENT VAULT & RUNE TUMBLER DIALS               */}
        {/* ========================================================= */}
        {stage === 2 && (
          <div className="pointer-events-auto max-w-xl mx-auto flex flex-col items-center animate-fade-in">
            {stageSubstep === 0 ? (
              <>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-mono uppercase tracking-[0.25em] mb-3 backdrop-blur-md">
                  Cyber Vault Locked
                </div>

                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-serif text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-100 to-purple-300 drop-shadow-[0_0_35px_rgba(168,85,247,0.4)]">
                  Hmm… ye toh sirf shuruaat hai.
                </h2>

                <p className="mt-2 text-xs sm:text-sm text-purple-200/70 font-mono">
                  Vault ke 3 gold rings ko sahi rune numbers par align karo to unlock:
                </p>

                {/* Level 2 Task: Align the 3 Tumblers (7 - 3 - 9) */}
                <Stage2VaultTumblerTask onSuccess={handleStage2VaultTaskSuccess} />
              </>
            ) : (
              <div className="flex flex-col items-center animate-fade-in">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-950/50 border border-pink-500/40 text-pink-300 text-xs font-mono uppercase tracking-[0.2em] mb-4">
                  Decryption Layer 01 Passed
                </div>

                <h3 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-amber-200 to-purple-200 drop-shadow-[0_0_25px_rgba(244,114,182,0.4)]">
                  Achha… tum itna patiently click bhi kar rahe ho? 😂
                </h3>

                <p className="mt-3 text-sm sm:text-base text-white/70 font-sans max-w-md">
                  Tumhe laga tha itni aasaani se pata chal jayega? Aage dekho kya hota hai…
                </p>

                <div className="mt-6 group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition" />
                  <button
                    onClick={handleStage2Proceed}
                    className="relative px-8 py-3.5 rounded-xl bg-black/80 border border-cyan-400/80 text-white font-bold text-sm sm:text-base tracking-wide hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    AAGE BHI DEKHO 🔮
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* LEVEL 3: CYBER MATRIX & TYPE-YOUR-WORDS TASK               */}
        {/* ========================================================= */}
        {stage === 3 && (
          <div className="pointer-events-auto max-w-xl mx-auto flex flex-col items-center animate-fade-in">
            {stageSubstep === 0 ? (
              <>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-xs font-mono uppercase tracking-[0.25em] mb-4 backdrop-blur-md">
                  Deep Matrix Anomaly
                </div>

                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-serif text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-100 to-indigo-300 drop-shadow-[0_0_35px_rgba(99,102,241,0.5)]">
                  Ab jo aane wala hai… uske liye ready ho?
                </h2>

                <p className="mt-2 text-xs sm:text-sm text-indigo-200/70 font-mono">
                  The deep core is destabilizing. Proceed at your own risk.
                </p>

                <div className="mt-8 group relative">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse" />

                  <button
                    onClick={handleStage3Click}
                    className="relative px-9 py-4.5 rounded-2xl bg-gradient-to-b from-[#131133] to-[#070517] border border-indigo-400/70 text-white font-bold text-base sm:text-lg tracking-wider shadow-[0_10px_40px_rgba(0,0,0,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                  >
                    HAA BHAI, DIKHAO 😎
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center animate-bounce-short">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/50 border border-amber-500/40 text-amber-300 text-xs font-mono uppercase tracking-[0.2em] mb-3">
                  Signal Glitch Detected ⚠️
                </div>

                <h3 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-purple-300 drop-shadow-[0_0_25px_rgba(245,158,11,0.4)]">
                  Wait… ye nahi tha 😭
                </h3>

                {/* Level 3 Task: Word / Magic Phrase Verification */}
                <WordVerificationTask
                  senderName={senderName}
                  onSuccess={handleStage3Proceed}
                />
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* LEVEL 4: STARGATE WITH FREQUENCY SLIDER TASK             */}
        {/* ========================================================= */}
        {stage === 4 && (
          <div className="pointer-events-auto max-w-xl mx-auto flex flex-col items-center animate-fade-in">
            {stageSubstep === 0 ? (
              <>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/50 border border-red-500/40 text-red-300 text-xs font-mono uppercase tracking-[0.25em] mb-3 backdrop-blur-md animate-pulse">
                  Stargate Gear Synchronization
                </div>

                <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-serif text-transparent bg-clip-text bg-gradient-to-b from-white via-red-200 to-purple-400 drop-shadow-[0_0_40px_rgba(239,68,68,0.6)]">
                  This is it…
                </h2>

                <p className="mt-1 text-sm sm:text-lg font-serif text-white/90 tracking-wide">
                  The final surprise from {senderName}.
                </p>

                {/* Level 4 Task: Laser Alignment / Frequency slider */}
                <Stage4LaserAlignTask onSuccess={handleStage4TaskSuccess} />
              </>
            ) : (
              <div className="flex flex-col items-center animate-fade-in">
                <div className="text-4xl sm:text-6xl mb-2 animate-bounce">🤡</div>

                <h3 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-300 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]">
                  HAHA 😂 Tumhe laga sach mein final tha?
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-white/80 max-w-md">
                  Itna aasan thodi hai {senderName} ka secret unlock karna! Bas ab sach mein last hai, kasam se.
                </p>

                <div className="mt-6 group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-red-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition" />
                  <button
                    onClick={handleStage4Proceed}
                    className="relative px-8 py-3.5 rounded-xl bg-black/85 border border-yellow-400 text-white font-bold text-sm sm:text-base tracking-wide hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    OKAY… ACTUAL FINAL 😭
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* LEVEL 5: GOLDEN CELESTIAL LOTUS & SOLEMN OATH TASK         */}
        {/* ========================================================= */}
        {stage === 5 && (
          <div className="pointer-events-auto max-w-xl mx-auto flex flex-col items-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/40 border border-amber-400/40 text-amber-200 text-xs font-mono uppercase tracking-[0.3em] mb-3 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              ✨ Sacred Golden Lotus Realm ✨
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-amber-300 drop-shadow-[0_0_40px_rgba(251,191,36,0.5)]">
              Bas ek aakhri step…
            </h2>

            <p className="mt-2 text-sm sm:text-base text-amber-100/90 font-serif italic max-w-md">
              "{senderName} ne jo bheja hai… woh ab saamne aane wala hai."
            </p>

            {/* Level 5 Task: 3-Checklist Celestial Oath */}
            <Stage5CelestialOathTask
              senderName={senderName}
              onSuccess={handleStage5AscendSuccess}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* LEVEL 6: ENHANCED FINALE LANDING (Zero Boring, Highly Engaging) */}
        {/* ========================================================= */}
        {stage === 6 && (
          <EnhancedFinaleLanding
            senderName={senderName}
            stageProgress={stage6Progress}
            secondsElapsed={secondsElapsed}
            onOpenCertificate={() => setShowCertificate(true)}
            onOpenPrankModal={() => setShowPrankModal(true)}
            onReplay={handleReplay}
          />
        )}
      </main>

      {/* Floating Easter Egg Toast */}
      <EasterEggBanner message={easterEggMsg} />

      {/* Official Certificate Modal (with user customizable name & photo upload) */}
      <TrollCertificate
        senderName={senderName}
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        secondsElapsed={secondsElapsed}
      />

      {/* Viral Prank Customizer Modal */}
      <CustomPrankModal
        isOpen={showPrankModal}
        onClose={() => setShowPrankModal(false)}
        currentSender={senderName}
      />
    </div>
  );
}
