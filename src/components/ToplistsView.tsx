import React from 'react';
import type { ToplistSummary } from '../types';
import { Trophy } from 'lucide-react';
import { getGradientFromId } from '../utils/colors';

interface ToplistsViewProps {
  toplists: ToplistSummary[];
  onSelect: (id: string) => void;
}

export const ToplistsView: React.FC<ToplistsViewProps> = ({ toplists, onSelect }) => {
  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold text-white mb-6">排行榜</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {toplists.map((list) => (
          <div
            key={list.id}
            onClick={() => onSelect(list.id)}
            className="group bg-surface hover:bg-white/10 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1"
          >
            <div className={`aspect-square rounded-md mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow relative overflow-hidden ${getGradientFromId(`toplist-${list.id}`)}`}>
              <Trophy size={48} className="text-white/50 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="font-bold text-white truncate">{list.name}</h3>
            <p className="text-sm text-gray-400 mt-1">{list.updateFrequency || '每日更新'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
