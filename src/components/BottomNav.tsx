import React from 'react';
import { clsx } from 'clsx';
import { NAV_TABS, type NavTabId } from './navigation/navTabs';

interface BottomNavProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="md:hidden h-16 bg-black/95 backdrop-blur-lg border-t border-white/10 flex items-center justify-around px-4 z-[70]">
      {NAV_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id || (tab.id === 'library' && activeTab === 'playlist');
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={clsx(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              isActive ? "text-primary" : "text-gray-400 hover:text-white"
            )}
          >
            <Icon size={24} />
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
