import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';
interface Toast { id: number; message: string; type: ToastType; leaving?: boolean; }

interface ToastCtx { showToast: (message: string, type?: ToastType) => void; }
const ToastContext = createContext<ToastCtx>({ showToast: () => {} });

const AUTO_DISMISS_MS = 3500;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, leaving: true } : t));
    const exitTimer = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 250);
    timers.current.set(id, exitTimer);
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    const dismissTimer = setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    timers.current.set(id, dismissTimer);
  }, [dismiss]);

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach(timer => clearTimeout(timer));
      map.clear();
    };
  }, []);

  const icons = {
    success: <CheckCircle size={16} className="text-green-500 flex-shrink-0" />,
    error: <XCircle size={16} className="text-red-500 flex-shrink-0" />,
    info: <Info size={16} className="text-blue-500 flex-shrink-0" />,
  };

  const accent = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none w-80 max-w-[calc(100vw-2rem)]">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 shadow-xl overflow-hidden relative ${t.leaving ? 'toast-leave' : 'toast-enter'}`}
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${accent[t.type]}`} />
            {icons[t.type]}
            <span className="text-sm text-gray-800 dark:text-gray-200 flex-1 leading-snug">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex-shrink-0 -mt-0.5 -mr-1 p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Dismiss"
            >
              <X size={13} />
            </button>
            {!t.leaving && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100 dark:bg-gray-800">
                <div
                  className={`h-full ${accent[t.type]} toast-progress`}
                  style={{ animationDuration: `${AUTO_DISMISS_MS}ms` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() { return useContext(ToastContext); }
