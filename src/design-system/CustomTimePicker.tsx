import React, { useState, useRef, useEffect } from 'react';

export interface CustomTimePickerProps {
  label?: string;
  value: string; // e.g. "14:00"
  onChange: (val: string) => void;
}

const COMMON_SLOTS = ['10:00', '11:30', '13:00', '14:00', '15:30', '17:00', '18:30', '20:00'];

export const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  label = 'Horário de Início',
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-1.5 w-full relative" ref={containerRef}>
      <label className="text-xs font-semibold text-[#e5e2e3] tracking-wider uppercase pl-0.5 flex items-center gap-1.5">
        <span>{label}</span>
      </label>

      {/* Button trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 bg-[#0e0e0f] hover:bg-[#141415] border border-white/10 hover:border-white/20 focus:border-[#fabc4d] text-white px-4 rounded-xl flex items-center justify-between transition-colors shadow-inner cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[18px] text-[#fabc4d]">schedule</span>
          <span className="text-sm font-mono font-medium">{value ? `${value}h` : 'Selecionar'}</span>
        </div>
        <span className="material-symbols-outlined text-[18px] text-[#8f9194]">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {/* Dropdown slot picker */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-64 p-3 rounded-2xl bg-[#1c1b1c] border border-white/10 shadow-2xl backdrop-blur-xl animate-fadeIn">
          <span className="text-[10px] font-semibold text-[#8f9194] uppercase tracking-wider block mb-2 px-1">
            Horários Recomendados
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {COMMON_SLOTS.map((slot) => {
              const isSelected = value === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => {
                    onChange(slot);
                    setIsOpen(false);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-mono transition-colors text-center cursor-pointer ${
                    isSelected
                      ? 'bg-[#fabc4d] text-[#281900] font-bold shadow'
                      : 'bg-[#201f20] hover:bg-[#2a2a2b] text-white'
                  }`}
                >
                  {slot}h
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center gap-2">
            <span className="text-[11px] text-[#8f9194]">Outro:</span>
            <input
              type="time"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
              }}
              className="flex-1 bg-[#0e0e0f] text-white text-xs px-2.5 py-1.5 rounded-lg border border-white/10 font-mono focus:outline-none focus:border-[#fabc4d]"
            />
          </div>
        </div>
      )}
    </div>
  );
};
