import React, { useState, useEffect } from 'react';
import { Session } from '../../types/index.ts';
import { formatCurrency } from '../../utils/formatters.ts';
import { Button } from '../../design-system/Button.tsx';

interface Step3PixPaymentProps {
  session: Session;
  onPaymentConfirmed: () => void;
  onBack: () => void;
}

export const Step3PixPayment: React.FC<Step3PixPaymentProps> = ({ session, onPaymentConfirmed }) => {
  const [secondsLeft, setSecondsLeft] = useState(14 * 60 + 59);
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const totalTime = 15 * 60;
  const pixKeyMock = `00020126580014br.gov.bcb.pix0136${session.shaHash.slice(0, 32)}520400005303986540${
    session.depositAmount
  }.005802BR5925MARCADO TATTOO ATELIER6009SAO PAULO62070503***6304E8A2`;

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulação de verificação automática após 12 segundos se cliente não clicar
  useEffect(() => {
    const autoVerify = setTimeout(() => {
      onPaymentConfirmed();
    }, 18000);
    return () => clearTimeout(autoVerify);
  }, [onPaymentConfirmed]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const handleCopyPix = () => {
    navigator.clipboard?.writeText(pixKeyMock);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCheckNow = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onPaymentConfirmed();
    }, 900);
  };

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* Timer de Garantia de Vaga */}
      <section className="bg-[#1c1b1c] p-4 rounded-2xl border border-white/5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[#fabc4d] text-[20px] animate-pulse">
            hourglass_top
          </span>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#fabc4d] uppercase tracking-wider">
              Reserva Temporária de Vaga
            </span>
            <span className="text-xs text-[#8f9194]">O horário expira após o fim do cronômetro</span>
          </div>
        </div>
        <div className="px-3 py-1 rounded-xl bg-[#0e0e0f] border border-white/5 font-mono text-sm text-[#fabc4d] font-bold tracking-wider">
          {timeFormatted}
        </div>
      </section>

      {/* Cartão Pix com QR Code */}
      <section className="bg-[#1c1b1c] rounded-2xl p-6 border border-white/5 flex flex-col items-center text-center gap-5 shadow-sm">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-bold text-[#fabc4d] uppercase tracking-wider">
            Sinal de Reserva Obrigatório
          </span>
          <span className="font-headline text-3xl sm:text-4xl font-semibold text-white tracking-tight font-mono tabular-nums">
            {formatCurrency(session.depositAmount)}
          </span>
          <span className="text-xs text-[#8f9194]">
            Saldo restante de <strong className="text-white font-mono">{formatCurrency(session.totalAmount - session.depositAmount)}</strong> pago no dia da sessão
          </span>
        </div>

        {/* QR Code SVG Minimalista de Alta Qualidade */}
        <div className="p-4 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
          <svg className="w-48 h-48 sm:w-52 sm:h-52" viewBox="0 0 200 200" fill="none">
            {/* Standard QR Code blocks stylized */}
            <rect width="200" height="200" fill="white" />
            {/* Top-left corner box */}
            <rect x="20" y="20" width="46" height="46" fill="#131314" rx="6" />
            <rect x="28" y="28" width="30" height="30" fill="white" rx="3" />
            <rect x="34" y="34" width="18" height="18" fill="#131314" rx="2" />
            {/* Top-right corner box */}
            <rect x="134" y="20" width="46" height="46" fill="#131314" rx="6" />
            <rect x="142" y="28" width="30" height="30" fill="white" rx="3" />
            <rect x="148" y="34" width="18" height="18" fill="#131314" rx="2" />
            {/* Bottom-left corner box */}
            <rect x="20" y="134" width="46" height="46" fill="#131314" rx="6" />
            <rect x="28" y="142" width="30" height="30" fill="white" rx="3" />
            <rect x="34" y="148" width="18" height="18" fill="#131314" rx="2" />
            {/* Random aesthetic QR data blocks */}
            <rect x="80" y="24" width="10" height="10" fill="#131314" rx="1" />
            <rect x="94" y="24" width="24" height="10" fill="#131314" rx="1" />
            <rect x="80" y="44" width="38" height="10" fill="#131314" rx="1" />
            <rect x="80" y="64" width="12" height="12" fill="#131314" rx="1" />
            <rect x="100" y="64" width="18" height="12" fill="#131314" rx="1" />
            <rect x="134" y="76" width="46" height="12" fill="#131314" rx="1" />
            <rect x="24" y="80" width="42" height="12" fill="#131314" rx="1" />
            <rect x="76" y="90" width="48" height="20" fill="#131314" rx="1" />
            <rect x="134" y="100" width="20" height="20" fill="#131314" rx="1" />
            <rect x="164" y="100" width="16" height="20" fill="#131314" rx="1" />
            <rect x="80" y="120" width="32" height="14" fill="#131314" rx="1" />
            <rect x="122" y="120" width="18" height="14" fill="#131314" rx="1" />
            <rect x="80" y="144" width="20" height="36" fill="#131314" rx="1" />
            <rect x="110" y="144" width="42" height="16" fill="#131314" rx="1" />
            <rect x="110" y="170" width="70" height="10" fill="#131314" rx="1" />
            {/* Center Brand Seal */}
            <circle cx="100" cy="100" r="16" fill="#fabc4d" />
            <text x="100" y="105" textAnchor="middle" fill="#281900" fontSize="12" fontWeight="bold">M!</text>
          </svg>
        </div>

        {/* Chave Pix Copia e Cola com Morphing Button */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center gap-2 p-3 bg-[#0e0e0f] rounded-xl border border-white/10 font-mono text-xs text-[#fabc4d] overflow-hidden">
            <span className="material-symbols-outlined text-[16px] text-[#8f9194] shrink-0">key</span>
            <span className="truncate flex-1 select-all font-mono text-[11px]">
              {pixKeyMock}
            </span>
            <Button
              variant={copied ? 'primary' : 'secondary'}
              size="sm"
              icon={copied ? 'done' : 'content_copy'}
              onClick={handleCopyPix}
            >
              {copied ? 'Copiado!' : 'Copiar'}
            </Button>
          </div>
          <span className="text-[11px] text-[#8f9194]">
            Abra o app do seu banco, escolha Pix Copia e Cola e conclua a transferência.
          </span>
        </div>

        {/* Verificação Automática em Andamento */}
        <div className="w-full pt-2 flex flex-col gap-2">
          <Button
            variant="primary"
            size="lg"
            loading={isVerifying}
            icon="verified"
            onClick={handleCheckNow}
            className="w-full"
          >
            Já realizei o pagamento Pix
          </Button>
          <span className="text-[10px] text-[#8f9194] flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fabc4d] animate-pulse" />
            <span>Aguardando confirmação automática da liquidação Pix...</span>
          </span>
        </div>
      </section>
    </div>
  );
};
