import React, { useState } from 'react';
import { Session } from '../../types/index.ts';
import { formatCurrency, getAvatarColor, getInitials } from '../../utils/formatters.ts';
import { Badge } from '../../design-system/Badge.tsx';
import { Tabs } from '../../design-system/Tabs.tsx';
import { EmptyState } from '../../design-system/EmptyState.tsx';
import { motion, AnimatePresence } from 'motion/react';

interface AgendaViewProps {
  sessions: Session[];
  onOpenNewSession: () => void;
  onViewLegalHash: (session: Session) => void;
  onOpenClientFlow: (session: Session, step?: number) => void;
  onShowToast: (msg: string) => void;
  isDemoMode?: boolean;
  studioName?: string;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  sessions,
  onOpenNewSession,
  onViewLegalHash,
  onOpenClientFlow,
  onShowToast,
  isDemoMode = false,
  studioName = 'Atelier Jardins',
}) => {
  const [filter, setFilter] = useState<'all' | 'confirmada' | 'pix_pendente' | 'termo_pendente'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedBioLink, setCopiedBioLink] = useState(false);
  const [simulatorStep, setSimulatorStep] = useState(1);

  const copyToClipboard = (text: string, msg: string) => {
    navigator.clipboard.writeText(text);
    onShowToast(msg);
  };

  const handleCopyBio = () => {
    const link = 'https://marcado.me/kaelen-atelier';
    navigator.clipboard.writeText(link);
    setCopiedBioLink(true);
    onShowToast('Link da bio copiado!');
    setTimeout(() => setCopiedBioLink(false), 2500);
  };

  // Filtragem
  const filteredSessions = sessions.filter((s) => {
    const matchesFilter = filter === 'all' || s.status === filter;
    const matchesSearch =
      s.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.clientPhone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const countAll = sessions.length;
  const countConfirmed = sessions.filter((s) => s.status === 'confirmada').length;
  const countPix = sessions.filter((s) => s.status === 'pix_pendente').length;
  const countAnamnese = sessions.filter((s) => s.status === 'termo_pendente').length;

  // Total de sinais recebidos calculados
  const totalSinaisRecebidos = sessions
    .filter((s) => s.status === 'confirmada')
    .reduce((acc, s) => acc + s.depositAmount, 0);

  const tabsData = [
    { id: 'all', label: 'Todas as Sessões', count: countAll },
    { id: 'confirmada', label: 'Confirmadas', count: countConfirmed, badgeDot: 'bg-[#fabc4d]' },
    { id: 'pix_pendente', label: 'Aguardando Sinal', count: countPix, badgeDot: 'bg-[#8f9194]' },
    { id: 'termo_pendente', label: 'Anamnese Pendente', count: countAnamnese, badgeDot: 'bg-[#ffb4ab]' },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Header & Bio Link Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#fabc4d]" />
            <span className="text-[10px] font-bold text-[#fabc4d] uppercase tracking-[0.2em]">
              Gestão de Ateliê • {studioName}
            </span>
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl lg:text-4xl text-white font-medium tracking-tight">
            Agenda de Sessões
          </h1>
          <p className="text-xs text-[#8f9194]">
            Controle de reservas, retenção de sinal Pix em tempo real e termos com fé pública.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          {/* Card compacto do link da bio com cópia animada */}
          <button
            type="button"
            onClick={handleCopyBio}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#1c1b1c] hover:bg-[#201f20] border border-white/10 text-white flex items-center justify-center gap-2.5 transition-all text-xs font-semibold tracking-wider cursor-pointer shadow-sm select-none"
            title="Copiar link seguro da bio para clientes"
          >
            <span className="material-symbols-outlined text-[18px] text-[#fabc4d]">link</span>
            <span className="font-mono text-xs">marcado.me/kaelen</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-md font-mono transition-colors ${
                copiedBioLink ? 'bg-[#fabc4d] text-[#281900] font-bold' : 'bg-[#2a2a2b] text-[#8f9194]'
              }`}
            >
              {copiedBioLink ? 'Copiado!' : 'Copiar'}
            </span>
          </button>

          {/* Botão Primário Âmbar */}
          <button
            type="button"
            onClick={onOpenNewSession}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#fabc4d] hover:bg-[#e0a438] active:bg-[#bd8718] text-[#281900] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_4px_16px_rgba(250,188,77,0.22)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Nova Sessão</span>
          </button>
        </div>
      </div>

      {/* Section 2: Quatro Indicadores Bento com Hierarquia */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Presença nas Sessões (Destaque Maior) */}
        <div className="p-5 sm:p-6 bg-[#1c1b1c] rounded-2xl border border-white/10 hover:border-[#fabc4d]/30 transition-all flex flex-col justify-between gap-4 shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#fabc4d]/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-[#fabc4d] uppercase tracking-wider">
                Destaque do Mês
              </span>
              <span className="text-xs font-semibold text-white">Presença nas Sessões</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#fabc4d]/15 flex items-center justify-center text-[#fabc4d]">
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-3xl sm:text-4xl font-semibold text-white tracking-tight tabular-nums">
              94.2%
            </span>
            <span className="text-xs text-[#fabc4d] font-semibold flex items-center">
              <span className="material-symbols-outlined text-[16px]">trending_up</span> +82%
            </span>
          </div>
          <div className="w-full bg-[#2a2a2b] h-1.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '94.2%' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#fabc4d] h-full rounded-full"
            />
          </div>
          <span className="text-[11px] text-[#8f9194] leading-tight">
            Quase zero faltas após a exigência do sinal via Pix
          </span>
        </div>

        {/* KPI 2: Sinais Recebidos */}
        <div className="p-5 sm:p-6 bg-[#1c1b1c] rounded-2xl border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between gap-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold text-[#8f9194] uppercase tracking-wider">
                Financeiro
              </span>
              <span className="text-xs font-semibold text-white">Sinais Recebidos</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#201f20] flex items-center justify-center text-[#fabc4d]">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-headline text-3xl font-semibold text-white tracking-tight tabular-nums">
              {formatCurrency(totalSinaisRecebidos || 4850)}
            </span>
          </div>
          <div className="w-full bg-[#2a2a2b] h-1.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '78%' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white h-full rounded-full"
            />
          </div>
          <span className="text-[11px] text-[#8f9194]">
            {countConfirmed} sinais recebidos e confirmados
          </span>
        </div>

        {/* KPI 3: Capacidade Semanal */}
        <div className="p-5 sm:p-6 bg-[#1c1b1c] rounded-2xl border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between gap-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold text-[#8f9194] uppercase tracking-wider">
                Ocupação
              </span>
              <span className="text-xs font-semibold text-white">Capacidade Semanal</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#201f20] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[18px]">calendar_view_week</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-3xl font-semibold text-white tracking-tight tabular-nums">
              {countAll} <span className="text-base text-[#8f9194] font-normal">sessões</span>
            </span>
          </div>
          {/* Status Breakdown Pills */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8f9194] truncate">
            <span className="text-[#fabc4d]">{countConfirmed} confirmadas</span>
            <span>•</span>
            <span className="text-[#8f9194]">{countPix} pendentes</span>
          </div>
          <span className="text-[11px] text-[#8f9194]">
            32 horas estimadas de bancada
          </span>
        </div>

        {/* KPI 4: Termos Assinados */}
        <div className="p-5 sm:p-6 bg-[#1c1b1c] rounded-2xl border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between gap-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold text-[#8f9194] uppercase tracking-wider">
                Conformidade
              </span>
              <span className="text-xs font-semibold text-white">Termos Assinados</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#201f20] flex items-center justify-center text-[#fabc4d]">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-3xl font-semibold text-white tracking-tight tabular-nums">
              100%
            </span>
            <span className="text-xs text-[#8f9194] font-medium">Assinados</span>
          </div>
          <div className="w-full bg-[#2a2a2b] h-1.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#fabc4d] h-full rounded-full"
            />
          </div>
          <span className="text-[11px] text-[#8f9194]">
            Anamnese digital com assinatura e carimbo SHA-256
          </span>
        </div>
      </div>

      {/* Main Operations Grid */}
      <div className={`grid grid-cols-1 ${isDemoMode ? 'xl:grid-cols-12' : ''} gap-8`}>
        {/* Sessions Roster (Col-span 8 se demo, senão full width) */}
        <div className={`${isDemoMode ? 'xl:col-span-8' : 'w-full'} flex flex-col gap-5`}>
          {/* Controls Bar: Scrollable Tabs & Search */}
          <div className="bg-[#1c1b1c] p-3 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border border-white/5">
            <Tabs
              tabs={tabsData}
              activeTab={filter}
              onChange={(id) => setFilter(id as typeof filter)}
            />

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#8f9194] text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar cliente ou arte..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0e0e0f] text-white placeholder-[#8f9194]/60 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#fabc4d]"
              />
            </div>
          </div>

          {/* Session Cards List */}
          {filteredSessions.length === 0 ? (
            <EmptyState
              title="Nenhuma sessão encontrada"
              description="Nenhum agendamento corresponde aos filtros atuais. Gere um novo link seguro para registrar um cliente."
              actionLabel="Criar Nova Sessão"
              onAction={onOpenNewSession}
            />
          ) : (
            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {filteredSessions.map((session, index) => {
                  const avatarColor = getAvatarColor(session.clientName);
                  const initials = getInitials(session.clientName);

                  return (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className="p-4 sm:p-5 bg-[#1c1b1c] hover:bg-[#201f20] rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors border border-white/5 shadow-sm"
                    >
                      {/* Left: Client & Project Info with Dedicated Space */}
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                        {/* Distinct Initials Monogram Avatar (Never reused stock photo!) */}
                        <div
                          className={`w-11 h-11 rounded-xl ${avatarColor.bg} border ${avatarColor.border} flex items-center justify-center font-bold text-sm tracking-wider shrink-0 select-none ${avatarColor.text}`}
                        >
                          {initials}
                        </div>

                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-white text-sm sm:text-base min-w-[140px] truncate">
                              {session.clientName}
                            </span>
                            {session.isRecurring && (
                              <span
                                className="material-symbols-outlined text-[16px] text-[#fabc4d]"
                                title="Cliente Recorrente"
                              >
                                verified
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#8f9194] font-mono">{session.clientPhone}</span>
                          <div
                            className="flex items-center gap-1.5 mt-1 text-xs text-[#c5c7c9] truncate"
                            title={session.project}
                          >
                            <span className="material-symbols-outlined text-[14px] text-[#8f9194] shrink-0">
                              palette
                            </span>
                            <span className="truncate">{session.project}</span>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Schedule & Financials with Tabular Nums */}
                      <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 text-left sm:text-right shrink-0">
                        {/* Date & Duration */}
                        <div className="flex flex-col sm:min-w-[130px]">
                          <span className="text-xs font-semibold text-white">{session.dateStr}</span>
                          <span className="text-[10px] text-[#8f9194] uppercase font-mono">
                            {session.duration}
                          </span>
                        </div>

                        {/* Financials */}
                        <div className="flex flex-col sm:min-w-[140px]">
                          <span className="text-xs font-semibold text-white font-mono tabular-nums">
                            {formatCurrency(session.totalAmount)}
                          </span>
                          <span
                            className={`text-[10px] font-mono uppercase font-semibold ${
                              session.status === 'pix_pendente' ? 'text-[#8f9194]' : 'text-[#fabc4d]'
                            }`}
                          >
                            Sinal {formatCurrency(session.depositAmount)}{' '}
                            {session.status === 'pix_pendente' ? '(pendente)' : '(recebido)'}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div className="col-span-2 sm:col-span-1 flex items-center justify-start sm:justify-end">
                          <Badge status={session.status} />
                        </div>
                      </div>

                      {/* Right: Actions Tray with Tooltips & Clean Icons */}
                      <div className="flex items-center gap-2 pt-2.5 lg:pt-0 border-t lg:border-t-0 border-white/5 shrink-0 justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              `https://marcado.me/s/${session.token}`,
                              `Link exclusivo de ${session.clientName} copiado!`
                            )
                          }
                          className="w-10 h-10 rounded-xl bg-[#2a2a2b] hover:bg-[#353436] flex items-center justify-center text-[#c5c7c9] hover:text-white transition-colors cursor-pointer shrink-0"
                          title="Copiar link seguro da sessão"
                        >
                          <span className="material-symbols-outlined text-[19px]">share</span>
                        </button>

                        <a
                          href={`https://wa.me/${session.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Olá ${session.clientName}! Aqui é do ${studioName}. Segue o link para conferir sua sessão e termo: https://marcado.me/s/${session.token}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-xl bg-[#2a2a2b] hover:bg-[#353436] flex items-center justify-center text-[#25d366] transition-colors shrink-0"
                          title="Abrir conversa no WhatsApp"
                        >
                          <span className="material-symbols-outlined text-[19px]">chat</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => onViewLegalHash(session)}
                          className="w-10 h-10 rounded-xl bg-[#2a2a2b] hover:bg-[#353436] flex items-center justify-center text-[#c5c7c9] hover:text-white transition-colors cursor-pointer shrink-0"
                          title="Ver Termo de Consentimento & PDF"
                        >
                          <span className="material-symbols-outlined text-[19px]">description</span>
                        </button>

                        {/* Botão de Demonstração (Aparece SOMENTE no modo ?demo=1) */}
                        {isDemoMode && (
                          <button
                            type="button"
                            onClick={() => onOpenClientFlow(session)}
                            className="px-3 h-10 rounded-xl bg-[#fabc4d]/15 hover:bg-[#fabc4d]/25 text-[#fabc4d] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                            title="Testar fluxo mobile deste cliente (apenas no modo demo)"
                          >
                            <span className="material-symbols-outlined text-[17px]">smartphone</span>
                            <span>Testar</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Demo-Only Guest Funnel Preview Simulator */}
        {isDemoMode && (
          <div className="xl:col-span-4 flex flex-col gap-6">
            <div className="p-5 bg-[#1c1b1c] rounded-2xl flex flex-col gap-4 border border-[#fabc4d]/20 shadow-xl">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#fabc4d] uppercase tracking-widest">
                    Modo Demonstração (?demo=1)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#201f20] text-[10px] text-white font-mono">
                    Simulador
                  </span>
                </div>
                <h3 className="font-headline text-xl text-white font-medium">Link do Cliente em 3 Etapas</h3>
                <p className="text-xs text-[#8f9194]">O que o cliente vivencia ao abrir seu link no smartphone:</p>
              </div>

              {/* Simulator Shell */}
              <div className="p-4 bg-[#0e0e0f] rounded-xl flex flex-col gap-4 border border-white/5">
                {/* Stepper Header */}
                <div className="flex items-center justify-between border-b border-[#353436] pb-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setSimulatorStep(1)}
                    className={`flex items-center gap-1.5 font-semibold uppercase ${
                      simulatorStep === 1 ? 'text-[#fabc4d]' : 'text-[#8f9194]'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        simulatorStep === 1 ? 'bg-[#fabc4d] text-[#281900]' : 'bg-[#201f20] text-[#8f9194]'
                      }`}
                    >
                      1
                    </span>
                    Dados
                  </button>
                  <div className="w-4 h-0.5 bg-[#2a2a2b]" />
                  <button
                    type="button"
                    onClick={() => setSimulatorStep(2)}
                    className={`flex items-center gap-1.5 font-semibold uppercase ${
                      simulatorStep === 2 ? 'text-[#fabc4d]' : 'text-[#8f9194]'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        simulatorStep === 2 ? 'bg-[#fabc4d] text-[#281900]' : 'bg-[#201f20] text-[#8f9194]'
                      }`}
                    >
                      2
                    </span>
                    Termo
                  </button>
                  <div className="w-4 h-0.5 bg-[#2a2a2b]" />
                  <button
                    type="button"
                    onClick={() => setSimulatorStep(3)}
                    className={`flex items-center gap-1.5 font-semibold uppercase ${
                      simulatorStep === 3 ? 'text-[#fabc4d]' : 'text-[#8f9194]'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        simulatorStep === 3 ? 'bg-[#fabc4d] text-[#281900]' : 'bg-[#201f20] text-[#8f9194]'
                      }`}
                    >
                      3
                    </span>
                    Pix
                  </button>
                </div>

                <div className="text-xs text-[#c5c7c9] leading-relaxed">
                  {simulatorStep === 1 && (
                    <div className="space-y-2">
                      <p className="font-semibold text-white">Etapa 1: Identificação & Verificação</p>
                      <p className="text-[#8f9194]">O cliente confere os dados do projeto, valor, data da sessão e referências estéticas sem precisar de login.</p>
                    </div>
                  )}
                  {simulatorStep === 2 && (
                    <div className="space-y-2">
                      <p className="font-semibold text-white">Etapa 2: Ficha Médica & Assinatura</p>
                      <p className="text-[#8f9194]">Preenchimento rápido de anamnese com assinatura touch direto na tela e validação jurídica com carimbo SHA-256.</p>
                    </div>
                  )}
                  {simulatorStep === 3 && (
                    <div className="space-y-2">
                      <p className="font-semibold text-white">Etapa 3: Sinal Instantâneo via Pix</p>
                      <p className="text-[#8f9194]">Chave copia-e-cola e QR Code com expiração em 15 minutos e conciliação instantânea para confirmar a vaga.</p>
                    </div>
                  )}
                </div>

                {filteredSessions[0] && (
                  <button
                    type="button"
                    onClick={() => onOpenClientFlow(filteredSessions[0], simulatorStep)}
                    className="w-full py-2.5 rounded-xl bg-[#fabc4d] hover:bg-[#e0a438] text-[#281900] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    <span>Abrir Esta Etapa no Mobile</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
