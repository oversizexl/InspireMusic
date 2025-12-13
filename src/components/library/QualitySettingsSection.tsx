import React from 'react';
import { Headphones } from 'lucide-react';
import { Select } from '../ui/Select';
import type { Quality } from '../../types';
import { SettingsSection } from './SettingsSection';

interface QualitySettingsSectionProps {
    quality: Quality;
    onQualityChange: (q: Quality) => void;
}

export const QualitySettingsSection: React.FC<QualitySettingsSectionProps> = ({
    quality,
    onQualityChange,
}) => {
    return (
        <SettingsSection icon={<Headphones size={20} />} title="音质设置">
            <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">选择默认播放音质：</span>
                <Select
                    value={quality}
                    onChange={(val) => onQualityChange(val as Quality)}
                    options={[
                        { value: '128k', label: '标准 (128k)' },
                        { value: '320k', label: '高品 (320k)' },
                        { value: 'flac', label: '无损 (FLAC)' },
                        { value: 'flac24bit', label: 'Hi-Res (24bit)' },
                    ]}
                    className="w-40"
                />
            </div>
        </SettingsSection>
    );
};
