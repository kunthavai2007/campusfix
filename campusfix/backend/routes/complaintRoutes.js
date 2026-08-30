import express from 'express';
import {
  getHealth,
  createComplaint,
  getAllComplaints,
  getComplaintStats,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  analyzeComplaint,
  updateStatus,
  seedData,
} from '../controllers/complaintController.js';

const router = express.Router();

// Health Check
router.get('/health', getHealth);

// Stats & Seed (Declared before :id routes)
router.get('/complaints/stats', getComplaintStats);
router.post('/complaints/seed', seedData);

// Collection operations
router.post('/complaints', createComplaint);
router.get('/complaints', getAllComplaints);

// Specific complaint operations
router.get('/complaints/:id', getComplaintById);
router.put('/complaints/:id', updateComplaint);
router.delete('/complaints/:id', deleteComplaint);
router.post('/complaints/:id/analyze', analyzeComplaint);
router.post('/complaints/:id/status', updateStatus);

export default router;
