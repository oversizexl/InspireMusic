export type Platform = 'netease' | 'kuwo' | 'qq';

export type Quality = '128k' | '320k' | 'flac' | 'flac24bit';

export interface Song {
  id: string;
  name: string;
  artist?: string;
  album?: string;
  platform: Platform;
  pic?: string;
}

export interface SongInfo {
  name: string;
  artist: string;
  album: string;
  url: string;
  pic: string;
  lrc: string;
}

export interface SearchResult {
  keyword: string;
  total?: number;
  results: Song[];
}

export interface PlaylistItem {
  id: string;
  name: string;
  types?: string[];
  platform: Platform;
}

export interface PlaylistData {
  list: PlaylistItem[];
  info: {
    name: string;
    author: string;
  };
}

export interface ToplistSummary {
  id: string;
  name: string;
  updateFrequency?: string;
}

export interface LocalPlaylist {
  id: string;
  name: string;
  songs: Song[];
  source?: Platform;
  origin?: string;
}

export type ParsedLyricLine = {
  time: number;
  text: string;
  translation?: string;
};
