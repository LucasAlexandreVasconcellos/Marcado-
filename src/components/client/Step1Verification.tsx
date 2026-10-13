import React, { useState } from 'react';
import { Session } from '../../types/index.ts';
import { formatCurrency } from '../../utils/formatters.ts';
import { Button } from '../../design-system/Button.tsx';
import { WhatsAppInputGroup } from '../../design-system/WhatsAppInputGroup.tsx';

interface Step1VerificationProps {
  session: Session;
  onProceed: (updatedSession: Partial<Session>) => void;
}

export const Step1Verification: React.FC<Step1VerificationProps> = ({ session, onProceed }) => {
  const [name, setName] = useState(session.clientName || 'Marina Valadares');
  const [phone, setPhone] = useState(session.clientPhone || '(11) 98422-1089');
  const [birthdate, setBirthdate] = useState(session.clientBirthdate || '14/08/1997');
  const [cpf, setCpf] = useState(session.clientCpf || '392.481.908-12');
  const [isValidating, setIsValidating] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value.slice(0, 50));
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpf(v);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length <= 2) {
      setPhone(v.length > 0 ? `(${v}` : '');
    } else if (v.length <= 7) {
      setPhone(`(${v.slice(0, 2)}) ${v.slice(2)}`);
    } else {
      setPhone(`(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      onProceed({
        clientName: name,
        clientPhone: phone,
        clientBirthdate: birthdate,
        clientCpf: cpf,
      });
    }, 400);
  };

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* Tatuador Responsável Header */}
      <section className="bg-[#1c1b1c] rounded-2xl p-4 border border-white/5 shadow-sm flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-[#fabc4d]/15 border border-[#fabc4d]/30 flex items-center justify-center text-[#fabc4d] font-bold text-sm shrink-0">
          KV
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-bold text-[#fabc4d] uppercase tracking-wider">
            Tatuador Responsável
          </span>
          <span className="font-semibold text-white text-base truncate">{session.artistName}</span>
          <span className="text-xs text-[#8f9194] truncate">
            {session.artistRole || 'Especialista Blackwork & Fine Line'}
          </span>
        </div>
      </section>

      {/* Resumo do Projeto */}
      <section className="bg-[#1c1b1c] rounded-2xl p-5 border border-white/5 space-y-4 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#fabc4d] uppercase tracking-wider">
              Projeto & Bancada
            </span>
            <h2 className="font-headline text-xl text-white font-medium leading-tight mt-0.5">
              {session.project}
            </h2>
          </div>
          <span className="shrink-0 bg-[#201f20] text-[#fabc4d] px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold">
            {session.duration}
          </span>
        </div>

        {/* Informações da Data e Local */}
        <div className="grid grid-cols-1 gap-2.5 bg-[#0e0e0f] p-3.5 rounded-xl border border-white/5 text-xs">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-[#201f20] flex items-center justify-center text-[#fabc4d] shrink-0">
              <span className="material-symbols-outlined text-[16px]">calendar_month</span>
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#8f9194] uppercase">Data & Horário</span>
              <span className="text-xs font-semibold text-white">{session.dateStr}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-[#201f20] flex items-center justify-center text-[#fabc4d] shrink-0">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#8f9194] uppercase">Localização</span>
              <span className="text-xs font-semibold text-white truncate">
                Cabine Principal • Jardins, São Paulo - SP
              </span>
            </div>
          </div>
        </div>

        {/* Moodboard & Estudos Artísticos Neutros (Linhas e Formas Elegantes) */}
        <div className="space-y-2 pt-1">
          <span className="text-[10px] font-semibold text-[#8f9194] uppercase tracking-wider block">
            Estudos de Composição Aprovados
          </span>
          <div className="grid grid-cols-3 gap-2">
            <div className="aspect-[4/5] rounded-xl bg-[#0e0e0f] border border-white/10 p-2 flex flex-col justify-between items-center text-center">
              <span className="material-symbols-outlined text-[#fabc4d] text-[24px] mt-2">gesture</span>
              <span className="text-[10px] text-[#c5c7c9] font-mono">Linha Fina</span>
            </div>
            <div className="aspect-[4/5] rounded-xl bg-[#0e0e0f] border border-white/10 p-2 flex flex-col justify-between items-center text-center">
              <span className="material-symbols-outlined text-[#fabc4d] text-[24px] mt-2">eco</span>
              <span className="text-[10px] text-[#c5c7c9] font-mono">Botânico</span>
            </div>
            <div className="aspect-[4/5] rounded-xl bg-[#0e0e0f] border border-white/10 p-2 flex flex-col justify-between items-center text-center">
              <span className="material-symbols-outlined text-[#fabc4d] text-[24px] mt-2">architecture</span>
              <span className="text-[10px] text-[#c5c7c9] font-mono">Anatomia</span>
            </div>
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="p-3.5 rounded-xl bg-[#141415] border border-white/5 flex items-center justify-between text-xs">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#8f9194] uppercase">Valor Total</span>
            <span className="font-mono text-white font-semibold text-sm">
              {formatCurrency(session.totalAmount)}
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-[#fabc4d] uppercase font-semibold">Sinal de Reserva</span>
            <span className="font-mono text-[#fabc4d] font-bold text-sm">
              {formatCurrency(session.depositAmount)}
            </span>
          </div>
        </div>
      </section>

      {/* Formulário de Identificação do Cliente */}
      <form onSubmit={handleSubmit} className="bg-[#1c1b1c] rounded-2xl p-5 border border-white/5 space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#fabc4d] uppercase tracking-wider block">
            Confirmação de Dados Pessoais
          </span>
          <p className="text-xs text-[#8f9194]">
            Confira seus dados antes de prosseguir para a ficha médica e assinatura do termo.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#e5e2e3] uppercase tracking-wider">
            Nome Completo
          </label>
          <input
            type="text"
            required
            maxLength={50}
            value={name}
            onChange={handleNameChange}
            className="w-full h-12 bg-[#0e0e0f] text-white px-4 rounded-xl border border-white/10 focus:border-[#fabc4d] text-sm focus:outline-none"
          />
        </div>

        {/* WhatsApp 3 colunas: DDI, DDD e Número */}
        <WhatsAppInputGroup
          id="whatsapp-input-group"
          label="WhatsApp"
          required
          value={phone}
          variant="plain"
          onChange={(formatted) => setPhone(formatted)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#e5e2e3] uppercase tracking-wider">
              CPF
            </label>
            <input
              type="text"
              required
              value={cpf}
              onChange={handleCpfChange}
              placeholder="000.000.000-00"
              className="w-full h-12 bg-[#0e0e0f] text-white px-4 rounded-xl border border-white/10 focus:border-[#fabc4d] text-sm focus:outline-none font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#e5e2e3] uppercase tracking-wider">
              Data de Nascimento
            </label>
            <input
              type="text"
              required
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              placeholder="DD/MM/AAAA"
              className="w-full h-12 bg-[#0e0e0f] text-white px-4 rounded-xl border border-white/10 focus:border-[#fabc4d] text-sm focus:outline-none font-mono"
            />
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          loading={isValidating}
          icon="arrow_forward"
          iconPosition="right"
          className="w-full mt-2"
          type="submit"
        >
          Confirmar e Ir para Anamnese
        </Button>
      </form>
    </div>
  );
};
