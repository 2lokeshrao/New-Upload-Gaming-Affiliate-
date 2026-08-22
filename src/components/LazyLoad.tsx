import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface LazyLoadProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
}

export function LazyLoad({ children, fallback = null, rootMargin = '200px' }: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin }
    );

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={domRef}>
      {isVisible ? children : fallback}
    </div>
  );
}
