import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'studio' | 'magic'>('studio');
  const [email, setEmail] = useState('curador@ateliernoir.art.br');
  const [password, setPassword] = useState('••••••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  if (!isOpen) return null;

  const handleStudioSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess(email);
      onClose();
    }, 1200);
  };

  const handleBiometricSim = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess('biometria@marcado.me');
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#1c1b1c] w-full max-w-lg rounded-xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl relative border border-white/10">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 rounded-lg bg-[#2a2a2b] flex items-center justify-center text-[#8f9194] hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2a2a2b] text-[#fabc4d] text-xs font-semibold mb-2">
            <span className="material-symbols-outlined text-sm">verified</span>
            <span className="uppercase tracking-widest text-[10px]">MARCADO! CORE SUITE</span>
          </div>
          <h2 className="font-headline text-3xl text-white font-medium">
            MARCADO! <span className="italic text-[#fabc4d]">Atelier</span>
          </h2>
          <p className="text-xs text-[#8f9194] uppercase tracking-wider mt-1">
            Haute Horlogerie & Tattoo Curatorship — Gestão Privativa
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1 bg-[#0e0e0f] rounded-lg gap-1 border border-white/5">
          <button
            type="button"
            onClick={() => setMode('studio')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${
              mode === 'studio'
                ? 'bg-[#2a2a2b] text-white shadow-sm'
                : 'text-[#8f9194] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">domain</span>
            <span>Acesso Estúdio</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('magic')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${
              mode === 'magic'
                ? 'bg-[#2a2a2b] text-white shadow-sm'
                : 'text-[#8f9194] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">fingerprint</span>
            <span>Magic Link / Biometria</span>
          </button>
        </div>

        {mode === 'studio' ? (
          <form onSubmit={handleStudioSubmit} className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs text-[#8f9194]">
                <label className="font-semibold uppercase text-[10px] tracking-wider">
                  E-mail Profissional ou Código de Artista
                </label>
                <span className="flex items-center gap-1 text-[10px]">
                  <span className="material-symbols-outlined text-xs">shield_lock</span> TLS 1.3
                </span>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#8f9194] text-lg pointer-events-none">
                  alternate_email
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0e0e0f] text-white text-sm pl-10 pr-4 py-2.5 rounded-lg border border-white/5 focus:outline-none focus:border-[#fabc4d]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs text-[#8f9194]">
                <label className="font-semibold uppercase text-[10px] tracking-wider">
                  Credencial de Acesso
                </label>
                <span className="text-[#fabc4d] hover:underline cursor-pointer text-[11px]">
                  Esqueceu a chave?
                </span>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#8f9194] text-lg pointer-events-none">
                  vpn_key
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0e0e0f] text-white text-sm pl-10 pr-10 py-2.5 rounded-lg border border-white/5 focus:outline-none focus:border-[#fabc4d]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[#8f9194] hover:text-white"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs py-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#c5c7c9]">
                <input type="checkbox" defaultChecked className="accent-[#fabc4d] rounded" />
                <span>Lembrar deste dispositivo (Hardware Enclave)</span>
              </label>
              <span className="text-[#fabc4d] font-mono text-[10px] bg-[#0e0e0f] px-2 py-0.5 rounded">
                VAULT ATIVO
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#fabc4d] text-[#281900] font-semibold text-xs uppercase tracking-wider hover:bg-[#bd8718] hover:text-white transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                  <span>Validando Chaves Criptográficas...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">lock_open</span>
                  <span>Entrar no Atelier</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[#0e0e0f] flex flex-col items-center text-center gap-3 border border-white/5">
              <div className="w-14 h-14 rounded-full bg-[#2a2a2b] flex items-center justify-center text-[#fabc4d]">
                <span className="material-symbols-outlined text-3xl">fingerprint</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Autenticação FIDO2 / WebAuthn</h4>
                <p className="text-xs text-[#8f9194] mt-1 max-w-xs">
                  Utilize Touch ID, Face ID ou sua YubiKey física para validar sua assinatura de estúdio sem senhas.
                </p>
              </div>
              <button
                type="button"
                onClick={handleBiometricSim}
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#fabc4d] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">passkey</span>
                <span>Validar Chave Biométrica</span>
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold text-[#8f9194] uppercase tracking-wider">
                Ou Link Efêmero via E-mail
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  defaultValue="curador@ateliernoir.art.br"
                  className="flex-1 bg-[#0e0e0f] text-white text-xs px-3 py-2 rounded-lg border border-white/5"
                />
                <button
                  type="button"
                  onClick={() => setMagicSent(true)}
                  className="px-4 py-2 bg-[#2a2a2b] hover:bg-[#353436] text-white text-xs font-semibold rounded-lg uppercase tracking-wider"
                >
                  Disparar
                </button>
              </div>
              {magicSent && (
                <span className="text-[11px] text-[#fabc4d] flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Link seguro enviado para a caixa de entrada.
                </span>
              )}
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-[#353436] flex items-center justify-between text-[11px] text-[#8f9194]">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fabc4d] animate-pulse"></span>
            Clusters SP-East & FR-Central Operacionais (99.98%)
          </span>
          <span className="font-mono">Marcado! v2.4.18</span>
        </div>
      </div>
    </div>
  );
};
