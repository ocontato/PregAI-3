import React from 'react';

interface CategoryBadgeProps {
  category: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Fé': { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
  'Oração': { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
  'Família': { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  'Evangelismo': { bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  'Salvação': { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30' },
  'Jesus': { bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  'Espírito Santo': { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30' },
  'Escatologia': { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
  'Vida Cristã': { bg: 'bg-teal-500/15', text: 'text-teal-400', border: 'border-teal-500/30' },
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'sm', onClick }) => {
  const style = CATEGORY_COLORS[category] || { 
    bg: 'bg-slate-700/40', 
    text: 'text-slate-300', 
    border: 'border-slate-600/40' 
  };

  const sizeClass = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  }[size];

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-full font-semibold border ${style.bg} ${style.text} ${style.border} ${sizeClass} ${
        onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
      }`}
    >
      {category}
    </span>
  );
};
