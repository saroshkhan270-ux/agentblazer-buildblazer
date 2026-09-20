import React, { useEffect, useState } from 'react';
import { ThemeMode } from '../types';

interface CustomCursorProps {
  theme?: ThemeMode;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ theme = 'violet' }) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check if device is touch only
    if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest('button') ||
          target.closest('a') ||
          target.closest('input') ||
          target.closest('textarea') ||
          target.closest('select') ||
          target.closest('[role="button"]') ||
          target.closest('.cursor-pointer') ||
          target.closest('[id*="card"]') ||
          target.closest('[id*="btn"]')
        );
        setIsHovered(isInteractive);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  // Smooth trailing ring effect
  useEffect(() => {
    if (isTouch) return;
    let animationFrameId: number;

    const followCursor = () => {
      setTrailingPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.22,
        y: prev.y + (pos.y - prev.y) * 0.22,
      }));
      animationFrameId = requestAnimationFrame(followCursor);
    };

    animationFrameId = requestAnimationFrame(followCursor);
    return () => cancelAnimationFrame(animationFrameId);
  }, [pos, isTouch]);

  if (isTouch || !isVisible) return null;

  // Theme-specific glow colors matching the video aesthetic
  const getGlowStyles = () => {
    if (theme === 'inferno') {
      return {
        dot: 'bg-amber-400 shadow-[0_0_12px_#f59e0b]',
        ring: isHovered
          ? 'border-orange-400 bg-orange-500/20 shadow-[0_0_35px_rgba(249,115,22,0.85),0_0_70px_rgba(245,158,11,0.6)]'
          : 'border-orange-500/70 shadow-[0_0_20px_rgba(249,115,22,0.55)]',
      };
    }
    if (theme === 'frost') {
      return {
        dot: 'bg-sky-500 shadow-[0_0_12px_#0ea5e9]',
        ring: isHovered
          ? 'border-sky-400 bg-sky-500/20 shadow-[0_0_35px_rgba(14,165,233,0.85),0_0_70px_rgba(56,189,248,0.6)]'
          : 'border-sky-500/70 shadow-[0_0_20px_rgba(14,165,233,0.55)]',
      };
    }
    // Violet/Cyber theme as seen in the MP4 video
    return {
      dot: 'bg-cyan-300 shadow-[0_0_14px_#22d3ee,0_0_25px_#06b6d4]',
      ring: isHovered
        ? 'border-cyan-300 bg-cyan-400/25 shadow-[0_0_40px_rgba(6,182,212,0.95),0_0_80px_rgba(168,85,247,0.7)]'
        : 'border-cyan-400/80 shadow-[0_0_25px_rgba(6,182,212,0.7),0_0_50px_rgba(168,85,247,0.4)]',
    };
  };

  const glow = getGlowStyles();

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Smooth Trailing Glowing Ring */}
      <div
        className={`fixed top-0 left-0 rounded-full border transition-all duration-150 ease-out flex items-center justify-center ${glow.ring}`}
        style={{
          width: isHovered ? '48px' : isClicked ? '22px' : '32px',
          height: isHovered ? '48px' : isClicked ? '22px' : '32px',
          transform: `translate3d(${trailingPos.x - (isHovered ? 24 : isClicked ? 11 : 16)}px, ${trailingPos.y - (isHovered ? 24 : isClicked ? 11 : 16)}px, 0)`,
        }}
      >
        {isHovered && (
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-200 animate-ping opacity-75" />
        )}
      </div>

      {/* Inner Pinpoint Accurate Glowing Dot */}
      <div
        className={`fixed top-0 left-0 rounded-full transition-transform duration-75 ease-out ${glow.dot}`}
        style={{
          width: '7px',
          height: '7px',
          transform: `translate3d(${pos.x - 3.5}px, ${pos.y - 3.5}px, 0) scale(${isClicked ? 0.7 : 1})`,
        }}
      />
    </div>
  );
};
