import { format, addDays, isWeekend } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata moeda no padrão estrito BRL "R$ 1.500,00"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

/**
 * Formata valor sem símbolo "1.500,00"
 */
export function formatNumberBr(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

/**
 * Formata data no padrão exigido: "qui, 30 de dez · 14h"
 */
export function formatPtBrDate(dateInput: Date | string | number, timeStr?: string): string {
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(d.getTime())) {
      return timeStr ? `${dateInput} · ${timeStr}` : String(dateInput);
    }
    const dayStr = format(d, "EEE, d 'de' MMM", { locale: ptBR });
    const hourStr = timeStr ? timeStr.replace(':00', 'h') : format(d, 'HH:mm').replace(':00', 'h');
    // Normalizar capitalização: primeira letra maiúscula
    const capitalized = dayStr.charAt(0).toUpperCase() + dayStr.slice(1);
    return `${capitalized} · ${hourStr}`;
  } catch {
    return timeStr ? `${dateInput} · ${timeStr}` : String(dateInput);
  }
}

/**
 * Retorna o próximo dia útil futuro formatado para data padrão do modal
 */
export function getNextBusinessDay(baseDate = new Date()): { dateIso: string; formatted: string; fullDate: Date } {
  let next = addDays(baseDate, 1);
  while (isWeekend(next)) {
    next = addDays(next, 1);
  }
  const dateIso = format(next, 'yyyy-MM-dd');
  const formatted = format(next, "EEE, d 'de' MMM", { locale: ptBR });
  const capitalized = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  return {
    dateIso,
    formatted: capitalized,
    fullDate: next,
  };
}

/**
 * Gera datas de exemplo relativas à data atual para que nunca fiquem no passado
 */
export function getRelativeSessionDates(): {
  date1: { dateStr: string; timeStr: string };
  date2: { dateStr: string; timeStr: string };
  date3: { dateStr: string; timeStr: string };
  date4: { dateStr: string; timeStr: string };
} {
  const now = new Date();
  const d1 = addDays(now, 1);
  const d2 = addDays(now, 2);
  const d3 = addDays(now, 4);
  const d4 = addDays(now, 6);

  return {
    date1: {
      dateStr: formatPtBrDate(d1, '14:00'),
      timeStr: '14:00',
    },
    date2: {
      dateStr: formatPtBrDate(d2, '10:30'),
      timeStr: '10:30',
    },
    date3: {
      dateStr: formatPtBrDate(d3, '15:00'),
      timeStr: '15:00',
    },
    date4: {
      dateStr: formatPtBrDate(d4, '13:00'),
      timeStr: '13:00',
    },
  };
}

/**
 * Paleta de cores para avatares com monograma de iniciais (tons de grafite escuro com bordas e letras neutras)
 */
export const AVATAR_PALETTES = [
  { bg: 'bg-[#2a2a2b]', text: 'text-[#fabc4d]', border: 'border-[#fabc4d]/30' },
  { bg: 'bg-[#201f20]', text: 'text-white', border: 'border-white/10' },
  { bg: 'bg-[#1c1b1c]', text: 'text-[#e5e2e3]', border: 'border-white/15' },
  { bg: 'bg-[#282729]', text: 'text-[#fabc4d]', border: 'border-[#fabc4d]/20' },
  { bg: 'bg-[#222123]', text: 'text-[#c5c7c9]', border: 'border-white/10' },
];

export function getInitials(name: string): string {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getAvatarColor(name: string): (typeof AVATAR_PALETTES)[0] {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[index];
}
