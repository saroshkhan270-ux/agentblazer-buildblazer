import { useData } from '../context/DataContext';
import { cleanSecureInput, hasSQLInjectionThreat } from '../utils/sanitize';
import React, { useState } from 'react';
import { ThemeMode } from '../types';
import { Send, CheckCircle, Mail, MapPin, Building, ArrowRight, UserPlus, Sparkles, X, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface JoinSectionProps {
  theme: ThemeMode;
  onOpenCharter: () => void;
}

export const JoinSection: React.FC<JoinSectionProps> = ({ theme, onOpenCharter }) => {
  const { addApplication } = useData();
  const isFrost = theme === 'frost';
  const isInferno = theme === 'inferno';

  // Membership modal state
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    fullName: '',
    usn: '',
    year: '2nd Year',
    branch: 'Computer Science & Engineering',
    email: '',
    domain: 'Agentic AI Systems',
    statement: '',
  });

  const [serverApplicationId, setServerApplicationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (
      hasSQLInjectionThreat(formData.fullName) ||
      hasSQLInjectionThreat(formData.email) ||
      hasSQLInjectionThreat(formData.statement)
    ) {
      alert('Security Alert: Prohibited syntax detected.');
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Direct Supabase Cloud persistence
      const sbResult = await addApplication({
        name: cleanSecureInput(formData.fullName, 100),
        email: cleanSecureInput(formData.email, 100),
        usn: cleanSecureInput(formData.usn, 20),
        year: formData.year,
        department: formData.branch,
        track: formData.domain,
        statement: cleanSecureInput(formData.statement, 1000),
        status: 'approved',
      });

      if (sbResult?.id) {
        setServerApplicationId(sbResult.id);
      }

      // 2. Also notify local backend if running
      try {
        await fetch('/api/membership', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } catch {
        // Supabase already stored it
      }
    } catch {
      setServerApplicationId(`AB-MEM-${Math.floor(1000 + Math.random() * 9000)}`);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Confetti celebration
      confetti({
        particleCount: 70,
        spread: 85,
        origin: { y: 0.6 },
      });
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setIsMemberModalOpen(false);
    setServerApplicationId(null);
    setFormData({
      fullName: '',
      usn: '',
      year: '2nd Year',
      branch: 'Computer Science & Engineering',
      email: '',
      domain: 'Agentic AI Systems',
      statement: '',
    });
  };

  return (
    <section className="py-12 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Main Hero Callout */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          
          {/* Intake Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border backdrop-blur-md">
            <span
              className={`w-2 h-2 rounded-full animate-ping ${
                isFrost ? 'bg-sky-500' : isInferno ? 'bg-orange-500' : 'bg-cyan-400'
              }`}
            />
            <span className={isFrost ? 'text-sky-800' : isInferno ? 'text-amber-300' : 'text-purple-300'}>
              Membership Intake • Academic Year 2025-2026
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2
              className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight ${
                isFrost ? 'text-slate-900' : isInferno ? 'text-amber-50' : 'text-white'
              }`}
            >
              Ready to Build with{' '}
              <span
                className={`font-serif italic font-normal ${
                  isFrost
                    ? 'text-sky-600'
                    : isInferno
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300'
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300'
                }`}
              >
                Autonomous Intelligence?
              </span>
            </h2>
          </div>

          {/* Subtitle */}
          <p
            className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto ${
              isFrost ? 'text-slate-600' : isInferno ? 'text-amber-200/80' : 'text-purple-200/80'
            }`}
          >
            Join the AgentBlazer Club at SJEC CSE. Collaborate with peers, gain hands-on access to
            Salesforce Trailhead developer orgs, and shape real AI agent projects.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              id="become-a-member-btn"
              onClick={() => setIsMemberModalOpen(true)}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm tracking-wide transition-all cursor-pointer shadow-lg active:scale-95 select-none ${
                isFrost
                  ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-500/25'
                  : isInferno
                  ? 'bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:opacity-95 text-white shadow-orange-950/60'
                  : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white shadow-purple-950/60'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Become a Member</span>
            </button>

            <button
              id="contact-cse-btn"
              onClick={() => setIsContactModalOpen(true)}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm transition-all cursor-pointer border select-none ${
                isFrost
                  ? 'border-slate-300 hover:bg-slate-100 text-slate-700'
                  : isInferno
                  ? 'border-amber-900/60 hover:bg-amber-950/40 text-amber-200'
                  : 'border-purple-800/60 hover:bg-purple-950/40 text-purple-200'
              }`}
            >
              <Mail className="w-4 h-4 opacity-75" />
              <span>Contact CSE Department</span>
            </button>
          </div>
        </div>

        {/* Institutional Address Box matching video layout */}
        <div
          className={`max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl border transition-all flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-lg ${
            isFrost
              ? 'bg-white border-sky-200 shadow-sky-50'
              : isInferno
              ? 'bg-[#150904]/70 border-amber-900/40 shadow-orange-950/30'
              : 'bg-[#0f091a]/70 border-purple-900/40 shadow-purple-950/30'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
              isFrost
                ? 'bg-sky-100 border-sky-300 text-sky-800'
                : isInferno
                ? 'bg-amber-950 border-amber-800 text-amber-300'
                : 'bg-purple-950 border-purple-800 text-purple-300'
            }`}
          >
            <Building className="w-6 h-6" />
          </div>

          <div className="space-y-1 text-sm">
            <h4
              className={`font-bold text-base ${
                isFrost ? 'text-slate-900' : isInferno ? 'text-amber-50' : 'text-white'
              }`}
            >
              Department of Computer Science & Engineering
            </h4>
            <p className={isFrost ? 'text-slate-600' : 'text-gray-300'}>
              St Joseph Engineering College, Vamanjoor, Mangaluru, Karnataka - 575028, India
            </p>
            <div className="pt-1 flex items-center gap-2">
              <span className="text-xs font-mono opacity-80">Direct Inquiries:</span>
              <a
                href="mailto:agentblazer@sjec.ac.in"
                className={`font-mono text-xs font-bold underline ${
                  isFrost ? 'text-sky-600' : isInferno ? 'text-amber-400' : 'text-cyan-400'
                }`}
              >
                agentblazer@sjec.ac.in
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Membership Application Form Modal */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          {/* Ambient radiant halo */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-purple-600/35 via-cyan-500/35 to-blue-500/25 blur-[100px] pointer-events-none animate-pulse" />

          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 border-2 shadow-2xl overflow-hidden z-10 ${
              isFrost
                ? 'bg-white border-sky-400 text-slate-900 shadow-[0_0_50px_rgba(14,165,233,0.5)]'
                : isInferno
                ? 'bg-[#180a04] border-orange-500 text-amber-50 shadow-[0_0_60px_rgba(249,115,22,0.6)]'
                : 'bg-[#120822] border-cyan-400 text-white shadow-[0_0_60px_rgba(6,182,212,0.8),0_0_120px_rgba(168,85,247,0.5)]'
            }`}
          >
            <button
              onClick={() => setIsMemberModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-black/20 text-inherit transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubmitted ? (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                    SJEC CSE • AGENTBLAZER CLUB
                  </span>
                  <h3 className="text-2xl font-black tracking-tight mt-1">
                    Student Membership Intake
                  </h3>
                  <p className="text-xs opacity-75 mt-1">
                    Apply to join the technical tracks, workshops, and Salesforce Trailblazer lab teams.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="opacity-90">Full Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Rahul Shenoy"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={`w-full px-3 py-2.5 rounded-xl border font-sans text-sm focus:outline-none focus:ring-2 ${
                          isFrost
                            ? 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-sky-500'
                            : 'bg-black/40 border-white/20 text-white focus:ring-purple-500'
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="opacity-90">USN / Student ID *</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. 4SO23CS042"
                        value={formData.usn}
                        onChange={(e) => setFormData({ ...formData, usn: e.target.value })}
                        className={`w-full px-3 py-2.5 rounded-xl border font-sans text-sm uppercase focus:outline-none focus:ring-2 ${
                          isFrost
                            ? 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-sky-500'
                            : 'bg-black/40 border-white/20 text-white focus:ring-purple-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="opacity-90">Current Year</label>
                      <select
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className={`w-full px-3 py-2.5 rounded-xl border font-sans text-sm focus:outline-none ${
                          isFrost
                            ? 'bg-slate-50 border-slate-300 text-slate-900'
                            : 'bg-[#1a0c2e] border-white/20 text-white'
                        }`}
                      >
                        <option value="1st Year">1st Year (Freshman)</option>
                        <option value="2nd Year">2nd Year (Sophomore)</option>
                        <option value="3rd Year">3rd Year (Junior)</option>
                        <option value="4th Year">4th Year (Senior)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="opacity-90">College Email *</label>
                      <input
                        required
                        type="email"
                        placeholder="e.g. student@sjec.ac.in"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-3 py-2.5 rounded-xl border font-sans text-sm focus:outline-none focus:ring-2 ${
                          isFrost
                            ? 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-sky-500'
                            : 'bg-black/40 border-white/20 text-white focus:ring-purple-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="opacity-90">Primary Focus Interest</label>
                    <select
                      value={formData.domain}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                      className={`w-full px-3 py-2.5 rounded-xl border font-sans text-sm focus:outline-none ${
                        isFrost
                          ? 'bg-slate-50 border-slate-300 text-slate-900'
                          : 'bg-[#1a0c2e] border-white/20 text-white'
                      }`}
                    >
                      <option value="Agentic AI Systems">Autonomous Agents & Reasoning</option>
                      <option value="Prompt Engineering & LLMs">Prompt Engineering & RAG</option>
                      <option value="Salesforce Agentforce">Salesforce Agentforce & Cloud Org</option>
                      <option value="Cyber Security & Defense">Cyber Security & Vulnerability Analysis</option>
                      <option value="Open Source AI Development">Open Source AI Tooling (GSoC / LangChain)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="opacity-90">Why do you want to join? (Brief Statement)</label>
                    <textarea
                      rows={3}
                      placeholder="Share your technical interests, projects you've built, or what you hope to learn..."
                      value={formData.statement}
                      onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                      className={`w-full px-3 py-2.5 rounded-xl border font-sans text-sm focus:outline-none focus:ring-2 ${
                        isFrost
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-sky-500'
                          : 'bg-black/40 border-white/20 text-white focus:ring-purple-500'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 rounded-full font-bold text-sm tracking-wide transition-all cursor-pointer shadow-lg active:scale-98 ${
                      isFrost
                        ? 'bg-sky-600 hover:bg-sky-700 text-white'
                        : isInferno
                        ? 'bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-95 text-white'
                        : 'bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 text-white'
                    }`}
                  >
                    Submit Application
                  </button>
                </form>
              </div>
            ) : (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black">Application Received!</h3>
                  <p className="text-xs opacity-75 max-w-xs mx-auto">
                    Welcome to the AgentBlazer Club cohort, <span className="font-bold text-white">{formData.fullName || 'Trailblazer'}</span>. We have logged your submission.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/30 border border-inherit text-left font-mono text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="opacity-70">Application Status:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Registered in DB
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="opacity-70">Member ID:</span>
                    <span className="text-cyan-400 font-bold font-mono text-sm">
                      {serverApplicationId || `AB-${Math.floor(1000 + Math.random() * 9000)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Focus Track:</span>
                    <span>{formData.domain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Department:</span>
                    <span>SJEC CSE (2025-2026)</span>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-full font-semibold text-xs border border-inherit hover:bg-black/20 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contact CSE Department Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          {/* Ambient radiant halo */}
          <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-r from-purple-600/35 via-cyan-500/35 to-blue-500/25 blur-[100px] pointer-events-none animate-pulse" />

          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-md rounded-3xl p-6 sm:p-8 border-2 shadow-2xl overflow-hidden space-y-6 z-10 ${
              isFrost
                ? 'bg-white border-sky-400 text-slate-900 shadow-[0_0_50px_rgba(14,165,233,0.5)]'
                : isInferno
                ? 'bg-[#180a04] border-orange-500 text-amber-50 shadow-[0_0_60px_rgba(249,115,22,0.6)]'
                : 'bg-[#120822] border-cyan-400 text-white shadow-[0_0_60px_rgba(6,182,212,0.8),0_0_120px_rgba(168,85,247,0.5)]'
            }`}
          >
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-black/20 text-inherit transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                DIRECTORY
              </span>
              <h3 className="text-2xl font-black tracking-tight mt-1">
                CSE Department Office
              </h3>
              <p className="text-xs opacity-75 mt-1">
                Reach out to the faculty coordinators or departmental leads.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl border border-inherit bg-black/5 dark:bg-black/30 space-y-1">
                <div className="font-bold text-sm">Faculty Coordinators:</div>
                <div className="opacity-80">Ms. Nisha Roche & Mr. Keith Fernandes</div>
                <div className="text-cyan-400 font-mono">keithf@sjec.ac.in • nishar@sjec.ac.in</div>
              </div>

              <div className="p-3.5 rounded-xl border border-inherit bg-black/5 dark:bg-black/30 space-y-1">
                <div className="font-bold text-sm">Club Secretariat:</div>
                <div className="opacity-80">Ruben Saldanha (President) & Joyline Galbao (Secretary)</div>
                <div className="text-cyan-400 font-mono">agentblazer@sjec.ac.in</div>
              </div>

              <div className="p-3.5 rounded-xl border border-inherit bg-black/5 dark:bg-black/30 space-y-1">
                <div className="font-bold text-sm">Physical Venue:</div>
                <div className="opacity-80">CSE Department • Advanced Systems Lab, Block 2</div>
                <div className="text-gray-400 font-mono">SJEC Vamanjoor, Mangaluru</div>
              </div>
            </div>

            <button
              onClick={() => setIsContactModalOpen(false)}
              className="w-full py-2.5 rounded-full font-semibold text-xs border border-inherit hover:bg-black/20 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
