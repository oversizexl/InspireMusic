import { buildFileUrl } from '../api';
import type { LocalPlaylist, Platform, PlaylistData, Song } from '../types';

export const FAVORITES_ID = 'favorites';
export const FAVORITES_NAME = '我喜欢的音乐';

export const buildFavoritesPlaylist = (favorites: Song[]): LocalPlaylist => ({
  id: FAVORITES_ID,
  name: FAVORITES_NAME,
  songs: favorites,
});

export const getPlaylistCover = (playlist: LocalPlaylist): string | undefined => {
  if (playlist.pic) return playlist.pic;
  const firstSong = playlist.songs[0];
  if (!firstSong) return undefined;
  return firstSong.pic || buildFileUrl(firstSong.platform, firstSong.id, 'pic');
};

interface ToLocalPlaylistOptions {
  id: string;
  name: string;
  source: Platform;
  origin?: string;
  pic?: string;
  desc?: string;
  url?: string;
}

export const toLocalPlaylist = (data: PlaylistData, options: ToLocalPlaylistOptions): LocalPlaylist => {
  const info = data.info;
  return {
    id: options.id,
    name: info?.name || options.name,
    songs: data.list || [],
    source: data.source || options.source,
    origin: info?.author || options.origin,
    pic: info?.pic || options.pic,
    desc: info?.desc || options.desc,
    url: options.url,
  };
};
