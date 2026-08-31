import React from 'react';
import { motion } from 'framer-motion';
import AnimatedNumber from './AnimatedNumber';

const StatCard = ({
  title, value, display, suffix = '', prefix = '', decimals = 0, format,
  subtitle, icon: Icon, color = '#22C55E', delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay, ease: 'easeOut' }}
    whileHover={{ y: -4, boxShadow: '0 16px 36px rgba(0,0,0,0.06)' }}
    style={{
      background: '#FFFFFF',
      borderRadius: '24px',
      border: '1px solid #E2E8F0',
      padding: '1.4rem 1.5rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Header & Icon */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
      <span style={{
        fontSize: '0.74rem',
        fontWeight: 800,
        color: '#16A34A',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontFamily: 'Outfit, sans-serif',
      }}>
        {title}
      </span>
      {Icon && (
        <div style={{
          width: 38,
          height: 38,
          borderRadius: '12px',
          background: '#E8F5E9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #C8E6C9',
          flexShrink: 0,
        }}>
          <Icon size={20} color="#16A34A" />
        </div>
      )}
    </div>

    {/* Metric Number */}
    <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0F172A', fontFamily: 'Outfit, sans-serif', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
      {display !== undefined
        ? display
        : <AnimatedNumber value={value} decimals={decimals} prefix={prefix} suffix={suffix} format={format} />}
    </div>

    {/* Subtitle */}
    {subtitle && (
      <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 500, marginBottom: '0.85rem' }}>
        {subtitle}
      </div>
    )}

    {/* Mini Sparkline */}
    <div style={{ height: 26, width: '100%', marginTop: 'auto' }}>
      <svg width="100%" height="26" viewBox="0 0 200 26" fill="none" preserveAspectRatio="none">
        <path
          d="M0 18 C30 22, 50 8, 80 14 C110 20, 140 6, 170 12 C185 15, 195 9, 200 10"
          stroke="#22C55E"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="80" cy="14" r="3.5" fill="#84CC16" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="170" cy="12" r="3.5" fill="#22C55E" stroke="#FFFFFF" strokeWidth="1.5" />
      </svg>
    </div>
  </motion.div>
);

export default StatCard;
