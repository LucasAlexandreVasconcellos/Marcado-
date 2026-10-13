import React, { useState } from 'react';
import { WebhookLog } from '../../types/index.ts';
import { motion } from 'framer-motion';
import {
  indicatorContainerVariants,
  indicatorCardVariants,
  EASE_OUT_EXPO,
} from '../../design-system/motionVariants.ts';

interface PixFinanceViewProps {
  logs: WebhookLog[];
  onTriggerSimulatedPayment: () => void;
  onShowToast: (msg: string) => void;
}

export const PixFinanceView: React.FC<PixFinanceViewProps> = ({
  logs,
  onTriggerSimulatedPayment,
  onShowToast,
}) => {
  const [activeProvider, setActiveProvider] = useState<'integrated' | 'manual'>('integrated');
  const [retentionPolicy, setRetentionPolicy] = useState(true);
  const [depositRule, setDepositRule] = useState<'percent' | 'fixed'>('percent');
  const [ttl, setTtl] = useState<'15m' | '30m' | '2h'>('30m');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simFeedback, setSimFeedback] = useState<string | null>(null);

  const handleSimulateWebhook = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimFeedback('Evento Mock disparado: ID #PIX-SIM-9921 recebido em 182ms');
      onTriggerSimulatedPayment();
      onShowToast('Webhook Pix simulado com sucesso (Status 200 OK)!');
      setTimeout(() => setSimFeedback(null), 4000);
    }, 1200);
  };

  const handleExportCnab = () => {
    onShowToast('Arquivo CNAB 240 / Extrato Pix exportado para conciliação.');
  };

  return (
    <div className="flex flex-col w-full relative">
      <div className="px-4 sm:px-8 lg:px-12 py-8 flex flex-col gap-8 max-w-[1600px] mx-auto w-full">
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div className="flex flex-col max-w-2xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fabc4d]"></span>
              <span className="text-[11px] font-semibold text-[#8f9194] uppercase tracking-widest">
                Recebimento Instantâneo
              </span>
              <span className="text-[#44474a] text-xs">•</span>
              <span className="text-xs font-semibold text-[#fabc4d] uppercase tracking-wider">
                Pix Direto na Conta
              </span>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl text-white font-medium tracking-tight">
              Sinais & Chaves Pix
            </h1>
            <p className="text-xs sm:text-sm text-[#c5c7c9] mt-1">
              Configure sua chave Pix, regras de porcentagem para retenção de sinal e conciliação automática para garantir cada vaga da agenda.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#1c1b1c] px-4 py-2.5 rounded-xl border border-white/5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#fabc4d] shadow-[0_0_8px_#fabc4d]"></span>
              <span className="text-xs font-semibold text-white uppercase tracking-wider">Pix Conectado</span>
            </div>
            <span className="text-[#44474a]">|</span>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#fabc4d]">verified</span>
              <span className="text-xs font-semibold text-[#fabc4d] uppercase tracking-wider">Liquidação Ativa</span>
            </div>
          </div>
        </div>

        {/* 4 Metric Cards Animados com Framer Motion (ease-out-expo) */}
        <motion.div
          variants={indicatorContainerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div
            variants={indicatorCardVariants}
            whileHover={{ y: -3, transition: { duration: 0.3, ease: EASE_OUT_EXPO } }}
            className="bg-[#1c1b1c] p-4 sm:p-5 rounded-xl flex flex-col justify-between border border-white/5 hover:border-white/15 transition-colors cursor-default"
          >
            <div className="flex items-center justify-between text-[#8f9194]">
              <span className="text-[10px] font-semibold uppercase tracking-wider">Tempo Médio de Confirmação</span>
              <span className="material-symbols-outlined text-[18px]">speed</span>
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-headline text-3xl text-white font-semibold">1.28</span>
              <span className="text-xs text-[#8f9194]">segundos</span>
            </div>
            <span className="text-[11px] text-[#fabc4d] mt-1 font-medium">99.8% conciliado via Push</span>
          </motion.div>

          <motion.div
            variants={indicatorCardVariants}
            whileHover={{ y: -3, transition: { duration: 0.3, ease: EASE_OUT_EXPO } }}
            className="bg-[#1c1b1c] p-4 sm:p-5 rounded-xl flex flex-col justify-between border border-white/5 hover:border-white/15 transition-colors cursor-default"
          >
            <div className="flex items-center justify-between text-[#8f9194]">
              <span className="text-[10px] font-semibold uppercase tracking-wider">Volume de Sinais Recebidos</span>
              <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-xs text-[#8f9194]">R$</span>
              <span className="font-headline text-3xl text-white font-semibold">48.250</span>
              <span className="text-xs text-[#8f9194]">,00</span>
            </div>
            <span className="text-[11px] text-[#c5c7c9] mt-1">64 sessões bloqueadas</span>
          </motion.div>

          <motion.div
            variants={indicatorCardVariants}
            whileHover={{ y: -3, transition: { duration: 0.3, ease: EASE_OUT_EXPO } }}
            className="bg-[#1c1b1c] p-4 sm:p-5 rounded-xl flex flex-col justify-between border border-white/5 hover:border-white/15 transition-colors cursor-default"
          >
            <div className="flex items-center justify-between text-[#8f9194]">
              <span className="text-[10px] font-semibold uppercase tracking-wider">Taxa de Conversão de QR</span>
              <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-headline text-3xl text-white font-semibold">94.6</span>
              <span className="text-xs text-[#8f9194]">%</span>
            </div>
            <span className="text-[11px] text-[#fabc4d] mt-1 font-medium">+3.1% pós-janela 15min</span>
          </motion.div>

          <motion.div
            variants={indicatorCardVariants}
            whileHover={{ y: -3, transition: { duration: 0.3, ease: EASE_OUT_EXPO } }}
            className="bg-[#1c1b1c] p-4 sm:p-5 rounded-xl flex flex-col justify-between border border-white/5 hover:border-white/15 transition-colors cursor-default"
          >
            <div className="flex items-center justify-between text-[#8f9194]">
              <span className="text-[10px] font-semibold uppercase tracking-wider">Segurança Antifraude</span>
              <span className="material-symbols-outlined text-[18px]">shield</span>
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-headline text-3xl text-white font-semibold">Zero</span>
              <span className="text-xs text-[#8f9194]">falso comprovante</span>
            </div>
            <span className="text-[11px] text-[#8f9194] mt-1">Chave EVP com token dinâmico</span>
          </motion.div>
        </motion.div>

        {/* Main Grid: Left Column Settings + Right Column Split & Webhook Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Modalidade de Conexão */}
            <div className="bg-[#1c1b1c] p-5 rounded-xl flex flex-col gap-4 border border-white/5">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#fabc4d] text-[22px]">hub</span>
                  <div>
                    <h2 className="font-headline text-lg text-white font-medium">Modalidade de Conexão</h2>
                    <span className="text-[10px] font-semibold uppercase text-[#8f9194] tracking-wider">
                      Arquitetura de processamento PIX
                    </span>
                  </div>
                </div>
                <span className="bg-[#201f20] px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase text-[#c5c7c9]">
                  Produção
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <label
                  onClick={() => setActiveProvider('integrated')}
                  className={`p-4 rounded-xl flex flex-col gap-2 cursor-pointer transition-all border ${
                    activeProvider === 'integrated'
                      ? 'bg-[#201f20] border-[#fabc4d]'
                      : 'bg-[#1c1b1c] border-white/5 hover:bg-[#201f20]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-[#fabc4d] text-[#281900] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">
                          Provedor Integrado com Automação (Asaas / Efí)
                        </span>
                        <span className="bg-[#fabc4d]/20 text-[#fabc4d] px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase">
                          Recomendado
                        </span>
                      </div>
                      <p className="text-xs text-[#8f9194] mt-1 leading-relaxed">
                        Emissão autônoma de QR Code dinâmico com payload individual por sessão. Conciliação 100% automatizada via Webhook mTLS, cancelando riscos de comprovantes adulterados.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#8f9194] pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[#fabc4d] text-[16px]">sync_alt</span> Split nativo
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[#fabc4d] text-[16px]">timer</span> Baixa em 2s
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[#fabc4d] text-[16px]">receipt_long</span> Recibo fiscal auto
                    </span>
                  </div>
                </label>

                <label
                  onClick={() => setActiveProvider('manual')}
                  className={`p-4 rounded-xl flex flex-col gap-2 cursor-pointer transition-all border ${
                    activeProvider === 'manual'
                      ? 'bg-[#201f20] border-[#fabc4d]'
                      : 'bg-[#1c1b1c] border-white/5 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-[#353436] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#8f9194]"></div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">
                          Chave Pix Direta (Manual / Banco Tradicional)
                        </span>
                        <span className="bg-[#2a2a2b] text-[#8f9194] px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase">
                          Legado
                        </span>
                      </div>
                      <p className="text-xs text-[#8f9194] mt-1 leading-relaxed">
                        QR Code estático com chave simples. Requer conferência manual do extrato bancário para confirmar cada sessão.
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Credenciais & DICT */}
            <div className="bg-[#1c1b1c] p-5 rounded-xl flex flex-col gap-4 border border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-headline text-lg text-white font-medium">
                    Credenciais & Roteamento de Depósito
                  </h2>
                  <span className="text-[10px] font-semibold uppercase text-[#8f9194] tracking-wider">
                    Identificação no Diretório de Identificadores (DICT)
                  </span>
                </div>
                <button
                  onClick={() => onShowToast('Chave EVP revalidada junto ao BACEN.')}
                  className="px-3 py-1.5 rounded-lg bg-[#2a2a2b] hover:bg-[#353436] text-white text-xs uppercase font-semibold tracking-wider transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                  Revalidar EVP
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold uppercase text-[#8f9194] tracking-wider">
                    Chave Pix Ativa para Recebimento
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-[#8f9194] text-[18px]">key</span>
                    <input
                      type="text"
                      readOnly
                      value="financeiro@ateliernoir.art.br"
                      className="w-full bg-[#201f20] pl-10 pr-3 py-2.5 rounded-lg text-white font-mono text-xs border border-white/5 select-all"
                    />
                  </div>
                  <span className="text-[11px] text-[#8f9194]">Chave vinculada para retenção caução de agenda.</span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold uppercase text-[#8f9194] tracking-wider">
                    Chave Aleatória Primária (EVP DICT)
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-[#8f9194] text-[18px]">
                      fingerprint
                    </span>
                    <input
                      type="text"
                      readOnly
                      value="8f4b7a12-c901-443b-871d-720912a550fa"
                      className="w-full bg-[#201f20] pl-10 pr-3 py-2.5 rounded-lg text-white font-mono text-xs border border-white/5 truncate select-all"
                    />
                  </div>
                  <span className="text-[11px] text-[#8f9194]">Utilizada no payload assinado do QR Code dinâmico.</span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold uppercase text-[#8f9194] tracking-wider">
                    Titular da Conta / Razão Social
                  </label>
                  <div className="bg-[#201f20] px-3.5 py-2.5 rounded-lg flex flex-col justify-center border border-white/5">
                    <span className="text-xs font-semibold text-white">Atelier Noir Studio Ltda</span>
                    <span className="text-[11px] font-mono text-[#8f9194]">CNPJ: 48.912.842/0001-90</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold uppercase text-[#8f9194] tracking-wider">
                    Instituição Liquidante & ISPB
                  </label>
                  <div className="bg-[#201f20] px-3.5 py-2.5 rounded-lg flex items-center justify-between border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white">Asaas IP S.A. / Banco Inter</span>
                      <span className="text-[11px] font-mono text-[#8f9194]">ISPB: 27865757 • Ag. 0001 C/C 49102-1</span>
                    </div>
                    <span className="material-symbols-outlined text-[#8f9194] text-[20px]">account_balance</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Regras de Sinal & Política de Expiração */}
            <div className="bg-[#1c1b1c] p-5 rounded-xl flex flex-col gap-4 border border-white/5">
              <div>
                <h2 className="font-headline text-lg text-white font-medium">
                  Regras de Sinal & Política de Expiração
                </h2>
                <span className="text-[10px] font-semibold uppercase text-[#8f9194] tracking-wider">
                  Condições de congelamento da data no calendário
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-[#8f9194] uppercase font-semibold">Regra de Sinal Padrão</label>
                  <div className="grid grid-cols-2 gap-1 bg-[#201f20] p-1 rounded-lg border border-white/5">
                    <button
                      onClick={() => setDepositRule('percent')}
                      className={`py-1.5 rounded text-xs font-semibold uppercase transition-all ${
                        depositRule === 'percent'
                          ? 'bg-[#2a2a2b] text-white shadow-sm'
                          : 'text-[#8f9194] hover:text-white'
                      }`}
                    >
                      Percentual (30%)
                    </button>
                    <button
                      onClick={() => setDepositRule('fixed')}
                      className={`py-1.5 rounded text-xs font-semibold uppercase transition-all ${
                        depositRule === 'fixed'
                          ? 'bg-[#2a2a2b] text-white shadow-sm'
                          : 'text-[#8f9194] hover:text-white'
                      }`}
                    >
                      Fixo (R$ 350,00)
                    </button>
                  </div>
                  <span className="text-[11px] text-[#8f9194]">
                    Sugerido para sessões autorais acima de 4 horas: 30% a 50%
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-[#8f9194] uppercase font-semibold">
                    Tempo de Expiração do QR Code
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-[#201f20] p-1 rounded-lg border border-white/5">
                    {(['15m', '30m', '2h'] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setTtl(opt)}
                        className={`py-1.5 rounded text-xs font-semibold uppercase transition-all ${
                          ttl === opt ? 'bg-[#fabc4d] text-[#281900] shadow-sm' : 'text-[#8f9194] hover:text-white'
                        }`}
                      >
                        {opt === '15m' ? '15 min' : opt === '30m' ? '30 min' : '2 horas'}
                      </button>
                    ))}
                  </div>
                  <span className="text-[11px] text-[#8f9194]">
                    Liberação imediata do slot de horário se o Pix não for pago.
                  </span>
                </div>
              </div>

              {/* Toggle de Política de Cancelamento */}
              <div className="bg-[#201f20] p-4 rounded-lg flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2a2a2b] flex items-center justify-center text-[#fabc4d]">
                    <span className="material-symbols-outlined text-[18px]">policy</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">Política de Retenção de Cancelamento</span>
                    <span className="text-xs text-[#8f9194]">
                      Retenção integral (100%) do sinal caução em desistências com menos de 48h.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRetentionPolicy(!retentionPolicy)}
                  className={`w-11 h-6 rounded-full flex items-center p-0.5 transition-colors ${
                    retentionPolicy ? 'bg-[#fabc4d]' : 'bg-[#353436]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-[#131314] shadow-md transform transition-transform ${
                      retentionPolicy ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Split & Webhook Simulator (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Split Visualizer */}
            <div className="bg-[#1c1b1c] p-5 rounded-xl flex flex-col gap-4 border border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#fabc4d] text-[20px]">call_split</span>
                  <div>
                    <h2 className="font-headline text-lg text-white font-medium">Split Automatizado</h2>
                    <span className="text-[10px] font-semibold uppercase text-[#8f9194] tracking-wider">
                      Rateio Conta-Mãe & Artistas
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#8f9194] text-[18px]">tune</span>
              </div>

              <p className="text-xs text-[#c5c7c9] leading-relaxed">
                No instante da compensação, o gateway retém a taxa operacional de insumos e estúdio e liquida a subconta bancária do residente cadastrado.
              </p>

              <div className="bg-[#201f20] p-4 rounded-lg flex flex-col gap-3 border border-white/5">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
                  <span className="text-[#fabc4d]">Estúdio Noir (40%)</span>
                  <span className="text-white">Tatuador Residente (60%)</span>
                </div>
                <div className="w-full h-3 bg-[#353436] rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#fabc4d] w-2/5 transition-all"></div>
                  <div className="h-full bg-white w-3/5 transition-all"></div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-semibold text-[#8f9194]">Retenção de Atelier</span>
                    <span className="font-headline text-xl text-[#fabc4d] font-semibold">R$ 140,00</span>
                    <span className="text-[10px] text-[#8f9194] mt-0.5">Custos de bancada e insumos</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] uppercase font-semibold text-[#8f9194]">Liquidação Artista</span>
                    <span className="font-headline text-xl text-white font-semibold">R$ 210,00</span>
                    <span className="text-[10px] text-[#8f9194] mt-0.5">Direto na chave do residente</span>
                  </div>
                </div>
              </div>

              {/* Subcontas */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-semibold uppercase text-[#8f9194] tracking-wider">
                  Subcontas Habilitadas no Split
                </span>
                <div className="flex items-center justify-between p-3 bg-[#201f20] rounded-lg border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#2a2a2b] flex items-center justify-center text-xs font-semibold text-white">
                      KV
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white">Kaelen Vance</span>
                      <span className="text-[10px] text-[#8f9194]">Chave Celular • Banco Inter</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-[#fabc4d]">70 / 30</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#201f20] rounded-lg border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#2a2a2b] flex items-center justify-center text-xs font-semibold text-white">
                      MS
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white">Megan Steiner</span>
                      <span className="text-[10px] text-[#8f9194]">Chave CPF • C6 Bank</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-[#fabc4d]">60 / 40</span>
                </div>
              </div>
            </div>

            {/* Testes de Webhook */}
            <div className="bg-[#1c1b1c] p-5 rounded-xl flex flex-col gap-4 border border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-headline text-lg text-white font-medium">Testes de Webhook</h2>
                  <span className="text-[10px] font-semibold uppercase text-[#8f9194] tracking-wider">
                    Ambiente Sandbox & Validação mTLS
                  </span>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#fabc4d]"></span>
              </div>

              <p className="text-xs text-[#c5c7c9] leading-relaxed">
                Dispare um evento simulado de compensação do Banco Central para checar se seu servidor de agendamentos está alterando o status da sessão em menos de 2 segundos.
              </p>

              <button
                onClick={handleSimulateWebhook}
                disabled={isSimulating}
                className="w-full bg-[#fabc4d] hover:bg-[#bd8718] text-[#281900] hover:text-white px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow"
              >
                {isSimulating ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                    <span>Disparando Payload para o Webhook...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">play_circle</span>
                    <span>Simular Pagamento de Teste (Sandbox R$ 1,00)</span>
                  </>
                )}
              </button>

              {simFeedback && (
                <div className="p-3 rounded-lg bg-[#201f20] text-[#fabc4d] text-xs flex items-center justify-between border border-[#fabc4d]/30">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>{simFeedback}</span>
                  </div>
                  <span className="font-mono text-[11px]">182ms</span>
                </div>
              )}

              <div className="bg-[#0e0e0f] p-3 rounded-lg flex flex-col gap-1 text-[11px] font-mono border border-white/5">
                <div className="flex items-center justify-between text-[#8f9194]">
                  <span>ENDPOINT RECEPTOR</span>
                  <span className="text-[#fabc4d]">TLS 1.3 AES-256</span>
                </div>
                <span className="text-white truncate">https://api.marcado.me/v1/hooks/pix/callback</span>
                <div className="flex items-center justify-between text-[#8f9194] pt-1 border-t border-white/5">
                  <span>SECRET SIGNATURE KEY</span>
                  <span className="text-[#fabc4d]">sec_live_99a84...d29e</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-[#1c1b1c] p-5 rounded-xl flex flex-col gap-4 border border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#fabc4d] text-[22px]">history_edu</span>
              <div>
                <h2 className="font-headline text-lg text-white font-medium">
                  Trilha de Notificações Pix & Webhooks
                </h2>
                <span className="text-[10px] font-semibold uppercase text-[#8f9194] tracking-wider">
                  Últimos eventos recebidos e conciliados pelo listener do atelier
                </span>
              </div>
            </div>
            <button
              onClick={handleExportCnab}
              className="text-white hover:text-[#fabc4d] text-xs uppercase font-semibold flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Exportar Arquivo CNAB 240 / Extrato</span>
              <span className="material-symbols-outlined text-[16px]">download</span>
            </button>
          </div>

          {/* Mobile Card List (< sm) */}
          <div className="flex flex-col gap-2.5 sm:hidden">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-[#201f20] border border-white/5 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-white text-xs truncate">
                      {log.sessionTitle}
                    </span>
                    <span className="text-[10px] text-[#8f9194] truncate">
                      {log.clientInfo}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#fabc4d] font-mono shrink-0">
                    R$ {log.amount.toLocaleString('pt-BR')},00
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-white/5 text-[#8f9194]">
                  <span className="font-mono">{log.e2eId}</span>
                  <span className="inline-flex items-center gap-1 bg-[#fabc4d]/15 text-[#fabc4d] px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase">
                    <span className="material-symbols-outlined text-[11px]">done_all</span>
                    {log.statusText}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop / Tablet Table (sm+) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#201f20] text-[#8f9194] font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">ID Transação / E2E</th>
                  <th className="py-2.5 px-3">Valor Caução</th>
                  <th className="py-2.5 px-3">Status & Latência</th>
                  <th className="py-2.5 px-3">Sessão Vinculada</th>
                  <th className="py-2.5 px-3">Hash SHA-256</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[#c5c7c9]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#201f20] transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="font-mono text-white">{log.e2eId}</span>
                        <span className="text-[10px] text-[#8f9194]">{log.timestamp}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">
                      R$ {log.amount.toLocaleString('pt-BR')},00
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 bg-[#fabc4d]/15 text-[#fabc4d] px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
                        <span className="material-symbols-outlined text-[12px]">done_all</span>
                        {log.statusText} EM {log.latency}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="text-white">{log.sessionTitle}</span>
                        <span className="text-[10px] text-[#8f9194]">{log.clientInfo}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-[#8f9194]">
                      {log.hash}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
