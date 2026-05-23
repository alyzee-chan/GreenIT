# GreenIT — Frontend (React)

Interface de la plateforme **GreenIT** : veille environnementale du numérique avec un focus
Afrique subsaharienne. SPA React moderne, animée, avec thème clair/sombre et bilingue (FR/EN).

## Stack

| Composant | Technologie |
|---|---|
| Framework | React 19 + Vite |
| Routing | React Router v7 |
| État | Zustand (auth + thème, persistés) |
| HTTP | Axios (intercepteur JWT + fallback démo) |
| Graphiques | Recharts |
| Cartes | Leaflet / React-Leaflet |
| Animations | Framer Motion |
| i18n | i18next / react-i18next (FR, EN) |
| Icônes | lucide-react |

## Prérequis

- **Node.js 18+** (testé avec Node 22).

## Démarrer

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de production -> dist/
npm run preview  # prévisualiser le build
```

Le serveur de dev **proxifie `/api` vers `http://localhost:8080`** (voir `vite.config.js`),
donc lancez aussi le backend (`../Green_IT`) pour des données en direct.

### Mode démonstration (sans backend)

Chaque page tente l'appel API puis **bascule automatiquement sur des données de démonstration**
intégrées si le backend est injoignable. Un badge **« Données live » / « Données de démonstration »**
indique l'état sur chaque module. L'application est donc entièrement explorable sans backend.

### Comptes de démonstration

`admin@greenit.org / admin123` (ADMIN) · `demo@greenit.org / demo123` (PRO_IT).
La connexion nécessite que le backend soit démarré.

## Fonctionnalités

- **Thème clair / sombre** : bascule dans la barre latérale (persistée), variables CSS.
- **Bilingue FR/EN** : bascule dans la barre latérale (persistée).
- **Auth + RBAC** : routes protégées ; les entrées Alertes / Rapports apparaissent une fois
  connecté, la Console Admin uniquement pour le rôle `ADMIN`.
- **Animations** : transitions de page, compteurs animés, barres et cartes au survol.

## Pages

| Route | Contenu |
|---|---|
| `/` | Landing publique |
| `/login`, `/register`, `/profile` | Authentification & profil |
| `/dashboard` | Centre de pilotage : KPIs, énergie, émissions, minerais, secteurs, carte, Afrique |
| `/energy` | Carte mondiale des datacenters, PUE, comparatif hyperscalers |
| `/minerals` | Marché & épuisement des minerais (simulateur) |
| `/predictions` | Scénarios IA : épuisement, CO2, tension sectorielle |
| `/alerts` | Centre d'alertes (4 niveaux) + recommandations *(auth)* |
| `/africa` | AfricaGreen : carte minière, calculateur d'empreinte, annuaire |
| `/benchmark` | Comparatif sectoriel, scorecard ESG, certifications |
| `/geopolitics` | Carte des conflits, politiques nationales, tensions |
| `/community` | Forum, ressources, badges |
| `/reports` | Exports PDF / Excel / CSV / JSON *(auth)* |
| `/admin` | Console d'administration *(rôle ADMIN)* |
| `/builder`, `/water-usage`, `/sensitization` | Sensibilisation & calculateurs |

## Structure

```
src/
  api/        client.js (axios + fallback), fallback.js (données démo)
  store/      auth.js, theme.js (zustand persistés)
  components/ Sidebar, StatCard, AnimatedNumber, ThemeToggle, MapView, DataSourceBadge, ProtectedRoute
  pages/      une page par module
  i18n.js     traductions FR/EN
```

---
Frontend de l'application **GreenIT** (cahier des charges `GreenIT_Cahier_des_Charges.docx`).
Voir `../Green_IT/README.md` pour le backend Spring Boot.
