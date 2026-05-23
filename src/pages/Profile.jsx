import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Building2, Globe, Shield } from 'lucide-react';
import { useAuth } from '../store/auth';

const ROLE_LABELS = {
  PRO_IT: 'Professionnel IT',
  DECIDEUR_PUBLIC: 'Decideur public',
  CHERCHEUR_ONG: 'Chercheur / ONG',
  ENTREPRENEUR: 'Entrepreneur africain',
  GRAND_PUBLIC: 'Grand public',
  INVESTISSEUR_ESG: 'Investisseur ESG',
  ADMIN: 'Administrateur',
};

const Profile = () => {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const navigate = useNavigate();

  const doLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <motion.div className="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header">
        <h1 className="page-title">Mon profil</h1>
        <p className="page-subtitle">Informations de compte et preferences.</p>
      </div>

      <motion.div className="card" style={{ maxWidth: 560 }} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={30} color="var(--primary-dark)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem' }}>{user?.fullName || 'Utilisateur'}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '0.9rem' }}>
          <Row icon={Shield} label="Profil" value={ROLE_LABELS[user?.role] || user?.role} />
          <Row icon={Building2} label="Organisation" value={user?.organization || '-'} />
          <Row icon={Globe} label="Pays" value={user?.country || '-'} />
        </div>

        <button className="btn btn-outline" onClick={doLogout} style={{ marginTop: '1.75rem', color: 'var(--danger)' }}>
          <LogOut size={18} /> Se deconnecter
        </button>
      </motion.div>
    </motion.div>
  );
};

const Row = ({ icon: Icon, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
    <Icon size={18} color="var(--text-muted)" />
    <span style={{ color: 'var(--text-muted)', minWidth: 120 }}>{label}</span>
    <strong>{value}</strong>
  </div>
);

export default Profile;
