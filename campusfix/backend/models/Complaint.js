import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Student email is required'],
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Classroom',
        'Laboratory',
        'Hostel',
        'WiFi / Network',
        'Infrastructure',
        'Transportation',
        'Cleanliness',
        'Library',
        'Other',
      ],
      default: 'Other',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    aiCategory: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    department: {
      type: String,
      default: 'General Administration',
    },
    aiSummary: {
      type: String,
      default: '',
    },
    suggestedAction: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: [
        'Submitted',
        'Under Review',
        'Assigned',
        'In Progress',
        'Resolved',
        'Closed',
      ],
      default: 'Submitted',
    },
    assignedTo: {
      type: String,
      default: '',
    },
    resolutionDetails: {
      type: String,
      default: '',
    },
    isAiAnalyzed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
