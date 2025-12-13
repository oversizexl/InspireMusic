import React, { useState } from 'react';
import { Trash2, RefreshCw } from 'lucide-react';
import { getClearableDataStats, clearUserData } from '../../utils/cache';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { SettingsSection } from './SettingsSection';
import { useConfirmDialog } from '../../hooks/useConfirmDialog';

interface ClearCacheSectionProps {
    onCacheCleared?: () => void;
}

export const ClearCacheSection: React.FC<ClearCacheSectionProps> = ({ onCacheCleared }) => {
    // Initialize stats directly with the function call (lazy initialization)
    const [stats, setStats] = useState(() => getClearableDataStats());
    const [clearing, setClearing] = useState(false);

    const refreshStats = () => {
        setStats(getClearableDataStats());
    };

    const formatSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    };

    const handleClear = () => {
        setClearing(true);
        // 使用 setTimeout 让 UI 有机会更新
        setTimeout(() => {
            clearUserData();
            onCacheCleared?.();
            // 清理完成后刷新页面，确保 React 状态与 localStorage 同步
            window.location.reload();
        }, 100);
    };

    const confirmClear = useConfirmDialog({ onConfirm: handleClear });

    return (
        <SettingsSection icon={<Trash2 size={20} />} title="清理缓存">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-400 text-sm">
                        {stats.count > 0 ? (
                            <>可清理 <span className="text-white font-medium">{stats.count}</span> 项，约 <span className="text-white font-medium">{formatSize(stats.size)}</span></>
                        ) : (
                            '暂无可清理数据'
                        )}
                    </p>
                    <p className="text-xs text-white/40 mt-1">
                        保留音质设置、歌单和收藏
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={refreshStats}
                        className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                        title="刷新统计"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={confirmClear.show}
                        disabled={stats.count === 0 || clearing}
                        className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                        {clearing ? '清理中...' : '清理'}
                    </button>
                </div>
            </div>

            {/* 确认对话框 */}
            <ConfirmDialog
                open={confirmClear.open}
                title="确认清理缓存？"
                message="将清除播放队列、播放进度、搜索历史和 API 缓存；音质设置、歌单和收藏会保留。"
                danger
                confirmLabel={clearing ? '清理中...' : '确认清理'}
                onConfirm={confirmClear.handleConfirm}
                onCancel={confirmClear.handleCancel}
              />
        </SettingsSection>
    );
};
