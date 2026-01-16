import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  image?: string;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number, image?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType, duration: number = 4000, image?: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, image }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-[100] flex flex-col gap-3 w-full max-w-md pointer-events-none px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md animate-fade-in-down transition-all duration-300
              ${toast.type === 'success' ? 'bg-slate-900/90 border-green-500/50 text-green-100' : ''}
              ${toast.type === 'error' ? 'bg-slate-900/90 border-red-500/50 text-red-100' : ''}
              ${toast.type === 'info' ? 'bg-slate-900/90 border-blue-500/50 text-blue-100' : ''}
            `}
          >
            <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-green-500/20' : toast.type === 'error' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
              {toast.image ? (
                <img src={toast.image} alt="Notification" className="w-8 h-8 object-contain drop-shadow-sm" />
              ) : (
                <>
                  {toast.type === 'success' && <CheckCircle size={20} className="text-green-500" />}
                  {toast.type === 'error' && <AlertCircle size={20} className="text-red-500" />}
                  {toast.type === 'info' && <Info size={20} className="text-blue-500" />}
                </>
              )}
            </div>
            
            <p className="flex-1 font-medium text-sm md:text-base leading-relaxed tracking-wide font-sans">
              {toast.message}
            </p>

            <button 
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={16} className="opacity-70" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
