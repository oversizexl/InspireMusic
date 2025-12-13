import React, { useState } from 'react';
import { Import } from 'lucide-react';
import { Select } from '../ui/Select';
import type { Platform } from '../../types';
import { PLATFORM_OPTIONS_LONG } from '../../utils/platform';

/**
 * 根据URL自动检测平台
 */
const detectPlatformFromUrl = (input: string): Platform | null => {
    if (/music\.163\.com/i.test(input) || /163cn\.tv/i.test(input)) return 'netease';
    if (/kuwo\.cn/i.test(input)) return 'kuwo';
    if (/y\.qq\.com/i.test(input) || /qq\.com.*music/i.test(input)) return 'qq';
    return null;
};

/**
 * 从歌单链接中提取歌单 ID
 * 支持格式：
 * - 纯数字 ID: "123456"
 * - 网易云音乐: https://music.163.com/m/playlist?id=7629572689&...
 * - 酷我音乐: https://m.kuwo.cn/newh5app/playlist_detail/3674497355?... 
 * - QQ音乐: https://i.y.qq.com/.../taoge.html?...&id=9620670084&...
 */
const extractPlaylistId = (input: string): string => {
    const trimmed = input.trim();

    // Pure numeric ID
    if (/^\d+$/.test(trimmed)) {
        return trimmed;
    }

    // 酷我音乐: /playlist_detail/xxx (path style)
    const kuwoMatch = trimmed.match(/\/playlist_detail\/(\d+)/);
    if (kuwoMatch) return kuwoMatch[1];

    // 网易云音乐 & QQ音乐: ?id=xxx or &id=xxx (query param style)
    const idParamMatch = trimmed.match(/[?&]id=(\d+)/);
    if (idParamMatch) return idParamMatch[1];

    // Fallback: try to find any long number sequence (10+ digits typical for playlist IDs)
    const longNumberMatch = trimmed.match(/(\d{8,})/);
    if (longNumberMatch) return longNumberMatch[1];

    // Return original if no match
    return trimmed;
};

interface ImportPlaylistSectionProps {
    playlistSource: Platform;
    onPlaylistSourceChange: (source: Platform) => void;
    onImportPlaylist: (id: string) => void;
    loadingPlaylist: boolean;
}

export const ImportPlaylistSection: React.FC<ImportPlaylistSectionProps> = ({
    playlistSource,
    onPlaylistSourceChange,
    onImportPlaylist,
    loadingPlaylist,
}) => {
    const [importId, setImportId] = useState('');

    const handleImport = () => {
        if (importId.trim()) {
            onImportPlaylist(extractPlaylistId(importId));
            setImportId('');
        }
    };

    return (
        <div className="bg-surface p-4 md:p-6 rounded-xl mb-8">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Import size={20} />
                导入外部歌单
            </h3>
            <div className="flex flex-col md:flex-row gap-4">
                <Select
                    value={playlistSource}
                    onChange={(val) => onPlaylistSourceChange(val as Platform)}
                    options={PLATFORM_OPTIONS_LONG}
                    className="w-full md:w-32"
                />
                <input
                    type="text"
                    value={importId}
                    onChange={(e) => {
                        const value = e.target.value;
                        setImportId(value);
                        // 自动检测平台
                        const detected = detectPlatformFromUrl(value);
                        if (detected && detected !== playlistSource) {
                            onPlaylistSourceChange(detected);
                        }
                    }}
                    placeholder="输入歌单 ID 或链接（自动识别平台）"
                    className="flex-1 bg-black/20 text-white rounded-md px-4 py-2 outline-none border border-transparent focus:border-primary/50 transition-colors w-full"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleImport();
                        }
                    }}
                />
                <button
                    onClick={handleImport}
                    disabled={loadingPlaylist}
                    className="bg-primary text-black font-bold px-6 py-2 rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                    {loadingPlaylist ? '导入中...' : '导入'}
                </button>
            </div>
        </div>
    );
};
