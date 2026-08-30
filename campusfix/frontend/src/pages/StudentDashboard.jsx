import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Clock,
  Zap,
  CheckCircle2,
  PlusCircle,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  Building,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { fetchStats, fetchComplaints } from '../services/api';

export default function StudentDashboard() {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [statsRes, complaintsRes] = await Promise.all([
        fetchStats(),
        fetchComplaints(),
      ]);
      setStats(statsRes.data);
      setComplaints(complaintsRes.data || []);
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredComplaints = complaints.filter(c => {
    if (statusFilter !== 'all' && c.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        (c.department && c.department.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Student Complaint Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
            Track your campus grievance lifecycle, AI department routing, and live resolution status.
          </p>
        </div>

        <Link to="/submit" className="btn btn-primary" id="btn-dashboard-report">
          <PlusCircle size={16} />
          <span>Report New Issue</span>
        </Link>
      </div>

      {/* KPI Stat Cards */}
      <div className="stat-grid">
        <StatCard
          title="Total Complaints"
          value={stats?.total || 0}
          icon={Layers}
          color="#2563eb"
          bgColor="#eff6ff"
          subtitle="All campus complaints"
        />
        <StatCard
          title="Pending Complaints"
          value={stats?.pending || 0}
          icon={Clock}
          color="#d97706"
          bgColor="#fef3c7"
          subtitle="Submitted or awaiting assignment"
        />
        <StatCard
          title="In Progress"
          value={stats?.inProgress || 0}
          icon={Zap}
          color="#7c3aed"
          bgColor="#ede9fe"
          subtitle="Active department servicing"
        />
        <StatCard
          title="Resolved Complaints"
          value={(stats?.resolved || 0) + (stats?.closed || 0)}
          icon={CheckCircle2}
          color="#059669"
          bgColor="#dcfce7"
          subtitle="Successfully fixed"
        />
      </div>

      {/* Search and Filters Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '260px' }}>
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search complaints by title, location, or department..."
              className="form-input"
              style={{ border: 'none', padding: '0.4rem 0.5rem', boxShadow: 'none' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <Filter size={15} />
              <span>Status:</span>
            </div>

            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints List Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem', width: '28px', height: '28px', borderColor: '#2563eb', borderTopColor: 'transparent' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading complaints...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-state-icon">
              <Layers size={28} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              No Complaints Found
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '380px', margin: '0 auto 1.25rem' }}>
              {search || statusFilter !== 'all'
                ? 'Try adjusting your search criteria or filter options.'
                : 'No campus issues have been reported yet.'}
            </p>
            <Link to="/submit" className="btn btn-primary btn-sm">
              <PlusCircle size={15} />
              <span>Submit First Complaint</span>
            </Link>
          </div>
        ) : (
          filteredComplaints.map((complaint) => (
            <div
              key={complaint._id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                transition: 'border-color 0.15s ease, transform 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                    <StatusBadge status={complaint.status} />
                    <PriorityBadge priority={complaint.priority} />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Category: {complaint.category}
                    </span>
                  </div>

                  <Link
                    to={`/complaints/${complaint._id}`}
                    style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', display: 'inline-block' }}
                  >
                    {complaint.title}
                  </Link>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem', lineHeight: 1.5 }}>
                    {complaint.description}
                  </p>
                </div>

                <Link
                  to={`/complaints/${complaint._id}`}
                  className="btn btn-secondary btn-sm"
                  style={{ alignSelf: 'center' }}
                >
                  <span>View Details</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Bottom metadata strip */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-color)',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={14} color="#2563eb" />
                    <strong>Location:</strong> {complaint.location}
                  </span>

                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Building size={14} color="#7c3aed" />
                    <strong>Assigned:</strong> {complaint.department || 'General Administration'}
                  </span>

                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={14} />
                    {new Date(complaint.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {complaint.isAiAnalyzed ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#6d28d9', fontWeight: 600 }}>
                    <Sparkles size={13} />
                    AI Triaged
                  </span>
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>Awaiting AI</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
