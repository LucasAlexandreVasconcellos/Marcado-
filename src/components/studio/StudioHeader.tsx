import React, { useState, useRef, useEffect } from 'react';
import { Studio, StudioUser } from '../../types/index.ts';

interface StudioHeaderProps {
  currentStudio: Studio;
  studios: Studio[];
  onSelectStudio: (studio: Studio) => void;
  onToggleSidebarMobile: () => void;
  onSwitchToClientFlow?: () => void;
  onOpenAuth: () => void;
  onManageStudios?: () => void;
  isDemoMode?: boolean;
  currentUser?: StudioUser;
  privacyMode?: boolean;
  onTogglePrivacyMode?: () => void;
  onOpenLgpdPortal?: () => void;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  currentStudio,
  studios,
  onSelectStudio,
  onToggleSidebarMobile,
  onSwitchToClientFlow,
  onOpenAuth,
  onManageStudios,
  isDemoMode = false,
  currentUser,
  privacyMode = true,
  onTogglePrivacyMode,
  onOpenLgpdPortal,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 sm:h-18 bg-[#131314]/90 backdrop-blur-xl border-b border-white/5 sticky top-0 z-20 px-3 sm:px-8 flex items-center justify-between">
      {/* Left items */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebarMobile}
          className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1c1b1c] border border-white/10 flex items-center justify-center text-[#c5c7c9] hover:text-white transition-colors cursor-pointer shrink-0"
          title="Menu de navegação"
        >
          <span className="material-symbols-outlined text-[19px]">menu</span>
        </button>

        {/* Studio Selector (Click to toggle) */}
        <div className="relative min-w-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-[#1c1b1c] hover:bg-[#201f20] rounded-xl border border-white/10 hover:border-white/20 transition-colors cursor-pointer select-none max-w-full"
            title="Selecionar unidade ou estúdio ativo"
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#fabc4d] shrink-0">
              apartment
            </span>
            <span className="text-xs font-semibold text-white tracking-wide max-w-[105px] xs:max-w-[145px] sm:max-w-[200px] truncate">
              {currentStudio?.name || currentUser?.studioName || 'Meu Estúdio'}
            </span>
            <span
              className={`material-symbols-outlined text-[15px] sm:text-[16px] text-[#8f9194] transition-transform shrink-0 ${
                isDropdownOpen ? 'rotate-180 text-white' : ''
              }`}
            >
              expand_more
            </span>
          </button>

          {/* Interactive Studio Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 max-w-[calc(100vw-1.5rem)] p-2 rounded-2xl bg-[#1c1b1c] border border-white/15 shadow-2xl backdrop-blur-2xl z-50 animate-fadeIn flex flex-col gap-1">
              <span className="text-[10px] font-bold text-[#8f9194] uppercase tracking-wider px-2.5 py-1.5 block">
                Unidades & Estúdios Ativos ({studios.length})
              </span>

              <div className="max-h-60 overflow-y-auto space-y-1">
                {studios.map((st) => {
                  const isSelected =
                    st.id === currentStudio?.id ||
                    (st.name &&
                      currentStudio?.name &&
                      st.name.toLowerCase() === currentStudio.name.toLowerCase());
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        onSelectStudio(st);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#fabc4d]/15 text-[#fabc4d] font-semibold border border-[#fabc4d]/30'
                          : 'text-[#c5c7c9] hover:bg-[#201f20] hover:text-white'
                      }`}
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="truncate">{st.name}</span>
                        <span className="text-[10px] text-[#8f9194] truncate">
                          {st.location || 'Brasil'}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="material-symbols-outlined text-[16px] text-[#fabc4d] shrink-0">
                          check_circle
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {onManageStudios && (
                <div className="pt-2 mt-1 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      onManageStudios();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#201f20] hover:bg-[#2a2a2b] text-[#fabc4d] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>Gerenciar / Criar Estúdio</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status: Pix Conectado with clean tooltip (Compact on mobile, expanded on sm+) */}
        <div
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-[#1c1b1c] rounded-full border border-white/5 cursor-help shrink-0"
          title="Pix conectado: liquidação instantânea ativa para recebimento de sinais diretamente na sua conta bancária."
        >
          <span className="w-2 h-2 rounded-full bg-[#fabc4d] shadow-[0_0_8px_#fabc4d]" />
          <span className="text-[11px] font-semibold text-[#fabc4d] tracking-wide hidden xs:inline">
            Pix conectado
          </span>
          <span className="text-[10px] font-semibold text-[#fabc4d] tracking-wide xs:hidden">
            Pix
          </span>
        </div>
      </div>

      {/* Right items */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* LGPD Global Privacy Mode Toggle */}
        {onTogglePrivacyMode && (
          <button
            type="button"
            onClick={onTogglePrivacyMode}
            className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              privacyMode
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-600/30 hover:bg-emerald-900/40'
                : 'bg-[#1c1b1c] text-[#8f9194] border-white/10 hover:text-white hover:border-white/20'
            }`}
            title={
              privacyMode
                ? 'Modo Privacidade LGPD Ativo (dados sensíveis mascarados). Clique para revelar.'
                : 'Modo Privacidade LGPD Inativo. Clique para mascarar dados sensíveis.'
            }
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
              {privacyMode ? 'visibility_off' : 'visibility'}
            </span>
            <span className="hidden sm:inline">
              {privacyMode ? 'Privacidade LGPD' : 'Dados Abertos'}
            </span>
          </button>
        )}

        {/* LGPD Portal Trigger */}
        {onOpenLgpdPortal && (
          <button
            type="button"
            onClick={onOpenLgpdPortal}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#1c1b1c] hover:bg-[#201f20] border border-white/10 text-[#fabc4d] flex items-center justify-center transition-colors cursor-pointer"
            title="Portal de Governança LGPD (Art. 18)"
          >
            <span className="material-symbols-outlined text-[18px]">shield</span>
          </button>
        )}

        {/* Switch perspective button ONLY in Demo Mode */}
        {isDemoMode && onSwitchToClientFlow && (
          <button
            type="button"
            onClick={onSwitchToClientFlow}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#fabc4d]/15 hover:bg-[#fabc4d]/25 text-[#fabc4d] text-xs font-semibold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 border border-[#fabc4d]/30 transition-all cursor-pointer"
            title="Visualizar a experiência pelo smartphone do cliente"
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">smartphone</span>
            <span className="hidden md:inline">Ver Fluxo do Cliente</span>
            <span className="md:hidden text-[11px]">Cliente</span>
          </button>
        )}

        {/* User profile */}
        <button
          type="button"
          onClick={onOpenAuth}
          className="flex items-center gap-2 sm:gap-2.5 px-1.5 sm:px-2.5 py-1.5 rounded-xl hover:bg-[#1c1b1c] transition-colors cursor-pointer text-left"
          title="Minha conta"
        >
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-xs font-semibold text-white leading-tight">
              {currentUser?.name || 'Kaelen Vance'}
            </span>
            <span className="text-[10px] text-[#8f9194]">
              {currentUser?.studioName || currentStudio?.name || 'Atelier Jardins'}
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-[#fabc4d]/15 border border-[#fabc4d]/30 flex items-center justify-center text-[#fabc4d] font-bold text-xs shrink-0">
            {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'KV'}
          </div>
        </button>
      </div>
    </header>
  );
};
