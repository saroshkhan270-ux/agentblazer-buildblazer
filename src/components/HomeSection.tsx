import React from 'react';
import { ActiveTab, ThemeMode } from '../types';
import { PhoenixHero } from './PhoenixHero';
import { ArrowRight, BookOpen, Sparkles, Award, Users2, ShieldCheck } from 'lucide-react';

interface HomeSectionProps {
  theme: ThemeMode;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenCharter: () => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  theme,
  setActiveTab,
  onOpenCharter,
}) => {
  const isFrost = theme === 'frost';
  const isInferno = theme === 'inferno';

  return (
    <section className="relative overflow-hidden py-12 lg:py-20">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 ${
            isFrost ? 'bg-sky-400' : isInferno ? 'bg-orange-600' : 'bg-purple-600'
          }`}
        />
        <div
          className={`absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20 ${
            isFrost ? 'bg-cyan-300' : isInferno ? 'bg-red-700' : 'bg-cyan-600'
          }`}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Collegiate Initiative Chip */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-colors shadow-sm select-none backdrop-blur-md">
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${
                  isFrost ? 'bg-sky-500' : isInferno ? 'bg-orange-400' : 'bg-cyan-400'
                }`}
              />
              <span
                className={
                  isFrost
                    ? 'text-sky-900 font-medium'
                    : isInferno
                    ? 'text-amber-200'
                    : 'text-purple-200'
                }
              >
                Collegiate AI Initiative • St Joseph Engineering College
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <h1
                className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] ${
                  isFrost ? 'text-slate-900' : isInferno ? 'text-amber-50' : 'text-white'
                }`}
              >
                Pioneering Autonomous
              </h1>
              <div
                className={`text-4xl sm:text-5xl lg:text-6xl font-serif italic font-normal tracking-wide ${
                  isFrost
                    ? 'text-sky-600'
                    : isInferno
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]'
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 drop-shadow-[0_0_25px_rgba(168,85,247,0.45)]'
                }`}
              >
                & Agentic AI Systems
              </div>
            </div>

            {/* Institutional Subtitle */}
            <div className="space-y-3">
              <p
                className={`text-sm font-semibold tracking-wide uppercase font-mono ${
                  isFrost ? 'text-sky-800' : isInferno ? 'text-orange-400/90' : 'text-purple-300/90'
                }`}
              >
                Department of Computer Science & Engineering · St Joseph Engineering College, Mangaluru
              </p>
              <p
                className={`text-base sm:text-lg leading-relaxed max-w-2xl ${
                  isFrost ? 'text-slate-600' : isInferno ? 'text-amber-200/80' : 'text-purple-200/80'
                }`}
              >
                A dedicated student-led laboratory shaping tomorrow's software engineers through autonomous agent
                architectures, open-source AI tooling, collaborative workshops, and premier Salesforce Trailblazer
                community synergy.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="explore-workshops-btn"
                onClick={() => setActiveTab('events')}
                className={`group flex items-center gap-2.5 px-6 py-3.5 rounded-full font-semibold text-sm transition-all cursor-pointer shadow-lg active:scale-95 select-none ${
                  isFrost
                    ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-500/25'
                    : isInferno
                    ? 'bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:opacity-95 text-white shadow-orange-900/50'
                    : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white shadow-purple-900/50'
                }`}
              >
                <span>Explore Workshops & Events</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="read-charter-btn"
                onClick={onOpenCharter}
                className={`group flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm transition-all cursor-pointer select-none border backdrop-blur-md ${
                  isFrost
                    ? 'border-slate-300 hover:bg-slate-100 text-slate-700'
                    : isInferno
                    ? 'border-amber-900/60 hover:bg-amber-950/40 text-amber-200'
                    : 'border-purple-800/60 hover:bg-purple-950/40 text-purple-200'
                }`}
              >
                <BookOpen className="w-4 h-4 opacity-75 group-hover:opacity-100" />
                <span>Read Club Charter</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Stats Row matching video */}
            <div
              className={`pt-8 border-t grid grid-cols-1 sm:grid-cols-3 gap-6 ${
                isFrost
                  ? 'border-slate-200'
                  : isInferno
                  ? 'border-amber-950/80'
                  : 'border-purple-950/80'
              }`}
            >
              {/* Stat 1 */}
              <div className="space-y-1">
                <div
                  className={`text-3xl font-extrabold tracking-tight ${
                    isFrost ? 'text-sky-600' : isInferno ? 'text-orange-400' : 'text-cyan-400'
                  }`}
                >
                  8+
                </div>
                <div
                  className={`text-xs font-semibold ${
                    isFrost ? 'text-slate-600' : isInferno ? 'text-amber-200/70' : 'text-purple-300/70'
                  }`}
                >
                  Workshops & Challenges
                </div>
              </div>

              {/* Stat 2 */}
              <div className="space-y-1">
                <div
                  className={`text-3xl font-extrabold tracking-tight ${
                    isFrost ? 'text-sky-600' : isInferno ? 'text-amber-400' : 'text-purple-400'
                  }`}
                >
                  500+
                </div>
                <div
                  className={`text-xs font-semibold ${
                    isFrost ? 'text-slate-600' : isInferno ? 'text-amber-200/70' : 'text-purple-300/70'
                  }`}
                >
                  Engineering Students Reached
                </div>
              </div>

              {/* Stat 3 - Salesforce */}
              <div className="space-y-0.5">
                <div
                  className={`text-xl font-bold tracking-tight flex items-center gap-1.5 ${
                    isFrost ? 'text-sky-700' : isInferno ? 'text-orange-300' : 'text-cyan-300'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Salesforce</span>
                </div>
                <div
                  className={`text-xs font-semibold ${
                    isFrost ? 'text-sky-800' : isInferno ? 'text-amber-400' : 'text-purple-300'
                  }`}
                >
                  Community Partner
                </div>
                <div
                  className={`text-[11px] ${
                    isFrost ? 'text-slate-500' : 'text-gray-400'
                  }`}
                >
                  Active Trailblazer Mentorship
                </div>
              </div>
            </div>

          </div>

          {/* Right Hero Graphic: Authentic AgentBlazer Hexagon Emblem */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            {/* Ambient pulsating halo behind emblem */}
            <div
              className={`absolute w-72 h-72 rounded-full blur-[100px] pointer-events-none opacity-40 animate-pulse ${
                isFrost ? 'bg-sky-400' : isInferno ? 'bg-orange-600' : 'bg-purple-600'
              }`}
            />

            <div
              className={`relative w-full max-w-[420px] aspect-square rounded-3xl p-5 flex flex-col items-center justify-center border backdrop-blur-xl transition-all duration-500 group select-none ${
                isFrost
                  ? 'bg-gradient-to-b from-sky-50/80 to-white/95 border-sky-200 shadow-2xl shadow-sky-100'
                  : isInferno
                  ? 'bg-gradient-to-b from-[#1c0c05]/90 to-[#0c0502]/95 border-orange-800/50 shadow-2xl shadow-orange-950/70'
                  : 'bg-gradient-to-b from-[#140b22]/90 to-[#07040d]/95 border-purple-800/50 shadow-2xl shadow-purple-950/70'
              }`}
            >
              {/* Authentic AgentBlazer Club Hexagon Emblem from uploaded image */}
              <div className="relative w-full h-[80%] flex items-center justify-center overflow-hidden rounded-2xl">
                <img
                  src="/assets/agentblazer_logo.jpg"
                  alt="AgentBlazer Club Hexagonal Crest"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_35px_rgba(168,85,247,0.45)] group-hover:scale-105 transition-transform duration-500"
                />

                {/* Cyber glowing scanlines effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent pointer-events-none" />
              </div>

              {/* Emblem Caption Label */}
              <div className="text-center mt-2 space-y-0.5 relative z-10">
                <div
                  className={`text-2xl sm:text-3xl font-black tracking-tight ${
                    isFrost
                      ? 'text-slate-900'
                      : isInferno
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400'
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300'
                  }`}
                >
                  AgentBlazer
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div
                    className={`h-[1px] w-8 ${
                      isFrost ? 'bg-sky-400' : isInferno ? 'bg-orange-500' : 'bg-purple-400'
                    }`}
                  />
                  <span
                    className={`text-xs font-mono font-bold tracking-[0.25em] uppercase ${
                      isFrost ? 'text-sky-600' : isInferno ? 'text-amber-400' : 'text-cyan-400'
                    }`}
                  >
                    CLUB
                  </span>
                  <div
                    className={`h-[1px] w-8 ${
                      isFrost ? 'bg-sky-400' : isInferno ? 'bg-orange-500' : 'bg-purple-400'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
