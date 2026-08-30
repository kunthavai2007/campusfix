// In-memory data store providing seamless fallback when MongoDB is unavailable

const DEFAULT_DEMO_COMPLAINTS = [
  {
    _id: 'demo-cmp-001',
    studentName: 'Alex Rivera',
    email: 'alex.rivera@campus.edu',
    title: 'WiFi not working in Block A',
    description: 'Students in Block A are unable to access the college WiFi since morning. Multiple students are affected and cannot access online lecture portals.',
    category: 'WiFi / Network',
    location: 'Block A, 3rd Floor Computer Center',
    aiCategory: 'WiFi / Network',
    priority: 'High',
    department: 'IT Support',
    aiSummary: 'Campus WiFi is completely unreachable in Block A, disrupting student coursework.',
    suggestedAction: 'IT support network engineers should inspect switch racks and APs in Block A.',
    status: 'Submitted',
    assignedTo: 'IT Network Team',
    resolutionDetails: '',
    isAiAnalyzed: true,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    _id: 'demo-cmp-002',
    studentName: 'Priya Sharma',
    email: 'priya.s@campus.edu',
    title: 'Broken projector in CSE classroom 302',
    description: 'The ceiling projector is displaying heavy red distortion and shutting down every 5 minutes during database lectures.',
    category: 'Classroom',
    location: 'CSE Department, Room 302',
    aiCategory: 'Classroom',
    priority: 'Medium',
    department: 'AV / Facilities Team',
    aiSummary: 'Overheating/lamp malfunction on classroom ceiling projector in CSE 302.',
    suggestedAction: 'Replace projector lamp bulb or inspect HDMI/power connections.',
    status: 'In Progress',
    assignedTo: 'AV Support - Mike R.',
    resolutionDetails: 'Replacement lamp bulb requested from central inventory.',
    isAiAnalyzed: true,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    _id: 'demo-cmp-003',
    studentName: 'Jordan Lee',
    email: 'jordan.lee@campus.edu',
    title: 'Hostel Block C 2nd floor water pipe leakage',
    description: 'Urgent water leakage from main bathroom pipe on 2nd floor. Water is seeping into the hallway and posing an electrical slipping hazard.',
    category: 'Hostel',
    location: 'Hostel Block C, 2nd Floor Corridor',
    aiCategory: 'Hostel',
    priority: 'Critical',
    department: 'Hostel Administration & Maintenance',
    aiSummary: 'Critical pipe burst causing flooding and electrical safety hazard in Hostel Block C.',
    suggestedAction: 'Immediately shut off main 2nd-floor water valve and deploy emergency plumbing crew.',
    status: 'Assigned',
    assignedTo: 'Plumbing Lead - Dave T.',
    resolutionDetails: 'Main riser valve temporarily throttled.',
    isAiAnalyzed: true,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    _id: 'demo-cmp-004',
    studentName: 'Samantha Chen',
    email: 'schen@campus.edu',
    title: 'Computer systems not booting in AI & Robotics Lab',
    description: 'Terminals 12 through 18 in the AI Lab fail to post with power supply failure and blinking orange LEDs.',
    category: 'Laboratory',
    location: 'Science & Tech Annex, Lab 4',
    aiCategory: 'Laboratory',
    priority: 'High',
    department: 'Lab Technician & IT Hardware',
    aiSummary: 'Multiple lab workstations experiencing power unit faults before scheduled lab exams.',
    suggestedAction: 'Lab technician to test power rails and swap damaged SMPS units.',
    status: 'Resolved',
    assignedTo: 'Hardware Specialist - Ken L.',
    resolutionDetails: 'Replaced 4 blown power supplies and tested all 7 workstations successfully.',
    isAiAnalyzed: true,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
];

class MemoryComplaintStore {
  constructor() {
    this.complaints = JSON.parse(JSON.stringify(DEFAULT_DEMO_COMPLAINTS));
  }

  generateId() {
    return 'cmp_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  }

  async create(data) {
    const newDoc = {
      _id: this.generateId(),
      studentName: data.studentName || '',
      email: (data.email || '').toLowerCase(),
      title: data.title || '',
      description: data.description || '',
      category: data.category || 'Other',
      location: data.location || '',
      aiCategory: data.aiCategory || '',
      priority: data.priority || 'Medium',
      department: data.department || 'General Administration',
      aiSummary: data.aiSummary || '',
      suggestedAction: data.suggestedAction || '',
      status: data.status || 'Submitted',
      assignedTo: data.assignedTo || '',
      resolutionDetails: data.resolutionDetails || '',
      isAiAnalyzed: data.isAiAnalyzed || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.complaints.unshift(newDoc);
    return newDoc;
  }

  async find(filters = {}) {
    let result = [...this.complaints];

    if (filters.category && filters.category !== 'all') {
      result = result.filter(c => c.category.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters.priority && filters.priority !== 'all') {
      result = result.filter(c => c.priority.toLowerCase() === filters.priority.toLowerCase());
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter(c => c.status.toLowerCase() === filters.status.toLowerCase());
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.studentName.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async findById(id) {
    const doc = this.complaints.find(c => String(c._id) === String(id));
    return doc ? { ...doc } : null;
  }

  async findByIdAndUpdate(id, updateData) {
    const index = this.complaints.findIndex(c => String(c._id) === String(id));
    if (index === -1) return null;

    this.complaints[index] = {
      ...this.complaints[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    return { ...this.complaints[index] };
  }

  async findByIdAndDelete(id) {
    const index = this.complaints.findIndex(c => String(c._id) === String(id));
    if (index === -1) return null;
    const deleted = this.complaints.splice(index, 1)[0];
    return deleted;
  }

  async countDocuments(filters = {}) {
    const list = await this.find(filters);
    return list.length;
  }

  resetToDefaults() {
    this.complaints = JSON.parse(JSON.stringify(DEFAULT_DEMO_COMPLAINTS));
    return this.complaints;
  }
}

export const memoryStore = new MemoryComplaintStore();
