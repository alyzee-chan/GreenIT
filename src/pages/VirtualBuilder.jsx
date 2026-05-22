import React, { useState } from 'react';
import { Server, HardDrive, Cpu as CpuIcon, ArrowRight, ShieldCheck, Clock, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const componentsDB = [
  {
    id: 'cpu-standard',
    type: 'cpu',
    name: 'Processeur IA Standard (Génération actuelle)',
    power: '400W',
    lifespan: '3 ans',
    materialImpact: 'Élevé (Silicium, Cuivre)',
    isEco: false,
    ecoAlternative: 'cpu-eco'
  },
  {
    id: 'cpu-eco',
    type: 'cpu',
    name: 'Processeur IA Longue Durée',
    power: '320W',
    lifespan: '8 ans',
    materialImpact: 'Modéré (Matériaux recyclés à 40%)',
    isEco: true,
    ecoAlternative: null
  },
  {
    id: 'hdd-standard',
    type: 'storage',
    name: 'Disque Dur Haute Performance (15K RPM)',
    power: '12W',
    lifespan: '4 ans',
    materialImpact: 'Très Élevé (Aimants Néodyme)',
    isEco: false,
    ecoAlternative: 'ssd-eco'
  },
  {
    id: 'ssd-eco',
    type: 'storage',
    name: 'SSD Enterprise Qualité Supérieure',
    power: '4W',
    lifespan: '10 ans',
    materialImpact: 'Faible (Renouvellement espacé)',
    isEco: true,
    ecoAlternative: null
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const VirtualBuilder = () => {
  const [selectedCpu, setSelectedCpu] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [suggestion, setSuggestion] = useState(null);

  const handleSelectComponent = (comp) => {
    if (comp.type === 'cpu') setSelectedCpu(comp);
    if (comp.type === 'storage') setSelectedStorage(comp);

    if (!comp.isEco && comp.ecoAlternative) {
      const alt = componentsDB.find(c => c.id === comp.ecoAlternative);
      setSuggestion({ original: comp, alternative: alt });
    } else {
      setSuggestion(null);
    }
  };

  const acceptSuggestion = () => {
    if (suggestion) {
      if (suggestion.alternative.type === 'cpu') setSelectedCpu(suggestion.alternative);
      if (suggestion.alternative.type === 'storage') setSelectedStorage(suggestion.alternative);
      setSuggestion(null);
    }
  };

  const standardCpus = componentsDB.filter(c => c.type === 'cpu' && !c.isEco);
  const ecoCpus = componentsDB.filter(c => c.type === 'cpu' && c.isEco);
  
  const standardStorage = componentsDB.filter(c => c.type === 'storage' && !c.isEco);
  const ecoStorage = componentsDB.filter(c => c.type === 'storage' && c.isEco);

  return (
    <motion.div 
      className="builder-page"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="page-title">Virtual Builder</h1>
        <p className="page-subtitle">Configurez votre infrastructure d'entraînement IA. Nous analyserons l'impact de vos choix.</p>
      </motion.div>

      <div className="builder-grid">
        <div className="selection-area">
          <motion.div 
            className="card" 
            style={{ marginBottom: '1.5rem' }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CpuIcon size={20} /> Choisissez un Processeur
            </h3>
            <div className="component-list">
              {[...standardCpus, ...ecoCpus].map(cpu => (
                <motion.div 
                  key={cpu.id} 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`component-item ${selectedCpu?.id === cpu.id ? 'active' : ''}`}
                  style={{ 
                    borderColor: selectedCpu?.id === cpu.id ? 'var(--primary)' : 'var(--border)',
                    backgroundColor: selectedCpu?.id === cpu.id ? '#ECFDF5' : 'transparent',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSelectComponent(cpu)}
                >
                  <div className="component-info">
                    <h4>{cpu.name} {cpu.isEco && <Leaf size={16} color="var(--primary)" style={{display: 'inline', marginLeft: '8px'}}/>}</h4>
                    <p>Consommation: {cpu.power} | Durée de vie: {cpu.lifespan}</p>
                  </div>
                  <motion.button 
                    className="btn btn-outline" 
                    style={{ pointerEvents: 'none', backgroundColor: selectedCpu?.id === cpu.id ? 'var(--primary)' : 'transparent', color: selectedCpu?.id === cpu.id ? 'white' : 'var(--text-main)' }}
                    animate={{ scale: selectedCpu?.id === cpu.id ? 1.05 : 1 }}
                  >
                    {selectedCpu?.id === cpu.id ? 'Sélectionné' : 'Choisir'}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="card"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HardDrive size={20} /> Choisissez le Stockage
            </h3>
            <div className="component-list">
              {[...standardStorage, ...ecoStorage].map(storage => (
                <motion.div 
                  key={storage.id} 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`component-item ${selectedStorage?.id === storage.id ? 'active' : ''}`}
                  style={{ 
                    borderColor: selectedStorage?.id === storage.id ? 'var(--primary)' : 'var(--border)',
                    backgroundColor: selectedStorage?.id === storage.id ? '#ECFDF5' : 'transparent',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSelectComponent(storage)}
                >
                  <div className="component-info">
                    <h4>{storage.name} {storage.isEco && <Leaf size={16} color="var(--primary)" style={{display: 'inline', marginLeft: '8px'}}/>}</h4>
                    <p>Consommation: {storage.power} | Durée de vie: {storage.lifespan}</p>
                  </div>
                  <motion.button 
                    className="btn btn-outline" 
                    style={{ pointerEvents: 'none', backgroundColor: selectedStorage?.id === storage.id ? 'var(--primary)' : 'transparent', color: selectedStorage?.id === storage.id ? 'white' : 'var(--text-main)' }}
                    animate={{ scale: selectedStorage?.id === storage.id ? 1.05 : 1 }}
                  >
                    {selectedStorage?.id === storage.id ? 'Sélectionné' : 'Choisir'}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="recommendation-area">
          <motion.div 
            className="card" 
            style={{ position: 'sticky', top: '2rem' }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Server size={20} /> Votre Configuration
            </h3>
            
            <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <strong>CPU :</strong> {selectedCpu ? selectedCpu.name : <span style={{color: 'var(--text-muted)'}}>Aucun sélectionné</span>}
              <br/>
              <strong>Stockage :</strong> {selectedStorage ? selectedStorage.name : <span style={{color: 'var(--text-muted)'}}>Aucun sélectionné</span>}
            </div>

            <AnimatePresence mode="wait">
              {suggestion && (
                <motion.div 
                  key="suggestion"
                  className="eco-suggestion"
                  initial={{ opacity: 0, height: 0, scale: 0.8 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.8 }}
                  transition={{ type: 'spring', bounce: 0.4 }}
                >
                  <div className="eco-header">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                      <Leaf size={24} />
                    </motion.div>
                    Alternative Éco-Responsable !
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    Vous avez sélectionné le <strong>{suggestion.original.name}</strong>. Savez-vous qu'un serveur IA standard génère un roulement de matériel tous les 12 à 18 mois, contribuant aux 5 millions de tonnes d'E-waste prévus pour 2030 ?
                    <br/><br/>
                    En choisissant plutôt le <strong>{suggestion.alternative.name}</strong>, vous acceptez un temps de calcul plus long (+30 min/jour), mais les bénéfices environnementaux sont massifs :
                  </p>
                  
                  <div className="impact-stats">
                    <motion.div className="impact-stat" whileHover={{ scale: 1.05 }}>
                      <Clock size={16} color="var(--primary-dark)" />
                      <strong>{suggestion.alternative.lifespan}</strong>
                      Durée de vie (vs {suggestion.original.lifespan})
                    </motion.div>
                    <motion.div className="impact-stat" whileHover={{ scale: 1.05 }}>
                      <ShieldCheck size={16} color="var(--primary-dark)" />
                      <strong>-65%</strong>
                      Renouvellement minéral évité
                    </motion.div>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                    Cette prolongation limite massivement l'extraction de Lithium et Cobalt, et soulage les 4.2 milliards de m³ d'eau consommés mondialement par le refroidissement des data centers.
                  </p>

                  <motion.button 
                    className="btn btn-primary" 
                    style={{ width: '100%', marginTop: '1rem' }}
                    onClick={acceptSuggestion}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Accepter l'alternative Green IT
                  </motion.button>
                </motion.div>
              )}
              
              {!suggestion && (selectedCpu || selectedStorage) && (
                <motion.div 
                  key="success"
                  style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--success)' }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring' }}
                >
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <ShieldCheck size={32} style={{ margin: '0 auto 0.5rem' }} />
                  </motion.div>
                  <p style={{ fontWeight: 500 }}>Configuration Optimisée</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Vos choix minimisent l'impact sur l'environnement.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default VirtualBuilder;
