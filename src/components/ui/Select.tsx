import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
  direction?: 'up' | 'down';
}

export const Select: React.FC<SelectProps> = ({ value, onChange, options, className, direction = 'down' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={clsx("relative", className)} ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex items-center justify-between w-full text-white rounded-md px-3 py-2 transition-colors outline-none border border-transparent focus:border-primary/50",
          className?.includes('!bg-transparent') ? "" : "bg-white/10 hover:bg-white/20"
        )}
      >
        <span className="truncate mr-2 text-sm">{selectedOption?.label}</span>
        <ChevronDown size={16} className={clsx("text-gray-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: direction === 'down' ? -10 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction === 'down' ? -10 : 10 }}
            transition={{ duration: 0.15 }}
            className={clsx(
              "absolute left-0 right-0 bg-surface border border-gray-800 rounded-md shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto custom-scrollbar",
              direction === 'down' ? "top-full mt-1" : "bottom-full mb-1"
            )}
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={clsx(
                  "w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-white/10 transition-colors",
                  option.value === value ? "text-primary bg-primary/10" : "text-gray-300"
                )}
              >
                <span>{option.label}</span>
                {option.value === value && <Check size={14} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
