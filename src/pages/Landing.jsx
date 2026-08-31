import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Leaf,
  Search,
  Download,
  Globe2,
  Brain,
  Bell,
  Database,
  ArrowRight,
  Share2,
  Globe,
  Rss,
  ShieldCheck,
  Zap,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import heroImg from '../assets/hero-isometric.png';

const partnerLogos = [
  'INSIDER',
  'HUFFPOST',
  'Entrepreneur',
  'CNBC',
  'WORLD BANK',
  'THE SHIFT PROJECT'
];

const features = [
  {
    icon: Globe2,
    badge: 'Cartographie',
    title: 'Données Mondiales & Datacenters',
    text: 'Cartographie en temps réel des datacenters, du mix énergétique et de l\'empreinte carbone globale du numérique.'
  },
  {
    icon: Brain,
    badge: 'Intelligence Artificielle',
    title: 'Prédictions IA & Climat',
    text: 'Scénarios d\'épuisement des minerais critiques et projections d\'émissions CO2 à 5, 10 et 20 ans.'
  },
  {
    icon: Bell,
    badge: 'Prise de décision',
    title: 'Alertes & Recommandations',
    text: 'Aides à la décision stratégique avec 4 niveaux de risque et préconisations éco-responsables sur-mesure.'
  },
  {
    icon: Database,
    badge: 'Afrique Subsaharienne',
    title: 'AfricaGreen Initiative',
    text: 'Traçabilité des minerais de la transition, calculateur d\'empreinte locale et annuaire des acteurs verts.'
  }
];

const Landing = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div style={{ position: 'relative', background: '#FFFFFF', color: '#0F172A', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Organic Green Top-Right Wave Backdrop (Matching img6) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '58vw',
          height: '650px',
          background: 'linear-gradient(135deg, #4ADE80 0%, #22C55E 40%, #16A34A 85%, #15803D 100%)',
          borderBottomLeftRadius: '100% 80%',
          borderBottomRightRadius: '0px',
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.92,
          boxShadow: 'inset 0 -10px 40px rgba(0,0,0,0.08)'
        }}
      />

      {/* Decorative Floating Light Elements */}
      <div
        style={{
          position: 'absolute',
          top: '120px',
          right: '8%',
          width: '320px',
          height: '320px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 70%)',
          borderRadius: '50%',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1280, margin: '0 auto', padding: '0 2rem' }}>

        {/* Navigation Bar (Exact img6 Header Style) */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            padding: '1.75rem 0',
            borderBottom: '1px solid rgba(226, 232, 240, 0.6)'
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)'
              }}
            >
              <Leaf color="#FFFFFF" size={24} />
            </div>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0F172A', fontFamily: 'Outfit, sans-serif' }}>
              GREEN<span style={{ color: '#22C55E' }}>IT</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
            <a href="#features" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', transition: 'color 0.2s' }}>A PROPOS</a>
            <Link to="/dashboard" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', transition: 'color 0.2s' }}>DATACENTERS</Link>
            <Link to="/predictions" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', transition: 'color 0.2s' }}>PREDICTIONS</Link>
            <Link to="/africa" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', transition: 'color 0.2s' }}>AFRICA GREEN</Link>
            <Link to="/community" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', transition: 'color 0.2s' }}>COMMUNAUTE</Link>
            <Link to="/login" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', transition: 'color 0.2s' }}>CONNEXION</Link>
          </nav>

          {/* Actions: Search & Register Pill Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                padding: '0.5rem',
                borderRadius: '50%',
                transition: 'background 0.2s'
              }}
              aria-label="Rechercher"
            >
              <Search size={20} />
            </button>

            <Link to="/register" className="btn btn-pill-dark">
              REJOINDRE
            </Link>
          </div>
        </header>

        {/* Search Drawer Input */}
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: '1rem 0', borderBottom: '1px solid #E2E8F0' }}
          >
            <input
              type="text"
              placeholder="Rechercher un datacenter, un minerai, une région..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1.25rem',
                borderRadius: '9999px',
                border: '1.5px solid #CBD5E1',
                outline: 'none',
                fontSize: '0.95rem'
              }}
            />
          </motion.div>
        )}

        {/* Hero Section (Matching img6 Two-Column Layout) */}
        <section style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '3.5rem', alignItems: 'center', padding: '4rem 0 5rem' }}>

          {/* Left Column Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ marginBottom: '1.25rem' }}>
              <span className="pill">
                <Zap size={14} /> Plateforme Éco-Responsable N°1
              </span>
            </div>

            <h1
              style={{
                fontSize: '3.2rem',
                fontWeight: 800,
                lineHeight: 1.12,
                letterSpacing: '-0.035em',
                color: '#0F172A',
                marginBottom: '1.5rem',
                fontFamily: 'Outfit, sans-serif'
              }}
            >
              La Référence Mondiale du Numérique Éco-Responsable & Énergie Verte
            </h1>

            <p
              style={{
                fontSize: '1.05rem',
                lineHeight: 1.65,
                color: '#64748B',
                marginBottom: '2.5rem',
                maxWidth: '560px'
              }}
            >
              GreenIT accélère la sobriété numérique en cartographiant les datacenters mondiaux, en prédisant l'empreinte carbone et en orientant le financement vers les énergies renouvelables grâce à des modèles décisionnels innovants.
            </p>

            {/* Action buttons & Social icons bar (Matching img6) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <Link to="/reports" className="btn btn-pill-green">
                <Download size={18} /> TELECHARGER LE LIVRE BLANC
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', color: '#94A3B8', textTransform: 'uppercase' }}>
                  SUIVEZ-NOUS
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a href="#twitter" style={{ width: 34, height: 34, borderRadius: '50%', background: '#F1F5F9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title="Twitter / X">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  </a>
                  <a href="#facebook" style={{ width: 34, height: 34, borderRadius: '50%', background: '#F1F5F9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title="Facebook">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                  </a>
                  <a href="#linkedin" style={{ width: 34, height: 34, borderRadius: '50%', background: '#F1F5F9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title="LinkedIn">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.72a1.47 1.47 0 1 0 0 2.94 1.47 1.47 0 0 0 0-2.94Z" /></svg>
                  </a>
                  <a href="#rss" style={{ width: 34, height: 34, borderRadius: '50%', background: '#F1F5F9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title="RSS Feed">
                    <Rss size={15} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Isometric 3D Graphic floating over organic wave */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '520px',
                filter: 'drop-shadow(0 25px 35px rgba(0,0,0,0.15))'
              }}
            >
              <img
                src={heroImg}
                alt="Green Energy & Tech Isometric Illustration"
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 24 }}
              />

              {/* Floating Pill Badge over Hero Image */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  top: '12%',
                  left: '-4%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(12px)',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '9999px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  border: '1px solid rgba(226, 232, 240, 0.8)'
                }}
              >
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 10px #22C55E' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                  100% Énergie Renouvelable
                </span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                style={{
                  position: 'absolute',
                  bottom: '10%',
                  right: '-2%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(12px)',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '9999px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  border: '1px solid rgba(226, 232, 240, 0.8)'
                }}
              >
                <BarChart3 size={18} color="#16A34A" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                  -45% Empreinte CO2
                </span>
              </motion.div>
            </div>
          </motion.div>

        </section>

      </div>

      {/* Featured On & Funding Metric Bar (Exact img6 Bottom Ticker Style) */}
      <section className="featured-bar">
        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>

          <div className="featured-logos">
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: '#94A3B8' }}>
              FEATURED ON
            </span>
            {partnerLogos.map((logo) => (
              <span key={logo} className="featured-logo-item">
                {logo}
              </span>
            ))}
          </div>

          <div className="metric-badge">
            <span>TOTAL FUNDING & INVESTISSEMENTS VERT :</span>
            <span className="metric-value">USD 2,000,000</span>
          </div>

        </div>
      </section>

      {/* Main Features Grid (Purist White Style) */}
      <section id="features" style={{ maxWidth: 1280, margin: '0 auto', padding: '6rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="pill" style={{ marginBottom: '1rem' }}>
            Innovations & Capabilités
          </span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
            Une Analyse Précise pour un Numérique Durable
          </h2>
          <p style={{ color: '#64748B', fontSize: '1.05rem', maxWidth: '640px', margin: '0.75rem auto 0' }}>
            Accédez à nos outils d'analyse prospective et suivez en temps réel l'impact environnemental des infrastructures technologiques.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '2rem' }}>
          {features.map((f, index) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2rem' }}
            >
              <div>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: '#F0FDF4',
                    color: '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    marginBottom: '1.25rem',
                    border: '1px solid #DCFCE7'
                  }}
                >
                  <f.icon size={26} />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#22C55E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {f.badge}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', margin: '0.4rem 0 0.75rem' }}>
                  {f.title}
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.925rem', lineHeight: 1.6 }}>
                  {f.text}
                </p>
              </div>

              <div style={{ marginTop: '1.75rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
                <Link
                  to="/dashboard"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#16A34A'
                  }}
                >
                  Explorer les données <ChevronRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
            Prêt à Réduire l'Empreinte Carbone de vos Infrastructures ?
          </h2>
          <p style={{ color: '#64748B', fontSize: '1.1rem', maxWidth: '620px', margin: '0 auto 2.5rem' }}>
            Rejoignez des centaines d'organisations et d'experts engagés dans la transition vers un numérique 100% responsable.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dashboard" className="btn btn-pill-green" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
              Accéder au Tableau de Bord <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn btn-pill-outline" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
              Créer un Compte Gratuit
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#FFFFFF', borderTop: '1px solid #E2E8F0', padding: '3rem 2rem 2rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf color="#FFFFFF" size={18} />
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>GREEN<span style={{ color: '#22C55E' }}>IT</span></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94A3B8', fontSize: '0.85rem' }}>
            <ShieldCheck size={16} /> Sources officielles : IEA, USGS, World Bank &middot; Tous droits réservés © 2026
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
