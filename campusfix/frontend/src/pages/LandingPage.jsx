import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Building2,
  Flame,
  Clock,
  Layers,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function LandingPage({ stats }) {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-pill">
          <Sparkles size={16} />
          <span>Next-Generation College Grievance Automation</span>
        </div>

        <h1 className="hero-title">
          Campus Complaints, <br />
          <span className="hero-title-gradient">Resolved in Record Time.</span>
        </h1>

        <p className="hero-subtitle">
          Eliminate lost tickets, misplaced department routing, and overlooked campus emergencies.
          CampusFix AI automatically triages student issues, detects severity, and assigns the right crew instantly.
        </p>

        <div className="hero-cta-group">
          <Link to="/submit" className="btn btn-primary btn-lg" id="hero-cta-report">
            <span>Report an Issue Now</span>
            <ArrowRight size={18} />
          </Link>

          <Link to="/dashboard" className="btn btn-secondary btn-lg" id="hero-cta-student">
            <span>Student Dashboard</span>
          </Link>

          <Link to="/admin" className="btn btn-secondary btn-lg" id="hero-cta-admin">
            <ShieldCheck size={18} color="#2563eb" />
            <span>Admin Control Center</span>
          </Link>
        </div>
      </section>

      {/* Live Campus Health Metrics */}
      <div style={{ maxWidth: '1100px', margin: '0 auto 3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Live Campus Ticket Stats
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Real-time synchronization active
          </span>
        </div>

        <div className="stat-grid">
          <StatCard
            title="Total Complaints"
            value={stats?.total || 0}
            icon={Layers}
            color="#2563eb"
            bgColor="#eff6ff"
          />
          <StatCard
            title="Active Pending"
            value={stats?.pending || 0}
            icon={Clock}
            color="#d97706"
            bgColor="#fef3c7"
          />
          <StatCard
            title="In Progress"
            value={stats?.inProgress || 0}
            icon={Zap}
            color="#7c3aed"
            bgColor="#ede9fe"
          />
          <StatCard
            title="Resolved & Closed"
            value={(stats?.resolved || 0) + (stats?.closed || 0)}
            icon={CheckCircle2}
            color="#059669"
            bgColor="#dcfce7"
          />
        </div>
      </div>

      {/* Feature Value Propositions */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            How CampusFix AI Works
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '550px', margin: '0.5rem auto 0' }}>
            Built specifically for universities and colleges to streamline resolution workflows across campuses.
          </p>
        </div>

        <div className="feature-grid" style={{ marginTop: 0 }}>
          <div className="feature-card">
            <div className="feature-icon-box" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <Zap size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              1. 1-Click Student Logging
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Students enter simple descriptions without worrying about bureaucratic hierarchy or which office handles what.
            </p>
          </div>

          <div className="feature-card" style={{ border: '1px solid #c7d2fe', background: '#faf8ff' }}>
            <div className="feature-icon-box" style={{ background: 'var(--ai-gradient)', color: 'white' }}>
              <Sparkles size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#4338ca' }}>
              2. Intelligent AI Triage
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Gemini & Deterministic AI classify the category, detect urgent hazards (fire, water burst, outages), and suggest actions.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box" style={{ background: '#ecfdf5', color: '#059669' }}>
              <Building2 size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              3. Automated Department Dispatch
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              IT Support, Lab Techs, Facilities, Plumbing, or Hostel Wardens receive clear summaries and immediate action items.
            </p>
          </div>
        </div>
      </section>

      {/* Direct Action Banner */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', borderRadius: '20px', padding: '3rem 2.5rem', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Ready to test CampusFix AI?
          </h3>
          <p style={{ color: '#bfdbfe', maxWidth: '500px', fontSize: '0.95rem' }}>
            Experience instant AI ticket routing with our preloaded interactive campus presets or submit your own custom complaint.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/submit" className="btn btn-lg" style={{ background: 'white', color: '#1e3a8a', fontWeight: 700 }}>
            Submit Test Complaint
          </Link>
          <Link to="/admin" className="btn btn-lg" style={{ background: 'rgba(255, 255, 255, 0.15)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
            Open Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
