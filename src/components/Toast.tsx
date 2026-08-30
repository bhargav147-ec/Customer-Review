import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'urgent';
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div id="toast-container" className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        let bgClass = 'bg-zinc-900 border-zinc-700 text-zinc-200';
        let icon = <Info className="w-4 h-4 text-cyan-400 shrink-0" />;

        if (toast.type === 'success') {
          bgClass = 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100 shadow-[0_0_12px_rgba(16,185,129,0.2)]';
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
        } else if (toast.type === 'urgent') {
          bgClass = 'bg-rose-950/90 border-rose-500/50 text-rose-100 shadow-[0_0_12px_rgba(244,63,94,0.3)]';
          icon = <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            id={`toast-message-${toast.id}`}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border text-xs shadow-xl backdrop-blur transition-all animate-in fade-in slide-in-from-bottom-2 ${bgClass}`}
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <span className="font-medium leading-tight">{toast.message}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-zinc-400 hover:text-white p-0.5 rounded transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
