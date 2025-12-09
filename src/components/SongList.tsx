import React from 'react';
import { Play, Pause } from 'lucide-react';
import { clsx } from 'clsx';
import type { Song, Platform } from '../types';
import { CoverImage } from './ui/CoverImage';

interface SongListProps {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  onPlay: (song: Song) => void;
  showHeader?: boolean;
}

const PlatformBadge: React.FC<{ platform: Platform }> = ({ platform }) => {
  const colors = {
    netease: 'bg-red-500/20 text-red-400 border-red-500/30',
    kuwo: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    qq: 'bg-green-500/20 text-green-400 border-green-500/30',
  };
  
  const names = {
    netease: '网易',
    kuwo: '酷我',
    qq: 'QQ',
  };

  return (
    <span className={clsx("text-[10px] px-1.5 py-0.5 rounded border", colors[platform])}>
      {names[platform]}
    </span>
  );
};

export const SongList: React.FC<SongListProps> = ({
  songs,
  currentSong,
  isPlaying,
  onPlay,
  showHeader = true,
}) => {
  return (
    <div className="w-full flex flex-col">
      {showHeader && (
        <div className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_4fr_3fr_2fr_1fr] gap-4 px-4 py-2 border-b border-gray-800 text-gray-400 text-sm font-medium sticky top-0 bg-background z-10">
          <div className="w-8 text-center">#</div>
          <div>标题</div>
          <div className="hidden md:block">歌手</div>
          <div className="hidden md:block">专辑</div>
          <div className="hidden md:block text-right">来源</div>
        </div>
      )}
      <div className="flex flex-col pb-4">
        {songs.map((song, index) => {
          const isCurrent = currentSong?.id === song.id && currentSong?.platform === song.platform;
          return (
            <div
              key={`${song.platform}-${song.id}`}
              className={clsx(
                "group grid grid-cols-[auto_1fr] md:grid-cols-[auto_4fr_3fr_2fr_1fr] gap-4 px-4 py-3 rounded-md cursor-pointer transition-colors items-center text-sm hover:bg-white/5",
                isCurrent ? "text-primary" : "text-gray-300"
              )}
              onDoubleClick={() => onPlay(song)}
              onClick={() => {
                // On mobile, single click to play if not clicking a button
                if (window.innerWidth < 768) {
                  onPlay(song);
                }
              }}
            >
              <div className="w-8 flex items-center justify-center relative">
                <span className={clsx("md:group-hover:hidden", isCurrent && "text-primary")}>
                  {isCurrent && isPlaying ? (
                    <img src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f93a2ef4.gif" alt="playing" className="h-3" />
                  ) : (
                    index + 1
                  )}
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlay(song);
                  }}
                  className="hidden md:group-hover:flex absolute inset-0 items-center justify-center text-white"
                >
                  {isCurrent && isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                </button>
              </div>
              <div className="flex items-center gap-3 overflow-hidden">
                <CoverImage 
                  src={song.pic} 
                  alt="" 
                  className="w-10 h-10 rounded object-cover bg-gray-800 shrink-0" 
                />
                <div className="flex flex-col overflow-hidden min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={clsx("truncate font-medium", isCurrent ? "text-primary" : "text-white")}>
                      {song.name}
                    </span>
                    <div className="md:hidden flex-shrink-0">
                      <PlatformBadge platform={song.platform} />
                    </div>
                  </div>
                  <div className="md:hidden text-xs text-gray-400 truncate mt-0.5 flex items-center gap-1">
                    <span>{song.artist}</span>
                    {song.album && (
                      <>
                        <span>·</span>
                        <span>{song.album}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="hidden md:block truncate hover:text-white hover:underline">{song.artist}</div>
              <div className="hidden md:block truncate hover:text-white hover:underline">{song.album || '-'}</div>
              <div className="hidden md:flex justify-end">
                <PlatformBadge platform={song.platform} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
