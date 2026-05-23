import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Zap, Server, Leaf, Globe2 } from 'lucide-react';
import { getWithFallback } from '../api/client';
import {
  FB_KPIS, FB_DATACENTERS, FB_HYPERSCALERS, FB_ENERGY_TS,
} from '../api/fallback';
import DataSourceBadge from '../components/DataSourceBadge';
import MapView from '../components/MapView';

const pueColor = (pue) => (pue <= 1.2 ? '#10B981' : pue <= 1.5 ? '#F59E0B' : '#EF4444');

const Energy = () => {
  const [kpis, setKpis] = useState(FB_KPIS);
  const [dcs, setDcs] = useState(FB_DATACENTERS);
  const [hyper, setHyper] = useState(FB_HYPERSCALERS);
  const [ts, setTs] = useState(FB_ENERGY_TS);
  const [live, setLive] = useState(false);

  useEffect(() => {
    (async () => {
      const [k, d, h, t] = await Promise.all([
        getWithFallback('/dashboard/kpis', FB_KPIS),
        getWithFallback('/dashboard/datacenters', FB_DATACENTERS),
        getWithFallback('/dashboard/hyperscalers', FB_HYPERSCALERS),
        getWithFallback('/dashboard/energy/timeseries', FB_ENERGY_TS),
      ]);
      setKpis(k.data); setDcs(d.data); setHyper(h.data); setTs(t.data);
      setLive(k.live && d.live);
    })();
  }, []);

  const points = dcs.map((d) => ({
    latitude: d.latitude,
    longitude: d.longitude,
    label: `${d.name} (${d.hyperscaler})`,
    detail: `PUE ${d.pue} - ${Math.round(d.energyMwh / 1000)} GWh/an - ${d.renewableSharePct}% renouvelable`,
    color: pueColor(d.pue),
    radius: Math.max(6, Math.min(20, d.energyMwh / 150000)),
  }));

  return (
    <motion.div className="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap color="var(--primary)" /> Energie & Datacenters
          </h1>
          <p className="page-subtitle">Consommation, PUE et mix energetique des datacenters mondiaux (focus Afrique).</p>
        </div>
        <DataSourceBadge live={live} />
      </div>

      <div className="grid-cards">
        <Stat title="Datacenters suivis" value={kpis.totalDataCenters} sub={`${kpis.africaDataCenters} en Afrique`} icon={Server} />
        <Stat title="Energie totale" value={`${Math.round(kpis.totalEnergyMwh / 1000).toLocaleString()} GWh`} sub="Consommation annuelle cumulee" icon={Zap} />
        <Stat title="PUE moyen" value={kpis.averagePue} sub="Efficacite energetique (1 = ideal)" icon={Globe2} />
        <Stat title="Part renouvelable" value={`${kpis.averageRenewablePct}%`} sub="Mix energetique moyen" icon={Leaf} positive />
      </div>

      <motion.div className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="chart-title">Carte mondiale des datacenters</h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '-1rem', marginBottom: '1rem' }}>
          Taille = energie consommee &middot; Couleur = PUE (vert &le; 1.2, orange &le; 1.5, rouge &gt; 1.5)
        </p>
        <MapView points={points} center={[20, 10]} zoom={2} height={440} />
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(380px,1fr))', gap: '2rem' }}>
        <motion.div className="card">
          <h3 className="chart-title">Comparatif par hyperscaler</h3>
          <div style={{ height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={hyper} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="hyperscaler" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-muted)' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="energyMwh" name="Energie (MWh)" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
                <Bar dataKey="co2Tons" name="CO2 (t)" fill="#EF4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div className="card">
          <h3 className="chart-title">Demande electrique des datacenters (TWh)</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-1rem', marginBottom: '1rem' }}>Source : IEA - projection 2022-2030</p>
          <div style={{ height: 320 }}>
            <ResponsiveContainer>
              <AreaChart data={ts} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gAi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} /><stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gStd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.4} /><stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fill: 'var(--text-muted)' }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="standardTwh" name="Cloud standard" stroke="#0EA5E9" fill="url(#gStd)" strokeWidth={3} />
                <Area type="monotone" dataKey="aiTwh" name="Charge IA" stroke="#EF4444" fill="url(#gAi)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Stat = ({ title, value, sub, icon: Icon, positive }) => (
  <motion.div className="card stat-card" whileHover={{ y: -4 }} style={{ borderTop: `4px solid ${positive ? 'var(--primary)' : 'var(--secondary)'}` }}>
    <div className="stat-header">
      <h3 className="stat-title">{title}</h3>
      <div style={{ padding: 8, background: positive ? '#D1FAE5' : '#E0F2FE', borderRadius: 10 }}>
        <Icon size={20} color={positive ? 'var(--primary)' : 'var(--secondary)'} />
      </div>
    </div>
    <div className="stat-value">{value}</div>
    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sub}</div>
  </motion.div>
);

export default Energy;
