import React, { useState } from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  X, 
  Settings, 
  Megaphone,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { AdBannerConfig } from '../types';
import { useAuth } from '../lib/authContext';
import { useTranslation } from '../lib/i18nContext';

interface AdBannerProps {
  config: AdBannerConfig;
  onNavigateToAdmin?: () => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({ config, onNavigateToAdmin }) => {
  const { isAdmin } = useAuth();
  const { t } = useTranslation();
  const [isDismissed, setIsDismissed] = useState(false);

  // If disabled by administrator or dismissed by the user in this session, don't show
  if (!config.enabled || isDismissed) {
    return null;
  }

  const handleCtaClick = () => {
    if (config.linkUrl) {
      if (typeof window !== 'undefined') {
        // Open safely without window.alert
        const target = config.linkUrl.startsWith('http') ? config.linkUrl : `https://${config.linkUrl}`;
        window.open(target, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <aside 
      aria-label="Espaço Publicitário e Parceria"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 animate-in fade-in duration-500"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#071328] via-[#0a192f] to-[#0f2442] border border-amber-500/30 shadow-2xl">
        
        {/* Subtle decorative glow & pattern */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -ml-20 -mb-20 w-60 h-60 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 p-6 sm:p-8 lg:p-10">
          
          {/* Left / Info Section */}
          <div className="flex-1 space-y-3.5 text-center lg:text-left">
            
            {/* Header pill tags */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono shadow-sm">
                <Megaphone className="w-3.5 h-3.5 text-amber-400" />
                {config.tag || 'Espaço Publicitário'}
              </span>

              {config.badgeText && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  {config.badgeText}
                </span>
              )}

              {config.sponsorName && (
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                  &bull; {t('ad.sponsor')}: <strong className="text-slate-300">{config.sponsorName}</strong>
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-snug">
              {config.title}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {config.description}
            </p>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                type="button"
                onClick={handleCtaClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:scale-102 cursor-pointer"
              >
                <span>{config.ctaText || 'Saiba Mais'}</span>
                <ExternalLink className="w-4 h-4 text-slate-950" />
              </button>

              {isAdmin && onNavigateToAdmin && (
                <button
                  type="button"
                  onClick={onNavigateToAdmin}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-slate-700 text-xs font-semibold transition-colors"
                  title="Configurar este espaço no Painel Administrativo"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configurar Anúncio</span>
                </button>
              )}
            </div>

          </div>

          {/* Right / Banner Preview Image */}
          {config.imageUrl && (
            <div 
              onClick={handleCtaClick}
              className="w-full lg:w-72 h-44 sm:h-52 lg:h-48 rounded-2xl overflow-hidden border border-slate-700/80 shadow-xl shrink-0 group cursor-pointer relative bg-slate-950"
            >
              <img
                src={config.imageUrl}
                alt={config.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[10px] text-amber-300 font-medium flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded backdrop-blur-sm border border-slate-800">
                  <span>Clique para acessar</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Close/Dismiss button in top-right */}
        <div className="absolute top-3 right-3 flex items-center gap-1 z-20">
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title={t('ad.hide')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </aside>
  );
};
