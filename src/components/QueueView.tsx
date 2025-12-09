import React from 'react';
import type { Song } from '../types';
import { X, Play } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface QueueViewProps {
  queue: Song[];
  currentIndex: number;
  onPlay: (index: number) => void;
  onRemove: (index: number) => void;
  onClose: () => void;
  onClear: () => void;
}

export const QueueView: React.FC<QueueViewProps> = ({
  queue,
  currentIndex,
  onPlay,
  onRemove,
  onClose,
  onClear,
}) => {
  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-y-0 right-0 w-full md:w-80 bg-surface shadow-2xl z-[60] border-l border-gray-800 flex flex-col"
    >
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="font-bold text-white">播放队列 ({queue.length})</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={onClear}
            className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-white/10"
          >
            清空
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 pb-32 md:pb-24">
        {queue.map((song, index) => (
          <div 
            key={`${song.platform}-${song.id}-${index}`}
            className={clsx(
              "group flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-white/5",
              index === currentIndex ? "text-primary" : "text-gray-300"
            )}
            onDoubleClick={() => onPlay(index)}
            onClick={() => {
              if (window.innerWidth < 768) {
                onPlay(index);
              }
            }}
          >
            <div className="w-4 text-xs text-center opacity-50 group-hover:hidden">
              {index + 1}
            </div>
            <button 
              onClick={() => onPlay(index)}
              className="hidden group-hover:block w-4 text-center"
            >
              <Play size={12} fill="currentColor" />
            </button>
            
            <div className="flex-1 overflow-hidden">
              <div className="truncate text-sm font-medium">{song.name}</div>
              <div className="truncate text-xs opacity-70">{song.artist}</div>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onRemove(index);
              }}
              className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
