import React, { useState } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  priority?: boolean;
  src: string;
  alt: string;
}

// Tailwind's default spacing scale (1 unit = 4px) — used to derive an intrinsic
// pixel size from w-N/h-N utility classes when the caller doesn't pass an
// explicit width/height prop, so every rendered <img> has dimensions and the
// browser can reserve space for it (prevents layout shift).
const TAILWIND_UNIT_PX = 4;

function sizeFromClassName(className: string, axis: 'w' | 'h'): number | undefined {
  const match = className.match(new RegExp(`(?:^|\\s)${axis}-(\\d+)(?:\\s|$)`));
  if (!match) return undefined;
  return parseInt(match[1], 10) * TAILWIND_UNIT_PX;
}

export const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className = '', priority = false, width, height, ...props }) => {
  const [isError, setIsError] = useState(false);
  
  // A tiny 1x1 transparent pixel base64 for fallback so it doesn't show broken image icons
  const placeholderBase64 = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  
  const imageSrc = isError ? placeholderBase64 : (src || undefined);

  // Fall back to a size parsed from the wrapper's w-N/h-N classes (default 64px,
  // matching the most common logo/icon usage) if no explicit prop was given.
  const resolvedWidth = width ?? sizeFromClassName(className, 'w') ?? 64;
  const resolvedHeight = height ?? sizeFromClassName(className, 'h') ?? 64;

  return (
    <div className={`relative overflow-hidden shrink-0 bg-slate-800 ${className.replace(/object-cover|shrink-0|bg-slate-800/g, '').trim()}`}>
      <img 
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        width={resolvedWidth}
        height={resolvedHeight}
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
