import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import complaintRoutes from './routes/complaintRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// API Routes
app.use('/api', complaintRoutes);

// Root greeting
app.get('/', (req, res) => {
  res.json({
    name: 'CampusFix AI Backend API',
    tagline: 'Report it. AI routes it. Campus fixes it.',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      complaints: '/api/complaints',
      stats: '/api/complaints/stats',
    },
  });
});

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `API route '${req.originalUrl}' not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

// Database Connection with graceful fallback
async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri || !uri.trim()) {
    console.log('ℹ️  No MONGODB_URI configured in .env');
    console.log('⚡ Active Data Layer: High-performance In-Memory Fallback Store pre-seeded with demo data');
    return;
  }

  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(uri.trim(), {
      serverSelectionTimeoutMS: 4000,
    });
    console.log('✅ MongoDB Connected successfully');
  } catch (err) {
    console.warn(`⚠️  MongoDB connection failed (${err.message}).`);
    console.log('⚡ Active Data Layer: High-performance In-Memory Fallback Store pre-seeded with demo data');
  }
}

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 CampusFix AI Server running on http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  });
});
