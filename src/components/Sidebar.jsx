import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Zap, Gem, Brain, Globe2, BarChart3, Landmark,
  Users, ChevronDown, ArrowRight, Leaf, LogOut,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../store/auth';

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/energy', icon: Zap, label: 'Energie & Datacenters' },
  { to: '/minerals', icon: Gem, label: 'Minéraux' },
  { to: '/predictions', icon: Brain, label: 'Prédictions IA' },
  { to: '/africa', icon: Globe2, label: 'AfricaGreen' },
  { to: '/benchmark', icon: BarChart3, label: 'Benchmark' },
  { to: '/geopolitics', icon: Landmark, label: 'Géopolitique' },
  { to: '/community', icon: Users, label: 'Communauté' },
];

const Sidebar = () => {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      style={{
        width: '260px',
        minWidth: '260px',
        background: '#FFFFFF',
        borderRight: '1px solid #E2E8F0',
        padding: '1.75rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        overflowY: 'auto',
      }}
    >
      {/* Brand Logo Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '2rem', paddingLeft: '0.5rem' }}>
        <div style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 16px rgba(34, 197, 94, 0.3)',
        }}>
          <Leaf color="#FFFFFF" size={22} />
        </div>
        <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
          GreenIT
        </span>
      </div>

      {/* Navigation List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.75rem 1rem',
              borderRadius: '16px',
              fontSize: '0.9rem',
              fontWeight: isActive ? 700 : 600,
              color: isActive ? '#16A34A' : '#475569',
              background: isActive ? '#F0FDF4' : 'transparent',
              border: isActive ? '1px solid #DCFCE7' : '1px solid transparent',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
            })}
          >
            {({ isActive }) => (
              <>
                <n.icon size={20} color={isActive ? '#16A34A' : '#64748B'} />
                <span>{n.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Promo Card — white bg, plant on right, green button */}
      <div style={{
        background: '#F0FDF4',
        border: '1px solid #DCFCE7',
        borderRadius: '20px',
        padding: '1.25rem',
        marginBottom: '1rem',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 120,
      }}>
        {/* Text */}
        <p style={{
          fontSize: '0.88rem',
          fontWeight: 700,
          color: '#0F172A',
          lineHeight: 1.45,
          margin: '0 0 0.9rem',
          maxWidth: '62%',
          position: 'relative',
          zIndex: 2,
        }}>
          Agissons ensemble pour un numérique durable
        </p>
        <Link to="/sensitization" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '0.45rem 1rem',
          borderRadius: '9999px',
          background: '#16A34A',
          color: '#FFFFFF',
          fontSize: '0.78rem',
          fontWeight: 700,
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          zIndex: 2,
          textDecoration: 'none',
        }}>
          En savoir plus <ArrowRight size={13} />
        </Link>

        {/* Plant illustration — bottom right */}
        <img
          src="https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?auto=format&fit=crop&w=200&q=80"
          alt="Plante"
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 75,
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            borderRadius: '0 20px 20px 0',
          }}
        />
        {/* soft gradient to hide the image edge */}
        <div style={{
          position: 'absolute',
          top: 0, bottom: 0,
          right: 55,
          width: 30,
          background: 'linear-gradient(to right, #F0FDF4, transparent)',
          zIndex: 1,
          pointerEvents: 'none',
        }} />
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.65rem',
          width: '100%',
          padding: '0.75rem 1rem',
          borderRadius: '16px',
          fontSize: '0.88rem',
          fontWeight: 700,
          color: '#EF4444',
          background: '#FEF2F2',
          border: '1px solid #FEE2E2',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#FEE2E2';
          e.currentTarget.style.color = '#DC2626';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#FEF2F2';
          e.currentTarget.style.color = '#EF4444';
        }}
      >
        <LogOut size={18} color="currentColor" />
        <span>Déconnexion</span>
      </button>

    </motion.aside>
  );
};

export default Sidebar;
