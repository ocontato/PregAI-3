import React, { useState } from 'react';
import { 
  Bookmark, 
  Share2, 
  Clock, 
  BookOpen, 
  User, 
  ArrowRight,
  Flame,
  Download,
  FileText,
  Check
} from 'lucide-react';
import { Sermon } from '../types';
import { CategoryBadge } from './CategoryBadge';
import { ShareModal } from './ShareModal';
import { useAuth } from '../lib/authContext';
import { exportSermonToDoc, exportSermonToPdf } from '../lib/exportService';
import { useTranslation } from '../lib/i18nContext';

interface SermonCardProps {
  sermon: Sermon;
  isFavorite: boolean;
  onToggleFavorite: (sermon: Sermon) => void;
  onSelect: (sermon: Sermon) => void;
}

export const SermonCard: React.FC<SermonCardProps> = ({
  sermon,
  isFavorite,
  onToggleFavorite,
  onSelect,
}) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [shareOpen, setShareOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<'pdf' | 'doc' | null>(null);

  const handleDownloadDoc = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setDownloadSuccess('doc');
      exportSermonToDoc(sermon);
      setTimeout(() => {
        setDownloadSuccess(null);
        setDownloadOpen(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      setDownloadSuccess(null);
    }
  };

  const handleDownloadPdf = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setDownloadSuccess('pdf');
      exportSermonToPdf(sermon);
      setTimeout(() => {
        setDownloadSuccess(null);
        setDownloadOpen(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      setDownloadSuccess(null);
    }
  };

  const formattedDate = sermon.publishedAt 
    ? new Date(sermon.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';

  return (
    <>
      <article className="group bg-slate-900/90 rounded-2xl border border-slate-800/80 hover:border-amber-500/40 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-1">
        {/* Cover Image & Badges */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-950">
          <img
            src={sermon.imageUrl || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=800&q=80'}
            alt={sermon.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          {/* Top badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <CategoryBadge category={sermon.category} size="sm" />
            {sermon.featured && (
              <span className="flex items-center gap-1 bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md">
                <Flame className="w-3 h-3 fill-current" />
                {t('sermon.featured')}
              </span>
            )}
          </div>

          {/* Quick Actions (Favorite, Download & Share) */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            {/* Download Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDownloadOpen(!downloadOpen);
                }}
                className="p-2 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-300 hover:text-amber-400 hover:bg-slate-900 transition-colors"
                title={t('sermon.download')}
              >
                <Download className="w-4 h-4" />
              </button>

              {downloadOpen && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 mt-1 w-44 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-1 z-30 text-xs text-slate-200"
                  onMouseLeave={() => setDownloadOpen(false)}
                >
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-800 text-left transition-colors font-medium text-white"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-rose-400" />
                      <span>{t('sermon.downloadPdf')}</span>
                    </div>
                    {downloadSuccess === 'pdf' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1 py-0.2 rounded font-mono font-bold">PDF</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadDoc}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-800 text-left transition-colors font-medium text-white border-t border-slate-800/80"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                      <span>{t('sermon.downloadDoc')}</span>
                    </div>
                    {downloadSuccess === 'doc' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1 py-0.2 rounded font-mono font-bold">DOC</span>
                    )}
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(sermon);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                isFavorite 
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30' 
                  : 'bg-slate-900/80 text-slate-300 hover:text-amber-400 hover:bg-slate-900'
              }`}
              title={isFavorite ? 'Remover dos favoritos' : 'Salvar sermão'}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShareOpen(true);
              }}
              className="p-2 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-300 hover:text-amber-400 hover:bg-slate-900 transition-colors"
              title="Compartilhar"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Reading time overlay on image */}
          <div className="absolute bottom-2 right-3 flex items-center gap-1 text-[11px] font-medium text-slate-300 bg-slate-950/70 backdrop-blur-sm px-2 py-0.5 rounded-md border border-slate-800">
            <Clock className="w-3 h-3 text-amber-400" />
            {sermon.readingTimeMinutes || 5} {t('sermon.readingTime')}
          </div>
        </div>

        {/* Content body */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Biblical Reference Badge */}
            {sermon.biblicalReferences && (
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium mb-2.5">
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{sermon.biblicalReferences}</span>
              </div>
            )}

            {/* Title */}
            <h3 
              onClick={() => onSelect(sermon)}
              className="font-serif text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 cursor-pointer leading-snug mb-2"
            >
              {sermon.title}
            </h3>

            {/* Description / Summary */}
            <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
              {sermon.description}
            </p>
          </div>

          {/* Card Footer: Author, Date & Read Link */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5 truncate pr-2">
              <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-amber-400">
                <User className="w-3 h-3" />
              </div>
              <span className="truncate font-medium text-slate-300">{sermon.author}</span>
            </div>

            <button
              onClick={() => onSelect(sermon)}
              className="flex items-center gap-1 font-semibold text-amber-400 group-hover:translate-x-0.5 transition-transform shrink-0"
            >
              <span>{t('sermon.read')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </article>

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        title={sermon.title}
        biblicalReferences={sermon.biblicalReferences}
        url={typeof window !== 'undefined' ? `${window.location.origin}?sermon=${sermon.slug}` : ''}
      />
    </>
  );
};
