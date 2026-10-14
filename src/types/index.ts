export type SessionStatus = 'confirmada' | 'pix_pendente' | 'termo_pendente';

export interface Session {
  id: string;
  token: string;
  clientName: string;
  clientPhone: string;
  clientCpf?: string;
  clientBirthdate?: string;
  project: string;
  dateStr: string;
  timeStr: string;
  duration: string;
  totalAmount: number;
  depositAmount: number;
  status: SessionStatus;
  artistName: string;
  artistRole?: string;
  avatarUrl?: string;
  shaHash: string;
  isRecurring?: boolean;
  tag?: string;
  anamneseAnswers?: {
    allergies: boolean;
    clotting: boolean;
    keloids: boolean;
    diabetes: boolean;
    pregnancy: boolean;
    alcohol: boolean;
  };
  anamneseNotes?: string;
  signatureDataUrl?: string;
  signedAt?: string;
  isAnonymized?: boolean;
  sensitiveDataPurged?: boolean;
  lgpdAudit?: LGPDAuditRecord;
}

export interface LGPDAuditRecord {
  consentGiven: boolean;
  consentTimestamp: string;
  termsVersion: string;
  healthDataConsent: boolean;
  purpose: string;
  anonymizedAt?: string;
  sensitiveDataPurgedAt?: string;
}

export interface Artist {
  id: string;
  name: string;
  signatureName: string;
  email: string;
  phone: string;
  role: 'Master / Sócio' | 'Residente Fixo' | 'Guest Artist' | 'Aprendiz';
  style: string;
  avatarUrl: string;
  status: 'available' | 'in_session' | 'off';
  currentBench?: string;
  splitRate: number; // e.g. 70 means 70% artist, 30% studio
  sessionsCount: number;
  payoutEst: number;
  pixKeyType: 'central' | 'direct';
  pixKeyDesc: string;
}

export interface Studio {
  id: string;
  code: string;
  name: string;
  location: string;
  isPrimary: boolean;
  residentsCount: number;
  presenceRate: number;
  pixMeshStatus: string;
  slug: string;
  imageUrl: string;
}

export interface WebhookLog {
  id: string;
  e2eId: string;
  timestamp: string;
  amount: number;
  latency: string;
  statusText: string;
  sessionTitle: string;
  clientInfo: string;
  hash: string;
}

export interface ReminderTemplate {
  id: 'd-2' | 'd-1' | 'dia-d';
  title: string;
  trigger: string;
  timing: string;
  badge: string;
  enabled: boolean;
  messageTemplate: string;
}

export interface StudioUser {
  id: string;
  name: string;
  email: string;
  studioName: string;
  phone: string;
  avatarUrl?: string;
}
