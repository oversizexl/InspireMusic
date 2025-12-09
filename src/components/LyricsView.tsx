import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ParsedLyricLine, Song } from '../types';
import { ChevronDown, AudioLines } from 'lucide-react';
import { clsx } from 'clsx';
import { CoverImage } from './ui/CoverImage';

interface LyricsViewProps {
  lyrics: ParsedLyricLine[];
  activeLyricIndex: number;
  currentSong: Song | null;
  coverUrl?: string;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onSeek?: (time: number) => void;
}

export const LyricsView: React.FC<LyricsViewProps> = ({
  lyrics,
  activeLyricIndex,
  currentSong,
  coverUrl,
  loading,
  error,
  onClose,
  onSeek,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lyricRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [userScrolling, setUserScrolling] = useState(false);
  const userScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAutoScrollingRef = useRef(false);
  const lastActiveLyricIndexRef = useRef(activeLyricIndex);

  // Check if lyrics contain translations
  const hasTranslations = useMemo(() => {
    return lyrics.some(line => line.translation);
  }, [lyrics]);

  // Register lyric element ref
  const setLyricRef = useCallback((index: number, el: HTMLDivElement | null) => {
    if (el) {
      lyricRefs.current.set(index, el);
    } else {
      lyricRefs.current.delete(index);
    }
  }, []);

  // Scroll to center the active lyric
  const scrollToActiveLyric = useCallback((index: number, smooth = true) => {
    const container = containerRef.current;
    const activeElement = lyricRefs.current.get(index);
    
    if (!container || !activeElement) return;

    const containerHeight = container.clientHeight;
    const elementTop = activeElement.offsetTop;
    const elementHeight = activeElement.offsetHeight;
    
    // Calculate target scroll position to center the element
    const targetScrollTop = elementTop - (containerHeight / 2) + (elementHeight / 2);
    
    // Mark as auto-scrolling to prevent triggering user scroll detection
    isAutoScrollingRef.current = true;
    
    container.scrollTo({
      top: Math.max(0, targetScrollTop),
      behavior: smooth ? 'smooth' : 'auto',
    });
    
    // Reset auto-scrolling flag after animation completes
    setTimeout(() => {
      isAutoScrollingRef.current = false;
    }, smooth ? 500 : 50);
  }, []);

  // Handle wheel event to detect user scrolling (more reliable than scroll event)
  const handleWheel = useCallback(() => {
    // User is actively scrolling with mouse wheel
    setUserScrolling(true);
    
    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current);
    }
    
    userScrollTimeoutRef.current = setTimeout(() => {
      setUserScrolling(false);
    }, 4000);
  }, []);

  // Handle touch interaction to detect user scrolling
  const handleTouchStart = useCallback(() => {
    setUserScrolling(true);
    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current);
    }
    userScrollTimeoutRef.current = setTimeout(() => {
      setUserScrolling(false);
    }, 4000);
  }, []);

  // Scroll to active lyric when it changes (only if user is not scrolling)
  useEffect(() => {
    if (activeLyricIndex >= 0 && activeLyricIndex !== lastActiveLyricIndexRef.current) {
      lastActiveLyricIndexRef.current = activeLyricIndex;
      
      if (!userScrolling) {
        scrollToActiveLyric(activeLyricIndex, true);
      }
    }
  }, [activeLyricIndex, userScrolling, scrollToActiveLyric]);

  // Initial scroll on mount (without smooth behavior for instant positioning)
  useEffect(() => {
    if (activeLyricIndex >= 0 && lyrics.length > 0) {
      // Small delay to ensure refs are set
      const timer = setTimeout(() => {
        scrollToActiveLyric(activeLyricIndex, false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [lyrics]); // Re-run when lyrics change (new song)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (userScrollTimeoutRef.current) {
        clearTimeout(userScrollTimeoutRef.current);
      }
    };
  }, []);

  // Handle lyric click to seek
  const handleLyricClick = useCallback((time: number) => {
    if (onSeek) {
      onSeek(time);
      setUserScrolling(false);
    }
  }, [onSeek]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black z-40 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6">
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <ChevronDown size={32} />
        </button>
        <div className="text-center">
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Now Playing</div>
          <div className="font-bold text-white">{currentSong?.name}</div>
        </div>
        <div className="w-12" /> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden pb-24">
        {/* Left: Cover Art (Desktop) */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-12">
          <motion.div 
            key={currentSong?.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md aspect-square"
          >
            <CoverImage 
              src={coverUrl || currentSong?.pic} 
              alt={currentSong?.name} 
              className="w-full h-full object-cover rounded-lg shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Right: Lyrics */}
        <div className="w-full md:w-1/2 relative">
          {/* User scrolling indicator */}
          <AnimatePresence>
            {userScrolling && activeLyricIndex >= 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => {
                  setUserScrolling(false);
                  scrollToActiveLyric(activeLyricIndex, true);
                }}
                className="absolute bottom-24 right-6 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl hover:bg-white/20 transition-all"
              >
                <AudioLines size={24} fill="currentColor" />
              </motion.button>
            )}
          </AnimatePresence>
          
          <div 
            ref={containerRef}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="absolute inset-0 overflow-y-auto custom-scrollbar px-8 flex flex-col items-center md:items-start"
            style={{ paddingTop: '40vh', paddingBottom: '50vh' }}
          >
            {loading ? (
              <div className="text-gray-500 text-xl mt-20">歌词加载中...</div>
            ) : error ? (
              <div className="text-red-500 text-xl mt-20">{error}</div>
            ) : lyrics.length > 0 ? (
              lyrics.map((line, index) => {
                const isActive = index === activeLyricIndex;
                const isPast = index < activeLyricIndex;
                
                return (
                  <motion.div
                    key={index}
                    ref={(el) => setLyricRef(index, el)}
                    initial={false}
                    animate={{ 
                      scale: isActive ? 1.05 : 1,
                      opacity: isActive ? 1 : isPast ? 0.5 : 0.7,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: 'easeOut',
                    }}
                    className={clsx(
                      "text-center md:text-left cursor-pointer select-none",
                      hasTranslations ? "mb-6" : "mb-5",
                    )}
                    onClick={() => handleLyricClick(line.time)}
                  >
                    {/* Main lyric text */}
                    <div 
                      className={clsx(
                        "leading-relaxed transition-colors duration-200",
                        isActive 
                          ? "text-2xl md:text-3xl lg:text-4xl font-bold text-primary" 
                          : "text-xl md:text-2xl lg:text-3xl font-medium text-white",
                        !isActive && "hover:text-primary/70"
                      )}
                    >
                      {line.text}
                    </div>
                    
                    {/* Translation text */}
                    {line.translation && (
                      <div 
                        className={clsx(
                          "mt-2 leading-relaxed transition-colors duration-200",
                          isActive 
                            ? "text-base md:text-lg lg:text-xl text-primary/80 font-medium"
                            : "text-sm md:text-base lg:text-lg text-white/60 font-normal",
                        )}
                      >
                        {line.translation}
                      </div>
                    )}
                  </motion.div>
                );
              })
            ) : (
              <div className="text-gray-500 text-xl mt-20">暂无歌词</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
