import React, { useEffect, useState } from 'react';
import { Session } from '../../types/index.ts';
import { formatCurrency } from '../../utils/formatters.ts';
import { downloadLegalCertificate } from '../../utils/pdfCertificate.ts';
import { Button } from '../../design-system/Button.tsx';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';

interface Step4ConfirmationProps {
  session: Session;
  onRestart: () => void;
  onReturnToStudio: () => void;
  studioName?: string;
}

export const Step4Confirmation: React.FC<Step4ConfirmationProps> = ({
  session,
  studioName = 'Atelier Jardins',
}) => {
  const [calendarSaved, setCalendarSaved] = useState(false);

  useEffect(() => {
    // Tactile feedback on mobile devices
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 60, 40]);
      } catch {
        // noop
      }
    }

    // Subtle dark amber and gold confetti splash
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.4 },
        colors: ['#fabc4d', '#bd8718', '#e5e2e3', '#39393a'],
      });
    } catch {
      // noop
    }
  }, []);

  const handleAddToCalendar = () => {
    // Criar evento para Google Calendar / download .ics
    const title = encodeURIComponent(`Sessão de Tatuagem — ${session.project}`);
    const details = encodeURIComponent(
      `Tatuador: ${session.artistName}\nEstúdio: ${studioName}\nValor: ${formatCurrency(
        session.totalAmount
      )}\nSinal Pago: ${formatCurrency(session.depositAmount)}`
    );
    const location = encodeURIComponent(`${studioName} • São Paulo - SP`);
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(gcalUrl, '_blank');
    setCalendarSaved(true);
    setTimeout(() => setCalendarSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-5 pb-10 items-center text-center">
      {/* Animated Rubber Stamp 'Marcado!' (SVG/CSS sem WebGL) */}
      <motion.div
        initial={{ scale: 2.2, opacity: 0, rotate: -18 }}
        animate={{ scale: 1, opacity: 1, rotate: -6 }}
        transition={{ type: 'spring', damping: 14, stiffness: 260, delay: 0.1 }}
        className="relative my-4"
      >
        <div className="w-44 h-24 border-4 border-[#fabc4d] rounded-2xl flex flex-col items-center justify-center p-2 shadow-[0_0_30px_rgba(250,188,77,0.25)] bg-[#131314]/80 backdrop-blur-sm select-none">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#fabc4d] uppercase font-bold">
            CONFIRMADO
          </span>
          <span className="font-headline text-3xl font-extrabold text-[#fabc4d] tracking-wider leading-none my-0.5">
            Marcado<span className="italic">!</span>
          </span>
          <span className="text-[9px] font-mono text-white/80 uppercase tracking-widest">
            SINAL RECEBIDO VIA PIX
          </span>
        </div>
      </motion.div>

      <div className="space-y-1.5 max-w-sm">
        <h1 className="font-headline text-2xl sm:text-3xl text-white font-medium">
          Sua Sessão está Garantida!
        </h1>
        <p className="text-xs text-[#c5c7c9] leading-relaxed">
          O sinal de <strong className="text-[#fabc4d] font-mono">{formatCurrency(session.depositAmount)}</strong> foi
          conciliado e sua vaga foi reservada com exclusividade para {session.clientName}.
        </p>
      </div>

      {/* Cartão Passaporte da Sessão */}
      <div className="w-full bg-[#1c1b1c] rounded-2xl p-5 border border-white/5 space-y-4 text-left shadow-md">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <span className="text-[10px] font-bold text-[#fabc4d] uppercase tracking-wider">
            Comprovante Oficial de Reserva
          </span>
          <span className="text-[10px] font-mono text-[#8f9194]">
            ID: #{session.token.slice(0, 10).toUpperCase()}
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#0e0e0f] flex items-center justify-center text-[#fabc4d] shrink-0">
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#8f9194] uppercase font-semibold">Data & Horário</span>
              <span className="text-sm font-semibold text-white">{session.dateStr}</span>
              <span className="text-[11px] text-[#fabc4d]">Duração estimada: {session.duration}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#0e0e0f] flex items-center justify-center text-[#fabc4d] shrink-0">
              <span className="material-symbols-outlined text-[18px]">palette</span>
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#8f9194] uppercase font-semibold">Tatuador Titular</span>
              <span className="text-sm font-semibold text-white">{session.artistName}</span>
              <span className="text-[11px] text-[#8f9194]">{studioName}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0e0e0f] border border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#8f9194] uppercase">Valor Total</span>
              <span className="font-mono text-white font-semibold">{formatCurrency(session.totalAmount)}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-[#fabc4d] uppercase font-semibold">Sinal Pago por Pix</span>
              <span className="font-mono text-[#fabc4d] font-bold">{formatCurrency(session.depositAmount)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Add to Calendar & Download PDF */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            icon={calendarSaved ? 'done' : 'event'}
            onClick={handleAddToCalendar}
          >
            {calendarSaved ? 'Adicionado!' : 'Adicionar à Agenda'}
          </Button>

          <Button
            variant="secondary"
            size="md"
            icon="download"
            onClick={() => downloadLegalCertificate(session)}
          >
            Baixar Termo em PDF
          </Button>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#0e0e0f] border border-white/5 text-xs text-[#8f9194] space-y-1.5 w-full text-left">
        <span className="font-semibold text-white flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-[#fabc4d]">check_circle</span>
          <span>Orientações para o Dia da Sessão</span>
        </span>
        <p className="leading-relaxed">
          • Durma bem na véspera e alimente-se antes de comparecer.<br />
          • Evite consumo de álcool 24 horas antes do procedimento.<br />
          • Traga um documento com foto no dia da sessão.
        </p>
      </div>
    </div>
  );
};
