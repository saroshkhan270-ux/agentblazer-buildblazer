import React, { useState } from 'react';
import { ThemeMode, WorkshopEvent } from '../types';
import { WORKSHOP_EVENTS } from '../data';
import { GalleryModal } from './GalleryModal';
import { Calendar, Users, MapPin, Eye, Sparkles, Trophy, Shield, Laptop, Terminal, ExternalLink } from 'lucide-react';

interface EventsSectionProps {
  theme: ThemeMode;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ theme }) => {
  const isFrost = theme === 'frost';
  const isInferno = theme === 'inferno';

  // Selected event for gallery view
  const [activeGalleryEvent, setActiveGalleryEvent] = useState<WorkshopEvent | null>(null);

  const getTagBadgeStyle = (type: WorkshopEvent['tagType']) => {
    switch (type) {
      case 'flagship':
        return isFrost
          ? 'bg-sky-100 text-sky-800 border-sky-300'
          : isInferno
          ? 'bg-red-950/80 text-orange-300 border-red-800'
          : 'bg-purple-950/80 text-cyan-300 border-purple-800';
      case 'contest':
        return isFrost
          ? 'bg-amber-100 text-amber-900 border-amber-300'
          : isInferno
          ? 'bg-amber-950/80 text-amber-300 border-amber-800'
          : 'bg-indigo-950/80 text-amber-300 border-indigo-800';
      case 'symposium':
        return isFrost
          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
          : isInferno
          ? 'bg-rose-950/80 text-rose-300 border-rose-800'
          : 'bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-800';
      case 'security':
        return isFrost
          ? 'bg-cyan-100 text-cyan-900 border-cyan-300'
          : isInferno
          ? 'bg-orange-950/80 text-orange-300 border-orange-800'
          : 'bg-teal-950/80 text-teal-300 border-teal-800';
      default:
        return isFrost
          ? 'bg-slate-100 text-slate-800 border-slate-300'
          : 'bg-gray-900/80 text-gray-300 border-gray-800';
    }
  };

  return (
    <section className="py-12 sm:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Section */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border">
            <span className={`w-1.5 h-1.5 rounded-full ${isFrost ? 'bg-sky-500' : isInferno ? 'bg-orange-500' : 'bg-purple-400'}`} />
            <span className={isFrost ? 'text-sky-800' : isInferno ? 'text-amber-300' : 'text-purple-300'}>
              Workshops & Live Sessions • Academic Year 2025-2026
            </span>
          </div>

          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
              isFrost ? 'text-slate-900' : isInferno ? 'text-amber-50' : 'text-white'
            }`}
          >
            Workshops, Contests <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">& Masterclasses</span>
          </h2>

          <p
            className={`text-base sm:text-lg leading-relaxed ${
              isFrost ? 'text-slate-600' : isInferno ? 'text-amber-200/80' : 'text-purple-200/80'
            }`}
          >
            Hands-on technical deep dives, algorithmic challenges, and real-world system deployments
            with seasoned engineers.
          </p>
        </div>

        {/* 6 Event Cards Grid matching video layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WORKSHOP_EVENTS.map((event) => {
            const isSelected = activeGalleryEvent?.id === event.id;
            return (
              <div
                key={event.id}
                id={`event-card-${event.id}`}
                onClick={() => setActiveGalleryEvent(event)}
                className={`group p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden select-none ${
                  isSelected
                    ? isFrost
                      ? 'bg-sky-50/90 border-sky-500 ring-2 ring-sky-400 shadow-[0_0_35px_rgba(14,165,233,0.5)] scale-[1.02]'
                      : isInferno
                      ? 'bg-[#1e0a03] border-orange-500 ring-2 ring-orange-400 shadow-[0_0_40px_rgba(249,115,22,0.7)] scale-[1.02]'
                      : 'bg-[#150926] border-cyan-400 ring-2 ring-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.8),0_0_80px_rgba(168,85,247,0.6)] scale-[1.02]'
                    : isFrost
                    ? 'bg-white border-slate-200 hover:border-sky-400 hover:shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:scale-[1.01]'
                    : isInferno
                    ? 'bg-[#140803]/80 border-amber-900/40 hover:border-orange-500 hover:shadow-[0_0_30px_rgba(249,115,22,0.45)] hover:scale-[1.01]'
                    : 'bg-[#0e0719]/80 border-purple-900/40 hover:border-cyan-400/90 hover:shadow-[0_0_35px_rgba(168,85,247,0.5)] hover:scale-[1.01]'
                }`}
              >
              {/* Decorative top ambient bar */}
              <div className="space-y-4">
                
                {/* Date & Tag Header */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={`opacity-80 flex items-center gap-1.5 ${isFrost ? 'text-slate-600' : 'text-gray-400'}`}>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{event.date}</span>
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wider ${getTagBadgeStyle(
                      event.tagType
                    )}`}
                  >
                    {event.tag}
                  </span>
                </div>

                {/* Event Title */}
                <h3
                  className={`text-xl font-bold tracking-tight leading-snug group-hover:underline ${
                    isFrost ? 'text-slate-900' : isInferno ? 'text-amber-50' : 'text-white'
                  }`}
                >
                  {event.title}
                </h3>

                {/* Tracks / Sub-tags if present (like in Prompt Ops) */}
                {event.tracks && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {event.tracks.map((track, i) => (
                      <span
                        key={i}
                        className={`text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-md border ${
                          isFrost
                            ? 'bg-sky-50 text-sky-800 border-sky-200'
                            : isInferno
                            ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                            : 'bg-purple-950/60 text-cyan-300 border-purple-800'
                        }`}
                      >
                        {track}
                      </span>
                    ))}
                  </div>
                )}

                {/* Session leads / Guest speaker info */}
                {event.sessionLeads && (
                  <div className="text-xs font-mono opacity-80">
                    <span className="text-cyan-400">Session Leads:</span> {event.sessionLeads}
                  </div>
                )}
                {event.guestSpeaker && (
                  <div className="text-xs font-mono opacity-80">
                    <span className="text-orange-400">Speaker:</span> {event.guestSpeaker}
                  </div>
                )}
                {event.platform && (
                  <div className="text-xs font-mono opacity-80">
                    <span className="text-purple-400">Platform:</span> {event.platform}
                  </div>
                )}

                {/* Description */}
                <p
                  className={`text-xs sm:text-sm leading-relaxed ${
                    isFrost ? 'text-slate-600' : 'text-gray-300'
                  }`}
                >
                  {event.description}
                </p>
              </div>

              {/* Footer row matching video: "Hover to inspect gallery" / Count or Venue */}
              <div
                className={`mt-6 pt-4 border-t flex items-center justify-between text-xs font-mono transition-colors ${
                  isFrost
                    ? 'border-slate-100 text-slate-500 group-hover:text-sky-700'
                    : isInferno
                    ? 'border-amber-950 text-amber-300/80 group-hover:text-orange-300'
                    : 'border-purple-950 text-purple-300/80 group-hover:text-cyan-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 animate-pulse" />
                  <span className="underline decoration-dotted font-medium">
                    Hover to inspect gallery
                  </span>
                </div>

                <div className="text-[11px] opacity-90 font-semibold">
                  {event.photosCount ? `${event.photosCount} Photos` : event.attendees || event.location}
                </div>
              </div>
            </div>
            );
          })}
        </div>

      </div>

      {/* Interactive Gallery Modal / Floating Viewer */}
      {activeGalleryEvent && (
        <GalleryModal
          event={activeGalleryEvent}
          theme={theme}
          onClose={() => setActiveGalleryEvent(null)}
        />
      )}
    </section>
  );
};
