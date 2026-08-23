import React, { useState } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  priority?: boolean;
  src: string;
  alt: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className = '', priority = false, ...props }) => {
  const [isError, setIsError] = useState(false);
  
  // A tiny 1x1 transparent pixel base64 for fallback so it doesn't show broken image icons
  const placeholderBase64 = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  
  const imageSrc = isError ? placeholderBase64 : (src || undefined);

  return (
    <div className={`relative overflow-hidden shrink-0 bg-slate-800 ${className.replace(/object-cover|shrink-0|bg-slate-800/g, '').trim()}`}>
      <img 
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        src={imageSrc}
        alt={alt}
        decoding={priority ? "sync" : "async"}
        onError={(e) => {
          setIsError(true);
        }}
        className={`w-full h-full object-cover rounded-[inherit] transition-opacity duration-300 ${className.includes('border') ? 'border border-slate-700' : ''}`}
        {...props}
      />
    </div>
  );
};
