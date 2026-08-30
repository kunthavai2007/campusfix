import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  Filter,
  Layers,
  Clock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Edit,
  ArrowRight,
  Sparkles,
  Database,
  Building,
  UserCheck,
  Check,
  X,
  Trash2,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import {
  fetchComplaints,
  fetchStats,
  updateComplaintStatus,
  deleteComplaint,
  seedDemoData,
} from '../services/api';

const STATUS_OPTIONS = [
  'Submitted',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
  'Closed',
];

const DEPARTMENT_PRESETS = [
  'IT Support',
  'Lab Technician & IT Hardware',
  'Maintenance & Plumbing Team',
  'Electrical Maintenance Department',
  'Hostel Administration',
  'Transport Department',
  'AV Support & Classroom Facilities',
  'Sanitation & Housekeeping',
  'Library Administration',
  'Campus Security',
  'General Administration',
];

export default function AdminDashboard({ onShowToast }) {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Quick Edit Modal State
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [editStatus, setEditStatus] = useState('Submitted');
  const [editAssignedTo, setEditAssignedTo] = useState('');
  const [editResolution, setEditResolution] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    loadData();
  }, [categoryFilter, priorityFilter, statusFilter, search]);

  async function loadData() {
    try {
      setLoading(true);
      const [statsRes, complaintsRes] = await Promise.all([
        fetchStats(),
        fetchComplaints({
          category: categoryFilter !== 'All' ? categoryFilter : undefined,
          priority: priorityFilter !== 'All' ? priorityFilter : undefined,
          status: statusFilter !== 'All' ? statusFilter : undefined,
          search: search.trim() || undefined,
        }),
      ]);
      setStats(statsRes.data);
      setComplaints(complaintsRes.data || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  }

  function openEditModal(complaint) {
    setSelectedComplaint(complaint);
    setEditStatus(complaint.status || 'Submitted');
    setEditAssignedTo(complaint.assignedTo || '');
    setEditResolution(complaint.resolutionDetails || '');
  }

  function closeEditModal() {
    setSelectedComplaint(null);
    setSavingStatus(false);
  }

  async function handleSaveStatus(e) {
    e.preventDefault();
    if (!selectedComplaint) return;

    try {
      setSavingStatus(true);
      const res = await updateComplaintStatus(selectedComplaint._id, {
        status: editStatus,
        assignedTo: editAssignedTo,
        resolutionDetails: editResolution,
      });

      if (res.success) {
        if (onShowToast) {
          onShowToast(`Complaint status updated to "${editStatus}"`, 'success');
        }
        closeEditModal();
        await loadData();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      if (onShowToast) {
        onShowToast(err.message || 'Failed to update status', 'error');
      }
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleDelete(id, title) {
    if (!window.confirm(`Are you sure you want to delete complaint: "${title}"?`)) {
      return;
    }

    try {
      await deleteComplaint(id);
      if (onShowToast) {
        onShowToast('Complaint deleted', 'info');
      }
      await loadData();
    } catch (err) {
      if (onShowToast) {
        onShowToast(err.message || 'Failed to delete', 'error');
      }
    }
  }

  async function handleReloadDemo() {
    try {
      setLoading(true);
      await seedDemoData();
      if (onShowToast) {
        onShowToast('Demo data reloaded successfully!', 'success');
      }
      await loadData();
    } catch (err) {
      if (onShowToast) {
        onShowToast('Failed to reload demo data', 'error');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Campus Administration Portal
            </h1>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '9999px' }}>
              Admin Operations
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Triage incoming student grievances, assign departments, resolve complaints, and monitor campus metrics.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleReloadDemo}
            id="btn-admin-seed"
          >
            <Database size={15} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Admin KPI Metric Cards */}
      <div className="stat-grid">
        <StatCard
          title="Total Campus Tickets"
          value={stats?.total || 0}
          icon={Layers}
          color="#2563eb"
          bgColor="#eff6ff"
          subtitle="All recorded complaints"
        />
        <StatCard
          title="Awaiting Action"
          value={stats?.pending || 0}
          icon={Clock}
          color="#d97706"
          bgColor="#fef3c7"
          subtitle="Submitted & Under Review"
        />
        <StatCard
          title="Active In-Progress"
          value={stats?.inProgress || 0}
          icon={Zap}
          color="#7c3aed"
          bgColor="#ede9fe"
          subtitle="Assigned to department"
        />
        <StatCard
          title="Critical / High Urgency"
          value={(stats?.criticalPriority || 0) + (stats?.highPriority || 0)}
          icon={AlertTriangle}
          color="#dc2626"
          bgColor="#fef2f2"
          subtitle="Require rapid dispatch"
        />
      </div>

      {/* Advanced Filter & Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-subtle)', borderRadius: '8px', padding: '0.5rem 0.85rem' }}>
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Filter by student name, title, department, or location..."
              style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '0.92rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="admin-search-input"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status:</span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                id="admin-filter-status"
              >
                <option value="All">All Statuses</option>
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Priority:</span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                id="admin-filter-priority"
              >
                <option value="All">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Category:</span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="WiFi / Network">WiFi / Network</option>
                <option value="Classroom">Classroom</option>
                <option value="Laboratory">Laboratory</option>
                <option value="Hostel">Hostel</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Transportation">Transportation</option>
                <option value="Cleanliness">Cleanliness</option>
                <option value="Library">Library</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {complaints.length} Record{complaints.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </div>

      {/* Admin Data Table */}
      {loading ? (
        <div className="card" style={{ padding: '3.5rem', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem', width: '28px', height: '28px', borderColor: '#2563eb', borderTopColor: 'transparent' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Refreshing complaints...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="card empty-state">
          <ShieldAlert size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            No Complaints Found
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '380px', margin: '0 auto 1rem' }}>
            There are no complaints matching your administrative filter parameters.
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Complaint & Student</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned Dept / Staff</th>
                <th>Location</th>
                <th>AI Triage</th>
                <th>Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c._id}>
                  <td style={{ maxWidth: '280px' }}>
                    <Link
                      to={`/complaints/${c._id}`}
                      style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.15rem' }}
                    >
                      {c.title}
                    </Link>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {c.studentName} • {c.email}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.category}</span>
                  </td>
                  <td>
                    <PriorityBadge priority={c.priority} />
                  </td>
                  <td>
                    <StatusBadge status={c.status} />
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4338ca' }}>
                      {c.department || 'Unassigned'}
                    </div>
                    {c.assignedTo && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Staff: {c.assignedTo}
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {c.location}
                    </span>
                  </td>
                  <td>
                    {c.isAiAnalyzed ? (
                      <span className="badge" style={{ background: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe' }}>
                        <Sparkles size={12} />
                        Analyzed
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Not Triaged
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ padding: '0.35rem 0.65rem' }}
                        onClick={() => openEditModal(c)}
                        title="Update status & resolution"
                        id={`btn-manage-${c._id}`}
                      >
                        <Edit size={13} />
                        <span>Manage</span>
                      </button>

                      <Link
                        to={`/complaints/${c._id}`}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.35rem 0.65rem' }}
                        title="View Full Complaint Detail"
                      >
                        <ArrowRight size={13} />
                      </Link>

                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.35rem 0.55rem' }}
                        onClick={() => handleDelete(c._id, c.title)}
                        title="Delete Complaint"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Status Management Modal */}
      {selectedComplaint && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Manage Complaint Status
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                  #{selectedComplaint._id} — {selectedComplaint.title}
                </p>
              </div>
              <button
                onClick={closeEditModal}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveStatus}>
              <div className="modal-body">
                {/* Status Selector */}
                <div className="form-group">
                  <label className="form-label" htmlFor="modalStatus">
                    <span>Complaint Lifecycle Status</span>
                  </label>
                  <select
                    id="modalStatus"
                    className="form-select"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    style={{ fontWeight: 600 }}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Assigned Staff / Technician */}
                <div className="form-group">
                  <label className="form-label" htmlFor="modalAssignedTo">
                    <span>Assigned Staff / Technician</span>
                  </label>
                  <input
                    type="text"
                    id="modalAssignedTo"
                    className="form-input"
                    placeholder="e.g. Mike R. (AV Specialist), Plumbing Lead Dave T."
                    value={editAssignedTo}
                    onChange={(e) => setEditAssignedTo(e.target.value)}
                  />
                </div>

                {/* Resolution Details */}
                <div className="form-group">
                  <label className="form-label" htmlFor="modalResolution">
                    <span>Resolution & Progress Notes</span>
                  </label>
                  <textarea
                    id="modalResolution"
                    className="form-textarea"
                    placeholder="Enter actions taken, parts replaced, or closing notes..."
                    value={editResolution}
                    onChange={(e) => setEditResolution(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeEditModal}
                  disabled={savingStatus}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={savingStatus}
                  id="btn-save-status-modal"
                >
                  {savingStatus ? (
                    <>
                      <div className="spinner" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Save Status Update</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
