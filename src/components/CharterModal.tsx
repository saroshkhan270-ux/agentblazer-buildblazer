import React from 'react';
import { ThemeMode } from '../types';
import { X, ShieldCheck, Cpu, Code2, Users, BookOpen } from 'lucide-react';

interface CharterModalProps {
  theme: ThemeMode;
  onClose: () => void;
}

export const CharterModal: React.FC<CharterModalProps> = ({ theme, onClose }) => {
  const isFrost = theme === 'frost';
  const isInferno = theme === 'inferno';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-6 ${
          isFrost
            ? 'bg-white border-sky-300 text-slate-900 shadow-sky-200/50'
            : isInferno
            ? 'bg-[#180a04] border-amber-700/80 text-amber-50 shadow-orange-950/80'
            : 'bg-[#120822] border-purple-600/80 text-white shadow-purple-950/80'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-black/20 text-inherit transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            OFFICIAL GOVERNANCE & CHARTER
          </span>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
            AgentBlazer Club Charter
          </h3>
          <p className="text-xs opacity-75 mt-1 font-mono">
            Department of Computer Science & Engineering • St Joseph Engineering College
          </p>
        </div>

        {/* Charter Articles */}
        <div className="space-y-4 text-xs sm:text-sm leading-relaxed opacity-90">
          
          <div className="p-4 rounded-2xl border border-inherit bg-black/5 dark:bg-black/20 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-base text-cyan-400">
              <Cpu className="w-4 h-4" />
              <span>Article I: Core Mission</span>
            </div>
            <p className="text-xs opacity-80 leading-relaxed">
              To cultivate an authentic collegiate laboratory where undergraduate engineers bridge theoretical computer science with applied autonomous agent design, multi-modal LLM reasoning, and modern enterprise integration.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-inherit bg-black/5 dark:bg-black/20 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-base text-amber-400">
              <Code2 className="w-4 h-4" />
              <span>Article II: Hands-on Open Source First</span>
            </div>
            <p className="text-xs opacity-80 leading-relaxed">
              Every initiative, hackathon, and masterclass prioritizes verifiable engineering output—commit histories, open pull requests (GSoC, LangChain, LlamaIndex), live deployed prototypes, and peer-reviewed code artifacts over passive consumption.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-inherit bg-black/5 dark:bg-black/20 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-base text-purple-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Article III: Industry Collaboration</span>
            </div>
            <p className="text-xs opacity-80 leading-relaxed">
              In active synergy with Salesforce Trailblazer community mentors, alumni engineers, and institutional leaders, the club secures developer sandbox access, certification roadmaps, and technical symposiums for every active member.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-inherit bg-black/5 dark:bg-black/20 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-base text-emerald-400">
              <Users className="w-4 h-4" />
              <span>Article IV: Student Leadership & Inclusivity</span>
            </div>
            <p className="text-xs opacity-80 leading-relaxed">
              Student officers and working committee leads operate transparently, welcoming all batches from 1st through 4th year across all engineering disciplines interested in autonomous AI architectures.
            </p>
          </div>

        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full font-bold text-xs border border-inherit hover:bg-black/20 transition-colors cursor-pointer"
          >
            Acknowledge Charter
          </button>
        </div>
      </div>
    </div>
  );
};
