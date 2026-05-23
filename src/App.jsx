import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

import Dashboard from './pages/Dashboard';
import Energy from './pages/Energy';
import Minerals from './pages/Minerals';
import Predictions from './pages/Predictions';
import Alerts from './pages/Alerts';
import AfricaGreen from './pages/AfricaGreen';
import Benchmark from './pages/Benchmark';
import Geopolitics from './pages/Geopolitics';
import Community from './pages/Community';
import Reports from './pages/Reports';
import Admin from './pages/Admin';
import VirtualBuilder from './pages/VirtualBuilder';
import WaterUsage from './pages/WaterUsage';
import Sensitization from './pages/Sensitization';

import './App.css';

const AppLayout = () => (
  <div className="app-container">
    <Sidebar />
    <main className="main-content">
      <Outlet />
    </main>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public full-screen routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* App shell routes */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/energy" element={<Energy />} />
          <Route path="/minerals" element={<Minerals />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/africa" element={<AfricaGreen />} />
          <Route path="/benchmark" element={<Benchmark />} />
          <Route path="/geopolitics" element={<Geopolitics />} />
          <Route path="/community" element={<Community />} />
          <Route path="/builder" element={<VirtualBuilder />} />
          <Route path="/water-usage" element={<WaterUsage />} />
          <Route path="/sensitization" element={<Sensitization />} />

          {/* Authenticated routes */}
          <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Admin-only */}
          <Route path="/admin" element={<ProtectedRoute role="ADMIN"><Admin /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
