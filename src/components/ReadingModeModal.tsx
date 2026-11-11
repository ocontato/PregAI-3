import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause, 
  RotateCcw, 
  Type, 
  Sun, 
  Moon, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Volume2,
  VolumeX,
  FileText,
  Printer,
  Sparkles,
  Quote
} from 'lucide-react';
import { Sermon } from '../types';
import { useTranslation } from '../lib/i18nContext';

interface ReadingModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  sermon: Sermon;
}

type ThemeMode = 'night' | 'navy' | 'sepia' | 'white';
type FontFamily = 'serif' | 'sans' | 'mono';

export const ReadingModeModal: React.FC<ReadingModeModalProps> = ({
  isOpen,
  onClose,
  sermon,
}) => {
  const { t } = useTranslation();
  
  // Customization state
  const [theme, setTheme] = useState<ThemeMode>('night');
  const [fontFamily, setFontFamily] = useState<FontFamily>('serif');
  const [fontSize, setFontSize] = useState<number>(22); // px
  const [lineHeight, setLineHeight] = useState<'normal' | 'relaxed' | 'loose'>('relaxed');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(false);

  // Teleprompter / Auto-Scroll state
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(1); // 1 = slow, 2 = medium, 3 = fast
  const contentContainerRef = useRef<HTMLDivElement>(null);

  // Pulpit Timer / Stopwatch state
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Audio speech
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Handle Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Synchronize fullscreen state if changed by browser ESC
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard Shortcuts: ESC (close), Space (pause/play scroll), F (fullscreen)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }

      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        onClose();
      } else if (e.code === 'Space') {
        e.preventDefault();
        setIsAutoScrolling(prev => !prev);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === '+' || e.key === '=') {
        setFontSize(prev => Math.min(prev + 2, 38));
      } else if (e.key === '-' || e.key === '_') {
        setFontSize(prev => Math.max(prev - 2, 16));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Teleprompter interval
  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      if (contentContainerRef.current) {
        contentContainerRef.current.scrollTop += scrollSpeed;
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isAutoScrolling, scrollSpeed]);

  // Preaching timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Clean audio on close
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const cleanText = `${sermon.title}. ${sermon.biblicalReferences || ''}. ${sermon.content.replace(/[#*>\-_]/g, '')}`;
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  if (!isOpen) return null;

  // Format Stopwatch time: MM:SS
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Color styles per theme
  const themeStyles = {
    night: {
      bg: 'bg-[#06080e]',
      panelBg: 'bg-[#0d1117] border-slate-800 text-slate-200',
      title: 'text-amber-400',
      subtitle: 'text-slate-400',
      text: 'text-amber-100/90',
      quoteBg: 'bg-amber-950/25 border-l-4 border-amber-500 text-amber-200',
      h2: 'text-amber-400 border-b border-amber-500/20',
      h3: 'text-white',
      metaBox: 'bg-[#0d131f] border-slate-800 text-slate-300',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    navy: {
      bg: 'bg-[#0a192f]',
      panelBg: 'bg-[#112240] border-slate-700 text-slate-200',
      title: 'text-white',
      subtitle: 'text-slate-300',
      text: 'text-slate-100',
      quoteBg: 'bg-amber-500/10 border-l-4 border-amber-400 text-amber-100',
      h2: 'text-amber-300 border-b border-amber-500/25',
      h3: 'text-white',
      metaBox: 'bg-[#071328] border-slate-700 text-slate-300',
      badge: 'bg-amber-500 text-slate-950 font-bold'
    },
    sepia: {
      bg: 'bg-[#fbf0d9]',
      panelBg: 'bg-[#f3e5c8] border-[#dfcfb0] text-[#3d2b1f]',
      title: 'text-[#43230e]',
      subtitle: 'text-[#6e5340]',
      text: 'text-[#2e1d11]',
      quoteBg: 'bg-[#ebd3b0] border-l-4 border-[#b45309] text-[#542d13]',
      h2: 'text-[#873e0a] border-b border-[#dfcfb0]',
      h3: 'text-[#382213]',
      metaBox: 'bg-[#f4e8d1] border-[#dfcfb0] text-[#543b27]',
      badge: 'bg-[#92400e] text-amber-100 font-bold'
    },
    white: {
      bg: 'bg-[#ffffff]',
      panelBg: 'bg-slate-100 border-slate-300 text-slate-800',
      title: 'text-slate-950',
      subtitle: 'text-slate-600',
      text: 'text-slate-900',
      quoteBg: 'bg-amber-50 border-l-4 border-amber-600 text-amber-950',
      h2: 'text-amber-800 border-b border-slate-200',
      h3: 'text-slate-900',
      metaBox: 'bg-slate-50 border-slate-200 text-slate-700',
      badge: 'bg-slate-900 text-white font-bold'
    }
  }[theme];

  // Font family class
  const fontClass = {
    serif: 'font-serif',
    sans: 'font-sans',
    mono: 'font-mono'
  }[fontFamily];

  // Line height class
  const lineHeightClass = {
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose'
  }[lineHeight];

  // Render markdown lines
  const renderContent = (content: string) => {
    return content.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-5" />;

      if (trimmed === '---') {
        return <hr key={idx} className="my-8 opacity-30" />;
      }

      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className={`text-2xl sm:text-3xl font-bold mt-10 mb-4 pb-2 ${themeStyles.h2}`}>
            {trimmed.replace('## ', '')}
          </h2>
        );
      }

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className={`text-xl sm:text-2xl font-bold mt-8 mb-3 ${themeStyles.h3}`}>
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      if (trimmed.startsWith('> ')) {
        return (
          <blockquote 
            key={idx} 
            className={`my-6 p-5 sm:p-6 rounded-2xl ${themeStyles.quoteBg} font-serif italic relative shadow-sm`}
          >
            <Quote className="w-5 h-5 mb-1 opacity-70" />
            <p className="text-lg sm:text-xl leading-relaxed">{trimmed.replace('> ', '').replace(/\*/g, '')}</p>
          </blockquote>
        );
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={idx} className="ml-6 list-disc my-2 leading-relaxed">
            {trimmed.substring(2)}
          </li>
        );
      }

      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <div key={idx} className="ml-3 font-semibold my-3 flex items-start gap-2.5">
            <span className="text-amber-500 font-bold shrink-0">{trimmed.match(/^\d+\./)?.[0]}</span>
            <span>{trimmed.replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      }

      return (
        <p key={idx} className="my-4 leading-relaxed">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col ${themeStyles.bg} transition-colors duration-300 animate-in fade-in`}
    >
      {/* ================= TOP CONTROLS TOOLBAR ================= */}
      <header className={`shrink-0 z-30 transition-all duration-300 border-b backdrop-blur-md shadow-md ${themeStyles.panelBg}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
          
          {/* Left: Brand Badge & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-700/20 transition-colors"
              title={t('reader.exit')}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${themeStyles.badge}`}>
                {t('reader.title')}
              </span>
              <span className="text-xs font-serif font-semibold truncate max-w-xs opacity-80">
                {sermon.title}
              </span>
            </div>
          </div>

          {/* Center: Preaching Stopwatch / Timer */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950/20 border border-slate-700/40">
            <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span className="font-mono text-sm font-bold tracking-widest">
              {formatTimer(timerSeconds)}
            </span>
            <div className="flex items-center gap-1 ml-1">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-1 rounded hover:bg-slate-500/20 text-xs"
                title={isTimerRunning ? t('reader.pause') : t('reader.start')}
              >
                {isTimerRunning ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
              </button>
              <button
                onClick={() => { setIsTimerRunning(false); setTimerSeconds(0); }}
                className="p-1 rounded hover:bg-slate-500/20 text-xs"
                title={t('reader.reset')}
              >
                <RotateCcw className="w-3 h-3 opacity-60" />
              </button>
            </div>
          </div>

          {/* Right: Customization Controls (Font, Theme, Teleprompter, Fullscreen) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Auto-Scroll / Teleprompter Toggle */}
            <div className="flex items-center bg-slate-950/20 rounded-xl p-0.5 border border-slate-700/40">
              <button
                onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  isAutoScrolling 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                    : 'hover:bg-slate-500/20 opacity-80'
                }`}
                title="Teleprompter / Rolagem Automática (Barra de Espaço)"
              >
                {isAutoScrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden md:inline">{isAutoScrolling ? 'Pausar Rolagem' : 'Rolar'}</span>
              </button>

              {isAutoScrolling && (
                <div className="flex items-center px-1 text-[11px] font-bold gap-1 font-mono">
                  <button 
                    onClick={() => setScrollSpeed(1)} 
                    className={`px-1 rounded ${scrollSpeed === 1 ? 'text-amber-400 underline font-bold' : 'opacity-60'}`}
                  >
                    1x
                  </button>
                  <button 
                    onClick={() => setScrollSpeed(2)} 
                    className={`px-1 rounded ${scrollSpeed === 2 ? 'text-amber-400 underline font-bold' : 'opacity-60'}`}
                  >
                    2x
                  </button>
                  <button 
                    onClick={() => setScrollSpeed(3)} 
                    className={`px-1 rounded ${scrollSpeed === 3 ? 'text-amber-400 underline font-bold' : 'opacity-60'}`}
                  >
                    3x
                  </button>
                </div>
              )}
            </div>

            {/* Font Size controls */}
            <div className="flex items-center bg-slate-950/20 rounded-xl p-0.5 border border-slate-700/40">
              <button
                onClick={() => setFontSize(s => Math.max(s - 2, 16))}
                className="px-2 py-1 text-xs font-bold hover:bg-slate-500/20 rounded"
                title="Diminuir fonte (-)"
              >
                A-
              </button>
              <span className="px-1.5 text-xs font-mono font-semibold opacity-75">{fontSize}</span>
              <button
                onClick={() => setFontSize(s => Math.min(s + 2, 38))}
                className="px-2 py-1 text-xs font-bold hover:bg-slate-500/20 rounded"
                title="Aumentar fonte (+)"
              >
                A+
              </button>
            </div>

            {/* Font Family selector */}
            <div className="hidden sm:flex items-center bg-slate-950/20 rounded-xl p-0.5 border border-slate-700/40 text-xs font-semibold">
              <button
                onClick={() => setFontFamily('serif')}
                className={`px-2 py-1 rounded ${fontFamily === 'serif' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'opacity-60'}`}
                title="Serifada Clássica"
              >
                Serif
              </button>
              <button
                onClick={() => setFontFamily('sans')}
                className={`px-2 py-1 rounded ${fontFamily === 'sans' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'opacity-60'}`}
                title="Moderna Sem Serifa"
              >
                Sans
              </button>
              <button
                onClick={() => setFontFamily('mono')}
                className={`px-2 py-1 rounded ${fontFamily === 'mono' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'opacity-60'}`}
                title="Esboço Monoespaçado"
              >
                Mono
              </button>
            </div>

            {/* Theme selector */}
            <div className="flex items-center bg-slate-950/20 rounded-xl p-1 border border-slate-700/40 gap-1">
              <button
                onClick={() => setTheme('night')}
                className={`w-6 h-6 rounded-full bg-[#06080e] border-2 transition-all ${theme === 'night' ? 'border-amber-400 scale-110 shadow-sm' : 'border-slate-700'}`}
                title={t('reader.themeNight')}
              />
              <button
                onClick={() => setTheme('navy')}
                className={`w-6 h-6 rounded-full bg-[#0a192f] border-2 transition-all ${theme === 'navy' ? 'border-amber-400 scale-110 shadow-sm' : 'border-slate-700'}`}
                title={t('reader.themeNavy')}
              />
              <button
                onClick={() => setTheme('sepia')}
                className={`w-6 h-6 rounded-full bg-[#fbf0d9] border-2 transition-all ${theme === 'sepia' ? 'border-amber-600 scale-110 shadow-sm' : 'border-amber-200'}`}
                title={t('reader.themeSepia')}
              />
              <button
                onClick={() => setTheme('white')}
                className={`w-6 h-6 rounded-full bg-white border-2 transition-all ${theme === 'white' ? 'border-amber-600 scale-110 shadow-sm' : 'border-slate-300'}`}
                title={t('reader.themeWhite')}
              />
            </div>

            {/* Audio Reader */}
            <button
              onClick={toggleSpeech}
              className={`p-2 rounded-xl border transition-all ${
                isPlayingAudio 
                  ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse' 
                  : 'bg-slate-950/20 border-slate-700/40 opacity-80 hover:opacity-100'
              }`}
              title={isPlayingAudio ? 'Pausar áudio' : 'Ouvir sermão narrado'}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-slate-950/20 border border-slate-700/40 opacity-80 hover:opacity-100 transition-all"
              title={isFullscreen ? t('reader.exitFullscreen') : t('reader.fullscreen')}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Exit Button */}
            <button
              onClick={onClose}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all shadow-sm"
            >
              <span>{t('reader.exit')}</span>
            </button>

          </div>

        </div>
      </header>

      {/* ================= MAIN SCROLLING CONTENT ================= */}
      <main 
        ref={contentContainerRef}
        className={`flex-1 overflow-y-auto px-4 sm:px-8 py-10 ${themeStyles.text}`}
      >
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header Area */}
          <div className="space-y-4 pb-6 border-b border-current/15">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full ${themeStyles.badge}`}>
                {sermon.category}
              </span>
              <span className="text-xs opacity-75 font-mono">
                &bull; {sermon.author} &bull; {sermon.readingTimeMinutes || 6} min
              </span>
            </div>

            <h1 className={`font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight ${themeStyles.title}`}>
              {sermon.title}
            </h1>

            {sermon.subtitle && (
              <p className={`font-serif italic text-lg sm:text-2xl ${themeStyles.subtitle}`}>
                {sermon.subtitle}
              </p>
            )}

            {/* Scripture base highlight */}
            {sermon.biblicalReferences && (
              <div className={`p-4 rounded-xl border font-serif text-base sm:text-xl font-bold ${themeStyles.metaBox}`}>
                <span className="text-xs uppercase tracking-wider block opacity-75 font-sans mb-1">
                  📖 {t('detail.baseScripture')}:
                </span>
                {sermon.biblicalReferences}
              </div>
            )}
          </div>

          {/* Sermon Body with Dynamic Font Size and Line Height */}
          <article 
            className={`prose-lg max-w-none transition-all ${fontClass} ${lineHeightClass}`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {renderContent(sermon.content)}
          </article>

          {/* End of Outline Notice */}
          <div className="pt-16 pb-20 border-t border-current/15 text-center space-y-2 opacity-60 text-xs">
            <p className="font-serif italic text-sm">"Toda a Escritura é divinamente inspirada e proveitosa para ensinar, redarguir, corrigir e instruir em justiça."</p>
            <p className="font-mono text-[11px]">— 2 Timóteo 3:16</p>
            <p className="pt-4 text-[10px]">{t('reader.tips')}</p>
          </div>

        </div>
      </main>

      {/* Floating teleprompter control pill on bottom-right when auto-scrolling */}
      {isAutoScrolling && (
        <div className="fixed bottom-6 right-6 z-40 bg-amber-500 text-slate-950 px-4 py-2 rounded-full font-bold shadow-2xl flex items-center gap-2 text-xs animate-bounce">
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Teleprompter Ativo ({scrollSpeed}x)</span>
          <button 
            onClick={() => setIsAutoScrolling(false)}
            className="ml-2 bg-slate-950 text-white rounded-full p-1"
            title="Pausar"
          >
            <Pause className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
