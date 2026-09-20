import React from 'react';
import { ThemeMode } from '../types';

interface PhoenixHeroProps {
  theme: ThemeMode;
  size?: 'sm' | 'md' | 'lg' | 'intro';
  animated?: boolean;
}

export const PhoenixHero: React.FC<PhoenixHeroProps> = ({
  theme,
  size = 'md',
  animated = true,
}) => {
  // Color palettes per theme
  const getThemePalette = () => {
    switch (theme) {
      case 'inferno':
        return {
          primary: '#f97316',
          secondary: '#ef4444',
          highlight: '#fbbf24',
          core: '#ffffff',
          aura: 'rgba(249, 115, 22, 0.45)',
          glow: '#ea580c',
          wingGrad1: '#7c2d12',
          wingGrad2: '#ea580c',
          wingGrad3: '#fde047',
        };
      case 'frost':
        return {
          primary: '#0284c7',
          secondary: '#06b6d4',
          highlight: '#38bdf8',
          core: '#ffffff',
          aura: 'rgba(56, 189, 248, 0.35)',
          glow: '#0284c7',
          wingGrad1: '#0369a1',
          wingGrad2: '#38bdf8',
          wingGrad3: '#bae6fd',
        };
      case 'violet':
      default:
        return {
          primary: '#a855f7',
          secondary: '#38bdf8',
          highlight: '#c084fc',
          core: '#ffffff',
          aura: 'rgba(168, 85, 247, 0.45)',
          glow: '#9333ea',
          wingGrad1: '#4c1d95',
          wingGrad2: '#9333ea',
          wingGrad3: '#67e8f9',
        };
    }
  };

  const palette = getThemePalette();

  const dims = {
    sm: 'w-24 h-24',
    md: 'w-48 h-48 sm:w-64 sm:h-64',
    lg: 'w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96',
    intro: 'w-[90vw] max-w-[760px] h-[58vh] max-h-[580px]',
  }[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${dims}`}>
      {/* Dynamic ambient radial backdrop aura */}
      <div
        className={`absolute inset-0 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          animated ? 'animate-pulse' : ''
        }`}
        style={{
          background: `radial-gradient(circle, ${palette.aura} 0%, rgba(0,0,0,0) 70%)`,
          transform: 'scale(1.35)',
        }}
      />

      {/* SVG Phoenix Art Representation with layered wings, flaming feathers, glowing crest, and piercing eyes */}
      <svg
        viewBox="0 0 1000 750"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl z-10 transition-transform duration-500 hover:scale-105"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id={`phoenix-wing-left-${theme}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={palette.wingGrad1} />
            <stop offset="50%" stopColor={palette.wingGrad2} />
            <stop offset="100%" stopColor={palette.wingGrad3} />
          </linearGradient>

          <linearGradient id={`phoenix-wing-right-${theme}`} x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={palette.wingGrad1} />
            <stop offset="50%" stopColor={palette.wingGrad2} />
            <stop offset="100%" stopColor={palette.wingGrad3} />
          </linearGradient>

          <linearGradient id={`flame-body-${theme}`} x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor={palette.wingGrad1} stopOpacity="0.8" />
            <stop offset="50%" stopColor={palette.primary} />
            <stop offset="85%" stopColor={palette.highlight} />
            <stop offset="100%" stopColor={palette.core} />
          </linearGradient>

          <linearGradient id={`crest-glow-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.core} />
            <stop offset="40%" stopColor={palette.highlight} />
            <stop offset="100%" stopColor={palette.primary} />
          </linearGradient>

          <radialGradient id={`eye-glow-${theme}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor={palette.highlight} />
            <stop offset="100%" stopColor={palette.primary} stopOpacity="0" />
          </radialGradient>

          <filter id="ultra-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="16" result="blur1" />
            <feGaussianBlur stdDeviation="30" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient flame tendrils and swirling wisps */}
        <g opacity="0.6" filter="url(#soft-glow)">
          {/* Swirling energy waves below and around wings */}
          <path
            d="M 500 680 C 400 740 320 620 260 540 C 200 460 140 420 80 400 C 60 480 180 580 320 660 C 420 720 480 730 500 680 Z"
            fill={`url(#phoenix-wing-left-${theme})`}
            opacity="0.4"
          />
          <path
            d="M 500 680 C 600 740 680 620 740 540 C 800 460 860 420 920 400 C 940 480 820 580 680 660 C 580 720 520 730 500 680 Z"
            fill={`url(#phoenix-wing-right-${theme})`}
            opacity="0.4"
          />
          {/* Lower swirling tail embers */}
          <path
            d="M 500 520 Q 420 640 440 730 Q 500 690 500 580 Q 500 690 560 730 Q 580 640 500 520 Z"
            fill={`url(#flame-body-${theme})`}
            filter="url(#ultra-glow)"
          />
        </g>

        {/* LEFT WING - Spanning sweeping primary and secondary feathers */}
        <g filter="url(#soft-glow)">
          {/* Outer primary feather tips */}
          <path
            d="M 460 300 C 350 200 200 120 40 160 C 90 220 180 270 280 320 C 180 300 80 290 10 330 C 70 380 170 410 270 420 C 180 430 100 460 40 520 C 120 540 220 520 310 490 C 230 520 160 580 120 650 C 200 630 300 570 380 500 C 430 450 460 380 460 300 Z"
            fill={`url(#phoenix-wing-left-${theme})`}
          />
          {/* Upper arching wing feathers */}
          <path
            d="M 480 260 C 390 160 270 80 120 70 C 180 130 290 180 380 240 C 270 170 180 140 100 150 C 170 200 280 240 370 290 C 430 330 460 310 480 260 Z"
            fill={`url(#crest-glow-${theme})`}
            opacity="0.9"
          />
          {/* Inner glowing wing strata */}
          <path
            d="M 470 320 C 390 280 320 260 220 280 C 280 330 360 350 440 370 C 360 380 290 410 230 460 C 310 460 390 440 460 410 Z"
            fill={palette.highlight}
            opacity="0.75"
          />
        </g>

        {/* RIGHT WING - Spanning sweeping primary and secondary feathers */}
        <g filter="url(#soft-glow)">
          {/* Outer primary feather tips */}
          <path
            d="M 540 300 C 650 200 800 120 960 160 C 910 220 820 270 720 320 C 820 300 920 290 990 330 C 930 380 830 410 730 420 C 820 430 900 460 960 520 C 880 540 780 520 690 490 C 770 520 840 580 880 650 C 800 630 700 570 620 500 C 570 450 540 380 540 300 Z"
            fill={`url(#phoenix-wing-right-${theme})`}
          />
          {/* Upper arching wing feathers */}
          <path
            d="M 520 260 C 610 160 730 80 880 70 C 820 130 710 180 620 240 C 730 170 820 140 900 150 C 830 200 720 240 630 290 C 570 330 540 310 520 260 Z"
            fill={`url(#crest-glow-${theme})`}
            opacity="0.9"
          />
          {/* Inner glowing wing strata */}
          <path
            d="M 530 320 C 610 280 680 260 780 280 C 720 330 640 350 560 370 C 640 380 710 410 770 460 C 690 460 610 440 540 410 Z"
            fill={palette.highlight}
            opacity="0.75"
          />
        </g>

        {/* CHEST & TORSO FIRE - Luminous avian body */}
        <g filter="url(#ultra-glow)">
          <path
            d="M 500 240 C 450 270 440 380 460 480 C 480 530 500 580 500 580 C 500 580 520 530 540 480 C 560 380 550 270 500 240 Z"
            fill={`url(#flame-body-${theme})`}
          />
          <path
            d="M 500 270 C 475 310 470 380 485 450 C 495 480 500 510 500 510 C 500 510 505 480 515 450 C 530 380 525 310 500 270 Z"
            fill={palette.core}
            opacity="0.9"
          />
        </g>

        {/* PHOENIX HEAD, CROWN, CREST & BEAK */}
        <g filter="url(#soft-glow)">
          {/* Crown flaming horns/feathers */}
          <path
            d="M 500 110 C 490 140 470 170 480 210 C 470 190 450 170 440 140 C 450 180 460 210 480 240 C 490 220 500 200 500 110 Z"
            fill={palette.highlight}
          />
          <path
            d="M 500 110 C 510 140 530 170 520 210 C 530 190 550 170 560 140 C 550 180 540 210 520 240 C 510 220 500 200 500 110 Z"
            fill={palette.highlight}
          />
          {/* Central high spire crest */}
          <path
            d="M 500 70 Q 488 130 492 190 Q 500 170 508 190 Q 512 130 500 70 Z"
            fill={palette.core}
          />

          {/* Head base */}
          <circle cx="500" cy="225" r="32" fill={`url(#flame-body-${theme})`} />

          {/* Piercing avian glowing eyes */}
          <ellipse cx="482" cy="222" rx="10" ry="6" transform="rotate(-15 482 222)" fill={palette.core} filter="url(#ultra-glow)" />
          <ellipse cx="518" cy="222" rx="10" ry="6" transform="rotate(15 518 222)" fill={palette.core} filter="url(#ultra-glow)" />

          {/* Pupils / inner glow */}
          <circle cx="484" cy="222" r="3.5" fill={palette.secondary} />
          <circle cx="516" cy="222" r="3.5" fill={palette.secondary} />

          {/* Beak */}
          <polygon points="494,232 506,232 500,254" fill={palette.core} />
          <polygon points="496,242 504,242 500,260" fill={palette.highlight} />
        </g>

        {/* Orbiting cyber-sparks / energy embers */}
        {animated && (
          <g opacity="0.85">
            <circle cx="490" cy="90" r="3" fill="#ffffff" className="animate-ping" style={{ animationDuration: '3s' }} />
            <circle cx="340" cy="210" r="2.5" fill={palette.highlight} className="animate-pulse" />
            <circle cx="660" cy="210" r="2.5" fill={palette.highlight} className="animate-pulse" />
            <circle cx="210" cy="360" r="3" fill={palette.secondary} className="animate-ping" style={{ animationDuration: '4s' }} />
            <circle cx="790" cy="360" r="3" fill={palette.secondary} className="animate-ping" style={{ animationDuration: '4s' }} />
            <circle cx="450" cy="560" r="2.5" fill={palette.core} className="animate-pulse" />
            <circle cx="550" cy="560" r="2.5" fill={palette.core} className="animate-pulse" />
          </g>
        )}
      </svg>
    </div>
  );
};
