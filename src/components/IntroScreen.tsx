import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ThemeMode } from '../types';
import { Zap, Eye } from 'lucide-react';

interface IntroScreenProps {
  onContinue: () => void;
  theme: ThemeMode;
  onThemeChange?: (theme: ThemeMode) => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onContinue,
  theme,
  onThemeChange,
}) => {
  // Stages matching the MP4 video sequence:
  // 1. 'eyes': Deep darkness, fiercely glowing cyan eyes staring and pulsing
  // 2. 'phoenix': Out of the darkness, the full flaming phoenix emerges with majestic spread wings
  // 3. 'warp': When tapped, hyperspace warp light explosion opens the website portal!
  const [stage, setStage] = useState<'eyes' | 'phoenix' | 'warp'>('eyes');
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Auto transition from eyes to phoenix stage (matching the video's dramatic reveal)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (stage === 'eyes') {
        setStage('phoenix');
        playSynthesizedAudio('swoop');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [stage]);

  const playSynthesizedAudio = (type: 'swoop' | 'burst') => {
    if (!audioEnabled) return;
    try {
      const AudioContext =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof window.AudioContext })
          .webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        if (type === 'swoop') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(140, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(380, ctx.currentTime + 0.4);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.5);
        } else {
          // Warp explosion
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(220, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4);
          gain.gain.setValueAtTime(0.25, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.7);
        }
      }
    } catch {
      // Audio fallback safe
    }
  };

  const handleTap = () => {
    if (stage !== 'warp') {
      triggerWarp();
    }
  };

  const triggerWarp = () => {
    setStage('warp');
    playSynthesizedAudio('burst');

    // Confetti particles matching neon purple and electric cyan
    confetti({
      particleCount: 75,
      spread: 95,
      origin: { y: 0.5 },
      colors: ['#38bdf8', '#a855f7', '#06b6d4', '#ffffff', '#c084fc'],
    });

    setTimeout(() => {
      onContinue();
    }, 850);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.25 }}
      transition={{ duration: 0.7 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#030107] text-white select-none"
    >
      {/* Dynamic Starfield & Nebula Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated cosmic dust */}
        <div
          className="absolute inset-0 opacity-70 transition-opacity duration-1000"
          style={{
            backgroundImage: `radial-gradient(1.5px 1.5px at 40px 60px, #ffffff, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 180px 240px, #a855f7, rgba(0,0,0,0)),
                              radial-gradient(1.5px 1.5px at 350px 120px, #38bdf8, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 520px 380px, #ffffff, rgba(0,0,0,0)),
                              radial-gradient(1.5px 1.5px at 760px 180px, #c084fc, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 920px 480px, #38bdf8, rgba(0,0,0,0))`,
            backgroundSize: '1000px 600px',
          }}
        />

        {/* Ambient colored lighting glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/30 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-600/25 rounded-full blur-[130px] pointer-events-none" />
      </div>

      {/* Floating Header Info & Controls */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-xs text-purple-300/70 z-30">
        <div className="flex items-center gap-2 tracking-widest font-mono">
          <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-semibold">SJEC CSE • AGENTBLAZER INITIATIVE</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Stage indicator pills - matching video sequence: 01 Glowing Eyes -> 02 Phoenix Wings */}
          <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-full bg-black/40 border border-white/10 font-mono text-[10px]">
            <button
              onClick={() => {
                setStage('eyes');
                playSynthesizedAudio('swoop');
              }}
              className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                stage === 'eyes' ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_#06b6d4]' : 'opacity-60 hover:opacity-100 text-cyan-300'
              }`}
            >
              01 Glowing Eyes
            </button>
            <button
              onClick={() => {
                setStage('phoenix');
                playSynthesizedAudio('swoop');
              }}
              className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                stage === 'phoenix' ? 'bg-purple-600 text-white font-bold shadow-[0_0_15px_#a855f7]' : 'opacity-60 hover:opacity-100 text-purple-300'
              }`}
            >
              02 Phoenix Wings
            </button>
          </div>

          <button
            onClick={onContinue}
            className="px-3.5 py-1.5 rounded-full border border-purple-500/30 hover:border-cyan-400/60 text-purple-200 hover:text-white transition-colors cursor-pointer text-xs font-mono font-semibold backdrop-blur-md bg-black/40"
          >
            Enter Portal →
          </button>
        </div>
      </div>

      {/* PHOENIX CINEMATIC STAGE (Sequence: Eyes -> Phoenix -> Warp) */}
      <div
        className="relative z-10 w-full h-full flex flex-col items-center justify-center cursor-pointer"
      >
        <AnimatePresence mode="wait">
          {/* STAGE 1: Darkness with Fiercely Glowing Cyan Eyes (Starting in video) */}
          {stage === 'eyes' && (
            <motion.div
              key="stage-eyes"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: [1, 1.03, 1] }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                opacity: { duration: 0.5 },
                scale: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="relative w-full max-w-5xl h-[65vh] max-h-[620px] flex items-center justify-center"
            >
              {/* Dark Eyes Visual */}
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-3xl">
                <img
                  src="/assets/phoenix_eyes.jpg"
                  alt="AgentBlazer Glowing Cyan Eyes"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_70px_rgba(6,182,212,0.85)] transition-all duration-700 hover:scale-105"
                />

                {/* Pulsing Electric Cyan Eye Beams and Flare */}
                <div className="absolute top-[42%] left-[45%] w-9 h-9 rounded-full bg-cyan-300 blur-md animate-ping" style={{ animationDuration: '1.8s' }} />
                <div className="absolute top-[42%] right-[45%] w-9 h-9 rounded-full bg-cyan-300 blur-md animate-ping" style={{ animationDuration: '1.8s' }} />

                {/* Ambient cyan energy halo */}
                <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-64 h-32 bg-cyan-500/25 rounded-full blur-3xl pointer-events-none animate-pulse" />

                {/* Swirling dark fire embers */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030107] via-transparent to-[#030107] pointer-events-none opacity-50" />
              </div>
            </motion.div>
          )}

          {/* STAGE 2: Full Majestic Flaming Phoenix with Spread Wings (Then Phoenix in video) */}
          {stage === 'phoenix' && (
            <motion.div
              key="stage-phoenix"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: [1, 1.03, 1] }}
              exit={{ opacity: 0, scale: 1.15 }}
              transition={{
                opacity: { duration: 0.6 },
                scale: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="relative w-full max-w-5xl h-[65vh] max-h-[620px] flex items-center justify-center"
            >
              {/* Phoenix Wide Full Artwork Image */}
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-3xl">
                <img
                  src="/assets/phoenix_full.jpg"
                  alt="Majestic AgentBlazer Phoenix"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_60px_rgba(168,85,247,0.65),0_0_30px_rgba(6,182,212,0.45)] transition-transform duration-700 hover:scale-105"
                />

                {/* Additional overlay glow highlights on wings & crown */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-56 h-56 bg-cyan-400/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
                <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-72 h-44 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
              </div>
            </motion.div>
          )}

          {/* STAGE 3: Warp Burst */}
          {stage === 'warp' && (
            <motion.div
              key="stage-warp"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 0.9], scale: [1, 1.8, 2.4] }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full flex items-center justify-center pointer-events-none"
            >
              <div className="w-[800px] h-[800px] rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-white blur-[100px] opacity-90 animate-pulse" />
              <div className="absolute text-5xl font-black font-mono tracking-widest text-white drop-shadow-[0_0_35px_rgba(56,189,248,1)]">
                AGENTBLAZER
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TAP TO CONTINUE BUTTON (Matching Video Style) */}
        {stage !== 'warp' && (
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            className="absolute bottom-12 sm:bottom-16 z-30"
          >
            <button
              id="tap-to-continue-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleTap();
              }}
              className="group relative px-9 py-4 rounded-full font-bold tracking-[0.25em] text-xs sm:text-sm uppercase transition-all duration-300 
                         bg-black/75 hover:bg-black/95 backdrop-blur-2xl border-2 border-cyan-400/80 hover:border-cyan-300 shadow-[0_0_40px_rgba(6,182,212,0.8),0_0_80px_rgba(168,85,247,0.5)]
                         hover:shadow-[0_0_60px_rgba(6,182,212,1),0_0_110px_rgba(168,85,247,0.7)] active:scale-95 cursor-pointer text-white flex items-center gap-3"
            >
              <Eye className="w-4 h-4 text-cyan-400 group-hover:text-purple-300 transition-colors animate-pulse" />
              <span className="text-white group-hover:text-cyan-200 transition-colors font-medium">
                TAP TO CONTINUE
              </span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 group-hover:bg-purple-400 animate-ping" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Footer Subtext */}
      <div className="absolute bottom-4 text-[11px] text-gray-500 font-mono tracking-wider text-center z-20 px-4">
        Department of Computer Science & Engineering • St Joseph Engineering College, Mangaluru
      </div>
    </motion.div>
  );
};
