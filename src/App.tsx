/**
 * AgentBlazer Club Web Application
 * Department of Computer Science & Engineering
 * St Joseph Engineering College, Mangaluru
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab, ThemeMode } from './types';
import { IntroScreen } from './components/IntroScreen';
import { Navbar } from './components/Navbar';
import { HomeSection } from './components/HomeSection';
import { AboutSection } from './components/AboutSection';
import { EventsSection } from './components/EventsSection';
import { JoinSection } from './components/JoinSection';
import { Footer } from './components/Footer';
import { CharterModal } from './components/CharterModal';
import { SourceCodeModal } from './components/SourceCodeModal';
import { CustomCursor } from './components/CustomCursor';
import { AnimatePresence, motion } from 'motion/react';
import { DataProvider } from './context/DataContext';
import { useAdminAuth } from './hooks/useAdminAuth';
import { AdminAuthGate } from './components/Admin/AdminAuthGate';
import { AdminDashboard } from './components/Admin/AdminDashboard';

const checkIsAdminRoute = (): boolean => {
  try {
    const hash = window.location.hash.replace('#', '').replace(/^\/+/, '').toLowerCase();
    if (hash === 'admin') return true;
    const path = window.location.pathname.replace(/^\/+/, '').toLowerCase();
    return path === 'admin';
  } catch {
    return false;
  }
};

function MainApp() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [theme, setTheme] = useState<ThemeMode>('violet');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isCharterOpen, setIsCharterOpen] = useState<boolean>(false);
  const [isSourceCodeOpen, setIsSourceCodeOpen] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(checkIsAdminRoute);

  const { isAuthenticated, refreshAuth, logout: handleAdminLogout } = useAdminAuth();

  // Listen for hash changes to support #admin
  useEffect(() => {
    const handleHashChange = () => {
      setIsAdmin(checkIsAdminRoute());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Scroll to top when switching tabs
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Background styling based on theme
  const getThemeWrapperClass = () => {
    switch (theme) {
      case 'inferno':
        return 'bg-[#0f0603] text-[#fff7ed] selection:bg-orange-600 selection:text-white';
      case 'frost':
        return 'bg-[#f8fafc] text-[#0f172a] selection:bg-sky-500 selection:text-white';
      case 'violet':
      default:
        return 'bg-[#07040e] text-[#f8fafc] selection:bg-purple-600 selection:text-white';
    }
  };

  // ADMIN MODE ROUTING
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#07040e] text-white font-mono">
        <div className="border-b border-purple-900/60 bg-[#0d0718] px-6 py-3 flex items-center justify-between">
          <a
            href="#top"
            onClick={() => setIsAdmin(false)}
            className="text-xs uppercase tracking-wider text-purple-400 hover:text-white cursor-pointer"
          >
            &larr; Return to AgentBlazer Portal
          </a>
          <span className="text-xs text-purple-400/60">// ADMIN_MODE</span>
        </div>

        {isAuthenticated ? (
          <AdminDashboard
            onBackToSite={() => setIsAdmin(false)}
            onLogout={handleAdminLogout}
          />
        ) : (
          <AdminAuthGate
            onAuthenticated={refreshAuth}
            onCancel={() => setIsAdmin(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 relative flex flex-col ${getThemeWrapperClass()}`}>
      <CustomCursor theme={theme} />
      
      {/* 1. Fullscreen Phoenix Intro Screen */}
      <AnimatePresence>
        {showIntro && (
          <IntroScreen
            theme={theme}
            onContinue={() => setShowIntro(false)}
            onThemeChange={setTheme}
          />
        )}
      </AnimatePresence>

      {/* 2. Main Portal Interface */}
      {!showIntro && (
        <div className="flex-1 flex flex-col">
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            theme={theme}
            setTheme={setTheme}
            onOpenSourceCode={() => setIsSourceCodeOpen(true)}
            onReplayIntro={() => setShowIntro(true)}
          />

          <main className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <HomeSection
                    theme={theme}
                    setActiveTab={setActiveTab}
                    onOpenCharter={() => setIsCharterOpen(true)}
                  />
                </motion.div>
              )}

              {activeTab === 'about' && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <AboutSection theme={theme} />
                </motion.div>
              )}

              {activeTab === 'events' && (
                <motion.div
                  key="events"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <EventsSection theme={theme} />
                </motion.div>
              )}

              {activeTab === 'join' && (
                <motion.div
                  key="join"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <JoinSection
                    theme={theme}
                    onOpenCharter={() => setIsCharterOpen(true)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          <Footer
            theme={theme}
            setActiveTab={setActiveTab}
            onOpenCharter={() => setIsCharterOpen(true)}
          />

          {isCharterOpen && (
            <CharterModal
              theme={theme}
              onClose={() => setIsCharterOpen(false)}
            />
          )}

          {isSourceCodeOpen && (
            <SourceCodeModal
              theme={theme}
              onClose={() => setIsSourceCodeOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <MainApp />
    </DataProvider>
  );
}
