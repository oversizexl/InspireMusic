import React from 'react';
import { Heart, ListMusic, Plus } from 'lucide-react';
import type { Song, LocalPlaylist } from '../../types';
import { getGradientFromId } from '../../utils/colors';
import { buildFavoritesPlaylist, FAVORITES_NAME, getPlaylistCover } from '../../utils/playlists';
import { CoverCard } from '../ui/CoverCard';
import { CoverGrid } from '../ui/CoverGrid';

interface PlaylistGridProps {
    playlists: LocalPlaylist[];
    favorites: Song[];
    onSelectPlaylist: (playlist: LocalPlaylist) => void;
    onPlayFavorites: () => void;
    onPlayPlaylist: (playlist: LocalPlaylist) => void;
    onCreatePlaylist: () => void;
}

export const PlaylistGrid: React.FC<PlaylistGridProps> = ({
    playlists,
    favorites,
    onSelectPlaylist,
    onPlayFavorites,
    onPlayPlaylist,
    onCreatePlaylist,
}) => {
    return (
        <CoverGrid>
            <CoverCard
                title={FAVORITES_NAME}
                description={`${favorites.length} 首歌曲`}
                gradientClass="bg-gradient-to-br from-pink-500 to-purple-600"
                placeholderIcon={<Heart size={48} fill="white" className="text-white" />}
                onClick={() => onSelectPlaylist(buildFavoritesPlaylist(favorites))}
                onPrimaryAction={onPlayFavorites}
            />

            {playlists.map((pl) => (
                <CoverCard
                    key={pl.id}
                    title={pl.name}
                    description={`${pl.songs.length} 首歌曲`}
                    coverSrc={getPlaylistCover(pl)}
                    gradientClass={getGradientFromId(pl.id)}
                    placeholderIcon={<ListMusic size={48} className="text-white/50" />}
                    onClick={() => onSelectPlaylist(pl)}
                    onPrimaryAction={() => onPlayPlaylist(pl)}
                />
            ))}

            {/* New Playlist Card */}
            <div
                onClick={onCreatePlaylist}
                className="group bg-surface hover:bg-surface/80 rounded-lg p-4 cursor-pointer transition-colors"
            >
                <div className="aspect-square rounded-md mb-4 flex items-center justify-center border-2 border-dashed border-gray-700 group-hover:border-gray-500 transition-colors">
                    <Plus size={48} className="text-gray-400 group-hover:text-gray-300 transition-colors" />
                </div>
                <h3 className="text-gray-400 group-hover:text-gray-300 font-bold truncate transition-colors">新建歌单</h3>
                <p className="text-gray-500 text-sm">收藏您的音乐</p>
            </div>
        </CoverGrid>
    );
};
