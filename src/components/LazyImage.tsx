import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  priority?: boolean;
  src: string;
  alt: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className = '', priority = false, ...props }) => {
  const [isError, setIsError] = useState(false);
  const [isVisible, setIsVisible] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If it's a priority image or already visible, no need for observer
    if (priority || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect(); // Stop observing once it's visible
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before it enters the viewport
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority, isVisible]);

  const placeholderBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAHBJREFUWEft0zEKACAQw8D7/6f90lJwEFzEQe5SU5qsqqpeZ373n/2YczxQYxMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwkro5m+0BP002ATXz2hAAAAAASUVORK5CYII=";
  const imageSrc = isError ? placeholderBase64 : (isVisible ? src : undefined);

  return (
    <div ref={containerRef} className={`relative overflow-hidden shrink-0 bg-slate-800 ${className.replace(/object-cover|shrink-0|bg-slate-800/g, '').trim()}`}>
      {isVisible ? (
        <img 
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          src={imageSrc}
          alt={alt}
          decoding={priority ? "sync" : "async"}
          onError={() => {
            setIsError(true);
          }}
          className={`w-full h-full object-cover rounded-[inherit] ${className.includes('border') ? 'border border-slate-700' : ''}`}
          {...props}
        />
      ) : (
        <div className={`w-full h-full rounded-[inherit] bg-slate-800 ${className.includes('border') ? 'border border-slate-700' : ''}`} />
      )}
    </div>
  );
};
