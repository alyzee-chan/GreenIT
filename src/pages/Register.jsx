import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, UserPlus } from 'lucide-react';
import { useAuth } from '../store/auth';

const ROLES = [
  { value: 'PRO_IT', label: 'Professionnel IT' },
  { value: 'DECIDEUR_PUBLIC', label: 'Decideur public' },
  { value: 'CHERCHEUR_ONG', label: 'Chercheur / ONG' },
  { value: 'ENTREPRENEUR', label: 'Entrepreneur africain' },
  { value: 'GRAND_PUBLIC', label: 'Grand public' },
  { value: 'INVESTISSEUR_ESG', label: 'Investisseur ESG' },
];

const Register = () => {
  const register = useAuth((s) => s.register);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', role: 'PRO_IT', organization: '', country: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Inscription impossible (le backend est-il demarre ?).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--primary) 14%, var(--background)), var(--background) 60%)' }}>
      <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <Leaf color="var(--primary)" size={28} />
          <h1 style={{ fontSize: '1.5rem' }}>GreenIT</h1>
        </div>
        <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Creer un compte</h2>
        <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          <label style={labelStyle}>Nom complet
            <input value={form.fullName} onChange={update('fullName')} required style={inputStyle} />
          </label>
          <label style={labelStyle}>Profil
            <select value={form.role} onChange={update('role')} style={inputStyle}>
              {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </label>
          <label style={labelStyle}>Email
            <input type="email" value={form.email} onChange={update('email')} required style={inputStyle} />
          </label>
          <label style={labelStyle}>Mot de passe
            <input type="password" value={form.password} onChange={update('password')} required minLength={6} style={inputStyle} />
          </label>
          <label style={labelStyle}>Organisation
            <input value={form.organization} onChange={update('organization')} style={inputStyle} />
          </label>
          <label style={labelStyle}>Pays
            <input value={form.country} onChange={update('country')} style={inputStyle} />
          </label>
          {error && <div style={{ gridColumn: '1 / -1', color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ gridColumn: '1 / -1' }}>
            <UserPlus size={18} /> {loading ? '...' : "S'inscrire"}
          </button>
        </form>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
          Deja un compte ? <Link to="/login" style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>Connexion</Link>
        </p>
      </motion.div>
    </div>
  );
};

const labelStyle = { fontSize: '0.8rem', fontWeight: 600, display: 'flex', flexDirection: 'column' };
const inputStyle = {
  marginTop: '0.35rem', padding: '0.55rem 0.7rem', borderRadius: 8,
  border: '1px solid var(--border)', fontSize: '0.92rem',
};

export default Register;
