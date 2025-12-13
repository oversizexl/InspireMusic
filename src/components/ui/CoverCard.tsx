import React from 'react';
import { clsx } from 'clsx';
import { Play } from 'lucide-react';
import { CoverImage } from './CoverImage';

interface CoverCardProps {
  title: string;
  description?: string;
  coverSrc?: string;
  gradientClass?: string;
  placeholderIcon?: React.ReactNode;
  onClick?: () => void;
  onPrimaryAction?: () => void;
  /** Optional custom CTA icon; defaults to Play. */
  primaryIcon?: React.ReactNode;
  className?: string;
}

export const CoverCard: React.FC<CoverCardProps> = ({
  title,
  description,
  coverSrc,
  gradientClass,
  placeholderIcon,
  onClick,
  onPrimaryAction,
  primaryIcon,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "group bg-surface hover:bg-surface/80 rounded-lg p-4 cursor-pointer transition-colors",
        className,
      )}
    >
      <div
        className={clsx(
          "aspect-square rounded-md mb-4 flex items-center justify-center relative overflow-hidden shadow-lg",
          gradientClass,
          !gradientClass && "bg-gray-800",
        )}
      >
        {coverSrc ? (
          <CoverImage
            src={coverSrc}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            iconSize={64}
          />
        ) : (
          placeholderIcon
        )}

        {onPrimaryAction && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrimaryAction();
            }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
              {primaryIcon || <Play fill="black" className="text-black ml-1" />}
            </div>
          </button>
        )}
      </div>
      <h3 className="text-white font-bold truncate">{title}</h3>
      {description && <p className="text-gray-400 text-sm truncate">{description}</p>}
    </div>
  );
};
