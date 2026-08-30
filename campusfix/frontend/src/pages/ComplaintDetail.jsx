import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Mail,
  User,
  Building,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  Edit,
  Save,
  Trash2,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import AIAnalysisCard from '../components/AIAnalysisCard';
import StatusTimeline from '../components/StatusTimeline';
import {
  fetchComplaintById,
  analyzeComplaint,
  updateComplaintStatus,
  deleteComplaint,
} from '../services/api';

const STATUS_OPTIONS = [
  'Submitted',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
  'Closed',
];

export default function ComplaintDetail({ onShowToast }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  // Status updating form state
  const [status, setStatus] = useState('Submitted');
  const [assignedTo, setAssignedTo] = useState('');
  const [resolutionDetails, setResolutionDetails] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    loadComplaint();
  }, [id]);

  async function loadComplaint() {
    try {
      setLoading(true);
      setError('');
      const res = await fetchComplaintById(id);
      const data = res.data;
      setComplaint(data);
      setStatus(data.status || 'Submitted');
      setAssignedTo(data.assignedTo || '');
      setResolutionDetails(data.resolutionDetails || '');
    } catch (err) {
      console.error('Failed to load complaint:', err);
      setError(err.message || 'Complaint not found');
    } finally {
      setLoading(false);
    }
  }

  async function handleAnalyze() {
    if (!complaint) return;
    try {
      setAnalyzing(true);
      const res = await analyzeComplaint(complaint._id);
      if (res.success && res.data) {
        setComplaint(res.data);
        if (onShowToast) {
          onShowToast('Complaint analyzed by AI triage successfully!', 'success');
        }
      }
    } catch (err) {
      console.error('AI Analysis failed:', err);
      if (onShowToast) {
        onShowToast(err.message || 'AI Analysis failed', 'error');
      }
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleUpdateStatus(e) {
    e.preventDefault();
    if (!complaint) return;

    try {
      setIsUpdatingStatus(true);
      const res = await updateComplaintStatus(complaint._id, {
        status,
        assignedTo,
        resolutionDetails,
      });

      if (res.success && res.data) {
        setComplaint(res.data);
        if (onShowToast) {
          onShowToast(`Status updated to "${status}"`, 'success');
        }
      }
    } catch (err) {
      console.error('Status update failed:', err);
      if (onShowToast) {
        onShowToast(err.message || 'Failed to update status', 'error');
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  async function handleDelete() {
    if (!complaint) return;
    if (!window.confirm(`Delete complaint "${complaint.title}"?`)) return;

    try {
      await deleteComplaint(complaint._id);
      if (onShowToast) {
        onShowToast('Complaint deleted', 'info');
      }
      navigate('/dashboard');
    } catch (err) {
      if (onShowToast) {
        onShowToast(err.message || 'Failed to delete', 'error');
      }
    }
  }

  if (loading) {
    return (
      <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem', width: '32px', height: '32px', borderColor: '#2563eb', borderTopColor: 'transparent' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading complaint details...</p>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="card empty-state">
        <AlertCircle size={40} color="#dc2626" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Complaint Not Found
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          {error || 'The requested complaint ticket does not exist or has been removed.'}
        </p>
        <Link to="/dashboard" className="btn btn-primary btn-sm">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Top Back Navigation & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={15} />
          <span>Back</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={handleDelete}
            className="btn btn-danger btn-sm"
            title="Delete this complaint"
          >
            <Trash2 size={14} />
            <span>Delete Ticket</span>
          </button>
        </div>
      </div>

      {/* Main Complaint Header Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              <StatusBadge status={complaint.status} />
              <PriorityBadge priority={complaint.priority} />
              <span style={{ fontSize: '0.78rem', background: 'var(--bg-subtle)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Ticket ID: {complaint._id}
              </span>
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
              {complaint.title}
            </h1>
          </div>
        </div>

        {/* Lifecycle Stepper Timeline */}
        <StatusTimeline currentStatus={complaint.status} />

        {/* Complaint Description */}
        <div style={{ margin: '1.5rem 0' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            Problem Description
          </div>
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.96rem', lineHeight: 1.6, color: '#1e293b' }}>
            {complaint.description}
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', fontSize: '0.86rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>SUBMITTED BY</span>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
              {complaint.studentName}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{complaint.email}</div>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>LOCATION</span>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
              {complaint.location}
            </div>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>CATEGORY</span>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
              {complaint.category}
            </div>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>REPORTED AT</span>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
              {new Date(complaint.createdAt).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </div>
          </div>
        </div>
      </div>

      {/* AI Triage & Analysis Card */}
      <div style={{ marginBottom: '1.5rem' }}>
        <AIAnalysisCard
          complaint={complaint}
          onAnalyze={handleAnalyze}
          isAnalyzing={analyzing}
        />
      </div>

      {/* Status & Resolution Workflow Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Manage Status & Resolution</h3>
            <p className="card-subtitle">
              Progress the issue through the resolution workflow and document technician actions.
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateStatus}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="detailStatus">
                <span>Update Status</span>
              </label>
              <select
                id="detailStatus"
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ fontWeight: 600 }}
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="detailAssignedTo">
                <span>Assigned Staff / Technician</span>
              </label>
              <input
                type="text"
                id="detailAssignedTo"
                className="form-input"
                placeholder="e.g. Mike R. (AV Specialist)"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="detailResolution">
              <span>Resolution Notes / Details</span>
            </label>
            <textarea
              id="detailResolution"
              className="form-textarea"
              placeholder="Describe work completed, replacement parts, or ongoing investigation..."
              value={resolutionDetails}
              onChange={(e) => setResolutionDetails(e.target.value)}
              rows={3}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUpdatingStatus}
              id="btn-update-complaint-status"
            >
              {isUpdatingStatus ? (
                <>
                  <div className="spinner" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Status Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
