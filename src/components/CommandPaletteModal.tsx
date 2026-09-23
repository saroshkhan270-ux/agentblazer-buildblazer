import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  Calendar,
  Users,
  Home,
  UserPlus,
  Sparkles,
  Command,
  ArrowRight,
  FileText,
  Code2,
  Lock,
  Flame,
  Snowflake,
  CornerDownLeft,
} from 'lucide-react';
import { ActiveTab, LeadershipMember, ThemeMode } from '../types';
import {
  HONORED_GUESTS,
  FACULTY_COUNCIL,
  STUDENT_OFFICERS,
  CORE_WORKING_COMMITTEE,
  WORKSHOP_EVENTS,
} from '../data';
import { useData } from '../context/DataContext';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  setTheme: (theme: ThemeMode) => void;
  currentTheme?: ThemeMode;
  onSelectMember: (member: LeadershipMember) => void;
  onOpenCharter?: () => void;
  onOpenSourceCode?: () => void;
}

type FilterCategory = 'all' | 'pages' | 'people' | 'events' | 'actions';

interface SearchItem {
  id: string;
  category: FilterCategory;
  title: string;
  subtitle: string;
  badge?: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  setTheme,
  currentTheme = 'violet',
  onSelectMember,
  onOpenCharter,
  onOpenSourceCode,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { leadership, events } = useData();

  const isFrost = currentTheme === 'frost';
  const isInferno = currentTheme === 'inferno';

  // Dynamic members and events (fallback to mock data)
  const allMembers: LeadershipMember[] = useMemo(() => {
    if (leadership && leadership.length > 0) return leadership;
    return [
      ...HONORED_GUESTS,
      ...FACULTY_COUNCIL,
      ...STUDENT_OFFICERS,
      ...CORE_WORKING_COMMITTEE,
    ];
  }, [leadership]);

  const allEvents = useMemo(() => {
    if (events && events.length > 0) return events;
    return WORKSHOP_EVENTS;
  }, [events]);

  // Aggregate all searchable items
  const allItems: SearchItem[] = useMemo(() => {
    return [
      // 1. Navigation Pages
      {
        id: 'page-home',
        category: 'pages',
        title: 'Home Section',
        subtitle: 'Main Landing Page, Club Vision & Phoenix Emblem',
        badge: 'Page',
        icon: <Home className={`w-4 h-4 ${isFrost ? 'text-sky-600' : isInferno ? 'text-amber-400' : 'text-cyan-400'}`} />,
        action: () => {
          setActiveTab('home');
          onClose();
        },
      },
      {
        id: 'page-about',
        category: 'pages',
        title: 'About Us & Mentorship Council',
        subtitle: 'Faculty Council, Honored Guests & Student Core Team',
        badge: 'Page',
        icon: <Users className={`w-4 h-4 ${isFrost ? 'text-purple-600' : isInferno ? 'text-orange-400' : 'text-purple-400'}`} />,
        action: () => {
          setActiveTab('about');
          onClose();
        },
      },
      {
        id: 'page-events',
        category: 'pages',
        title: 'Events & Workshops',
        subtitle: 'GSoC Preparation, Prompt Ops, Hackathons & Security Labs',
        badge: 'Page',
        icon: <Calendar className={`w-4 h-4 ${isFrost ? 'text-amber-600' : isInferno ? 'text-amber-400' : 'text-amber-400'}`} />,
        action: () => {
          setActiveTab('events');
          onClose();
        },
      },
      {
        id: 'page-join',
        category: 'pages',
        title: 'Join & Connect',
        subtitle: 'Student Application Form & Trailblazer Channels',
        badge: 'Page',
        icon: <UserPlus className={`w-4 h-4 ${isFrost ? 'text-emerald-600' : isInferno ? 'text-orange-400' : 'text-emerald-400'}`} />,
        action: () => {
          setActiveTab('join');
          onClose();
        },
      },

      // 2. Quick Actions & Modals
      {
        id: 'action-charter',
        category: 'actions',
        title: 'Read Club Charter & Constitution',
        subtitle: 'Autonomous AI Ethics, Student Roles & Club Governance',
        badge: 'Charter',
        icon: <FileText className={`w-4 h-4 ${isFrost ? 'text-sky-600' : isInferno ? 'text-orange-400' : 'text-cyan-400'}`} />,
        action: () => {
          onClose();
          onOpenCharter?.();
        },
      },
      {
        id: 'action-source',
        category: 'actions',
        title: 'View Source Code & Architecture',
        subtitle: 'React 19, Vite, Tailwind CSS & Supabase Tech Stack',
        badge: 'Code',
        icon: <Code2 className={`w-4 h-4 ${isFrost ? 'text-slate-700' : isInferno ? 'text-amber-300' : 'text-purple-300'}`} />,
        action: () => {
          onClose();
          onOpenSourceCode?.();
        },
      },
      {
        id: 'action-apply',
        category: 'actions',
        title: 'Apply for Club Membership',
        subtitle: 'Autonomous Systems & Agentic Frameworks Student Cohort',
        badge: 'Application',
        icon: <Sparkles className={`w-4 h-4 ${isFrost ? 'text-amber-600' : isInferno ? 'text-orange-400' : 'text-amber-400'}`} />,
        action: () => {
          setActiveTab('join');
          onClose();
        },
      },
      {
        id: 'action-admin',
        category: 'actions',
        title: 'Executive Admin Portal',
        subtitle: 'Review Student Applications & Event Schedules',
        badge: 'Admin',
        icon: <Lock className="w-4 h-4 text-rose-400" />,
        action: () => {
          window.location.hash = 'admin';
          onClose();
        },
      },

      // 3. Theme Toggles
      {
        id: 'theme-violet',
        category: 'actions',
        title: 'Switch to Violet Cyberpunk Theme',
        subtitle: 'Neon Cyber Aesthetic with Cyan/Purple Luminescence',
        badge: 'Theme',
        icon: <span className="w-3.5 h-3.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />,
        action: () => {
          setTheme('violet');
          onClose();
        },
      },
      {
        id: 'theme-inferno',
        category: 'actions',
        title: 'Switch to Inferno Ember Theme',
        subtitle: 'Fiery Crimson & Amber Radiant Palette',
        badge: 'Theme',
        icon: <Flame className="w-4 h-4 text-orange-400" />,
        action: () => {
          setTheme('inferno');
          onClose();
        },
      },
      {
        id: 'theme-frost',
        category: 'actions',
        title: 'Switch to Frost Ice Light Theme',
        subtitle: 'Crisp Arctic Daylight Minimalist Interface',
        badge: 'Theme',
        icon: <Snowflake className="w-4 h-4 text-sky-500" />,
        action: () => {
          setTheme('frost');
          onClose();
        },
      },

      // 4. Leadership & Mentorship Council Members
      ...allMembers.map((m) => {
        let categoryLabel = 'Member';
        if (m.category === 'guest') categoryLabel = 'Honored Guest';
        else if (m.category === 'faculty') categoryLabel = 'Faculty';
        else if (m.category === 'core-officer') categoryLabel = 'Lead Officer';
        else if (m.category === 'working-committee') categoryLabel = 'Committee';

        return {
          id: `member-${m.id}`,
          category: 'people' as FilterCategory,
          title: m.name,
          subtitle: `${m.role} • ${m.departmentRole}`,
          badge: m.badge || categoryLabel,
          icon: m.photoUrl ? (
            <img
              src={m.photoUrl}
              alt={m.name}
              referrerPolicy="no-referrer"
              className="w-5 h-5 rounded-full object-cover object-center ring-1 ring-white/20"
            />
          ) : (
            <Users className="w-4 h-4 text-cyan-400" />
          ),
          action: () => {
            setActiveTab('about');
            onSelectMember(m);
            onClose();
          },
        };
      }),

      // 5. Workshop Events
      ...allEvents.map((e) => ({
        id: `event-${e.id}`,
        category: 'events' as FilterCategory,
        title: e.title,
        subtitle: `${e.date} • ${e.venue || 'SJEC CSE Lab'}`,
        badge: e.tag || 'Workshop',
        icon: <Sparkles className="w-4 h-4 text-amber-400" />,
        action: () => {
          setActiveTab('events');
          onClose();
        },
      })),
    ];
  }, [allMembers, allEvents, isFrost, isInferno, setActiveTab, setTheme, onSelectMember, onOpenCharter, onOpenSourceCode, onClose]);

  // Filter items by category and query
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    return allItems.filter((item) => {
      // Category tab filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Query filter
      if (!q) return true;

      const titleMatch = item.title.toLowerCase().includes(q);
      const subtitleMatch = item.subtitle.toLowerCase().includes(q);
      const badgeMatch = item.badge?.toLowerCase().includes(q) || false;

      return titleMatch || subtitleMatch || badgeMatch;
    });
  }, [allItems, selectedCategory, query]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults.length, selectedCategory, query]);

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedCategory('all');
      setSelectedIndex(0);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Auto-scroll selected item into view
  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  // Keyboard navigation within the modal
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredResults.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % filteredResults.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredResults.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        filteredResults[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'Tab') {
      // Cycle through categories
      e.preventDefault();
      const categories: FilterCategory[] = ['all', 'pages', 'people', 'events', 'actions'];
      const nextIdx = (categories.indexOf(selectedCategory) + (e.shiftKey ? -1 : 1) + categories.length) % categories.length;
      setSelectedCategory(categories[nextIdx]);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -16 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-2xl rounded-2xl overflow-hidden border-2 shadow-2xl font-mono select-none flex flex-col max-h-[85vh] ${
            isFrost
              ? 'bg-white/95 border-sky-300 text-slate-900 shadow-[0_20px_60px_rgba(14,165,233,0.35)]'
              : isInferno
              ? 'bg-[#140804]/95 border-orange-500/70 text-amber-50 shadow-[0_20px_60px_rgba(249,115,22,0.45)]'
              : 'bg-[#0c0618]/95 border-cyan-400/60 text-white shadow-[0_20px_60px_rgba(6,182,212,0.4),0_0_90px_rgba(168,85,247,0.3)]'
          }`}
        >
          {/* Top Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-current/10 gap-3">
            <Search
              className={`w-5 h-5 shrink-0 ${
                isFrost ? 'text-sky-600' : isInferno ? 'text-orange-400' : 'text-cyan-400'
              }`}
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleInputKeyDown}
              placeholder="Search members, workshops, sections, actions, or themes..."
              className={`w-full bg-transparent border-none outline-none text-sm font-mono ${
                isFrost
                  ? 'text-slate-900 placeholder-slate-400'
                  : isInferno
                  ? 'text-amber-50 placeholder-amber-400/40'
                  : 'text-white placeholder-purple-300/40'
              }`}
            />

            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className={`p-1 rounded-md text-xs transition-colors ${
                  isFrost ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-white/10 text-gray-400'
                }`}
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <div
              className={`hidden sm:flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-mono shrink-0 ${
                isFrost
                  ? 'bg-sky-100 text-sky-700 border border-sky-200'
                  : isInferno
                  ? 'bg-orange-950/60 text-amber-300 border border-orange-800/40'
                  : 'bg-white/10 text-purple-200 border border-purple-500/20'
              }`}
            >
              <Command className="w-3 h-3" /> K
            </div>

            <button
              onClick={onClose}
              aria-label="Close search"
              className={`p-1 rounded-lg transition-colors cursor-pointer ${
                isFrost ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Category Filter Pills Bar */}
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-current/10 overflow-x-auto text-xs font-mono scrollbar-none">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'pages', label: 'Pages' },
                { id: 'people', label: 'Leadership' },
                { id: 'events', label: 'Workshops' },
                { id: 'actions', label: 'Actions' },
              ] as const
            ).map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedIndex(0);
                    inputRef.current?.focus();
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? isFrost
                        ? 'bg-sky-600 text-white shadow-sm'
                        : isInferno
                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-sm'
                        : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-sm'
                      : isFrost
                      ? 'text-slate-600 hover:bg-slate-100'
                      : isInferno
                      ? 'text-amber-200/70 hover:bg-white/5'
                      : 'text-purple-300/70 hover:bg-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}

            <div className="ml-auto text-[10px] opacity-50 shrink-0 hidden sm:inline">
              {filteredResults.length} {filteredResults.length === 1 ? 'match' : 'matches'}
            </div>
          </div>

          {/* Results List */}
          <div ref={itemsContainerRef} className="overflow-y-auto p-2 space-y-1 flex-1">
            {filteredResults.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <div
                  className={`text-sm ${
                    isFrost ? 'text-slate-500' : isInferno ? 'text-amber-300/70' : 'text-purple-300/70'
                  }`}
                >
                  No matching results for "{query}".
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <span className="text-xs opacity-60">Popular:</span>
                  {['GSoC', 'About Us', 'Charter', 'Violet', 'Apply'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setQuery(suggestion);
                        inputRef.current?.focus();
                      }}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                        isFrost
                          ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-sky-100'
                          : isInferno
                          ? 'bg-orange-950/40 border-orange-800 text-amber-300 hover:bg-orange-900/60'
                          : 'bg-purple-950/40 border-purple-800 text-cyan-300 hover:bg-purple-900/60'
                      }`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              filteredResults.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    ref={(el) => {
                      itemRefs.current[idx] = el;
                    }}
                    onClick={item.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? isFrost
                          ? 'bg-sky-100/90 border border-sky-300 text-sky-950 shadow-sm'
                          : isInferno
                          ? 'bg-gradient-to-r from-orange-600/30 to-amber-600/20 border border-orange-500/60 text-white shadow-sm'
                          : 'bg-gradient-to-r from-cyan-500/20 to-purple-600/25 border border-cyan-400/60 text-white shadow-sm'
                        : isFrost
                        ? 'hover:bg-slate-100/70 text-slate-700'
                        : isInferno
                        ? 'hover:bg-white/5 text-amber-200/80'
                        : 'hover:bg-white/5 text-purple-200/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`p-2 rounded-lg shrink-0 flex items-center justify-center ${
                          isFrost
                            ? 'bg-slate-100 border border-slate-200'
                            : 'bg-black/50 border border-white/10'
                        }`}
                      >
                        {item.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold truncate">{item.title}</span>
                          {item.badge && (
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold uppercase tracking-wider shrink-0 ${
                                isFrost
                                  ? 'bg-sky-100 text-sky-800 border border-sky-200'
                                  : isInferno
                                  ? 'bg-orange-950/80 text-amber-300 border border-orange-800/60'
                                  : 'bg-purple-950/80 text-cyan-300 border border-cyan-500/30'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div
                          className={`text-xs truncate mt-0.5 ${
                            isFrost
                              ? 'text-slate-500'
                              : isInferno
                              ? 'text-amber-300/60'
                              : 'text-purple-300/70'
                          }`}
                        >
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-3">
                      {isSelected && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] opacity-70">
                          <span>Enter</span>
                          <CornerDownLeft className="w-3 h-3" />
                        </span>
                      )}
                      <ArrowRight
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isSelected ? 'translate-x-1 opacity-100' : 'opacity-40'
                        } ${
                          isFrost ? 'text-sky-600' : isInferno ? 'text-orange-400' : 'text-cyan-400'
                        }`}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Navigation Tip */}
          <div
            className={`px-4 py-2.5 border-t flex flex-wrap items-center justify-between text-[11px] gap-2 ${
              isFrost
                ? 'bg-slate-50 border-slate-200 text-slate-500'
                : isInferno
                ? 'bg-[#0d0402] border-orange-950 text-amber-400/60'
                : 'bg-[#080310] border-white/10 text-purple-300/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded text-[9px] bg-current/10 border border-current/20">↑</kbd>
                <kbd className="px-1 py-0.5 rounded text-[9px] bg-current/10 border border-current/20">↓</kbd>
                <span>Navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded text-[9px] bg-current/10 border border-current/20">↵</kbd>
                <span>Select</span>
              </span>
              <span className="hidden sm:inline flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded text-[9px] bg-current/10 border border-current/20">Tab</kbd>
                <span>Filter</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>AgentBlazer SJEC CSE</span>
              <span>•</span>
              <span><kbd className="px-1 py-0.5 rounded text-[9px] bg-current/10 border border-current/20">Esc</kbd> close</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
