import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  Clock, 
  Calendar, 
  User, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Printer, 
  Sparkles,
  ChevronRight,
  Quote,
  Download,
  FileText,
  Check,
  ChevronDown
} from 'lucide-react';
import { Sermon } from '../types';
import { CategoryBadge } from '../components/CategoryBadge';
import { ShareModal } from '../components/ShareModal';
import { SermonCard } from '../components/SermonCard';
import { exportSermonToDoc, exportSermonToPdf } from '../lib/exportService';
import { ReadingModeModal } from '../components/ReadingModeModal';
import { useTranslation } from '../lib/i18nContext';

interface SermonDetailPageProps {
  sermon: Sermon;
  relatedSermons: Sermon[];
  isFavorite: boolean;
  onToggleFavorite: (sermon: Sermon) => void;
  onBack: () => void;
  onSelectSermon: (sermon: Sermon) => void;
  onSelectCategory: (categorySlug: string) => void;
}

export const SermonDetailPage: React.FC<SermonDetailPageProps> = ({
  sermon,
  relatedSermons,
  isFavorite,
  onToggleFavorite,
  onBack,
  onSelectSermon,
  onSelectCategory,
}) => {
  const { t } = useTranslation();
  const [shareOpen, setShareOpen] = useState(false);
  const [readingModeOpen, setReadingModeOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<'pdf' | 'doc' | null>(null);

  const handleDownloadDoc = () => {
    try {
      setDownloadingFormat('doc');
      exportSermonToDoc(sermon);
      setTimeout(() => {
        setDownloadingFormat(null);
        setDownloadMenuOpen(false);
      }, 1200);
    } catch (e) {
      console.error('Erro ao baixar DOC:', e);
      setDownloadingFormat(null);
    }
  };

  const handleDownloadPdf = () => {
    try {
      setDownloadingFormat('pdf');
      exportSermonToPdf(sermon);
      setTimeout(() => {
        setDownloadingFormat(null);
        setDownloadMenuOpen(false);
      }, 1200);
    } catch (e) {
      console.error('Erro ao baixar PDF:', e);
      setDownloadingFormat(null);
    }
  };

  // Stop speech when navigating away
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [sermon.id]);

  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Seu navegador não suporta leitura em áudio.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      // Prepare clean text without markdown characters
      const cleanText = `${sermon.title}. ${sermon.biblicalReferences ? `Referência: ${sermon.biblicalReferences}.` : ''} ${sermon.description}. ${sermon.content.replace(/[#*>\-_]/g, '')}`;
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = sermon.publishedAt 
    ? new Date(sermon.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'Data não informada';

  // Helper to render markdown-like content into clean styled HTML
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      if (!trimmed) {
        return <div key={idx} className="h-4" />;
      }

      // Horizontal rule
      if (trimmed === '---') {
        return <hr key={idx} className="my-6 border-slate-800" />;
      }

      // H2 Headings
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="font-serif text-2xl sm:text-3xl font-bold text-amber-300 mt-8 mb-4 border-b border-amber-500/20 pb-2">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }

      // H3 Headings
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="font-serif text-xl sm:text-2xl font-bold text-white mt-6 mb-3">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      // Blockquotes (e.g. Bible verses)
      if (trimmed.startsWith('> ')) {
        const quoteText = trimmed.replace('> ', '');
        return (
          <blockquote 
            key={idx} 
            className="my-5 p-4 sm:p-5 rounded-xl bg-amber-500/10 border-l-4 border-amber-500 text-amber-100 font-serif italic text-base sm:text-lg relative shadow-inner"
          >
            <Quote className="w-5 h-5 text-amber-400 mb-1 opacity-70" />
            <span>{quoteText.replace(/\*/g, '')}</span>
          </blockquote>
        );
      }

      // Bullet points
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={idx} className="ml-5 list-disc text-slate-300 my-1.5 leading-relaxed">
            {trimmed.substring(2)}
          </li>
        );
      }

      // Numbered items
      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <div key={idx} className="ml-2 font-medium text-slate-200 my-2 leading-relaxed flex items-start gap-2">
            <span className="text-amber-400 font-bold shrink-0">{trimmed.match(/^\d+\./)?.[0]}</span>
            <span>{trimmed.replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      }

      // Normal paragraph
      return (
        <p key={idx} className="text-slate-300 my-3 leading-relaxed">
          {trimmed}
        </p>
      );
    });
  };

  const fontClass = {
    normal: 'text-base sm:text-lg',
    large: 'text-lg sm:text-xl',
    xlarge: 'text-xl sm:text-2xl',
  }[fontSize];

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="bg-[#0a192f] border-b border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8 sticky top-20 z-40 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('detail.back')}</span>
          </button>

          <div className="flex items-center gap-2">
            
            {/* Reading Mode / Pulpit Button */}
            <button
              onClick={() => setReadingModeOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-102"
              title={t('detail.readingModeDesc')}
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-950" />
              <span>{t('detail.readingMode')}</span>
            </button>

            {/* Audio Reader */}
            <button
              onClick={toggleSpeech}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isPlayingAudio 
                  ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse' 
                  : 'bg-slate-900 text-slate-300 hover:text-amber-400 border-slate-700'
              }`}
              title={isPlayingAudio ? t('detail.pauseAudio') : t('detail.listen')}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isPlayingAudio ? t('detail.pauseAudio') : t('detail.listen')}</span>
            </button>

            {/* Font Size Controls */}
            <div className="hidden sm:flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 text-xs font-semibold rounded ${fontSize === 'normal' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                title="Tamanho Normal"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 text-sm font-semibold rounded ${fontSize === 'large' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                title="Tamanho Grande"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-1 text-base font-bold rounded ${fontSize === 'xlarge' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                title="Tamanho Máximo para Púlpito"
              >
                A++
              </button>
            </div>

            {/* Download Dropdown (PDF / DOC) */}
            <div className="relative">
              <button
                onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-all shadow-sm"
                title="Baixar sermão em DOC ou PDF"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Baixar</span>
                <ChevronDown className="w-3 h-3 text-amber-400/80" />
              </button>

              {downloadMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-60 rounded-2xl bg-slate-900 border border-slate-700/90 shadow-2xl py-2 z-50 text-slate-200 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setDownloadMenuOpen(false)}
                >
                  <div className="px-3.5 py-1.5 border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                    Escolha o formato:
                  </div>

                  <button
                    onClick={handleDownloadPdf}
                    disabled={downloadingFormat !== null}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs hover:bg-slate-800 text-left transition-colors text-white font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-rose-400" />
                      <div>
                        <p className="font-semibold text-white">Baixar em PDF</p>
                        <p className="text-[10px] text-slate-400">Pronto para imprimir e estudar</p>
                      </div>
                    </div>
                    {downloadingFormat === 'pdf' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono font-bold">.pdf</span>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadDoc}
                    disabled={downloadingFormat !== null}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs hover:bg-slate-800 text-left transition-colors text-white font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <div>
                        <p className="font-semibold text-white">Baixar em Word (DOC)</p>
                        <p className="text-[10px] text-slate-400">Editável no Word / Docs</p>
                      </div>
                    </div>
                    {downloadingFormat === 'doc' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono font-bold">.doc</span>
                    )}
                  </button>

                  <div className="my-1 border-t border-slate-800" />

                  <button
                    onClick={() => { handlePrint(); setDownloadMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs hover:bg-slate-800 text-left text-slate-300 transition-colors"
                  >
                    <Printer className="w-4 h-4 text-amber-400" />
                    <span>Imprimir diretamente</span>
                  </button>
                </div>
              )}
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-amber-400 border border-slate-700 transition-colors"
              title="Imprimir Esboço para o Púlpito"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Favorite Button */}
            <button
              onClick={() => onToggleFavorite(sermon)}
              className={`p-2 rounded-lg border transition-all ${
                isFavorite 
                  ? 'bg-amber-500 text-slate-950 border-amber-400' 
                  : 'bg-slate-900 text-slate-300 hover:text-amber-400 border-slate-700'
              }`}
              title={isFavorite ? 'Remover dos favoritos' : 'Salvar sermão'}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* Share Button */}
            <button
              onClick={() => setShareOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-amber-400 border border-slate-700 text-xs font-semibold transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Compartilhar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Category & Status */}
        <div className="flex items-center gap-3 mb-4">
          <CategoryBadge 
            category={sermon.category} 
            size="md" 
            onClick={() => onSelectCategory(sermon.categorySlug)} 
          />
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{sermon.readingTimeMinutes || 6} min de leitura</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
          {sermon.title}
        </h1>

        {sermon.subtitle && (
          <p className="text-lg sm:text-xl text-slate-300 font-serif italic mb-6">
            {sermon.subtitle}
          </p>
        )}

        {/* Author & Date Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-800 text-xs sm:text-sm text-slate-400 mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold text-sm shadow-sm">
              <User className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <p className="text-white font-semibold">{sermon.author}</p>
              <p className="text-xs text-slate-400">Expositor Bíblico</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Cover Image */}
        {sermon.imageUrl && (
          <div className="relative rounded-2xl overflow-hidden mb-8 border border-slate-800 shadow-2xl max-h-[420px]">
            <img
              src={sermon.imageUrl}
              alt={sermon.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          </div>
        )}

        {/* Biblical References Highlight Box */}
        {sermon.biblicalReferences && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 mb-8 flex items-start gap-4 shadow-lg">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono mb-1">
                Texto Bíblico Base
              </h4>
              <p className="text-lg font-serif font-semibold text-white">
                {sermon.biblicalReferences}
              </p>
            </div>
          </div>
        )}

        {/* Description Excerpt */}
        {sermon.description && (
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 italic text-base mb-8">
            <p className="font-medium text-amber-300/90 mb-1 text-xs uppercase font-sans tracking-wider">
              Resumo da Mensagem:
            </p>
            {sermon.description}
          </div>
        )}

        {/* Sermon Body */}
        <article className={`prose prose-invert max-w-none text-slate-300 ${fontClass}`}>
          {renderFormattedContent(sermon.content)}
        </article>

        {/* Keywords / Tags */}
        {sermon.keywords && sermon.keywords.length > 0 && (
          <div className="mt-12 pt-6 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono">
              Palavras-chave e Temas:
            </h4>
            <div className="flex flex-wrap gap-2">
              {sermon.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Social Share & Download Callout */}
        <div className="mt-10 p-6 rounded-2xl bg-[#0a192f] border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-5 shadow-xl">
          <div>
            <h4 className="text-base font-serif font-bold text-white mb-1">{t('detail.pulpitReady')}</h4>
            <p className="text-xs text-slate-400">{t('detail.pulpitDesc')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setReadingModeOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-102"
              title={t('detail.readingModeDesc')}
            >
              <BookOpen className="w-4 h-4 text-slate-950" />
              <span>{t('detail.readingMode')}</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={downloadingFormat !== null}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all hover:scale-102"
              title={t('sermon.downloadPdf')}
            >
              <FileText className="w-4 h-4 text-rose-400" />
              <span>PDF</span>
            </button>
            <button
              onClick={handleDownloadDoc}
              disabled={downloadingFormat !== null}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-all hover:scale-102"
              title={t('sermon.downloadDoc')}
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Word (.doc)</span>
            </button>
            <button
              onClick={() => onToggleFavorite(sermon)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isFavorite 
                  ? 'bg-amber-500 text-slate-950' 
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? t('sermon.saved') : t('sermon.save')}
            </button>
            <button
              onClick={() => setShareOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 font-semibold text-xs transition-colors"
            >
              <Share2 className="w-4 h-4" />
              {t('sermon.share')}
            </button>
          </div>
        </div>

        {/* Related Sermons */}
        {relatedSermons && relatedSermons.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl font-bold text-white">
                Mais Sermões em <span className="text-amber-400">{sermon.category}</span>
              </h3>
              <button
                onClick={() => onSelectCategory(sermon.categorySlug)}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                Ver todos
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedSermons.slice(0, 2).map((rel) => (
                <SermonCard
                  key={rel.id}
                  sermon={rel}
                  isFavorite={false}
                  onToggleFavorite={onToggleFavorite}
                  onSelect={onSelectSermon}
                />
              ))}
            </div>
          </div>
        )}

      </main>

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        title={sermon.title}
        biblicalReferences={sermon.biblicalReferences}
        url={typeof window !== 'undefined' ? `${window.location.origin}?sermon=${sermon.slug}` : ''}
      />

      <ReadingModeModal
        isOpen={readingModeOpen}
        onClose={() => setReadingModeOpen(false)}
        sermon={sermon}
      />
    </div>
  );
};
