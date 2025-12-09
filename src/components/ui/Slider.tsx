import React from 'react';
import { clsx } from 'clsx';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number;
  max: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({ value, max, onChange, className, ...props }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className={clsx("relative flex items-center w-full h-4 group", className)}>
      <div className="absolute w-full h-1 bg-gray-600 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white group-hover:bg-primary transition-colors" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <input
        type="range"
        min="0"
        max={max}
        value={value}
        onChange={onChange}
        className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        {...props}
      />
      <div 
        className="absolute h-3 w-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
      />
    </div>
  );
};
