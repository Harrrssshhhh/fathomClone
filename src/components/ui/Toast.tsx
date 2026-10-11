import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';
interface Toast { id: number; message: string; type: ToastType; }

interface ToastCtx { showToast: (message: string, type?: ToastType) => void; }
const ToastContext = createContext<ToastCtx>({ showToast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const dismiss = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  const icons = { success: <CheckCircle size={15} className="text-green-500" />, error: <XCircle size={15} className="text-red-500" />, info: <Info size={15} className="text-blue-500" /> };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-lg text-sm animate-slide-in">
            {icons[t.type]}
            <span className="text-gray-800">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="ml-1 text-gray-400 hover:text-gray-600">
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() { return useContext(ToastContext); }
