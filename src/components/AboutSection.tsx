import React, { useState, useEffect } from 'react';
import { LeadershipMember, ThemeMode } from '../types';
import {
  HONORED_GUESTS,
  FACULTY_COUNCIL,
  STUDENT_OFFICERS,
  CORE_WORKING_COMMITTEE,
} from '../data';
import { useData } from '../context/DataContext';
import { X, ArrowRight, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AboutSectionProps {
  theme: ThemeMode;
  selectedMember?: LeadershipMember | null;
  onClearSelectedMember?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  theme,
  selectedMember,
  onClearSelectedMember,
}) => {
  const { leadership } = useData();
  const isFrost = theme === 'frost';
  const isInferno = theme === 'inferno';

  // Categorize leadership members from live database context
  const honoredGuests = leadership.filter((m) => m.category === 'guest');
  const facultyCouncil = leadership.filter((m) => m.category === 'faculty');
  const studentOfficers = leadership.filter((m) => m.category === 'core-officer');
  const coreWorkingCommittee = leadership.filter((m) => m.category === 'working-committee');

  const guestsList = honoredGuests.length > 0 ? honoredGuests : HONORED_GUESTS;
  const facultyList = facultyCouncil.length > 0 ? facultyCouncil : FACULTY_COUNCIL;
  const officersList = studentOfficers.length > 0 ? studentOfficers : STUDENT_OFFICERS;
  const committeeList = coreWorkingCommittee.length > 0 ? coreWorkingCommittee : CORE_WORKING_COMMITTEE;

  // Active member for compact profile modal
  const [activePortraitMember, setActivePortraitMember] = useState<LeadershipMember | null>(null);

  // Sync selectedMember from search or external action
  useEffect(() => {
    if (selectedMember) {
      setActivePortraitMember(selectedMember);
    }
  }, [selectedMember]);

  const handleClosePortrait = () => {
    setActivePortraitMember(null);
    onClearSelectedMember?.();
  };

  // Keyboard shortcut listener (Escape closes modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClosePortrait();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="py-12 sm:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Title Section */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border font-mono">
            <span className={`w-1.5 h-1.5 rounded-full ${isFrost ? 'bg-sky-500' : isInferno ? 'bg-orange-500' : 'bg-purple-400'}`} />
            <span className={isFrost ? 'text-sky-800' : isInferno ? 'text-amber-300' : 'text-purple-300'}>
              Mentorship & Leadership Council
            </span>
          </div>

          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
              isFrost ? 'text-slate-900' : isInferno ? 'text-amber-50' : 'text-white'
            }`}
          >
            Inauguration & Executive Leadership
          </h2>

          <p
            className={`text-base sm:text-lg leading-relaxed ${
              isFrost ? 'text-slate-600' : isInferno ? 'text-amber-200/80' : 'text-purple-200/80'
            }`}
          >
            Fostering technical curiosity, hands-on engineering mentorship, and bridging academic theory with real-world software practices.
          </p>
        </div>

        {/* Featured Inauguration Card */}
        <div
          className={`rounded-3xl p-6 sm:p-8 lg:p-10 border-2 relative overflow-hidden transition-all duration-300 ${
            isFrost
              ? 'bg-gradient-to-br from-white via-sky-50 to-white border-sky-400 shadow-[0_0_40px_rgba(14,165,233,0.35)]'
              : isInferno
              ? 'bg-gradient-to-br from-[#1c0c05] via-[#120703] to-[#0d0402] border-orange-500 shadow-[0_0_55px_rgba(249,115,22,0.5),0_0_100px_rgba(245,158,11,0.25)]'
              : 'bg-gradient-to-br from-[#140b24] via-[#090514] to-[#06030c] border-cyan-400/90 shadow-[0_0_55px_rgba(6,182,212,0.55),0_0_110px_rgba(168,85,247,0.4)]'
          }`}
        >
          {/* Ambient decorative glow */}
          <div
            className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[110px] pointer-events-none opacity-30 animate-pulse ${
              isFrost ? 'bg-sky-400' : isInferno ? 'bg-orange-500' : 'bg-cyan-500'
            }`}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold font-mono tracking-wide border bg-black/10 dark:bg-white/10 border-inherit">
                Official Launch Keynote
              </div>

              <h3
                className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight ${
                  isFrost
                    ? 'text-slate-900'
                    : isInferno
                    ? 'text-amber-100'
                    : 'text-white'
                }`}
              >
                AgentBlazer Club Launch & <span className={isFrost ? 'text-sky-600 font-serif italic' : isInferno ? 'text-amber-400 font-serif italic' : 'text-cyan-300 font-serif italic'}>Technical Symposium</span>
              </h3>

              <p
                className={`text-sm sm:text-base leading-relaxed ${
                  isFrost ? 'text-slate-600' : isInferno ? 'text-amber-200/80' : 'text-purple-200/80'
                }`}
              >
                The Department of Computer Science & Engineering founded the AgentBlazer Club to build an
                authentic student collective centered on autonomous engineering, open-source software,
                and active industry partnership.
              </p>
            </div>

            {/* Right Inauguration Badge */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 rounded-2xl border backdrop-blur-md bg-black/5 dark:bg-black/30 border-inherit">
              <span
                className={`text-xs uppercase font-mono tracking-widest font-semibold ${
                  isFrost ? 'text-sky-700' : isInferno ? 'text-amber-400' : 'text-purple-300'
                }`}
              >
                INAUGURATED ON
              </span>
              <div
                className={`text-2xl sm:text-3xl font-serif italic font-bold my-1 ${
                  isFrost ? 'text-slate-900' : isInferno ? 'text-amber-100' : 'text-white'
                }`}
              >
                August 25, 2025
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full border font-mono ${
                    isFrost
                      ? 'bg-sky-100/70 border-sky-300 text-sky-800'
                      : isInferno
                      ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                      : 'bg-purple-950/60 border-purple-800 text-purple-300'
                  }`}
                >
                  Academic Year 2025-2026
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full border font-mono ${
                    isFrost
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                  }`}
                >
                  SJEC Campus
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 1. Honored Guests & College Leadership */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3
              className={`text-xl font-bold tracking-tight ${
                isFrost ? 'text-slate-800' : isInferno ? 'text-amber-100' : 'text-white'
              }`}
            >
              Honored Guests & College Leadership
            </h3>
            <span className="text-xs font-mono opacity-60 hidden sm:inline">
              Click any card to view detailed bio
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {guestsList.map((guest) => {
              const isSelected = activePortraitMember?.id === guest.id;
              return (
                <div
                  key={guest.id}
                  onClick={() => setActivePortraitMember(guest)}
                  className={`group p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer select-none flex flex-col justify-between relative overflow-hidden ${
                    isSelected
                      ? isFrost
                        ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-400 shadow-[0_0_40px_rgba(14,165,233,0.7)] scale-[1.04]'
                        : isInferno
                        ? 'bg-[#1f0d06] border-orange-400 ring-2 ring-amber-400 shadow-[0_0_45px_rgba(249,115,22,0.8)] scale-[1.04]'
                        : 'bg-[#1b0c33] border-cyan-300 ring-2 ring-cyan-400 shadow-[0_0_55px_rgba(6,182,212,1)] scale-[1.04]'
                      : isFrost
                      ? 'bg-white border-sky-200 hover:border-sky-400 hover:shadow-[0_0_30px_rgba(14,165,233,0.45)] hover:scale-[1.02]'
                      : isInferno
                      ? 'bg-[#150904]/80 border-orange-900/60 hover:border-orange-500 hover:shadow-[0_0_35px_rgba(249,115,22,0.65)] hover:bg-[#1a0b05] hover:scale-[1.02]'
                      : 'bg-[#0f091a]/85 border-purple-900/60 hover:border-cyan-400 hover:shadow-[0_0_45px_rgba(6,182,212,0.8)] hover:bg-[#160b29] hover:scale-[1.02]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      {/* Photo Thumbnail */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shrink-0">
                        <img
                          src={guest.photoUrl}
                          alt={guest.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {guest.subCategoryTitle && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                            isFrost
                              ? 'bg-slate-100 text-slate-700 border-slate-300'
                              : isInferno
                              ? 'bg-amber-950/80 text-amber-400 border-amber-800/80'
                              : 'bg-purple-950/80 text-purple-300 border-purple-800/80'
                          }`}
                        >
                          {guest.subCategoryTitle}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4
                        className={`text-base font-bold group-hover:underline ${
                          isFrost ? 'text-slate-900' : isInferno ? 'text-amber-50' : 'text-white'
                        }`}
                      >
                        {guest.name}
                      </h4>
                      <p
                        className={`text-xs font-medium mt-0.5 ${
                          isFrost ? 'text-slate-500' : 'text-gray-400'
                        }`}
                      >
                        {guest.departmentRole}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-medium ${
                      isFrost
                        ? 'border-slate-100 text-slate-500'
                        : isInferno
                        ? 'border-amber-950/70 text-amber-400/80'
                        : 'border-purple-950/70 text-purple-300/80'
                    }`}
                  >
                    <span>{guest.tag}</span>
                    <span className="text-cyan-400 font-mono text-[11px] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      View Profile →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Faculty Advisory Council */}
        <div className="space-y-6">
          <h3
            className={`text-xl font-bold tracking-tight ${
              isFrost ? 'text-slate-800' : isInferno ? 'text-amber-100' : 'text-white'
            }`}
          >
            Faculty Advisory Council
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {facultyList.map((faculty) => {
              const isSelected = activePortraitMember?.id === faculty.id;
              return (
                <div
                  key={faculty.id}
                  onClick={() => setActivePortraitMember(faculty)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? isFrost
                        ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-400 shadow-[0_0_40px_rgba(14,165,233,0.7)] scale-[1.04]'
                        : isInferno
                        ? 'bg-[#1f0d06] border-orange-400 ring-2 ring-amber-400 shadow-[0_0_45px_rgba(249,115,22,0.8)] scale-[1.04]'
                        : 'bg-[#1b0c33] border-cyan-300 ring-2 ring-cyan-400 shadow-[0_0_55px_rgba(6,182,212,1)] scale-[1.04]'
                      : isFrost
                      ? 'bg-white border-sky-200 hover:border-sky-400 hover:shadow-[0_0_30px_rgba(14,165,233,0.45)] hover:scale-[1.02]'
                      : isInferno
                      ? 'bg-[#150904]/80 border-orange-900/60 hover:border-orange-500 hover:shadow-[0_0_35px_rgba(249,115,22,0.65)] hover:bg-[#1a0b05] hover:scale-[1.02]'
                      : 'bg-[#0f091a]/85 border-purple-900/60 hover:border-cyan-400 hover:shadow-[0_0_45px_rgba(6,182,212,0.8)] hover:bg-[#160b29] hover:scale-[1.02]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 shrink-0">
                      <img
                        src={faculty.photoUrl}
                        alt={faculty.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4
                        className={`text-lg font-bold group-hover:underline ${
                          isFrost ? 'text-slate-900' : isInferno ? 'text-amber-50' : 'text-white'
                        }`}
                      >
                        {faculty.name}
                      </h4>
                      <p
                        className={`text-xs ${
                          isFrost ? 'text-slate-500' : 'text-gray-400'
                        }`}
                      >
                        {faculty.role} • {faculty.departmentRole}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-mono border flex items-center gap-1 transition-colors ${
                      isSelected
                        ? 'bg-cyan-500 border-cyan-300 text-white shadow-md'
                        : isFrost
                        ? 'bg-sky-50 border-sky-200 text-sky-700 group-hover:bg-sky-100'
                        : isInferno
                        ? 'bg-amber-950/70 border-amber-800 text-amber-300 group-hover:bg-amber-900/60'
                        : 'bg-purple-950/70 border-purple-800 text-purple-300 group-hover:bg-purple-900/60'
                    }`}
                  >
                    <span>View Profile →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Student Core Team & Officers */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3
              className={`text-xl font-bold tracking-tight ${
                isFrost ? 'text-slate-800' : isInferno ? 'text-amber-100' : 'text-white'
              }`}
            >
              Student Core Team & Officers
            </h3>
            <span className="text-xs font-mono opacity-70">
              Academic Year 2025-2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {officersList.map((officer) => {
              const isSelected = activePortraitMember?.id === officer.id;
              return (
                <div
                  key={officer.id}
                  id={`officer-card-${officer.id}`}
                  onClick={() => setActivePortraitMember(officer)}
                  className={`group p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? isFrost
                        ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-400 shadow-[0_0_40px_rgba(14,165,233,0.7)] scale-[1.04]'
                        : isInferno
                        ? 'bg-[#1f0d06] border-orange-400 ring-2 ring-amber-400 shadow-[0_0_45px_rgba(249,115,22,0.8)] scale-[1.04]'
                        : 'bg-[#1b0c33] border-cyan-300 ring-2 ring-cyan-400 shadow-[0_0_60px_rgba(6,182,212,1)] scale-[1.04]'
                      : isFrost
                      ? 'bg-white border-sky-200 hover:border-sky-400 hover:shadow-[0_0_30px_rgba(14,165,233,0.45)] hover:scale-[1.02]'
                      : isInferno
                      ? 'bg-[#150904]/80 border-orange-900/60 hover:border-orange-500 hover:shadow-[0_0_35px_rgba(249,115,22,0.65)] hover:bg-[#1a0b05] hover:scale-[1.02]'
                      : 'bg-[#0f091a]/85 border-purple-900/60 hover:border-cyan-400 hover:shadow-[0_0_45px_rgba(6,182,212,0.8)] hover:bg-[#160b29] hover:scale-[1.02]'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Officer Header Badge */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${
                          isFrost
                            ? 'bg-sky-50 text-sky-800 border-sky-200'
                            : isInferno
                            ? 'bg-orange-950/60 text-orange-300 border-orange-800'
                            : 'bg-purple-950/60 text-purple-300 border-purple-800'
                        }`}
                      >
                        {officer.subCategoryTitle}
                      </span>
                      <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                        View
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5">
                      {/* Photo Thumbnail */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 shrink-0">
                        <img
                          src={officer.photoUrl}
                          alt={officer.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4
                          className={`text-lg font-bold group-hover:underline ${
                            isFrost ? 'text-slate-900' : isInferno ? 'text-amber-50' : 'text-white'
                          }`}
                        >
                          {officer.name}
                        </h4>
                        <p
                          className={`text-xs font-mono font-medium ${
                            isFrost ? 'text-sky-700' : isInferno ? 'text-orange-400' : 'text-cyan-400'
                          }`}
                        >
                          {officer.role}
                        </p>
                      </div>
                    </div>

                    <p
                      className={`text-xs leading-relaxed ${
                        isFrost ? 'text-slate-600' : 'text-gray-300'
                      }`}
                    >
                      {officer.description}
                    </p>
                  </div>

                  <div
                    className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${
                      isFrost ? 'border-slate-100' : isInferno ? 'border-amber-950/70' : 'border-purple-950/70'
                    }`}
                  >
                    <span className="font-mono text-[11px] opacity-70">
                      SJEC CSE • Core Team
                    </span>
                    <span className="font-bold text-[11px] text-cyan-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform font-mono">
                      View Profile →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Core Working Committee */}
        <div
          className={`p-6 rounded-2xl border ${
            isFrost
              ? 'bg-slate-50 border-slate-200'
              : isInferno
              ? 'bg-[#150904]/40 border-amber-900/30'
              : 'bg-[#0f091a]/40 border-purple-900/30'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <span
              className={`text-xs uppercase font-mono tracking-wider font-semibold ${
                isFrost ? 'text-sky-800' : isInferno ? 'text-amber-400' : 'text-purple-300'
              }`}
            >
              CORE WORKING COMMITTEE
            </span>
            <span className="text-xs font-mono text-gray-400">Departmental Representatives</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {committeeList.map((member) => (
              <div
                key={member.id}
                onClick={() => setActivePortraitMember(member)}
                className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all duration-300 cursor-pointer group ${
                  activePortraitMember?.id === member.id
                    ? isFrost
                      ? 'bg-sky-50 border-sky-500 shadow-[0_0_30px_rgba(14,165,233,0.6)] scale-[1.03]'
                      : isInferno
                      ? 'bg-[#1e0d05] border-orange-400 shadow-[0_0_35px_rgba(249,115,22,0.7)] scale-[1.03]'
                      : 'bg-[#1a0c33] border-cyan-300 shadow-[0_0_40px_rgba(6,182,212,0.9)] scale-[1.03]'
                    : isFrost
                    ? 'bg-white border-slate-200 text-slate-800 hover:border-sky-400 hover:shadow-[0_0_25px_rgba(14,165,233,0.4)] hover:scale-[1.02]'
                    : isInferno
                    ? 'bg-[#100703] border-amber-950 text-amber-100 hover:border-orange-500 hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:bg-[#190a05] hover:scale-[1.02]'
                    : 'bg-[#0b0614] border-purple-950 text-purple-100 hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(6,182,212,0.75)] hover:bg-[#150a26] hover:scale-[1.02]'
                }`}
              >
                <div className="w-11 h-11 rounded-lg overflow-hidden border border-white/10 shrink-0">
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold group-hover:text-cyan-300 transition-colors">{member.name}</div>
                  <div className="text-xs opacity-75">{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Compact Professional Member Profile Popup Modal */}
      <AnimatePresence>
        {activePortraitMember && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
            onClick={handleClosePortrait}
          >
            {/* Ambient background glow */}
            <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-purple-600/30 via-cyan-500/30 to-pink-500/20 blur-[90px] pointer-events-none animate-pulse" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-xl rounded-3xl overflow-hidden border-2 shadow-2xl p-6 select-none z-10 ${
                isFrost
                  ? 'bg-white border-sky-400 text-slate-900 shadow-[0_0_50px_rgba(14,165,233,0.4)]'
                  : isInferno
                  ? 'bg-[#1a0c06] border-orange-500 text-amber-50 shadow-[0_0_60px_rgba(249,115,22,0.5)]'
                  : 'bg-[#120822] border-cyan-400 text-white shadow-[0_0_60px_rgba(6,182,212,0.6),0_0_120px_rgba(168,85,247,0.4)]'
              }`}
            >
              {/* Close Button */}
              <button
                onClick={handleClosePortrait}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-black/60 hover:bg-cyan-500 text-white transition-colors cursor-pointer z-20 border border-white/20"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Layout: Mobile Stacked / Desktop Side-by-Side */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Member Photo Container */}
                <div className="w-40 h-40 md:w-5/12 md:h-48 rounded-2xl overflow-hidden border border-white/10 shadow-md shrink-0 relative">
                  <img
                    src={activePortraitMember.photoUrl}
                    alt={activePortraitMember.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                  {activePortraitMember.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase bg-black/75 text-cyan-300 backdrop-blur-md border border-cyan-500/30">
                      {activePortraitMember.badge}
                    </span>
                  )}
                </div>

                {/* Member Information Container */}
                <div className="flex-1 space-y-3 text-center md:text-left min-w-0 w-full">
                  <div>
                    {activePortraitMember.subCategoryTitle && (
                      <span className="text-[11px] font-mono font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
                        {activePortraitMember.subCategoryTitle}
                      </span>
                    )}
                    <h4 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                      {activePortraitMember.name}
                    </h4>
                    <p className={`text-xs font-mono font-semibold mt-1 ${isFrost ? 'text-sky-700' : isInferno ? 'text-amber-400' : 'text-purple-300'}`}>
                      {activePortraitMember.role}
                    </p>
                    <p className="text-xs opacity-75 mt-0.5">
                      {activePortraitMember.departmentRole}
                    </p>
                  </div>

                  {activePortraitMember.description && (
                    <p className="text-xs leading-relaxed opacity-85 pt-1 border-t border-white/10">
                      {activePortraitMember.description}
                    </p>
                  )}

                  <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2 text-[11px] font-mono opacity-70">
                    <span className="px-2.5 py-0.5 rounded-full border border-current">
                      {activePortraitMember.college || 'SJEC CSE'}
                    </span>
                    {activePortraitMember.tag && (
                      <span className="px-2.5 py-0.5 rounded-full border border-current">
                        {activePortraitMember.tag}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
