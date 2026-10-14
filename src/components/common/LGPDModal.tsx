import React, { useState } from 'react';
import { Session } from '../../types/index.ts';
import {
  maskPhone,
  maskCpf,
  exportUserDataJson,
} from '../../utils/privacy.ts';

interface LGPDModalProps {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
  onAnonymizeSession: (session: Session) => void;
  onPurgeHealthData: (session: Session) => void;
  onShowToast: (msg: string) => void;
}

export const LGPDModal: React.FC<LGPDModalProps> = ({
  session,
  isOpen,
  onClose,
  onAnonymizeSession,
  onPurgeHealthData,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'rights' | 'dpo'>('overview');
  const [revealSensitive, setRevealSensitive] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'anonymize' | 'purge' | null>(null);

  if (!isOpen || !session) return null;

  const handleExport = () => {
    exportUserDataJson(session);
    onShowToast('Arquivo de portabilidade LGPD (.json) baixado com sucesso!');
  };

  const handleExecuteAnonymize = () => {
    onAnonymizeSession(session);
    setConfirmAction(null);
    onShowToast('Dados do titular foram anonimizados conforme Art. 18, IV da LGPD.');
    onClose();
  };

  const handleExecutePurge = () => {
    onPurgeHealthData(session);
    setConfirmAction(null);
    onShowToast('Ficha de saúde e biometria expurgadas com sucesso (Art. 18, VI).');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#1c1b1c] w-full max-w-xl rounded-2xl p-5 sm:p-7 flex flex-col gap-5 shadow-2xl relative border border-white/10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#fabc4d] text-[24px]">verified_user</span>
            <div>
              <h2 className="font-headline text-lg sm:text-xl text-white font-medium">
                Portal de Privacidade & LGPD
              </h2>
              <p className="text-[11px] text-[#8f9194]">
                Direitos do Titular de Dados • Lei Federal nº 13.709/2018
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#2a2a2b] flex items-center justify-center text-[#8f9194] hover:text-white transition-colors cursor-pointer"
            title="Fechar modal"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#131314] rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#2a2a2b] text-white shadow-sm'
                : 'text-[#8f9194] hover:text-white'
            }`}
          >
            Visão Geral dos Dados
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rights')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'rights'
                ? 'bg-[#2a2a2b] text-white shadow-sm'
                : 'text-[#8f9194] hover:text-white'
            }`}
          >
            Exercer Direitos (Art. 18)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dpo')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'dpo'
                ? 'bg-[#2a2a2b] text-white shadow-sm'
                : 'text-[#8f9194] hover:text-white'
            }`}
          >
            Canal DPO
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-4">
            {/* Status Card */}
            <div className="p-4 bg-[#131314] rounded-xl border border-white/5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#fabc4d]">
                  Status da Custódia de Dados
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                    session.isAnonymized
                      ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                      : session.sensitiveDataPurged
                      ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                      : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                  }`}
                >
                  {session.isAnonymized
                    ? 'Anonimizado'
                    : session.sensitiveDataPurged
                    ? 'Saúde Expurgada'
                    : 'Protegido & Ativo'}
                </span>
              </div>
              <p className="text-xs text-[#c5c7c9] leading-relaxed">
                Base legal: <strong className="text-white">Execução Contratual (Art. 7, V)</strong> e{' '}
                <strong className="text-white">Proteção da Vida e Saúde (Art. 11, II)</strong>. Seus dados são criptografados e não são compartilhados com terceiros.
              </p>
            </div>

            {/* Registered Data */}
            <div className="p-4 bg-[#131314] rounded-xl border border-white/5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Dados Pessoais Registrados</span>
                <button
                  type="button"
                  onClick={() => setRevealSensitive((prev) => !prev)}
                  className="text-[11px] text-[#fabc4d] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {revealSensitive ? 'visibility_off' : 'visibility'}
                  </span>
                  {revealSensitive ? 'Ocultar Máscara' : 'Revelar Dados'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-[#1c1b1c] rounded-lg">
                  <span className="text-[10px] text-[#8f9194] block uppercase">Nome Completo</span>
                  <span className="font-semibold text-white">{session.clientName}</span>
                </div>

                <div className="p-2.5 bg-[#1c1b1c] rounded-lg">
                  <span className="text-[10px] text-[#8f9194] block uppercase">Telefone / WhatsApp</span>
                  <span className="font-mono text-white">
                    {maskPhone(session.clientPhone, revealSensitive)}
                  </span>
                </div>

                <div className="p-2.5 bg-[#1c1b1c] rounded-lg">
                  <span className="text-[10px] text-[#8f9194] block uppercase">CPF</span>
                  <span className="font-mono text-white">
                    {maskCpf(session.clientCpf, revealSensitive)}
                  </span>
                </div>

                <div className="p-2.5 bg-[#1c1b1c] rounded-lg">
                  <span className="text-[10px] text-[#8f9194] block uppercase">Hash de Assinatura</span>
                  <span className="font-mono text-[11px] text-[#fabc4d] truncate block" title={session.shaHash}>
                    {session.shaHash.slice(0, 16)}...
                  </span>
                </div>
              </div>

              {/* Health anamnese summary */}
              <div className="p-3 bg-[#1c1b1c] rounded-lg border border-white/5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#8f9194] uppercase tracking-wider">
                    Dados Sensíveis de Saúde (Art. 11 LGPD)
                  </span>
                  <span className="text-[10px] text-[#fabc4d] font-mono">Sigilo Profissional</span>
                </div>
                {session.sensitiveDataPurged ? (
                  <p className="text-xs text-[#8f9194] italic">
                    Dados médicos e assinatura foram expurgados permanentemente desta sessão a pedido do titular.
                  </p>
                ) : session.anamneseAnswers ? (
                  <p className="text-xs text-[#c5c7c9]">
                    Ficha clínica preenchida (alergias:{' '}
                    {session.anamneseAnswers.allergies ? 'Sim' : 'Não'}, coagulação:{' '}
                    {session.anamneseAnswers.clotting ? 'Sim' : 'Não'}). Armazenamento restrito e inviolável.
                  </p>
                ) : (
                  <p className="text-xs text-[#8f9194]">Ficha de anamnese ainda não respondida.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Exercising LGPD Rights */}
        {activeTab === 'rights' && (
          <div className="flex flex-col gap-3.5">
            <p className="text-xs text-[#c5c7c9]">
              Conforme o <strong className="text-white">Artigo 18 da LGPD</strong>, você possui total controle sobre os dados armazenados pelo estúdio:
            </p>

            {/* Action 1: Export */}
            <div className="p-3.5 bg-[#131314] rounded-xl border border-white/5 flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#fabc4d] text-[16px]">file_download</span>
                  Portabilidade de Dados (Art. 18, V)
                </span>
                <span className="text-[11px] text-[#8f9194]">
                  Baixe uma cópia estruturada em JSON de todos os seus registros e termos assinados.
                </span>
              </div>
              <button
                type="button"
                onClick={handleExport}
                className="px-3.5 py-2 rounded-lg bg-[#2a2a2b] hover:bg-[#353436] text-white text-xs font-semibold shrink-0 cursor-pointer transition-colors"
              >
                Exportar JSON
              </button>
            </div>

            {/* Action 2: Purge sensitive health data */}
            <div className="p-3.5 bg-[#131314] rounded-xl border border-white/5 flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#fabc4d] text-[16px]">health_and_safety</span>
                  Expurgo de Dados de Saúde (Art. 18, VI)
                </span>
                <span className="text-[11px] text-[#8f9194]">
                  Exclui permanentemente respostas de anamnese e assinatura tátil do sistema.
                </span>
              </div>
              <button
                type="button"
                disabled={session.sensitiveDataPurged}
                onClick={() => setConfirmAction('purge')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                  session.sensitiveDataPurged
                    ? 'bg-white/5 text-[#8f9194] cursor-not-allowed'
                    : 'bg-amber-900/30 hover:bg-amber-900/50 text-[#fabc4d] border border-amber-700/40 cursor-pointer'
                }`}
              >
                {session.sensitiveDataPurged ? 'Já Expurgado' : 'Expurgar Saúde'}
              </button>
            </div>

            {/* Action 3: Complete anonymization */}
            <div className="p-3.5 bg-[#131314] rounded-xl border border-white/5 flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-red-400 text-[16px]">delete_sweep</span>
                  Anonimização Completa (Art. 18, IV)
                </span>
                <span className="text-[11px] text-[#8f9194]">
                  Remove seu nome, telefone e CPF de forma definitiva, preservando apenas o valor para fins fiscais.
                </span>
              </div>
              <button
                type="button"
                disabled={session.isAnonymized}
                onClick={() => setConfirmAction('anonymize')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                  session.isAnonymized
                    ? 'bg-white/5 text-[#8f9194] cursor-not-allowed'
                    : 'bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 cursor-pointer'
                }`}
              >
                {session.isAnonymized ? 'Já Anonimizado' : 'Anonimizar'}
              </button>
            </div>

            {/* Confirmation Dialog within Rights tab */}
            {confirmAction && (
              <div className="p-4 bg-red-950/30 border border-red-700/40 rounded-xl flex flex-col gap-2.5 mt-2 animate-fadeIn">
                <div className="flex items-center gap-2 text-red-300 font-semibold text-xs">
                  <span className="material-symbols-outlined text-[18px]">warning</span>
                  Confirmar {confirmAction === 'anonymize' ? 'Anonimização Definitiva' : 'Expurgo de Dados de Saúde'}
                </div>
                <p className="text-[11px] text-red-200/80 leading-relaxed">
                  {confirmAction === 'anonymize'
                    ? 'Esta ação é irreversível. Seu nome e contatos serão substituídos por um pseudônimo aleatório em conformidade com o Art. 18 da LGPD.'
                    : 'A ficha de saúde e o traço de assinatura digital serão apagados permanentemente deste agendamento.'}
                </p>
                <div className="flex items-center justify-end gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setConfirmAction(null)}
                    className="px-3 py-1.5 text-xs text-[#8f9194] hover:text-white transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={
                      confirmAction === 'anonymize'
                        ? handleExecuteAnonymize
                        : handleExecutePurge
                    }
                    className="px-4 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Sim, Prosseguir
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: DPO & Compliance */}
        {activeTab === 'dpo' && (
          <div className="flex flex-col gap-3.5 text-xs text-[#c5c7c9]">
            <div className="p-4 bg-[#131314] rounded-xl border border-white/5 flex flex-col gap-2.5">
              <span className="text-[10px] font-bold text-[#fabc4d] uppercase tracking-wider">
                Encarregado pelo Tratamento de Dados (DPO)
              </span>
              <div className="flex flex-col gap-1 text-xs">
                <span className="text-white font-medium">Equipe de Governança & Compliance Marcado</span>
                <span className="text-[#8f9194]">E-mail de Contato: <span className="font-mono text-[#fabc4d]">dpo@marcado.me</span></span>
                <span className="text-[#8f9194]">Prazo legal de resposta a requisições: <strong className="text-white">Até 15 dias (Art. 19, II)</strong></span>
              </div>
            </div>

            <div className="p-3.5 bg-[#131314] rounded-xl border border-white/5 flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-white">Garantias de Segurança Técnicas</span>
              <ul className="list-disc list-inside text-[11px] text-[#8f9194] space-y-1">
                <li>Criptografia de ponta a ponta com carimbo de tempo UTC e hash SHA-256</li>
                <li>Mascaramento ativo contra visualização por terceiros no ateliê</li>
                <li>Políticas de minimização estrita e expurgo programado</li>
                <li>Hospedagem em infraestrutura segura com conformidade ISO 27001</li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <span className="text-[10px] text-[#8f9194] font-mono">
            Conformidade LGPD v2026.1
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#fabc4d] text-[#281900] font-bold text-xs uppercase tracking-wider hover:bg-[#bd8718] hover:text-white transition-colors cursor-pointer"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
