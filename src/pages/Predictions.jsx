import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Brain, TrendingDown, AlertTriangle } from 'lucide-react';
import { getWithFallback } from '../api/client';
import { fbPredictMinerals, FB_SECTORS } from '../api/fallback';
import DataSourceBadge from '../components/DataSourceBadge';

const SCENARIOS = [
  { value: 'normal', label: 'Normal' },
  { value: 'boom_ia', label: 'Boom IA' },
  { value: 'ev', label: 'Vehicules elec.' },
  { value: 'sobriete', label: 'Sobriete' },
];

const levelColor = { FAIBLE: '#22C55E', MOYEN: '#F59E0B', CRITIQUE: '#EF4444', CATASTROPHIQUE: '#991B1B' };

const Predictions = () => {
  const [scenario, setScenario] = useState('normal');
  const [minerals, setMinerals] = useState(fbPredictMinerals('normal'));
  const [emissions, setEmissions] = useState(null);
  const [sectors, setSectors] = useState([]);
  const [live, setLive] = useState(false);

  useEffect(() => {
    (async () => {
      const fbEmissions = buildFbEmissions(scenario);
      const fbSectors = buildFbSectors(scenario);
      const [m, e, s] = await Promise.all([
        getWithFallback(`/predict/minerals?scenario=${scenario}`, fbPredictMinerals(scenario)),
        getWithFallback(`/predict/emissions?scenario=${scenario}`, fbEmissions),
        getWithFallback(`/predict/sectors?scenario=${scenario}`, fbSectors),
      ]);
      setMinerals(m.data); setEmissions(e.data); setSectors(s.data);
      setLive(m.live);
    })();
  }, [scenario]);

  return (
    <motion.div className="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Brain color="var(--primary)" /> Predictions IA
          </h1>
          <p className="page-subtitle">Projections statistiques d'epuisement des minerais et d'emissions selon le scenario.</p>
        </div>
        <DataSourceBadge live={live} />
      </div>

      <div className="card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <strong style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Scenario</strong>
        {SCENARIOS.map((s) => (
          <button key={s.value} onClick={() => setScenario(s.value)}
            className={`btn ${scenario === s.value ? 'btn-primary' : 'btn-outline'}`}>
            {s.label}
          </button>
        ))}
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
          Modeles statistiques (non entraines) - intervalles de confiance indicatifs.
        </span>
      </div>

      <motion.div className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="chart-title">Annee d'epuisement predite par minerai</h3>
        <div style={{ height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={minerals} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="mineral" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis domain={[2026, 2080]} tick={{ fill: 'var(--text-muted)' }} />
              <Tooltip />
              <Bar dataKey="predictedExhaustionYear" name="Epuisement predit" radius={[6, 6, 0, 0]}>
                {minerals.map((m, i) => <Cell key={i} fill={levelColor[m.alertLevel] || '#0EA5E9'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '0.75rem', marginTop: '1rem' }}>
          {minerals.map((m) => (
            <div key={m.mineral} style={{ padding: '0.75rem', borderRadius: 10, background: 'var(--surface-2)', borderLeft: `4px solid ${levelColor[m.alertLevel]}` }}>
              <strong>{m.mineral}</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {m.predictedExhaustionYear} ({m.yearsRemaining} ans) - risque {m.riskScore}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>IC: {m.confidenceLow}-{m.confidenceHigh}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(380px,1fr))', gap: '2rem' }}>
        <motion.div className="card">
          <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <TrendingDown size={18} color="var(--danger)" /> Emissions CO2 projetees (Gt CO2eq)
          </h3>
          <div style={{ height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={emissions?.horizons || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fill: 'var(--text-muted)' }} />
                <Tooltip />
                <Line type="monotone" dataKey="projectedGtCo2eq" name="Gt CO2eq" stroke="#EF4444" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div className="card">
          <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertTriangle size={18} color="var(--warning)" /> Tension d'approvisionnement par secteur
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
            {sectors.map((s) => (
              <div key={s.sector}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                  <span>{s.sector}</span><strong>{s.supplyTensionScore}%</strong>
                </div>
                <div style={{ height: 8, background: '#E2E8F0', borderRadius: 999 }}>
                  <div style={{ height: '100%', width: `${s.supplyTensionScore}%`, background: levelColor[s.alertLevel] || '#0EA5E9', borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Local fallback projections (mirror backend PredictionService)
function buildFbEmissions(scenario) {
  const factor = { boom_ia: 2.2, ev: 1.6, sobriete: 0.7 }[scenario] ?? 1.0;
  const base = 1.7;
  return {
    scenario, baseGtCo2eq: base,
    horizons: [5, 10, 20].map((h) => {
      const projected = base * Math.pow(1 + 0.04 * factor, h);
      const risk = Math.min(100, (projected / base - 1) * 100);
      return {
        horizonYears: h, year: 2026 + h,
        projectedGtCo2eq: Math.round(projected * 100) / 100,
        riskScore: Math.round(risk),
        alertLevel: risk >= 90 ? 'CATASTROPHIQUE' : risk >= 70 ? 'CRITIQUE' : risk >= 30 ? 'MOYEN' : 'FAIBLE',
      };
    }),
  };
}

function buildFbSectors(scenario) {
  const factor = { boom_ia: 2.2, ev: 1.6, sobriete: 0.7 }[scenario] ?? 1.0;
  return FB_SECTORS.map((s) => {
    const pressure = Math.min(100, Math.round(s.criticalityScore * (0.6 + 0.4 * factor)));
    return {
      sector: s.name, criticalityScore: s.criticalityScore, growthRatePct: s.growthRatePct,
      mineralDependencies: s.mineralDependencies, supplyTensionScore: pressure,
      alertLevel: pressure >= 90 ? 'CATASTROPHIQUE' : pressure >= 70 ? 'CRITIQUE' : pressure >= 30 ? 'MOYEN' : 'FAIBLE',
    };
  }).sort((a, b) => b.supplyTensionScore - a.supplyTensionScore);
}

export default Predictions;
