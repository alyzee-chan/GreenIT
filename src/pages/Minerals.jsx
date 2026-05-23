import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Cpu, TrendingUp, AlertOctagon, Layers, ArrowRight, ShieldAlert } from 'lucide-react';
import { getWithFallback } from '../api/client';
import { FB_MINERALS } from '../api/fallback';
import DataSourceBadge from '../components/DataSourceBadge';

const MINERAL_COLORS = {
  Cobalt: '#EF4444', Lithium: '#F59E0B', 'Coltan (Tantale)': '#8B5CF6',
  Neodyme: '#0EA5E9', Néodyme: '#0EA5E9', Cuivre: '#10B981', Nickel: '#64748B',
};
const colorFor = (name) => MINERAL_COLORS[name] || '#0EA5E9';

// --- Base Exhaustion Years (at current consumption) ---
const BASE_MINERALS = [
  { name: 'Cobalt', baseExhaustion: 2042, risk: 'Très Élevé', color: '#EF4444' },
  { name: 'Lithium', baseExhaustion: 2050, risk: 'Élevé', color: '#F59E0B' },
  { name: 'Néodyme', baseExhaustion: 2058, risk: 'Élevé', color: '#0EA5E9' },
  { name: 'Cuivre', baseExhaustion: 2075, risk: 'Modéré', color: '#10B981' }
];

// --- Sector Impact Data ---
const sectorImpact = [
  { subject: 'IA & Cloud', A: 95, B: 60, fullMark: 100 },
  { subject: 'Véhicules Élec.', A: 85, B: 70, fullMark: 100 },
  { subject: 'Smartphones', A: 70, B: 80, fullMark: 100 },
  { subject: 'Télécom (5G/6G)', A: 65, B: 50, fullMark: 100 },
  { subject: 'Énergies Renouvelables', A: 80, B: 75, fullMark: 100 },
];

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Minerals = () => {
  const [aiGrowth, setAiGrowth] = useState(100); // Percentage growth of AI (100% = current baseline)
  const [minerals, setMinerals] = useState(BASE_MINERALS);
  const [live, setLive] = useState(false);
  const [prices, setPrices] = useState({
    Lithium: 14200,
    Cobalt: 28500,
    Neodyne: 85400,
    Cuivre: 9800
  });

  // --- Load minerals from the backend (with offline fallback) ---
  useEffect(() => {
    (async () => {
      const res = await getWithFallback('/minerals', FB_MINERALS);
      setLive(res.live);
      const mapped = res.data.map((m) => ({
        name: m.name,
        baseExhaustion: m.baseExhaustionYear,
        risk: m.riskLevel,
        color: colorFor(m.name),
      }));
      if (mapped.length) setMinerals(mapped);
      const byName = Object.fromEntries(res.data.map((m) => [m.name, m.pricePerTon]));
      setPrices((prev) => ({
        Lithium: byName.Lithium ?? prev.Lithium,
        Cobalt: byName.Cobalt ?? prev.Cobalt,
        Neodyne: byName.Neodyme ?? prev.Neodyne,
        Cuivre: byName.Cuivre ?? prev.Cuivre,
      }));
    })();
  }, []);

  // --- Real-time Simulated API Market Price Ticker ---
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => ({
        Lithium: Math.round(prev.Lithium + (Math.random() - 0.48) * 150),
        Cobalt: Math.round(prev.Cobalt + (Math.random() - 0.47) * 200),
        Neodyne: Math.round(prev.Neodyne + (Math.random() - 0.49) * 350),
        Cuivre: Math.round(prev.Cuivre + (Math.random() - 0.5) * 50)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // --- Calculate Exhaustion Year based on AI Growth ---
  const calculateExhaustion = (baseYear) => {
    const yearsRemaining = baseYear - 2026;
    const factor = 1 + (aiGrowth - 100) / 200; // Accelerated depletion
    const newYearsRemaining = Math.max(5, Math.round(yearsRemaining / factor));
    return 2026 + newYearsRemaining;
  };

  // --- Generate projection data for the chart ---
  const generateProjectionData = () => {
    const data = [];
    for (let year = 2026; year <= 2075; year += 5) {
      const point = { year: year.toString() };
      minerals.forEach(m => {
        const exhaust = calculateExhaustion(m.baseExhaustion);
        // Depletion curve: start at 100% and reach 0% at exhaustion year
        const yearsTotal = exhaust - 2026;
        const yearsPassed = year - 2026;
        const remaining = Math.max(0, Math.round(100 - (yearsPassed / yearsTotal) * 100));
        point[m.name] = remaining;
      });
      data.push(point);
    }
    return data;
  };

  return (
    <motion.div 
      className="dashboard"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div className="page-header" variants={itemVariants} initial="hidden" animate="visible" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '2.2rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp color="var(--primary)" />
            Marché & Prédiction des Minéraux Rares
          </h1>
          <p className="page-subtitle" style={{ fontSize: '1.1rem' }}>
            Modélisation prédictive de l'épuisement des ressources minérales critiques face au boom de l'IA.
          </p>
        </div>
        <DataSourceBadge live={live} />
      </motion.div>

      {/* Real-time simulated price API ticker */}
      <motion.div 
        className="card"
        style={{ 
          marginBottom: '2rem', 
          background: 'rgba(255, 255, 255, 0.8)', 
          backdropFilter: 'blur(10px)',
          borderColor: 'var(--border)' 
        }}
        variants={itemVariants}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: 'var(--danger)', borderRadius: '50%', animate: 'pulse 1.5s infinite' }}></span>
          <strong style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Simulateur d'API Marché en Direct (Prix à la Tonne)</strong>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
          <div style={{ padding: '0.5rem', borderLeft: '3px solid #EF4444' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Lithium (Li)</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{prices.Lithium.toLocaleString()} $</div>
          </div>
          <div style={{ padding: '0.5rem', borderLeft: '3px solid #F59E0B' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cobalt (Co)</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{prices.Cobalt.toLocaleString()} $</div>
          </div>
          <div style={{ padding: '0.5rem', borderLeft: '3px solid #0EA5E9' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Néodyme (Nd)</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{prices.Neodyne.toLocaleString()} $</div>
          </div>
          <div style={{ padding: '0.5rem', borderLeft: '3px solid #10B981' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cuivre (Cu)</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{prices.Cuivre.toLocaleString()} $</div>
          </div>
        </div>
      </motion.div>

      {/* Simulator Control Area */}
      <div className="builder-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* Main Chart */}
        <motion.div className="card" variants={itemVariants}>
          <h3 className="chart-title">Prédiction des Réserves Restantes (%)</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '-1rem', marginBottom: '1.5rem' }}>
            Ajustez le curseur pour voir l'impact de la croissance de l'IA sur l'accélération de l'épuisement.
          </p>
          <div style={{ height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={generateProjectionData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <RechartsTooltip formatter={(value) => [`${value}%`, 'Réserves']} />
                <Legend />
                {minerals.map(m => (
                  <Line key={m.name} type="monotone" dataKey={m.name} stroke={m.color} strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Prediction Controls & Dashboard Exhaustion Years */}
        <motion.div className="card" variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 className="chart-title">Paramètres de Croissance</h3>
          
          <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Croissance Annuelle IA</span>
              <span style={{ color: 'var(--primary-dark)' }}>{aiGrowth}%</span>
            </label>
            <input 
              type="range" 
              min="50" 
              max="400" 
              value={aiGrowth} 
              onChange={(e) => setAiGrowth(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              <span>Sobriété (-50%)</span>
              <span>Actuel (100%)</span>
              <span>Boom IA (+300%)</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Horizons d'Épuisement Prévus</h4>
            
            {minerals.map(m => {
              const exhaustYear = calculateExhaustion(m.baseExhaustion);
              return (
                <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#FFFBEB', borderRadius: '8px', border: '1px solid #FEF3C7' }}>
                  <div>
                    <strong style={{ fontSize: '0.95rem' }}>{m.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Alerte Risque : {m.risk}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#D97706' }}>{exhaustYear}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({exhaustYear - 2026} ans restants)</div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Radar Chart (Sector Impact Analysis) */}
      <div className="builder-grid" style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '2rem' }}>
        <motion.div className="card" variants={itemVariants}>
          <h3 className="chart-title">Vulnérabilité par Secteurs</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '-1rem', marginBottom: '1.5rem' }}>
            La dépendance technologique face à l'épuisement de ces minéraux.
          </p>
          <div style={{ height: '280px', display: 'flex', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={sectorImpact}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="IA Intégrée" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.4} />
                <Radar name="Standard" dataKey="B" stroke="var(--secondary)" fill="var(--secondary)" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div className="card" variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)' }}>
            <ShieldAlert /> Analyse Sectorielle des Risques de Production
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7', marginTop: '1rem' }}>
            Le boom de l'entraînement des IA (notamment via le besoin insatiable de puces GPU Nvidia A100/H100 et de stockage ultra-rapide) a créé un appel d'air colossal sur les réserves mondiales de <strong>Lithium</strong> (pour les batteries de serveurs), de <strong>Cobalt</strong> (durabilité des électrodes), et de <strong>Néodyme</strong> (aimants permanents pour les turbines de ventilation et moteurs de disques durs).
            <br/><br/>
            Cette surexploitation impacte en cascade tous les secteurs de l'industrie technologique. Si les cycles de vie des matériels d'IA ne sont pas portés à <strong>10 ans (grâce à l'éco-conception de notre Virtual Builder)</strong> au lieu de 18 mois, des crises de production majeures frapperont l'industrie automobile et de la communication avant 2040.
          </p>
        </motion.div>
      </div>

    </motion.div>
  );
};

export default Minerals;
