import React from 'react';
import { 
  Flame, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Layers, 
  ShieldCheck, 
  Quote,
  Clock,
  Compass
} from 'lucide-react';
import { Sermon, Category, Illustration } from '../types';
import { HeroBanner } from '../components/HeroBanner';
import { SermonCard } from '../components/SermonCard';
import { CategoryBadge } from '../components/CategoryBadge';

interface HomePageProps {
  sermons: Sermon[];
  categories: Category[];
  illustrations: Illustration[];
  favoriteIds: Set<string>;
  onToggleFavorite: (sermon: Sermon) => void;
  onSelectSermon: (sermon: Sermon) => void;
  onSelectCategory: (categorySlug: string) => void;
  onNavigate: (tab: string, param?: string) => void;
  onSearch: (searchTerm: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  sermons,
  categories,
  illustrations,
  favoriteIds,
  onToggleFavorite,
  onSelectSermon,
  onSelectCategory,
  onNavigate,
  onSearch,
}) => {
  // Filter featured & recent
  const featuredSermons = sermons.filter(s => s.featured).slice(0, 3);
  const recentSermons = sermons.slice(0, 6);
  const previewIllustrations = illustrations.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      
      {/* Hero Banner */}
      <HeroBanner
        onSearch={onSearch}
        onSelectCategory={onSelectCategory}
        onExplore={() => onNavigate('sermoes')}
        featuredCount={featuredSermons.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pt-16">
        
        {/* 1. FEATURED SERMONS */}
        {featuredSermons.length > 0 && (
          <section>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 font-mono mb-1">
                  <Flame className="w-4 h-4 fill-current" />
                  Mensagens em Evidência
                </div>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
                  Sermões em <span className="text-amber-400">Destaque</span>
                </h2>
              </div>
              <button
                onClick={() => onNavigate('sermoes')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>Ver biblioteca completa</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSermons.map((sermon) => (
                <SermonCard
                  key={sermon.id}
                  sermon={sermon}
                  isFavorite={favoriteIds.has(sermon.id)}
                  onToggleFavorite={onToggleFavorite}
                  onSelect={onSelectSermon}
                />
              ))}
            </div>
          </section>
        )}

        {/* 2. CATEGORIES BROWSER */}
        <section className="bg-slate-900/60 rounded-3xl border border-slate-800/80 p-8 sm:p-10 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 font-mono mb-2">
              <Layers className="w-3.5 h-3.5" />
              Navegue por Doutrina
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Categorias Teológicas
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Encontre esboços organizados por temas fundamentais da fé bíblica.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {categories.map((cat) => {
              const count = sermons.filter(s => s.categorySlug === cat.slug || s.category === cat.name).length;
              return (
                <button
                  key={cat.id || cat.slug}
                  onClick={() => onSelectCategory(cat.slug)}
                  className="group flex flex-col items-center text-center p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/40 transition-all hover:scale-102"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif text-sm font-bold text-white group-hover:text-amber-300 transition-colors mb-1">
                    {cat.name}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {count} {count === 1 ? 'sermão' : 'sermões'}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. RECENT SERMONS */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 font-mono mb-1">
                <Sparkles className="w-4 h-4" />
                Novas Adições
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
                Publicações Recentes
              </h2>
            </div>
            <button
              onClick={() => onNavigate('sermoes')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>Explorar todos os sermões</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentSermons.map((sermon) => (
              <SermonCard
                key={sermon.id}
                sermon={sermon}
                isFavorite={favoriteIds.has(sermon.id)}
                onToggleFavorite={onToggleFavorite}
                onSelect={onSelectSermon}
              />
            ))}
          </div>
        </section>

        {/* 4. GOSPEL ILLUSTRATIONS PREVIEW */}
        {previewIllustrations.length > 0 && (
          <section className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 font-mono mb-1">
                  <Compass className="w-4 h-4" />
                  Histórias & Aplicações
                </div>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
                  Ilustrações Gospel para o Púlpito
                </h2>
              </div>
              <button
                onClick={() => onNavigate('ilustracoes')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>Ver todas as ilustrações</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {previewIllustrations.map((ill) => (
                <div
                  key={ill.id}
                  onClick={() => onNavigate('ilustracoes')}
                  className="group bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between hover:border-amber-500/40 transition-all cursor-pointer shadow-lg hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <CategoryBadge category={ill.category} size="sm" />
                      {ill.biblicalReference && (
                        <span className="text-[11px] text-amber-400 font-medium truncate max-w-[150px]">
                          {ill.biblicalReference}
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-amber-300 transition-colors mb-2 line-clamp-1">
                      {ill.title}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                      {ill.story}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-400">
                    <span>Ler ilustração completa</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. CALLOUT BANNER FOR PREACHERS */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-[#0a192f] border border-amber-500/30 p-8 sm:p-12 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              Para Pastores, Líderes & Mestres
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
              Prepare pregações com profundidade teológica e relevância pastoral
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              O PregAI oferece esboços claros, divisões homiléticas consagradas, citações históricas e aplicações bíblicas contemporâneas para abençoar o seu rebanho.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('sermoes')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-102"
            >
              Explorar Sermões Agora
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
