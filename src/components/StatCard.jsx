import React from 'react';
import { motion } from 'framer-motion';
import AnimatedNumber from './AnimatedNumber';

/**
 * Premium stat card with gradient accent, animated count-up and hover lift.
 * - value (number) => animated; or display (string) => static.
 */
const StatCard = ({
  title, value, display, suffix = '', prefix = '', decimals = 0, format,
  subtitle, icon: Icon, color = 'var(--primary)', trend, delay = 0,
}) => (
  <motion.div
    className="card"
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    whileHover={{ y: -5 }}
    style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}
  >
    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${color}14, transparent 60%)`, pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 4, background: `linear-gradient(90deg, ${color}, transparent)` }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</span>
      {Icon && (
        <div style={{ padding: 9, borderRadius: 12, background: `${color}1f`, display: 'flex' }}>
          <Icon size={20} color={color} />
        </div>
      )}
    </div>
    <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
      {display !== undefined
        ? display
        : <AnimatedNumber value={value} decimals={decimals} prefix={prefix} suffix={suffix} format={format} />}
    </div>
    {(subtitle || trend) && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        {trend && (
          <span style={{ color: trend.positive ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>
            {trend.positive ? '▲' : '▼'} {trend.label}
          </span>
        )}
        {subtitle}
      </div>
    )}
  </motion.div>
);

export default StatCard;
