import React from 'react';
import { clsx } from 'clsx';

interface CoverGridProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Shared grid layout for card-based collections (playlists, toplists, etc.).
 */
export const CoverGrid: React.FC<CoverGridProps> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6',
        className,
      )}
    >
      {children}
    </div>
  );
};
