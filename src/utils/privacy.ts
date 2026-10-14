import { Session, LGPDAuditRecord } from '../types/index.ts';

/**
 * Utilitários de Privacidade e Conformidade LGPD (Lei 13.709/2018).
 * Implementa princípios de Privacy by Design, Privacy by Default,
 * Minimização de Dados (Art. 6º, III) e Segurança (Art. 6º, VII).
 */

/**
 * Mascara número de telefone brasileiro.
 * Exemplo: "(11) 98765-4321" -> "(11) 9****-4321"
 */
export function maskPhone(phone: string | undefined | null, reveal: boolean = false): string {
  if (!phone) return '—';
  if (reveal) return phone;

  // Remove caracteres não numéricos temporariamente para parsing se necessário
  const trimmed = phone.trim();
  // Se contiver hífen e dígitos padrão (XX) XXXXX-XXXX
  const phoneRegex = /^(\+?\d{2}\s*)?(\(?\d{2}\)?\s*)(\d{1,5})[-.\s]?(\d{4})$/;
  const match = trimmed.match(phoneRegex);

  if (match) {
    const ddi = match[1] || '';
    const ddd = match[2] || '';
    const firstPart = match[3] || '';
    const lastDigits = match[4] || '';

    // Deixa apenas o primeiro dígito do prefixo móvel visível (ex: 9) e mascara os outros 4
    const maskedFirst = firstPart.length > 1
      ? `${firstPart[0]}${'*'.repeat(firstPart.length - 1)}`
      : '****';

    return `${ddi}${ddd}${maskedFirst}-${lastDigits}`.trim();
  }

  // Fallback genérico para strings de telefone não convencionais
  if (trimmed.length > 6) {
    const start = trimmed.slice(0, 4);
    const end = trimmed.slice(-4);
    return `${start}****${end}`;
  }

  return '****-****';
}

/**
 * Mascara CPF brasileiro.
 * Exemplo: "123.456.789-00" -> "***.***.789-**"
 */
export function maskCpf(cpf: string | undefined | null, reveal: boolean = false): string {
  if (!cpf) return '—';
  if (reveal) return cpf;

  const clean = cpf.replace(/\D/g, '');
  if (clean.length === 11) {
    // Exibe apenas 3 dígitos intermediários para conferência visual sem quebra de sigilo
    const middle = clean.substring(6, 9);
    return `***.***.${middle}-**`;
  }

  // Fallback se estiver formatado com pontuação
  if (cpf.includes('.') || cpf.includes('-')) {
    return '***.***.***-**';
  }

  return '***.***.***-**';
}

/**
 * Mascara endereço de e-mail.
 * Exemplo: "lucas.silva@gmail.com" -> "l***a@gmail.com"
 */
export function maskEmail(email: string | undefined | null, reveal: boolean = false): string {
  if (!email) return '—';
  if (reveal) return email;

  const parts = email.split('@');
  if (parts.length !== 2) return '*****@***.***';

  const [username, domain] = parts;
  if (username.length <= 2) {
    return `*@${domain}`;
  }

  const maskedUser = `${username[0]}${'*'.repeat(Math.min(username.length - 2, 4))}${username[username.length - 1]}`;
  return `${maskedUser}@${domain}`;
}

/**
 * Mascara nome completo mantendo apenas primeiro nome ou inicial.
 * Usado quando o modo de privacidade estrita do estúdio estiver ativo.
 */
export function maskName(name: string | undefined | null, reveal: boolean = false): string {
  if (!name) return 'Cliente Anônimo';
  if (reveal) return name;

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    const first = parts[0];
    return first.length > 2 ? `${first[0]}***` : first;
  }

  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1][0];
  return `${firstName} ${lastInitial}.`;
}

/**
 * Registra ou atualiza o log de auditoria de consentimento LGPD
 */
export function generateLgpdAuditRecord(healthDataConsent: boolean = true): LGPDAuditRecord {
  return {
    consentGiven: true,
    consentTimestamp: new Date().toISOString(),
    termsVersion: 'LGPD-2026.1-BR',
    healthDataConsent,
    purpose: 'Execução de contrato e procedimentos de segurança em tatuagem (Art. 7, V e Art. 11, II da Lei 13.709/2018)',
  };
}

/**
 * Executa a Anonimização dos dados pessoais da sessão (Art. 18, IV da LGPD).
 * Mantém o registro financeiro e data para cumprimento de dever fiscal e contábil (Art. 16, I da LGPD).
 */
export function anonymizeSession(session: Session): Session {
  const shortId = session.id.slice(-4).toUpperCase();
  const anonymizedTimestamp = new Date().toISOString();

  return {
    ...session,
    clientName: `Cliente Anonimizado #${shortId}`,
    clientPhone: '(00) 00000-0000',
    clientCpf: undefined,
    clientBirthdate: undefined,
    anamneseAnswers: undefined,
    anamneseNotes: undefined,
    signatureDataUrl: undefined,
    isAnonymized: true,
    lgpdAudit: {
      ...(session.lgpdAudit || generateLgpdAuditRecord(false)),
      anonymizedAt: anonymizedTimestamp,
      healthDataConsent: false,
    },
  };
}

/**
 * Purga apenas os dados sensíveis de saúde e assinatura biometrizada (Art. 16 e 18, VI da LGPD).
 * Mantém os dados cadastrais básicos e histórico financeiro.
 */
export function purgeSensitiveHealthData(session: Session): Session {
  const purgeTimestamp = new Date().toISOString();

  return {
    ...session,
    anamneseAnswers: undefined,
    anamneseNotes: undefined,
    signatureDataUrl: undefined,
    sensitiveDataPurged: true,
    lgpdAudit: {
      ...(session.lgpdAudit || generateLgpdAuditRecord(false)),
      sensitiveDataPurgedAt: purgeTimestamp,
      healthDataConsent: false,
    },
  };
}

/**
 * Exporta os dados do titular em formato JSON portátil (Portabilidade - Art. 18, V da LGPD).
 */
export function exportUserDataJson(session: Session): void {
  const exportPayload = {
    titulo: 'Relatório de Portabilidade de Dados Pessoais - LGPD (Lei 13.709/2018)',
    emitidoEm: new Date().toISOString(),
    titular: {
      nome: session.clientName,
      telefone: session.clientPhone,
      cpf: session.clientCpf || 'Não informado',
      dataNascimento: session.clientBirthdate || 'Não informado',
    },
    registroSessao: {
      idSessao: session.id,
      projeto: session.project,
      artista: session.artistName,
      data: session.dateStr,
      horario: session.timeStr,
      duracao: session.duration,
      status: session.status,
      valorTotal: session.totalAmount,
      sinalPix: session.depositAmount,
      hashCriptografico: session.shaHash,
      assinadoEm: session.signedAt || 'Não assinado',
    },
    dadosSensiveisSaude: session.sensitiveDataPurged
      ? 'EXPURGADOS A PEDIDO DO TITULAR'
      : session.anamneseAnswers
      ? {
          alergias: session.anamneseAnswers.allergies,
          coagulacao: session.anamneseAnswers.clotting,
          queloides: session.anamneseAnswers.keloids,
          diabetes: session.anamneseAnswers.diabetes,
          gravidezLactacao: session.anamneseAnswers.pregnancy,
          consumoAlcool24h: session.anamneseAnswers.alcohol,
          observacoesMedicas: session.anamneseNotes || 'Nenhuma',
        }
      : 'Não preenchidos',
    auditoriaLGPD: session.lgpdAudit || {
      consentimentoAtivo: true,
      termoVersao: 'LGPD-2026.1-BR',
      finalidade: 'Execução de serviço estético e emissão de termo contratual',
    },
    avisoLegal:
      'Este documento contém os dados pessoais sob custódia do ateliê de acordo com a LGPD. O titular tem o direito de solicitar anonimização ou exclusão a qualquer momento.',
  };

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeName = session.clientName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  link.href = url;
  link.download = `dados_lgpd_${safeName}_${session.id.slice(-6)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
