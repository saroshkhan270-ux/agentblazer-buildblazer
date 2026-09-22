import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Terminal, AlertTriangle, UserPlus, LogIn, CheckCircle2 } from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';

interface AdminAuthGateProps {
  onAuthenticated: () => void;
  onCancel: () => void;
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({ onAuthenticated, onCancel }) => {
  const { login, registerAdmin, lockoutTimer } = useAdminAuth();
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [isGranted, setIsGranted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please verify your password confirmation.');
        return;
      }

      setIsAuthorizing(true);
      const res = await registerAdmin(username, password);
      setIsAuthorizing(false);

      if (res.success) {
        setSuccessMsg(res.message || 'Registration submitted! Awaiting Head Admin approval.');
        setMode('signin');
        setPassword('');
        setConfirmPassword('');
      } else {
        setErrorMsg(res.error || 'Registration failed.');
      }
      return;
    }

    // Sign in mode
    setIsAuthorizing(true);
    const res = await login(username, password);
    setIsAuthorizing(false);

    if (res.success) {
      setIsGranted(true);
      setTimeout(() => {
        onAuthenticated();
      }, 700);
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07040e]/95 backdrop-blur-xl p-4 sm:p-6 font-mono text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.15),transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-purple-500/40 bg-[#0d0718] p-6 sm:p-8 shadow-[0_0_60px_rgba(147,51,234,0.25)]"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse" />

        {isGranted ? (
          <div className="py-8 text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-purple-400 bg-purple-500/20 text-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.5)]"
            >
              <ShieldCheck size={44} />
            </motion.div>
            <h2 className="text-2xl font-bold tracking-wider text-purple-300">
              ACCESS GRANTED
            </h2>
            <p className="text-xs text-purple-200/70">
              Authorization verified. Launching Administrative Controller...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-purple-900 bg-[#07040e] text-purple-400 shadow-[0_0_20px_rgba(147,51,234,0.2)]">
                <Lock size={26} className="animate-pulse" />
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-purple-400">
                <Terminal size={13} />
                <span>// AGENTBLAZER_SECURITY_GATE</span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                Admin Authentication
              </h2>
              <p className="text-xs text-purple-200/70 max-w-xs mx-auto">
                Authorized access for AgentBlazer executive council & leads.
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex rounded-lg border border-purple-900/60 bg-[#07040e] p-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded py-2 transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-purple-600 font-bold text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                <LogIn size={13} />
                <span>SIGN IN</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded py-2 transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-purple-600 font-bold text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                <UserPlus size={13} />
                <span>REGISTER ADMIN</span>
              </button>
            </div>

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 rounded border border-emerald-500/50 bg-emerald-500/10 p-3 text-xs text-emerald-400"
              >
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 rounded border border-rose-500/50 bg-rose-500/10 p-3 text-xs text-rose-400"
              >
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="admin_username" className="block text-xs uppercase text-purple-200">
                {mode === 'register' ? 'Admin Username' : 'Username or Email'}
              </label>
              <input
                id="admin_username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={mode === 'register' ? 'Choose username (e.g. lead_alex)' : 'Enter username or email'}
                required
                disabled={isAuthorizing || lockoutTimer > 0}
                autoFocus
                className="w-full rounded-lg border border-purple-900/60 bg-[#07040e] px-4 py-2.5 text-xs text-white placeholder-purple-400/40 transition-all focus:border-purple-400 focus:outline-none focus:shadow-[0_0_15px_rgba(147,51,234,0.3)] disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="admin_password" className="block text-xs uppercase text-purple-200">
                {mode === 'register' ? 'Create Password' : 'Password'}
              </label>
              <div className="relative">
                <input
                  id="admin_password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Min 6 characters' : 'Enter password'}
                  required
                  disabled={isAuthorizing || lockoutTimer > 0}
                  className="w-full rounded-lg border border-purple-900/60 bg-[#07040e] px-4 py-2.5 pr-11 text-xs text-white placeholder-purple-400/40 transition-all focus:border-purple-400 focus:outline-none focus:shadow-[0_0_15px_rgba(147,51,234,0.3)] disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div className="space-y-1.5">
                <label htmlFor="admin_confirm_password" className="block text-xs uppercase text-purple-200">
                  Confirm Password
                </label>
                <input
                  id="admin_confirm_password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  disabled={isAuthorizing}
                  className="w-full rounded-lg border border-purple-900/60 bg-[#07040e] px-4 py-2.5 text-xs text-white placeholder-purple-400/40 transition-all focus:border-purple-400 focus:outline-none focus:shadow-[0_0_15px_rgba(147,51,234,0.3)] disabled:opacity-50"
                />
                <p className="text-[10px] text-purple-300/70 pt-1">
                  * Note: New registrations require approval by the Head Administrator before login is granted.
                </p>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={!username.trim() || !password.trim() || isAuthorizing || lockoutTimer > 0}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-purple-600 py-3 text-xs font-bold uppercase text-white hover:bg-purple-500 transition-all hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] disabled:opacity-40 cursor-pointer"
              >
                {isAuthorizing ? (
                  <span>PROCESSING...</span>
                ) : lockoutTimer > 0 ? (
                  <span>LOCKED ({lockoutTimer}s)</span>
                ) : mode === 'signin' ? (
                  <>
                    <span>AUTHENTICATE &amp; ENTER</span>
                    <ArrowRight size={14} />
                  </>
                ) : (
                  <>
                    <span>SUBMIT FOR APPROVAL</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="w-full text-center text-xs text-purple-300 hover:text-white transition-colors py-1 cursor-pointer"
              >
                &larr; Return to Public Portal
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
