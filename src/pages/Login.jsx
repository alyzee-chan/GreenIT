import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, LogIn } from 'lucide-react';
import { useAuth } from '../store/auth';

const Login = () => {
  const login = useAuth((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('demo@greenit.org');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Connexion impossible. Verifiez vos identifiants (ou que le backend est demarre).",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--primary) 14%, var(--background)), var(--background) 60%)' }}>
      <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <Leaf color="var(--primary)" size={28} />
          <h1 style={{ fontSize: '1.5rem' }}>GreenIT</h1>
        </div>
        <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Connexion</h2>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
          </label>
          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            Mot de passe
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
          </label>
          {error && <div style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            <LogIn size={18} /> {loading ? '...' : 'Se connecter'}
          </button>
        </form>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
          Pas de compte ? <Link to="/register" style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>Inscription</Link>
        </p>
        <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--surface-2)', padding: '0.75rem', borderRadius: 8 }}>
          Comptes de demo : <strong>admin@greenit.org / admin123</strong> &middot; <strong>demo@greenit.org / demo123</strong>
        </div>
      </motion.div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  marginTop: '0.35rem',
  padding: '0.6rem 0.75rem',
  borderRadius: 8,
  border: '1px solid var(--border)',
  fontSize: '0.95rem',
};

export default Login;
