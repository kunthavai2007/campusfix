import React, { useState } from 'react';
import { Sparkles, Database, Info, X } from 'lucide-react';

export default function FallbackBanner({ systemInfo }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !systemInfo) return null;

  const isMongo = systemInfo.isMongo;
  const hasGemini = systemInfo.hasGemini;

  if (isMongo && hasGemini) return null;

  return (
    <div className="fallback-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        <Info size={16} />
        <span>
          <strong>Local Fallback Active:</strong>
          {!hasGemini && ' Rule-based Deterministic AI engine active (Gemini API key optional).'}
          {!isMongo && ' High-performance In-Memory database store active.'}
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: 'none',
          border: 'none',
          color: '#92400e',
          cursor: 'pointer',
          padding: '0.2rem',
          display: 'flex',
          alignItems: 'center',
        }}
        title="Dismiss notice"
      >
        <X size={15} />
      </button>
    </div>
  );
}
