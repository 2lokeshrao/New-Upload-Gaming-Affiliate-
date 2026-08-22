import React from 'react';
import { ArrowRight, Star, ExternalLink, ShieldCheck } from 'lucide-react';
import { AffiliateLink } from '../types';

interface Props {
  link: AffiliateLink;
  onTrack?: (url: string) => void;
}

export const AffiliateLinkCard: React.FC<Props> = ({ link, onTrack }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onTrack) {
      e.preventDefault();
      onTrack(link.url);
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <a
      href={link.url}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 shadow-lg hover:shadow-amber-500/10 transition-all duration-300 w-full mb-4"
    >
      <div className="flex items-center gap-4 w-full sm:w-auto">
        {link.logoUrl ? (
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700">
            <img src={link.logoUrl || undefined} alt={link.brandName} width="40" height="40" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-300 flex items-center justify-center flex-shrink-0 shadow-inner">
            <span className="text-2xl font-black text-slate-950">{link.brandName.charAt(0)}</span>
          </div>
        )}
        
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-white text-lg leading-none">{link.brandName}</h4>
            {link.badgeText && (
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20 whitespace-nowrap">
                {link.badgeText}
              </span>
            )}
          </div>
          <p className="text-sm font-bold text-amber-400 mb-1">{link.title}</p>
          {link.description && (
            <p className="text-xs text-slate-400 line-clamp-2">{link.description}</p>
          )}
        </div>
      </div>

      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 sm:gap-2 border-t sm:border-t-0 sm:border-l border-slate-800 pt-4 sm:pt-0 sm:pl-4">
        {link.rating && (
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-black text-white text-sm">{link.rating}</span>
            <span className="text-slate-500 text-[10px]">/ 5</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3 h-3" /> Secure Link
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wide transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20 whitespace-nowrap shrink-0">
          {link.buttonText || 'Apply Now'} <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </a>
  );
};
