import React from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
  color?: string;
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  color = 'bg-game-blue',
  showLabel = true,
  className = '',
}) => {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className={`w-full bg-gray-200 rounded-full h-4 ${className}`}>
      <div
        className={`h-4 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${percentage}%` }}
      />
      {showLabel && (
        <div className="flex justify-between mt-1 text-sm font-medium text-gray-600">
          <span>{current}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
};
