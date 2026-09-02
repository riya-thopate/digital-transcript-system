import { useState, useEffect, useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { CheckCircle2, AlertCircle, Info, X, XCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
}

let _setToasts: Dispatch<SetStateAction<Toast[]>> | null = null;

export function toast(type: ToastType, message: string, description?: string) {
  if (_setToasts) {
    const id = `t-${Date.now()}-${Math.random()}`;
    _setToasts((prev) => [...prev, { id, type, message, description }]);
    setTimeout(() => {
      _setToasts?.((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  _setToasts = setToasts;

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    return () => { _setToasts = null; };
  }, []);

  const icons: Record<ToastType, typeof CheckCircle2> = {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
    warning: AlertCircle,
  };
  const styles: Record<ToastType, string> = {
    success: 'border-success-100 bg-white text-success-700',
    error: 'border-error-100 bg-white text-error-700',
    info: 'border-navy-200 bg-white text-navy-700',
    warning: 'border-amber-200 bg-white text-amber-700',
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => {
        const Icon = icons[t.type];
        return (
          <div
            key={t.id}
            className={`flex items-start gap-3 rounded-lg border px-4 py-3 shadow-card-hover animate-[slideIn_0.2s_ease-out] ${styles[t.type]}`}
          >
            <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">{t.message}</p>
              {t.description && <p className="mt-0.5 text-xs text-slate-500">{t.description}</p>}
            </div>
            <button onClick={() => dismiss(t.id)} className="text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
