import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Zap, Gem, Brain, Bell, Globe2, BarChart3, Landmark,
  Users, FileDown, ShieldCheck, Cpu, Droplets, BookOpen, Leaf, LogIn, LogOut, User,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../store/auth';
import ThemeToggle from './ThemeToggle';

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, key: 'dashboard' },
  { to: '/energy', icon: Zap, key: 'energy' },
  { to: '/minerals', icon: Gem, key: 'minerals' },
  { to: '/predictions', icon: Brain, key: 'predictions' },
  { to: '/alerts', icon: Bell, key: 'alerts', auth: true },
  { to: '/africa', icon: Globe2, key: 'africa' },
  { to: '/benchmark', icon: BarChart3, key: 'benchmark' },
  { to: '/geopolitics', icon: Landmark, key: 'geopolitics' },
  { to: '/community', icon: Users, key: 'community' },
  { to: '/reports', icon: FileDown, key: 'reports', auth: true },
  { to: '/builder', icon: Cpu, key: 'builder' },
  { to: '/water-usage', icon: Droplets, key: 'water' },
  { to: '/sensitization', icon: BookOpen, key: 'sensitization' },
];

const Sidebar = () => {
  const { t, i18n } = useTranslation();
  const token = useAuth((s) => s.token);
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const navigate = useNavigate();

  const setLang = (lng) => { i18n.changeLanguage(lng); localStorage.setItem('greenit-lang', lng); };

  const doLogout = () => { logout(); navigate('/login'); };

  const navClass = ({ isActive }) => (isActive ? 'nav-item active' : 'nav-item');

  return (
    <motion.aside className="sidebar" initial={{ x: -280 }} animate={{ x: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 20 }} style={{ overflowY: 'auto' }}>
      <div className="sidebar-header">
        <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 5, repeatDelay: 2 }}>
          <Leaf className="sidebar-logo" size={32} />
        </motion.div>
        <span className="sidebar-title">{t('app.title')}</span>
      </div>

      <nav className="nav-list">
        {NAV.filter((n) => !n.auth || token).map((n) => (
          <NavLink key={n.to} to={n.to} className={navClass}>
            <motion.div whileHover={{ scale: 1.2, rotate: 5 }}><n.icon className="nav-icon" /></motion.div>
            <span>{t(`nav.${n.key}`)}</span>
          </NavLink>
        ))}
        {user?.role === 'ADMIN' && (
          <NavLink to="/admin" className={navClass}>
            <motion.div whileHover={{ scale: 1.2, rotate: 5 }}><ShieldCheck className="nav-icon" /></motion.div>
            <span>{t('nav.admin')}</span>
          </NavLink>
        )}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
        {/* Theme + language */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.3rem', flex: 1 }}>
            {['fr', 'en'].map((lng) => (
              <button key={lng} onClick={() => setLang(lng)}
                style={{
                  flex: 1, padding: '0.35rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
                  border: '1px solid var(--border)',
                  background: i18n.language === lng ? 'var(--primary)' : 'transparent',
                  color: i18n.language === lng ? '#fff' : 'var(--text-muted)',
                }}>
                {lng.toUpperCase()}
              </button>
            ))}
          </div>
          <ThemeToggle compact />
        </div>

        {token ? (
          <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={18} color="var(--primary-dark)" />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.fullName}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{user?.role}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <NavLink to="/profile" className="btn btn-outline" style={{ flex: 1, fontSize: '0.75rem', padding: '0.35rem' }}>
                <User size={14} /> {t('nav.profile')}
              </NavLink>
              <button className="btn btn-outline" onClick={doLogout} style={{ flex: 1, fontSize: '0.75rem', padding: '0.35rem', color: 'var(--danger)' }}>
                <LogOut size={14} /> {t('nav.logout')}
              </button>
            </div>
          </div>
        ) : (
          <NavLink to="/login" className="btn btn-primary" style={{ width: '100%' }}>
            <LogIn size={16} /> {t('nav.login')}
          </NavLink>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
