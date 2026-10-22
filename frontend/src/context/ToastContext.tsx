import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'warning' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  toast: (opts: Omit<Toast, 'id'>) => void;
  success: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />,
  warning: <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />,
  error:   <XCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />,
  info:    <Info size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((opts: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { ...opts, id }]);
    setTimeout(() => dismiss(id), 4500);
  }, [dismiss]);

  const success = useCallback((title: string, message?: string) => toast({ type: 'success', title, message }), [toast]);
  const warning = useCallback((title: string, message?: string) => toast({ type: 'warning', title, message }), [toast]);
  const error   = useCallback((title: string, message?: string) => toast({ type: 'error', title, message }), [toast]);
  const info    = useCallback((title: string, message?: string) => toast({ type: 'info', title, message }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, warning, error, info }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`} role="alert">
            {icons[t.type]}
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1B2430', margin: 0 }}>{t.title}</p>
              {t.message && (
                <p style={{ fontSize: '0.8125rem', color: '#5B6675', margin: '0.125rem 0 0' }}>{t.message}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="btn-ghost"
              style={{ padding: '0.125rem', color: '#9CA3AF' }}
              aria-label="Dismiss"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
