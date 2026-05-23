import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../store/theme';

const ThemeToggle = ({ compact = false }) => {
  const theme = useTheme((s) => s.theme);
  const toggle = useTheme((s) => s.toggle);
  const dark = theme === 'dark';

  return (
    <button
      onClick={toggle}
      title={dark ? 'Mode clair' : 'Mode sombre'}
      aria-label="Basculer le theme"
      style={{
        position: 'relative',
        width: compact ? 52 : 58,
        height: compact ? 28 : 30,
        borderRadius: 999,
        border: '1px solid var(--border)',
        background: dark ? 'linear-gradient(135deg,#1E293B,#0F172A)' : 'linear-gradient(135deg,#FDE68A,#FBBF24)',
        cursor: 'pointer',
        padding: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: dark ? 'flex-end' : 'flex-start',
      }}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          width: compact ? 22 : 24,
          height: compact ? 22 : 24,
          borderRadius: '50%',
          background: 'var(--surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
        }}
      >
        {dark ? <Moon size={13} color="#93C5FD" /> : <Sun size={13} color="#F59E0B" />}
      </motion.span>
    </button>
  );
};

export default ThemeToggle;
