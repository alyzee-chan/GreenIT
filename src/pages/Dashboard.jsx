import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Zap, Server, Leaf, Globe2, Bell, ChevronDown, ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { getWithFallback } from '../api/client';
import { FB_KPIS } from '../api/fallback';
import { useAuth } from '../store/auth';
import StatCard from '../components/StatCard';
import WorldBankCO2 from '../components/WorldBankCO2';

const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } } };

const CONSUMPTION_DATA = [
  { month: 'Jan', gwh: 3400 },
  { month: 'Mar', gwh: 5200 },
  { month: 'Mai', gwh: 6100 },
  { month: 'Jul', gwh: 5100 },
  { month: 'Sep', gwh: 6400 },
  { month: 'Nov', gwh: 8845 },
];

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      padding: '0.75rem 1rem',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
      fontSize: '0.82rem',
    }}>
      <div style={{ fontWeight: 800, color: '#16A34A', marginBottom: 4 }}>{label}</div>
      <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>
        {payload[0].value.toLocaleString('fr-FR')} GWh
      </div>
    </div>
  );
};

const Dashboard = () => {
  const user = useAuth((s) => s.user);
  const [kpis, setKpis] = useState(FB_KPIS);
  const [region, setRegion] = useState('Afrique');
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [year, setYear] = useState('2026');
  const [isYearOpen, setIsYearOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const k = await getWithFallback('/dashboard/kpis', FB_KPIS);
        setKpis(k.data || FB_KPIS);
      } catch {
        setKpis(FB_KPIS);
      }
    })();
  }, []);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      style={{ maxWidth: 1360, margin: '0 auto', padding: '2rem 2rem 5rem 2rem', position: 'relative', minHeight: '100vh' }}
    >

      {/* ── TOP HEADER ─────────────────────────────────── */}
      <motion.div variants={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.25rem', position: 'relative' }}>

        {/* Floating leaf particles */}
        <div style={{ position: 'absolute', top: '-10px', right: '190px', pointerEvents: 'none', opacity: 0.7 }} className="animate-float-leaf">
          <Leaf color="#84CC16" size={28} style={{ transform: 'rotate(20deg)' }} />
        </div>
        <div style={{ position: 'absolute', top: '30px', right: '100px', pointerEvents: 'none', opacity: 0.5 }} className="animate-float-leaf-rev">
          <Leaf color="#22C55E" size={20} style={{ transform: 'rotate(-35deg)' }} />
        </div>

        <div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, margin: '0 0 0.4rem', fontFamily: 'Outfit, sans-serif', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.65rem', letterSpacing: '-0.02em' }}>
            <Zap color="#22C55E" size={30} /> Energie & Datacenters
          </h1>
          <p style={{ color: '#64748B', fontSize: '1rem', margin: 0, fontWeight: 500 }}>
            Consommation, PUE et mix énergétique des datacenters mondiaux (focus Afrique).
          </p>
        </div>

        {/* Header Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

          {/* Region Selector Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsRegionOpen((prev) => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                background: '#FFFFFF',
                border: isRegionOpen ? '1.5px solid #22C55E' : '1px solid #E2E8F0',
                padding: '0.5rem 1.1rem',
                borderRadius: '9999px',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#0F172A',
                cursor: 'pointer',
                boxShadow: isRegionOpen ? '0 0 0 4px rgba(34, 197, 94, 0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease',
              }}
            >
              <Globe2 size={16} color="#22C55E" />
              <span>{region}</span>
              <ChevronDown
                size={14}
                color="#64748B"
                style={{
                  transform: isRegionOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>

            {/* Dropdown Menu Overlay */}
            {isRegionOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  width: 210,
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '20px',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                  padding: '0.5rem',
                  zIndex: 1000,
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', padding: '0.4rem 0.75rem', letterSpacing: '0.05em' }}>
                  Sélectionner la région
                </div>
                {[
                  { label: 'Afrique', icon: '🌍', badge: 'Focus' },
                  { label: 'Europe', icon: '🇪🇺' },
                  { label: 'Amérique du Nord', icon: '🇺🇸' },
                  { label: 'Asie-Pacifique', icon: '🌏' },
                  { label: 'Monde (Global)', icon: '🌐' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setRegion(item.label);
                      setIsRegionOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '12px',
                      border: 'none',
                      background: region === item.label ? '#F0FDF4' : 'transparent',
                      color: region === item.label ? '#16A34A' : '#334155',
                      fontSize: '0.85rem',
                      fontWeight: region === item.label ? 700 : 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                    {item.badge && (
                      <span style={{ fontSize: '0.65rem', background: '#DCFCE7', color: '#15803D', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '999px' }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
                <div style={{ borderTop: '1px solid #F1F5F9', marginTop: '0.35rem', paddingTop: '0.35rem' }}>
                  <Link
                    to="/africa"
                    onClick={() => setIsRegionOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '12px',
                      color: '#16A34A',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      background: '#F8FAFC',
                    }}
                  >
                    <span>Vue AfricaGreen</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          {/* Notification Bell → Alerts */}
          <Link to="/alerts" style={{ position: 'relative', width: 40, height: 40, borderRadius: '50%', background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textDecoration: 'none' }}>
            <Bell size={18} color="#64748B" />
            <span style={{ position: 'absolute', top: -2, right: -2, width: 18, height: 18, borderRadius: '50%', background: '#22C55E', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FFFFFF' }}>
              3
            </span>
          </Link>

          {/* Leaf → Sensitization */}
          <Link to="/sensitization" style={{ width: 40, height: 40, borderRadius: '50%', background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 6px 16px rgba(34, 197, 94, 0.35)', textDecoration: 'none' }}>
            <Leaf color="#FFFFFF" size={20} />
          </Link>

        </div>
      </motion.div>

      {/* ── 4 KPI CARDS ────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <StatCard title="DATACENTERS SUIVIS" value={11} subtitle="5 en Afrique" icon={Server} color="#22C55E" delay={0} />
        <StatCard title="ENERGIE TOTALE" value={8845} suffix=" GWh" subtitle="Consommation annuelle cumulée" icon={Zap} color="#22C55E" delay={0.05} />
        <StatCard title="PUE MOYEN" value={1.42} decimals={2} subtitle="Efficacité énergétique (1 = idéal)" icon={Globe2} color="#22C55E" delay={0.1} />
        <StatCard title="PART RENOUVELABLE" value={40.5} suffix="%" decimals={1} subtitle="Mix énergétique moyen" icon={Leaf} color="#22C55E" delay={0.15} />
      </div>

      {/* ── MIDDLE 2-COLUMN SECTION ────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>

        {/* LEFT: Notre Impact Earth Card — matching reference image */}
        <motion.div variants={item} style={{
          background: '#FFFFFF',
          borderRadius: '28px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}>

          {/* Text header — padded */}
          <div style={{ padding: '2rem 2rem 0 2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.45rem', fontFamily: 'Outfit, sans-serif' }}>
              Notre impact, notre avenir
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.55, margin: 0, maxWidth: 460 }}>
              Chaque donnée compte. Ensemble, construisons un numérique plus responsable et respectueux de notre planète.
            </p>
          </div>

          {/* Full-bleed eco Earth illustration */}
          <div style={{ position: 'relative', width: '100%', height: 280, overflow: 'hidden', marginTop: '0.5rem' }}>

            {/* Generated 3D Earth eco illustration */}
            <img
              src="/earth-eco.png"
              alt="Terre Éco-Tech 3D"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
            />

            {/* Soft white gradient at bottom to fade into the metrics */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '55%',
              background: 'linear-gradient(to top, #FFFFFF 10%, rgba(255,255,255,0) 100%)',
              pointerEvents: 'none',
            }} />

            {/* Floating leaf particles over the image */}
            <div className="floating-leaf-badge animate-float-leaf" style={{ top: 18, right: 50, opacity: 0.85, zIndex: 4 }}>
              <Leaf size={32} color="#84CC16" style={{ transform: 'rotate(22deg)', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))' }} />
            </div>
            <div className="floating-leaf-badge animate-float-leaf-rev" style={{ top: 60, right: 20, opacity: 0.7, zIndex: 4 }}>
              <Leaf size={22} color="#4ADE80" style={{ transform: 'rotate(-30deg)', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }} />
            </div>
          </div>

          {/* 3 Impact Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center', padding: '0 2rem', marginBottom: '1.25rem' }}>
            {[
              { icon: Leaf, label: "Moins d'émissions", value: '-12.4%', sub: 'vs. année précédente' },
              { icon: Zap, label: 'Énergie verte', value: '+18.7%', sub: 'vs. année précédente' },
              { icon: Globe2, label: 'CO₂ évité', value: '2 341 t', sub: 'eq. CO₂ / an' },
            ].map(({ icon: Ic, label, value, sub }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: '#F0FDF4',
                  border: '1px solid #DCFCE7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '0.4rem',
                }}>
                  <Ic size={18} color="#16A34A" />
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, lineHeight: 1.3 }}>{label}</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#16A34A', fontFamily: 'Outfit, sans-serif', marginTop: 2 }}>{value}</span>
                <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>{sub}</span>
              </div>
            ))}
          </div>

          {/* Action Pill Banner → Sensitization */}
          <Link to="/sensitization" style={{ margin: '0 2rem 2rem 2rem', background: '#F0FDF4', border: '1px solid #DCFCE7', borderRadius: '9999px', padding: '0.65rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', color: '#16A34A', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'none', transition: 'all 0.2s ease' }}>
            <Leaf size={16} color="#16A34A" />
            <span>Découvrir nos actions durables</span>
            <ArrowRight size={16} color="#16A34A" />
          </Link>
        </motion.div>

        {/* RIGHT: Charts Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

          {/* Consumption Area Chart */}
          <motion.div variants={item} style={{ background: '#FFFFFF', borderRadius: '28px', padding: '1.75rem 2rem', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem', fontFamily: 'Outfit, sans-serif' }}>
                  Évolution de la consommation
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', fontFamily: 'Outfit, sans-serif' }}>
                    8845 <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600 }}>GWh</span>
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16A34A', background: '#F0FDF4', border: '1px solid #DCFCE7', padding: '0.2rem 0.6rem', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    +8.6% ↗ <span style={{ color: '#64748B', fontWeight: 500 }}>vs année précédente</span>
                  </span>
                </div>
              </div>
              {/* Year Dropdown Menu */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsYearOpen((prev) => !prev)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#64748B',
                    background: '#F8FAFC',
                    border: isYearOpen ? '1.5px solid #22C55E' : '1px solid #E2E8F0',
                    padding: '0.35rem 0.8rem',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>{year}</span>
                  <ChevronDown
                    size={14}
                    style={{
                      transform: isYearOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </button>

                {isYearOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute',
                      top: '115%',
                      right: 0,
                      width: 130,
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '16px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      padding: '0.4rem',
                      zIndex: 1000,
                    }}
                  >
                    {['2026', '2025', '2024', 'Historique'].map((y) => (
                      <button
                        key={y}
                        onClick={() => {
                          setYear(y);
                          setIsYearOpen(false);
                        }}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '0.45rem 0.75rem',
                          borderRadius: '10px',
                          border: 'none',
                          background: year === y ? '#F0FDF4' : 'transparent',
                          color: year === y ? '#16A34A' : '#334155',
                          fontSize: '0.8rem',
                          fontWeight: year === y ? 700 : 600,
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        {y}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CONSUMPTION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGwh" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="gwh"
                    stroke="#22C55E"
                    strokeWidth={3.5}
                    fill="url(#colorGwh)"
                    dot={{ fill: '#22C55E', stroke: '#FFFFFF', strokeWidth: 2, r: 4 }}
                    activeDot={{ fill: '#16A34A', stroke: '#FFFFFF', strokeWidth: 3, r: 7 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Top Datacenters (Afrique) */}
          <motion.div variants={item} style={{ background: '#FFFFFF', borderRadius: '28px', padding: '1.75rem 2rem', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                Top Datacenters (Afrique)
              </h3>
              <Link to="/africa" style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: 700, cursor: 'pointer', textDecoration: 'none' }}>Voir tout</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {[
                { flag: '🇿🇦', name: 'Johannesburg DC1', country: 'Afrique du Sud', gwh: '1 245 GWh', pct: 65, label: '12.5%' },
                { flag: '🇰🇪', name: 'Nairobi DC2', country: 'Kenya', gwh: '987 GWh', pct: 48, label: '9.8%' },
                { flag: '🇨🇮', name: 'Abidjan DC1', country: "Côte d'Ivoire", gwh: '754 GWh', pct: 36, label: '7.6%' },
              ].map((dc) => (
                <div key={dc.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 180 }}>
                    <span style={{ fontSize: '1.4rem' }}>{dc.flag}</span>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>{dc.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{dc.country}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>{dc.gwh}</span>
                    <div style={{ width: 90, height: 7, background: '#F1F5F9', borderRadius: 999, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${dc.pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        style={{ height: '100%', background: '#22C55E', borderRadius: 999 }}
                      />
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600, minWidth: 35 }}>{dc.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* World Bank CO2 */}
      <motion.div variants={item} style={{ marginBottom: '2.5rem' }}>
        <WorldBankCO2 />
      </motion.div>


    </motion.div>
  );
};

export default Dashboard;
