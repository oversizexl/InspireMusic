import React from 'react';
import { Home, Search, Library, Plus, ListMusic, Music2 } from 'lucide-react';
import { clsx } from 'clsx';
import type { LocalPlaylist } from '../types';
import { getGradientFromId } from '../utils/colors';

interface SidebarProps {
  activeTab: 'search' | 'toplists' | 'library' | 'playlist';
  onTabChange: (tab: 'search' | 'toplists' | 'library' | 'playlist') => void;
  playlists: LocalPlaylist[];
  activePlaylistId: string;
  onPlaylistSelect: (id: string) => void;
  onCreatePlaylist: () => void;
  onDeletePlaylist: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  playlists,
  activePlaylistId,
  onPlaylistSelect,
  onCreatePlaylist,
}) => {
  return (
    <div className="w-64 bg-black h-full flex flex-col p-4 gap-6 text-gray-400">
      <div className="flex flex-col gap-2">
        <div className="px-4 py-2 mb-2 text-white font-bold text-xl flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Music2 size={24} className="text-black" />
          </div>
          <span className="tracking-tight">InspireMusic</span>
        </div>
        <button
          onClick={() => onTabChange('search')}
          className={clsx(
            "flex items-center gap-4 px-4 py-3 rounded-md transition-colors font-medium",
            activeTab === 'search' ? "text-white bg-surface" : "hover:text-white hover:bg-surface/50"
          )}
        >
          <Search size={24} />
          搜索
        </button>
        <button
          onClick={() => onTabChange('toplists')}
          className={clsx(
            "flex items-center gap-4 px-4 py-3 rounded-md transition-colors font-medium",
            activeTab === 'toplists' ? "text-white bg-surface" : "hover:text-white hover:bg-surface/50"
          )}
        >
          <Home size={24} />
          排行榜
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-2 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2">
          <button 
            onClick={() => onTabChange('library')}
            className={clsx(
              "flex items-center gap-2 font-bold transition-colors",
              activeTab === 'library' ? "text-white" : "hover:text-white"
            )}
          >
            <Library size={24} />
            我的歌单
          </button>
          <button 
            onClick={onCreatePlaylist}
            className="p-1 hover:bg-surface rounded-full text-gray-400 hover:text-white transition-colors"
            title="创建歌单"
          >
            <Plus size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              className={clsx(
                "group flex items-center justify-between px-4 py-2 rounded-md cursor-pointer transition-colors text-sm",
                activePlaylistId === pl.id ? "text-white bg-surface" : "hover:text-white hover:bg-surface/50"
              )}
              onClick={() => onPlaylistSelect(pl.id)}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`min-w-[32px] h-8 rounded flex items-center justify-center ${getGradientFromId(pl.id)}`}>
                  <ListMusic size={16} className="text-white/70" />
                </div>
                <span className="truncate">{pl.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
