import React from 'react';
import { StudioUser } from '../../types/index.ts';

export type StudioTab = 'dashboard' | 'agenda' | 'reminders' | 'artists' | 'pix' | 'studios';

interface StudioSidebarProps {
  activeTab: StudioTab;
  onTabChange: (tab: StudioTab) => void;
  onOpenNewSession: () => void;
  onOpenAuth: () => void;
  currentUser?: StudioUser;
  studioName?: string;
  isDemoMode?: boolean;
  onCloseMobile?: () => void;
  isMobileDrawer?: boolean;
  onOpenLgpdModal?: () => void;
}

export const StudioSidebar: React.FC<StudioSidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenNewSession,
  onOpenAuth,
  currentUser,
  studioName = 'Atelier Jardins',
  isDemoMode = false,
  onCloseMobile,
  isMobileDrawer = false,
  onOpenLgpdModal,
}) => {
  return (
    <aside
      className={`${
        isMobileDrawer
          ? 'h-full w-full bg-[#0e0e0f] flex flex-col justify-between select-none overflow-y-auto'
          : 'fixed top-0 left-0 h-screen w-64 bg-[#0e0e0f] flex flex-col justify-between border-r border-white/5 z-30 select-none overflow-y-auto'
      }`}
    >
      <div className="flex flex-col">
        {/* Brand Lockup */}
        <div className="px-5 pt-6 pb-4 flex flex-col gap-1.5 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-headline text-2xl text-white font-bold tracking-tight">
                Marcado<span className="italic text-[#fabc4d]">!</span>
              </span>
              {isDemoMode && (
                <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-[#fabc4d]/15 text-[#fabc4d] border border-[#fabc4d]/30 font-semibold">
                  Demo
                </span>
              )}
            </div>

            {/* Mobile Close Button */}
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-8 h-8 rounded-xl bg-[#1c1b1c] border border-white/10 flex items-center justify-center text-[#8f9194] hover:text-white transition-colors cursor-pointer"
                title="Fechar menu"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
          <span className="text-[11px] text-[#8f9194] leading-tight">
            Agenda, termo e sinal por Pix para tatuadores.
          </span>
        </div>

        {/* Current Studio Selector Tile */}
        <div className="px-4 py-3">
          <button
            type="button"
            onClick={() => onTabChange('studios')}
            className="w-full p-3 bg-[#1c1b1c] hover:bg-[#201f20] rounded-xl flex items-center justify-between border border-white/5 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#fabc4d] shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white truncate leading-tight">
                  {studioName}
                </span>
                <span className="text-[10px] text-[#8f9194] uppercase tracking-wider mt-0.5">
                  Unidade Ativa
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#8f9194] text-[16px] shrink-0">unfold_more</span>
          </button>
        </div>

        {/* Action: Nova Sessão */}
        <div className="px-4 pb-2">
          <button
            type="button"
            onClick={onOpenNewSession}
            className="w-full py-2.5 px-3.5 rounded-xl bg-[#fabc4d] hover:bg-[#e0a438] active:bg-[#bd8718] text-[#281900] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(250,188,77,0.18)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Nova Sessão</span>
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex flex-col gap-1 px-3 mt-3">
          <button
            type="button"
            onClick={() => onTabChange('dashboard')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all text-left cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#2a2a2b] text-white shadow-sm'
                : 'text-[#c5c7c9] hover:bg-[#1c1b1c] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-[#fabc4d]">bar_chart</span>
            <span>Dashboard & Métricas</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('agenda')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all text-left cursor-pointer ${
              activeTab === 'agenda'
                ? 'bg-[#2a2a2b] text-white shadow-sm'
                : 'text-[#c5c7c9] hover:bg-[#1c1b1c] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-[#fabc4d]">calendar_month</span>
            <span>Agenda & Sessões</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('reminders')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all text-left cursor-pointer ${
              activeTab === 'reminders'
                ? 'bg-[#2a2a2b] text-white shadow-sm'
                : 'text-[#c5c7c9] hover:bg-[#1c1b1c] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-[#fabc4d]">notifications_active</span>
            <span>Lembretes Anti-No-Show</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('artists')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all text-left cursor-pointer ${
              activeTab === 'artists'
                ? 'bg-[#2a2a2b] text-white shadow-sm'
                : 'text-[#c5c7c9] hover:bg-[#1c1b1c] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-[#fabc4d]">palette</span>
            <span>Tatuadores & Residentes</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('pix')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all text-left cursor-pointer ${
              activeTab === 'pix'
                ? 'bg-[#2a2a2b] text-white shadow-sm'
                : 'text-[#c5c7c9] hover:bg-[#1c1b1c] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-[#fabc4d]">payments</span>
            <span>Sinais & Chaves Pix</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('studios')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all text-left cursor-pointer ${
              activeTab === 'studios'
                ? 'bg-[#2a2a2b] text-white shadow-sm'
                : 'text-[#c5c7c9] hover:bg-[#1c1b1c] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-[#fabc4d]">apartment</span>
            <span>Estúdios & Unidades</span>
          </button>
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-white/5 flex flex-col gap-2">
        {onOpenLgpdModal && (
          <button
            type="button"
            onClick={onOpenLgpdModal}
            className="w-full py-2 px-3 rounded-xl bg-[#141415] hover:bg-[#1c1b1c] text-[#8f9194] hover:text-[#fabc4d] text-[11px] font-semibold flex items-center justify-between border border-white/5 transition-colors cursor-pointer"
            title="Portal de Privacidade e Direitos do Titular (Art. 18 LGPD)"
          >
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#fabc4d]">verified_user</span>
              <span>Privacidade & LGPD</span>
            </span>
            <span className="text-[10px] font-mono text-[#fabc4d]">Art. 18</span>
          </button>
        )}

        <div className="flex items-center justify-between p-2 rounded-xl bg-[#141415] border border-white/5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#fabc4d]/15 border border-[#fabc4d]/30 flex items-center justify-center text-[#fabc4d] font-bold text-xs shrink-0">
              {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'KV'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-white truncate">
                {currentUser?.name || 'Kaelen Vance'}
              </span>
              <span className="text-[10px] text-[#8f9194] truncate">
                {currentUser?.email || 'kaelen@marcado.me'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenAuth}
            className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#8f9194] hover:text-white transition-colors cursor-pointer"
            title="Alternar conta ou entrar"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
