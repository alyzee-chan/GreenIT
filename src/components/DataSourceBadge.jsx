import React from 'react';
import { useTranslation } from 'react-i18next';
import { Wifi, WifiOff } from 'lucide-react';

const DataSourceBadge = ({ live }) => {
  return (
    <span
      title={live ? "Données connectées en temps réel" : "Mode simulation & données de démonstration d'impact"}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        fontSize: '0.75rem',
        fontWeight: 700,
        padding: '0.35rem 0.8rem',
        borderRadius: '9999px',
        background: live ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.2)',
        color: live ? '#22C55E' : '#FFFFFF',
        border: `1px solid ${live ? 'rgba(34, 197, 94, 0.4)' : 'rgba(255, 255, 255, 0.3)'}`,
        backdropFilter: 'blur(8px)',
        letterSpacing: '0.02em',
      }}
    >
      {live ? <Wifi size={13} color="#22C55E" /> : <Wifi size={13} color="#4ADE80" />}
      {live ? 'Live API Synchronisée' : 'Système Actif · Données Démo'}
    </span>
  );
};

export default DataSourceBadge;
