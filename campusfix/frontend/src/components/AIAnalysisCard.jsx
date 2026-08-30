import React from 'react';
import { Sparkles, Bot, CheckCircle, ArrowRight, RefreshCw, ShieldAlert, Building2 } from 'lucide-react';
import PriorityBadge from './PriorityBadge';

export default function AIAnalysisCard({
  complaint,
  onAnalyze,
  isAnalyzing = false,
}) {
  const isAnalyzed = complaint.isAiAnalyzed;

  return (
    <div className="ai-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div className="ai-badge">
            <Sparkles size={14} />
            <span>AI Automated Triage</span>
          </div>
          {isAnalyzed && (
            <span style={{ fontSize: '0.78rem', color: '#6d28d9', fontWeight: 600, background: '#f5f3ff', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
              ✓ Verified Analysis
            </span>
          )}
        </div>

        <button
          className="btn btn-ai btn-sm"
          onClick={onAnalyze}
          disabled={isAnalyzing}
          id="btn-analyze-ai"
        >
          {isAnalyzing ? (
            <>
              <div className="spinner" style={{ width: '14px', height: '14px' }} />
              <span>Analyzing with AI...</span>
            </>
          ) : (
            <>
              {isAnalyzed ? <RefreshCw size={14} /> : <Sparkles size={14} />}
              <span>{isAnalyzed ? 'Re-analyze with AI' : 'Analyze with AI'}</span>
            </>
          )}
        </button>
      </div>

      {!isAnalyzed ? (
        <div style={{ padding: '1.5rem', textAlign: 'center', background: '#faf8ff', borderRadius: '10px', border: '1px dashed #ddd6fe' }}>
          <Bot size={36} color="#7c3aed" style={{ margin: '0 auto 0.75rem' }} />
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e1b4b', marginBottom: '0.35rem' }}>
            AI Triage Pending
          </h4>
          <p style={{ fontSize: '0.86rem', color: '#6b7280', maxWidth: '440px', margin: '0 auto 1.25rem' }}>
            Click <strong>"Analyze with AI"</strong> to automatically categorize this complaint, evaluate priority urgency, detect the responsible department, and generate resolution steps.
          </p>
          <button
            className="btn btn-ai"
            onClick={onAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Processing AI...' : 'Analyze with AI Now'}
          </button>
        </div>
      ) : (
        <div>
          {/* AI Metrics Grid */}
          <div className="ai-fields-grid">
            <div className="ai-field-box">
              <div className="ai-field-label">AI Detected Category</div>
              <div className="ai-field-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Building2 size={16} color="#2563eb" />
                <span>{complaint.aiCategory || complaint.category || 'General'}</span>
              </div>
            </div>

            <div className="ai-field-box">
              <div className="ai-field-label">AI Priority Assessment</div>
              <div style={{ marginTop: '0.2rem' }}>
                <PriorityBadge priority={complaint.priority} />
              </div>
            </div>

            <div className="ai-field-box">
              <div className="ai-field-label">Assigned Department</div>
              <div className="ai-field-value" style={{ color: '#2563eb' }}>
                {complaint.department || 'General Administration'}
              </div>
            </div>
          </div>

          {/* AI Summary Box */}
          {complaint.aiSummary && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.3rem' }}>
                AI Executive Summary
              </div>
              <div style={{ padding: '0.85rem 1rem', background: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.92rem', color: '#1f2937', lineHeight: 1.5 }}>
                {complaint.aiSummary}
              </div>
            </div>
          )}

          {/* AI Suggested Action */}
          {complaint.suggestedAction && (
            <div className="ai-action-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#6d28d9', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                <Sparkles size={14} />
                <span>AI Recommended Action Plan</span>
              </div>
              <div style={{ fontSize: '0.92rem', color: '#374151', fontWeight: 500 }}>
                {complaint.suggestedAction}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
