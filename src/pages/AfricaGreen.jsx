import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe2, Calculator, BookMarked } from 'lucide-react';
import client, { getWithFallback } from '../api/client';
import { FB_AFRICA, FB_DIRECTORY } from '../api/fallback';
import DataSourceBadge from '../components/DataSourceBadge';
import MapView from '../components/MapView';

const esgColor = (s) => (s >= 50 ? '#22C55E' : s >= 35 ? '#F59E0B' : '#EF4444');

function fbFootprint(req, countries) {
  const country = countries.find((c) => c.id === Number(req.countryId));
  const gridFactor = country ? 0.2 + (country.thermalEnergySharePct / 100) * 0.6 : 0.45;
  const hostingKwh = req.serverCount * 1500;
  const deviceKwh = req.deviceCount * 200;
  const travelKwh = req.annualTravelKm * 0.15;
  const totalKwh = hostingKwh + deviceKwh + travelKwh;
  const co2Kg = totalKwh * gridFactor;
  return {
    country: country ? country.name : 'Generique',
    gridCo2FactorKgPerKwh: Math.round(gridFactor * 1000) / 1000,
    totalKwhPerYear: Math.round(totalKwh),
    totalCo2TonsPerYear: Math.round((co2Kg / 1000) * 100) / 100,
    breakdown: { hostingKwh: Math.round(hostingKwh), deviceKwh: Math.round(deviceKwh), travelKwh: Math.round(travelKwh) },
    reportingFrameworks: ['GRI', 'TCFD'],
  };
}

const AfricaGreen = () => {
  const [countries, setCountries] = useState(FB_AFRICA);
  const [directory, setDirectory] = useState(FB_DIRECTORY);
  const [live, setLive] = useState(false);
  const [form, setForm] = useState({ countryId: 1, serverCount: 5, deviceCount: 50, annualTravelKm: 20000 });
  const [result, setResult] = useState(null);

  useEffect(() => {
    (async () => {
      const [c, d] = await Promise.all([
        getWithFallback('/africa/countries', FB_AFRICA),
        getWithFallback('/africa/directory', FB_DIRECTORY),
      ]);
      setCountries(c.data); setDirectory(d.data); setLive(c.live);
    })();
  }, []);

  const update = (k) => (e) => setForm({ ...form, [k]: Number(e.target.value) });

  const compute = async () => {
    try {
      const res = await client.post('/africa/footprint', form);
      setResult(res.data);
    } catch {
      setResult(fbFootprint(form, countries));
    }
  };

  const points = countries.map((c) => ({
    latitude: c.latitude, longitude: c.longitude,
    label: c.name,
    detail: `${c.mineCount} mines - ESG ${c.esgScore} - ${c.mineralsProduced.join(', ')}`,
    color: esgColor(c.esgScore),
    radius: Math.max(8, Math.min(24, c.mineCount / 15)),
  }));

  return (
    <motion.div className="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe2 color="var(--primary)" /> AfricaGreen
          </h1>
          <p className="page-subtitle">Economie miniere africaine, calculateur d'empreinte locale et annuaire Green IT.</p>
        </div>
        <DataSourceBadge live={live} />
      </div>

      <motion.div className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="chart-title">Cartographie miniere (Afrique subsaharienne)</h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '-1rem', marginBottom: '1rem' }}>
          Taille = nombre de mines &middot; Couleur = score ESG
        </p>
        <MapView points={points} center={[2, 22]} zoom={3} height={420} />
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '2rem', marginBottom: '2rem' }} className="builder-grid">
        <motion.div className="card">
          <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calculator size={18} color="var(--primary)" /> Calculateur d'empreinte numerique locale
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <label style={lbl}>Pays
              <select value={form.countryId} onChange={update('countryId')} style={inp}>
                {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
            <label style={lbl}>Serveurs
              <input type="number" value={form.serverCount} onChange={update('serverCount')} style={inp} />
            </label>
            <label style={lbl}>Equipements
              <input type="number" value={form.deviceCount} onChange={update('deviceCount')} style={inp} />
            </label>
            <label style={lbl}>Deplacements (km/an)
              <input type="number" value={form.annualTravelKm} onChange={update('annualTravelKm')} style={inp} />
            </label>
          </div>
          <button className="btn btn-primary" onClick={compute} style={{ marginTop: '1rem' }}>Calculer</button>

          {result && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '1.25rem', padding: '1rem', background: '#ECFDF5', borderRadius: 12 }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Empreinte annuelle - {result.country}</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-dark)' }}>{result.totalCo2TonsPerYear} t CO2</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Facteur reseau : {result.gridCo2FactorKgPerKwh} kg/kWh &middot; {Math.round(result.totalKwhPerYear / 1000)} MWh/an
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>
                Cadres de reporting : {(result.reportingFrameworks || []).join(' / ')}
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div className="card">
          <h3 className="chart-title">Indicateurs par pays</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: 360, overflowY: 'auto' }}>
            {countries.map((c) => (
              <div key={c.id} style={{ padding: '0.6rem 0.75rem', borderRadius: 10, background: 'var(--surface-2)', borderLeft: `4px solid ${esgColor(c.esgScore)}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '0.9rem' }}>{c.name}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PIB minier {c.gdpMiningSharePct}%</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.mineralsProduced.join(', ')}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div className="card">
        <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <BookMarked size={18} color="var(--primary)" /> Annuaire Green IT Afrique
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: '1rem' }}>
          {directory.map((e) => (
            <div key={e.name} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{e.name}</strong>
                <span style={{ fontSize: '0.7rem', background: '#E0F2FE', color: 'var(--secondary-dark)', padding: '0.15rem 0.5rem', borderRadius: 999 }}>{e.type}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.25rem 0' }}>{e.country}</div>
              <p style={{ fontSize: '0.85rem' }}>{e.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const lbl = { fontSize: '0.8rem', fontWeight: 600, display: 'flex', flexDirection: 'column' };
const inp = { marginTop: '0.35rem', padding: '0.5rem 0.7rem', borderRadius: 8, border: '1px solid var(--border)', fontSize: '0.92rem' };

export default AfricaGreen;
