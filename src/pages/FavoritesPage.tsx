import React from 'react';
import { Bookmark, ArrowRight, Trash2, LogIn, BookOpen } from 'lucide-react';
import { Favorite, Sermon } from '../types';
import { useAuth } from '../lib/authContext';
import { CategoryBadge } from '../components/CategoryBadge';

interface FavoritesPageProps {
  favorites: Favorite[];
  sermons: Sermon[];
  onRemoveFavorite: (favoriteId: string) => void;
  onSelectSermon: (sermon: Sermon) => void;
  onExplore: () => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  favorites,
  sermons,
  onRemoveFavorite,
  onSelectSermon,
  onExplore,
}) => {
  const { user, signInWithGoogle } = useAuth();

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 bg-slate-950 text-white">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/30">
            <Bookmark className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">
            Faça login para salvar seus sermões
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Mantenha seus esboços e sermões prediletos salvos na sua conta para consultar sempre que for ministrar ou estudar a Bíblia.
          </p>
          <button
            onClick={() => signInWithGoogle()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
          >
            <LogIn className="w-4 h-4" />
            Entrar com Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0a192f] via-[#0d1f38] to-slate-950 border-b border-amber-500/20 py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            Minha Coleção Pessoal
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Meus Sermões <span className="text-amber-400">Favoritos</span>
          </h1>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Todos os estudos e esboços que você marcou para consulta rápida e preparação de mensagens.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800 p-8 space-y-4">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-white">Você ainda não tem sermões salvos</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Ao navegar pela biblioteca, clique no ícone de marcador para guardar seus sermões prediletos aqui.
            </p>
            <button
              onClick={onExplore}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
            >
              Explorar Biblioteca de Sermões
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>{favorites.length} sermões salvos</span>
            </div>

            {favorites.map((fav) => {
              const matchedSermon = sermons.find(s => s.id === fav.sermonId);

              return (
                <div
                  key={fav.id}
                  className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-amber-500/40 transition-all shadow-md"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {fav.sermonImageUrl ? (
                      <img
                        src={fav.sermonImageUrl}
                        alt=""
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-slate-800"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 shrink-0">
                        <BookOpen className="w-6 h-6" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <CategoryBadge category={fav.sermonCategory} size="sm" />
                      <h4 
                        onClick={() => matchedSermon && onSelectSermon(matchedSermon)}
                        className="font-serif text-base sm:text-lg font-bold text-white hover:text-amber-300 transition-colors cursor-pointer line-clamp-1"
                      >
                        {fav.sermonTitle}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Por: <span className="text-slate-300 font-medium">{fav.sermonAuthor}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => onRemoveFavorite(fav.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Remover dos favoritos"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {matchedSermon && (
                      <button
                        onClick={() => onSelectSermon(matchedSermon)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                      >
                        <span>Ler Sermão</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
