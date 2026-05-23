import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      app: { title: 'GreenIT', tagline: 'Veille environnementale du numerique' },
      nav: {
        landing: 'Accueil',
        dashboard: 'Tableau de bord',
        energy: 'Energie & Datacenters',
        minerals: 'Minerais',
        predictions: 'Predictions IA',
        alerts: 'Alertes',
        africa: 'AfricaGreen',
        benchmark: 'Benchmark',
        geopolitics: 'Geopolitique',
        community: 'Communaute',
        reports: 'Rapports & Exports',
        builder: 'Virtual Builder',
        water: 'Ressources en eau',
        sensitization: 'Sensibilisation',
        admin: 'Administration',
        login: 'Connexion',
        register: 'Inscription',
        profile: 'Profil',
        logout: 'Deconnexion',
      },
      common: {
        liveData: 'Donnees live',
        demoData: 'Donnees de demonstration (backend hors ligne)',
        loading: 'Chargement...',
        scenario: 'Scenario',
        normal: 'Normal',
        boom: 'Boom IA',
        ev: 'Vehicules electriques',
        sober: 'Sobriete',
      },
    },
  },
  en: {
    translation: {
      app: { title: 'GreenIT', tagline: 'Digital environmental intelligence' },
      nav: {
        landing: 'Home',
        dashboard: 'Dashboard',
        energy: 'Energy & Datacenters',
        minerals: 'Minerals',
        predictions: 'AI Predictions',
        alerts: 'Alerts',
        africa: 'AfricaGreen',
        benchmark: 'Benchmark',
        geopolitics: 'Geopolitics',
        community: 'Community',
        reports: 'Reports & Exports',
        builder: 'Virtual Builder',
        water: 'Water resources',
        sensitization: 'Awareness',
        admin: 'Administration',
        login: 'Login',
        register: 'Sign up',
        profile: 'Profile',
        logout: 'Logout',
      },
      common: {
        liveData: 'Live data',
        demoData: 'Demo data (backend offline)',
        loading: 'Loading...',
        scenario: 'Scenario',
        normal: 'Normal',
        boom: 'AI Boom',
        ev: 'Electric vehicles',
        sober: 'Sobriety',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('greenit-lang') || 'fr',
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
});

export default i18n;
