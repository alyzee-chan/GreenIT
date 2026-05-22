import React from 'react';
import { Construction } from 'lucide-react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 }
};

export const Minerals = () => (
  <motion.div 
    className="card" 
    style={{ textAlign: 'center', padding: '4rem 2rem' }}
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.4 }}
  >
    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
      <Construction size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
    </motion.div>
    <h2>Marché des Minéraux (API Simulation)</h2>
    <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
      Ce module simulera une API en temps réel affichant les prix des métaux rares et leur taux de renouvellement.
      <br/>En cours de développement.
    </p>
  </motion.div>
);
