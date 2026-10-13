# Marcado Studio OS — Documento de Contexto do Projeto

Este documento reúne todo o histórico de evolução, decisões de arquitetura, refatorações realizadas e o estado técnico consolidado do projeto **Marcado Studio OS**.

---

## 1. Visão Geral da Aplicação

O **Marcado Studio OS** é uma plataforma e sistema operacional moderno voltado para estúdios e artistas de tatuagem/body art. O software resolve os dois maiores gargalos operacionais da área:
1. **Inadimplência e faltas ("no-show"):** Exigência de sinal via Pix dinâmico integrado diretamente na conta do estúdio/artista antes da confirmação do agendamento.
2. **Segurança jurídica e conformidade sanitária:** Anamnese digital obrigatória com assinatura em tela e carimbo de fé pública com hash criptográfico SHA-256 e download de certificado em PDF.

A aplicação conta com dois fluxos integrados:
- **Painel Studio OS (Desktop/Mobile):** Gestão de agenda, conciliação e liquidação Pix instantânea, roster de artistas residentes/guests, controle de ateliês e lembretes automatizados de pós-sessão via WhatsApp.
- **Fluxo do Cliente (Mobile-First):** Verificação de dados, preenchimento da ficha de anamnese com assinatura digital, pagamento instantâneo de sinal via Pix com QR Code dinâmico e tela comemorativa de confirmação com download de termo.

---

## 2. Histórico de Solicitações e Implementações

### 2.1. Refatoração do Grupo de Entrada WhatsApp (`#whatsapp-input-group`)
- **Demanda:** Transformar o campo de WhatsApp em um layout de três colunas: prefixo de país com dropdown, DDD e número de telefone, com máscara automática de entrada para o padrão brasileiro (`(XX) XXXXX-XXXX` / `(XX) XXXX-XXXX`) e alinhamento visual rigoroso.
- **Implementação:**
  - Componente criado: `src/design-system/WhatsAppInputGroup.tsx`.
  - Dropdown com seleção de países (Brasil +55 como padrão, além de Portugal, EUA, Espanha, etc., com bandeiras emoji e códigos internacionais).
  - Campo numérico com filtro de caracteres não numéricos e formatação de máscara reativa em tempo real.
  - Alinhamento de alturas, tipografia mono/sans, estados de foco em tom âmbar (`#fabc4d`) e bordas escuras coerentes com a paleta de luxo.

### 2.2. Engenharia Mobile-First em Todas as Telas
- **Demanda:** Adequar a aplicação integralmente ao paradigma mobile-first, ajustando enquadramento, espaçamentos, áreas de toque e grids responsivos.
- **Implementação:**
  - **Sidebar:** Implementação de menu gaveta lateral deslizante (*mobile drawer*) com backdrop e botão hambúrguer no cabeçalho mobile.
  - **Grids Bento:** Transição de grids rígidos para layouts fluidos: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, garantindo que cartões não quebrem em telas de 360px a 430px.
  - **Tabelas e Listas de Sessões:** Cartões expansíveis e roláveis no mobile com badges legíveis e botões com área de toque mínima de 44px.
  - **Modais e Formulários:** Ajuste dos modais (`NewSessionModal`, `LegalHashModal`, `AuthModal`) para preencher a tela confortavelmente no mobile com rolagem vertical suave e botões de ação fixados ou acessíveis no rodapé.
  - **Fluxo do Cliente:** Otimização para navegação vertical em dispositivos móveis, com botões de cópia de chave Pix em 1 toque e canvas de assinatura sensível a toque (*touch-action: none*).

### 2.3. Configuração Git e Deploy para o GitHub
- **Demanda:** Subir todo o código do projeto para o repositório remoto: `https://github.com/LucasAlexandreVasconcellos/Marcado-.git`.
- **Processo e Resoluções:**
  - Inicialização do repositório local e criação da branch `main`.
  - Configuração do `.gitignore` para ignorar `node_modules`, `.env`, `.aistudio/` e logs.
  - Alinhamento com o histórico pré-existente no GitHub via rebase (`git rebase origin/main`).
  - **Tratamento de Permissões de Token:**
    - O token inicial (*Fine-grained*) retornou `403 Forbidden` devido à ausência do escopo `contents=write`.
    - Foi substituído pelo token Classic com o escopo `repo` completo.
  - **Push Inicial Concluído:** Commit `e92cef5` (`feat: initial commit - Marcado Studio OS mobile-first application`) enviado com sucesso contendo todos os 43 arquivos do projeto.
  - **Segurança:** Sanitização imediata da URL do remote para remover tokens da configuração local do Git.

### 2.4. Integração da Biblioteca `framer-motion` e Variante `ease-out-expo`
- **Demanda:** Instalar a biblioteca `framer-motion` no projeto e adicionar transições suaves de entrada para os cartões de indicadores no dashboard, utilizando a variante `ease-out-expo`.
- **Implementação:**
  - Instalação oficial do pacote `framer-motion` via npm.
  - Criação do módulo `src/design-system/motionVariants.ts`:
    - Curva `EASE_OUT_EXPO`: Definida como `[0.16, 1, 0.3, 1]`, entregando uma desaceleração ultra suave e premium.
    - `indicatorContainerVariants`: Efeito de cascata escalonada (*staggerChildren: 0.09s*, *delayChildren: 0.05s*).
    - `indicatorCardVariants`: Entrada suave com deslocamento no eixo Y (`y: 22 ➔ 0`), desvanecimento de opacidade (`0 ➔ 1`) e microescala (`0.97 ➔ 1`) com duração de 0.75s.
    - Micro-interação de hover (`whileHover: { y: -3, transition: { duration: 0.3, ease: EASE_OUT_EXPO } }`).
  - **Aplicação no Dashboard:**
    - **`AgendaView.tsx`:** Cartões de *Presença nas Sessões*, *Sinais Recebidos*, *Capacidade Semanal* e *Termos Assinados*, incluindo animações sincronizadas das barras de progresso internas.
    - **`PixFinanceView.tsx`:** Cartões de *Tempo Médio de Confirmação*, *Volume de Sinais Recebidos*, *Taxa de Conversão de QR* e *Segurança Antifraude*.
  - Padronização de todas as importações do ecossistema de animações para `framer-motion`.
  - Atualização com novo commit `c0e44b8` enviado para o repositório remoto no GitHub.

---

## 3. Stack Tecnológica e Bibliotecas

| Categoria | Tecnologia / Biblioteca | Finalidade |
|---|---|---|
| **Core Framework** | React 19 + TypeScript | SPA reativa tipada de alta performance |
| **Bundler & Dev Server** | Vite 8 + ESBuild | Inicialização e compilação instantânea |
| **Estilização** | Tailwind CSS v4 | Utilitários de design atômico e responsividade |
| **Animações** | `framer-motion` | Micro-interações, orquestração e curva `ease-out-expo` |
| **Gráficos 3D** | Three.js (lazy-loaded) | Visualização 3D interativa da máquina rotativa de tattoo |
| **Ícones** | Google Material Symbols & Lucide React | Iconografia técnica de dashboard |
| **Utilitários** | `canvas-confetti`, `date-fns` | Efeito festivo de conclusão e manipulação de datas |
| **Geração de PDF** | `pdfCertificate.ts` | Geração do certificado de anamnese com hash SHA-256 |

---

## 4. Estrutura de Diretórios do Projeto

```
/
├── index.html                           # Entry point HTML com metadados e fontes
├── package.json                         # Dependências e scripts do projeto
├── tsconfig.json                        # Configuração do TypeScript
├── vite.config.ts                       # Configurações do Vite e Tailwind
├── .gitignore                           # Ignora node_modules, build e artefatos
├── CONTEXTO_PROJETO.md                  # Este documento de contexto consolidado
└── src/
    ├── main.tsx                         # Renderização raiz do React
    ├── App.tsx                          # Estado central, alternância Studio OS vs Cliente
    ├── index.css                        # Importação do Tailwind CSS e fontes tipográficas
    ├── types/
    │   └── index.ts                     # Interfaces (Session, Artist, Studio, WebhookLog, etc.)
    ├── utils/
    │   ├── formatters.ts                # Moeda (BRL), datas, iniciais e cores de avatar
    │   ├── storage.ts                   # Persistência via LocalStorage e gerador de hashes
    │   └── pdfCertificate.ts            # Gerador de termo de consentimento com certificado
    ├── design-system/
    │   ├── tokens.ts                    # Paleta de cores (âmbar #fabc4d, fundos #121213, etc.)
    │   ├── motionVariants.ts            # Variantes de animação e curva cubic-bezier ease-out-expo
    │   ├── Badge.tsx                    # Badges com pontos de status coloridos
    │   ├── Button.tsx                   # Botões táteis com estados de loading e variantes
    │   ├── CurrencyInput.tsx            # Campo formatado para moeda brasileira (R$)
    │   ├── CustomDatePicker.tsx         # Seletor de data moderno
    │   ├── CustomTimePicker.tsx         # Seletor de horário com grade de turnos
    │   ├── EmptyState.tsx               # Estados vazios estilizados
    │   ├── Input.tsx                    # Campo de texto padrão
    │   ├── Skeleton.tsx                 # Esqueletos de carregamento
    │   ├── Tabs.tsx                     # Abas de navegação com contadores
    │   └── WhatsAppInputGroup.tsx       # Prefixo internacional + DDD + Número com máscara
    └── components/
        ├── auth/
        │   ├── AuthPage.tsx             # Tela de login/cadastro dividida com máquina 3D
        │   └── Scene3D.tsx              # Renderizador Three.js rotativo de máquina de tattoo
        ├── client/
        │   ├── ClientFlow.tsx           # Orquestrador do fluxo guiado do cliente
        │   ├── Step1Verification.tsx    # Confirmação de dados pessoais e projeto
        │   ├── Step2Anamnese.tsx        # Ficha de saúde com assinatura digital touch/mouse
        │   ├── Step3PixPayment.tsx      # Pagamento Pix com QR Code dinâmico e cópia
        │   └── Step4Confirmation.tsx    # Tela de sucesso com confetti e download de termo
        └── studio/
            ├── StudioSidebar.tsx        # Navegação lateral desktop e gaveta mobile
            ├── StudioHeader.tsx         # Barra superior com seletor de perspectiva e perfil
            ├── AgendaView.tsx           # Dashboard principal com KPIs animados em ease-out-expo
            ├── PixFinanceView.tsx       # Conciliação de sinais, métricas e simulador de webhook
            ├── ArtistsView.tsx          # Gestão de tatuadores residentes e comissões
            ├── StudiosView.tsx          # Gestão de múltiplos ateliês/unidades
            ├── RemindersView.tsx        # Disparo de lembretes pós-procedimento
            ├── NewSessionModal.tsx      # Modal de cadastro de nova sessão com cálculo de sinal
            ├── LegalHashModal.tsx       # Visualizador do hash SHA-256 e auditoria jurídica
            └── AuthModal.tsx            # Modal de autenticação rápido
```

---

## 5. Scripts Disponíveis

- `npm run dev`: Inicia o servidor local de desenvolvimento na porta 3000.
- `npm run build`: Compila a aplicação otimizada para produção via Vite.
- `npm run preview`: Executa a versão compilada de produção localmente.
- `npm run lint`: Valida o TypeScript em todo o código-fonte (`tsc --noEmit`).

---

## 6. Repositório Oficial

- **URL:** [https://github.com/LucasAlexandreVasconcellos/Marcado-](https://github.com/LucasAlexandreVasconcellos/Marcado-)
- **Branch de produção:** `main`
- **Últimos commits sincronizados:**
  - `e92cef5`: `feat: initial commit - Marcado Studio OS mobile-first application`
  - `c0e44b8`: `feat: implement framer-motion with ease-out-expo dashboard indicator animations`
