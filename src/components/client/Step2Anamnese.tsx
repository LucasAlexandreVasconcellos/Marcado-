import React, { useRef, useState, useEffect } from 'react';
import { Session } from '../../types/index.ts';
import { generateSHA256Mock } from '../../utils/storage.ts';
import { Button } from '../../design-system/Button.tsx';
import { generateLgpdAuditRecord } from '../../utils/privacy.ts';

interface Step2AnamneseProps {
  session: Session;
  onProceed: (updatedSession: Partial<Session>) => void;
  onBack: () => void;
}

export const Step2Anamnese: React.FC<Step2AnamneseProps> = ({ session, onProceed }) => {
  const [allergies, setAllergies] = useState(false);
  const [allergiesNote, setAllergiesNote] = useState('');

  const [clotting, setClotting] = useState(false);
  const [clottingNote, setClottingNote] = useState('');

  const [keloids, setKeloids] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [pregnancy, setPregnancy] = useState(false);
  const [alcohol, setAlcohol] = useState(false);

  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedLgpdHealth, setAgreedLgpdHealth] = useState(false);
  const [agreedLgpdRights, setAgreedLgpdRights] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  // Canvas ref for ink pen stroke
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = '#fabc4d';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number; time: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, time: Date.now() };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      time: Date.now(),
    };
  };

  const startSign = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawingRef.current = true;
    const coords = getCanvasCoords(e);
    lastPointRef.current = coords;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setHasSigned(true);
  };

  const drawSign = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current || !lastPointRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);
    const dist = Math.hypot(coords.x - lastPointRef.current.x, coords.y - lastPointRef.current.y);
    const timeDelta = Math.max(1, coords.time - lastPointRef.current.time);
    const velocity = dist / timeDelta;

    // Ink pen variable thickness based on velocity: slower = thicker ink, faster = fine taper
    const targetLineWidth = Math.max(1.4, Math.min(3.6, 3.2 - velocity * 0.8));
    ctx.lineWidth = targetLineWidth;

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    lastPointRef.current = coords;
  };

  const stopSign = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasSigned || !agreedTerms || !agreedLgpdHealth || !agreedLgpdRights) return;

    const canvas = canvasRef.current;
    const signatureDataUrl = canvas ? canvas.toDataURL('image/png') : '';
    const sha = generateSHA256Mock(session.clientName + Date.now());

    onProceed({
      anamneseAnswers: {
        allergies,
        clotting,
        keloids,
        diabetes,
        pregnancy,
        alcohol,
      },
      anamneseNotes: allergiesNote || clottingNote || undefined,
      signatureDataUrl,
      shaHash: sha,
      signedAt: new Date().toISOString(),
      lgpdAudit: generateLgpdAuditRecord(agreedLgpdHealth),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-8">
      {/* Informative Header */}
      <section className="bg-[#1c1b1c] rounded-2xl p-5 border border-white/5 space-y-2 shadow-sm">
        <span className="text-[10px] font-bold text-[#fabc4d] uppercase tracking-wider block">
          Validade Jurídica & Ficha Sanitária
        </span>
        <h2 className="font-headline text-xl text-white font-medium">
          Ficha de Anamnese & Consentimento
        </h2>
        <p className="text-xs text-[#8f9194] leading-relaxed">
          Preencha com precisão sobre seu histórico de saúde. As informações são sigilosas e asseguram sua biossegurança durante o procedimento.
        </p>
      </section>

      {/* Toggles Grandes de Saúde com Divulgação Progressiva */}
      <section className="bg-[#1c1b1c] rounded-2xl p-5 border border-white/5 space-y-4 shadow-sm">
        <span className="text-xs font-semibold text-white uppercase tracking-wider block">
          Histórico Médico & Biossegurança
        </span>

        {/* Questão 1: Alergias */}
        <div className="p-3.5 rounded-xl bg-[#0e0e0f] border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white">
              Possui alergia a medicamentos, látex ou pigmentos?
            </span>
            <button
              type="button"
              onClick={() => setAllergies(!allergies)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                allergies ? 'bg-[#fabc4d]' : 'bg-[#2a2a2b]'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-[#131314] transition-transform ${
                  allergies ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
          {allergies && (
            <input
              type="text"
              placeholder="Especifique a alergia (ex: Dipirona, iodo)..."
              value={allergiesNote}
              onChange={(e) => setAllergiesNote(e.target.value)}
              className="w-full text-xs bg-[#1c1b1c] text-white p-2.5 rounded-lg border border-white/10 focus:border-[#fabc4d] outline-none"
            />
          )}
        </div>

        {/* Questão 2: Cicatrização / Coagulação */}
        <div className="p-3.5 rounded-xl bg-[#0e0e0f] border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white">
              Histórico de problemas de coagulação ou queloides?
            </span>
            <button
              type="button"
              onClick={() => setClotting(!clotting)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                clotting ? 'bg-[#fabc4d]' : 'bg-[#2a2a2b]'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-[#131314] transition-transform ${
                  clotting ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
          {clotting && (
            <input
              type="text"
              placeholder="Descreva seu histórico de cicatrização..."
              value={clottingNote}
              onChange={(e) => setClottingNote(e.target.value)}
              className="w-full text-xs bg-[#1c1b1c] text-white p-2.5 rounded-lg border border-white/10 focus:border-[#fabc4d] outline-none"
            />
          )}
        </div>

        {/* Questão 3: Diabetes */}
        <div className="p-3.5 rounded-xl bg-[#0e0e0f] border border-white/5 flex items-center justify-between">
          <span className="text-xs font-medium text-white">
            Diagnóstico de diabetes ou hipertensão?
          </span>
          <button
            type="button"
            onClick={() => setDiabetes(!diabetes)}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              diabetes ? 'bg-[#fabc4d]' : 'bg-[#2a2a2b]'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-[#131314] transition-transform ${
                diabetes ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Questão 4: Gestação */}
        <div className="p-3.5 rounded-xl bg-[#0e0e0f] border border-white/5 flex items-center justify-between">
          <span className="text-xs font-medium text-white">
            Em período de gestação ou amamentação?
          </span>
          <button
            type="button"
            onClick={() => setPregnancy(!pregnancy)}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              pregnancy ? 'bg-[#fabc4d]' : 'bg-[#2a2a2b]'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-[#131314] transition-transform ${
                pregnancy ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Questão 5: Álcool nas 24h anteriores */}
        <div className="p-3.5 rounded-xl bg-[#0e0e0f] border border-white/5 flex items-center justify-between">
          <span className="text-xs font-medium text-white">
            Consumiu bebidas alcoólicas nas últimas 24 horas?
          </span>
          <button
            type="button"
            onClick={() => setAlcohol(!alcohol)}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              alcohol ? 'bg-[#fabc4d]' : 'bg-[#2a2a2b]'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-[#131314] transition-transform ${
                alcohol ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Assinatura Digital Touch com Tinta Fluida */}
      <section className="bg-[#1c1b1c] rounded-2xl p-5 border border-white/5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#fabc4d] uppercase tracking-wider">
              Autenticação da Vontade
            </span>
            <span className="text-xs font-semibold text-white">Assinatura Digital</span>
          </div>
          {hasSigned && (
            <button
              type="button"
              onClick={clearSignature}
              className="text-[11px] font-semibold text-[#8f9194] hover:text-white uppercase transition-colors"
            >
              Limpar Traço
            </button>
          )}
        </div>

        {/* Canvas de Tinta */}
        <div className="relative w-full h-36 bg-[#0e0e0f] rounded-xl border border-white/10 overflow-hidden shadow-inner flex items-center justify-center">
          <canvas
            ref={canvasRef}
            onMouseDown={startSign}
            onMouseMove={drawSign}
            onMouseUp={stopSign}
            onMouseLeave={stopSign}
            onTouchStart={startSign}
            onTouchMove={drawSign}
            onTouchEnd={stopSign}
            className="w-full h-full cursor-crosshair touch-none"
          />
          {!hasSigned && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center gap-1 text-[#8f9194]/40 select-none">
              <span className="material-symbols-outlined text-[24px]">draw</span>
              <span className="text-xs font-mono">Assine com o dedo ou mouse aqui</span>
            </div>
          )}
        </div>

        {/* Bloco de Consentimentos LGPD (Art. 7º e Art. 11 da Lei 13.709/2018) */}
        <div className="flex flex-col gap-2 pt-2">
          {/* Checkbox 1: Biossegurança e Regras Contratuais */}
          <label className="flex items-start gap-3 p-3 rounded-xl bg-[#0e0e0f] border border-white/5 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-white/20 accent-[#fabc4d] cursor-pointer shrink-0"
            />
            <span className="text-[11px] text-[#c5c7c9] leading-relaxed">
              Declaro que li e concordo com as regras do estúdio, biossegurança e política de sinal Pix.
            </span>
          </label>

          {/* Checkbox 2: Consentimento Específico para Dados Sensíveis de Saúde (Art. 11 LGPD) */}
          <label className="flex items-start gap-3 p-3 rounded-xl bg-[#0e0e0f] border border-white/5 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedLgpdHealth}
              onChange={(e) => setAgreedLgpdHealth(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-white/20 accent-[#fabc4d] cursor-pointer shrink-0"
            />
            <span className="text-[11px] text-[#c5c7c9] leading-relaxed">
              <strong className="text-white">Consentimento de Saúde (Art. 11, I LGPD):</strong> Autorizo expressamente o tratamento das minhas respostas clínicas e alergias estritamente para segurança dermatológica durante o procedimento.
            </span>
          </label>

          {/* Checkbox 3: Direitos do Titular e Revogabilidade (Art. 8º e 18 LGPD) */}
          <label className="flex items-start gap-3 p-3 rounded-xl bg-[#0e0e0f] border border-white/5 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedLgpdRights}
              onChange={(e) => setAgreedLgpdRights(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-white/20 accent-[#fabc4d] cursor-pointer shrink-0"
            />
            <span className="text-[11px] text-[#c5c7c9] leading-relaxed">
              <strong className="text-white">Direitos do Titular (Art. 18 LGPD):</strong> Estou ciente de que posso revogar este consentimento, solicitar portabilidade, anonimização ou exclusão dos dados médicos a qualquer momento.
            </span>
          </label>
        </div>
      </section>

      {/* Botão de Avançar */}
      <Button
        variant="primary"
        size="lg"
        disabled={!hasSigned || !agreedTerms || !agreedLgpdHealth || !agreedLgpdRights}
        icon="arrow_forward"
        iconPosition="right"
        className="w-full mt-2"
        type="submit"
      >
        Registrar Termo e Ir para o Sinal Pix
      </Button>
    </form>
  );
};
