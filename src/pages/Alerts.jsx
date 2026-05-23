import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Play, CheckCircle2, ChevronDown } from 'lucide-react';
import client, { getWithFallback } from '../api/client';
import { fbPredictMinerals } from '../api/fallback';

const LEVELS = [
  { key: 'FAIBLE', color: '#22C55E', label: 'Faible (<30%)' },
  { key: 'MOYEN', color: '#F59E0B', label: 'Moyen (30-70%)' },
  { key: 'CRITIQUE', color: '#EF4444', label: 'Critique (>70%)' },
  { key: 'CATASTROPHIQUE', color: '#991B1B', label: 'Catastrophique (>90%)' },
];
const colorOf = (lvl) => LEVELS.find((l) => l.key === lvl)?.color || '#64748B';

// Client-side rule engine mirroring AlertService (demo fallback)
function fbGenerate(scenario, region) {
  return fbPredictMinerals(scenario)
    .filter((m) => m.riskScore >= 30)
    .map((m, i) => ({
      id: 1000 + i,
      level: m.alertLevel,
      category: 'MINERAI',
      targetEntity: m.mineral,
      riskScore: m.riskScore,
      message: `Risque d'epuisement ${m.alertLevel} pour le ${m.mineral} (epuisement prevu ${m.predictedExhaustionYear}).`,
      triggeredAt: new Date().toISOString(),
      readAt: null,
      _recommendation: recoText(m.mineral, m.alertLevel, region),
    }));
}

function recoText(mineral, level, region) {
  const base = {
    Cobalt: 'Privilegier les batteries LFP (sans cobalt) et renforcer le recyclage des accumulateurs.',
    Lithium: 'Allonger la duree de vie des equipements et investir dans le recyclage du lithium.',
    'Coltan (Tantale)': "Tracer l'origine du tantale (norme 3TG) et favoriser des condensateurs alternatifs.",
    Neodyme: 'Reduire la dependance aux aimants permanents et recycler les terres rares.',
  }[mineral] || "Optimiser l'efficacite materielle et prioriser l'eco-conception.";
  const ctx = region && region.toLowerCase().includes('afrique')
    ? ' Contexte Afrique : renforcer la valeur ajoutee locale et les conditions ESG.' : '';
  return `[${level}] ${base}${ctx}`;
}

const Alerts = () => {
  const [scenario, setScenario] = useState('boom_ia');
  const [region, setRegion] = useState('Mondial');
  const [alerts, setAlerts] = useState([]);
  const [recos, setRecos] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [live, setLive] = useState(false);

  const load = async () => {
    const fb = fbGenerate(scenario, region);
    const res = await getWithFallback('/alerts', fb);
    setAlerts(res.data);
    setLive(res.live);
    if (!res.live) {
      const map = {};
      fb.forEach((a) => { map[a.id] = [{ content: a._recommendation, urgency: a.level }]; });
      setRecos(map);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const generate = async () => {
    try {
      await client.post(`/alerts/generate?scenario=${scenario}&region=${encodeURIComponent(region)}`);
      await load();
      setLive(true);
    } catch {
      const fb = fbGenerate(scenario, region);
      setAlerts(fb);
      const map = {};
      fb.forEach((a) => { map[a.id] = [{ content: a._recommendation, urgency: a.level }]; });
      setRecos(map);
      setLive(false);
    }
  };

  const markRead = async (id) => {
    try { await client.put(`/alerts/${id}/read`); } catch { /* demo */ }
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, readAt: new Date().toISOString() } : a)));
  };

  const toggleReco = async (id) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    if (!recos[id]) {
      const res = await getWithFallback(`/alerts/${id}/recommendations`, []);
      setRecos((prev) => ({ ...prev, [id]: res.data }));
    }
  };

  return (
    <motion.div className="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell color="var(--primary)" /> Alertes & Recommandations
        </h1>
        <p className="page-subtitle">Quatre niveaux de risque (section 3.3.1) et recommandations contextualisees.</p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={scenario} onChange={(e) => setScenario(e.target.value)} style={selStyle}>
          <option value="normal">Scenario : Normal</option>
          <option value="boom_ia">Scenario : Boom IA</option>
          <option value="ev">Scenario : Vehicules elec.</option>
          <option value="sobriete">Scenario : Sobriete</option>
        </select>
        <select value={region} onChange={(e) => setRegion(e.target.value)} style={selStyle}>
          <option>Mondial</option>
          <option>Afrique</option>
          <option>Europe</option>
        </select>
        <button className="btn btn-primary" onClick={generate}><Play size={16} /> Generer les alertes</button>
        <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto', flexWrap: 'wrap' }}>
          {LEVELS.map((l) => (
            <span key={l.key} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.color }} /> {l.label}
            </span>
          ))}
        </div>
      </div>

      {alerts.length === 0 && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          Aucune alerte. Cliquez sur "Generer les alertes".
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {alerts.map((a) => (
          <motion.div key={a.id} className="card" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            style={{ borderLeft: `6px solid ${colorOf(a.level)}`, opacity: a.readAt ? 0.65 : 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, color: colorOf(a.level) }}>{a.level}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.category} &middot; {a.targetEntity}</span>
                </div>
                <p style={{ marginTop: 4 }}>{a.message}</p>
              </div>
              <div style={{ textAlign: 'right', minWidth: 90 }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: colorOf(a.level) }}>{Math.round(a.riskScore)}%</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>risque</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
              <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={() => toggleReco(a.id)}>
                <ChevronDown size={14} /> Recommandation
              </button>
              {!a.readAt && (
                <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={() => markRead(a.id)}>
                  <CheckCircle2 size={14} /> Marquer lu
                </button>
              )}
            </div>
            {expanded === a.id && (
              <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#ECFDF5', borderRadius: 10, fontSize: '0.88rem' }}>
                {(recos[a.id] || []).length
                  ? recos[a.id].map((r, i) => <div key={i}>{r.content}</div>)
                  : 'Aucune recommandation associee.'}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const selStyle = { padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid var(--border)', fontSize: '0.9rem' };

export default Alerts;
