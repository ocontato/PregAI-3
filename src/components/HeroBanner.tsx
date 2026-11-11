import React, { useState } from 'react';
import { Search, Sparkles, BookOpen, Flame, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  onSearch: (searchTerm: string) => void;
  onSelectCategory: (categorySlug: string) => void;
  onExplore: () => void;
  featuredCount: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSearch,
  onSelectCategory,
  onExplore,
  featuredCount,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  const quickPills = [
    { label: 'Fé', slug: 'fe' },
    { label: 'Oração', slug: 'oracao' },
    { label: 'Família', slug: 'familia' },
    { label: 'Salvação', slug: 'salvacao' },
    { label: 'Jesus', slug: 'jesus' },
    { label: 'Espírito Santo', slug: 'espirito-santo' },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0a192f] via-[#0d1f38] to-slate-950 text-white border-b border-amber-500/20 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center space-y-6">
        
        {/* Top pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Biblioteca Digital Gospel de Sermões & Esboços</span>
        </div>

        {/* Main Title */}
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
          Alimente seu Ministério com a{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
            Verdade da Palavra
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Esboços de pregação expositiva, sermões completos, estudos teológicos aprofundados e ilustrações marcantes para transformar mensagens e edificar a Igreja.
        </p>

        {/* Search Box */}
        <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto pt-2">
          <div className="relative flex items-center shadow-2xl rounded-2xl bg-slate-900/90 border border-amber-500/30 p-2 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
            <Search className="w-5 h-5 text-amber-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Pesquise por título, tema, autor ou passagem bíblica (ex: João 3:16, Fé)..."
              className="w-full bg-transparent px-3 py-2 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md transition-all shrink-0 hover:scale-102"
            >
              Pesquisar
            </button>
          </div>
        </form>

        {/* Quick Category Suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
          <span className="text-slate-400 font-medium">Temas populares:</span>
          {quickPills.map((pill) => (
            <button
              key={pill.slug}
              onClick={() => onSelectCategory(pill.slug)}
              className="px-3 py-1 rounded-full bg-slate-900/80 hover:bg-amber-500/20 hover:text-amber-300 text-slate-300 border border-slate-800 transition-colors"
            >
              {pill.label}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
