import React, { useState, useRef, useEffect } from 'react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface CustomDatePickerProps {
  label?: string;
  value: string; // ISO yyyy-MM-dd
  onChange: (val: string) => void;
  minDate?: Date;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label = 'Data da Sessão',
  value,
  onChange,
  minDate = startOfToday(),
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value + 'T12:00:00') : new Date();
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const formattedDisplay = value
    ? (() => {
        const d = new Date(value + 'T12:00:00');
        const str = format(d, "EEE, d 'de' MMMM", { locale: ptBR });
        return str.charAt(0).toUpperCase() + str.slice(1);
      })()
    : 'Selecione uma data';

  const selectDay = (day: Date) => {
    const iso = format(day, 'yyyy-MM-dd');
    onChange(iso);
    setIsOpen(false);
  };

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
          <span className="material-symbols-outlined text-[18px] text-[#fabc4d]">calendar_month</span>
          <span className="text-sm font-medium">{formattedDisplay}</span>
        </div>
        <span className="material-symbols-outlined text-[18px] text-[#8f9194]">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {/* Popover Calendar */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-72 sm:w-80 p-4 rounded-2xl bg-[#1c1b1c] border border-white/10 shadow-2xl backdrop-blur-xl animate-fadeIn">
          {/* Month Header Navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <span className="text-xs font-semibold text-white uppercase tracking-wider capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentMonth(addDays(monthStart, -5))}
                className="w-7 h-7 rounded-lg bg-[#2a2a2b] hover:bg-[#353436] flex items-center justify-center text-[#8f9194] hover:text-white"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentMonth(addDays(monthEnd, 5))}
                className="w-7 h-7 rounded-lg bg-[#2a2a2b] hover:bg-[#353436] flex items-center justify-center text-[#8f9194] hover:text-white"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="grid grid-cols-2 gap-1.5 py-2.5">
            <button
              type="button"
              onClick={() => selectDay(addDays(new Date(), 1))}
              className="py-1.5 px-2 bg-[#201f20] hover:bg-[#2a2a2b] rounded-lg text-[10px] uppercase font-semibold text-[#fabc4d] transition-colors"
            >
              Amanhã
            </button>
            <button
              type="button"
              onClick={() => selectDay(addDays(new Date(), 3))}
              className="py-1.5 px-2 bg-[#201f20] hover:bg-[#2a2a2b] rounded-lg text-[10px] uppercase font-semibold text-[#8f9194] hover:text-white transition-colors"
            >
              Em 3 dias
            </button>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-[#8f9194] uppercase pb-1">
            <span>D</span>
            <span>S</span>
            <span>T</span>
            <span>Q</span>
            <span>Q</span>
            <span>S</span>
            <span>S</span>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {daysInMonth.map((day) => {
              const isSelected = isSameDay(day, selectedDate);
              const isDisabled = isBefore(day, minDate);

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => selectDay(day)}
                  className={`h-8 rounded-lg text-xs font-mono flex items-center justify-center transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed ${
                    isSelected
                      ? 'bg-[#fabc4d] text-[#281900] font-bold shadow-md'
                      : 'hover:bg-[#2a2a2b] text-white'
                  }`}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
