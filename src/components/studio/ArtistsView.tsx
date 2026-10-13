import React, { useState } from 'react';
import { Artist } from '../../types/index.ts';

interface ArtistsViewProps {
  artists: Artist[];
  onAddArtist: (artist: Artist) => void;
  onShowToast: (msg: string) => void;
}

export const ArtistsView: React.FC<ArtistsViewProps> = ({ artists, onAddArtist, onShowToast }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Drawer form state
  const [fullName, setFullName] = useState('');
  const [artisticName, setArtisticName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'Master / Sócio' | 'Residente Fixo' | 'Guest Artist' | 'Aprendiz'>('Residente Fixo');
  const [style, setStyle] = useState('');
  const [pixRule, setPixRule] = useState<'central' | 'direct'>('central');
  const [splitVal, setSplitVal] = useState(70);
  const [fixedRent, setFixedRent] = useState(false);

  const filteredArtists = artists.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.style.toLowerCase().includes(q);
  });

  const handleRegisterArtist = (e: React.FormEvent) => {
    e.preventDefault();
    const newArtist: Artist = {
      id: `art-${Date.now()}`,
      name: artisticName || fullName,
      signatureName: artisticName || fullName,
      email: email || `${(artisticName || fullName).toLowerCase().replace(/\s+/g, '')}@marcado.me`,
      phone: phone || '(11) 98765-4321',
      role,
      style: style || 'Blackwork Contemporâneo',
      avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBfGHauf4TJoVOC5-oFjwQFfrZRon4Lzp3rJbkS5lcE2VF5O9kXZyF4qQmpu5yuJ0UhNIZaDIm-D_bLScryHNf2kkfWKi2j2MXn8pXGPLIXk0PiQAaSbEheMKYvsWZCOR67U83kUZeRcsPTRQRDX4PwLrtQC2nEaxKCm66Up33HrpQhK1I6N3uAvWG4qRa6r78__KJyHOvGNTNZVyWbyJBmPLPLPanDltEPg469UpDUo5zSCZIxrHnh',
      status: 'available',
      currentBench: 'Bancada 06',
      splitRate: Number(splitVal),
      sessionsCount: 0,
      payoutEst: 0,
      pixKeyType: pixRule,
      pixKeyDesc: pixRule === 'central' ? 'Conta Central Atelier (Repasse D+1)' : 'Chave Pix Direta do Artista',
    };

    onAddArtist(newArtist);
    setIsDrawerOpen(false);
    onShowToast(`Tatuador ${newArtist.name} cadastrado com split de ${splitVal}%!`);

    // Reset form
    setFullName('');
    setArtisticName('');
    setEmail('');
    setPhone('');
    setStyle('');
  };

  return (
    <div className="flex flex-col w-full relative">
      <div className="px-4 sm:px-8 lg:px-12 py-8 flex flex-col gap-8 max-w-[1600px] mx-auto w-full">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fabc4d]"></span>
              <span className="text-[11px] font-semibold text-[#fabc4d] uppercase tracking-widest">
                Marcado! Atelier Roster • Curadoria Interna
              </span>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl text-white font-medium tracking-tight">
              Corpo Artístico & Residentes
            </h1>
            <p className="text-xs sm:text-sm text-[#c5c7c9] max-w-2xl mt-1">
              Governança de bancadas, modelos de split financeiro em tempo real e orquestração de credenciais Pix individuais para o atelier.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1c1b1c] text-[#c5c7c9] text-xs font-mono border border-white/5">
              <span className="material-symbols-outlined text-[#fabc4d] text-[18px]">verified</span>
              <span>Compliance Sanitário & Jurídico 100%</span>
            </div>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#fabc4d] hover:bg-[#bd8718] text-[#281900] hover:text-white rounded-lg font-semibold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              <span>+ Convidar / Registrar Tatuador</span>
            </button>
          </div>
        </div>

        {/* 3 Bento Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-[#1c1b1c] flex flex-col justify-between border border-white/5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase text-[#8f9194] tracking-widest">
                Elenco Contratado
              </span>
              <span className="material-symbols-outlined text-[#fabc4d] text-[22px]">diversity_3</span>
            </div>
            <div className="my-3 flex items-baseline gap-2">
              <span className="font-headline text-4xl text-white tracking-tight">05</span>
              <span className="text-xs text-[#8f9194]">/ 06 Bancadas Ativas</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#c5c7c9]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fabc4d]"></span>
                3 Residentes • 1 Sócio • 1 Guest
              </span>
              <span className="text-[#fabc4d] font-semibold">83% Ocupação</span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#1c1b1c] flex flex-col justify-between border border-white/5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase text-[#8f9194] tracking-widest">
                Horas de Bancada no Mês
              </span>
              <span className="material-symbols-outlined text-[#8f9194] text-[22px]">cloud_download</span>
            </div>
            <div className="my-3 flex items-baseline gap-2">
              <span className="font-headline text-4xl text-white tracking-tight">184h</span>
              <span className="text-xs text-[#fabc4d] font-medium">+14.2% vs ciclo anterior</span>
            </div>
            <div className="w-full flex flex-col gap-1">
              <div className="w-full bg-[#353436] h-1 rounded-full overflow-hidden">
                <div className="bg-white h-full rounded-full" style={{ width: '76%' }}></div>
              </div>
              <div className="flex justify-between text-[11px] text-[#8f9194]">
                <span>Meta Ciclo: 240h</span>
                <span>76% Concluído</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#1c1b1c] flex flex-col justify-between border border-white/5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase text-[#8f9194] tracking-widest">
                Taxa de Sinais Convertidos
              </span>
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#fabc4d]/15 text-[#fabc4d]">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                <span className="text-[10px] font-semibold uppercase">Pix Instant</span>
              </div>
            </div>
            <div className="my-3 flex items-baseline gap-2">
              <span className="font-headline text-4xl text-[#fabc4d] tracking-tight">96.4%</span>
              <span className="text-xs text-[#8f9194]">162 / 168 Depósitos</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#c5c7c9]">
              <span>Tempo Médio Confirmação</span>
              <span className="text-white font-semibold">48 segundos</span>
            </div>
          </div>
        </div>

        {/* Artists Roster */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h2 className="font-headline text-2xl text-white font-medium">Artistas Cadastrados</h2>
              <span className="px-2.5 py-0.5 rounded bg-[#2a2a2b] text-white text-xs font-mono">
                {filteredArtists.length} Integrados
              </span>
            </div>

            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#8f9194] text-[18px]">search</span>
              <input
                type="text"
                placeholder="Filtrar por artista ou técnica..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#1c1b1c] pl-10 pr-4 py-2 text-white placeholder-[#8f9194]/60 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#fabc4d] w-64 md:w-80 border border-white/5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredArtists.map((artist) => (
              <div
                key={artist.id}
                className="p-5 rounded-xl bg-[#1c1b1c] hover:bg-[#201f20] transition-all flex flex-col xl:flex-row xl:items-center justify-between gap-6 border border-white/5 shadow-sm"
              >
                <div className="flex items-start md:items-center gap-4 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={artist.avatarUrl}
                      alt={artist.name}
                      className="w-16 h-16 rounded-lg object-cover grayscale contrast-125 border border-white/10"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#0e0e0f] flex items-center justify-center">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          artist.status === 'in_session'
                            ? 'bg-[#ffb4ab]'
                            : artist.status === 'available'
                            ? 'bg-[#fabc4d]'
                            : 'bg-[#8f9194]'
                        }`}
                      ></span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-lg text-white">{artist.name}</h3>
                      <span className="px-2 py-0.5 rounded bg-[#2a2a2b] text-[#fabc4d] text-[10px] font-semibold uppercase">
                        {artist.role}
                      </span>
                      {artist.status === 'in_session' && (
                        <span className="px-2 py-0.5 rounded bg-[#93000a]/40 text-[#ffb4ab] text-[10px] font-semibold uppercase flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab]"></span>
                          Em Sessão ({artist.currentBench || 'Bancada 01'})
                        </span>
                      )}
                      {artist.status === 'available' && (
                        <span className="px-2 py-0.5 rounded bg-[#2a2a2b] text-white text-[10px] font-semibold uppercase flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#fabc4d]"></span>
                          Disponível
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#c5c7c9]">
                      <span className="flex items-center gap-1 text-white">
                        <span className="material-symbols-outlined text-[#8f9194] text-[16px]">brush</span>
                        {artist.style}
                      </span>
                      <span className="text-[#8f9194]">•</span>
                      <span className="text-[#fabc4d] font-mono text-xs">
                        marcado.me/{artist.name.toLowerCase().replace(/\s+/g, '-')}
                      </span>
                      <span className="text-[#8f9194]">•</span>
                      <span className="text-xs text-[#8f9194]">{artist.pixKeyDesc}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[#8f9194] font-mono">
                      <span className="text-white font-medium">{artist.sessionsCount} sessões no mês</span>
                      <span>•</span>
                      <span>
                        Split: <strong className="text-white">{artist.splitRate}% Artista</strong> /{' '}
                        {100 - artist.splitRate}% Atelier
                      </span>
                      <span>•</span>
                      <span>Repasse Bruto Est.: R$ {artist.payoutEst.toLocaleString('pt-BR')},00</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end xl:self-center">
                  <button
                    onClick={() => onShowToast(`Agenda de ${artist.name} sincronizada.`)}
                    className="px-3.5 py-2 rounded-lg bg-[#2a2a2b] hover:bg-[#353436] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                    <span>Agenda</span>
                  </button>
                  <button
                    onClick={() => onShowToast(`Extrato financeiro de ${artist.name} gerado.`)}
                    className="px-3.5 py-2 rounded-lg bg-[#2a2a2b] hover:bg-[#353436] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                    <span>Extrato</span>
                  </button>
                  <button
                    onClick={() => onShowToast(`Editar perfil de ${artist.name}.`)}
                    className="p-2 rounded-lg bg-[#2a2a2b] hover:bg-[#353436] text-[#8f9194] hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bench Matrix */}
        <div className="p-5 rounded-xl bg-[#1c1b1c] flex flex-col gap-4 border border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#fabc4d] text-[20px]">chair</span>
              <h3 className="font-semibold text-white text-base">Mapa de Ocupação das Bancadas Sanitárias</h3>
            </div>
            <span className="text-[10px] font-semibold uppercase text-[#8f9194] tracking-wider">
              Layout Jardins • Bloco Principal
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-lg bg-[#201f20] flex flex-col gap-1 border border-white/5">
              <span className="text-[10px] uppercase text-[#8f9194] font-semibold">Bancada 01</span>
              <span className="text-xs font-semibold text-white">Kaelen Vance</span>
              <span className="text-[11px] text-[#ffb4ab] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab]"></span> Ocupada até 17h
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#201f20] flex flex-col gap-1 border border-white/5">
              <span className="text-[10px] uppercase text-[#8f9194] font-semibold">Bancada 02</span>
              <span className="text-xs font-semibold text-white">Megan Steiner</span>
              <span className="text-[11px] text-[#fabc4d] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fabc4d]"></span> Preparação
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#201f20] flex flex-col gap-1 border border-white/5">
              <span className="text-[10px] uppercase text-[#8f9194] font-semibold">Bancada 03</span>
              <span className="text-xs font-semibold text-[#c5c7c9]">Arthur Brandão</span>
              <span className="text-[11px] text-[#8f9194] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8f9194]"></span> Folga Regular
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#201f20] flex flex-col gap-1 border border-white/5">
              <span className="text-[10px] uppercase text-[#8f9194] font-semibold">Bancada 04 (Guest)</span>
              <span className="text-xs font-semibold text-white">Raphael Silva</span>
              <span className="text-[11px] text-[#fabc4d] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fabc4d]"></span> Reservada 15/11
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#201f20] flex flex-col gap-1 border border-white/5">
              <span className="text-[10px] uppercase text-[#8f9194] font-semibold">Bancada 05</span>
              <span className="text-xs font-semibold text-white">Livia Dornelles</span>
              <span className="text-[11px] text-[#8f9194] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8f9194]"></span> Atendimento 18h
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#2a2a2b]/40 flex flex-col justify-center items-center text-center gap-0.5 border border-dashed border-white/10">
              <span className="text-[10px] uppercase text-[#8f9194]">Bancada 06</span>
              <span className="text-xs font-semibold text-[#fabc4d]">+ Disponível</span>
              <span className="text-[10px] text-[#8f9194]">Livre p/ Guest</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-Over Drawer: Registrar Tatuador */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-full sm:max-w-2xl h-full bg-[#1c1b1c] shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-white/10">
            {/* Drawer Header */}
            <div className="sticky top-0 z-10 px-5 sm:px-6 py-4 sm:py-5 bg-[#1c1b1c]/95 backdrop-blur-md flex items-center justify-between border-b border-[#353436]">
              <div className="flex flex-col min-w-0 pr-2">
                <div className="flex items-center gap-1.5 text-xs text-[#fabc4d] font-semibold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Marcado! • Novo Credenciamento</span>
                </div>
                <h2 className="font-headline text-xl sm:text-2xl text-white font-medium mt-0.5">Registrar Tatuador</h2>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-9 h-9 rounded-lg bg-[#2a2a2b] hover:bg-[#353436] flex items-center justify-center text-[#8f9194] hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Drawer Form Body */}
            <form onSubmit={handleRegisterArtist} className="p-4 sm:p-6 flex flex-col gap-6">
              {/* 01. Identificação */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-semibold uppercase text-[#8f9194] tracking-widest">
                  01. Identificação Artística & Contato
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-[#c5c7c9]">Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: Kaelen Augustus Vance"
                      className="px-3.5 py-2 bg-[#201f20] text-white text-sm rounded-lg border border-white/5 focus:outline-none focus:border-[#fabc4d]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-[#c5c7c9]">Nome Artístico / Assinatura</label>
                    <input
                      type="text"
                      required
                      value={artisticName}
                      onChange={(e) => setArtisticName(e.target.value)}
                      placeholder="Ex: Kaelen Vance"
                      className="px-3.5 py-2 bg-[#201f20] text-white text-sm rounded-lg border border-white/5 focus:outline-none focus:border-[#fabc4d]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-[#c5c7c9]">E-mail Profissional</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="artista@marcado.me"
                      className="px-3.5 py-2 bg-[#201f20] text-white text-sm rounded-lg border border-white/5 focus:outline-none focus:border-[#fabc4d]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-[#c5c7c9]">WhatsApp (Lembretes Automáticos)</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 98765-4321"
                      className="px-3.5 py-2 bg-[#201f20] text-white text-sm rounded-lg border border-white/5 focus:outline-none focus:border-[#fabc4d]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-[#c5c7c9]">Categoria de Vínculo</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="px-3.5 py-2 bg-[#201f20] text-white text-sm rounded-lg border border-white/5 focus:outline-none focus:border-[#fabc4d]"
                    >
                      <option value="Residente Fixo">Residente Fixo</option>
                      <option value="Master / Sócio">Sócio / Master</option>
                      <option value="Guest Artist">Guest Artist (Temporada)</option>
                      <option value="Aprendiz">Aprendiz / Junior</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-[#c5c7c9]">Estilo / Especialidade Predominante</label>
                    <input
                      type="text"
                      required
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      placeholder="Ex: Blackwork, Oriental, Fineline..."
                      className="px-3.5 py-2 bg-[#201f20] text-white text-sm rounded-lg border border-white/5 focus:outline-none focus:border-[#fabc4d]"
                    />
                  </div>
                </div>
              </div>

              {/* 02. Engenharia Financeira & Pix */}
              <div className="flex flex-col gap-3 pt-3 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase text-[#8f9194] tracking-widest">
                    02. Engenharia Financeira & Pix
                  </span>
                  <span className="text-xs font-semibold text-[#fabc4d]">Split Automatizado</span>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-white">Regra de Recebimento do Sinal de Agendamento</label>
                  <div className="grid grid-cols-1 gap-2">
                    <label
                      onClick={() => setPixRule('central')}
                      className={`p-3.5 rounded-lg flex items-start gap-3 cursor-pointer transition-colors border ${
                        pixRule === 'central'
                          ? 'bg-[#201f20] border-[#fabc4d]'
                          : 'bg-[#1c1b1c] border-white/5 hover:bg-[#201f20]'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={pixRule === 'central'}
                        onChange={() => setPixRule('central')}
                        className="mt-1 accent-[#fabc4d]"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">
                            Conta Central do Atelier com Repasse Programado
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-[#fabc4d]/20 text-[#fabc4d] text-[10px] font-semibold uppercase">
                            Recomendado
                          </span>
                        </div>
                        <span className="text-xs text-[#8f9194] mt-0.5">
                          O Pix cai no cofre do atelier, descontando taxa de bancada e insumos antes do crédito líquido ao tatuador em D+1.
                        </span>
                      </div>
                    </label>

                    <label
                      onClick={() => setPixRule('direct')}
                      className={`p-3.5 rounded-lg flex items-start gap-3 cursor-pointer transition-colors border ${
                        pixRule === 'direct'
                          ? 'bg-[#201f20] border-[#fabc4d]'
                          : 'bg-[#1c1b1c] border-white/5 hover:bg-[#201f20]'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={pixRule === 'direct'}
                        onChange={() => setPixRule('direct')}
                        className="mt-1 accent-[#fabc4d]"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">
                          Pix Direto na Chave Pessoal do Artista
                        </span>
                        <span className="text-xs text-[#8f9194] mt-0.5">
                          O sinal vai 100% para o artista via chave individual. A comissão do estúdio é faturada em fechamento quinzenal.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Split Slider */}
                <div className="p-4 rounded-lg bg-[#201f20] flex flex-col gap-3 border border-white/5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-white">Divisão de Comissões (Split)</label>
                    <span className="text-xs font-mono font-bold text-[#fabc4d]">
                      {splitVal}% Artista • {100 - splitVal}% Estúdio
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#8f9194] font-mono">50/50</span>
                    <input
                      type="range"
                      min={50}
                      max={90}
                      step={5}
                      value={splitVal}
                      onChange={(e) => setSplitVal(Number(e.target.value))}
                      className="w-full accent-[#fabc4d] cursor-pointer"
                    />
                    <span className="text-xs text-[#8f9194] font-mono">90/10</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#8f9194] pt-1 border-t border-white/5">
                    <span>Aluguel fixo de bancada diária?</span>
                    <label className="flex items-center gap-2 cursor-pointer text-[#c5c7c9]">
                      <input
                        type="checkbox"
                        checked={fixedRent}
                        onChange={(e) => setFixedRent(e.target.checked)}
                        className="accent-[#fabc4d] rounded"
                      />
                      <span>Taxa de R$ 180/dia (Guest)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 03. Portfólio */}
              <div className="flex flex-col gap-3 pt-3 border-t border-white/5">
                <span className="text-[10px] font-semibold uppercase text-[#8f9194] tracking-widest">
                  03. Portfólio & Ativos de Imagem
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 rounded-lg bg-[#201f20] flex flex-col items-center justify-center text-center gap-1.5 border border-dashed border-white/10 hover:border-[#fabc4d] transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[#8f9194] text-[32px]">account_circle</span>
                    <span className="text-xs font-semibold text-white">Foto de Perfil Editorial</span>
                    <span className="text-[10px] text-[#8f9194]">PNG, JPG até 10MB (P&B Recomendado)</span>
                  </div>
                  <div className="p-4 rounded-lg bg-[#201f20] flex flex-col items-center justify-center text-center gap-1.5 border border-dashed border-white/10 hover:border-[#fabc4d] transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[#8f9194] text-[32px]">collections_bookmark</span>
                    <span className="text-xs font-semibold text-white">Flash Arts & Portfólio</span>
                    <span className="text-[10px] text-[#8f9194]">Subir até 12 obras de assinatura</span>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-[#1c1b1c] py-4 border-t border-[#353436] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 px-4 sm:px-6 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 mt-4">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2.5 text-xs text-[#8f9194] hover:text-white uppercase font-semibold text-center cursor-pointer"
                >
                  Descartar
                </button>
                <button
                  type="submit"
                  className="px-5 py-3 bg-[#fabc4d] text-[#281900] font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-[#bd8718] hover:text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">key</span>
                  <span>Emitir Convite Seguro com Acesso Limitado</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
