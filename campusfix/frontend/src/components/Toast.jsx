import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts = [], onRemove }) {
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => {
        const type = toast.type || 'info';
        return (
          <div key={toast.id} className={`toast ${type}`}>
            {type === 'success' && <CheckCircle2 size={18} />}
            {type === 'error' && <AlertCircle size={18} />}
            {type === 'info' && <Info size={18} />}
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => onRemove(toast.id)}
              style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.8, display: 'flex' }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
