import React, { useEffect, useState } from 'react';

interface TopLoadingBarProps {
  isLoading?: boolean;
}

export const TopLoadingBar: React.FC<TopLoadingBarProps> = ({ isLoading = false }) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Reading progress based on scroll
    const handleScroll = () => {
      if (isLoading) return; // let route loader take over
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${(totalScroll / windowHeight) * 100}`;
      setProgress(Number(scroll));
      setVisible(true);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

  useEffect(() => {
    // Route change fake loader
    if (isLoading) {
      setVisible(true);
      setProgress(30);
      const timer1 = setTimeout(() => setProgress(60), 200);
      const timer2 = setTimeout(() => setProgress(85), 500);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setProgress(100);
      const timer = setTimeout(() => {
        setVisible(false);
        setProgress(0); // reset after hiding
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[9999] pointer-events-none">
      <div 
        className="h-full bg-gradient-to-r from-amber-400 via-purple-500 to-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)] transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
