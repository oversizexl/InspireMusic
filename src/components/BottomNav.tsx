import React from 'react';
import { Home, Search, Library } from 'lucide-react';
import { clsx } from 'clsx';

interface BottomNavProps {
  activeTab: 'search' | 'toplists' | 'library' | 'playlist';
  onTabChange: (tab: 'search' | 'toplists' | 'library' | 'playlist') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="md:hidden h-16 bg-black/95 backdrop-blur-lg border-t border-white/10 flex items-center justify-around px-4 z-50">
      <button
        onClick={() => onTabChange('search')}
        className={clsx(
          "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
          activeTab === 'search' ? "text-primary" : "text-gray-400 hover:text-white"
        )}
      >
        <Search size={24} />
        <span className="text-xs font-medium">搜索</span>
      </button>
      <button
        onClick={() => onTabChange('toplists')}
        className={clsx(
          "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
          activeTab === 'toplists' ? "text-primary" : "text-gray-400 hover:text-white"
        )}
      >
        <Home size={24} />
        <span className="text-xs font-medium">排行榜</span>
      </button>
      <button
        onClick={() => onTabChange('library')}
        className={clsx(
          "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
          activeTab === 'library' || activeTab === 'playlist' ? "text-primary" : "text-gray-400 hover:text-white"
        )}
      >
        <Library size={24} />
        <span className="text-xs font-medium">我的歌单</span>
      </button>
    </div>
  );
};
