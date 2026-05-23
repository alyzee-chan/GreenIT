import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import {
  ShieldCheck, Users, Database, Bell, Trash2, Search, Play, Server, Gem, UserCog, Activity,
} from 'lucide-react';
import client, { getWithFallback } from '../api/client';
import StatCard from '../components/StatCard';
import DataSourceBadge from '../components/DataSourceBadge';

const ROLES = ['PRO_IT', 'DECIDEUR_PUBLIC', 'CHERCHEUR_ONG', 'ENTREPRENEUR', 'GRAND_PUBLIC', 'INVESTISSEUR_ESG', 'ADMIN'];
const ROLE_LABEL = {
  PRO_IT: 'Pro IT', DECIDEUR_PUBLIC: 'Decideur', CHERCHEUR_ONG: 'Chercheur/ONG',
  ENTREPRENEUR: 'Entrepreneur', GRAND_PUBLIC: 'Grand public', INVESTISSEUR_ESG: 'Investisseur ESG', ADMIN: 'Admin',
};
const ROLE_COLOR = {
  PRO_IT: '#10B981', DECIDEUR_PUBLIC: '#0EA5E9', CHERCHEUR_ONG: '#8B5CF6',
  ENTREPRENEUR: '#F59E0B', GRAND_PUBLIC: '#64748B', INVESTISSEUR_ESG: '#EC4899', ADMIN: '#EF4444',
};

const FB_USERS = [
  { id: 1, email: 'admin@greenit.org', fullName: 'Administrateur GreenIT', role: 'ADMIN', organization: 'GreenIT', country: 'Maroc' },
  { id: 2, email: 'demo@greenit.org', fullName: 'Utilisateur Demo', role: 'PRO_IT', organization: 'Demo Corp', country: 'Senegal' },
];
const FB_STATS = { users: 2, dataCenters: 11, minerals: 6, alerts: 0 };

const Admin = () => {
  const [users, setUsers] = useState(FB_USERS);
  const [stats, setStats] = useState(FB_STATS);
  const [live, setLive] = useState(false);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [toast, setToast] = useState('');
  const [genBusy, setGenBusy] = useState(false);

  const load = async () => {
    const [u, s] = await Promise.all([
      getWithFallback('/admin/users', FB_USERS),
      getWithFallback('/admin/stats', FB_STATS),
    ]);
    setUsers(u.data); setStats(s.data); setLive(u.live);
  };
  useEffect(() => { load(); }, []);

  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  const changeRole = async (id, role) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    try { await client.put(`/admin/users/${id}/role?role=${role}`); flash('Role mis a jour'); }
    catch { flash('Mode demo : modification locale uniquement'); }
  };

  const remove = async (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    try { await client.delete(`/admin/users/${id}`); flash('Utilisateur supprime'); } catch { /* demo */ }
  };

  const generateAlerts = async () => {
    setGenBusy(true);
    try { const r = await client.post('/alerts/generate?scenario=boom_ia&region=Afrique'); flash(`${r.data.length} alertes generees`); await load(); }
    catch { flash('Mode demo : demarrez le backend pour generer des alertes'); }
    finally { setGenBusy(false); }
  };

  const roleDistribution = useMemo(() => {
    const counts = {};
    users.forEach((u) => { counts[u.role] = (counts[u.role] || 0) + 1; });
    return Object.entries(counts).map(([role, value]) => ({ role, label: ROLE_LABEL[role] || role, value, color: ROLE_COLOR[role] }));
  }, [users]);

  const filtered = users.filter((u) => {
    const q = query.toLowerCase();
    const matchQ = !q || u.email.toLowerCase().includes(q) || (u.fullName || '').toLowerCase().includes(q);
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchQ && matchRole;
  });

  return (
    <motion.div className="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '1.5rem', border: 'none', background: 'linear-gradient(120deg,#1E293B,#0F172A)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -30, top: -30, opacity: 0.1 }}><ShieldCheck size={180} /></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ background: 'rgba(255,255,255,0.15)', padding: '0.25rem 0.7rem', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700 }}>CONSOLE ADMINISTRATEUR</span>
            <h1 style={{ fontSize: '1.9rem', margin: '0.7rem 0 0.3rem' }}>Administration de la plateforme</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)' }}>Gestion des utilisateurs, supervision des donnees et declenchement des alertes.</p>
          </div>
          <DataSourceBadge live={live} />
        </div>
      </motion.div>

      {toast && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="card"
          style={{ marginBottom: '1rem', padding: '0.75rem 1rem', borderLeft: '4px solid var(--primary)', fontSize: '0.88rem' }}>
          {toast}
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid-cards">
        <StatCard title="Utilisateurs" value={stats.users} icon={Users} color="#10B981" delay={0} />
        <StatCard title="Datacenters" value={stats.dataCenters} icon={Server} color="#0EA5E9" delay={0.05} />
        <StatCard title="Minerais" value={stats.minerals} icon={Gem} color="#8B5CF6" delay={0.1} />
        <StatCard title="Alertes" value={stats.alerts} icon={Bell} color="#EF4444" delay={0.15} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem' }} className="builder-grid">
        {/* User management */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><UserCog size={18} color="var(--primary)" /> Gestion des utilisateurs</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
                <input placeholder="Rechercher..." value={query} onChange={(e) => setQuery(e.target.value)}
                  style={{ padding: '0.45rem 0.6rem 0.45rem 1.9rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '0.85rem' }} />
              </div>
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
                style={{ padding: '0.45rem 0.6rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '0.85rem' }}>
                <option value="">Tous les roles</option>
                {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                  <th style={th}>Utilisateur</th><th style={th}>Role</th><th style={th}>Pays</th><th style={th}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${ROLE_COLOR[u.role]}22`, color: ROLE_COLOR[u.role], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                          {(u.fullName || u.email).slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{u.fullName}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={td}>
                      <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)}
                        style={{ padding: '0.3rem 0.4rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)' }}>
                        {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                      </select>
                    </td>
                    <td style={td}>{u.country || '-'}</td>
                    <td style={td}>
                      <button className="btn btn-outline" style={{ padding: '0.3rem 0.55rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => remove(u.id)} title="Supprimer">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={4} style={{ ...td, textAlign: 'center', color: 'var(--text-muted)' }}>Aucun utilisateur.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Right column: role chart + actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}><Activity size={18} color="var(--secondary)" /> Repartition par role</h3>
            <div style={{ height: 220 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={roleDistribution} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {roleDistribution.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}><Bell size={18} color="var(--warning)" /> Configuration des alertes</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Declenche le moteur de regles (scenario Boom IA, focus Afrique) et cree les alertes + recommandations.
            </p>
            <button className="btn btn-primary" onClick={generateAlerts} disabled={genBusy} style={{ width: '100%' }}>
              <Play size={16} /> {genBusy ? 'Generation...' : 'Generer les alertes'}
            </button>
          </motion.div>

          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}><Database size={18} color="var(--primary)" /> Systeme</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <Row label="API" value={live ? 'Connectee' : 'Hors ligne (demo)'} ok={live} />
              <Row label="Base de donnees" value={live ? 'H2 / PostgreSQL' : 'n/a'} ok={live} />
              <Row label="Documentation" value="/swagger-ui.html" ok />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const Row = ({ label, value, ok }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid var(--border)' }}>
    <span style={{ color: 'var(--text-muted)' }}>{label}</span>
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: ok ? 'var(--success)' : 'var(--warning)' }} /> {value}
    </span>
  </div>
);

const th = { padding: '0.6rem 0.5rem' };
const td = { padding: '0.6rem 0.5rem' };

export default Admin;
