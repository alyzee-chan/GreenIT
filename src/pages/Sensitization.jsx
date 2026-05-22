import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckSquare, ShieldCheck, HeartHandshake, Leaf, Info, Award, ShieldAlert, TrendingUp } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const literatureBooks = [
  {
    title: "Sobriété Numérique : Une Clé pour l'Avenir",
    author: "Frédéric Bordage (Green IT)",
    desc: "Un ouvrage fondateur expliquant comment concevoir des services numériques plus légers et durables en limitant le gaspillage technologique.",
    year: "2019"
  },
  {
    title: "Rapports d'impact carbone du Numérique",
    author: "The Shift Project",
    desc: "Des analyses macro-économiques rigoureuses démontrant l'accélération de l'empreinte carbone mondiale liée aux data centers et à la vidéo en ligne.",
    year: "2020-2024"
  },
  {
    title: "Eco-conception Web : les 115 bonnes pratiques",
    author: "Collectif Numérique Responsable",
    desc: "Un guide opérationnel pour les développeurs visant à réduire la charge processeur et la consommation de mémoire des applications modernes.",
    year: "2022"
  }
];

const actionItems = [
  { id: '1', text: "Privilégier le Wi-Fi à la 4G/5G en déplacement (consomme 3x moins d'énergie).", category: 'general' },
  { id: '2', text: "Allonger la durée de vie de ses équipements (passer de 3 à 5 ans d'usage).", category: 'general' },
  { id: '3', text: "Héberger ses modèles d'IA sur des serveurs alimentés par des énergies renouvelables.", category: 'pro' },
  { id: '4', text: "Optimiser les requêtes SQL et indexer les bases de données (réduit les cycles processeurs).", category: 'pro' },
  { id: '5', text: "Utiliser des modèles d'IA pré-entraînés (transfer learning) plutôt que d'entraîner à partir de zéro.", category: 'pro' },
  { id: '6', text: "Activer le mode sombre sur ses écrans OLED pour économiser la batterie.", category: 'general' }
];

const Sensitization = () => {
  const [activeTab, setActiveTab] = useState('literature');
  const [score, setScore] = useState(0);
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheckboxChange = (id) => {
    setCheckedItems(prev => {
      const isChecked = !prev[id];
      setScore(s => isChecked ? s + 1 : s - 1);
      return { ...prev, [id]: isChecked };
    });
  };

  return (
    <motion.div 
      className="dashboard"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div className="page-header" variants={itemVariants} initial="hidden" animate="visible">
        <h1 className="page-title" style={{ fontSize: '2.2rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Leaf color="var(--primary)" />
          Sobriété & Préservation Environnementale
        </h1>
        <p className="page-subtitle" style={{ fontSize: '1.1rem' }}>
          Revue de littérature, guides pratiques et solutions pour préserver la planète grâce à un numérique responsable.
        </p>
      </motion.div>

      {/* Tabs Menu */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem', paddingBottom: '0.5rem' }}>
        <button 
          className={`btn ${activeTab === 'literature' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('literature')}
        >
          <BookOpen size={16} /> Revue de Littérature
        </button>
        <button 
          className={`btn ${activeTab === 'actions' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('actions')}
        >
          <CheckSquare size={16} /> Bonnes Pratiques Interactives
        </button>
        <button 
          className={`btn ${activeTab === 'ai-for-good' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('ai-for-good')}
        >
          <HeartHandshake size={16} /> L'IA au Service du Climat
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* Tab 1: Literature */}
        {activeTab === 'literature' && (
          <motion.div 
            key="literature"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            <div className="builder-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={22} color="var(--primary)" /> Les Références Fondatrices
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  Afin de comprendre le mouvement **Green IT / Informatique Responsable**, les chercheurs et experts mondiaux se concentrent sur la quantification des émissions de gaz à effet de serre et l'analyse de cycle de vie (ACV) des appareils technologiques.
                </p>

                {literatureBooks.map((book, index) => (
                  <motion.div 
                    key={index}
                    className="card"
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                    style={{ background: 'var(--surface)', borderLeft: '4px solid var(--primary)' }}
                  >
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary-dark)', fontWeight: 600 }}>{book.year}</span>
                    <h3 style={{ fontSize: '1.1rem', margin: '0.25rem 0' }}>{book.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Par <strong>{book.author}</strong></p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{book.desc}</p>
                  </motion.div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldAlert size={22} color="#D97706" /> Les Risques Globaux pour l'Écosystème
                </h2>
                
                <div className="card" style={{ background: '#FFFBEB', borderColor: '#FEF3C7' }}>
                  <h4 style={{ color: '#B45309', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Info size={18} /> Risque de Rupture Écologique
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: '#92400E', lineHeight: '1.6' }}>
                    La surexploitation des mines à ciel ouvert pour les ressources des serveurs détruit la biodiversité locale et contamine les nappes phréatiques environnantes. Sans une transition vers l'éco-conception logicielle, l'empreinte carbone globale du secteur informatique dépassera celle du secteur aérien mondial d'ici 2030.
                  </p>
                </div>

                <div className="card" style={{ background: '#EFF6FF', borderColor: '#BFDBFE' }}>
                  <h4 style={{ color: '#1D4ED8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Info size={18} /> L'effet Rebond (Paradoxe de Jevons)
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: '#1E40AF', lineHeight: '1.6' }}>
                    Le paradoxe de l'informatique responsable : chaque fois que nous augmentons l'efficacité énergétique d'un processeur, nous rendons les calculs moins chers, ce qui augmente de manière exponentielle le nombre total de requêtes. C'est pourquoi la **sensibilisation culturelle** doit primer sur la simple innovation matérielle.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Actions Checklist */}
        {activeTab === 'actions' && (
          <motion.div 
            key="actions"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            <div className="builder-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckSquare size={22} color="var(--primary)" /> Votre Feuille de Route Interactive
                </h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  Cochez les actions que vous appliquez déjà (ou vous engagez à appliquer) pour mesurer votre contribution environnementale.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {actionItems.map(item => (
                    <motion.div 
                      key={item.id}
                      className="card"
                      whileHover={{ scale: 1.01 }}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: '1rem', 
                        padding: '1.25rem',
                        borderColor: checkedItems[item.id] ? 'var(--primary)' : 'var(--border)',
                        background: checkedItems[item.id] ? '#F0FDF4' : 'var(--surface)'
                      }}
                    >
                      <input 
                        type="checkbox" 
                        id={item.id} 
                        checked={!!checkedItems[item.id]} 
                        onChange={() => handleCheckboxChange(item.id)}
                        style={{ marginTop: '0.25rem', width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                      />
                      <label htmlFor={item.id} style={{ fontSize: '0.95rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 600, 
                          textTransform: 'uppercase', 
                          padding: '2px 6px', 
                          borderRadius: '4px',
                          marginRight: '8px',
                          background: item.category === 'pro' ? '#EFF6FF' : '#F1F5F9',
                          color: item.category === 'pro' ? '#1D4ED8' : 'var(--text-muted)'
                        }}>
                          {item.category === 'pro' ? 'Dev / Pro' : 'Grand Public'}
                        </span>
                        {item.text}
                      </label>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Reward/Score Card */}
              <div style={{ position: 'sticky', top: '2rem' }}>
                <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: 'white', border: 'none' }}>
                  <Award size={48} style={{ margin: '0 auto 1rem' }} />
                  <h3>Votre Score Éco-Responsable</h3>
                  <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '1rem 0' }}>
                    {score} <span style={{ fontSize: '1.2rem', fontWeight: 'normal' }}>/ {actionItems.length}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#D1FAE5' }}>
                    Chaque geste compte. Un score de {score} permet d'éviter l'extraction de métaux rares et d'économiser l'électricité d'un foyer pendant plusieurs semaines.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: AI For Good */}
        {activeTab === 'ai-for-good' && (
          <motion.div 
            key="ai-for-good"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            <div className="builder-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '4px solid var(--secondary)' }}>
                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary-dark)' }}>
                  <TrendingUp size={20} color="var(--secondary)" /> L'IA pour Réduire les Émissions Globales
                </h3>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-muted)' }}>
                  Bien que l'IA ait une empreinte matérielle forte, elle est également **un levier de transition environnementale sans précédent**. Une IA bien canalisée peut aider d'autres industries majeures à réduire massivement leur pollution :
                </p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1.25rem', listStyleType: 'disc', fontSize: '0.95rem' }}>
                  <li><strong>Réseaux Électriques Intelligents (Smart Grids) :</strong> Prédiction en temps réel de la demande électrique pour intégrer plus de 40% d'énergies renouvelables intermittentes (éolien, solaire).</li>
                  <li><strong>Agriculture de Précision :</strong> Analyse d'images satellites par IA pour cibler l'arrosage et diviser par deux l'usage des pesticides.</li>
                  <li><strong>Optimisation Logistique :</strong> Algorithmes d'apprentissage par renforcement pour optimiser les trajets de livraison mondiaux, évitant des millions de tonnes de CO2.</li>
                </ul>
              </div>

              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-dark)' }}>
                  <Leaf size={20} color="var(--primary)" /> Préservation de la Biodiversité
                </h3>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-muted)' }}>
                  Des initiatives concrètes s'appuient sur l'IA pour protéger la nature :
                </p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1.25rem', listStyleType: 'disc', fontSize: '0.95rem' }}>
                  <li><strong>Prévention des Incendies :</strong> Réseaux de neurones analysant les flux thermiques des caméras forestières pour détecter les départs de feu en moins de 3 minutes.</li>
                  <li><strong>Lutte contre le Braconnage :</strong> Algorithmes analysant les déplacements d'animaux équipés de balises pour déployer les gardes forestiers là où la menace est maximale.</li>
                  <li><strong>Tri Automatique des Déchets :</strong> Robots trieurs dotés de vision par ordinateur multipliant par 3 la précision du recyclage industriel.</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Sensitization;
