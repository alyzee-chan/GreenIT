import React, { useEffect, useRef, useState } from 'react';

const defaultFormat = (n) => n.toLocaleString('fr-FR');

const AnimatedNumber = ({ value, duration = 1100, decimals = 0, format = defaultFormat, prefix = '', suffix = '' }) => {
  const [display, setDisplay] = useState(0);
  const raf = useRef();

  useEffect(() => {
    const to = Number(value) || 0;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setDisplay(to * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);

  const factor = Math.pow(10, decimals);
  const rounded = Math.round(display * factor) / factor;
  return <span>{prefix}{format(rounded)}{suffix}</span>;
};

export default AnimatedNumber;
