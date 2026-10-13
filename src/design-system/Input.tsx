import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  hint?: string;
  icon?: string;
  badge?: React.ReactNode;
  requiredAsterisk?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, badge, requiredAsterisk, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {(label || badge) && (
          <div className="flex items-center justify-between pl-0.5">
            {label && (
              <label htmlFor={inputId} className="text-xs font-semibold text-[#e5e2e3] tracking-wider uppercase flex items-center gap-1.5">
                <span>{label}</span>
                {requiredAsterisk && <span className="text-[#fabc4d]">*</span>}
              </label>
            )}
            {badge && <div>{badge}</div>}
          </div>
        )}

        <div className="relative flex items-center">
          {icon && (
            <span className="material-symbols-outlined text-[18px] text-[#8f9194] absolute left-3.5 pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full h-12 bg-[#0e0e0f] text-white rounded-xl border transition-colors text-sm placeholder-[#8f9194]/40 shadow-inner focus:outline-none focus:border-[#fabc4d] ${
              icon ? 'pl-10 pr-4' : 'px-4'
            } ${error ? 'border-[#ffb4ab]' : 'border-white/10'} ${className}`}
            {...props}
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

Input.displayName = 'Input';
