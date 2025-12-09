import React from 'react';
import { Search } from 'lucide-react';
import type { Song, Platform } from '../types';
import { SongList } from './SongList';
import { Select } from './ui/Select';

interface SearchViewProps {
  keyword: string;
  onKeywordChange: (val: string) => void;
  searchSource: 'aggregate' | Platform;
  onSearchSourceChange: (val: 'aggregate' | Platform) => void;
  onSearch: () => void;
  results: Song[];
  loading: boolean;
  error?: string | null;
  currentSong: Song | null;
  isPlaying: boolean;
  onPlay: (song: Song) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  keyword,
  onKeywordChange,
  searchSource,
  onSearchSourceChange,
  onSearch,
  results,
  loading,
  error,
  currentSong,
  isPlaying,
  onPlay,
}) => {
  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-8">
        <div className="relative flex-1 w-full md:max-w-xl flex items-center bg-white/10 rounded-full border border-transparent focus-within:border-primary transition-all">
          <Search className="absolute left-4 text-gray-400" size={20} />
          <input
            type="text"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            placeholder="搜索歌曲..."
            className="flex-1 bg-transparent py-3 pl-12 pr-2 text-white placeholder-gray-400 outline-none min-w-0"
          />
          <div className="md:hidden h-6 w-[1px] bg-white/20 mx-2"></div>
          <div className="md:hidden">
             <Select
              value={searchSource}
              onChange={(val) => onSearchSourceChange(val as any)}
              options={[
                { value: 'aggregate', label: '聚合' },
                { value: 'netease', label: '网易' },
                { value: 'kuwo', label: '酷我' },
                { value: 'qq', label: 'QQ' },
              ]}
              className="w-20 !bg-transparent !border-none !p-0"
            />
          </div>
          <button
            onClick={onSearch}
            disabled={loading}
            className="md:hidden p-3 text-primary font-bold disabled:opacity-50"
          >
            搜索
          </button>
        </div>
        
        <div className="hidden md:block">
          <Select
            value={searchSource}
            onChange={(val) => onSearchSourceChange(val as any)}
            options={[
              { value: 'aggregate', label: '聚合搜索' },
              { value: 'netease', label: '网易云' },
              { value: 'kuwo', label: '酷我' },
              { value: 'qq', label: 'QQ音乐' },
            ]}
            className="w-40"
          />
        </div>
        <button
          onClick={onSearch}
          disabled={loading}
          className="hidden md:block bg-primary text-black font-bold rounded-full px-8 py-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '搜索中...' : '搜索'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {results.length > 0 ? (
        <div className="bg-black/20 rounded-xl overflow-hidden">
          <SongList
            songs={results}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlay={onPlay}
          />
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-20">
          <Search size={48} className="mx-auto mb-4 opacity-20" />
          <p>输入关键词开始搜索</p>
        </div>
      )}
    </div>
  );
};
