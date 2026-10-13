import React from 'react';

export interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-[#1c1b1c] via-[#2a2a2b] to-[#1c1b1c] bg-[length:200%_100%] rounded-xl ${className}`}
    />
  );
};
