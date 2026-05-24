import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Globe2, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { getWithFallback } from '../api/client';

// Countries available (ISO3 codes understood by the World Bank API).
const COUNTRIES = [
  { iso: 'COD', label: 'RD Congo' },
  { iso: 'ZAF', label: 'Afrique du Sud' },
  { iso: 'ZWE', label: 'Zimbabwe' },
  { iso: 'NGA', label: 'Nigeria' },
  { iso: 'MLI', label: 'Mali' },
  { iso: 'RWA', label: 'Rwanda' },
  { iso: 'WLD', label: 'Monde' },
  { iso: 'CHN', label: 'Chine' },
  { iso: 'USA', label: 'Etats-Unis' },
  { iso: 'FRA', label: 'France' },
];

// Local fallback if even the backend is unreachable.
const FB = {
  country: 'COD', source: 'fallback (local)', unit: 't CO2e / habitant',
  series: [
    { year: '2018', value: 0.03 }, { year: '2019', value: 0.03 }, { year: '2020', value: 0.04 },
    { year: '2021', value: 0.047 }, { year: '2022', value: 0.061 }, { year: '2023', value: 0.058 },
  ],
};

const WorldBankCO2 = () => {
  const [iso, setIso] = useState('COD');
  const [data, setData] = useState(FB);
  const [reachable, setReachable] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = async (code) => {
    setLoading(true);
    const res = await getWithFallback(`/dashboard/external/co2?iso=${code}`, { ...FB, country: code });
    setData(res.data || FB);
    setReachable(res.live);
    setLoading(false);
  };

  useEffect(() => { load(iso); /* eslint-disable-next-line */ }, [iso]);

  // Determine the true freshness: backend reachable AND it used the real source.
  const isWorldBank = reachable && typeof data.source === 'string' && data.source.toLowerCase().includes('world bank');
  const series = (data.series || []).map((p) => ({ year: String(p.year), value: Number(p.value) }));

  return (
    <motion.div className="card" style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem' }}>
          <Globe2 size={18} color="var(--primary)" /> CO&#8322; par habitant &mdash; donnees temps reel
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <select value={iso} onChange={(e) => setIso(e.target.value)}
            style={{ padding: '0.4rem 0.6rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '0.85rem' }}>
            {COUNTRIES.map((c) => <option key={c.iso} value={c.iso}>{c.label}</option>)}
          </select>
          <button onClick={() => load(iso)} title="Rafraichir"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.4rem 0.6rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>
            <motion.span style={{ display: 'inline-flex' }} animate={loading ? { rotate: 360 } : { rotate: 0 }}
              transition={loading ? { repeat: Infinity, duration: 0.8, ease: 'linear' } : { duration: 0 }}>
              <RefreshCw size={14} />
            </motion.span>
          </button>
          <span title={isWorldBank ? 'Source live : World Bank Open Data' : 'Repli : source externe indisponible'}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', fontWeight: 600,
              padding: '0.25rem 0.6rem', borderRadius: 999,
              background: isWorldBank ? '#D1FAE5' : '#FEF3C7', color: isWorldBank ? '#047857' : '#B45309',
              border: `1px solid ${isWorldBank ? '#A7F3D0' : '#FDE68A'}`,
            }}>
            {isWorldBank ? <Wifi size={13} /> : <WifiOff size={13} />}
            {isWorldBank ? 'Live · World Bank' : 'Repli (source indisponible)'}
          </span>
        </div>
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-0.5rem', marginBottom: '1rem' }}>
        Indicateur <code>EN.GHG.CO2.PC.CE.AR5</code> ({data.unit || 't CO2e / habitant'}) &mdash; source API World Bank Open Data (sans cle), avec repli automatique.
      </p>

      <div style={{ height: 280 }}>
        <ResponsiveContainer>
          <AreaChart data={series} margin={{ top: 10, right: 10, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="wbco2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
            <Tooltip
              contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, fontSize: '0.8rem' }}
              formatter={(v) => [`${v} t CO2e/hab`, data.country]}
            />
            <Area type="monotone" dataKey="value" name={data.country} stroke="#10B981" strokeWidth={3} fill="url(#wbco2)" dot={{ r: 3 }} activeDot={{ r: 6 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default WorldBankCO2;
