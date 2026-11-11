import React from 'react';
import { 
  Shield, 
  HeartHandshake, 
  Home, 
  Megaphone, 
  Cross, 
  Crown, 
  Flame, 
  Clock, 
  Sparkles, 
  BookOpen, 
  ArrowRight,
  Layers
} from 'lucide-react';
import { Category, Sermon } from '../types';

interface CategoriesPageProps {
  categories: Category[];
  sermons: Sermon[];
  onSelectCategory: (categorySlug: string) => void;
}

const CATEGORY_ICON_MAP: Record<string, any> = {
  'Shield': Shield,
  'HeartHandshake': HeartHandshake,
  'Home': Home,
  'Megaphone': Megaphone,
  'Cross': Cross,
  'Crown': Crown,
  'Flame': Flame,
  'Clock': Clock,
  'Sparkles': Sparkles,
};

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  categories,
  sermons,
  onSelectCategory,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      
      {/* Banner */}
      <div className="bg-gradient-to-b from-[#0a192f] via-[#0d1f38] to-slate-950 border-b border-amber-500/20 py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Taxonomia Teológica
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Categorias de <span className="text-amber-400">Sermões & Estudos</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Navegue pelos principais temas bíblicos da fé cristã, desde a doutrina da salvação até a vida familiar e a esperança escatológica.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const IconComponent = CATEGORY_ICON_MAP[cat.icon || ''] || BookOpen;
            const sermonCount = sermons.filter(s => s.categorySlug === cat.slug || s.category === cat.name).length;

            return (
              <div
                key={cat.id || cat.slug}
                onClick={() => onSelectCategory(cat.slug)}
                className="group bg-slate-900/90 rounded-2xl border border-slate-800/90 hover:border-amber-500/40 p-6 flex flex-col justify-between cursor-pointer transition-all hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
                      {sermonCount} {sermonCount === 1 ? 'sermão' : 'sermões'}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-300 transition-colors mb-2">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {cat.description || 'Explore mensagens e esboços expositivos focados neste tema.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-400">
                  <span>Explorar sermões</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
