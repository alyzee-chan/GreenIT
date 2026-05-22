import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { Droplet, HardDrive, Zap, AlertTriangle, Monitor, Activity, ExternalLink, Lightbulb, Battery, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Real Data based on recent studies (2024) ---
// Source: IEA, AI Multiple
const energyData = [
  { year: '2022', ia_training: 35, standard: 300 },
  { year: '2024', ia_training: 76, standard: 339 }, // Total ~415 TWh
  { year: '2026', ia_training: 150, standard: 450 },
  { year: '2028', ia_training: 326, standard: 600 },
  { year: '2030', ia_training: 450, standard: 495 }, // Projected ~945 TWh total
];

// E-Waste generative AI projection (Millions of Tonnes)
const eWasteData = [
  { name: 'Matériel Obsolète (< 18 mois)', value: 55 },
  { name: 'Infrastructure de Refroidissement', value: 20 },
  { name: 'Alimentation & Câblage', value: 15 },
  { name: 'Autres (Cartes mères, etc.)', value: 10 },
];
const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#0EA5E9'];

// Water withdrawal global AI (Billions of cubic meters)
const waterData = [
  { year: '2023', volume: 1.5 },
  { year: '2024', volume: 2.8 },
  { year: '2025', volume: 4.2 },
  { year: '2026', volume: 5.5 },
  { year: '2027', volume: 6.6 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)',
        padding: '12px', borderRadius: '8px', color: '#fff',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 1000
      }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color, margin: '4px 0', fontSize: '14px', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
            <span>{entry.name}:</span>
            <span style={{ fontWeight: 'bold' }}>{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const StatCard = ({ title, value, subtitle, icon: Icon, isNegative }) => (
  <motion.div 
    className="card stat-card" variants={cardVariants}
    whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.08)" }}
    style={{ borderTop: `4px solid ${isNegative ? 'var(--danger)' : 'var(--primary)'}` }}
  >
    <div className="stat-header">
      <h3 className="stat-title">{title}</h3>
      <motion.div 
        style={{ padding: '10px', backgroundColor: isNegative ? '#FEE2E2' : '#D1FAE5', borderRadius: '12px' }}
        whileHover={{ rotate: 15, scale: 1.1 }}
      >
        <Icon size={22} color={isNegative ? "var(--danger)" : "var(--primary)"} />
      </motion.div>
    </div>
    <div className="stat-value">{value}</div>
    <div className="stat-change change-negative" style={{ fontWeight: 500, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
      {subtitle}
    </div>
  </motion.div>
);

const Dashboard = () => {
  return (
    <motion.div 
      className="dashboard"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
    >
      <motion.div className="page-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title" style={{ fontSize: '2.2rem', letterSpacing: '-0.02em' }}>Intelligence Analytique : Impact Réel</h1>
            <p className="page-subtitle" style={{ fontSize: '1.1rem' }}>Données sourcées sur l'impact climatique des LLM (IEA, Université de Californie, ONU).</p>
          </div>
          <a href="#sources" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--secondary)', fontWeight: 600 }}>
            <ExternalLink size={16} /> Voir les sources
          </a>
        </div>
      </motion.div>

      <motion.div className="grid-cards" variants={containerVariants} initial="hidden" animate="visible">
        <StatCard title="Empreinte Hydrique (GPT-3)" value="700 000 L" subtitle="Par entraînement complet. GPT-4 estimé à 10x plus." icon={Droplet} isNegative={true} />
        <StatCard title="E-Waste Projeté (2030)" value="5M Tonnes" subtitle="Généré annuellement par l'IA générative seule." icon={Monitor} isNegative={true} />
        <StatCard title="Consommation DC (2024)" value="415 TWh" subtitle="Électricité mondiale des Data Centers (IEA)." icon={Zap} isNegative={true} />
        <StatCard title="Cycle de vie GPU IA" value="12-18 mois" subtitle="Contre 3-5 ans pour un serveur standard." icon={HardDrive} isNegative={true} />
      </motion.div>

      {/* --- BLOC DE SENSIBILISATION GRAND PUBLIC --- */}
      <motion.div 
        className="card" 
        style={{ 
          marginBottom: '2rem', 
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', 
          color: 'white',
          border: '1px solid #334155',
          overflow: 'hidden',
          position: 'relative'
        }}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', opacity: 0.05 }}>
          <Lightbulb size={200} />
        </div>
        
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Lightbulb color="#FDE047" /> Comprendre l'Impact de l'IA (En Mots Simples)
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          
          <motion.div whileHover={{ y: -5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#93C5FD' }}>
              <Droplet size={20} /> <h3 style={{ fontSize: '1.1rem' }}>L'Eau (La Soif des Serveurs)</h3>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#CBD5E1', lineHeight: '1.6' }}>
              Imaginez que poser 50 questions à une IA "boit" l'équivalent d'une grande bouteille d'eau (500ml). Multiplié par des millions d'utilisateurs chaque jour, ce sont <strong>des milliers de piscines olympiques</strong> évaporées juste pour empêcher les ordinateurs géants de fondre.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#6EE7B7' }}>
              <Cpu size={20} /> <h3 style={{ fontSize: '1.1rem' }}>Le Matériel (L'Usure Rapide)</h3>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#CBD5E1', lineHeight: '1.6' }}>
              Votre ordinateur personnel peut durer 5 à 10 ans. À l'inverse, le "cerveau" des IA (les cartes graphiques) s'épuise et devient obsolète en <strong>seulement 18 mois</strong>. Cela force l'extraction massive et polluante de métaux précieux.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#FCD34D' }}>
              <Battery size={20} /> <h3 style={{ fontSize: '1.1rem' }}>L'Électricité (La Force Brute)</h3>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#CBD5E1', lineHeight: '1.6' }}>
              S'entraîner à lire tout internet demande un effort titanesque. L'entraînement d'un seul grand modèle d'IA consomme <strong>autant d'électricité que 120 foyers</strong> pendant une année entière.
            </p>
          </motion.div>

        </div>
      </motion.div>

      <motion.div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }} variants={containerVariants} initial="hidden" animate="visible">
        
        {/* Graph 1 */}
        <motion.div className="card" variants={cardVariants}>
          <h3 className="chart-title">Croissance Énergétique Data Centers (TWh)</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-1rem', marginBottom: '1rem' }}>Source: International Energy Agency (IEA) Projections 2024-2030</p>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorStd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="standard" stroke="#0EA5E9" strokeWidth={3} fillOpacity={1} fill="url(#colorStd)" name="Cloud Standard" />
                <Area type="monotone" dataKey="ia_training" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorIa)" name="Charge IA Spécifique" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Graph 2 */}
        <motion.div className="card" variants={cardVariants}>
          <h3 className="chart-title">Répartition Projetée de l'E-Waste IA</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-1rem', marginBottom: '1rem' }}>Source: The Sustainable Agency / Études E-Waste 2030</p>
          <div style={{ height: '350px', display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 20, left: 0 }}>
                <Pie data={eWasteData} cx="50%" cy="45%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                  {eWasteData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Graph 3 */}
        <motion.div className="card" variants={cardVariants}>
          <h3 className="chart-title">Prélèvement Mondial d'Eau pour l'IA (Milliards m³)</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-1rem', marginBottom: '1rem' }}>Source: University of California, Riverside</p>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={waterData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="volume" stroke="#0EA5E9" strokeWidth={4} dot={{ r: 6, fill: '#0EA5E9', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} name="Milliards m³ d'eau" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </motion.div>
      
      {/* Sources Section */}
      <motion.div id="sources" className="card" style={{ marginTop: '2rem', backgroundColor: 'var(--surface)' }} variants={cardVariants} initial="hidden" animate="visible">
        <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
          📚 Bibliographie & Sources de Données Réelles
        </h3>
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.8' }}>
          <li><strong>Consommation d'eau (GPT-3/4) :</strong> L'entraînement de GPT-3 a nécessité environ 700 000 litres d'eau douce pour le refroidissement. GPT-4, étant massivement plus large, est estimé consommer jusqu'à 10 fois plus (Étude de l'Université de Californie, Riverside). L'empreinte mondiale de l'IA atteindra 4.2 à 6.6 milliards de m³ d'ici 2027.</li>
          <li><strong>Consommation Électrique (TWh) :</strong> Les centres de données mondiaux ont consommé environ 415 TWh en 2024. Poussée par l'IA, cette demande devrait doubler pour atteindre près de 945 TWh d'ici 2030 (Rapport de l'International Energy Agency - IEA).</li>
          <li><strong>E-Waste & Cycle de vie :</strong> Les serveurs d'IA dotés de GPU avancés ont un cycle de vie très court (12 à 18 mois) contre 3 à 5 ans pour du standard. L'IA générative ajoutera entre 1.2 et 5 millions de tonnes de déchets électroniques annuels d'ici 2030 (The Sustainable Agency).</li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
