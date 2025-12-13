import React from 'react';
import type { ToplistSummary } from '../types';
import { Trophy } from 'lucide-react';
import { getGradientFromId } from '../utils/colors';
import { CoverCard } from './ui/CoverCard';
import { CoverGrid } from './ui/CoverGrid';

interface ToplistsViewProps {
  toplists: ToplistSummary[];
  onSelect: (id: string) => void;
}

export const ToplistsView: React.FC<ToplistsViewProps> = ({ toplists, onSelect }) => {
  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold text-white mb-6">排行榜</h2>
      <CoverGrid className="xl:grid-cols-5">
        {toplists.map((list) => (
          <CoverCard
            key={list.id}
            title={list.name}
            description={list.updateFrequency || '每日更新'}
            coverSrc={list.pic}
            gradientClass={getGradientFromId(`toplist-${list.id}`)}
            placeholderIcon={
              <Trophy size={48} className="text-white/50 group-hover:scale-110 transition-transform duration-500" />
            }
            onClick={() => onSelect(list.id)}
          />
        ))}
      </CoverGrid>
    </div>
  );
};
