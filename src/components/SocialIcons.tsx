import React from 'react';
import { 
  Instagram, 
  Youtube, 
  Facebook, 
  MessageCircle, 
  Send, 
  Headphones 
} from 'lucide-react';
import { SocialLinks } from '../types';

interface SocialIconsProps {
  socialLinks?: SocialLinks;
  variant?: 'welcome' | 'footer' | 'compact';
}

export const SocialIcons: React.FC<SocialIconsProps> = ({ 
  socialLinks, 
  variant = 'welcome' 
}) => {
  const links = socialLinks || {};

  const items = [
    {
      name: 'Instagram',
      url: links.instagram,
      icon: Instagram,
      hoverClass: 'hover:text-pink-400 hover:border-pink-500/40 hover:bg-pink-500/10',
      label: 'Siga no Instagram',
    },
    {
      name: 'YouTube',
      url: links.youtube,
      icon: Youtube,
      hoverClass: 'hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10',
      label: 'Inscreva-se no YouTube',
    },
    {
      name: 'Facebook',
      url: links.facebook,
      icon: Facebook,
      hoverClass: 'hover:text-blue-400 hover:border-blue-500/40 hover:bg-blue-500/10',
      label: 'Curta no Facebook',
    },
    {
      name: 'WhatsApp',
      url: links.whatsapp,
      icon: MessageCircle,
      hoverClass: 'hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/10',
      label: 'Comunidade WhatsApp',
    },
    {
      name: 'Telegram',
      url: links.telegram,
      icon: Send,
      hoverClass: 'hover:text-sky-400 hover:border-sky-500/40 hover:bg-sky-500/10',
      label: 'Canal no Telegram',
    },
    {
      name: 'Spotify',
      url: links.spotify,
      icon: Headphones,
      hoverClass: 'hover:text-emerald-300 hover:border-emerald-400/40 hover:bg-emerald-500/10',
      label: 'Podcasts no Spotify',
    },
  ].filter(item => item.url && item.url.trim() !== '');

  if (items.length === 0) return null;

  if (variant === 'welcome') {
    return (
      <div className="flex flex-col items-center gap-2.5 pt-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400/80 font-semibold">
          Conecte-se com nosso ministério
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {items.map((item) => {
            const IconComponent = item.icon;
            return (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 transition-all hover:scale-110 shadow-md ${item.hoverClass}`}
                title={item.label}
                aria-label={item.label}
              >
                <IconComponent className="w-4 h-4" />
              </a>
            );
          })}
        </div>
      </div>
    );
  }

  // Footer or Compact variant
  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item) => {
        const IconComponent = item.icon;
        return (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-400 transition-all hover:scale-105 ${item.hoverClass}`}
            title={item.label}
            aria-label={item.label}
          >
            <IconComponent className="w-4 h-4" />
          </a>
        );
      })}
    </div>
  );
};
