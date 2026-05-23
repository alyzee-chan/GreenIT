import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { BarChart3, Award, Building2 } from 'lucide-react';
import { getWithFallback } from '../api/client';
import { FB_SECTORS, FB_ESG, FB_CERTIFICATIONS } from '../api/fallback';
import DataSourceBadge from '../components/DataSourceBadge';

const Benchmark = () => {
  const [sectors, setSectors] = useState(FB_SECTORS);
  const [esg, setEsg] = useState(FB_ESG);
  const [certs, setCerts] = useState(FB_CERTIFICATIONS);
  const [live, setLive] = useState(false);

  useEffect(() => {
    (async () => {
      const [s, e, c] = await Promise.all([
        getWithFallback('/benchmark/sectors', FB_SECTORS),
        getWithFallback('/benchmark/esg', FB_ESG),
        getWithFallback('/benchmark/certifications', FB_CERTIFICATIONS),
      ]);
      setSectors(s.data); setEsg(e.data); setCerts(c.data); setLive(s.live);
    })();
  }, []);

  const radarData = sectors.map((s) => ({ subject: s.name, criticite: s.criticalityScore, croissance: s.growthRatePct }));

  return (
    <motion.div className="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 color="var(--primary)" /> Benchmark & Standards
          </h1>
          <p className="page-subtitle">Comparaison sectorielle, scorecard ESG numerique et certifications.</p>
        </div>
        <DataSourceBadge live={live} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(360px,1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <motion.div className="card">
          <h3 className="chart-title">Criticite par secteur</h3>
          <div style={{ height: 320 }}>
            <ResponsiveContainer>
              <RadarChart data={radarData} outerRadius="78%">
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar name="Criticite" dataKey="criticite" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.4} />
                <Radar name="Croissance %" dataKey="croissance" stroke="var(--secondary)" fill="var(--secondary)" fillOpacity={0.2} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div className="card">
          <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Building2 size={18} color="var(--secondary)" /> Scorecard ESG par operateur
          </h3>
          <div style={{ height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={esg} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="operator" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="environmental" name="E" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="social" name="S" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="governance" name="G" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div className="card">
        <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Award size={18} color="var(--primary)" /> Certifications environnementales IT
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem' }}>
          {certs.map((c) => (
            <div key={c.name} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 12, textAlign: 'center' }}>
              <Award size={22} color="var(--primary)" />
              <div style={{ fontWeight: 700, marginTop: 6 }}>{c.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.scope}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Benchmark;
