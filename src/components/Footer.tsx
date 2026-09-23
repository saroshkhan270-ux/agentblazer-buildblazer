import React from 'react';
import { ActiveTab, ThemeMode } from '../types';
import { Cpu, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  theme: ThemeMode;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenCharter: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  theme,
  setActiveTab,
  onOpenCharter,
}) => {
  const isFrost = theme === 'frost';
  const isInferno = theme === 'inferno';

  return (
    <footer
      className={`border-t transition-colors duration-300 py-12 ${
        isFrost
          ? 'bg-slate-50 border-slate-200 text-slate-700'
          : isInferno
          ? 'bg-[#0d0502] border-amber-950/80 text-amber-100'
          : 'bg-[#05030a] border-purple-950/80 text-purple-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden p-0.5 border ${
                  isFrost
                    ? 'bg-white border-sky-300'
                    : isInferno
                    ? 'bg-[#180903] border-amber-800'
                    : 'bg-[#120722] border-purple-800'
                }`}
              >
                <img
                  src="/assets/logo.jpeg"
                  alt="AgentBlazer"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-extrabold text-lg tracking-tight">
                Agent<span className={isFrost ? 'text-sky-600' : isInferno ? 'text-orange-400' : 'text-purple-400'}>Blazer</span> Club
              </span>
            </div>

            <p className="text-xs opacity-75 leading-relaxed max-w-sm">
              Department of Computer Science & Engineering
              <br />
              St Joseph Engineering College, Vamanjoor, Mangaluru, Karnataka - 575028, India
            </p>

          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest opacity-80">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenCharter}
                  className="hover:underline opacity-80 hover:opacity-100 cursor-pointer"
                >
                  About & Charter
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('events')}
                  className="hover:underline opacity-80 hover:opacity-100 cursor-pointer"
                >
                  Workshops & Contests
                </button>
              </li>
              <li>
                <a
                  href="https://trailhead.salesforce.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline opacity-80 hover:opacity-100 inline-flex items-center gap-1"
                >
                  <span>Salesforce Trailhead Community</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://sjec.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline opacity-80 hover:opacity-100 inline-flex items-center gap-1"
                >
                  <span>SJEC Official Website</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Affiliations Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest opacity-80">
              AFFILIATIONS
            </h4>
            <div className="flex flex-wrap gap-2">
              <span
                className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md border ${
                  isFrost
                    ? 'bg-white border-slate-300 text-slate-800'
                    : isInferno
                    ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                    : 'bg-purple-950/60 border-purple-800 text-purple-300'
                }`}
              >
                SJEC CSE
              </span>
              <span
                className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md border ${
                  isFrost
                    ? 'bg-white border-slate-300 text-slate-800'
                    : isInferno
                    ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                    : 'bg-purple-950/60 border-purple-800 text-purple-300'
                }`}
              >
                Agentforce
              </span>
              <span
                className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md border ${
                  isFrost
                    ? 'bg-white border-slate-300 text-slate-800'
                    : isInferno
                    ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                    : 'bg-purple-950/60 border-purple-800 text-purple-300'
                }`}
              >
                Trailblazer
              </span>
            </div>
            <p className="text-[11px] opacity-70 pt-1 leading-relaxed">
              Empowered by Faculty guidance and student leadership.
            </p>
          </div>

        </div>

        {/* Bottom Copyright line */}
        <div
          className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs opacity-75 font-mono ${
            isFrost ? 'border-slate-200' : isInferno ? 'border-amber-950' : 'border-purple-950'
          }`}
        >
          <div>
            © 2025-2026 AgentBlazer Club, SJEC CSE • Autonomous AI Initiative
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Crafted for SJEC Trailblazers</span>
            <a
              href="#admin"
              className="opacity-60 hover:opacity-100 transition-opacity hover:underline"
            >
              [ admin portal ]
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
