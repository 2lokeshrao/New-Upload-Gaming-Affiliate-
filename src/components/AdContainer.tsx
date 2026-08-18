import React from 'react';

interface AdContainerProps {
  slotId: string;
  className?: string;
}

export const AdContainer: React.FC<AdContainerProps> = ({ slotId, className = '' }) => {
  return (
    <div className={`w-full flex flex-col items-center justify-center my-4 ${className}`}>
      <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Advertisement</span>
      <div 
        className="w-full max-w-[728px] h-[90px] bg-slate-800/50 border border-slate-700/50 rounded flex items-center justify-center relative overflow-hidden group"
        data-ad-slot={slotId}
      >
        <span className="text-slate-500 text-sm font-medium group-hover:text-amber-400/50 transition-colors">
          Ad Space ({slotId})
        </span>
        {/* Future AdSense integration can mount here */}
      </div>
    </div>
  );
};
