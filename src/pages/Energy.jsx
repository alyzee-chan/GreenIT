import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Zap, Server, Leaf, Globe2, ChevronDown, ArrowRight, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getWithFallback } from '../api/client';
import {
  FB_KPIS, FB_DATACENTERS, FB_HYPERSCALERS, FB_ENERGY_TS,
} from '../api/fallback';
import MapView from '../components/MapView';

/* ── Colour helpers ─────────────────────────── */
const pueColor = (pue) => (pue <= 1.2 ? '#16A34A' : pue <= 1.5 ? '#D97706' : '#DC2626');

/* ── Animation presets ──────────────────────── */
const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

/* ── Luminous Glass Tooltip ──────────────────── */
const GlassTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.96)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid #E2E8F0',
      borderRadius: 16,
      padding: '0.75rem 1rem',
      color: '#0F172A',
      fontSize: '0.82rem',
      boxShadow: '0 12px 32px rgba(0,0,0,0.10)',
      minWidth: 160,
    }}>
      <div style={{ fontWeight: 800, color: '#16A34A', marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
          <span style={{ color: '#475569', fontWeight: 500 }}>
            {p.name}: <strong style={{ color: '#0F172A', fontWeight: 800 }}>{typeof p.value === 'number' ? p.value.toLocaleString('fr-FR') : p.value}</strong>
          </span>
        </div>
      ))}
    </div>
  );
};

/* ── KPI Luminous Card ────────────────────────── */
const GlassStatCard = ({ title, value, sub, icon: Icon }) => (
  <motion.div
    variants={fade}
    whileHover={{ y: -4, scale: 1.015, boxShadow: '0 14px 36px rgba(0,0,0,0.06)' }}
    style={{
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      borderRadius: 24,
      padding: '1.5rem 1.75rem',
      boxShadow: '0 6px 20px rgba(0,0,0,0.03)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      position: 'relative',
      overflow: 'hidden',
      transition: 'box-shadow 0.3s ease',
    }}
  >
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #4ADE80 0%, #16A34A 100%)', borderRadius: '24px 24px 0 0' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#16A34A' }}>{title}</span>
      <div style={{ width: 38, height: 38, borderRadius: 12, background: '#F0FDF4', border: '1px solid #DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={19} color="#16A34A" />
      </div>
    </div>
    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', fontFamily: 'Outfit, sans-serif', lineHeight: 1.1, letterSpacing: '-0.03em' }}>{value}</div>
    {sub && <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 500 }}>{sub}</div>}
    <div style={{ height: 22, marginTop: 4 }}>
      <svg width="100%" height="22" viewBox="0 0 200 22" fill="none" preserveAspectRatio="none">
        <path d="M0 17 C40 21, 60 5, 100 11 C140 17, 160 3, 200 7" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="100" cy="11" r="3" fill="#16A34A" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="200" cy="7" r="3" fill="#22C55E" stroke="#FFFFFF" strokeWidth="1.5" />
      </svg>
    </div>
  </motion.div>
);

/* ── Luminous Glass Panel ─────────────────────── */
const GlassPanel = ({ children, style = {} }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.88)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(226, 232, 240, 0.9)',
    borderRadius: 28,
    boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
    ...style,
  }}>
    {children}
  </div>
);

/* ── Region Dropdown ─────────────────────────── */
const REGIONS = [
  { label: 'Afrique', icon: '🌍', badge: 'Focus' },
  { label: 'Europe', icon: '🇪🇺' },
  { label: 'Amérique du Nord', icon: '🇺🇸' },
  { label: 'Asie-Pacifique', icon: '🌏' },
  { label: 'Monde (Global)', icon: '🌐' },
];

/* ── Main Component ──────────────────────────── */
const Energy = () => {
  const [kpis, setKpis] = useState(FB_KPIS);
  const [dcs, setDcs] = useState(FB_DATACENTERS);
  const [hyper, setHyper] = useState(FB_HYPERSCALERS);
  const [ts, setTs] = useState(FB_ENERGY_TS);
  const [live, setLive] = useState(false);
  const [region, setRegion] = useState('Afrique');
  const [isRegionOpen, setIsRegionOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const [k, d, h, t] = await Promise.all([
        getWithFallback('/dashboard/kpis', FB_KPIS),
        getWithFallback('/dashboard/datacenters', FB_DATACENTERS),
        getWithFallback('/dashboard/hyperscalers', FB_HYPERSCALERS),
        getWithFallback('/dashboard/energy/timeseries', FB_ENERGY_TS),
      ]);
      setKpis(k.data ?? FB_KPIS);
      setDcs(d.data ?? FB_DATACENTERS);
      setHyper(h.data ?? FB_HYPERSCALERS);
      setTs(t.data ?? FB_ENERGY_TS);
      setLive(k.live && d.live);
    })();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const close = () => setIsRegionOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const points = dcs.map((d) => ({
    latitude: d.latitude,
    longitude: d.longitude,
    label: `${d.name} (${d.hyperscaler})`,
    detail: `PUE ${d.pue} — ${Math.round(d.energyMwh / 1000)} GWh/an — ${d.renewableSharePct}% renouvelable`,
    color: pueColor(d.pue),
    radius: Math.max(6, Math.min(20, d.energyMwh / 150000)),
  }));

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      backgroundImage: 'url(https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=2000&q=90)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      {/* Soft Luminous Eco Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.84) 0%, rgba(240, 253, 244, 0.78) 50%, rgba(255, 255, 255, 0.90) 100%)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Content */}
      <motion.div
        variants={stagger} initial="hidden" animate="show"
        style={{ position: 'relative', zIndex: 1, maxWidth: 1360, margin: '0 auto', padding: '2.25rem 2rem 5rem 2rem' }}
      >

        {/* ── Header ── */}
        <motion.div variants={fade} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.5rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 16, background: '#F0FDF4', border: '1px solid #DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(34,197,94,0.15)' }}>
                <Zap size={24} color="#16A34A" />
              </div>
              <h1 style={{ fontSize: '2.15rem', fontWeight: 900, color: '#0F172A', margin: 0, fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.03em' }}>
                Energie <span style={{ color: '#16A34A' }}>&</span> Datacenters
              </h1>
            </div>
            <p style={{ color: '#475569', fontSize: '1rem', margin: 0, fontWeight: 500 }}>
              Consommation, PUE et mix énergétique des datacenters mondiaux · Focus Afrique
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            {/* Source Badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '0.45rem 1rem', borderRadius: 9999,
              background: live ? '#F0FDF4' : '#FFFFFF',
              border: live ? '1px solid #DCFCE7' : '1px solid #E2E8F0',
              color: live ? '#16A34A' : '#475569',
              fontSize: '0.8rem', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <Wifi size={14} color={live ? '#16A34A' : '#64748B'} />
              <span>{live ? 'Données en direct' : 'Données de démonstration'}</span>
            </div>

            {/* Region Dropdown */}
            <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsRegionOpen((prev) => !prev)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '0.5rem 1.1rem', borderRadius: 9999,
                  background: '#FFFFFF',
                  border: isRegionOpen ? '1.5px solid #22C55E' : '1px solid #E2E8F0',
                  color: '#0F172A', fontSize: '0.85rem', fontWeight: 700,
                  cursor: 'pointer', boxShadow: isRegionOpen ? '0 0 0 3px rgba(34,197,94,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s ease',
                }}
              >
                <Globe2 size={15} color="#22C55E" />
                <span>{region}</span>
                <ChevronDown size={13} color="#64748B" style={{ transform: isRegionOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
              </button>

              <AnimatePresence>
                {isRegionOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute', top: '115%', right: 0, width: 220,
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: 20, boxShadow: '0 12px 36px rgba(0,0,0,0.10)',
                      padding: '0.5rem', zIndex: 1000,
                    }}
                  >
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.35rem 0.75rem 0.5rem' }}>
                      Sélectionner la région
                    </div>
                    {REGIONS.map((r) => (
                      <button
                        key={r.label}
                        onClick={() => { setRegion(r.label); setIsRegionOpen(false); }}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          width: '100%', padding: '0.6rem 0.75rem', borderRadius: 12,
                          border: 'none',
                          background: region === r.label ? '#F0FDF4' : 'transparent',
                          color: region === r.label ? '#16A34A' : '#334155',
                          fontSize: '0.85rem', fontWeight: region === r.label ? 700 : 600,
                          cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s ease',
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span>{r.icon}</span><span>{r.label}</span>
                        </span>
                        {r.badge && (
                          <span style={{ fontSize: '0.62rem', background: '#DCFCE7', color: '#15803D', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: 999 }}>{r.badge}</span>
                        )}
                      </button>
                    ))}
                    <div style={{ borderTop: '1px solid #F1F5F9', marginTop: '0.3rem', paddingTop: '0.3rem' }}>
                      <Link
                        to="/africa"
                        onClick={() => setIsRegionOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '0.5rem 0.75rem', borderRadius: 12,
                          color: '#16A34A', fontSize: '0.8rem', fontWeight: 700,
                          textDecoration: 'none', background: '#F8FAFC',
                        }}
                      >
                        <span>Vue AfricaGreen détaillée</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ── 4 KPI Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <GlassStatCard title="Datacenters suivis" value={kpis.totalDataCenters ?? 11} sub={`${kpis.africaDataCenters ?? 5} en Afrique`} icon={Server} />
          <GlassStatCard title="Energie totale" value={`${Math.round((kpis.totalEnergyMwh || 8845000) / 1000).toLocaleString('fr-FR')} GWh`} sub="Consommation annuelle cumulée" icon={Zap} />
          <GlassStatCard title="PUE moyen" value={kpis.averagePue ?? '1.42'} sub="Efficacité énergétique (1 = idéal)" icon={Globe2} />
          <GlassStatCard title="Part renouvelable" value={`${kpis.averageRenewablePct ?? 40.5}%`} sub="Mix énergétique moyen" icon={Leaf} />
        </div>

        {/* ── Carte interactive ── */}
        <motion.div variants={fade} style={{ marginBottom: '2rem' }}>
          <GlassPanel>
            <div style={{ padding: '1.5rem 2rem 1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem', fontFamily: 'Outfit, sans-serif' }}>
                    🗺 Carte mondiale des datacenters
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0, fontWeight: 500 }}>
                    Taille = énergie consommée &nbsp;·&nbsp; Couleur: <span style={{ color: '#16A34A', fontWeight: 700 }}>● vert PUE ≤ 1.2</span>, <span style={{ color: '#D97706', fontWeight: 700 }}>● orange ≤ 1.5</span>, <span style={{ color: '#DC2626', fontWeight: 700 }}>● rouge &gt; 1.5</span>
                  </p>
                </div>
                <Link
                  to="/africa"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '0.45rem 1.1rem', borderRadius: 9999, fontSize: '0.82rem',
                    fontWeight: 700, textDecoration: 'none',
                    background: '#F0FDF4', border: '1px solid #DCFCE7',
                    color: '#16A34A', transition: 'all 0.2s ease',
                  }}
                >
                  Vue AfricaGreen <ArrowRight size={13} />
                </Link>
              </div>
            </div>
            <div style={{ minHeight: 420, borderRadius: '0 0 28px 28px', overflow: 'hidden' }}>
              <MapView points={points} center={[20, 10]} zoom={2} height={420} />
            </div>
          </GlassPanel>
        </motion.div>

        {/* ── Charts — 2 colonnes côte à côte ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.75rem' }}>

          {/* Bar Chart — Hyperscalers */}
          <motion.div variants={fade}>
            <GlassPanel style={{ padding: '1.75rem 2rem', height: '100%' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem', fontFamily: 'Outfit, sans-serif' }}>
                Comparatif par hyperscaler
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#16A34A', margin: '0 0 1.25rem', fontWeight: 700 }}>
                Énergie (MWh) vs CO₂ émis (tonnes)
              </p>
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hyper} margin={{ top: 8, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="hyperscaler" tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<GlassTooltip />} />
                    <Legend
                      wrapperStyle={{ paddingTop: 14 }}
                      formatter={(v) => <span style={{ color: '#0F172A', fontSize: '0.85rem', fontWeight: 700, paddingLeft: 4 }}>{v}</span>}
                    />
                    <Bar dataKey="energyMwh" name="Énergie (MWh)" fill="#22C55E" radius={[8, 8, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="co2Tons" name="CO₂ (t)" fill="#EF4444" radius={[8, 8, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>
          </motion.div>

          {/* Area Chart — IEA Projection */}
          <motion.div variants={fade}>
            <GlassPanel style={{ padding: '1.75rem 2rem', height: '100%' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem', fontFamily: 'Outfit, sans-serif' }}>
                Demande électrique des datacenters (TWh)
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#16A34A', margin: '0 0 1.25rem', fontWeight: 700 }}>
                Source : IEA — projection 2022–2030
              </p>
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ts} margin={{ top: 8, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gAi2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gStd2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="year" tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<GlassTooltip />} />
                    <Legend
                      wrapperStyle={{ paddingTop: 14 }}
                      formatter={(v) => <span style={{ color: '#0F172A', fontSize: '0.85rem', fontWeight: 700, paddingLeft: 4 }}>{v}</span>}
                    />
                    <Area type="monotone" dataKey="standardTwh" name="Cloud standard" stroke="#22C55E" strokeWidth={3.5} fill="url(#gStd2)" dot={false} activeDot={{ r: 6, fill: '#16A34A', stroke: '#FFFFFF', strokeWidth: 2 }} />
                    <Area type="monotone" dataKey="aiTwh" name="Charge IA" stroke="#EF4444" strokeWidth={3.5} fill="url(#gAi2)" dot={false} activeDot={{ r: 6, fill: '#DC2626', stroke: '#FFFFFF', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>
          </motion.div>

        </div>

      </motion.div>
    </div>
  );
};

export default Energy;
