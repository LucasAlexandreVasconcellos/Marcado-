import React from 'react';
import { SessionStatus } from '../types/index.ts';

export interface BadgeProps {
  status?: SessionStatus;
  variant?: 'confirmada' | 'pix_pendente' | 'termo_pendente' | 'amber' | 'neutral' | 'success';
  children?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  variant,
  children,
  className = '',
  size = 'md',
}) => {
  const activeVariant = status || variant || 'neutral';

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]';

  const styles = {
    confirmada: {
      bg: 'bg-[#fabc4d]/10 border-[#fabc4d]/30 text-[#fabc4d]',
      dot: 'bg-[#fabc4d] shadow-[0_0_6px_#fabc4d]',
      defaultLabel: 'Confirmada',
    },
    success: {
      bg: 'bg-[#fabc4d]/10 border-[#fabc4d]/30 text-[#fabc4d]',
      dot: 'bg-[#fabc4d] shadow-[0_0_6px_#fabc4d]',
      defaultLabel: 'Sucesso',
    },
    pix_pendente: {
      bg: 'bg-[#2a2a2b] border-white/10 text-[#c5c7c9]',
      dot: 'bg-[#8f9194]',
      defaultLabel: 'Aguardando sinal Pix',
    },
    termo_pendente: {
      bg: 'bg-[#ffb4ab]/10 border-[#ffb4ab]/25 text-[#ffb4ab]',
      dot: 'bg-[#ffb4ab]',
      defaultLabel: 'Anamnese pendente',
    },
    amber: {
      bg: 'bg-[#fabc4d]/15 border-[#fabc4d]/30 text-[#fabc4d]',
      dot: 'bg-[#fabc4d]',
      defaultLabel: '',
    },
    neutral: {
      bg: 'bg-[#201f20] border-white/10 text-[#8f9194]',
      dot: 'bg-[#8f9194]',
      defaultLabel: '',
    },
  }[activeVariant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium tracking-wide uppercase select-none ${sizeClass} ${styles.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${styles.dot}`} />
      <span>{children || styles.defaultLabel}</span>
    </span>
  );
};
