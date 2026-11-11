import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  Copy, 
  Check, 
  X, 
  User, 
  Share2, 
  Quote,
  Layers
} from 'lucide-react';
import { Illustration } from '../types';
import { CategoryBadge } from '../components/CategoryBadge';

interface IllustrationsPageProps {
  illustrations: Illustration[];
  onSelectCategory: (categorySlug: string) => void;
}

export const IllustrationsPage: React.FC<IllustrationsPageProps> = ({
  illustrations,
  onSelectCategory,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [activeModalIllustration, setActiveModalIllustration] = useState<Illustration | null>(null);
  const [copied, setCopied] = useState(false);

  // Filter
  const filtered = illustrations.filter((item) => {
    const matchCategory = selectedCategory === 'todas' || item.category === selectedCategory;
    const matchSearch = !search || 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.story.toLowerCase().includes(search.toLowerCase()) ||
      item.application.toLowerCase().includes(search.toLowerCase()) ||
      (item.biblicalReference && item.biblicalReference.toLowerCase().includes(search.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const categories = ['todas', 'Fé', 'Oração', 'Família', 'Salvação', 'Jesus', 'Espírito Santo', 'Vida Cristã'];

  const copyToClipboard = async (ill: Illustration) => {
    const textToCopy = `*ILUSTRAÇÃO: ${ill.title}*\n${ill.biblicalReference ? `Referência: ${ill.biblicalReference}\n` : ''}\n${ill.story}\n\n*APLICAÇÃO NA PREGAÇÃO:*\n${ill.application}\n\n(Fonte: PregAI - Sermões Top)`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Falha ao copiar:', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-[#0a192f] via-[#0d1f38] to-slate-950 border-b border-amber-500/20 py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Recursos para Pregadores
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Ilustrações <span className="text-amber-400">Gospel</span> & Parábolas
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Histórias marcantes, parábolas práticas e analogias poderosas para enriquecer a introdução, corpo e apelo dos seus sermões.
          </p>

          {/* Search bar */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative flex items-center bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 shadow-lg focus-within:border-amber-400">
              <Search className="w-5 h-5 text-amber-400 mr-2 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar ilustração por tema, história ou versículo..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1 rounded-full border transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800'
                }`}
              >
                {cat === 'todas' ? 'Todas' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Illustrations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-slate-400 font-medium">
            Exibindo <span className="text-amber-400 font-bold">{filtered.length}</span> ilustrações
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
            <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-white mb-1">Nenhuma ilustração encontrada</h3>
            <p className="text-xs text-slate-400">Tente buscar por outro termo ou limpe os filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((ill) => (
              <div
                key={ill.id}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-amber-500/5 hover:-translate-y-1"
              >
                {ill.imageUrl && (
                  <div className="h-44 w-full overflow-hidden relative bg-slate-950">
                    <img
                      src={ill.imageUrl}
                      alt={ill.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <CategoryBadge category={ill.category} size="sm" />
                    </div>
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {!ill.imageUrl && (
                      <div className="mb-3">
                        <CategoryBadge category={ill.category} size="sm" />
                      </div>
                    )}

                    {ill.biblicalReference && (
                      <div className="flex items-center gap-1 text-xs text-amber-400 font-medium mb-2">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{ill.biblicalReference}</span>
                      </div>
                    )}

                    <h3 
                      onClick={() => setActiveModalIllustration(ill)}
                      className="font-serif text-lg font-bold text-white hover:text-amber-300 transition-colors cursor-pointer line-clamp-2 mb-2.5"
                    >
                      {ill.title}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-4 leading-relaxed mb-4">
                      {ill.story}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800">
                    <div className="bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 text-xs text-amber-200 line-clamp-2 mb-3">
                      <span className="font-bold text-amber-400">Aplicação: </span>
                      {ill.application}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                        {ill.author || 'Tradicional Gospel'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(ill)}
                          className="flex items-center gap-1 text-xs text-slate-300 hover:text-amber-400 p-1.5 rounded-md hover:bg-slate-800 transition-colors"
                          title="Copiar texto para esboço"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Copiar</span>
                        </button>
                        <button
                          onClick={() => setActiveModalIllustration(ill)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                        >
                          Ver Completo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Detail for Illustration */}
      {activeModalIllustration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 text-white relative">
            <button
              onClick={() => setActiveModalIllustration(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <CategoryBadge category={activeModalIllustration.category} size="md" />
              {activeModalIllustration.biblicalReference && (
                <span className="text-xs text-amber-400 font-semibold">
                  &bull; {activeModalIllustration.biblicalReference}
                </span>
              )}
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-4">
              {activeModalIllustration.title}
            </h2>

            {activeModalIllustration.imageUrl && (
              <div className="rounded-xl overflow-hidden mb-6 max-h-60 border border-slate-800">
                <img
                  src={activeModalIllustration.imageUrl}
                  alt={activeModalIllustration.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-6 text-slate-200 text-sm sm:text-base leading-relaxed">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 font-mono">
                  A História / Parábola:
                </h4>
                <p className="whitespace-pre-line bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  {activeModalIllustration.story}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 font-mono">
                  Aplicação e Moral na Pregação:
                </h4>
                <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/30 text-amber-100 font-serif italic text-base">
                  <Quote className="w-5 h-5 text-amber-400 mb-1 opacity-70" />
                  {activeModalIllustration.application}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
              <p className="text-xs text-slate-400">
                Autor / Fonte: <span className="text-slate-300 font-semibold">{activeModalIllustration.author || 'Tradicional'}</span>
              </p>
              <button
                onClick={() => copyToClipboard(activeModalIllustration)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  copied 
                    ? 'bg-emerald-500 text-slate-950' 
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copiado para o Esboço!' : 'Copiar para meu Esboço'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
