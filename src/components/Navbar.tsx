import React from 'react';
import { ActiveTab, ThemeMode } from '../types';
import { Home, Users, Calendar, UserPlus, Sparkles, Flame, Snowflake, Cpu } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  onOpenSourceCode: () => void;
  onReplayIntro: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  onOpenSourceCode,
  onReplayIntro,
}) => {
  const isFrost = theme === 'frost';
  const isInferno = theme === 'inferno';

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'about', label: 'About Us', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'events', label: 'Events & Workshops', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'join', label: 'Join & Connect', icon: <UserPlus className="w-3.5 h-3.5" /> },
  ];

  return (
    <header
      id="main-navigation"
      className={`sticky top-0 z-40 w-full transition-all duration-300 backdrop-blur-2xl relative ${
        isFrost
          ? 'bg-white/90 border-b-2 border-sky-400 shadow-[0_4px_30px_rgba(14,165,233,0.35)] text-slate-800'
          : isInferno
          ? 'bg-[#0e0603]/90 border-b-2 border-orange-500/70 shadow-[0_4px_35px_rgba(249,115,22,0.5),0_10px_50px_rgba(245,158,11,0.3)] text-amber-100'
          : 'bg-[#07050e]/90 border-b-2 border-cyan-500/70 shadow-[0_4px_35px_rgba(6,182,212,0.5),0_10px_60px_rgba(168,85,247,0.35)] text-white'
      }`}
    >
      {/* Radiant bottom laser glow bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none ${
          isFrost
            ? 'bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_15px_#38bdf8]'
            : isInferno
            ? 'bg-gradient-to-r from-transparent via-orange-400 to-transparent shadow-[0_0_18px_#f97316]'
            : 'bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#06b6d4,0_0_40px_#a855f7]'
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left: Brand Identity with Radiant Crest */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden p-1 transition-all group-hover:scale-110 border-2 ${
                isFrost
                  ? 'bg-white border-sky-400 shadow-[0_0_25px_rgba(14,165,233,0.6)]'
                  : isInferno
                  ? 'bg-[#180903] border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.7)]'
                  : 'bg-[#130722] border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.85),0_0_60px_rgba(168,85,247,0.5)]'
              }`}
            >
              <img
                src="/assets/agentblazer_logo.jpg"
                alt="AgentBlazer Logo"
                className="w-full h-full object-contain"
              />
            </div>
            {/* Ambient pulse dot */}
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 animate-pulse ${
                isFrost
                  ? 'bg-sky-400 border-white shadow-[0_0_10px_#38bdf8]'
                  : isInferno
                  ? 'bg-orange-400 border-black shadow-[0_0_10px_#f97316]'
                  : 'bg-cyan-400 border-black shadow-[0_0_12px_#06b6d4]'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`font-black text-xl tracking-tight transition-colors ${
                  isFrost
                    ? 'text-slate-900 group-hover:text-sky-600'
                    : isInferno
                    ? 'text-amber-50 group-hover:text-orange-300'
                    : 'text-white group-hover:text-cyan-300'
                }`}
              >
                Agent<span className={isFrost ? 'text-sky-600' : isInferno ? 'text-amber-500' : 'text-cyan-400 font-extrabold'}>Blazer</span>
              </span>
              <span
                className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-semibold border-2 transition-all ${
                  isFrost
                    ? 'bg-sky-50 border-sky-400 text-sky-700 shadow-[0_0_10px_rgba(56,189,248,0.4)]'
                    : isInferno
                    ? 'bg-amber-950/70 border-orange-500 text-orange-300 shadow-[0_0_12px_rgba(249,115,22,0.4)]'
                    : 'bg-purple-950/70 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                }`}
              >
                sjec/cse
              </span>
            </div>
            <p
              className={`text-[11px] font-medium leading-tight ${
                isFrost ? 'text-slate-500' : isInferno ? 'text-amber-400/80' : 'text-purple-300/80'
              }`}
            >
              Department of Computer Science & Engineering
            </p>
          </div>
        </div>

        {/* Center: Glowing Navigation Tabs (Full Glowing Cyber Capsule) */}
        <nav
          className={`hidden md:flex items-center p-1.5 rounded-full border-2 transition-all duration-300 ${
            isFrost
              ? 'bg-slate-100/90 border-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.35)]'
              : isInferno
              ? 'bg-[#180903]/90 border-orange-500/70 shadow-[0_0_25px_rgba(249,115,22,0.45),inset_0_0_15px_rgba(245,158,11,0.2)]'
              : 'bg-[#0f071f]/90 border-cyan-400/70 shadow-[0_0_30px_rgba(6,182,212,0.5),inset_0_0_20px_rgba(168,85,247,0.3)]'
          }`}
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer select-none whitespace-nowrap ${
                  isActive
                    ? isFrost
                      ? 'bg-sky-600 text-white shadow-[0_0_20px_rgba(14,165,233,0.8)]'
                      : isInferno
                      ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-[0_0_25px_rgba(249,115,22,0.9)] border border-orange-300'
                      : 'bg-gradient-to-r from-cyan-500 via-purple-600 to-indigo-600 text-white shadow-[0_0_25px_rgba(6,182,212,0.9),0_0_50px_rgba(168,85,247,0.7)] border border-cyan-300 font-bold'
                    : isFrost
                    ? 'text-slate-600 hover:text-sky-700 hover:bg-sky-100/70'
                    : isInferno
                    ? 'text-amber-200/80 hover:text-amber-50 hover:bg-amber-950/50 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                    : 'text-purple-200/80 hover:text-cyan-200 hover:bg-cyan-950/40 hover:shadow-[0_0_18px_rgba(6,182,212,0.5)]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Theme Switcher & Actions with Glow */}
        <div className="flex items-center gap-2.5">
          {/* Theme Switcher Group with Neon Outline */}
          <div
            id="theme-selector-group"
            className={`flex items-center p-1 rounded-full border-2 text-xs font-semibold transition-all ${
              isFrost
                ? 'bg-white border-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.3)] text-slate-700'
                : isInferno
                ? 'bg-[#180b06] border-orange-500/70 shadow-[0_0_20px_rgba(249,115,22,0.4)] text-amber-200'
                : 'bg-[#120a1f] border-cyan-400/70 shadow-[0_0_20px_rgba(6,182,212,0.45)] text-purple-200'
            }`}
          >
            <button
              id="theme-btn-violet"
              onClick={() => setTheme('violet')}
              title="Violet Theme (Original AI Aura)"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                theme === 'violet'
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_#a855f7]'
                  : 'hover:text-purple-300 opacity-75 hover:opacity-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="hidden sm:inline text-[11px]">Violet</span>
            </button>

            <button
              id="theme-btn-inferno"
              onClick={() => setTheme('inferno')}
              title="Inferno Theme (Fiery Ember)"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                theme === 'inferno'
                  ? 'bg-orange-600 text-white shadow-[0_0_15px_#f97316]'
                  : 'hover:text-orange-300 opacity-75 hover:opacity-100'
              }`}
            >
              <Flame className="w-3 h-3 text-orange-400" />
              <span className="hidden sm:inline text-[11px]">Inferno</span>
            </button>

            <button
              id="theme-btn-frost"
              onClick={() => setTheme('frost')}
              title="Frost Theme (Clean Ice Light Mode)"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                theme === 'frost'
                  ? 'bg-sky-600 text-white shadow-[0_0_15px_#0ea5e9]'
                  : 'hover:text-sky-300 opacity-75 hover:opacity-100'
              }`}
            >
              <Snowflake className="w-3 h-3 text-sky-400" />
              <span className="hidden sm:inline text-[11px]">Frost</span>
            </button>
          </div>

          {/* Replay Intro Button with Glow */}
          <button
            onClick={onReplayIntro}
            title="Replay Phoenix Intro Screen"
            className={`p-2 rounded-xl border-2 transition-all cursor-pointer hidden lg:flex items-center justify-center ${
              isFrost
                ? 'border-sky-300 hover:border-sky-500 hover:shadow-[0_0_15px_rgba(14,165,233,0.5)] text-sky-700'
                : isInferno
                ? 'border-orange-500/70 hover:border-orange-400 hover:shadow-[0_0_20px_rgba(249,115,22,0.6)] text-orange-300'
                : 'border-cyan-400/70 hover:border-cyan-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] text-cyan-300'
            }`}
          >
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
          </button>

        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="flex md:hidden border-t border-inherit overflow-x-auto py-2 px-4 gap-2 no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 cursor-pointer ${
                isActive
                  ? isFrost
                    ? 'bg-sky-600 text-white'
                    : isInferno
                    ? 'bg-orange-600 text-white'
                    : 'bg-purple-600 text-white'
                  : 'opacity-70'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
