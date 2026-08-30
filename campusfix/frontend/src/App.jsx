import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import FallbackBanner from './components/FallbackBanner';
import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/StudentDashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import ComplaintHistory from './pages/ComplaintHistory';
import AdminDashboard from './pages/AdminDashboard';
import ComplaintDetail from './pages/ComplaintDetail';
import { fetchHealth, fetchStats, seedDemoData } from './services/api';

export default function App() {
  const [systemInfo, setSystemInfo] = useState(null);
  const [stats, setStats] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    loadAppInfo();
  }, []);

  async function loadAppInfo() {
    try {
      const [healthRes, statsRes] = await Promise.all([
        fetchHealth().catch(() => ({ system: { isMongo: false, hasGemini: false } })),
        fetchStats().catch(() => ({ data: null })),
      ]);
      setSystemInfo(healthRes.system);
      setStats(statsRes.data);
    } catch (err) {
      console.warn('Failed to load initial app info:', err);
    }
  }

  function showToast(message, type = 'info') {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }

  function removeToast(id) {
    setToasts(prev => prev.filter(t => t.id !== id));
  }

  async function handleSeedDemo() {
    try {
      setIsSeeding(true);
      await seedDemoData();
      showToast('Demo data reloaded successfully!', 'success');
      await loadAppInfo();
      // Trigger a page refresh or soft reload so current page views update
      window.dispatchEvent(new Event('campusfix_data_changed'));
    } catch (err) {
      showToast('Failed to seed demo data', 'error');
    } finally {
      setIsSeeding(false);
    }
  }

  return (
    <Router>
      <div className="app-container">
        <FallbackBanner systemInfo={systemInfo} />
        <Navbar systemInfo={systemInfo} />

        <div className="main-layout">
          <Sidebar onSeedDemo={handleSeedDemo} isSeeding={isSeeding} />

          <main className="content-area">
            <Routes>
              <Route path="/" element={<LandingPage stats={stats} />} />
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/submit" element={<SubmitComplaint onShowToast={showToast} />} />
              <Route path="/complaints" element={<ComplaintHistory />} />
              <Route path="/admin" element={<AdminDashboard onShowToast={showToast} />} />
              <Route path="/complaints/:id" element={<ComplaintDetail onShowToast={showToast} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

        <Toast toasts={toasts} onRemove={removeToast} />
      </div>
    </Router>
  );
}
