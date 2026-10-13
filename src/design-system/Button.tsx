import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold tracking-wider uppercase transition-colors rounded-xl select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fabc4d] disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeClasses = {
    sm: 'text-[11px] px-3.5 py-2 gap-1.5',
    md: 'text-xs px-5 py-3 gap-2',
    lg: 'text-sm px-6 py-3.5 gap-2.5',
  }[size];

  const variantClasses = {
    primary:
      'bg-[#fabc4d] hover:bg-[#e0a438] active:bg-[#bd8718] text-[#281900] shadow-[0_4px_16px_rgba(250,188,77,0.18)] hover:shadow-[0_6px_20px_rgba(250,188,77,0.28)]',
    secondary:
      'bg-[#201f20] hover:bg-[#2a2a2b] active:bg-[#353436] text-white border border-white/10 hover:border-white/20',
    outline:
      'bg-transparent hover:bg-white/5 active:bg-white/10 text-[#c5c7c9] hover:text-white border border-white/10 hover:border-white/20',
    ghost:
      'bg-transparent hover:bg-white/5 active:bg-white/10 text-[#8f9194] hover:text-white',
    danger:
      'bg-[#93000a]/20 hover:bg-[#93000a]/30 active:bg-[#93000a]/40 text-[#ffb4ab] border border-[#ffb4ab]/20',
  }[variant];

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : icon && iconPosition === 'left' ? (
        <span className="material-symbols-outlined text-[18px] shrink-0 leading-none">{icon}</span>
      ) : null}

      <span>{children}</span>

      {!loading && icon && iconPosition === 'right' ? (
        <span className="material-symbols-outlined text-[18px] shrink-0 leading-none">{icon}</span>
      ) : null}
    </motion.button>
  );
};
