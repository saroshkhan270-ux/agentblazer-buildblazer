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

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [theme, setTheme] = useState<ThemeMode>('violet');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isCharterOpen, setIsCharterOpen] = useState<boolean>(false);
  const [isSourceCodeOpen, setIsSourceCodeOpen] = useState<boolean>(false);

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

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 relative flex flex-col ${getThemeWrapperClass()}`}>
      {/* Radiant Custom Trailing Cursor as seen in MP4 video */}
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
          {/* Header Navigation */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            theme={theme}
            setTheme={setTheme}
            onOpenSourceCode={() => setIsSourceCodeOpen(true)}
            onReplayIntro={() => setShowIntro(true)}
          />

          {/* Main Content View with smooth tab transition */}
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

          {/* Institutional Footer */}
          <Footer
            theme={theme}
            setActiveTab={setActiveTab}
            onOpenCharter={() => setIsCharterOpen(true)}
          />

          {/* Official Charter Modal */}
          {isCharterOpen && (
            <CharterModal
              theme={theme}
              onClose={() => setIsCharterOpen(false)}
            />
          )}

          {/* Interactive Source Code Explorer & ZIP Downloader */}
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
