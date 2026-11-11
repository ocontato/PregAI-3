import React, { useState } from 'react';
import { 
  BookOpen, 
  Compass, 
  LogIn, 
  UserPlus, 
  Bookmark, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Heart, 
  Layers, 
  Check, 
  LogOut,
  ChevronDown,
  Quote,
  Globe,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { AuthModal } from '../components/AuthModal';
import { SocialIcons } from '../components/SocialIcons';
import { SocialLinks } from '../types';
import { useTranslation } from '../lib/i18nContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { PWAInstallModal } from '../components/PWAInstallModal';

interface WelcomeScreenProps {
  onExploreLibrary: () => void;
  onGoToFavorites: () => void;
  onGoToAdmin: () => void;
  totalSermonsCount?: number;
  socialLinks?: SocialLinks;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onExploreLibrary,
  onGoToFavorites,
  onGoToAdmin,
  totalSermonsCount = 8,
  socialLinks,
}) => {
  const { user, isAdmin, signOutUser } = useAuth();
  const { t } = useTranslation();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [pwaModalOpen, setPwaModalOpen] = useState(false);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#050c18] via-[#09172e] to-[#040812] text-white flex flex-col justify-between overflow-hidden selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Bar with Language and PWA Android button */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex items-center justify-between">
        <button
          onClick={() => setPwaModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-amber-500/30 text-amber-300 text-xs font-semibold backdrop-blur-md shadow-md transition-all hover:scale-105"
          title="Instalar App no seu celular (Android / iOS)"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span>App Android / Celular</span>
        </button>

        <LanguageSelector />
      </div>

      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[450px] bg-gradient-to-b from-amber-500/15 via-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 flex-1 flex flex-col items-center justify-center text-center">
        
        {/* 1. Logotipo PregAI centralizado na parte superior */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-700 flex flex-col items-center gap-3 mb-6 sm:mb-8 select-none">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-0.5 shadow-xl shadow-amber-500/25">
            <div className="w-full h-full bg-[#0a192f] rounded-[14px] flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent opacity-60" />
              <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 relative z-10 drop-shadow-md" />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                Preg<span className="text-amber-400">AI</span>
              </span>
              <span className="text-[11px] px-2 py-0.5 font-bold uppercase tracking-wider rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/40">
                Gospel
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide mt-1">
              Sermões Top &middot; Biblioteca Cristã
            </p>
          </div>
        </div>

        {/* 2. Imagem de destaque de uma Bíblia aberta sobre uma mesa, com iluminação dourada e atmosfera acolhedora */}
        <div className="animate-in fade-in zoom-in-95 duration-1000 w-full max-w-2xl mx-auto mb-6 sm:mb-8 relative group">
          <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-2xl shadow-amber-500/10 bg-slate-900 aspect-[16/9] sm:aspect-[21/9]">
            <img
              src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=85"
              alt="Bíblia Sagrada aberta sobre uma mesa de madeira com luz dourada acolhedora"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="eager"
            />
            {/* Ambient gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07101f] via-[#07101f]/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07101f]/50 via-transparent to-[#07101f]/50" />
            
            {/* Top scripture watermark badge */}
            <div className="absolute top-3 left-4 sm:top-4 sm:left-5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-400/30 text-amber-300 text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Sola Scriptura &bull; Palavra Viva</span>
            </div>

            {/* Bottom scripture snippet on image */}
            <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-6 sm:right-6 text-left">
              <p className="text-xs sm:text-sm font-serif italic text-amber-100/90 drop-shadow line-clamp-1">
                "Toda a Escritura é divinamente inspirada e proveitosa para ensinar e instruir em justiça."
              </p>
              <span className="text-[10px] text-amber-400/80 font-mono font-bold tracking-wider">
                — 2 Timóteo 3:16
              </span>
            </div>
          </div>
        </div>

        {/* 3. Título principal: "Seja bem-vindo!" */}
        <h1 className="animate-in fade-in slide-in-from-bottom-2 duration-700 font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-3">
          {t('welcome.title')}
        </h1>

        {/* 4. Frase de destaque: "A Palavra que inspira. A mensagem que transforma." */}
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-700 max-w-xl mx-auto mb-4">
          <p className="font-serif text-lg sm:text-2xl text-amber-300 font-semibold italic tracking-wide">
            "{t('welcome.phrase')}"
          </p>
        </div>

        {/* 5. Texto descritivo */}
        <p className="animate-in fade-in slide-in-from-bottom-4 duration-700 text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed mb-8">
          {t('welcome.description')}
        </p>

        {/* USER LOGGED IN VS VISITOR ACTIONS */}
        {user ? (
          /* Card for already authenticated user */
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 w-full max-w-lg bg-slate-900/90 border border-amber-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3 text-left">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    className="w-10 h-10 rounded-full border border-amber-400 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                    {t('welcome.connectedAs')}
                  </p>
                  <p className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-[260px]">
                    {user.displayName || user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => signOutUser()}
                className="text-xs text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                title="Encerrar sessão"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={onExploreLibrary}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-102"
              >
                <Compass className="w-4 h-4" />
                <span>{t('welcome.explore')}</span>
              </button>

              <button
                onClick={onGoToFavorites}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-bold text-xs transition-colors"
              >
                <Bookmark className="w-4 h-4 text-amber-400" />
                <span>{t('welcome.myFavorites')}</span>
              </button>
            </div>

            {isAdmin && (
              <button
                onClick={onGoToAdmin}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-xs transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{t('welcome.adminPanel')}</span>
              </button>
            )}
          </div>
        ) : (
          /* BOTÕES PARA VISITANTES */
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 w-full max-w-lg space-y-3">
            
            {/* Botão Primário: "Explorar biblioteca" */}
            <button
              onClick={onExploreLibrary}
              className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:via-amber-400 hover:to-amber-500 text-slate-950 font-bold text-base shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Compass className="w-5 h-5 text-slate-950" />
              <span>{t('welcome.explore')}</span>
              <ArrowRight className="w-5 h-5 text-slate-950 ml-1" />
            </button>

            {/* Linha com Botões Secundários: "Entrar na minha conta" & "Criar minha conta" */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => handleOpenAuth('login')}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400/50 text-white font-semibold text-xs transition-all shadow-md"
              >
                <LogIn className="w-4 h-4 text-amber-400" />
                <span>{t('welcome.login')}</span>
              </button>

              <button
                onClick={() => handleOpenAuth('register')}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 font-semibold text-xs transition-all shadow-md"
              >
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span>{t('welcome.register')}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 pt-2">
              Navegação 100% gratuita &bull; Não é obrigatório login para ler sermões
            </p>
          </div>
        )}

        {/* Feature Highlights Pills */}
        <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Sermões Expositivos</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>9 Categorias Bíblicas</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Ilustrações para Púlpito</span>
          </div>
        </div>

        {/* Social Networks Icons in bottom section */}
        <div className="mt-8">
          <SocialIcons socialLinks={socialLinks} variant="welcome" />
        </div>

      </main>

      {/* Footer minimal */}
      <footer className="relative z-10 w-full py-5 text-center text-xs text-slate-400 border-t border-slate-800/60">
        <p>
          PregAI &middot; Sermões Top &middot; Biblioteca Gospel &bull; Soli Deo Gloria
        </p>
      </footer>

      {/* Auth Modal for Login and Register */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccessNavigate={onExploreLibrary}
      />

      {/* PWA Install Modal */}
      <PWAInstallModal
        isOpen={pwaModalOpen}
        onClose={() => setPwaModalOpen(false)}
      />

    </div>
  );
};
