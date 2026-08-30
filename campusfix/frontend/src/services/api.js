/**
 * CampusFix AI Frontend API Client
 */
const API_BASE = 'https://campusfix-3fh7.onrender.com/api';
async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
}

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return handleResponse(res);
}

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/complaints/stats`);
  return handleResponse(res);
}

export async function fetchComplaints(params = {}) {
  const query = new URLSearchParams();
  if (params.category && params.category !== 'all') query.append('category', params.category);
  if (params.priority && params.priority !== 'all') query.append('priority', params.priority);
  if (params.status && params.status !== 'all') query.append('status', params.status);
  if (params.search) query.append('search', params.search);

  const qs = query.toString();
  const url = `${API_BASE}/complaints${qs ? `?${qs}` : ''}`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function fetchComplaintById(id) {
  const res = await fetch(`${API_BASE}/complaints/${id}`);
  return handleResponse(res);
}

export async function createComplaint(payload) {
  const res = await fetch(`${API_BASE}/complaints`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateComplaint(id, payload) {
  const res = await fetch(`${API_BASE}/complaints/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteComplaint(id) {
  const res = await fetch(`${API_BASE}/complaints/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}

export async function analyzeComplaint(id) {
  const res = await fetch(`${API_BASE}/complaints/${id}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}

export async function updateComplaintStatus(id, { status, assignedTo, resolutionDetails }) {
  const res = await fetch(`${API_BASE}/complaints/${id}/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status, assignedTo, resolutionDetails }),
  });
  return handleResponse(res);
}

export async function seedDemoData() {
  const res = await fetch(`${API_BASE}/complaints/seed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}
