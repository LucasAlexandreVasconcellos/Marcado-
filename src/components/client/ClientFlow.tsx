import React, { useState } from 'react';
import { Session } from '../../types/index.ts';
import { Step1Verification } from './Step1Verification.tsx';
import { Step2Anamnese } from './Step2Anamnese.tsx';
import { Step3PixPayment } from './Step3PixPayment.tsx';
import { Step4Confirmation } from './Step4Confirmation.tsx';
import { motion, AnimatePresence } from 'framer-motion';

interface ClientFlowProps {
  session: Session;
  initialStep?: number;
  onExit?: () => void;
  onSessionUpdated: (session: Session) => void;
  onShowToast: (msg: string) => void;
  studioName?: string;
  isDemoMode?: boolean;
}

export const ClientFlow: React.FC<ClientFlowProps> = ({
  session,
  initialStep = 1,
  onExit,
  onSessionUpdated,
  onShowToast,
  studioName = 'Atelier Jardins',
  isDemoMode = false,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [currentSession, setCurrentSession] = useState<Session>(session);

  const handleStep1Proceed = (updated: Partial<Session>) => {
    const next = { ...currentSession, ...updated };
    setCurrentSession(next);
    onSessionUpdated(next);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onShowToast('Dados verificados! Preencha a ficha de anamnese.');
  };

  const handleStep2Proceed = (updated: Partial<Session>) => {
    const next = { ...currentSession, ...updated };
    setCurrentSession(next);
    onSessionUpdated(next);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onShowToast('Termo e assinatura registrados! Chave Pix gerada.');
  };

  const handleStep3PaymentConfirmed = () => {
    const next: Session = {
      ...currentSession,
      status: 'confirmada',
    };
    setCurrentSession(next);
    onSessionUpdated(next);
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onShowToast('Sinal Pix recebido! Sua sessão está confirmada.');
  };

  const stepTitles = {
    1: '1. Dados & Arte',
    2: '2. Termo & Saúde',
    3: '3. Sinal Pix',
    4: 'Sessão Confirmada',
  }[currentStep];

  return (
    <div className="min-h-screen bg-[#131314] text-[#e5e2e3] flex flex-col items-center justify-start p-0 sm:py-6 selection:bg-[#fabc4d] selection:text-[#281900]">
      {/* Mobile Shell Container (Max 480px, centered on desktop) */}
      <div className="w-full max-w-[480px] bg-[#131314] min-h-screen sm:min-h-[840px] sm:rounded-3xl sm:border sm:border-white/10 sm:shadow-2xl flex flex-col relative overflow-hidden">
        {/* Unified Mobile Header: Voltar + Nome do Estúdio + Indicador Único de 3 Passos */}
        <header className="sticky top-0 z-40 bg-[#131314]/95 backdrop-blur-xl border-b border-white/5 px-4 pt-3 pb-3 flex flex-col gap-2.5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="w-9 h-9 rounded-xl bg-[#1c1b1c] flex items-center justify-center text-white hover:text-[#fabc4d] transition-colors cursor-pointer"
                  title="Voltar ao passo anterior"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back_ios_new</span>
                </button>
              ) : isDemoMode && onExit ? (
                <button
                  type="button"
                  onClick={onExit}
                  className="w-9 h-9 rounded-xl bg-[#1c1b1c] flex items-center justify-center text-[#8f9194] hover:text-white transition-colors cursor-pointer"
                  title="Voltar ao Studio OS (Modo Demo)"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              ) : null}

              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#fabc4d] uppercase tracking-wider">
                  {studioName}
                </span>
                <span className="font-headline text-base sm:text-lg text-white font-medium leading-tight">
                  {stepTitles}
                </span>
              </div>
            </div>

            {/* Marcado Brand Badge */}
            <span className="font-headline text-sm font-bold text-white tracking-tight">
              Marcado<span className="italic text-[#fabc4d]">!</span>
            </span>
          </div>

          {/* Indicador Único de 3 Passos Unificado */}
          {currentStep <= 3 && (
            <div className="flex items-center gap-1.5 pt-1">
              {[1, 2, 3].map((s) => {
                const isActive = currentStep === s;
                const isDone = currentStep > s;
                return (
                  <div key={s} className="flex-1 flex flex-col gap-1">
                    <div
                      className={`h-1 rounded-full transition-all duration-300 ${
                        isDone
                          ? 'bg-[#fabc4d]'
                          : isActive
                          ? 'bg-[#fabc4d] shadow-[0_0_8px_#fabc4d]'
                          : 'bg-[#2a2a2b]'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </header>

        {/* Dynamic Step Content with Spring Transition */}
        <main className="flex-1 p-4 sm:p-5 flex flex-col overflow-y-auto">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                <Step1Verification
                  session={currentSession}
                  onProceed={handleStep1Proceed}
                />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                <Step2Anamnese
                  session={currentSession}
                  onProceed={handleStep2Proceed}
                  onBack={() => setCurrentStep(1)}
                />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                <Step3PixPayment
                  session={currentSession}
                  onPaymentConfirmed={handleStep3PaymentConfirmed}
                  onBack={() => setCurrentStep(2)}
                />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 20, stiffness: 280 }}
              >
                <Step4Confirmation
                  session={currentSession}
                  onRestart={() => setCurrentStep(1)}
                  onReturnToStudio={onExit || (() => {})}
                  studioName={studioName}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
