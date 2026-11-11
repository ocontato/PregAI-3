import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Check, 
  Copy, 
  MessageCircle, 
  Facebook, 
  Twitter 
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  biblicalReferences?: string;
  url: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  biblicalReferences,
  url,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Falha ao copiar:', e);
    }
  };

  const shareText = `*${title}* ${biblicalReferences ? `(${biblicalReferences})` : ''}\nConfira este sermão abençoado na Biblioteca Gospel PregAI:\n${url}`;

  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: title + (biblicalReferences ? ` - ${biblicalReferences}` : ''),
          url,
        });
      } catch {
        // User cancelled or not supported
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-white relative animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-white">Compartilhar Palavra</h3>
            <p className="text-xs text-slate-400">Edifique a vida de irmãos e familiares</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 font-medium line-clamp-2 mb-5 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
          "{title}"
        </p>

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <button
            onClick={shareWhatsApp}
            className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-all hover:scale-105"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs font-semibold">WhatsApp</span>
          </button>

          <button
            onClick={shareFacebook}
            className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 transition-all hover:scale-105"
          >
            <Facebook className="w-6 h-6" />
            <span className="text-xs font-semibold">Facebook</span>
          </button>

          <button
            onClick={shareTwitter}
            className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-400/30 transition-all hover:scale-105"
          >
            <Twitter className="w-6 h-6" />
            <span className="text-xs font-semibold">X (Twitter)</span>
          </button>
        </div>

        {/* Link copy */}
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
          <input
            type="text"
            readOnly
            value={url}
            className="bg-transparent flex-1 text-xs text-slate-300 px-2 outline-none font-mono truncate"
          />
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              copied 
                ? 'bg-emerald-500 text-slate-950' 
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copiar
              </>
            )}
          </button>
        </div>

        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            Mais opções de compartilhamento
          </button>
        )}
      </div>
    </div>
  );
};
