import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Award, Heart, Send } from 'lucide-react';
import client, { getWithFallback } from '../api/client';
import { FB_POSTS, FB_RESOURCES, FB_BADGES } from '../api/fallback';
import DataSourceBadge from '../components/DataSourceBadge';
import { useAuth } from '../store/auth';

const tierColor = { Bronze: '#B45309', Argent: '#64748B', Or: '#CA8A04' };

const Community = () => {
  const user = useAuth((s) => s.user);
  const [posts, setPosts] = useState(FB_POSTS);
  const [resources, setResources] = useState(FB_RESOURCES);
  const [badges, setBadges] = useState(FB_BADGES);
  const [live, setLive] = useState(false);
  const [draft, setDraft] = useState({ title: '', content: '', region: 'Mondial' });

  useEffect(() => {
    (async () => {
      const [p, r, b] = await Promise.all([
        getWithFallback('/community/posts', FB_POSTS),
        getWithFallback('/community/resources', FB_RESOURCES),
        getWithFallback('/community/badges', FB_BADGES),
      ]);
      setPosts(p.data); setResources(r.data); setBadges(b.data); setLive(p.live);
    })();
  }, []);

  const publish = async () => {
    if (!draft.title || !draft.content) return;
    const payload = { ...draft, authorName: user?.fullName || 'Invite' };
    try {
      const res = await client.post('/community/posts', payload);
      setPosts([res.data, ...posts]);
    } catch {
      setPosts([{ id: Date.now(), ...payload, likes: 0, createdAt: new Date().toISOString() }, ...posts]);
    }
    setDraft({ title: '', content: '', region: 'Mondial' });
  };

  const like = (id) => setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)));

  return (
    <motion.div className="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users color="var(--primary)" /> Communaute & Sensibilisation
          </h1>
          <p className="page-subtitle">Forum, bibliotheque de ressources et gamification.</p>
        </div>
        <DataSourceBadge live={live} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '2rem' }} className="builder-grid">
        <div>
          <motion.div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 className="chart-title">Partager une bonne pratique</h3>
            <input placeholder="Titre" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} style={{ ...inp, marginBottom: '0.6rem', width: '100%' }} />
            <textarea placeholder="Votre retour d'experience..." value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} rows={3} style={{ ...inp, width: '100%', resize: 'vertical' }} />
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.6rem', alignItems: 'center' }}>
              <select value={draft.region} onChange={(e) => setDraft({ ...draft, region: e.target.value })} style={inp}>
                <option>Mondial</option><option>Afrique de l'Ouest</option><option>Afrique Centrale</option><option>Afrique de l'Est</option>
              </select>
              <button className="btn btn-primary" onClick={publish}><Send size={16} /> Publier</button>
            </div>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {posts.map((p) => (
              <motion.div key={p.id} className="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{p.title}</strong>
                  <span style={{ fontSize: '0.72rem', background: '#ECFDF5', color: 'var(--primary-dark)', padding: '0.15rem 0.5rem', borderRadius: 999 }}>{p.region}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>{p.content}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>par {p.authorName}</span>
                  <button onClick={() => like(p.id)} className="btn btn-outline" style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem' }}>
                    <Heart size={14} color="var(--danger)" /> {p.likes}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <motion.div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><BookOpen size={18} color="var(--secondary)" /> Ressources</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {resources.map((r, i) => (
                <div key={i} style={{ padding: '0.6rem', borderRadius: 8, background: 'var(--surface-2)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--secondary-dark)', fontWeight: 600 }}>{r.type}</div>
                  <div style={{ fontSize: '0.88rem' }}>{r.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.source}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="card">
            <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Award size={18} color="var(--warning)" /> Badges</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {badges.map((b) => (
                <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem', borderRadius: 8, background: 'var(--surface-2)' }}>
                  <Award size={20} color={tierColor[b.tier]} />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{b.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.criteria}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const inp = { padding: '0.5rem 0.7rem', borderRadius: 8, border: '1px solid var(--border)', fontSize: '0.92rem' };

export default Community;
