import React from 'react';
import { Button } from './Button.tsx';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon = 'event_busy',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-[#1c1b1c] border border-white/5 space-y-4 my-4">
      {/* Animated Ink / Needle SVG Graphic */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-[#201f20] border border-white/10 flex items-center justify-center text-[#fabc4d] shadow-inner">
          <span className="material-symbols-outlined text-[32px]">{icon}</span>
        </div>
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40 animate-pulse"
          viewBox="0 0 80 80"
          fill="none"
        >
          <circle cx="40" cy="40" r="36" stroke="#fabc4d" strokeWidth="1" strokeDasharray="4 6" />
        </svg>
      </div>

      <div className="max-w-sm space-y-1.5">
        <h3 className="font-headline text-lg sm:text-xl text-white font-medium">{title}</h3>
        <p className="text-xs text-[#8f9194] leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <Button variant="primary" size="md" icon="add" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
