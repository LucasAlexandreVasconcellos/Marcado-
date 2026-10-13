import React, { useState } from 'react';
import { Studio } from '../../types/index.ts';

interface StudiosViewProps {
  studios: Studio[];
  activeStudioId: string;
  onSelectStudio: (studio: Studio) => void;
  onAddStudio: (studio: Studio) => void;
  onShowToast: (msg: string) => void;
}

export const StudiosView: React.FC<StudiosViewProps> = ({
  studios,
  activeStudioId,
  onSelectStudio,
  onAddStudio,
  onShowToast,
}) => {
  const [studioName, setStudioName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [slug, setSlug] = useState('');
  const [city, setCity] = useState('');
  const [depositRate, setDepositRate] = useState(30);
  const [cancellationPolicy, setCancellationPolicy] = useState('48');

  const handleCreateStudio = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '') || 'novo-atelier';
    const newStudio: Studio = {
      id: `st-${Date.now()}`,
      code: `AT-0${studios.length + 1}`,
      name: studioName,
      location: city || 'São Paulo, SP',
      isPrimary: false,
      residentsCount: 1,
      presenceRate: 90.0,
      pixMeshStatus: 'Instantâneo',
      slug: `marcado.me/${cleanSlug}`,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAx5dhVWfmarfK5nfK5iwJBBXZbohLz322doUd7TMe1oqbzGVPNce23R47nIvSO82gKqoASR3-c_4R0ZtNp_Zs6guFUm33HwsXySKp5kdvhdNFrlXcmseMDETQctcdhuAhBeWkLPZBVq1okR2RbSqP3LropvyxBR7YJWDUu7C2YqnQJDiMbMH4TUVtEQeweWYohLjpePkHHAnogcPCXe7DpHVp---64fO37VakPENfQuKmp_urQaI5s',
    };

    onAddStudio(newStudio);
    onShowToast(`Nova unidade ${studioName} provisionada no cluster multi-tenant!`);
    setStudioName('');
    setTaxId('');
    setSlug('');
    setCity('');
  };

  return (
    <div className="flex flex-col w-full relative">
      <div className="px-4 sm:px-8 lg:px-12 py-8 flex flex-col gap-8 max-w-[1600px] mx-auto w-full">
        {/* Header Lead */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div className="flex flex-col max-w-2xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fabc4d]"></span>
              <span className="text-[11px] font-semibold text-[#fabc4d] uppercase tracking-widest">
                Marcado! Multi-Tenant Vault • Arquitetura Federada
              </span>
              <span className="text-[#44474a]">•</span>
              <span className="text-xs text-[#8f9194]">Ambiente Seguro</span>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl text-white font-medium tracking-tight">
              Seus Estúdios & Ateliers
            </h1>
            <p className="text-xs sm:text-sm text-[#c5c7c9] mt-1">
              Alterne entre os espaços que você administra ou crie uma nova unidade com isolamento total de dados e regras fiscais.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#1c1b1c] px-4 py-2.5 rounded-lg border border-white/5 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-[#fabc4d] animate-pulse"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold uppercase text-[#8f9194]">Chave de Sessão Master</span>
              <span className="font-mono text-xs font-semibold text-white">TN-88219-SP-AUTH</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Studios + Register Form (8 cols) & SaaS Telemetry (4 cols) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Primary Column (8 cols) */}
          <div className="xl:col-span-8 flex flex-col gap-8">
            {/* Existing Studios List */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#fabc4d] text-[18px]">domain_add</span>
                  <span>Unidades Sob Sua Chave de Acesso ({studios.length})</span>
                </h2>
                <span className="text-xs font-mono text-[#8f9194]">Cluster SP • América Latina</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studios.map((st) => {
                  const isActive = st.id === activeStudioId;
                  return (
                    <div
                      key={st.id}
                      className={`group relative rounded-xl p-5 flex flex-col justify-between transition-all border ${
                        isActive
                          ? 'bg-[#1c1b1c] border-[#fabc4d]'
                          : 'bg-[#1c1b1c] border-white/5 hover:bg-[#201f20]'
                      }`}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-start justify-between">
                          <div
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                              st.isPrimary ? 'bg-[#fabc4d]/15 text-[#fabc4d]' : 'bg-[#2a2a2b] text-[#c5c7c9]'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${st.isPrimary ? 'bg-[#fabc4d]' : 'bg-[#8f9194]'}`}
                            ></span>
                            <span>{st.isPrimary ? 'Ativo / Unidade Principal' : 'Secundário'}</span>
                          </div>
                          <span className="font-mono text-xs text-[#8f9194]">ID: {st.code}</span>
                        </div>

                        <div className="mt-4 flex gap-3.5 items-center">
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#2a2a2b] shrink-0 border border-white/5">
                            <img
                              src={st.imageUrl}
                              alt={st.name}
                              className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <h3 className="font-headline text-xl text-white group-hover:text-[#fabc4d] transition-colors truncate">
                              {st.name}
                            </h3>
                            <span className="text-xs text-[#8f9194] flex items-center gap-1 mt-0.5">
                              <span className="material-symbols-outlined text-[15px]">location_on</span>
                              {st.location}
                            </span>
                          </div>
                        </div>

                        {/* Metrics Strip */}
                        <div className="grid grid-cols-3 gap-2 mt-4 p-2.5 rounded-lg bg-[#0e0e0f] text-center border border-white/5">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-semibold uppercase text-[#8f9194]">Residentes</span>
                            <span className="text-xs font-semibold text-white mt-0.5">{st.residentsCount} Artistas</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-semibold uppercase text-[#8f9194]">Presença</span>
                            <span className="text-xs font-semibold text-[#fabc4d] mt-0.5">{st.presenceRate}%</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-semibold uppercase text-[#8f9194]">PIX Mesh</span>
                            <span className="text-xs font-semibold text-white mt-0.5">{st.pixMeshStatus}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-xs font-mono text-[#8f9194] truncate max-w-[160px]">{st.slug}</span>
                        <button
                          onClick={() => {
                            onSelectStudio(st);
                            onShowToast(`Ambiente alterado para ${st.name}!`);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1 transition-all ${
                            isActive
                              ? 'bg-[#fabc4d] text-[#281900]'
                              : 'bg-[#2a2a2b] hover:bg-[#353436] text-white'
                          }`}
                        >
                          <span>{isActive ? 'Gerenciando' : 'Acessar Gestão'}</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cadastrar Novo Estúdio / Filial Form */}
            <div className="bg-[#1c1b1c] rounded-xl p-6 sm:p-8 flex flex-col gap-6 border border-white/5 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#fabc4d] font-semibold uppercase tracking-wider mb-1">
                    <span className="material-symbols-outlined text-[18px]">add_business</span>
                    <span>Novo Ambiente Isolado</span>
                  </div>
                  <h3 className="font-headline text-2xl text-white font-medium">Cadastrar Novo Estúdio / Filial</h3>
                  <p className="text-xs text-[#8f9194] mt-0.5">
                    Provisiona automaticamente chaves PIX independentes, banco de dados isolado e agenda exclusiva.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#201f20] text-[#c5c7c9] font-mono text-[11px] self-start sm:self-auto border border-white/5">
                  <span className="material-symbols-outlined text-[14px] text-[#fabc4d]">security</span>
                  Esquema Zero-Leakage
                </span>
              </div>

              <form onSubmit={handleCreateStudio} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-[#8f9194] uppercase font-semibold">
                      Nome Fantasia do Estúdio <span className="text-[#fabc4d]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={studioName}
                      onChange={(e) => setStudioName(e.target.value)}
                      placeholder="ex: Kyoto Ink Atelier - Moema"
                      className="w-full bg-[#201f20] rounded-lg px-3.5 py-2.5 text-white text-sm border border-white/5 focus:outline-none focus:border-[#fabc4d]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-[#8f9194] uppercase font-semibold">
                      CNPJ ou CPF do Responsável Técnico <span className="text-[#fabc4d]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      placeholder="00.000.000/0001-00"
                      className="w-full bg-[#201f20] rounded-lg px-3.5 py-2.5 text-white text-sm border border-white/5 focus:outline-none focus:border-[#fabc4d]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-[#8f9194] uppercase font-semibold">
                      Slug Exclusivo do Atelier <span className="text-[#fabc4d]">*</span>
                    </label>
                    <div className="flex items-center bg-[#201f20] rounded-lg overflow-hidden border border-white/5 focus-within:border-[#fabc4d]">
                      <span className="px-3 py-2 text-[#8f9194] text-xs font-mono bg-[#0e0e0f] select-none">
                        marcado.me/
                      </span>
                      <input
                        type="text"
                        required
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="kyoto-moema"
                        className="w-full bg-transparent px-3 py-2 text-white text-sm font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-[#8f9194] uppercase font-semibold">
                      Cidade / UF da Unidade <span className="text-[#fabc4d]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="São Paulo, SP"
                      className="w-full bg-[#201f20] rounded-lg px-3.5 py-2.5 text-white text-sm border border-white/5 focus:outline-none focus:border-[#fabc4d]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="text-[#8f9194] uppercase font-semibold">Alíquota de Sinal Padrão</label>
                      <span className="text-[#fabc4d] font-semibold">{depositRate}% Sugerido</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[20, 30, 50].map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => setDepositRate(rate)}
                          className={`py-2 rounded-lg text-xs font-semibold uppercase transition-all ${
                            depositRate === rate
                              ? 'bg-[#fabc4d] text-[#281900] shadow'
                              : 'bg-[#201f20] text-[#c5c7c9] hover:bg-[#2a2a2b]'
                          }`}
                        >
                          {rate}%
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="text-[#8f9194] uppercase font-semibold">Política de Cancelamento</label>
                      <span className="text-[#8f9194]">Janela Mínima</span>
                    </div>
                    <select
                      value={cancellationPolicy}
                      onChange={(e) => setCancellationPolicy(e.target.value)}
                      className="w-full bg-[#201f20] rounded-lg px-3.5 py-2.5 text-white text-xs border border-white/5 focus:outline-none focus:border-[#fabc4d]"
                    >
                      <option value="48">48 horas de antecedência (Padrão)</option>
                      <option value="72">72 horas de antecedência (Rígido)</option>
                      <option value="24">24 horas de antecedência (Flexível)</option>
                      <option value="0">Não reembolsável (Sinal integral retido)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-[#8f9194] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-[#fabc4d]">verified</span>
                    Criação com split financeiro e subcontas Pix pré-autorizadas.
                  </span>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#fabc4d] hover:bg-[#bd8718] text-[#281900] hover:text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    <span>+ Criar Novo Espaço Exclusivo</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Secondary Column: SaaS Telemetry (4 cols) */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            <div className="bg-[#1c1b1c] rounded-xl p-5 sm:p-6 flex flex-col gap-5 border border-white/5 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#fabc4d]/15 flex items-center justify-center text-[#fabc4d]">
                    <span className="material-symbols-outlined text-[16px]">stars</span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase text-[#fabc4d] tracking-widest">Plano Ativo</span>
                </div>
                <span className="text-xs font-mono text-white px-2 py-0.5 rounded bg-[#2a2a2b]">Ciclo Anual</span>
              </div>

              <div className="flex flex-col">
                <h3 className="font-headline text-2xl text-white font-medium">Marcado! Atelier Pro</h3>
                <span className="text-xs text-[#8f9194]">Multi-Artist Edition com isolamento bancário</span>
              </div>

              {/* Capacity Bar */}
              <div className="flex flex-col gap-2 bg-[#0e0e0f] p-4 rounded-lg border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#8f9194] uppercase font-semibold">Estúdios Ativos</span>
                  <span className="text-white font-bold">{studios.length} de 5 estúdios</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#2a2a2b] overflow-hidden">
                  <div
                    className="h-full bg-[#fabc4d] rounded-full transition-all"
                    style={{ width: `${(studios.length / 5) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-[#8f9194]">
                  <span>Capacidade: {(studios.length / 5) * 100}% alocada</span>
                  <span className="text-[#fabc4d]">+{5 - studios.length} vagas disponíveis</span>
                </div>
              </div>

              {/* Guarantees */}
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <span className="material-symbols-outlined text-[#fabc4d] text-[18px] shrink-0 mt-0.5">shield_lock</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">Isolamento Criptográfico</span>
                    <span className="text-[11px] text-[#8f9194] leading-tight mt-0.5">
                      Criptografia em repouso AES-256 independente por chave tenant.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <span className="material-symbols-outlined text-[#fabc4d] text-[18px] shrink-0 mt-0.5">support_agent</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">Suporte Prioritário VIP</span>
                    <span className="text-[11px] text-[#8f9194] leading-tight mt-0.5">
                      Atendimento humano via concierge exclusivo com SLA sob 15 min.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <span className="material-symbols-outlined text-[#fabc4d] text-[18px] shrink-0 mt-0.5">account_tree</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">Separação Fiscal e DRE</span>
                    <span className="text-[11px] text-[#8f9194] leading-tight mt-0.5">
                      Livro-caixa e emissão de NFS-e dedicados por filial.
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onShowToast('Solicitação de upgrade para Enterprise encaminhada ao concierge!')}
                className="w-full py-2.5 rounded-lg bg-[#2a2a2b] hover:bg-[#353436] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">upgrade</span>
                <span>Expandir para Edição Enterprise</span>
              </button>
            </div>

            {/* Gallery Card */}
            <div className="bg-[#1c1b1c] rounded-xl p-5 flex flex-col gap-4 border border-white/5">
              <div className="relative h-44 rounded-lg overflow-hidden border border-white/10 group">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2rk4KA48P0fdFQWqznARnTijG4Zntasawc3fBPc8gFoAzZquA1mw-VUTTfLNOUu3vSV5PRP17Q2xDMXbmTDSB2uCmqlNndu4yI0GgB6klxeHK-Y01x0BGWlsxhn40We7sqRejxr4rSOCi3uchoZnwQ9iCyhWdkarKvFSj2yJS8dybyaEyAN-sSa6gO9HjUA1h1E0FFNIX1yU0ddp6DlP85yT42kcrMd0Pfoxn8YdHKKVAxNiDmVlf"
                  alt="Atelier Gallery"
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0f] via-[#0e0e0f]/40 to-transparent flex flex-col justify-end p-4">
                  <span className="text-[10px] font-semibold text-[#fabc4d] uppercase tracking-widest">
                    Padrão Marcado!
                  </span>
                  <p className="font-headline text-white text-base leading-tight mt-0.5">
                    Arquitetura de luxo para tatuadores singulares.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
