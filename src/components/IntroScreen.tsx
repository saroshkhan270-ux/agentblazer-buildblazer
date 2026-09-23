import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ThemeMode } from '../types';
import { Zap, Sparkles } from 'lucide-react';

interface IntroScreenProps {
  onContinue: () => void;
  theme: ThemeMode;
  onThemeChange?: (theme: ThemeMode) => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onContinue }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // Initialize video playback from start with seamless looping
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      video.currentTime = 0;
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.currentTime > 0.1 && !isRevealed) {
      setIsRevealed(true);
    }
  };

  const cleanupMedia = () => {
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      } catch {}
    }

    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      cleanupMedia();
    };
  }, []);

  const handleTapToContinue = () => {
    cleanupMedia();
    onContinue();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden bg-[#030107] text-white select-none"
    >
      {/* Fullscreen Video Background (No boxed frame, no inner borders) */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video
          ref={videoRef}
          src="/assets/intro.mp4"
          playsInline
          autoPlay
          loop
          muted
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          className={`w-full h-full object-cover object-center transition-opacity duration-700 ${
            isRevealed ? 'opacity-100' : 'opacity-80'
          }`}
          style={{
            transform: 'translateZ(0)',
          }}
        />

        {/* Ambient edge gradient overlays to soften viewport boundary */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030107]/90 via-transparent to-[#030107]/60 pointer-events-none" />
      </div>

      {/* Top Header Bar */}
      <div className="relative z-20 w-full max-w-7xl px-6 pt-6 flex items-center justify-between text-xs text-purple-200/80 font-mono">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-semibold tracking-wider uppercase">
            SJEC CSE • AgentBlazer Club
          </span>
        </div>

        <button
          onClick={handleTapToContinue}
          className="px-4 py-1.5 rounded-full border border-cyan-500/30 hover:border-cyan-400 bg-black/50 hover:bg-black/80 backdrop-blur-md text-cyan-300 hover:text-white transition-all duration-300 text-xs font-mono tracking-wider cursor-pointer shadow-lg"
        >
          Enter Portal →
        </button>
      </div>

      {/* Centered TAP TO CONTINUE Action Button */}
      <div className="relative z-20 pb-14 sm:pb-20 flex flex-col items-center gap-4">
        <motion.button
          onClick={handleTapToContinue}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              '0 0 25px rgba(6, 182, 212, 0.4), 0 0 50px rgba(168, 85, 247, 0.3)',
              '0 0 45px rgba(6, 182, 212, 0.7), 0 0 75px rgba(168, 85, 247, 0.5)',
              '0 0 25px rgba(6, 182, 212, 0.4), 0 0 50px rgba(168, 85, 247, 0.3)',
            ],
          }}
          transition={{
            boxShadow: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
          }}
          className="group relative px-9 py-4 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-2xl border-2 border-cyan-400/80 hover:border-cyan-300 text-white font-mono text-sm tracking-[0.25em] uppercase transition-all duration-300 cursor-pointer flex items-center gap-3.5 shadow-2xl"
        >
          <Sparkles className="w-4 h-4 text-cyan-400 group-hover:text-purple-300 transition-colors animate-pulse" />
          <span className="text-cyan-100 group-hover:text-white font-bold">
            TAP TO CONTINUE
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 group-hover:bg-purple-400 animate-ping" />
        </motion.button>

        <span className="text-[11px] font-mono text-purple-200/60 tracking-widest uppercase bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
          St Joseph Engineering College • Mangaluru
        </span>
      </div>
    </motion.div>
  );
};
