import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  ShieldAlert,
  Home,
  Database,
  Sparkles,
} from 'lucide-react';

export default function Sidebar({ onSeedDemo, isSeeding }) {
  return (
    <aside className="sidebar-wrapper">
      <div className="sidebar">
        <div className="sidebar-section-title">Navigation</div>

        <NavLink
          to="/"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          end
        >
          <Home size={18} />
          <span>Home / Overview</span>
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={18} />
          <span>Student Dashboard</span>
        </NavLink>

        <NavLink
          to="/submit"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <PlusCircle size={18} />
          <span>Report an Issue</span>
        </NavLink>

        <NavLink
          to="/complaints"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <History size={18} />
          <span>Complaint History</span>
        </NavLink>

        <div className="sidebar-divider" />

        <div className="sidebar-section-title">Administration</div>

        <NavLink
          to="/admin"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <ShieldAlert size={18} />
          <span>Admin Portal</span>
        </NavLink>

        <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
          <div className="sidebar-divider" />
          <div style={{ padding: '0.5rem 0.5rem 0' }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', fontSize: '0.8rem', justifyContent: 'center' }}
              onClick={onSeedDemo}
              disabled={isSeeding}
              title="Reset database to realistic college complaint sample presets"
            >
              <Database size={14} />
              <span>{isSeeding ? 'Reloading...' : 'Reload Demo Data'}</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
