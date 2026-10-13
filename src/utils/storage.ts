import { Session, Artist, Studio, WebhookLog, ReminderTemplate, StudioUser } from '../types/index.ts';
import { getRelativeSessionDates } from './formatters.ts';

const SESSIONS_KEY = 'marcado_sessions_v2';
const ARTISTS_KEY = 'marcado_artists_v2';
const STUDIOS_KEY = 'marcado_studios_v2';
const LOGS_KEY = 'marcado_logs_v2';
const REMINDERS_KEY = 'marcado_reminders_v2';
const USER_KEY = 'marcado_user_v2';

const relDates = getRelativeSessionDates();

export const INITIAL_SESSIONS: Session[] = [
  {
    id: 'ses-1',
    token: 'tk_9a8c41e8',
    clientName: 'Marina Valadares',
    clientPhone: '+55 (11) 98422-1089',
    clientCpf: '392.481.908-12',
    clientBirthdate: '14/08/1997',
    project: 'Fechamento Antebraço — Realismo Botânico',
    dateStr: relDates.date1.dateStr,
    timeStr: relDates.date1.timeStr,
    duration: '4h 30m',
    totalAmount: 1800,
    depositAmount: 400,
    status: 'confirmada',
    artistName: 'Kaelen Vance',
    artistRole: 'Tatuador Responsável',
    shaHash: 'b6f4e18774889154a48fdf81b4dc40d9d6d3bc01bbf5815664121d4c207b9a8c',
    isRecurring: true,
    tag: 'Cliente Recorrente',
    anamneseAnswers: {
      allergies: false,
      clotting: false,
      keloids: false,
      diabetes: false,
      pregnancy: false,
      alcohol: false,
    },
    signedAt: '2026-10-12 18:42:11 UTC',
  },
  {
    id: 'ses-2',
    token: 'tk_71309921',
    clientName: 'Lucas Moretto',
    clientPhone: '+55 (11) 97130-9921',
    clientCpf: '418.992.308-54',
    clientBirthdate: '22/03/1999',
    project: 'Mini Fine Line Arquitetônico — Costela',
    dateStr: relDates.date2.dateStr,
    timeStr: relDates.date2.timeStr,
    duration: '2h 00m',
    totalAmount: 850,
    depositAmount: 200,
    status: 'pix_pendente',
    artistName: 'Kaelen Vance',
    artistRole: 'Tatuador Responsável',
    shaHash: '4f9c108a7b9319e761dfa82c9e782bca19047b198c901847c1a890efba713099',
    tag: 'Primeira Sessão',
  },
  {
    id: 'ses-3',
    token: 'tk_63114402',
    clientName: 'Camila Duarte',
    clientPhone: '+55 (11) 96311-4402',
    clientCpf: '281.339.771-08',
    clientBirthdate: '09/11/1995',
    project: 'Lettering Gótico Custom — Clavícula',
    dateStr: relDates.date3.dateStr,
    timeStr: relDates.date3.timeStr,
    duration: '3h 00m',
    totalAmount: 1200,
    depositAmount: 300,
    status: 'termo_pendente',
    artistName: 'Megan Steiner',
    artistRole: 'Residente Fine Line',
    shaHash: '63114402e1a9042f8832a819b5d742e881acee52881af01b6f4e18774889154a',
  },
  {
    id: 'ses-4',
    token: 'tk_ee52881a',
    clientName: 'Rodrigo Sampaio',
    clientPhone: '+55 (11) 98877-3319',
    clientCpf: '190.552.880-91',
    clientBirthdate: '17/01/1988',
    project: 'Oriental Ryu Dragon — Fechamento Costas (Sessão 3/6)',
    dateStr: relDates.date4.dateStr,
    timeStr: relDates.date4.timeStr,
    duration: '6h 00m',
    totalAmount: 2400,
    depositAmount: 600,
    status: 'confirmada',
    artistName: 'Kaelen Vance',
    artistRole: 'Tatuador Responsável',
    shaHash: '77e4cb91c13d76e4881a28cb719a9042f8832a819b5d742e881acee52881af01',
    isRecurring: true,
    anamneseAnswers: {
      allergies: false,
      clotting: false,
      keloids: false,
      diabetes: false,
      pregnancy: false,
      alcohol: false,
    },
    signedAt: '2026-10-10 14:15:00 UTC',
  },
];

export const INITIAL_REMINDERS: ReminderTemplate[] = [
  {
    id: 'd-2',
    title: 'Lembrete Antecipado',
    trigger: 'D-2 (48 horas antes)',
    timing: '48h antes',
    badge: 'Preparação da Pele',
    enabled: true,
    messageTemplate:
      'Olá [Nome]! Confirmando sua sessão de tatuagem no estúdio [Estudio] para [Data]. Para o melhor resultado da sua arte: beba bastante água, hidrate bem a região e durma descansado. Nos vemos em breve!',
  },
  {
    id: 'd-1',
    title: 'Véspera & Orientações',
    trigger: 'D-1 (24 horas antes)',
    timing: '24h antes',
    badge: 'Alerta de Sinal',
    enabled: true,
    messageTemplate:
      'Oi [Nome]! Falta apenas 1 dia para sua sessão de [Projeto] com [Artista] no [Estudio] ([Data]). Seu sinal de [ValorSinal] já está creditado. Recomendação fundamental: não ingerir bebidas alcoólicas nas 24h anteriores e venha bem alimentado.',
  },
  {
    id: 'dia-d',
    title: 'Dia da Sessão',
    trigger: 'Dia D (2 horas antes)',
    timing: '2h antes',
    badge: 'Check-in Imediato',
    enabled: true,
    messageTemplate:
      'Hoje é o dia, [Nome]! Sua bancada no [Estudio] já está sendo higienizada para seu horário às [Horario]. Traga seu documento com foto e venha com roupas confortáveis. Estamos te esperando!',
  },
];

export const INITIAL_ARTISTS: Artist[] = [
  {
    id: 'art-1',
    name: 'Kaelen Vance',
    signatureName: 'K. Vance',
    email: 'kaelen@marcado.me',
    phone: '+55 11 98400-3321',
    role: 'Master / Sócio',
    style: 'Dark Realism & Oriental Blackwork',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBdOpkVQqGmcSBrHDO6PWx8GVD5_IjqMAmmxuo3hRugh8dnsQ_4V6o_VxiEJHt4G3UgysLAj_dTYDNP-H05enVgC-7kZCTCdw8BDuoQwyxcTpjxx3LQsPSxng5w4gwbIQUEZVLljRYG17Cs-yog5EJhazCX6diJf6ceaF-Njpx1ZrqOicu6T6Lct1fP_uiLrxwKnBH0tCzP7Wuu6_J9l0slXt-uUV4vx9exqmjWF1LXhh9BNSXDobGJ',
    status: 'in_session',
    currentBench: 'Bancada 01 • Estúdio Jardins',
    splitRate: 70,
    sessionsCount: 14,
    payoutEst: 11450,
    pixKeyType: 'direct',
    pixKeyDesc: 'kaelen@marcado.me (EVP)',
  },
  {
    id: 'art-2',
    name: 'Megan Steiner',
    signatureName: 'M. Steiner',
    email: 'megan@marcado.me',
    phone: '+55 11 97200-1199',
    role: 'Residente Fixo',
    style: 'Fine Line Botânico & Micro-Realismo',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBGAYZzt8aBzuJuHREKTbCOuSCdYTlLcFHKeNEdfWHoFgkFDrelSeUanUQQqQHPGXee7y6gDJKfIiltmEqfwhfBo1ri4VumoPOO-qETrklmmowj1gAEsdnkGH7ByIkDanXLIlxRZo40zChwpDGwnNsbz9AkuxjtwNJRvZN_VhrLXSWLSKF31AGp7TqkSofBciLdC_0kT_dznHDJLsX2a6Tz29M5uuXkeTkXtWnzyKyzQcvDvew_ssvH',
    status: 'available',
    currentBench: 'Bancada 03 • Luz Natural',
    splitRate: 60,
    sessionsCount: 9,
    payoutEst: 6840,
    pixKeyType: 'central',
    pixKeyDesc: 'Conta Central Marcado!',
  },
];

export const INITIAL_STUDIOS: Studio[] = [
  {
    id: 'st-1',
    code: 'TN-88219-SP',
    name: 'Atelier Jardins',
    location: 'Rua Oscar Freire, 1042 — Jardins, SP',
    isPrimary: true,
    residentsCount: 4,
    presenceRate: 96,
    pixMeshStatus: 'Conectado',
    slug: 'atelier-jardins',
    imageUrl:
      'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'st-2',
    code: 'TN-99014-RJ',
    name: 'Privé Ipanema',
    location: 'Rua Garcia d’Ávila, 310 — Ipanema, RJ',
    isPrimary: false,
    residentsCount: 2,
    presenceRate: 92,
    pixMeshStatus: 'Conectado',
    slug: 'prive-ipanema',
    imageUrl:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  },
];

export const INITIAL_USER: StudioUser = {
  id: 'usr-1',
  name: 'Kaelen Vance',
  email: 'kaelen@marcado.me',
  studioName: 'Atelier Jardins',
  phone: '+55 (11) 98400-3321',
};

export const INITIAL_LOGS: WebhookLog[] = [
  {
    id: 'log-1',
    e2eId: 'E2E98410294109841',
    timestamp: 'Hoje, 11:42',
    amount: 400,
    latency: '1.2s',
    statusText: 'COMPENSADO',
    sessionTitle: '#SES-1 • Marina Valadares',
    clientInfo: 'Marina Valadares (Art: Kaelen)',
    hash: 'b6f4e18774...207b9a8c',
  },
  {
    id: 'log-2',
    e2eId: 'E2E77281900129844',
    timestamp: 'Ontem, 16:30',
    amount: 600,
    latency: '0.9s',
    statusText: 'COMPENSADO',
    sessionTitle: '#SES-4 • Rodrigo Sampaio',
    clientInfo: 'Rodrigo Sampaio (Art: Kaelen)',
    hash: '77e4cb91c1...881af01',
  },
];

export function getStoredSessions(): Session[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_SESSIONS;
  } catch {
    return INITIAL_SESSIONS;
  }
}

export function saveSessions(sessions: Session[]) {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    // noop
  }
}

export function getStoredArtists(): Artist[] {
  try {
    const raw = localStorage.getItem(ARTISTS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_ARTISTS;
  } catch {
    return INITIAL_ARTISTS;
  }
}

export function saveArtists(artists: Artist[]) {
  try {
    localStorage.setItem(ARTISTS_KEY, JSON.stringify(artists));
  } catch {
    // noop
  }
}

export function getStoredStudios(): Studio[] {
  try {
    const raw = localStorage.getItem(STUDIOS_KEY);
    let list: Studio[] = raw ? JSON.parse(raw) : [...INITIAL_STUDIOS];

    // Check if the current user has a custom studioName that isn't yet in the list
    const user = getStoredUser();
    if (user?.studioName && user.studioName.trim()) {
      const userStudioName = user.studioName.trim();
      const exists = list.some(
        (s) => s.name.toLowerCase() === userStudioName.toLowerCase()
      );
      if (!exists) {
        const userStudio: Studio = {
          id: `st-user-${Date.now()}`,
          code: `TN-${Math.floor(10000 + Math.random() * 90000)}-BR`,
          name: userStudioName,
          location: 'São Paulo, SP',
          isPrimary: true,
          residentsCount: 1,
          presenceRate: 96,
          pixMeshStatus: 'Conectado',
          slug: userStudioName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'estudio',
          imageUrl:
            'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80',
        };
        list = [userStudio, ...list];
        try {
          localStorage.setItem(STUDIOS_KEY, JSON.stringify(list));
        } catch {
          // noop
        }
      }
    }
    return list;
  } catch {
    return INITIAL_STUDIOS;
  }
}

export function saveStudios(studios: Studio[]) {
  try {
    localStorage.setItem(STUDIOS_KEY, JSON.stringify(studios));
  } catch {
    // noop
  }
}

export function getStoredLogs(): WebhookLog[] {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_LOGS;
  } catch {
    return INITIAL_LOGS;
  }
}

export function saveLogs(logs: WebhookLog[]) {
  try {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  } catch {
    // noop
  }
}

export function getStoredReminders(): ReminderTemplate[] {
  try {
    const raw = localStorage.getItem(REMINDERS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_REMINDERS;
  } catch {
    return INITIAL_REMINDERS;
  }
}

export function saveReminders(reminders: ReminderTemplate[]) {
  try {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
  } catch {
    // noop
  }
}

export function getStoredUser(): StudioUser {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : INITIAL_USER;
  } catch {
    return INITIAL_USER;
  }
}

export function saveUser(user: StudioUser) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    // Also automatically guarantee that the studio exists in studios
    if (user?.studioName && user.studioName.trim()) {
      const userStudioName = user.studioName.trim();
      const rawStudios = localStorage.getItem(STUDIOS_KEY);
      let list: Studio[] = rawStudios ? JSON.parse(rawStudios) : [...INITIAL_STUDIOS];
      const exists = list.some(
        (s) => s.name.toLowerCase() === userStudioName.toLowerCase()
      );
      if (!exists) {
        const userStudio: Studio = {
          id: `st-user-${Date.now()}`,
          code: `TN-${Math.floor(10000 + Math.random() * 90000)}-BR`,
          name: userStudioName,
          location: 'São Paulo, SP',
          isPrimary: true,
          residentsCount: 1,
          presenceRate: 96,
          pixMeshStatus: 'Conectado',
          slug: userStudioName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'estudio',
          imageUrl:
            'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80',
        };
        list = [userStudio, ...list];
        localStorage.setItem(STUDIOS_KEY, JSON.stringify(list));
      }
    }
  } catch {
    // noop
  }
}

export function generateSHA256Mock(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `${hex}${hex}e45c7198a2bb${hex}${hex}391f7a0b`.slice(0, 64);
}
