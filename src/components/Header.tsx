import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Bookmark, 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  Menu, 
  X, 
  Cross,
  Sparkles,
  Layers,
  Flame,
  ChevronDown,
  User as UserIcon,
  Globe,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { useTranslation } from '../lib/i18nContext';
import { LanguageSelector } from './LanguageSelector';
import { PWAInstallModal } from './PWAInstallModal';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string, param?: string) => void;
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onNavigate, favoritesCount }) => {
  const { user, isAdmin, signInWithGoogle, signOutUser } = useAuth();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [pwaModalOpen, setPwaModalOpen] = useState(false);

  const handleLogin = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
    } catch (e) {
      console.error('Falha no login:', e);
    } finally {
      setIsSigningIn(false);
    }
  };

  const navItems = [
    { id: 'welcome', label: t('nav.welcome') },
    { id: 'home', label: t('nav.home') },
    { id: 'sermoes', label: t('nav.sermons') },
    { id: 'ilustracoes', label: t('nav.illustrations') },
    { id: 'categorias', label: t('nav.categories') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0a192f]/95 backdrop-blur-md border-b border-amber-500/20 text-white transition-all shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div 
            onClick={() => { onNavigate('welcome'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0a192f] rounded-[10px] flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-amber-400 group-hover:rotate-3 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  Preg<span className="text-amber-400">AI</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 font-semibold uppercase tracking-wider rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Gospel
                </span>
              </div>
              <span className="text-xs text-slate-300 tracking-wider font-medium">
                Sermões Top &middot; Biblioteca Cristã
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    active 
                      ? 'bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30 shadow-sm' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Language Selector */}
            <LanguageSelector />

            {/* Install Android / PWA App Button */}
            <button
              onClick={() => setPwaModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all hover:scale-102"
              title="Instalar App no seu celular (Android / iOS)"
            >
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>App Android</span>
            </button>

            {/* Search Button trigger */}
            <button
              onClick={() => onNavigate('sermoes')}
              className="p-2.5 rounded-lg text-slate-300 hover:text-amber-400 hover:bg-slate-800/80 transition-colors"
              title={t('nav.search')}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Favorites Button */}
            {user && (
              <button
                onClick={() => onNavigate('favoritos')}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all ${
                  currentTab === 'favoritos'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
                title="Meus Sermões Salvos"
              >
                <Bookmark className="w-4 h-4 text-amber-400" />
                <span className="font-medium">Favoritos</span>
                {favoritesCount > 0 && (
                  <span className="bg-amber-500 text-slate-950 font-bold text-xs px-1.5 py-0.2 rounded-full min-w-5 text-center">
                    {favoritesCount}
                  </span>
                )}
              </button>
            )}

            {/* Admin Panel Link */}
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all shadow-sm ${
                  currentTab === 'admin'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-amber-500/25'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Painel Admin
              </button>
            )}

            {/* User Dropdown / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-800 border border-slate-700/80 transition-colors"
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'Usuário'} 
                      className="w-8 h-8 rounded-full object-cover border border-amber-400" 
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white text-xs font-bold">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <ChevronDown className="w-4 h-4 text-slate-400 pr-0.5" />
                </button>

                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 text-slate-200 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-sm font-semibold text-white truncate">
                        {user.displayName || 'Irmão em Cristo'}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {user.email}
                      </p>
                      {isAdmin && (
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-400/30">
                          Administrador
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => { onNavigate('favoritos'); setUserDropdownOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-slate-800 text-left transition-colors"
                    >
                      <Bookmark className="w-4 h-4 text-amber-400" />
                      Meus Sermões Salvos ({favoritesCount})
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => { onNavigate('admin'); setUserDropdownOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-slate-800 text-amber-300 text-left font-medium transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        Painel do Administrador
                      </button>
                    )}

                    <div className="my-1 border-t border-slate-800" />

                    <button
                      onClick={() => { signOutUser(); setUserDropdownOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Encerrar Sessão
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogin}
                disabled={isSigningIn}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-102"
              >
                <LogIn className="w-4 h-4" />
                {isSigningIn ? 'Entrando...' : 'Entrar'}
              </button>
            )}
          </div>

          {/* Mobile menu button & Language */}
          <div className="flex md:hidden items-center gap-1.5">
            <LanguageSelector compact />
            <button
              onClick={() => onNavigate('sermoes')}
              className="p-2 text-slate-300 hover:text-white"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-medium ${
                  currentTab === item.id 
                    ? 'bg-amber-500/20 text-amber-300 font-semibold' 
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
            {user && (
              <button
                onClick={() => { onNavigate('favoritos'); setMobileMenuOpen(false); }}
                className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg text-base ${
                  currentTab === 'favoritos' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  Favoritos
                </span>
                {favoritesCount > 0 && (
                  <span className="bg-amber-500 text-slate-950 font-bold text-xs px-2 py-0.5 rounded-full">
                    {favoritesCount}
                  </span>
                )}
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg text-amber-300 font-semibold bg-amber-500/15 border border-amber-500/30"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Painel do Administrador
              </button>
            )}

            {/* Mobile PWA Install Button */}
            <button
              onClick={() => { setPwaModalOpen(true); setMobileMenuOpen(false); }}
              className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg text-amber-300 font-semibold bg-gradient-to-r from-amber-500/15 to-transparent border border-amber-500/30"
            >
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>Instalar App no Celular (Android / iOS)</span>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border border-amber-400" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white text-xs font-bold">
                      {(user.displayName || 'U')[0]}
                    </div>
                  )}
                  <span className="text-sm font-medium text-white truncate max-w-[150px]">
                    {user.displayName || user.email}
                  </span>
                </div>
                <button
                  onClick={() => { signOutUser(); setMobileMenuOpen(false); }}
                  className="text-xs text-red-400 hover:text-red-300 font-semibold px-2 py-1 rounded bg-red-500/10"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => { handleLogin(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold py-2.5 rounded-lg"
              >
                <LogIn className="w-4 h-4" />
                Entrar com Google
              </button>
            )}
          </div>
        </div>
      )}

      {/* PWA Install Modal */}
      <PWAInstallModal
        isOpen={pwaModalOpen}
        onClose={() => setPwaModalOpen(false)}
      />
    </header>
  );
};
