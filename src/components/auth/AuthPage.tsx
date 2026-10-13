import React, { useState, Suspense, lazy } from 'react';
import { StudioUser } from '../../types/index.ts';
import { Button } from '../../design-system/Button.tsx';
import { WhatsAppInputGroup } from '../../design-system/WhatsAppInputGroup.tsx';
import { motion, AnimatePresence } from 'motion/react';

// Code-splitting Three.js: only loaded dynamically when AuthPage is mounted!
const Scene3D = lazy(() => import('./Scene3D.tsx'));

interface AuthPageProps {
  onSuccess: (user: StudioUser) => void;
  onCancel?: () => void;
  defaultMode?: 'login' | 'register';
}

function checkCanRun3D(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const hasWebGL = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
    if (!hasWebGL) return false;

    // Device performance check
    if (typeof navigator !== 'undefined') {
      // @ts-ignore
      if (navigator.connection?.saveData) return false;
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return false;
      // @ts-ignore
      if (navigator.deviceMemory && navigator.deviceMemory <= 2) return false;
    }
    return true;
  } catch {
    return false;
  }
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onSuccess,
  onCancel,
  defaultMode = 'login',
}) => {
  const [tab, setTab] = useState<'login' | 'register'>(defaultMode);
  const [canRun3D] = useState(() => checkCanRun3D());

  // Form states
  const [email, setEmail] = useState('kaelen@marcado.me');
  const [password, setPassword] = useState('••••••••••••');
  const [studioName, setStudioName] = useState(defaultMode === 'register' ? '' : 'Atelier Jardins');
  const [ownerName, setOwnerName] = useState(defaultMode === 'register' ? '' : 'Kaelen Vance');
  const [whatsapp, setWhatsapp] = useState(defaultMode === 'register' ? '' : '(11) 98400-3321');

  const [activeField, setActiveField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isHovered3D, setIsHovered3D] = useState(false);

  const handleTabChange = (newTab: 'login' | 'register') => {
    setTab(newTab);
    if (newTab === 'register' && studioName === 'Atelier Jardins') {
      setStudioName('');
      setOwnerName('');
      setWhatsapp('');
    } else if (newTab === 'login' && !studioName) {
      setStudioName('Atelier Jardins');
      setOwnerName('Kaelen Vance');
      setWhatsapp('(11) 98400-3321');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const resolvedStudio = studioName.trim() || (tab === 'register' ? 'Novo Atelier' : 'Atelier Jardins');
    const resolvedOwner = ownerName.trim() || (tab === 'register' ? 'Tatuador Responsável' : 'Kaelen Vance');

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      // Traço animado da palavra Marcado! antes de transicionar
      setTimeout(() => {
        onSuccess({
          id: `usr-${Date.now()}`,
          name: resolvedOwner,
          email: email.trim(),
          studioName: resolvedStudio,
          phone: whatsapp.trim(),
        });
      }, 1200);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-[#131314] text-[#e5e2e3] flex flex-col lg:flex-row relative overflow-hidden select-none">
      {/* Background Subtle Gradient & Noise */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#fabc4d]/5 via-transparent to-transparent pointer-events-none" />

      {/* LEFT: Auth Form Container (Instant render, never waits for 3D) */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-between p-5 sm:p-10 lg:p-16 z-10 bg-[#131314]/90 backdrop-blur-xl border-r border-white/5">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-headline text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Marcado<span className="italic text-[#fabc4d]">!</span>
            </span>
          </div>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-semibold uppercase tracking-wider text-[#8f9194] hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Voltar ao Ateliê</span>
            </button>
          )}
        </div>

        {/* Center: Tabs & Form */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          {/* Animated Tab Switcher */}
          <div className="p-1 rounded-2xl bg-[#0e0e0f] border border-white/10 flex items-center mb-8 relative">
            <button
              type="button"
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors relative z-10 cursor-pointer ${
                tab === 'login' ? 'text-[#281900]' : 'text-[#8f9194] hover:text-white'
              }`}
            >
              {tab === 'login' && (
                <motion.div
                  layoutId="authTabIndicator"
                  className="absolute inset-0 bg-[#fabc4d] rounded-xl shadow-md"
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                />
              )}
              <span className="relative z-10">Entrar no Estúdio</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('register')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors relative z-10 cursor-pointer ${
                tab === 'register' ? 'text-[#281900]' : 'text-[#8f9194] hover:text-white'
              }`}
            >
              {tab === 'register' && (
                <motion.div
                  layoutId="authTabIndicator"
                  className="absolute inset-0 bg-[#fabc4d] rounded-xl shadow-md"
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                />
              )}
              <span className="relative z-10">Criar Conta do Estúdio</span>
            </button>
          </div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-2xl bg-[#1c1b1c] border border-[#fabc4d]/30 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#fabc4d]/15 border border-[#fabc4d]/30 mx-auto flex items-center justify-center text-[#fabc4d]">
                  <span className="material-symbols-outlined text-[36px]">verified</span>
                </div>
                <h3 className="font-headline text-3xl text-white font-medium">
                  Marcado<span className="italic text-[#fabc4d]">!</span>
                </h3>
                <p className="text-xs text-[#c5c7c9] leading-relaxed">
                  Acesso autenticado com sucesso. Conectando sua bancada e agenda...
                </p>
                <div className="w-full bg-[#2a2a2b] h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-[#fabc4d] h-full"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.form
                key={tab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <h2 className="font-headline text-2xl sm:text-3xl text-white font-medium">
                    {tab === 'login' ? 'Bem-vindo de volta' : 'Comece a operar seu estúdio'}
                  </h2>
                  <p className="text-xs text-[#8f9194] mt-1">
                    {tab === 'login'
                      ? 'Gerencie sua agenda, termos com assinatura e receba sinais por Pix.'
                      : 'Cadastro rápido em menos de 1 minuto para começar a gerar links seguros.'}
                  </p>
                </div>

                {tab === 'register' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#e5e2e3] uppercase tracking-wider">
                        Nome do Estúdio / Ateliê
                      </label>
                      <input
                        type="text"
                        required
                        value={studioName}
                        onChange={(e) => setStudioName(e.target.value)}
                        onFocus={() => setActiveField('studioName')}
                        placeholder="Ex: Atelier Noir Pinheiros"
                        className="w-full h-12 bg-[#0e0e0f] text-white px-4 rounded-xl border border-white/10 focus:border-[#fabc4d] text-sm focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#e5e2e3] uppercase tracking-wider">
                        Nome do Tatuador / Responsável
                      </label>
                      <input
                        type="text"
                        required
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        onFocus={() => setActiveField('ownerName')}
                        placeholder="Ex: Kaelen Vance"
                        className="w-full h-12 bg-[#0e0e0f] text-white px-4 rounded-xl border border-white/10 focus:border-[#fabc4d] text-sm focus:outline-none"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#e5e2e3] uppercase tracking-wider">
                    E-mail do Estúdio
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setActiveField('email')}
                    placeholder="estudio@marcado.me"
                    className="w-full h-12 bg-[#0e0e0f] text-white px-4 rounded-xl border border-white/10 focus:border-[#fabc4d] text-sm focus:outline-none"
                  />
                </div>

                {tab === 'register' && (
                  <WhatsAppInputGroup
                    id="whatsapp-input-group"
                    label="WhatsApp do Estúdio"
                    required
                    value={whatsapp}
                    variant="plain"
                    onFocus={() => setActiveField('phone')}
                    onChange={(formatted) => setWhatsapp(formatted)}
                  />
                )}

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#e5e2e3] uppercase tracking-wider">
                      Senha de Acesso
                    </label>
                    {tab === 'login' && (
                      <span className="text-[11px] text-[#fabc4d] hover:underline cursor-pointer">
                        Esqueceu a senha?
                      </span>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setActiveField('password')}
                    placeholder="••••••••••••"
                    className="w-full h-12 bg-[#0e0e0f] text-white px-4 rounded-xl border border-white/10 focus:border-[#fabc4d] text-sm focus:outline-none font-mono"
                  />
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  loading={isSubmitting}
                  icon={tab === 'login' ? 'login' : 'bolt'}
                  className="w-full mt-4"
                  type="submit"
                >
                  {tab === 'login' ? 'Entrar no Estúdio' : 'Criar Conta do Estúdio'}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[11px] text-[#8f9194] pt-4 border-t border-white/5">
          <span>Marcado! • Conexão segura</span>
          <span>Privacidade & Termos</span>
        </div>
      </div>

      {/* RIGHT: Interactive 3D Showcase (Lazy loaded on desktop, hidden on mobile) */}
      <div
        className="hidden lg:flex w-full lg:w-1/2 min-h-screen relative items-center justify-center p-6 bg-gradient-to-br from-[#1c1b1c]/60 via-[#131314] to-[#0e0e0f]"
        onMouseEnter={() => setIsHovered3D(true)}
        onMouseLeave={() => setIsHovered3D(false)}
      >
        {/* Editorial Brand Callout in Corner */}
        <div className="absolute top-8 right-8 text-right hidden lg:block z-10 pointer-events-none">
          <span className="font-headline text-2xl text-white font-medium block">
            Rotary Precision<span className="text-[#fabc4d]">.</span>
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8f9194]">
            Caneta de Tatuagem • Motor 90Hz
          </span>
        </div>

        {/* 3D Scene or Fallback */}
        {canRun3D ? (
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center gap-3 text-[#8f9194]">
                <div className="w-10 h-10 border-2 border-[#fabc4d] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs uppercase tracking-wider font-mono">Renderizando 3D...</span>
              </div>
            }
          >
            <Scene3D
              activeField={activeField}
              isSuccess={isSuccess}
              isHovered={isHovered3D}
            />
          </Suspense>
        ) : (
          /* High-Fidelity SVG Fallback for low-power or non-WebGL devices */
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 max-w-sm">
            <div className="w-32 h-32 rounded-full bg-[#201f20] border border-[#fabc4d]/30 flex items-center justify-center shadow-2xl">
              <span className="material-symbols-outlined text-[64px] text-[#fabc4d]">
                ink_pen
              </span>
            </div>
            <h4 className="font-headline text-xl text-white">Marcado! Rotary Atelier</h4>
            <p className="text-xs text-[#8f9194]">
              Hardware virtual calibrado para controle total de agenda e sinal Pix instantâneo.
            </p>
          </div>
        )}

        {/* Micro-hint on 3D viewport */}
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[11px] text-[#8f9194] pointer-events-none">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fabc4d] animate-pulse" />
            <span>Mova o cursor para interagir com a caneta</span>
          </span>
          <span className="font-mono text-[10px] text-[#8f9194]/60">dpr 1.75 • WebGL 2.0</span>
        </div>
      </div>
    </div>
  );
};
