import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`
                pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border
                ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : ''}
                ${toast.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-800' : ''}
                ${toast.type === 'info' ? 'bg-indigo-50 border-indigo-100 text-indigo-800' : ''}
              `}
            >
              <div className="shrink-0">
                {toast.type === 'success' && <CheckCircle2 className="text-emerald-500" size={20} />}
                {toast.type === 'error' && <AlertCircle className="text-rose-500" size={20} />}
                {toast.type === 'info' && <Info className="text-indigo-500" size={20} />}
              </div>
              <p className="text-sm font-bold">{toast.message}</p>
              <button 
                onClick={() => removeToast(toast.id)}
                className="ml-2 hover:opacity-70 transition-opacity"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
