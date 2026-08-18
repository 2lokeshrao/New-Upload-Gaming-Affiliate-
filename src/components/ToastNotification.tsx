import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setToast({ message: customEvent.detail, visible: true });
      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 3000);
    };

    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] flex items-center gap-2 bg-emerald-500 text-white px-4 py-3 rounded-xl font-bold shadow-[0_4px_20px_rgba(16,185,129,0.4)] transition-all duration-300 ${
        toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
      }`}
    >
      <CheckCircle className="w-5 h-5" />
      {toast.message}
    </div>
  );
};
