import type { Platform } from '../types';
import type { Option } from '../components/ui/Select';

// Shared platform display metadata
export const PLATFORM_LABELS: Record<Platform, string> = {
  netease: '网易云',
  kuwo: '酷我',
  qq: 'QQ',
};

export const PLATFORM_LABELS_LONG: Record<Platform, string> = {
  netease: '网易云音乐',
  kuwo: '酷我音乐',
  qq: 'QQ音乐',
};

export const PLATFORM_BADGE_CLASSNAMES: Record<Platform, string> = {
  netease: 'bg-red-500/20 text-red-400 border-red-500/30',
  kuwo: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  qq: 'bg-green-500/20 text-green-400 border-green-500/30',
};

// Common select option sets
export const PLATFORM_OPTIONS_LONG: Option[] = [
  { value: 'netease', label: PLATFORM_LABELS_LONG.netease },
  { value: 'kuwo', label: PLATFORM_LABELS_LONG.kuwo },
  { value: 'qq', label: PLATFORM_LABELS_LONG.qq },
];

export const PLATFORM_OPTIONS_SHORT: Option[] = [
  { value: 'netease', label: PLATFORM_LABELS.netease },
  { value: 'kuwo', label: PLATFORM_LABELS.kuwo },
  { value: 'qq', label: PLATFORM_LABELS.qq },
];

export const SEARCH_SOURCE_OPTIONS_MOBILE: Option[] = [
  { value: 'aggregate', label: '聚合' },
  ...PLATFORM_OPTIONS_SHORT,
];

export const SEARCH_SOURCE_OPTIONS_DESKTOP: Option[] = [
  { value: 'aggregate', label: '聚合搜索' },
  { value: 'netease', label: PLATFORM_LABELS_LONG.netease },
  { value: 'kuwo', label: PLATFORM_LABELS_LONG.kuwo },
  { value: 'qq', label: PLATFORM_LABELS_LONG.qq },
];
