import React, { useState } from 'react';
import { Session } from '../../types/index.ts';
import { generateSHA256Mock } from '../../utils/storage.ts';
import { formatCurrency, getNextBusinessDay, formatPtBrDate } from '../../utils/formatters.ts';
import { CurrencyInput } from '../../design-system/CurrencyInput.tsx';
import { CustomDatePicker } from '../../design-system/CustomDatePicker.tsx';
import { CustomTimePicker } from '../../design-system/CustomTimePicker.tsx';
import { Button } from '../../design-system/Button.tsx';
import { motion, AnimatePresence } from 'motion/react';

import { WhatsAppInputGroup, CountryCode, DEFAULT_COUNTRIES } from '../../design-system/WhatsAppInputGroup.tsx';

interface NewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionCreated: (session: Session) => void;
  onOpenClientFlowPreview?: (session: Session) => void;
  studioName?: string;
}

export const NewSessionModal: React.FC<NewSessionModalProps> = ({
  isOpen,
  onClose,
  onSessionCreated,
  onOpenClientFlowPreview,
  studioName = 'Atelier Jardins',
}) => {
  // Próximo dia útil futuro por padrão
  const nextBizDay = getNextBusinessDay();

  // Stepper State: 1 = Cliente, 2 = Sessão, 3 = Sinal
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [clientName, setClientName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(DEFAULT_COUNTRIES[0]);
  const [clientPhone, setClientPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const [project, setProject] = useState('');
  const [date, setDate] = useState(nextBizDay.dateIso);
  const [time, setTime] = useState('14:00');
  const [duration, setDuration] = useState('4h 00m');

  const [totalAmount, setTotalAmount] = useState(1500);
  const [depositPercent, setDepositPercent] = useState(20);
  const [depositAmount, setDepositAmount] = useState(300);

  // Success view state
  const [generatedSession, setGeneratedSession] = useState<Session | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientName(e.target.value.slice(0, 50));
  };

  const handleTotalAmountChange = (newTotal: number) => {
    setTotalAmount(newTotal);
    const calculatedDeposit = Math.round(newTotal * (depositPercent / 100));
    setDepositAmount(calculatedDeposit);
  };

  const handlePercentSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pct = Number(e.target.value);
    setDepositPercent(pct);
    const calculated = Math.round(totalAmount * (pct / 100));
    setDepositAmount(calculated);
  };

  const validateStep1 = () => {
    if (!clientName.trim()) {
      return false;
    }
    if (selectedCountry.code === 'BR') {
      const digits = clientPhone.replace(/\D/g, '');
      if (digits.length !== 11) {
        setPhoneError('Informe o DDD (2 dígitos) e o celular de 9 dígitos (ex: (11) 98765-4321).');
        return false;
      }
      if (digits[2] !== '9') {
        setPhoneError('O número de celular brasileiro deve conter o dígito 9 após o DDD.');
        return false;
      }
    } else if (clientPhone.replace(/\D/g, '').length < 7) {
      setPhoneError('Informe um número de telefone válido.');
      return false;
    }
    setPhoneError(null);
    return true;
  };

  const validateStep2 = () => {
    return Boolean(project.trim() && date && time);
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  const resetForm = () => {
    setStep(1);
    setClientName('');
    setClientPhone('');
    setPhoneError(null);
    setProject('');
    setDate(nextBizDay.dateIso);
    setTime('14:00');
    setTotalAmount(1500);
    setDepositPercent(20);
    setDepositAmount(300);
    setGeneratedSession(null);
    setCopiedLink(false);
  };

  const handleModalClose = () => {
    resetForm();
    onClose();
  };

  const handleGenerateSession = () => {
    const token = `tk_${Math.random().toString(36).substring(2, 10)}`;
    const sha = generateSHA256Mock(clientName + Date.now());
    const fullPhone = `${selectedCountry.dialCode} ${clientPhone}`;

    const formattedDateString = formatPtBrDate(date, time);

    const newSession: Session = {
      id: `ses-${Date.now()}`,
      token,
      clientName: clientName.trim(),
      clientPhone: fullPhone,
      clientCpf: '000.000.000-00',
      clientBirthdate: '01/01/1998',
      project: project.trim(),
      dateStr: formattedDateString,
      timeStr: time,
      duration,
      totalAmount: Number(totalAmount),
      depositAmount: Number(depositAmount),
      status: 'pix_pendente',
      artistName: 'Kaelen Vance',
      artistRole: 'Tatuador Responsável',
      shaHash: sha,
      tag: 'Novo Gerado',
    };

    onSessionCreated(newSession);
    setGeneratedSession(newSession);
  };

  const handleCopyLink = () => {
    if (!generatedSession) return;
    const link = `https://marcado.me/s/${generatedSession.token}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleWhatsAppSend = () => {
    if (!generatedSession) return;
    const cleanDigits = generatedSession.clientPhone.replace(/\D/g, '');
    const link = `https://marcado.me/s/${generatedSession.token}`;
    const text = encodeURIComponent(
      `Olá ${generatedSession.clientName}! Aqui é do ${studioName} (Kaelen Vance).\n\nSua sessão para "${generatedSession.project}" foi reservada. Acesse o link seguro abaixo para conferir os dados, preencher a anamnese digital e garantir sua vaga com o sinal Pix de ${formatCurrency(
        generatedSession.depositAmount
      )}:\n\n${link}`
    );
    window.open(`https://api.whatsapp.com/send?phone=${cleanDigits}&text=${text}`, '_blank');
  };

  const restanteAmount = Math.max(0, totalAmount - depositAmount);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
      <div className="bg-[#1c1b1c] w-full max-w-2xl rounded-t-3xl sm:rounded-2xl shadow-2xl relative border-t sm:border border-white/10 my-0 sm:my-auto flex flex-col h-[95vh] sm:h-auto sm:max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 sm:px-8 sm:py-6 border-b border-white/10 bg-[#1c1b1c] shrink-0 flex items-start justify-between">
          <div className="flex flex-col gap-1 min-w-0 pr-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#fabc4d]" />
              <span className="text-[10px] font-bold text-[#fabc4d] uppercase tracking-[0.2em]">
                Marcado! • Nova Reserva
              </span>
            </div>
            <h2 className="font-headline text-xl sm:text-2xl md:text-3xl text-white font-medium leading-tight">
              {generatedSession ? 'Link Seguro Gerado com Sucesso' : 'Gerar Link Seguro para Cliente'}
            </h2>
            <p className="text-xs text-[#8f9194] leading-relaxed">
              {generatedSession
                ? 'Compartilhe com o cliente via WhatsApp para preenchimento de termo e sinal Pix.'
                : 'Processo guiado em 3 etapas com cálculo automático e link exclusivo.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleModalClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#2a2a2b] hover:bg-[#353436] flex items-center justify-center text-[#8f9194] hover:text-white transition-colors shrink-0 cursor-pointer"
            title="Fechar"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Success View */}
        {generatedSession ? (
          <div className="px-6 py-7 sm:px-8 sm:py-8 overflow-y-auto space-y-6">
            <div className="p-6 rounded-2xl bg-[#141415] border border-[#fabc4d]/30 flex flex-col gap-5 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#fabc4d]/15 border border-[#fabc4d]/30 flex items-center justify-center text-[#fabc4d] shrink-0">
                  <span className="material-symbols-outlined text-[28px]">check_circle</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#fabc4d] uppercase tracking-wider">
                    Link Exclusivo Ativo
                  </span>
                  <span className="text-lg font-semibold text-white">{generatedSession.clientName}</span>
                  <span className="text-xs text-[#8f9194] font-mono">
                    {generatedSession.clientPhone} • {generatedSession.project}
                  </span>
                </div>
              </div>

              {/* Expire in 24h badge in highlight */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#201f20] border border-white/5 text-xs">
                <span className="flex items-center gap-2 text-white font-medium">
                  <span className="material-symbols-outlined text-[18px] text-[#fabc4d]">timer</span>
                  <span>Validade da Reserva</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#fabc4d]/20 text-[#fabc4d] font-mono text-[11px] font-bold border border-[#fabc4d]/30">
                  Expira em 24h
                </span>
              </div>

              {/* Copy link box with morph */}
              <div className="flex items-center gap-2 p-3.5 bg-[#0e0e0f] rounded-xl border border-white/10 font-mono text-xs text-[#fabc4d]">
                <span className="material-symbols-outlined text-[18px] text-[#8f9194] shrink-0">link</span>
                <span className="truncate flex-1 select-all font-mono">
                  https://marcado.me/s/{generatedSession.token}
                </span>
                <Button
                  variant={copiedLink ? 'primary' : 'secondary'}
                  size="sm"
                  icon={copiedLink ? 'done' : 'content_copy'}
                  onClick={handleCopyLink}
                >
                  {copiedLink ? 'Copiado!' : 'Copiar'}
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleWhatsAppSend}
                  className="py-3 px-4 rounded-xl bg-[#25d366]/20 hover:bg-[#25d366]/30 border border-[#25d366]/40 text-[#25d366] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  <span>Enviar no WhatsApp</span>
                </button>

                {onOpenClientFlowPreview && (
                  <Button
                    variant="primary"
                    size="md"
                    icon="smartphone"
                    onClick={() => {
                      onOpenClientFlowPreview(generatedSession);
                      handleModalClose();
                    }}
                  >
                    Testar Fluxo do Cliente
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <Button variant="outline" size="sm" onClick={resetForm}>
                + Gerar Outro Agendamento
              </Button>
              <Button variant="secondary" size="sm" onClick={handleModalClose}>
                Concluir e Fechar
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Stepper Navigation (3 Passos) */}
            <div className="px-4 sm:px-8 py-3.5 sm:py-4 border-b border-white/5 bg-[#141415] flex items-center justify-between shrink-0">
              {/* Step 1: Cliente */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors shrink-0 ${
                    step === 1
                      ? 'bg-[#fabc4d] text-[#281900]'
                      : step > 1
                      ? 'bg-[#2a2a2b] text-[#fabc4d]'
                      : 'bg-[#201f20] text-[#8f9194]'
                  }`}
                >
                  {step > 1 ? '✓' : '1'}
                </div>
                <div className="flex flex-col min-w-0">
                  <span
                    className={`text-xs font-bold tracking-wider uppercase leading-none truncate ${
                      step === 1 ? 'text-[#fabc4d]' : 'text-[#8f9194]'
                    }`}
                  >
                    Cliente
                  </span>
                  <span className="text-[10px] text-[#8f9194] hidden xs:block truncate">Identificação</span>
                </div>
              </div>

              <div className="w-4 sm:w-8 h-0.5 bg-white/10 mx-1 sm:mx-2 shrink-0" />

              {/* Step 2: Sessão */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors shrink-0 ${
                    step === 2
                      ? 'bg-[#fabc4d] text-[#281900]'
                      : step > 2
                      ? 'bg-[#2a2a2b] text-[#fabc4d]'
                      : 'bg-[#201f20] text-[#8f9194]'
                  }`}
                >
                  {step > 2 ? '✓' : '2'}
                </div>
                <div className="flex flex-col min-w-0">
                  <span
                    className={`text-xs font-bold tracking-wider uppercase leading-none truncate ${
                      step === 2 ? 'text-[#fabc4d]' : 'text-[#8f9194]'
                    }`}
                  >
                    Sessão
                  </span>
                  <span className="text-[10px] text-[#8f9194] hidden xs:block truncate">Data & Arte</span>
                </div>
              </div>

              <div className="w-4 sm:w-8 h-0.5 bg-white/10 mx-1 sm:mx-2 shrink-0" />

              {/* Step 3: Sinal */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-end">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors shrink-0 ${
                    step === 3 ? 'bg-[#fabc4d] text-[#281900]' : 'bg-[#201f20] text-[#8f9194]'
                  }`}
                >
                  3
                </div>
                <div className="flex flex-col text-right min-w-0">
                  <span
                    className={`text-xs font-bold tracking-wider uppercase leading-none truncate ${
                      step === 3 ? 'text-[#fabc4d]' : 'text-[#8f9194]'
                    }`}
                  >
                    Sinal Pix
                  </span>
                  <span className="text-[10px] text-[#8f9194] hidden xs:block truncate">Valores</span>
                </div>
              </div>
            </div>

            {/* Stepper Content Body */}
            <div className="px-4 py-5 sm:px-8 sm:py-7 overflow-y-auto space-y-6 flex-1">
              <AnimatePresence mode="wait">
                {/* STEP 1: CLIENTE */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Nome Completo com limite 50 chars */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#e5e2e3] uppercase tracking-wider flex items-center gap-1.5">
                          <span>Nome Completo do Cliente</span>
                          <span className="text-[#fabc4d]">*</span>
                        </label>
                        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-[#201f20] text-[#8f9194] border border-white/5">
                          {clientName.length} / 50 caracteres
                        </span>
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={50}
                        value={clientName}
                        onChange={handleNameChange}
                        placeholder="Ex: Clara Ribeiro de Mendonça"
                        className="w-full h-12 bg-[#0e0e0f] text-white px-4 rounded-xl border border-white/10 focus:outline-none focus:border-[#fabc4d] text-sm placeholder-[#8f9194]/40 transition-colors shadow-inner"
                      />
                      <span className="text-[11px] text-[#8f9194] block pl-0.5">
                        Utilizado para gerar o contrato digital de consentimento e a assinatura SHA-256.
                      </span>
                    </div>

                    {/* WhatsApp com Seletor DDI, DDD e Número em 3 Colunas com Máscara Automática */}
                    <WhatsAppInputGroup
                      id="whatsapp-input-group"
                      label="WhatsApp do Cliente"
                      required
                      value={clientPhone}
                      selectedCountry={selectedCountry}
                      onCountryChange={(c) => {
                        setSelectedCountry(c);
                        setClientPhone('');
                        setPhoneError(null);
                      }}
                      onChange={(formatted) => {
                        setPhoneError(null);
                        setClientPhone(formatted);
                      }}
                      error={phoneError}
                    />
                  </motion.div>
                )}

                {/* STEP 2: SESSÃO */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Projeto */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#e5e2e3] uppercase tracking-wider flex items-center gap-1.5">
                        <span>Descrição do Projeto & Local do Corpo</span>
                        <span className="text-[#fabc4d]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={120}
                        value={project}
                        onChange={(e) => setProject(e.target.value)}
                        placeholder="Ex: Fechamento Panturrilha — Realismo Botânico"
                        className="w-full h-12 bg-[#0e0e0f] text-white px-4 rounded-xl border border-white/10 focus:outline-none focus:border-[#fabc4d] text-sm placeholder-[#8f9194]/40 shadow-inner"
                      />
                    </div>

                    {/* Custom Date & Time Picker */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <CustomDatePicker
                        label="Data da Sessão (Próximo Dia Útil)"
                        value={date}
                        onChange={(val) => setDate(val)}
                      />

                      <CustomTimePicker
                        label="Horário de Início"
                        value={time}
                        onChange={(val) => setTime(val)}
                      />
                    </div>

                    {/* Duração Estimada */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#e5e2e3] uppercase tracking-wider">
                        Duração Estimada de Bancada
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {['2h 00m', '3h 30m', '4h 00m', '6h 00m'].map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setDuration(d)}
                            className={`py-2 px-3 rounded-xl text-xs font-mono transition-colors text-center cursor-pointer ${
                              duration === d
                                ? 'bg-[#fabc4d] text-[#281900] font-bold shadow'
                                : 'bg-[#0e0e0f] hover:bg-[#201f20] text-white border border-white/10'
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: SINAL PIX */}
                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Valor Total do Projeto */}
                    <CurrencyInput
                      label="Valor Total do Projeto (R$)"
                      value={totalAmount}
                      onChange={handleTotalAmountChange}
                      requiredAsterisk
                    />

                    {/* Slider de Porcentagem do Sinal */}
                    <div className="p-5 rounded-2xl bg-[#141415] border border-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#fabc4d] uppercase tracking-wider">
                          Porcentagem do Sinal de Reserva
                        </label>
                        <span className="text-sm font-mono font-bold text-[#fabc4d]">
                          {depositPercent}% ({formatCurrency(depositAmount)})
                        </span>
                      </div>

                      <input
                        type="range"
                        min="10"
                        max="50"
                        step="5"
                        value={depositPercent}
                        onChange={handlePercentSliderChange}
                        className="w-full h-2 bg-[#2a2a2b] rounded-lg appearance-none cursor-pointer accent-[#fabc4d]"
                      />

                      <div className="flex justify-between text-[10px] text-[#8f9194] font-mono">
                        <span>10% (R$ {Math.round(totalAmount * 0.1)})</span>
                        <span>20% (Padrão)</span>
                        <span>30%</span>
                        <span>50%</span>
                      </div>

                      {/* Saldo Restante Animado */}
                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                        <span className="text-[#8f9194]">
                          Saldo a acertar no ateliê no dia da sessão:
                        </span>
                        <span className="font-mono text-white font-bold text-sm tabular-nums">
                          {formatCurrency(restanteAmount)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Resumo Vivo Permanente no Rodapé */}
            <div className="px-4 py-3 sm:px-8 sm:py-3.5 bg-[#141415] border-t border-white/5 flex flex-wrap items-center justify-between gap-2.5 text-xs shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <span className="text-[#8f9194] hidden xs:inline">Resumo:</span>
                <span className="font-semibold text-white truncate max-w-[120px] sm:max-w-none">
                  {clientName || 'Cliente'}
                </span>
                <span className="text-[#8f9194]">•</span>
                <span className="font-mono text-white text-[11px] sm:text-xs">{formatPtBrDate(date, time)}</span>
              </div>
              <div className="flex items-center gap-2 font-mono ml-auto">
                <span className="text-[#8f9194]">Sinal:</span>
                <span className="text-[#fabc4d] font-bold">{formatCurrency(depositAmount)}</span>
              </div>
            </div>

            {/* Rodapé Fixo de Ações do Stepper */}
            <div className="px-4 py-3.5 sm:px-8 sm:py-5 border-t border-white/10 bg-[#1c1b1c] shrink-0 flex items-center justify-between gap-3">
              {step > 1 ? (
                <Button variant="outline" size="md" icon="arrow_back" onClick={handleBack}>
                  Voltar
                </Button>
              ) : (
                <Button variant="ghost" size="md" onClick={handleModalClose}>
                  Cancelar
                </Button>
              )}

              {step < 3 ? (
                <Button
                  variant="primary"
                  size="md"
                  icon="arrow_forward"
                  iconPosition="right"
                  onClick={handleNext}
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  icon="bolt"
                  onClick={handleGenerateSession}
                >
                  Gerar Link Seguro
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
