import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Send,
  Building2,
  MapPin,
  Mail,
  User,
  AlertCircle,
  FileText,
  BookmarkPlus,
  HelpCircle,
} from 'lucide-react';
import { createComplaint } from '../services/api';

const CATEGORIES = [
  'WiFi / Network',
  'Classroom',
  'Laboratory',
  'Hostel',
  'Infrastructure',
  'Transportation',
  'Cleanliness',
  'Library',
  'Other',
];

const PRESETS = [
  {
    label: '📶 WiFi Outage in Block A',
    title: 'WiFi not working in Block A',
    description: 'Students in Block A are unable to access the college WiFi since morning. Multiple students are affected and cannot access online lecture portals.',
    category: 'WiFi / Network',
    location: 'Block A, 3rd Floor Computer Center',
    studentName: 'Alex Rivera',
    email: 'alex.rivera@campus.edu',
  },
  {
    label: '📽️ Broken Projector in CSE 302',
    title: 'Broken projector in CSE classroom 302',
    description: 'The ceiling projector is displaying heavy red distortion and shutting down every 5 minutes during database lectures.',
    category: 'Classroom',
    location: 'CSE Department, Room 302',
    studentName: 'Priya Sharma',
    email: 'priya.s@campus.edu',
  },
  {
    label: '🚰 Hostel Water Pipe Leak',
    title: 'Hostel Block C 2nd floor water pipe leakage',
    description: 'Urgent water leakage from main bathroom pipe on 2nd floor. Water is seeping into the hallway and posing an electrical slipping hazard.',
    category: 'Hostel',
    location: 'Hostel Block C, 2nd Floor Corridor',
    studentName: 'Jordan Lee',
    email: 'jordan.lee@campus.edu',
  },
  {
    label: '💻 Lab Systems Not Booting',
    title: 'Computer systems not working in laboratory',
    description: 'Terminals 12 through 18 in the AI Lab fail to post with power supply failure and blinking orange LEDs.',
    category: 'Laboratory',
    location: 'Science & Tech Annex, Lab 4',
    studentName: 'Samantha Chen',
    email: 'schen@campus.edu',
  },
];

export default function SubmitComplaint({ onShowToast }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    title: '',
    category: 'WiFi / Network',
    location: '',
    description: '',
    autoAnalyze: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function applyPreset(preset) {
    setFormData(prev => ({
      ...prev,
      title: preset.title,
      description: preset.description,
      category: preset.category,
      location: preset.location,
      studentName: preset.studentName,
      email: preset.email,
    }));
    setError('');
    if (onShowToast) {
      onShowToast(`Preset loaded: "${preset.title}"`, 'info');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (!formData.studentName.trim()) {
      setError('Please provide your student name.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please provide your college email address.');
      return;
    }
    if (!formData.title.trim()) {
      setError('Please enter a concise complaint title.');
      return;
    }
    if (!formData.location.trim()) {
      setError('Please specify the campus location (e.g. Block A, Room 302).');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please describe the problem details.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await createComplaint(formData);

      if (res.success && res.data) {
        if (onShowToast) {
          onShowToast('Complaint submitted successfully!', 'success');
        }
        // Redirect to the complaint detail page so student can view AI triage
        navigate(`/complaints/${res.data._id}`);
      }
    } catch (err) {
      console.error('Submission failed:', err);
      setError(err.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Report a Campus Issue
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
          Submit your problem details. CampusFix AI will automatically evaluate priority, detect department routing, and notify supervisors.
        </p>
      </div>

      {/* Quick Presets for Demo */}
      <div className="card" style={{ marginBottom: '1.5rem', background: '#faf8ff', borderColor: '#ddd6fe' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <BookmarkPlus size={16} color="#7c3aed" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#5b21b6' }}>
            Instant Demo Presets (Click to autofill):
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', background: 'white' }}
              onClick={() => applyPreset(p)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="card">
        {error && (
          <div style={{ padding: '0.85rem 1rem', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Student Name & Email */}
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="studentName">
              <span>Student Full Name *</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                id="studentName"
                name="studentName"
                className="form-input"
                placeholder="e.g. Alex Rivera"
                value={formData.studentName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              <span>Campus Email *</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="e.g. alex.rivera@campus.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Complaint Title */}
        <div className="form-group">
          <label className="form-label" htmlFor="title">
            <span>Issue Title *</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-input"
            placeholder="e.g. WiFi not working in Block A"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Category & Location */}
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="category">
              <span>Select Category *</span>
            </label>
            <select
              id="category"
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="location">
              <span>Campus Location / Room *</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className="form-input"
              placeholder="e.g. Block A, 3rd Floor Computer Center"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Detailed Description */}
        <div className="form-group">
          <label className="form-label" htmlFor="description">
            <span>Problem Description *</span>
          </label>
          <textarea
            id="description"
            name="description"
            className="form-textarea"
            placeholder="Explain the problem in detail (e.g. what is broken, how many students are affected, whether there is a safety risk)..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        {/* Auto Analyze Checkbox */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 0', marginBottom: '1.25rem' }}>
          <input
            type="checkbox"
            id="autoAnalyze"
            name="autoAnalyze"
            checked={formData.autoAnalyze}
            onChange={handleChange}
            style={{ width: '17px', height: '17px', cursor: 'pointer' }}
          />
          <label htmlFor="autoAnalyze" style={{ fontSize: '0.9rem', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={15} color="#7c3aed" />
            <span>Automatically trigger AI Triage immediately upon submission</span>
          </label>
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={submitting}
            id="btn-submit-complaint"
          >
            {submitting ? (
              <>
                <div className="spinner" />
                <span>Submitting Issue...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Submit Complaint</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
