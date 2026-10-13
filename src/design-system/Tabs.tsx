import React from 'react';
import { motion } from 'framer-motion';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  badgeDot?: string;
  tooltip?: string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`relative flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            title={tab.tooltip || tab.label}
            className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer select-none shrink-0 ${
              isActive ? 'text-white' : 'text-[#8f9194] hover:text-[#e5e2e3]'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabBadge"
                className="absolute inset-0 bg-[#2a2a2b] border border-white/10 rounded-xl shadow-sm"
                transition={{ type: 'spring', damping: 24, stiffness: 320 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.badgeDot && (
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${tab.badgeDot}`} />
              )}
              <span className="truncate max-w-[160px] sm:max-w-none">{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-[#353436] text-white' : 'bg-[#201f20] text-[#8f9194]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};
