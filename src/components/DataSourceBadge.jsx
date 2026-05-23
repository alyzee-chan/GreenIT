import React from 'react';
import { useTranslation } from 'react-i18next';
import { Wifi, WifiOff } from 'lucide-react';

const DataSourceBadge = ({ live }) => {
  const { t } = useTranslation();
  return (
    <span
      title={live ? t('common.liveData') : t('common.demoData')}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.72rem',
        fontWeight: 600,
        padding: '0.25rem 0.6rem',
        borderRadius: '999px',
        background: live ? '#D1FAE5' : '#FEF3C7',
        color: live ? '#047857' : '#B45309',
        border: `1px solid ${live ? '#A7F3D0' : '#FDE68A'}`,
      }}
    >
      {live ? <Wifi size={13} /> : <WifiOff size={13} />}
      {live ? t('common.liveData') : t('common.demoData')}
    </span>
  );
};

export default DataSourceBadge;
