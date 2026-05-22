import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Cpu, Leaf, Droplets, LineChart, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  return (
    <motion.aside 
      className="sidebar"
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="sidebar-header">
        <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 5, repeatDelay: 2 }}>
          <Leaf className="sidebar-logo" size={32} />
        </motion.div>
        <span className="sidebar-title">GreenIT.ai</span>
      </div>
      
      <nav className="nav-list">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <motion.div whileHover={{ scale: 1.2, rotate: 5 }}><LayoutDashboard className="nav-icon" /></motion.div>
          <span>Tableau de Bord</span>
        </NavLink>
        
        <NavLink 
          to="/builder" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <motion.div whileHover={{ scale: 1.2, rotate: 5 }}><Cpu className="nav-icon" /></motion.div>
          <span>Virtual Builder</span>
        </NavLink>

        <NavLink 
          to="/water-usage" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <motion.div whileHover={{ scale: 1.2, rotate: 5 }}><Droplets className="nav-icon" /></motion.div>
          <span>Ressources en Eau</span>
        </NavLink>

        <NavLink 
          to="/minerals" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <motion.div whileHover={{ scale: 1.2, rotate: 5 }}><LineChart className="nav-icon" /></motion.div>
          <span>Marché des Minéraux</span>
        </NavLink>

        <NavLink 
          to="/sensitization" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <motion.div whileHover={{ scale: 1.2, rotate: 5 }}><BookOpen className="nav-icon" /></motion.div>
          <span>Sensibilisation</span>
        </NavLink>
      </nav>
      
      <motion.div 
        style={{ marginTop: 'auto', padding: '1rem', backgroundColor: '#F1F5F9', borderRadius: '8px' }}
        whileHover={{ scale: 1.02 }}
      >
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          <strong>Impact du Projet</strong>
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Sensibiliser pour réduire la sur-exploitation minérale liée à l'IA.
        </p>
      </motion.div>
    </motion.aside>
  );
};

export default Sidebar;
