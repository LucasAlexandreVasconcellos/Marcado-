import React from 'react';
import { Session } from '../../types/index.ts';
import { downloadLegalCertificate } from '../../utils/pdfCertificate.ts';

interface LegalHashModalProps {
  session: Session | null;
  onClose: () => void;
}

export const LegalHashModal: React.FC<LegalHashModalProps> = ({ session, onClose }) => {
  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#1c1b1c] w-full max-w-lg rounded-xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl relative border border-white/10">
        <div className="flex items-center justify-between border-b border-[#353436] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#fabc4d] text-[24px]">verified</span>
            <span className="font-headline text-xl text-white font-medium">Registro Jurídico Digital</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#2a2a2b] flex items-center justify-center text-[#8f9194] hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8f9194] uppercase tracking-wider">Cliente Autenticado:</span>
            <span className="text-sm font-semibold text-white">{session.clientName}</span>
          </div>

          <div className="p-4 bg-[#0e0e0f] rounded-lg flex flex-col gap-1.5 border border-white/5">
            <span className="text-[10px] font-semibold text-[#8f9194] uppercase tracking-wider">
              Hash Criptográfico SHA-256 (Carimbo de Tempo UTC)
            </span>
            <span className="font-mono text-xs text-[#fabc4d] break-all select-all">
              {session.shaHash}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#201f20] rounded-lg flex flex-col gap-0.5">
              <span className="text-[#8f9194] text-[10px] uppercase font-semibold">Data / Timestamp</span>
              <span className="text-white font-mono">{session.signedAt || '2024-10-23 18:42:11 UTC'}</span>
            </div>
            <div className="p-3 bg-[#201f20] rounded-lg flex flex-col gap-0.5">
              <span className="text-[#8f9194] text-[10px] uppercase font-semibold">Validade Probatória</span>
              <span className="text-[#fabc4d] font-mono">Íntegro & Inalterável (MP 2.200-2)</span>
            </div>
          </div>

          <div className="p-3 bg-[#201f20] rounded-lg flex items-start gap-2.5 text-xs text-[#c5c7c9] leading-relaxed">
            <span className="material-symbols-outlined text-[#fabc4d] text-[18px] shrink-0 mt-0.5">gavel</span>
            <span>
              Certificado lacrado digitalmente. Assinatura touch e questionário de anamnese protegidos sob sigilo profissional médico e LGPD.
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#353436]">
          <button
            onClick={() => downloadLegalCertificate(session)}
            className="px-4 py-2.5 rounded-lg bg-[#2a2a2b] hover:bg-[#353436] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Baixar PDF do Termo
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-[#fabc4d] text-[#281900] font-semibold text-xs uppercase tracking-wider hover:bg-[#bd8718] hover:text-white transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
