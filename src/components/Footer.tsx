import React from 'react';
import { BookOpen, Heart, ShieldCheck, Globe } from 'lucide-react';
import { SocialIcons } from './SocialIcons';
import { SocialLinks } from '../types';
import { useTranslation } from '../lib/i18nContext';
import { LanguageSelector } from './LanguageSelector';

interface FooterProps {
  onNavigate: (tab: string, param?: string) => void;
  categories: { name: string; slug: string }[];
  socialLinks?: SocialLinks;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, categories, socialLinks }) => {
  const { t } = useTranslation();
  return (
    <footer className="bg-[#060d17] border-t border-slate-800/80 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Column 1: Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div 
              onClick={() => onNavigate('welcome')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center p-0.5 shadow-md shadow-amber-500/20">
                <div className="w-full h-full bg-[#0a192f] rounded-[10px] flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-white tracking-tight">
                  Preg<span className="text-amber-400">AI</span>
                </span>
                <p className="text-[11px] text-slate-400 font-medium">Sermões Top &middot; Biblioteca Gospel</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Uma biblioteca digital completa com sermões expositivos, esboços bíblicos, estudos teológicos e ilustrações cristãs para pastores, líderes e estudantes da Palavra.
            </p>

            <div className="pt-1">
              <SocialIcons socialLinks={socialLinks} variant="footer" />
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs italic text-amber-300/90 font-serif">
              "Lâmpada para os meus pés é a tua palavra e luz para o meu caminho."
              <span className="block not-italic text-[11px] font-sans text-slate-400 mt-1 font-semibold">
                — Salmos 119:105
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4 font-mono">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('welcome')} 
                  className="hover:text-amber-400 transition-colors"
                >
                  Tela de Boas-vindas
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('home')} 
                  className="hover:text-amber-400 transition-colors"
                >
                  Página Inicial
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('sermoes')} 
                  className="hover:text-amber-400 transition-colors"
                >
                  Biblioteca de Sermões
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('ilustracoes')} 
                  className="hover:text-amber-400 transition-colors"
                >
                  Ilustrações Gospel
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('categorias')} 
                  className="hover:text-amber-400 transition-colors"
                >
                  Todas as Categorias
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('favoritos')} 
                  className="hover:text-amber-400 transition-colors"
                >
                  Meus Sermões Salvos
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Top Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4 font-mono">
              Categorias em Destaque
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {categories.slice(0, 9).map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => onNavigate('sermoes', cat.slug)}
                  className="text-xs px-2.5 py-1 rounded-md bg-slate-900 hover:bg-amber-500/10 hover:text-amber-400 text-slate-300 border border-slate-800 transition-colors"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Column 4: Admin & Language */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 font-mono">
                Idioma / Language
              </h4>
              <LanguageSelector />
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 font-mono">
                Administração
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Painel com gestão completa de publicações, esboço de pregação, novas categorias e ilustrações.
              </p>
              <button
                onClick={() => onNavigate('admin')}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-medium text-amber-400 border border-slate-800 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                Acesso ao Painel CMS
              </button>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} Sermões Top - Biblioteca Gospel (PregAI). {t('footer.rights')}
          </p>
          <p className="flex items-center gap-1.5 text-slate-400">
            Dedicado à edificação do Corpo de Cristo <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" /> Soli Deo Gloria
          </p>
        </div>
      </div>
    </footer>
  );
};
