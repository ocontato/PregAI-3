import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, X, ArrowUpDown } from 'lucide-react';
import { Sermon, Category } from '../types';
import { SermonCard } from '../components/SermonCard';
import { useTranslation } from '../lib/i18nContext';

interface SermonsPageProps {
  sermons: Sermon[];
  categories: Category[];
  initialCategory?: string;
  initialSearch?: string;
  favoriteIds: Set<string>;
  onToggleFavorite: (sermon: Sermon) => void;
  onSelectSermon: (sermon: Sermon) => void;
}

export const SermonsPage: React.FC<SermonsPageProps> = ({
  sermons,
  categories,
  initialCategory = 'todas',
  initialSearch = '',
  favoriteIds,
  onToggleFavorite,
  onSelectSermon,
}) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<'recent' | 'az' | 'readingTime'>('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 9;

  // Filter & Sort
  const filteredSermons = useMemo(() => {
    let list = sermons.filter((s) => {
      const matchCategory = selectedCategory === 'todas' || 
        s.categorySlug === selectedCategory || 
        s.category.toLowerCase() === selectedCategory.toLowerCase();

      const searchLower = search.toLowerCase().trim();
      const matchSearch = !searchLower ||
        s.title.toLowerCase().includes(searchLower) ||
        (s.subtitle && s.subtitle.toLowerCase().includes(searchLower)) ||
        s.description.toLowerCase().includes(searchLower) ||
        s.author.toLowerCase().includes(searchLower) ||
        (s.biblicalReferences && s.biblicalReferences.toLowerCase().includes(searchLower)) ||
        (s.keywords && s.keywords.some(k => k.toLowerCase().includes(searchLower)));

      return matchCategory && matchSearch;
    });

    if (sortBy === 'recent') {
      list.sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
    } else if (sortBy === 'az') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'readingTime') {
      list.sort((a, b) => (a.readingTimeMinutes || 0) - (b.readingTimeMinutes || 0));
    }

    return list;
  }, [sermons, selectedCategory, search, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredSermons.length / PAGE_SIZE);
  const paginatedSermons = filteredSermons.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-[#0a192f] via-[#0d1f38] to-slate-950 border-b border-amber-500/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Biblioteca de <span className="text-amber-400">Sermões & Esboços</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Mensagens expositivas e temáticas estruturadas para edificação, pregação no púlpito e discipulado cristão.
          </p>

          {/* Search bar */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div className="relative flex items-center bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 shadow-xl focus-within:border-amber-400">
              <Search className="w-5 h-5 text-amber-400 mr-2 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder={t('search.placeholder')}
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog View */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Controls Bar: Category filter pills & Sorting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          
          {/* Categories Pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => { setSelectedCategory('todas'); setCurrentPage(1); }}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                selectedCategory === 'todas'
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                  : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800'
              }`}
            >
              {t('search.allCategories')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id || cat.slug}
                onClick={() => { setSelectedCategory(cat.slug); setCurrentPage(1); }}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:border-amber-400"
            >
              <option value="recent">Mais Recentes</option>
              <option value="az">Título (A-Z)</option>
              <option value="readingTime">Tempo de Leitura</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="py-4 flex items-center justify-between text-xs text-slate-400">
          <span>
            Exibindo <span className="text-amber-400 font-bold">{filteredSermons.length}</span> sermões encontrados
          </span>
          {totalPages > 1 && (
            <span>
              Página {currentPage} de {totalPages}
            </span>
          )}
        </div>

        {/* Sermons Grid */}
        {filteredSermons.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/40 rounded-2xl border border-slate-800 p-8 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-white">{t('sermon.noResults')}</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Nenhum estudo corresponde à sua busca. Tente buscar por palavras-chave mais amplas ou limpar os filtros.
            </p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('todas'); }}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedSermons.map((sermon) => (
              <SermonCard
                key={sermon.id}
                sermon={sermon}
                isFavorite={favoriteIds.has(sermon.id)}
                onToggleFavorite={onToggleFavorite}
                onSelect={onSelectSermon}
              />
            ))}
          </div>
        )}

        {/* Pagination buttons */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold disabled:opacity-40 hover:bg-slate-800 transition-colors"
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  currentPage === page
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold disabled:opacity-40 hover:bg-slate-800 transition-colors"
            >
              Próxima
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
