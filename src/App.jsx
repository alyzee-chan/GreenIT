import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import VirtualBuilder from './pages/VirtualBuilder';
import WaterUsage from './pages/WaterUsage';
import { Minerals } from './pages/Placeholders';
import './App.css';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/builder" element={<VirtualBuilder />} />
        <Route path="/water-usage" element={<WaterUsage />} />
        <Route path="/minerals" element={<Minerals />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
