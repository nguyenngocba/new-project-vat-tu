import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-dark-900/50 backdrop-blur-sm border border-dark-800 rounded-xl p-6 transition-all duration-200',
        onClick && 'cursor-pointer hover:border-steel-500/50',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
