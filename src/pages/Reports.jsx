import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileDown, FileText, FileSpreadsheet, FileJson, Database } from 'lucide-react';
import client from '../api/client';

const DATASETS = [
  { id: 'datacenters', label: 'Datacenters', icon: Database },
  { id: 'minerals', label: 'Minerais critiques', icon: Database },
  { id: 'africa', label: 'Economie miniere africaine', icon: Database },
];

const FORMATS = [
  { id: 'pdf', label: 'PDF', icon: FileText, color: '#EF4444' },
  { id: 'xlsx', label: 'Excel', icon: FileSpreadsheet, color: '#10B981' },
  { id: 'csv', label: 'CSV', icon: FileDown, color: '#0EA5E9' },
  { id: 'json', label: 'JSON', icon: FileJson, color: '#8B5CF6' },
];

const Reports = () => {
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState('');

  const download = async (type, format) => {
    setBusy(`${type}-${format}`);
    setMsg('');
    try {
      const res = await client.get(`/export/${type}?format=${format}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setMsg("Le backend doit etre demarre pour generer cet export (essayez quand le serveur Spring Boot tourne).");
    } finally {
      setBusy('');
    }
  };

  return (
    <motion.div className="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileDown color="var(--primary)" /> Rapports & Exports
        </h1>
        <p className="page-subtitle">Export des donnees en PDF, Excel, CSV et JSON.</p>
      </div>

      {msg && <div className="card" style={{ marginBottom: '1.5rem', color: 'var(--warning)', fontSize: '0.9rem' }}>{msg}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {DATASETS.map((d) => (
          <motion.div key={d.id} className="card" whileHover={{ y: -2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <d.icon size={20} color="var(--primary)" />
              <strong>{d.label}</strong>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {FORMATS.map((f) => (
                <button key={f.id} className="btn btn-outline" disabled={busy === `${d.id}-${f.id}`}
                  onClick={() => download(d.id, f.id)} style={{ borderColor: f.color, color: f.color }}>
                  <f.icon size={16} /> {busy === `${d.id}-${f.id}` ? '...' : f.label}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Reports;
