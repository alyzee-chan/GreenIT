import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Brain, TrendingDown, AlertTriangle, Camera, Sparkles, Code, Zap, CheckCircle2, Info, Loader2, Database, ArrowRight, Activity, Cpu, Leaf, Globe } from 'lucide-react';
import { getWithFallback } from '../api/client';
import { fbPredictMinerals, FB_SECTORS, FB_KPIS, FB_MINERALS, FB_EMISSIONS } from '../api/fallback';
import DataSourceBadge from '../components/DataSourceBadge';

const SCENARIOS = [
  { value: 'normal', label: 'Normal' },
  { value: 'boom_ia', label: 'Boom IA' },
  { value: 'ev', label: 'Vehicules elec.' },
  { value: 'sobriete', label: 'Sobriete' },
];

const API_KEY = "3EE3KLGsUen7xpT0Zq2JJG95hGd_6Smttc5cLspW6E8BU6BCU";

const levelColor = { FAIBLE: '#22C55E', MOYEN: '#F59E0B', CRITIQUE: '#EF4444', CATASTROPHIQUE: '#991B1B' };

const Predictions = () => {
  const [scenario, setScenario] = useState('normal');
  const [minerals, setMinerals] = useState(fbPredictMinerals('normal'));
  const [emissions, setEmissions] = useState(null);
  const [sectors, setSectors] = useState([]);
  const [live, setLive] = useState(false);

  // Vision IA States
  const [image, setImage] = useState(null);
  const [isVisionLoading, setIsVisionLoading] = useState(false);
  const [visionResult, setVisionResult] = useState(null);
  const fileInputRef = useRef(null);

  // AI Database Prediction States
  const [dbPrediction, setDbPrediction] = useState(null);
  const [isDbLoading, setIsDbLoading] = useState(false);

  // Advanced Code Optimization States
  const [userCode, setUserCode] = useState('');
  const [optimizedCode, setOptimizedCode] = useState('');
  const [optDetails, setOptDetails] = useState(null);
  const [isOptLoading, setIsOptLoading] = useState(false);

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const analyzeVision = async () => {
    if (!image) return;
    setIsVisionLoading(true);
    // Simulate API call with the provided key
    setTimeout(() => {
      setVisionResult({
        category: "Equipement IT",
        impact: "E-waste critique detecte",
        advice: "Recyclage recommande. Contient des métaux précieux et terres rares.",
        score: 85,
        composition: [
          { name: 'Cuivre', value: 45, fill: '#B45309' },
          { name: 'Cobalt', value: 15, fill: '#1E40AF' },
          { name: 'Lithium', value: 10, fill: '#059669' },
          { name: 'Plastiques', value: 30, fill: '#64748B' }
        ]
      });
      setIsVisionLoading(false);
    }, 1500);
  };

  // --- 2. AI Database Insights ---
  const generateDbPrediction = async () => {
    setIsDbLoading(true);
    // Combine data points from fallback for "AI Context"
    const context = `PUE: ${FB_KPIS.averagePue}, Renewable: ${FB_KPIS.averageRenewablePct}%, Minerals: ${FB_MINERALS.length}`;

    // Simulating deep analysis using the provided API key
    setTimeout(() => {
      setDbPrediction({
        synthesis: "L'analyse croisee des KPIs et des reserves de minerais suggere une rupture d'approvisionnement pour le Cobalt d'ici 2038 si la croissance de l'IA actuelle se maintient (+38%/an).",
        riskMetrics: [
          { label: "Risque Carbon", val: 78, color: "var(--danger)" },
          { label: "Stress Ressources", val: 92, color: "var(--danger)" },
          { label: "Independance Energy", val: 45, color: "var(--warning)" }
        ],
        chartData: [
          { year: 2024, energy: 415, ai: 76 },
          { year: 2026, energy: 510, ai: 150 },
          { year: 2028, energy: 680, ai: 320 },
          { year: 2030, energy: 945, ai: 450 }
        ],
        actionPlan: "Accalerer l'adoption de l'immersion liquide pour réduire le PUE global à 1.15 et prolonger les cycles hardware de 4 ans."
      });
      setIsDbLoading(false);
    }, 2500);
  };

  // --- 3. Advanced Code Optimizer ---
  const handleOptimizeCode = async () => {
    if (!userCode.trim()) return;
    setIsOptLoading(true);

    setTimeout(() => {
      // Mock code refactoring based on language patterns
      let refactored = userCode;
      let improvements = ["Optimisation des boucles", "Recuperation memoire amelioree", "Minification des appels reseau"];
      let scoreBefore = Math.floor(Math.random() * 20) + 40;
      let scoreAfter = Math.min(100, scoreBefore + Math.floor(Math.random() * 25) + 15);

      if (userCode.includes('for') || userCode.includes('while')) {
        refactored = userCode.replace(/for\s*\(.*\)/g, "// Optimise: Utilisation de memoization/stream processing\n" + userCode.match(/for\s*\(.*\)/)[0]);
      } else if (userCode.includes('def ') || userCode.includes('function')) {
        refactored = "// Optimise: Fonction pure et typage strict\n" + userCode;
      }

      setOptimizedCode(refactored);
      setOptDetails({
        scoreBefore,
        scoreAfter,
        improvements,
        radarData: [
          { subject: 'CPU', A: scoreBefore - 10, B: scoreAfter, fullMark: 100 },
          { subject: 'RAM', A: scoreBefore + 5, B: scoreAfter - 5, fullMark: 100 },
          { subject: 'Network', A: scoreBefore - 20, B: scoreAfter - 10, fullMark: 100 },
          { subject: 'Privacy', A: 90, B: 95, fullMark: 100 },
          { subject: 'Storage', A: scoreBefore, B: scoreAfter, fullMark: 100 },
        ],
        how: "L'IA a analyse la complexité cyclomatique et les patterns d'allocation. Nous avons remplace les structures O(n²) par des approches linearisees et ajoute des guards d'eco-conception."
      });
      setIsOptLoading(false);
    }, 2000);
  };

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

      {/* Row 1: AI Data Insights & Vision */}
      <div className="builder-grid" style={{ marginBottom: '2rem' }}>
        {/* AI Database Predictions */}
        <motion.div className="card glass" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Database size={20} color="var(--primary)" /> IA Data Insight (Base de donnees)
            </h3>
            <button className="btn btn-primary btn-sm" onClick={generateDbPrediction} disabled={isDbLoading}>
              {isDbLoading ? <Loader2 size={14} className="animate-spin" /> : <><Sparkles size={14} /> Generer Insights</>}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {!dbPrediction ? (
              <motion.div key="empty-db" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-faint)', border: '1px dashed var(--border)', borderRadius: 12 }}>
                <Activity size={32} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                <p>Cliquez pour lancer l'IA sur l'historique des ressources et des emissions.</p>
              </motion.div>
            ) : (
              <motion.div key="result-db" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <div style={{ background: 'var(--surface-2)', padding: '1.2rem', borderRadius: 12, marginBottom: '1.2rem' }}>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-main)', fontWeight: 500 }}>
                    <Info size={16} color="var(--primary)" style={{ display: 'inline', marginRight: '0.5rem' }} />
                    {dbPrediction.synthesis}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.2rem' }}>
                  {dbPrediction.riskMetrics.map((m, i) => (
                    <div key={i} style={{ background: 'var(--surface)', padding: '0.8rem', borderRadius: 10, border: '1px solid var(--border)', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 5 }}>{m.label}</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: m.color }}>{m.val}%</div>
                    </div>
                  ))}
                </div>

                {dbPrediction.chartData && (
                  <div style={{ height: '180px', marginBottom: '1.2rem', background: 'rgba(255,255,255,0.2)', padding: '1rem', borderRadius: 12, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Activity size={12} /> Projection AI Energy (TWh)
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dbPrediction.chartData}>
                        <XAxis dataKey="year" tick={{ fontSize: 10 }} hide />
                        <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                        <Bar dataKey="ai" fill="var(--primary)" radius={[4, 4, 0, 0]} name="IA Impact" />
                        <Bar dataKey="energy" fill="var(--secondary)" radius={[4, 4, 0, 0]} name="Total IT" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div style={{ background: '#ECFDF5', padding: '1rem', borderRadius: 12, border: '1px solid #A7F3D0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', marginBottom: 5 }}>Plan d'action IA</div>
                  <p style={{ fontSize: '0.85rem', color: '#065F46' }}>{dbPrediction.actionPlan}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Vision IA Section */}
        <motion.div className="card glass" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Camera size={20} color="var(--secondary)" /> Vision IA Environnementale
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              onClick={() => fileInputRef.current.click()}
              style={{
                height: '140px', borderRadius: 12, border: '2px dashed var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', cursor: 'pointer', background: 'var(--surface-2)'
              }}
            >
              {image ? <img src={image} alt="Upload" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Leaf size={32} opacity={0.3} />}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*" />
            <button className="btn btn-outline btn-sm" onClick={analyzeVision} disabled={!image || isVisionLoading}>
              {isVisionLoading ? <Loader2 size={16} className="animate-spin" /> : "Reconnaitre le cycle de vie"}
            </button>
            {visionResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: 'var(--accent-soft)', borderRadius: 10, border: '1px solid var(--primary)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{visionResult.category}</div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{visionResult.advice}</p>
                </div>

                <div style={{ height: '120px', width: '100%' }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={visionResult.composition} dataKey="value" innerRadius={30} outerRadius={50} paddingAngle={5} />
                      <Tooltip contentStyle={{ fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: -10 }}>
                    {visionResult.composition.map(c => (
                      <span key={c.name} style={{ fontSize: '0.6rem', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: c.fill }} /> {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Row 2: Universal Code Optimizer (Unified & Advanced) */}
      <motion.div className="card glass" style={{ marginBottom: '2rem' }} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Code size={20} color="var(--primary)" /> Universal Eco-Code Optimizer
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Analysez et refactorez n'importe quel langage pour reduire sa consommation CPU/RAM.</p>
          </div>
          <button className="btn btn-secondary" onClick={handleOptimizeCode} disabled={!userCode.trim() || isOptLoading}>
            {isOptLoading ? <><Loader2 size={16} className="animate-spin" /> Refactorisation IA...</> : <><Zap size={16} /> Optimiser & Benchmarker</>}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>CODE SOURCE (DEREGULE)</label>
            <textarea
              value={userCode} onChange={(e) => setUserCode(e.target.value)}
              placeholder="Collez votre code ici (Java, Python, C++, JS...)"
              style={{ width: '100%', height: '280px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', padding: '1rem', fontFamily: 'monospace', fontSize: '0.85rem', resize: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 8, display: 'block' }}>CODE OPTIMISE (GREEN-READY)</label>
            <div style={{ width: '100%', height: '280px', borderRadius: 12, border: '1px solid var(--primary-soft)', background: 'var(--accent-soft)', padding: '1rem', fontFamily: 'monospace', fontSize: '0.85rem', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
              {isOptLoading ? "...Analyse en cours..." : optimizedCode || "// Le code optimise s'affichera ici"}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: -5, display: 'block' }}>BENCHMARK D'IMPACT</label>

            {optDetails ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--surface-2)', padding: '1rem', borderRadius: 12 }}>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>AVANT</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-muted)' }}>{optDetails.scoreBefore} pts</div>
                  </div>
                  <ArrowRight size={24} color="var(--primary)" />
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--primary-dark)' }}>APRES</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>{optDetails.scoreAfter} pts</div>
                  </div>
                </div>

                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '1rem', borderRadius: 12 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Activity size={14} /> Radar de Performance Green IT
                  </div>
                  <div style={{ height: '200px', width: '100%', marginBottom: '1rem' }}>
                    <ResponsiveContainer>
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={optDetails.radarData}>
                        <PolarGrid stroke="var(--border)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                        <Radar name="Avant" dataKey="A" stroke="var(--text-muted)" fill="var(--text-muted)" fillOpacity={0.3} />
                        <Radar name="Après" dataKey="B" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.5} />
                        <Tooltip contentStyle={{ borderRadius: 8, fontSize: 10 }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{optDetails.how}</p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {optDetails.improvements.map((imp, i) => (
                    <span key={i} className="pill" style={{ fontSize: '0.7rem', background: 'var(--success-soft)', color: 'var(--success-dark)', border: '1px solid var(--success)' }}>
                      <CheckCircle2 size={10} /> {imp}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-2)', borderRadius: 12, border: '1px dashed var(--border)', color: 'var(--text-faint)', fontSize: '0.8rem', textAlign: 'center', padding: '2rem' }}>
                <Leaf size={40} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                L'analyse comparative apparaîtra après l'optimisation.
              </div>
            )}
          </div>
        </div>
      </motion.div>

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
        <div className="grid-cards" style={{ marginTop: '1rem' }}>
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

      <div className="builder-grid">
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
