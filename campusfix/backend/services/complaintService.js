import mongoose from 'mongoose';
import Complaint from '../models/Complaint.js';
import { memoryStore } from './memoryStore.js';
import { analyzeComplaintWithAI } from './aiService.js';

export const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

export async function createComplaint(data) {
  if (isMongoConnected()) {
    const complaint = new Complaint(data);
    return await complaint.save();
  }
  return await memoryStore.create(data);
}

export async function getAllComplaints(filters = {}) {
  if (isMongoConnected()) {
    const query = {};
    if (filters.category && filters.category !== 'all') {
      query.category = { $regex: new RegExp(`^${filters.category}$`, 'i') };
    }
    if (filters.priority && filters.priority !== 'all') {
      query.priority = { $regex: new RegExp(`^${filters.priority}$`, 'i') };
    }
    if (filters.status && filters.status !== 'all') {
      query.status = { $regex: new RegExp(`^${filters.status}$`, 'i') };
    }
    if (filters.search) {
      const q = filters.search.trim();
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
        { studentName: { $regex: q, $options: 'i' } },
        { department: { $regex: q, $options: 'i' } },
      ];
    }
    return await Complaint.find(query).sort({ createdAt: -1 });
  }

  return await memoryStore.find(filters);
}

export async function getComplaintById(id) {
  if (isMongoConnected()) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      return await Complaint.findById(id);
    }
    // Might be in-memory id if seeded before mongo
    const inMem = await memoryStore.findById(id);
    if (inMem) return inMem;
    return null;
  }
  return await memoryStore.findById(id);
}

export async function updateComplaint(id, updateData) {
  if (isMongoConnected()) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      return await Complaint.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
    }
  }
  return await memoryStore.findByIdAndUpdate(id, updateData);
}

export async function deleteComplaint(id) {
  if (isMongoConnected()) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      return await Complaint.findByIdAndDelete(id);
    }
  }
  return await memoryStore.findByIdAndDelete(id);
}

export async function analyzeComplaint(id) {
  const complaint = await getComplaintById(id);
  if (!complaint) {
    throw new Error(`Complaint with ID ${id} not found`);
  }

  const aiResult = await analyzeComplaintWithAI(complaint);

  const updatePayload = {
    aiCategory: aiResult.category,
    priority: aiResult.priority,
    department: aiResult.department,
    aiSummary: aiResult.summary,
    suggestedAction: aiResult.suggestedAction,
    isAiAnalyzed: true,
  };

  const updatedComplaint = await updateComplaint(id, updatePayload);
  return {
    complaint: updatedComplaint,
    analysis: aiResult,
  };
}

export async function updateComplaintStatus(id, { status, assignedTo, resolutionDetails }) {
  const complaint = await getComplaintById(id);
  if (!complaint) {
    throw new Error(`Complaint with ID ${id} not found`);
  }

  const payload = {};
  if (status) payload.status = status;
  if (assignedTo !== undefined) payload.assignedTo = assignedTo;
  if (resolutionDetails !== undefined) payload.resolutionDetails = resolutionDetails;

  return await updateComplaint(id, payload);
}

export async function getComplaintStats() {
  const all = await getAllComplaints({});

  const stats = {
    total: all.length,
    submitted: 0,
    underReview: 0,
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    pending: 0, // submitted + underReview + assigned
    criticalPriority: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    byCategory: {},
    byPriority: {},
    byStatus: {},
  };

  for (const c of all) {
    // Status counts
    const status = c.status || 'Submitted';
    stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;

    if (status === 'Submitted') stats.submitted++;
    if (status === 'Under Review') stats.underReview++;
    if (status === 'Assigned') stats.assigned++;
    if (status === 'In Progress') stats.inProgress++;
    if (status === 'Resolved') stats.resolved++;
    if (status === 'Closed') stats.closed++;

    // Pending count
    if (['Submitted', 'Under Review', 'Assigned'].includes(status)) {
      stats.pending++;
    }

    // Priority counts
    const priority = c.priority || 'Medium';
    stats.byPriority[priority] = (stats.byPriority[priority] || 0) + 1;
    if (priority === 'Critical') stats.criticalPriority++;
    if (priority === 'High') stats.highPriority++;
    if (priority === 'Medium') stats.mediumPriority++;
    if (priority === 'Low') stats.lowPriority++;

    // Category counts
    const cat = c.category || 'Other';
    stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;
  }

  return stats;
}

export async function seedDemoData() {
  if (isMongoConnected()) {
    await Complaint.deleteMany({});
    const items = memoryStore.resetToDefaults();
    const cleanItems = items.map(({ _id, ...rest }) => rest);
    await Complaint.insertMany(cleanItems);
    return await Complaint.find().sort({ createdAt: -1 });
  }
  return memoryStore.resetToDefaults();
}

export function getSystemInfo() {
  const mongo = isMongoConnected();
  const hasGemini = Boolean(
    process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY.trim().length > 0 &&
      process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'
  );

  return {
    database: mongo ? 'MongoDB (Connected)' : 'In-Memory Store (Fallback/Demo Mode)',
    isMongo: mongo,
    aiProvider: hasGemini ? 'Google Gemini 1.5 Flash' : 'Deterministic AI Engine (Fallback Mode)',
    hasGemini,
    mode: mongo && hasGemini ? 'Production AI & Database' : 'Demo / Resilient Fallback Mode',
  };
}
