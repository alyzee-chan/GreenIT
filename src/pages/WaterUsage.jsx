import React from 'react';
import { motion } from 'framer-motion';
import { Droplet, ThermometerSun, Waves, ShieldCheck, Flame } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

// --- Data ---
const coolingComparison = [
  { method: 'Air (CRAC)', water: 0, energy: 100, efficiency: 30 },
  { method: 'Évaporation (Tours)', water: 100, energy: 60, efficiency: 65 },
  { method: 'Immersion Liquide', water: 5, energy: 20, efficiency: 95 },
];

const COLORS = ['#EF4444', '#0EA5E9', '#10B981'];

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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)',
        padding: '12px', borderRadius: '8px', color: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color, margin: '4px 0', fontSize: '14px' }}>
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const WaterUsage = () => {
  return (
    <motion.div 
      className="dashboard"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <motion.div className="page-header" variants={itemVariants} initial="hidden" animate="visible">
        <h1 className="page-title" style={{ fontSize: '2.2rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Droplet color="var(--secondary)" /> 
          Stress Hydrique & Thermique
        </h1>
        <p className="page-subtitle" style={{ fontSize: '1.1rem' }}>
          Analyse de l'empreinte thermique des clusters GPU et des alternatives de refroidissement.
        </p>
      </motion.div>

      <motion.div className="grid-cards" variants={containerVariants} initial="hidden" animate="visible" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        
        {/* Info Card 1 */}
        <motion.div className="card" variants={itemVariants} whileHover={{ y: -5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '12px', backgroundColor: '#FEF2F2', borderRadius: '12px' }}>
              <Flame color="#EF4444" size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Le Mur Thermique</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            L'entraînement des LLM génère une chaleur extrême. Un serveur IA dense peut dégager plus de <strong>10 kW de chaleur</strong>. Pour éviter la fonte des composants, les data centers doivent dissiper cette chaleur en continu.
          </p>
        </motion.div>

        {/* Info Card 2 */}
        <motion.div className="card" variants={itemVariants} whileHover={{ y: -5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '12px', backgroundColor: '#EFF6FF', borderRadius: '12px' }}>
              <Waves color="#0EA5E9" size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Le Paradoxe de l'Eau</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Pour refroidir l'air, les data centers utilisent des tours d'évaporation. L'entraînement de GPT-3 a évaporé <strong>700 000 litres d'eau potable</strong>. La projection mondiale est de 6.6 milliards de m³ d'ici 2027.
          </p>
        </motion.div>

        {/* Info Card 3 */}
        <motion.div className="card" variants={itemVariants} whileHover={{ y: -5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '12px', backgroundColor: '#ECFDF5', borderRadius: '12px' }}>
              <ShieldCheck color="#10B981" size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Solutions Green IT</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            L'immersion liquide (baigner les serveurs dans un fluide diélectrique) supprime l'utilisation d'eau et réduit l'énergie de refroidissement de 90%. De plus, la chaleur capturée peut être réutilisée (chauffage urbain).
          </p>
        </motion.div>

      </motion.div>

      <motion.div 
        className="card" 
        style={{ marginTop: '2rem' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h3 className="chart-title">Comparatif des Technologies de Refroidissement (Indice de Consommation Relative)</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-1rem', marginBottom: '1.5rem' }}>
          *Valeurs normalisées : 100 représente la pire consommation. Une efficacité de 100% (PUE proche de 1.0) est l'idéal.
        </p>
        
        <div style={{ height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={coolingComparison} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="method" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'var(--background)' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="energy" name="Coût Énergétique" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={40} />
              <Bar dataKey="water" name="Consommation d'Eau" fill="#0EA5E9" radius={[4, 4, 0, 0]} barSize={40} />
              <Bar dataKey="efficiency" name="Efficacité Thermique" fill="#10B981" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

    </motion.div>
  );
};

export default WaterUsage;
