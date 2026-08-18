import React from 'react';
import { ArrowLeft } from 'lucide-react';

export const BackButton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <button 
      onClick={() => window.history.back()}
      className={`flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors font-bold text-sm tracking-wide uppercase ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </button>
  );
};
