import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Globe2, Brain, Bell, ArrowRight, Database, ShieldCheck } from 'lucide-react';

const features = [
  { icon: Globe2, title: 'Donnees mondiales', text: 'Datacenters, emissions CO2 et minerais critiques agreges et cartographies.' },
  { icon: Brain, title: 'Predictions IA', text: 'Scenarios d\'epuisement des ressources et projections d\'emissions a 5/10/20 ans.' },
  { icon: Bell, title: 'Alertes & recommandations', text: 'Quatre niveaux de risque et conseils contextualises (Afrique / monde).' },
  { icon: Database, title: 'AfricaGreen', text: 'Economie miniere africaine, calculateur d\'empreinte et annuaire.' },
];

const Landing = () => (
  <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#0F172A 0%,#064E3B 100%)', color: '#fff' }}>
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Leaf color="#34D399" size={28} />
          <strong style={{ fontSize: '1.3rem' }}>GreenIT</strong>
        </div>
        <nav style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/login" className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>Connexion</Link>
          <Link to="/register" className="btn btn-primary">Inscription</Link>
        </nav>
      </header>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <span style={{ background: 'rgba(52,211,153,0.15)', color: '#6EE7B7', padding: '0.4rem 0.9rem', borderRadius: 999, fontSize: '0.8rem', fontWeight: 600 }}>
          Veille environnementale du numerique
        </span>
        <h1 style={{ fontSize: '3rem', lineHeight: 1.1, margin: '1.5rem 0', letterSpacing: '-0.03em' }}>
          Eclairer, predire et guider<br />vers un numerique <span style={{ color: '#34D399' }}>responsable</span>
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#CBD5E1', maxWidth: 680, margin: '0 auto 2rem' }}>
          Plateforme d'analyse predictive et d'aide a la decision environnementale, avec une sensibilite particuliere aux enjeux de l'Afrique subsaharienne.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            Explorer le tableau de bord <ArrowRight size={18} />
          </Link>
          <Link to="/register" className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', padding: '0.75rem 1.5rem' }}>
            Creer un compte
          </Link>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        {features.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '1.5rem' }}>
            <f.icon color="#34D399" size={26} />
            <h3 style={{ margin: '0.75rem 0 0.4rem', fontSize: '1.05rem' }}>{f.title}</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>{f.text}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', justifyContent: 'center', color: '#94A3B8', fontSize: '0.85rem', paddingBottom: '2rem' }}>
        <ShieldCheck size={16} /> Sources : IEA, USGS, The Shift Project, World Bank &middot; Spring Boot + React
      </div>
    </div>
  </div>
);

export default Landing;
