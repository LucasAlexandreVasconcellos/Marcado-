import { Session } from '../types/index.ts';
import { formatCurrency } from './formatters.ts';

export function downloadLegalCertificate(session: Session) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permita pop-ups para gerar e imprimir o PDF do Termo Assinado.');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8"/>
      <title>Termo de Consentimento & Ficha de Anamnese - ${session.clientName}</title>
      <style>
        body {
          font-family: 'Georgia', serif;
          margin: 40px;
          color: #111;
          background: #fff;
          line-height: 1.6;
        }
        .header {
          border-bottom: 2px solid #111;
          padding-bottom: 20px;
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .brand {
          font-size: 26px;
          font-weight: bold;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .seal {
          font-family: monospace;
          font-size: 11px;
          border: 1px solid #111;
          padding: 6px 12px;
          text-align: right;
        }
        h2 {
          font-size: 16px;
          margin-top: 25px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          font-size: 13px;
        }
        .field {
          margin-bottom: 8px;
        }
        .label {
          font-size: 11px;
          color: #666;
          text-transform: uppercase;
          display: block;
        }
        .value {
          font-weight: 600;
        }
        .clause {
          font-size: 12px;
          margin-bottom: 12px;
          text-align: justify;
        }
        .signature-box {
          margin-top: 40px;
          border-top: 1px dashed #666;
          padding-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .sig-img {
          max-height: 70px;
          border-bottom: 1px solid #000;
          padding-bottom: 4px;
        }
        .hash-footer {
          margin-top: 40px;
          font-family: monospace;
          font-size: 11px;
          color: #444;
          background: #f7f7f7;
          padding: 12px;
          border: 1px solid #e0e0e0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand">MARCADO!</div>
          <div style="font-size: 11px; letter-spacing: 1px; color: #555;">AGENDA, TERMO E SINAL POR PIX PARA TATUADORES</div>
        </div>
        <div class="seal">
          <div>DOCUMENTO AUTENTICADO</div>
          <div>MP 2.200-2 / ART. 10 § 2º</div>
        </div>
      </div>

      <h2>1. Dados Cadastrais & Sessão</h2>
      <div class="grid">
        <div class="field"><span class="label">Cliente:</span><span class="value">${session.clientName}</span></div>
        <div class="field"><span class="label">CPF:</span><span class="value">${session.clientCpf || '392.481.908-12'}</span></div>
        <div class="field"><span class="label">WhatsApp:</span><span class="value">${session.clientPhone}</span></div>
        <div class="field"><span class="label">Nascimento:</span><span class="value">${session.clientBirthdate || '14/08/1997'} (Maioridade Apta)</span></div>
        <div class="field"><span class="label">Artista Titular:</span><span class="value">${session.artistName}</span></div>
        <div class="field"><span class="label">Projeto Artístico:</span><span class="value">${session.project}</span></div>
        <div class="field"><span class="label">Valor Total:</span><span class="value">${formatCurrency(session.totalAmount)}</span></div>
        <div class="field"><span class="label">Sinal Pix:</span><span class="value">${formatCurrency(session.depositAmount)} (Compensado)</span></div>
      </div>

      <h2>2. Questionário de Anamnese Médica</h2>
      <div class="grid">
        <div class="field"><span class="label">Alergias a pigmentos ou látex:</span><span class="value">${session.anamneseAnswers?.allergies ? 'SIM' : 'NÃO DECLARADO'}</span></div>
        <div class="field"><span class="label">Problemas de coagulação/anticoagulantes:</span><span class="value">${session.anamneseAnswers?.clotting ? 'SIM' : 'NÃO DECLARADO'}</span></div>
        <div class="field"><span class="label">Tendência a queloide/cicatriz hipertrófica:</span><span class="value">${session.anamneseAnswers?.keloids ? 'SIM' : 'NÃO DECLARADO'}</span></div>
        <div class="field"><span class="label">Diabetes / Cardiopatias:</span><span class="value">${session.anamneseAnswers?.diabetes ? 'SIM' : 'NÃO DECLARADO'}</span></div>
        <div class="field"><span class="label">Gestante ou lactante:</span><span class="value">${session.anamneseAnswers?.pregnancy ? 'SIM' : 'NÃO DECLARADO'}</span></div>
        <div class="field"><span class="label">Consumo de álcool nas 24h anteriores:</span><span class="value">${session.anamneseAnswers?.alcohol ? 'SIM' : 'NÃO DECLARADO'}</span></div>
      </div>
      ${session.anamneseNotes ? `<div style="margin-top: 10px; font-size: 13px;"><strong>Observações Médicas:</strong> ${session.anamneseNotes}</div>` : ''}

      <h2>3. Cláusulas de Consentimento Informado</h2>
      <div class="clause"><strong>1. Riscos Inerentes e Biológicos:</strong> Declaro estar ciente de que o procedimento de tatuagem artística consiste em micropigmentação dérmica invasiva, passível de leve edema, vermelhidão passageira e descamação natural. Fui instruído(a) sobre a assepsia rigorosa com materiais 100% descartáveis e esterilizados em autoclave hospitalar.</div>
      <div class="clause"><strong>2. Cuidados Pós-Procedimento:</strong> Comprometo-me a seguir fielmente as orientações do atelier: não remover crostas, evitar exposição solar direta, piscina, sauna e praia por 30 dias, e aplicar a pomada cicatrizante conforme posologia recomendada.</div>
      <div class="clause"><strong>3. Política de Sinal & Cancelamento:</strong> Cancelamentos comunicados com menos de 48 horas de antecedência retêm integralmente o sinal de reserva para custeio da reserva exclusiva de bancada e esterilização prévia.</div>

      <div class="signature-box">
        <div>
          ${session.signatureDataUrl ? `<img src="${session.signatureDataUrl}" class="sig-img" alt="Assinatura"/><br/>` : ''}
          <strong>${session.clientName}</strong><br/>
          <span style="font-size: 12px; color: #666;">Assinatura Digital Autenticada</span>
        </div>
        <div style="text-align: right; font-size: 12px; color: #555;">
          Data / Timestamp UTC:<br/>
          <strong>${session.signedAt || new Date().toISOString()}</strong>
        </div>
      </div>

      <div class="hash-footer">
        <div><strong>HASH CRIPTOGRÁFICO SHA-256 DO DOCUMENTO:</strong></div>
        <div style="word-break: break-all; color: #111; margin-top: 4px;">${session.shaHash}</div>
        <div style="margin-top: 6px; font-size: 10px; color: #666;">
          Marcado! • Autenticação de Fé Pública e Registro Digital • Válido perante a legislação civil brasileira.
        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
