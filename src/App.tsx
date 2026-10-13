import { useState, useEffect } from 'react';
import { Session, Artist, Studio, WebhookLog, ReminderTemplate, StudioUser } from './types/index.ts';
import {
  getStoredSessions,
  saveSessions,
  getStoredArtists,
  saveArtists,
  getStoredStudios,
  saveStudios,
  getStoredLogs,
  saveLogs,
  getStoredReminders,
  saveReminders,
  getStoredUser,
  saveUser,
} from './utils/storage.ts';

// Studio components
import { StudioSidebar, StudioTab } from './components/studio/StudioSidebar.tsx';
import { StudioHeader } from './components/studio/StudioHeader.tsx';
import { AgendaView } from './components/studio/AgendaView.tsx';
import { RemindersView } from './components/studio/RemindersView.tsx';
import { ArtistsView } from './components/studio/ArtistsView.tsx';
import { PixFinanceView } from './components/studio/PixFinanceView.tsx';
import { StudiosView } from './components/studio/StudiosView.tsx';
import { NewSessionModal } from './components/studio/NewSessionModal.tsx';
import { LegalHashModal } from './components/studio/LegalHashModal.tsx';

// Split Auth Page (with lazy Three.js rotary pen)
import { AuthPage } from './components/auth/AuthPage.tsx';

// Client components
import { ClientFlow } from './components/client/ClientFlow.tsx';

export default function App() {
  // Demo mode detection via ?demo=1
  const isDemoMode =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('demo') === '1';

  // Perspective: Studio OS ou Cliente Mobile
  const [perspective, setPerspective] = useState<'studio' | 'client'>('studio');
  const [studioTab, setStudioTab] = useState<StudioTab>('agenda');
  const [showAuthPage, setShowAuthPage] = useState(false);

  // Persisted state
  const [sessions, setSessions] = useState<Session[]>(getStoredSessions);
  const [artists, setArtists] = useState<Artist[]>(getStoredArtists);
  const [studios, setStudios] = useState<Studio[]>(() => {
    const list = getStoredStudios();
    const user = getStoredUser();
    if (user?.studioName && user.studioName.trim()) {
      const target = user.studioName.trim();
      const match = list.find((s) => s.name.trim().toLowerCase() === target.toLowerCase());
      if (!match) {
        const synthesized: Studio = {
          id: `st-${Date.now()}`,
          code: `TN-${Math.floor(10000 + Math.random() * 90000)}-BR`,
          name: target,
          location: 'São Paulo, SP',
          isPrimary: list.length === 0,
          residentsCount: 1,
          presenceRate: 95,
          pixMeshStatus: 'Conectado',
          slug: target.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'estudio',
          imageUrl:
            'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80',
        };
        const updated = [synthesized, ...list];
        saveStudios(updated);
        return updated;
      }
    }
    return list;
  });
  const [logs, setLogs] = useState<WebhookLog[]>(getStoredLogs);
  const [reminders, setReminders] = useState<ReminderTemplate[]>(getStoredReminders);
  const [currentUser, setCurrentUser] = useState<StudioUser>(getStoredUser);

  // Selected session for client flow inspection
  const [selectedSession, setSelectedSession] = useState<Session>(sessions[0] || ({} as Session));
  const [clientInitialStep, setClientInitialStep] = useState<number>(1);

  // Modals & UI helpers
  const [isNewSessionOpen, setIsNewSessionOpen] = useState(false);
  const [legalHashSession, setLegalHashSession] = useState<Session | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Active studio (defaults to currentUser.studioName if present, else studios[0])
  const [activeStudio, setActiveStudio] = useState<Studio>(() => {
    const list = getStoredStudios();
    const user = getStoredUser();
    if (user?.studioName && user.studioName.trim()) {
      const target = user.studioName.trim();
      const match = list.find((s) => s.name.trim().toLowerCase() === target.toLowerCase());
      if (match) return match;
      const synthesized: Studio = {
        id: `st-${Date.now()}`,
        code: `TN-${Math.floor(10000 + Math.random() * 90000)}-BR`,
        name: target,
        location: 'São Paulo, SP',
        isPrimary: true,
        residentsCount: 1,
        presenceRate: 95,
        pixMeshStatus: 'Conectado',
        slug: target.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'estudio',
        imageUrl:
          'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80',
      };
      return synthesized;
    }
    return list[0] || ({} as Studio);
  });

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    saveArtists(artists);
  }, [artists]);

  useEffect(() => {
    saveStudios(studios);
  }, [studios]);

  useEffect(() => {
    saveLogs(logs);
  }, [logs]);

  useEffect(() => {
    saveReminders(reminders);
  }, [reminders]);

  useEffect(() => {
    saveUser(currentUser);
  }, [currentUser]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleSessionCreated = (newSession: Session) => {
    const updated = [newSession, ...sessions];
    setSessions(updated);
    setSelectedSession(newSession);
    showToast(`Link seguro gerado para ${newSession.clientName}!`);
  };

  const handleSessionUpdated = (updatedSession: Session) => {
    const updated = sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s));
    setSessions(updated);
    setSelectedSession(updatedSession);
  };

  const handleAddArtist = (newArtist: Artist) => {
    const updated = [newArtist, ...artists];
    setArtists(updated);
  };

  /**
   * Unified atomic studio initialization and activation.
   * Handles both login/auth and manual creation flows in a single synchronized sequence,
   * guaranteeing that `setStudios` and `setActiveStudio` are updated together to prevent
   * UI desync between the header dropdown and the active session context.
   */
  const initializeUserStudio = (
    studioTarget: string | Studio,
    options?: {
      toastMessage?: string;
      syncCurrentUser?: boolean;
    }
  ): Studio => {
    const isStudioObject = typeof studioTarget !== 'string';
    const targetName = (isStudioObject ? studioTarget.name : studioTarget)?.trim() || 'Meu Estúdio';
    const targetNameLower = targetName.toLowerCase();

    // Source of truth: current list from state (or storage fallback)
    const currentList = studios.length > 0 ? studios : getStoredStudios();

    // Check if studio already exists (by ID if object, or by case-insensitive name)
    const existingIndex = currentList.findIndex((s) =>
      (isStudioObject && s.id === studioTarget.id) ||
      s.name.trim().toLowerCase() === targetNameLower
    );

    let finalStudio: Studio;
    let nextList: Studio[];

    if (existingIndex !== -1) {
      finalStudio = isStudioObject ? studioTarget : currentList[existingIndex];
      if (isStudioObject) {
        nextList = [...currentList];
        nextList[existingIndex] = studioTarget;
      } else {
        nextList = currentList;
      }
    } else {
      finalStudio = isStudioObject
        ? studioTarget
        : {
            id: `st-${Date.now()}`,
            code: `TN-${Math.floor(10000 + Math.random() * 90000)}-BR`,
            name: targetName,
            location: 'São Paulo, SP',
            isPrimary: currentList.length === 0,
            residentsCount: 1,
            presenceRate: 95,
            pixMeshStatus: 'Conectado',
            slug:
              targetName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') ||
              'estudio',
            imageUrl:
              'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80',
          };
      nextList = [finalStudio, ...currentList];
    }

    // Atomic synchronized state updates
    setStudios(nextList);
    saveStudios(nextList);
    setActiveStudio(finalStudio);

    // Sincronizar studioName do usuário se requisitado
    if (options?.syncCurrentUser !== false) {
      setCurrentUser((prev) => {
        if (prev.studioName === finalStudio.name) return prev;
        const updatedUser = { ...prev, studioName: finalStudio.name };
        saveUser(updatedUser);
        return updatedUser;
      });
    }

    if (options?.toastMessage) {
      showToast(options.toastMessage);
    }

    return finalStudio;
  };

  const handleAddStudio = (newStudio: Studio) => {
    initializeUserStudio(newStudio, {
      toastMessage: `Unidade "${newStudio.name}" criada e ativada.`,
      syncCurrentUser: true,
    });
  };

  const handleSelectStudio = (st: Studio) => {
    initializeUserStudio(st, {
      toastMessage: `Estúdio "${st.name}" selecionado.`,
      syncCurrentUser: true,
    });
  };

  useEffect(() => {
    if (!currentUser?.studioName || !currentUser.studioName.trim()) return;

    initializeUserStudio(currentUser.studioName, {
      syncCurrentUser: false,
    });
  }, [currentUser?.studioName]);

  const handleTriggerSimulatedPayment = () => {
    const newLog: WebhookLog = {
      id: `log-${Date.now()}`,
      e2eId: `E2E${Date.now()}`,
      timestamp: 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      amount: 350,
      latency: '1.1s',
      statusText: 'COMPENSADO',
      sessionTitle: '#SES-TEST • Simulação Pix',
      clientInfo: 'Marina Valadares (Art: Kaelen)',
      hash: 'b6f4e18774...207b9a8c',
    };
    setLogs([newLog, ...logs]);

    const updated = sessions.map((s) => {
      if (s.status === 'pix_pendente') {
        return { ...s, status: 'confirmada' as const };
      }
      return s;
    });
    setSessions(updated);
    showToast('Sinal Pix compensado! Sessões pendentes confirmadas.');
  };

  const openClientFlow = (session: Session, step: number = 1) => {
    setSelectedSession(session);
    setClientInitialStep(step);
    setPerspective('client');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (user: StudioUser) => {
    setCurrentUser(user);
    saveUser(user);
    setShowAuthPage(false);

    const targetStudioName = user.studioName?.trim() || 'Meu Estúdio';
    initializeUserStudio(targetStudioName, {
      toastMessage: `Bem-vindo, ${user.name}! Ateliê "${targetStudioName}" ativado.`,
      syncCurrentUser: false,
    });
  };

  // If Auth Page is requested
  if (showAuthPage) {
    return (
      <AuthPage
        onSuccess={handleAuthSuccess}
        onCancel={() => setShowAuthPage(false)}
        defaultMode="login"
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#131314] text-[#e5e2e3] font-sans antialiased relative flex flex-col">
      {/* Floating Perspective Switcher: Visible ONLY in Demo Mode (?demo=1) */}
      {isDemoMode && (
        <div className="fixed bottom-20 left-3 sm:bottom-4 sm:left-4 z-40">
          <div className="bg-[#1c1b1c]/95 backdrop-blur-xl border border-[#fabc4d]/30 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl shadow-2xl flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={() => setPerspective('studio')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer ${
                perspective === 'studio'
                  ? 'bg-[#fabc4d] text-[#281900] shadow'
                  : 'text-[#8f9194] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px] sm:text-[16px]">domain</span>
              <span>Studio OS</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setClientInitialStep(1);
                setPerspective('client');
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer ${
                perspective === 'client'
                  ? 'bg-[#fabc4d] text-[#281900] shadow'
                  : 'text-[#8f9194] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px] sm:text-[16px]">smartphone</span>
              <span>Cliente Mobile</span>
            </button>
          </div>
        </div>
      )}

      {/* PERSPECTIVE: STUDIO MANAGEMENT OS */}
      {perspective === 'studio' && (
        <div className="flex w-full min-h-screen relative">
          {/* Fixed Desktop Sidebar (100vh, never scrolls with the page) */}
          <div className="hidden lg:block">
            <StudioSidebar
              activeTab={studioTab}
              onTabChange={(tab) => setStudioTab(tab)}
              onOpenNewSession={() => setIsNewSessionOpen(true)}
              onOpenAuth={() => setShowAuthPage(true)}
              currentUser={currentUser}
              studioName={activeStudio.name}
              isDemoMode={isDemoMode}
            />
          </div>

          {/* Mobile Sidebar Overlay (Slide-over drawer) */}
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <div className="w-72 max-w-[85vw] h-full bg-[#0e0e0f] border-r border-white/10 z-10 shadow-2xl animate-fadeIn">
                <StudioSidebar
                  activeTab={studioTab}
                  onTabChange={(tab) => {
                    setStudioTab(tab);
                    setMobileSidebarOpen(false);
                  }}
                  onOpenNewSession={() => {
                    setIsNewSessionOpen(true);
                    setMobileSidebarOpen(false);
                  }}
                  onOpenAuth={() => {
                    setShowAuthPage(true);
                    setMobileSidebarOpen(false);
                  }}
                  onCloseMobile={() => setMobileSidebarOpen(false)}
                  isMobileDrawer={true}
                  currentUser={currentUser}
                  studioName={activeStudio.name}
                  isDemoMode={isDemoMode}
                />
              </div>
              <div
                className="flex-1 bg-black/80 backdrop-blur-sm"
                onClick={() => setMobileSidebarOpen(false)}
              />
            </div>
          )}

          {/* Main Studio Viewport (Offset by lg:pl-64 to account for fixed 100vh sidebar) */}
          <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
            <StudioHeader
              currentStudio={activeStudio}
              studios={studios}
              onSelectStudio={handleSelectStudio}
              onToggleSidebarMobile={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              onSwitchToClientFlow={() => openClientFlow(sessions[0], 1)}
              onOpenAuth={() => setShowAuthPage(true)}
              onManageStudios={() => setStudioTab('studios')}
              isDemoMode={isDemoMode}
              currentUser={currentUser}
            />

            <main className="flex-1 pb-24 lg:pb-16">
              {studioTab === 'agenda' && (
                <AgendaView
                  sessions={sessions}
                  onOpenNewSession={() => setIsNewSessionOpen(true)}
                  onViewLegalHash={(session) => setLegalHashSession(session)}
                  onOpenClientFlow={(session, step) => openClientFlow(session, step || 1)}
                  onShowToast={showToast}
                  isDemoMode={isDemoMode}
                  studioName={activeStudio.name}
                />
              )}

              {studioTab === 'reminders' && (
                <RemindersView
                  reminders={reminders}
                  onUpdateReminders={(updated) => setReminders(updated)}
                  onShowToast={showToast}
                  studioName={activeStudio.name}
                />
              )}

              {studioTab === 'artists' && (
                <ArtistsView
                  artists={artists}
                  onAddArtist={handleAddArtist}
                  onShowToast={showToast}
                />
              )}

              {studioTab === 'pix' && (
                <PixFinanceView
                  logs={logs}
                  onTriggerSimulatedPayment={handleTriggerSimulatedPayment}
                  onShowToast={showToast}
                />
              )}

              {studioTab === 'studios' && (
                <StudiosView
                  studios={studios}
                  activeStudioId={activeStudio?.id}
                  onSelectStudio={handleSelectStudio}
                  onAddStudio={handleAddStudio}
                  onShowToast={showToast}
                />
              )}
            </main>

            {/* Mobile Bottom Navigation Bar (Visible ONLY on mobile/tablet < lg) */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#131314]/95 backdrop-blur-2xl border-t border-white/10 px-2 py-1.5 flex items-center justify-around shadow-[0_-8px_24px_rgba(0,0,0,0.6)]">
              <button
                type="button"
                onClick={() => setStudioTab('agenda')}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                  studioTab === 'agenda'
                    ? 'text-[#fabc4d]'
                    : 'text-[#8f9194] hover:text-white'
                }`}
                title="Agenda & Sessões"
              >
                <span className="material-symbols-outlined text-[22px]">calendar_month</span>
                <span className="text-[10px] font-semibold tracking-tight mt-0.5">Agenda</span>
              </button>

              <button
                type="button"
                onClick={() => setStudioTab('reminders')}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                  studioTab === 'reminders'
                    ? 'text-[#fabc4d]'
                    : 'text-[#8f9194] hover:text-white'
                }`}
                title="Lembretes WhatsApp"
              >
                <span className="material-symbols-outlined text-[22px]">notifications_active</span>
                <span className="text-[10px] font-semibold tracking-tight mt-0.5">Lembretes</span>
              </button>

              {/* Central Raised Gold Action Button: Nova Sessão */}
              <button
                type="button"
                onClick={() => setIsNewSessionOpen(true)}
                className="w-12 h-12 -mt-4 rounded-2xl bg-[#fabc4d] text-[#281900] shadow-[0_4px_18px_rgba(250,188,77,0.45)] flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                title="Criar Nova Sessão"
              >
                <span className="material-symbols-outlined text-[26px] font-bold">add</span>
              </button>

              <button
                type="button"
                onClick={() => setStudioTab('artists')}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                  studioTab === 'artists'
                    ? 'text-[#fabc4d]'
                    : 'text-[#8f9194] hover:text-white'
                }`}
                title="Tatuadores Residentes"
              >
                <span className="material-symbols-outlined text-[22px]">palette</span>
                <span className="text-[10px] font-semibold tracking-tight mt-0.5">Residentes</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[#8f9194] hover:text-white transition-all cursor-pointer"
                title="Mais opções e estúdios"
              >
                <span className="material-symbols-outlined text-[22px]">more_horiz</span>
                <span className="text-[10px] font-semibold tracking-tight mt-0.5">Menu</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* PERSPECTIVE: CLIENT SMARTPHONE FLOW (Mobile-First, max 480px, no studio leaks) */}
      {perspective === 'client' && (
        <ClientFlow
          session={selectedSession}
          initialStep={clientInitialStep}
          onExit={isDemoMode ? () => setPerspective('studio') : undefined}
          onSessionUpdated={handleSessionUpdated}
          onShowToast={showToast}
          studioName={activeStudio.name}
          isDemoMode={isDemoMode}
        />
      )}

      {/* Modals */}
      <NewSessionModal
        isOpen={isNewSessionOpen}
        onClose={() => setIsNewSessionOpen(false)}
        onSessionCreated={handleSessionCreated}
        onOpenClientFlowPreview={(session) => openClientFlow(session, 1)}
        studioName={activeStudio.name}
      />

      <LegalHashModal
        session={legalHashSession}
        onClose={() => setLegalHashSession(null)}
      />

      {/* Notification Toast */}
      {toast && (
        <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 bg-[#1c1b1c] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-white/10 transition-all animate-fadeIn">
          <span className="material-symbols-outlined text-[#fabc4d] text-[20px]">check_circle</span>
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}
    </div>
  );
}
