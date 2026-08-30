import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Shield, Activity, PlusCircle, LayoutDashboard, Database } from 'lucide-react';

export default function Navbar({ systemInfo }) {
  const location = useLocation();

  const isMongo = systemInfo?.isMongo;
  const hasGemini = systemInfo?.hasGemini;
  const isFallbackMode = !isMongo || !hasGemini;

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="brand-icon-wrapper">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="brand-title">
              CampusFix <span>AI</span>
            </div>
          </div>
        </Link>
        <span className="brand-tagline-badge">
          Report it. AI routes it. Campus fixes it.
        </span>
      </div>

      <div className="navbar-actions">
        {/* System Status Pill */}
        <div className="system-status-pill" title={systemInfo?.aiProvider || 'System Active'}>
          <span className={`pulse-dot ${isFallbackMode ? 'fallback' : ''}`} />
          <span>
            {hasGemini ? 'Gemini AI' : 'Deterministic AI'} • {isMongo ? 'MongoDB' : 'In-Memory DB'}
          </span>
        </div>

        {/* Quick Nav Links */}
        <Link
          to="/submit"
          className="btn btn-primary btn-sm"
          id="nav-btn-report"
        >
          <PlusCircle size={15} />
          <span>Report Issue</span>
        </Link>

        <Link
          to="/admin"
          className={`btn btn-sm ${location.pathname === '/admin' ? 'btn-secondary' : 'btn-secondary'}`}
          style={{ background: '#f8fafc' }}
          id="nav-btn-admin"
        >
          <Shield size={15} color="#2563eb" />
          <span>Admin Portal</span>
        </Link>
      </div>
    </header>
  );
}
