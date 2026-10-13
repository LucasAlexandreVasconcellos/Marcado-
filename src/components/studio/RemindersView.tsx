import React, { useState } from 'react';
import { ReminderTemplate } from '../../types/index.ts';
import { Button } from '../../design-system/Button.tsx';

interface RemindersViewProps {
  reminders: ReminderTemplate[];
  onUpdateReminders: (updated: ReminderTemplate[]) => void;
  onShowToast: (msg: string) => void;
  studioName: string;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  reminders,
  onUpdateReminders,
  onShowToast,
  studioName,
}) => {
  const [editingReminder, setEditingReminder] = useState<ReminderTemplate | null>(null);
  const [editedTemplateText, setEditedTemplateText] = useState('');

  const handleOpenEdit = (reminder: ReminderTemplate) => {
    setEditingReminder(reminder);
    setEditedTemplateText(reminder.messageTemplate);
  };

  const handleSaveEdit = () => {
    if (!editingReminder) return;
    const updated = reminders.map((r) =>
      r.id === editingReminder.id ? { ...r, messageTemplate: editedTemplateText } : r
    );
    onUpdateReminders(updated);
    setEditingReminder(null);
    onShowToast(`Modelo de ${editingReminder.title} atualizado com sucesso!`);
  };

  const handleToggle = (id: string) => {
    const updated = reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    onUpdateReminders(updated);
    onShowToast('Status do lembrete atualizado');
  };

  const getSimulatedPreview = (template: string) => {
    return template
      .replace(/\[Nome\]/g, 'Marina')
      .replace(/\[Data\]/g, 'Qui, 15 de Out · 14h')
      .replace(/\[Horario\]/g, '14:00')
      .replace(/\[Projeto\]/g, 'Fechamento Antebraço Botânico')
      .replace(/\[Artista\]/g, 'Kaelen Vance')
      .replace(/\[ValorSinal\]/g, 'R$ 400,00')
      .replace(/\[Estudio\]/g, studioName);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#fabc4d]" />
            <span className="text-[10px] font-bold text-[#fabc4d] uppercase tracking-[0.2em]">
              Protocolo Anti-No-Show
            </span>
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl lg:text-4xl text-white font-medium tracking-tight">
            Lembretes Automáticos via WhatsApp
          </h1>
          <p className="text-xs text-[#8f9194] max-w-2xl leading-relaxed">
            Cadência estratégica de mensagens enviadas antes de cada sessão para garantir presença,
            repassar orientações de cuidados com a pele e confirmar o comparecimento do cliente.
          </p>
        </div>
      </div>

      {/* Timeline Section D-2 -> D-1 -> Dia D */}
      <div className="relative flex flex-col lg:flex-row items-stretch gap-6">
        {/* Animated Connecting Line on Desktop */}
        <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-[#fabc4d]/40 via-[#fabc4d]/20 to-[#fabc4d]/40 -translate-y-1/2 pointer-events-none z-0" />

        {reminders.map((rem, index) => {
          return (
            <div
              key={rem.id}
              className={`relative z-10 flex-1 p-6 rounded-2xl bg-[#1c1b1c] border transition-all flex flex-col justify-between gap-5 shadow-lg ${
                rem.enabled ? 'border-white/10 hover:border-[#fabc4d]/30' : 'border-white/5 opacity-60'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#201f20] border border-white/10 flex items-center justify-center text-[#fabc4d] font-bold text-sm shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#fabc4d] uppercase tracking-wider">
                      {rem.timing}
                    </span>
                    <h3 className="font-semibold text-white text-base">{rem.title}</h3>
                  </div>
                </div>

                {/* Toggle Active */}
                <button
                  type="button"
                  onClick={() => handleToggle(rem.id)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    rem.enabled ? 'bg-[#fabc4d]' : 'bg-[#2a2a2b]'
                  }`}
                  title={rem.enabled ? 'Desativar este lembrete' : 'Ativar este lembrete'}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-[#131314] transition-transform ${
                      rem.enabled ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Message Content Preview with highlighted variables */}
              <div className="p-4 rounded-xl bg-[#0e0e0f] border border-white/5 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] text-[#8f9194] border-b border-white/5 pb-1.5">
                  <span className="font-semibold uppercase tracking-wider text-[#fabc4d]">
                    {rem.badge}
                  </span>
                  <span className="font-mono text-[10px]">{rem.trigger}</span>
                </div>
                <p className="text-xs text-[#c5c7c9] leading-relaxed select-text font-sans">
                  {rem.messageTemplate.split(/(\[[A-Za-z]+\])/g).map((part, i) =>
                    part.startsWith('[') && part.endsWith(']') ? (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded bg-[#fabc4d]/15 text-[#fabc4d] font-mono text-[11px] mx-0.5 font-semibold"
                      >
                        {part}
                      </span>
                    ) : (
                      part
                    )
                  )}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-[11px] text-[#8f9194] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#25d366]">chat</span>
                  <span>WhatsApp automático</span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  icon="edit"
                  onClick={() => handleOpenEdit(rem)}
                >
                  Editar Mensagem
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Drawer / Modal with Live WhatsApp Bubble */}
      {editingReminder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
          <div className="bg-[#1c1b1c] w-full max-w-2xl rounded-t-3xl sm:rounded-2xl p-5 sm:p-8 flex flex-col gap-5 sm:gap-6 shadow-2xl border-t sm:border border-white/10 my-0 sm:my-auto max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="flex flex-col gap-1 min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fabc4d]" />
                  <span className="text-[10px] font-bold text-[#fabc4d] uppercase tracking-wider">
                    Editar Modelo • {editingReminder.timing}
                  </span>
                </div>
                <h2 className="font-headline text-xl sm:text-2xl text-white font-medium">
                  {editingReminder.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingReminder(null)}
                className="w-9 h-9 rounded-xl bg-[#2a2a2b] hover:bg-[#353436] flex items-center justify-center text-[#8f9194] hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Variable Pills Available */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-[#8f9194] uppercase tracking-wider">
                Variáveis Dinâmicas Disponíveis (clique para inserir):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['[Nome]', '[Data]', '[Horario]', '[Projeto]', '[Artista]', '[ValorSinal]', '[Estudio]'].map(
                  (v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setEditedTemplateText((prev) => `${prev} ${v}`)}
                      className="px-2.5 py-1 rounded-lg bg-[#201f20] hover:bg-[#2a2a2b] text-[#fabc4d] font-mono text-xs border border-white/5 transition-colors cursor-pointer"
                    >
                      {v}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Template Textarea */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[#e5e2e3] uppercase tracking-wider">
                Texto do Modelo
              </label>
              <textarea
                rows={4}
                value={editedTemplateText}
                onChange={(e) => setEditedTemplateText(e.target.value)}
                className="w-full bg-[#0e0e0f] text-white p-3.5 sm:p-4 rounded-xl border border-white/10 focus:border-[#fabc4d] text-sm leading-relaxed focus:outline-none font-sans"
              />
            </div>

            {/* WhatsApp Bubble Live Preview */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-[#8f9194] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#25d366]">chat</span>
                <span>Prévia Realística no WhatsApp do Cliente</span>
              </span>
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#0b141a] border border-[#25d366]/20 flex flex-col items-end">
                <div className="max-w-md w-full bg-[#005c4b] text-[#e9edef] p-3 sm:p-3.5 rounded-2xl rounded-tr-none text-xs leading-relaxed shadow relative">
                  <p className="whitespace-pre-wrap">{getSimulatedPreview(editedTemplateText)}</p>
                  <span className="text-[10px] text-[#8696a0] flex items-center justify-end gap-1 mt-1 font-mono">
                    10:42 <span className="text-[#53bdeb]">✓✓</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-4 border-t border-white/10">
              <Button variant="outline" size="md" className="w-full sm:w-auto" onClick={() => setEditingReminder(null)}>
                Cancelar
              </Button>
              <Button variant="primary" size="md" icon="check" className="w-full sm:w-auto" onClick={handleSaveEdit}>
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
