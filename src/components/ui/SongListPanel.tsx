import React from 'react';
import type { Song } from '../../types';
import { SongList } from '../SongList';

interface SongListPanelProps {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  onPlay: (song: Song) => void;
  indexOffset?: number;
  footer?: React.ReactNode;
}

/**
 * Reusable wrapper providing consistent container styling around SongList,
 * with optional footer (e.g., pagination controls).
 */
export const SongListPanel: React.FC<SongListPanelProps> = ({
  songs,
  currentSong,
  isPlaying,
  onPlay,
  indexOffset,
  footer,
}) => {
  return (
    <div className="bg-black/20 rounded-xl overflow-hidden">
      <SongList
        songs={songs}
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlay={onPlay}
        indexOffset={indexOffset}
      />
      {footer && <div className="p-4 border-t border-white/5">{footer}</div>}
    </div>
  );
};
