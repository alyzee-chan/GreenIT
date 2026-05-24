import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, RadialBarChart, RadialBar,
} from 'recharts';
import {
  Droplet, Zap, AlertTriangle, Monitor, ExternalLink, Lightbulb, Battery, Cpu, BookOpen,
  Server, Leaf, Gauge, Globe2, Brain, Bell, ArrowUpRight, Activity,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getWithFallback } from '../api/client';
import {
  FB_KPIS, FB_ENERGY_TS, FB_EMISSIONS, FB_SECTOR_COMPARISON, FB_DATACENTERS,
  FB_AFRICA, FB_SECTORS, fbPredictMinerals,
} from '../api/fallback';
import { useAuth } from '../store/auth';
import StatCard from '../components/StatCard';
import DataSourceBadge from '../components/DataSourceBadge';
import MapView from '../components/MapView';
import WorldBankCO2 from '../components/WorldBankCO2';

const LEVEL_COLOR = { FAIBLE: '#22C55E', MOYEN: '#F59E0B', CRITIQUE: '#EF4444', CATASTROPHIQUE: '#991B1B' };
const DONUT = ['#10B981', '#0EA5E9', '#F59E0B', '#8B5CF6', '#EF4444'];

const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.6rem 0.8rem', borderRadius: 10, boxShadow: 'var(--shadow)', fontSize: '0.8rem' }}>
      {label != null && <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <span>{p.name}</span><strong>{typeof p.value === 'number' ? p.value.toLocaleString('fr-FR') : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

const SectionTitle = ({ icon: Icon, children, to, action }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem' }}>
      {Icon && <Icon size={18} color="var(--primary)" />} {children}
    </h3>
    {to && <Link to={to} style={{ fontSize: '0.78rem', color: 'var(--secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>{action || 'Voir'} <ArrowUpRight size={14} /></Link>}
  </div>
);

const Dashboard = () => {
  const user = useAuth((s) => s.user);
  const [kpis, setKpis] = useState(FB_KPIS);
  const [energy, setEnergy] = useState(FB_ENERGY_TS);
  const [emissions, setEmissions] = useState(FB_EMISSIONS);
  const [sectorCmp, setSectorCmp] = useState(FB_SECTOR_COMPARISON);
  const [datacenters, setDatacenters] = useState(FB_DATACENTERS);
  const [africa, setAfrica] = useState(FB_AFRICA);
  const [live, setLive] = useState(false);

  const minerals = fbPredictMinerals('normal');
  const sectors = [...FB_SECTORS]
    .map((s) => ({ name: s.name, tension: Math.min(100, Math.round(s.criticalityScore * 1.0)), color: s.criticalityScore >= 85 ? '#EF4444' : s.criticalityScore >= 65 ? '#F59E0B' : '#22C55E' }))
    .sort((a, b) => b.tension - a.tension);
  const alertsFeed = minerals.filter((m) => m.riskScore >= 30).slice(0, 4);

  useEffect(() => {
    (async () => {
      const [k, e, em, sc, dc, af] = await Promise.all([
        getWithFallback('/dashboard/kpis', FB_KPIS),
        getWithFallback('/dashboard/energy/timeseries', FB_ENERGY_TS),
        getWithFallback('/dashboard/emissions', FB_EMISSIONS),
        getWithFallback('/dashboard/emissions/sectors', FB_SECTOR_COMPARISON),
        getWithFallback('/dashboard/datacenters', FB_DATACENTERS),
        getWithFallback('/africa/countries', FB_AFRICA),
      ]);
      setKpis(k.data); setEnergy(e.data); setEmissions(em.data);
      setSectorCmp(sc.data); setDatacenters(dc.data); setAfrica(af.data);
      setLive(k.live && e.live);
    })();
  }, []);

  const mapPoints = datacenters.map((d) => ({
    latitude: d.latitude, longitude: d.longitude, label: `${d.name}`,
    detail: `${d.hyperscaler} - PUE ${d.pue}`,
    color: d.pue <= 1.2 ? '#10B981' : d.pue <= 1.5 ? '#F59E0B' : '#EF4444',
    radius: Math.max(5, Math.min(16, d.energyMwh / 200000)),
  }));

  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? 'Bonjour' : h < 18 ? 'Bon apres-midi' : 'Bonsoir';
  })();

  return (
    <motion.div className="dashboard" variants={container} initial="hidden" animate="visible">
      {/* Hero banner */}
      <motion.div variants={item} className="card" style={{
        marginBottom: '1.5rem', padding: '1.75rem 2rem', border: 'none',
        background: 'linear-gradient(120deg, #064E3B 0%, #065F46 45%, #0F766E 100%)', color: '#fff', overflow: 'hidden', position: 'relative',
      }}>
        <div style={{ position: 'absolute', right: -40, top: -40, opacity: 0.12 }}><Globe2 size={220} /></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', position: 'relative' }}>
          <div>
            <span style={{ background: 'rgba(255,255,255,0.15)', padding: '0.25rem 0.7rem', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em' }}>
              CENTRE DE PILOTAGE
            </span>
            <h1 style={{ fontSize: '2rem', margin: '0.75rem 0 0.35rem', letterSpacing: '-0.02em' }}>
              {greeting}{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''} 👋
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: 540 }}>
              Vue d'ensemble en temps quasi-reel de l'impact environnemental du numerique mondial, focus Afrique subsaharienne.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.6rem' }}>
            <DataSourceBadge live={live} />
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI row */}
      <div className="grid-cards">
        <StatCard title="Datacenters suivis" value={kpis.totalDataCenters} icon={Server} color="#10B981" subtitle={`${kpis.africaDataCenters} en Afrique`} delay={0} />
        <StatCard title="Energie cumulee" value={Math.round(kpis.totalEnergyMwh / 1000)} suffix=" GWh" icon={Zap} color="#0EA5E9" subtitle="Annuelle" delay={0.05} />
        <StatCard title="CO2 cumule" value={Math.round(kpis.totalCo2Tons / 1000)} suffix=" kt" icon={AlertTriangle} color="#EF4444" subtitle="Emissions annuelles" delay={0.1} />
        <StatCard title="PUE moyen" value={kpis.averagePue} decimals={2} icon={Gauge} color="#8B5CF6" subtitle="1.0 = ideal" delay={0.15} />
        <StatCard title="Part renouvelable" value={kpis.averageRenewablePct} suffix=" %" decimals={1} icon={Leaf} color="#22C55E" subtitle="Mix energetique" delay={0.2} />
        <StatCard title="DC en Afrique" value={kpis.africaDataCenters} icon={Globe2} color="#F59E0B" subtitle="Sites suivis" delay={0.25} />
      </div>

      {/* Energy + Emissions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }} className="builder-grid">
        <motion.div variants={item} className="card">
          <SectionTitle icon={Zap} to="/energy" action="Module Energie">Demande electrique des datacenters (TWh)</SectionTitle>
          <div style={{ height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={energy} margin={{ top: 10, right: 10, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="dAi" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EF4444" stopOpacity={0.45} /><stop offset="95%" stopColor="#EF4444" stopOpacity={0} /></linearGradient>
                  <linearGradient id="dStd" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.45} /><stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="standardTwh" name="Cloud standard" stroke="#0EA5E9" strokeWidth={3} fill="url(#dStd)" />
                <Area type="monotone" dataKey="aiTwh" name="Charge IA" stroke="#EF4444" strokeWidth={3} fill="url(#dAi)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={item} className="card">
          <SectionTitle icon={Activity}>Emissions par sous-secteur (scope 1/2/3)</SectionTitle>
          <div style={{ height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={emissions} margin={{ top: 10, right: 10, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="subSector" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend />
                <Bar dataKey="scope1" name="Scope 1" stackId="a" fill="#10B981" />
                <Bar dataKey="scope2" name="Scope 2" stackId="a" fill="#0EA5E9" />
                <Bar dataKey="scope3" name="Scope 3" stackId="a" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Minerals risk + Sector tension + Alerts feed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <motion.div variants={item} className="card">
          <SectionTitle icon={Brain} to="/minerals" action="Minerais">Risque d'epuisement des minerais</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {minerals.slice(0, 5).map((m) => (
              <div key={m.mineral}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: 4 }}>
                  <span>{m.mineral}</span>
                  <strong style={{ color: LEVEL_COLOR[m.alertLevel] }}>{m.riskScore}% &middot; {m.predictedExhaustionYear}</strong>
                </div>
                <div style={{ height: 8, background: 'var(--surface-2)', borderRadius: 999, overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${m.riskScore}%` }} transition={{ duration: 0.9, ease: 'easeOut' }}
                    style={{ height: '100%', background: LEVEL_COLOR[m.alertLevel], borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="card">
          <SectionTitle icon={AlertTriangle} to="/predictions" action="Predictions">Tension par secteur</SectionTitle>
          <div style={{ height: 240 }}>
            <ResponsiveContainer>
              <RadialBarChart data={sectors} innerRadius="22%" outerRadius="100%" startAngle={90} endAngle={-270}>
                <RadialBar dataKey="tension" background cornerRadius={6} />
                {sectors.map((s, i) => <Cell key={i} fill={s.color} />)}
                <Tooltip content={<ChartTooltip />} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
            {sectors.map((s) => (
              <span key={s.name} className="pill" style={{ fontSize: '0.66rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} /> {s.name}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="card">
          <SectionTitle icon={Bell} to="/alerts" action="Alertes">Alertes recentes</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {alertsFeed.map((a) => (
              <div key={a.mineral} style={{ display: 'flex', gap: '0.7rem', alignItems: 'center', padding: '0.6rem 0.7rem', borderRadius: 10, background: 'var(--surface-2)', borderLeft: `4px solid ${LEVEL_COLOR[a.alertLevel]}` }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: LEVEL_COLOR[a.alertLevel], minWidth: 48 }}>{a.riskScore}%</span>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{a.mineral} <span className="pill" style={{ fontSize: '0.6rem' }}>{a.alertLevel}</span></div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Epuisement prevu {a.predictedExhaustionYear}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Map + Sector share + Africa snapshot */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }} className="builder-grid">
        <motion.div variants={item} className="card">
          <SectionTitle icon={Globe2} to="/energy" action="Carte complete">Datacenters dans le monde</SectionTitle>
          <MapView points={mapPoints} center={[25, 15]} zoom={1} height={260} />
        </motion.div>

        <motion.div variants={item} className="card">
          <SectionTitle icon={Activity}>Part des emissions par secteur</SectionTitle>
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={sectorCmp} dataKey="co2Share" nameKey="sector" cx="50%" cy="50%" innerRadius={55} outerRadius={88} paddingAngle={4}>
                  {sectorCmp.map((e, i) => <Cell key={i} fill={DONUT[i % DONUT.length]} />)}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={item} className="card">
          <SectionTitle icon={Globe2} to="/africa" action="AfricaGreen">Snapshot Afrique</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {africa.slice(0, 6).map((c) => (
              <div key={c.id || c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0.6rem', borderRadius: 8, background: 'var(--surface-2)' }}>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{c.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.mineCount} mines</div>
                </div>
                <span className="pill" style={{ background: c.esgScore >= 50 ? '#D1FAE5' : c.esgScore >= 35 ? '#FEF3C7' : '#FEE2E2', color: c.esgScore >= 50 ? '#047857' : c.esgScore >= 35 ? '#B45309' : '#B91C1C', border: 'none' }}>
                  ESG {c.esgScore}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Live World Bank CO2 data */}
      <motion.div variants={item}>
        <WorldBankCO2 />
      </motion.div>

      {/* Awareness block */}
      <motion.div variants={item} className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: 'white', border: '1px solid #334155', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -50, right: -50, opacity: 0.05 }}><Lightbulb size={200} /></div>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Lightbulb color="#FDE047" /> Comprendre l'impact de l'IA (en mots simples)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
          <Awareness icon={Droplet} color="#93C5FD" title="L'eau (la soif des serveurs)" text="Poser ~50 questions a une IA 'boit' l'equivalent d'une bouteille de 500 ml. A l'echelle mondiale, ce sont des milliers de piscines olympiques evaporees pour le refroidissement." />
          <Awareness icon={Cpu} color="#6EE7B7" title="Le materiel (l'usure rapide)" text="Le 'cerveau' des IA (cartes graphiques) devient obsolete en ~18 mois contre 5-10 ans pour un PC, forcant une extraction massive de metaux." />
          <Awareness icon={Battery} color="#FCD34D" title="L'electricite (la force brute)" text="L'entrainement d'un seul grand modele consomme autant d'electricite que ~120 foyers pendant une annee entiere." />
        </div>
      </motion.div>

      {/* Sources */}
      <motion.div variants={item} id="sources" className="card">
        <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={20} color="var(--primary)" /> Sources de donnees
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {['IEA - Electricity 2024', 'UC Riverside (eau IA)', 'The Shift Project', 'USGS Mineral Summaries', 'World Bank Open Data', 'GHG Protocol'].map((s) => (
            <span key={s} className="pill"><ExternalLink size={12} /> {s}</span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const Awareness = ({ icon: Icon, color, title, text }) => (
  <motion.div whileHover={{ y: -4 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', color }}>
      <Icon size={20} /> <h3 style={{ fontSize: '1.05rem' }}>{title}</h3>
    </div>
    <p style={{ fontSize: '0.92rem', color: '#CBD5E1', lineHeight: 1.6 }}>{text}</p>
  </motion.div>
);

export default Dashboard;
