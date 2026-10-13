import React, { useRef, useEffect, useState, useId } from 'react';

export interface CountryCode {
  code: string;
  dialCode: string;
  name: string;
  flag: string;
  maskPlaceholder: string;
}

export const DEFAULT_COUNTRIES: CountryCode[] = [
  { code: 'BR', dialCode: '+55', name: 'Brasil', flag: '🇧🇷', maskPlaceholder: '(11) 99999-9999' },
  { code: 'PT', dialCode: '+351', name: 'Portugal', flag: '🇵🇹', maskPlaceholder: '912 345 678' },
  { code: 'US', dialCode: '+1', name: 'Estados Unidos', flag: '🇺🇸', maskPlaceholder: '(555) 000-0000' },
  { code: 'ES', dialCode: '+34', name: 'Espanha', flag: '🇪🇸', maskPlaceholder: '612 345 678' },
  { code: 'FR', dialCode: '+33', name: 'França', flag: '🇫🇷', maskPlaceholder: '06 12 34 56 78' },
  { code: 'GB', dialCode: '+44', name: 'Reino Unido', flag: '🇬🇧', maskPlaceholder: '7911 123456' },
  { code: 'DE', dialCode: '+49', name: 'Alemanha', flag: '🇩🇪', maskPlaceholder: '151 12345678' },
  { code: 'IT', dialCode: '+39', name: 'Itália', flag: '🇮🇹', maskPlaceholder: '312 345 6789' },
  { code: 'AR', dialCode: '+54', name: 'Argentina', flag: '🇦🇷', maskPlaceholder: '9 11 1234-5678' },
  { code: 'UY', dialCode: '+598', name: 'Uruguai', flag: '🇺🇾', maskPlaceholder: '91 234 567' },
  { code: 'CL', dialCode: '+56', name: 'Chile', flag: '🇨🇱', maskPlaceholder: '9 1234 5678' },
  { code: 'JP', dialCode: '+81', name: 'Japão', flag: '🇯🇵', maskPlaceholder: '90 1234 5678' },
];

export interface WhatsAppInputGroupProps {
  id?: string;
  label?: string;
  required?: boolean;
  value?: string; // Formatted full phone, e.g. "(11) 98765-4321" or raw digits
  onChange: (formattedValue: string, rawDigits: string, isValid: boolean) => void;
  selectedCountry?: CountryCode;
  onCountryChange?: (country: CountryCode) => void;
  error?: string | null;
  hint?: string;
  variant?: 'card' | 'plain';
  onFocus?: () => void;
  className?: string;
}

/**
 * WhatsApp 3-column input group (Prefixo de País / DDI, DDD, Número)
 * - Layout em 3 colunas rigorosamente alinhadas: DDI, DDD e Número
 * - Auto-máscara e auto-avanço de foco para padrão brasileiro (11 dígitos: DDD + 9XXXX-XXXX)
 * - Validação em tempo real e tratamento de colar (paste)
 */
export const WhatsAppInputGroup: React.FC<WhatsAppInputGroupProps> = ({
  id = 'whatsapp-input-group',
  label = 'WhatsApp do Cliente',
  required = true,
  value = '',
  onChange,
  selectedCountry = DEFAULT_COUNTRIES[0],
  onCountryChange,
  error,
  hint,
  variant = 'card',
  onFocus,
  className = '',
}) => {
  const dddInputRef = useRef<HTMLInputElement>(null);
  const numberInputRef = useRef<HTMLInputElement>(null);
  const selectId = useId();

  // Parse initial value into DDD and Number
  const [ddd, setDdd] = useState(() => {
    const digits = value.replace(/\D/g, '');
    if (selectedCountry.code === 'BR') {
      return digits.slice(0, 2);
    }
    return '';
  });

  const [number, setNumber] = useState(() => {
    const digits = value.replace(/\D/g, '');
    if (selectedCountry.code === 'BR') {
      const rest = digits.slice(2, 11);
      if (rest.length > 5) {
        return `${rest.slice(0, 5)}-${rest.slice(5)}`;
      }
      return rest;
    }
    return digits;
  });

  // Keep internal state in sync with external value prop
  useEffect(() => {
    const digits = value.replace(/\D/g, '');
    if (selectedCountry.code === 'BR') {
      const currentFullDigits = `${ddd}${number.replace(/\D/g, '')}`;
      if (digits !== currentFullDigits) {
        const nextDdd = digits.slice(0, 2);
        const rest = digits.slice(2, 11);
        const nextNum = rest.length > 5 ? `${rest.slice(0, 5)}-${rest.slice(5)}` : rest;
        setDdd(nextDdd);
        setNumber(nextNum);
      }
    } else {
      if (digits !== number.replace(/\D/g, '')) {
        setNumber(digits);
      }
    }
  }, [value, selectedCountry.code]);

  // Format and notify parent
  const emitChange = (newDdd: string, newNumberRaw: string, country: CountryCode) => {
    if (country.code === 'BR') {
      const cleanDdd = newDdd.replace(/\D/g, '').slice(0, 2);
      const cleanNum = newNumberRaw.replace(/\D/g, '').slice(0, 9);
      const fullDigits = `${cleanDdd}${cleanNum}`;

      let formatted = '';
      if (cleanDdd.length > 0) {
        if (cleanNum.length === 0) {
          formatted = `(${cleanDdd})`;
        } else if (cleanNum.length <= 5) {
          formatted = `(${cleanDdd}) ${cleanNum}`;
        } else {
          formatted = `(${cleanDdd}) ${cleanNum.slice(0, 5)}-${cleanNum.slice(5)}`;
        }
      }

      const isValid = cleanDdd.length === 2 && cleanNum.length === 9 && cleanNum.startsWith('9');
      onChange(formatted, fullDigits, isValid);
    } else {
      const cleanNum = newNumberRaw.replace(/\D/g, '').slice(0, 14);
      const isValid = cleanNum.length >= 7;
      onChange(cleanNum, cleanNum, isValid);
    }
  };

  const handleCountrySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = DEFAULT_COUNTRIES.find((c) => c.code === e.target.value) || DEFAULT_COUNTRIES[0];
    if (onCountryChange) {
      onCountryChange(found);
    }
    setDdd('');
    setNumber('');
    onChange('', '', false);
    setTimeout(() => {
      if (found.code === 'BR') {
        dddInputRef.current?.focus();
      } else {
        numberInputRef.current?.focus();
      }
    }, 50);
  };

  // Handle DDD Input
  const handleDddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 2);
    setDdd(raw);
    emitChange(raw, number, selectedCountry);

    // Auto-advance to number input when 2 digits are entered
    if (raw.length === 2) {
      numberInputRef.current?.focus();
      numberInputRef.current?.select();
    }
  };

  const handleDddKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowRight' && ddd.length === 2) {
      numberInputRef.current?.focus();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      numberInputRef.current?.focus();
    }
  };

  // Handle Number Input with Auto-Masking
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (selectedCountry.code === 'BR') {
      const cleanDigits = val.replace(/\D/g, '').slice(0, 9);
      let formattedNum = cleanDigits;
      if (cleanDigits.length > 5) {
        formattedNum = `${cleanDigits.slice(0, 5)}-${cleanDigits.slice(5)}`;
      }
      setNumber(formattedNum);
      emitChange(ddd, cleanDigits, selectedCountry);
    } else {
      const cleanDigits = val.replace(/\D/g, '').slice(0, 14);
      setNumber(cleanDigits);
      emitChange('', cleanDigits, selectedCountry);
    }
  };

  const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && selectedCountry.code === 'BR' && !number) {
      // Backspace on empty number input moves focus back to DDD
      e.preventDefault();
      dddInputRef.current?.focus();
    }
    if (e.key === 'ArrowLeft' && selectedCountry.code === 'BR') {
      const input = e.currentTarget;
      if (input.selectionStart === 0 && input.selectionEnd === 0) {
        dddInputRef.current?.focus();
      }
    }
  };

  // Smart Paste Handler (extracts DDI/DDD/Número when pasted into any input)
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData('text');
    let digits = pasteData.replace(/\D/g, '');

    // Strip leading 55 if pasted with Brazil country code
    if (digits.startsWith('55') && digits.length >= 12) {
      digits = digits.slice(2);
    }

    if (selectedCountry.code === 'BR' && digits.length >= 10) {
      e.preventDefault();
      const newDdd = digits.slice(0, 2);
      const newNumDigits = digits.slice(2, 11);
      const formattedNum =
        newNumDigits.length > 5
          ? `${newNumDigits.slice(0, 5)}-${newNumDigits.slice(5)}`
          : newNumDigits;

      setDdd(newDdd);
      setNumber(formattedNum);
      emitChange(newDdd, newNumDigits, selectedCountry);
      numberInputRef.current?.focus();
    }
  };

  const totalDigits = `${ddd}${number.replace(/\D/g, '')}`.length;
  const isCompleteBr =
    selectedCountry.code === 'BR' &&
    totalDigits === 11 &&
    number.replace(/\D/g, '').startsWith('9');

  const wrapperCardClass =
    variant === 'card'
      ? 'space-y-3 p-4 sm:p-5 rounded-2xl bg-[#141415] border border-white/5 shadow-sm'
      : 'space-y-2';

  return (
    <div id={id} className={`${wrapperCardClass} transition-all ${className}`}>
      {/* Top Header Label & Live Counter */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[#e5e2e3] uppercase tracking-wider flex items-center gap-1.5 select-none">
          <span>{label}</span>
          {required && <span className="text-[#fabc4d]">*</span>}
        </label>
        {selectedCountry.code === 'BR' && (
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors ${
              isCompleteBr
                ? 'bg-[#fabc4d]/15 text-[#fabc4d] border border-[#fabc4d]/30 font-semibold'
                : 'bg-[#201f20] text-[#8f9194]'
            }`}
          >
            {totalDigits} / 11 dígitos
          </span>
        )}
      </div>

      {/* 3-Column Layout: Prefixo de País (DDI), DDD, Número */}
      <div
        className={`grid gap-2 sm:gap-3 items-start ${
          selectedCountry.code === 'BR'
            ? 'grid-cols-[96px_66px_1fr] xs:grid-cols-[108px_72px_1fr] sm:grid-cols-[128px_84px_1fr]'
            : 'grid-cols-[104px_1fr] sm:grid-cols-[140px_1fr]'
        }`}
      >
        {/* Coluna 1: Prefixo de País com Dropdown (DDI) */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-[#8f9194] uppercase tracking-wider pl-0.5 select-none">
            País / DDI
          </span>
          <div className="relative h-12 w-full bg-[#0e0e0f] border border-white/10 hover:border-white/20 focus-within:border-[#fabc4d] rounded-xl flex items-center px-2.5 sm:px-3 transition-all cursor-pointer shadow-inner">
            <select
              id={selectId}
              value={selectedCountry.code}
              onChange={handleCountrySelect}
              onFocus={onFocus}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              title="Selecione o código internacional do país"
            >
              {DEFAULT_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#1c1b1c] text-white">
                  {c.flag} {c.dialCode} — {c.name} ({c.code})
                </option>
              ))}
            </select>
            <div className="flex items-center justify-between w-full pointer-events-none select-none">
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden">
                <span className="text-lg sm:text-xl leading-none shrink-0">{selectedCountry.flag}</span>
                <span className="font-bold text-white text-xs sm:text-sm font-mono truncate">
                  {selectedCountry.dialCode}
                </span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-[#8f9194] shrink-0">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Coluna 2: DDD (exclusivo para BR com máscara de 2 dígitos e auto-avanço) */}
        {selectedCountry.code === 'BR' && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-[#8f9194] uppercase tracking-wider pl-0.5 select-none text-center sm:text-left">
              DDD
            </span>
            <div
              className={`relative h-12 bg-[#0e0e0f] rounded-xl border shadow-inner transition-colors focus-within:border-[#fabc4d] ${
                error && ddd.length < 2
                  ? 'border-[#ffb4ab]'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <input
                ref={dddInputRef}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={2}
                value={ddd}
                onChange={handleDddChange}
                onKeyDown={handleDddKeyDown}
                onPaste={handlePaste}
                onFocus={onFocus}
                placeholder="11"
                className="w-full h-full bg-transparent text-white font-mono text-center text-sm sm:text-base font-semibold focus:outline-none placeholder-[#8f9194]/40 px-1 sm:px-2"
                aria-label="DDD (Código de área com 2 dígitos)"
              />
            </div>
          </div>
        )}

        {/* Coluna 3: Número de Telefone com Máscara Automática */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <span className="text-[11px] font-medium text-[#8f9194] uppercase tracking-wider pl-0.5 select-none truncate">
            {selectedCountry.code === 'BR' ? 'Celular (9 dígitos)' : 'Número de Telefone'}
          </span>
          <div
            className={`relative h-12 bg-[#0e0e0f] rounded-xl border shadow-inner transition-colors focus-within:border-[#fabc4d] ${
              error ? 'border-[#ffb4ab]' : 'border-white/10 hover:border-white/20'
            }`}
          >
            <input
              ref={numberInputRef}
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={selectedCountry.code === 'BR' ? 10 : 16}
              value={number}
              onChange={handleNumberChange}
              onKeyDown={handleNumberKeyDown}
              onPaste={handlePaste}
              onFocus={onFocus}
              placeholder={selectedCountry.code === 'BR' ? '98765-4321' : selectedCountry.maskPlaceholder}
              className="w-full h-full bg-transparent text-white font-mono text-sm sm:text-base tracking-wide px-3 sm:px-4 focus:outline-none placeholder-[#8f9194]/40"
              aria-label="Número do celular"
            />
          </div>
        </div>
      </div>

      {/* Helper text ou Mensagem de Erro com ícone */}
      {error ? (
        <span className="text-xs text-[#ffb4ab] flex items-center gap-1.5 pt-0.5 font-medium">
          <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
          <span>{error}</span>
        </span>
      ) : (
        <span className="text-[11px] text-[#8f9194] block pt-0.5">
          {hint ||
            (selectedCountry.code === 'BR'
              ? 'Padrão nacional: selecione o DDI (+55), informe o DDD (ex: 11) e o celular com 9 dígitos.'
              : `Número internacional de ${selectedCountry.name}.`)}
        </span>
      )}
    </div>
  );
};
