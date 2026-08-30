import * as complaintService from '../services/complaintService.js';

export async function getHealth(req, res) {
  try {
    const sysInfo = complaintService.getSystemInfo();
    return res.status(200).json({
      status: 'healthy',
      message: 'CampusFix AI API is operational',
      system: sysInfo,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
}

export async function createComplaint(req, res) {
  try {
    const {
      studentName,
      email,
      title,
      description,
      category,
      location,
      priority,
      autoAnalyze,
    } = req.body;

    // Validation
    if (!studentName || !studentName.trim()) {
      return res.status(400).json({ success: false, error: 'Student name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, error: 'Valid email is required' });
    }
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Complaint title is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, error: 'Complaint description is required' });
    }
    if (!location || !location.trim()) {
      return res.status(400).json({ success: false, error: 'Location is required' });
    }

    const complaintData = {
      studentName: studentName.trim(),
      email: email.trim().toLowerCase(),
      title: title.trim(),
      description: description.trim(),
      category: category || 'Other',
      location: location.trim(),
      priority: priority || 'Medium',
      status: 'Submitted',
    };

    const newComplaint = await complaintService.createComplaint(complaintData);

    // Optional immediate auto-analysis if requested
    if (autoAnalyze) {
      try {
        const analysisResult = await complaintService.analyzeComplaint(newComplaint._id);
        return res.status(201).json({
          success: true,
          message: 'Complaint submitted and AI analyzed successfully',
          data: analysisResult.complaint,
          analysis: analysisResult.analysis,
        });
      } catch (err) {
        console.warn('Auto-analysis encountered error during creation:', err.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: newComplaint,
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to submit complaint' });
  }
}

export async function getAllComplaints(req, res) {
  try {
    const { category, priority, status, search } = req.query;
    const complaints = await complaintService.getAllComplaints({
      category,
      priority,
      status,
      search,
    });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to fetch complaints' });
  }
}

export async function getComplaintStats(req, res) {
  try {
    const stats = await complaintService.getComplaintStats();
    const sysInfo = complaintService.getSystemInfo();

    return res.status(200).json({
      success: true,
      data: stats,
      system: sysInfo,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to fetch statistics' });
  }
}

export async function getComplaintById(req, res) {
  try {
    const { id } = req.params;
    const complaint = await complaintService.getComplaintById(id);

    if (!complaint) {
      return res.status(404).json({ success: false, error: `Complaint #${id} not found` });
    }

    return res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    console.error('Error fetching complaint by id:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to fetch complaint' });
  }
}

export async function updateComplaint(req, res) {
  try {
    const { id } = req.params;
    const updated = await complaintService.updateComplaint(id, req.body);

    if (!updated) {
      return res.status(404).json({ success: false, error: `Complaint #${id} not found` });
    }

    return res.status(200).json({
      success: true,
      message: 'Complaint updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating complaint:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to update complaint' });
  }
}

export async function deleteComplaint(req, res) {
  try {
    const { id } = req.params;
    const deleted = await complaintService.deleteComplaint(id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: `Complaint #${id} not found` });
    }

    return res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully',
      data: deleted,
    });
  } catch (error) {
    console.error('Error deleting complaint:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to delete complaint' });
  }
}

export async function analyzeComplaint(req, res) {
  try {
    const { id } = req.params;
    const result = await complaintService.analyzeComplaint(id);

    return res.status(200).json({
      success: true,
      message: 'Complaint successfully analyzed by AI',
      data: result.complaint,
      analysis: result.analysis,
    });
  } catch (error) {
    console.error('Error analyzing complaint with AI:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze complaint',
    });
  }
}

export async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, assignedTo, resolutionDetails } = req.body;

    const validStatuses = [
      'Submitted',
      'Under Review',
      'Assigned',
      'In Progress',
      'Resolved',
      'Closed',
    ];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
      });
    }

    const updated = await complaintService.updateComplaintStatus(id, {
      status,
      assignedTo,
      resolutionDetails,
    });

    return res.status(200).json({
      success: true,
      message: `Complaint status changed to "${status}"`,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating status:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to update complaint status' });
  }
}

export async function seedData(req, res) {
  try {
    const seeded = await complaintService.seedDemoData();
    return res.status(200).json({
      success: true,
      message: 'Demo complaints loaded successfully',
      count: seeded.length,
      data: seeded,
    });
  } catch (error) {
    console.error('Error seeding demo data:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to seed demo data' });
  }
}
