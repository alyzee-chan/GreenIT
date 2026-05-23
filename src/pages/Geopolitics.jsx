import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Landmark, Flag, Swords } from 'lucide-react';
import { getWithFallback } from '../api/client';
import { FB_CONFLICTS, FB_POLICIES, FB_MINERALS } from '../api/fallback';
import DataSourceBadge from '../components/DataSourceBadge';
import MapView from '../components/MapView';

const FB_GEO = FB_MINERALS.map((m) => ({
  mineral: m.name, tensionIndex: m.geopoliticalTensionIndex,
  miningEsgScore: m.miningEsgScore, mainProducers: m.mainProducers, riskLevel: m.riskLevel,
}));

const levelColor = (lvl) => (lvl === 'Eleve' ? '#EF4444' : lvl === 'Modere' ? '#F59E0B' : '#22C55E');

const Geopolitics = () => {
  const [conflicts, setConflicts] = useState(FB_CONFLICTS);
  const [policies, setPolicies] = useState(FB_POLICIES);
  const [geo, setGeo] = useState(FB_GEO);
  const [live, setLive] = useState(false);

  useEffect(() => {
    (async () => {
      const [c, p, g] = await Promise.all([
        getWithFallback('/benchmark/conflicts', FB_CONFLICTS),
        getWithFallback('/benchmark/policies', FB_POLICIES),
        getWithFallback('/minerals/geopolitics', FB_GEO),
      ]);
      setConflicts(c.data); setPolicies(p.data); setGeo(g.data); setLive(c.live);
    })();
  }, []);

  const points = conflicts.map((c) => ({
    latitude: c.latitude, longitude: c.longitude, label: c.zone, detail: c.description,
    color: levelColor(c.level), radius: c.level === 'Eleve' ? 16 : 11,
  }));

  return (
    <motion.div className="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Landmark color="var(--primary)" /> Intelligence geopolitique
          </h1>
          <p className="page-subtitle">Zones de tension, politiques nationales et indices d'approvisionnement.</p>
        </div>
        <DataSourceBadge live={live} />
      </div>

      <motion.div className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Swords size={18} color="var(--danger)" /> Carte des conflits lies a l'extraction
        </h3>
        <MapView points={points} center={[5, 30]} zoom={2} height={400} />
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(360px,1fr))', gap: '2rem' }}>
        <motion.div className="card">
          <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Flag size={18} color="var(--secondary)" /> Politiques nationales de transition
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {policies.map((p) => (
              <div key={p.name} style={{ padding: '0.75rem', borderRadius: 10, background: 'var(--surface-2)', borderLeft: '4px solid var(--secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '0.9rem' }}>{p.name}</strong>
                  <span style={{ fontSize: '0.72rem', background: '#E0F2FE', color: 'var(--secondary-dark)', padding: '0.1rem 0.5rem', borderRadius: 999 }}>{p.region}</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{p.description}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="card">
          <h3 className="chart-title">Indice de tension par minerai</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {geo.map((g) => (
              <div key={g.mineral}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                  <span>{g.mineral} <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({g.mainProducers?.join(', ')})</span></span>
                  <strong>{g.tensionIndex}</strong>
                </div>
                <div style={{ height: 8, background: '#E2E8F0', borderRadius: 999 }}>
                  <div style={{ height: '100%', width: `${g.tensionIndex}%`, background: g.tensionIndex >= 80 ? '#EF4444' : g.tensionIndex >= 50 ? '#F59E0B' : '#22C55E', borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Geopolitics;
