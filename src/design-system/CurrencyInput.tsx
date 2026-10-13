import React, { forwardRef } from 'react';
import { formatCurrency } from '../utils/formatters.ts';

export interface CurrencyInputProps {
  label?: string;
  value: number;
  onChange: (val: number) => void;
  error?: string | null;
  hint?: string;
  badge?: React.ReactNode;
  requiredAsterisk?: boolean;
  disabled?: boolean;
  className?: string;
  accentAmber?: boolean;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      label,
      value,
      onChange,
      error,
      hint,
      badge,
      requiredAsterisk,
      disabled,
      className = '',
      accentAmber = false,
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '');
      const num = Number(raw) / 100;
      onChange(isNaN(num) ? 0 : num);
    };

    const formattedValue = formatCurrency(value);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {(label || badge) && (
          <div className="flex items-center justify-between pl-0.5">
            {label && (
              <label className="text-xs font-semibold text-[#e5e2e3] tracking-wider uppercase flex items-center gap-1.5">
                <span>{label}</span>
                {requiredAsterisk && <span className="text-[#fabc4d]">*</span>}
              </label>
            )}
            {badge && <div>{badge}</div>}
          </div>
        )}

        <div className="relative flex items-center">
          <input
            ref={ref}
            type="text"
            inputMode="numeric"
            disabled={disabled}
            value={formattedValue}
            onChange={handleChange}
            className={`w-full h-12 bg-[#0e0e0f] rounded-xl border px-4 font-mono text-base tracking-wide transition-colors shadow-inner focus:outline-none disabled:opacity-50 ${
              accentAmber
                ? 'text-[#fabc4d] font-bold border-[#fabc4d]/30 focus:border-[#fabc4d]'
                : 'text-white border-white/10 focus:border-[#fabc4d]'
            } ${error ? 'border-[#ffb4ab]' : ''} ${className}`}
          />
        </div>

        {error ? (
          <span className="text-xs text-[#ffb4ab] flex items-center gap-1 pl-0.5 mt-0.5">
            <span className="material-symbols-outlined text-[14px]">error</span>
            <span>{error}</span>
          </span>
        ) : hint ? (
          <span className="text-[11px] text-[#8f9194] pl-0.5">{hint}</span>
        ) : null}
      </div>
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';
