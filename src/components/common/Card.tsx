import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e?: React.MouseEvent) => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hover = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6',
        hover && 'cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-2xl',
        className
      )}
    >
      {children}
    </div>
  );
};
