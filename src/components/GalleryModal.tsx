import React, { useState } from 'react';
import { ThemeMode, WorkshopEvent } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Shuffle, Calendar, MapPin, Sparkles } from 'lucide-react';

interface GalleryModalProps {
  event: WorkshopEvent;
  theme: ThemeMode;
  onClose: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  event,
  theme,
  onClose,
}) => {
  const isFrost = theme === 'frost';
  const isInferno = theme === 'inferno';

  const photos = event.gallery;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleShuffle = () => {
    const randomIndex = Math.floor(Math.random() * photos.length);
    setCurrentIndex(randomIndex);
  };

  const currentPhoto = photos[currentIndex] || photos[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Ambient radiant glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-purple-600/35 via-cyan-500/35 to-blue-500/25 blur-[100px] pointer-events-none animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 15 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-2xl rounded-3xl overflow-hidden border-2 shadow-2xl flex flex-col z-10 ${
          isFrost
            ? 'bg-white border-sky-400 text-slate-900 shadow-[0_0_50px_rgba(14,165,233,0.5)]'
            : isInferno
            ? 'bg-[#180903] border-orange-500 text-amber-50 shadow-[0_0_60px_rgba(249,115,22,0.6)]'
            : 'bg-[#100720] border-cyan-400 text-white shadow-[0_0_60px_rgba(6,182,212,0.8),0_0_120px_rgba(168,85,247,0.5)]'
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-inherit">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono font-bold uppercase tracking-wider ${
                isFrost ? 'text-sky-700' : isInferno ? 'text-amber-400' : 'text-purple-300'
              }`}
            >
              {event.title.toUpperCase()} GALLERY
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Shuffle Button */}
            <button
              onClick={handleShuffle}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border hover:opacity-80 transition-opacity cursor-pointer border-inherit"
            >
              <Shuffle className="w-3 h-3" />
              <span>Shuffle</span>
            </button>

            {/* Counter */}
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-black/20 font-bold">
              {currentIndex + 1} / {photos.length}
            </span>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-black/20 text-inherit transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Gallery Image Display */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-black/40 overflow-hidden group select-none">
          <img
            key={currentPhoto.id}
            src={currentPhoto.url}
            alt={currentPhoto.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-all duration-500"
          />

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white transition-all cursor-pointer backdrop-blur-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white transition-all cursor-pointer backdrop-blur-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Top image tag */}
          {currentPhoto.tag && (
            <div className="absolute top-3 left-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/70 text-white backdrop-blur-md border border-white/20">
                {currentPhoto.tag}
              </span>
            </div>
          )}
        </div>

        {/* Footer Details */}
        <div className="p-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h4 className="text-lg font-bold tracking-tight">{currentPhoto.title}</h4>
              <p className="text-xs opacity-75 mt-0.5">{currentPhoto.caption}</p>
            </div>
            <div className="text-xs font-mono opacity-80 shrink-0 text-right">
              <div>{event.date}</div>
              <div className="text-[11px] text-cyan-400">{event.location}</div>
            </div>
          </div>

          {/* Thumbnails row */}
          <div className="flex items-center gap-2 pt-2 overflow-x-auto no-scrollbar">
            {photos.map((photo, idx) => (
              <button
                key={photo.id}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  currentIndex === idx
                    ? isFrost
                      ? 'border-sky-600 scale-105'
                      : isInferno
                      ? 'border-amber-400 scale-105'
                      : 'border-purple-400 scale-105'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
