import { Home, Library, Search } from 'lucide-react';

export type NavTabId = 'search' | 'toplists' | 'library' | 'playlist';

export interface NavTab {
  id: NavTabId;
  label: string;
  icon: typeof Home;
}

// Visible tabs; playlist view is navigated programmatically and not shown in nav.
export const NAV_TABS: NavTab[] = [
  { id: 'search', label: '搜索', icon: Search },
  { id: 'toplists', label: '排行榜', icon: Home },
  { id: 'library', label: '音乐库', icon: Library },
];
