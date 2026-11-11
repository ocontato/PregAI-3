import React, { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useTranslation, SUPPORTED_LANGUAGES, SupportedLanguage } from '../lib/i18nContext';

interface LanguageSelectorProps {
  className?: string;
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '', compact = false }) => {
  const { language, setLanguage, currentLanguageOption } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-amber-300 transition-colors shadow-sm"
        title="Alterar idioma do aplicativo / Change language"
      >
        <span className="text-sm">{currentLanguageOption.flag}</span>
        {!compact && <span className="hidden lg:inline text-xs">{currentLanguageOption.name}</span>}
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-40 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-1.5 z-50 text-slate-200 animate-in fade-in slide-in-from-top-2"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="px-3 py-1 border-b border-slate-800 text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
            <Globe className="w-3 h-3" />
            <span>Idioma / Language</span>
          </div>

          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                  isSelected 
                    ? 'bg-amber-500/20 text-amber-300 font-bold' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.name}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
