// Representative demo data mirroring the backend seed. Used automatically when
// the Spring Boot backend is offline so the whole UI stays demonstrable.

export const FB_KPIS = {
  totalDataCenters: 11,
  totalEnergyMwh: 8845000,
  totalCo2Tons: 3119000,
  averagePue: 1.42,
  averageRenewablePct: 40.5,
  africaDataCenters: 5,
  globalDataCenterTwh2024: 415,
  globalDataCenterTwh2030: 945,
  aiWaterBillionM3_2027: 6.6,
};

export const FB_DATACENTERS = [
  { name: 'US-East (N. Virginia)', city: 'Ashburn', country: 'USA', hyperscaler: 'AWS', latitude: 39.04, longitude: -77.49, pue: 1.2, energyMwh: 2800000, co2Tons: 980000, renewableSharePct: 38, africa: false },
  { name: 'Europe West', city: 'Dublin', country: 'Irlande', hyperscaler: 'AWS', latitude: 53.35, longitude: -6.26, pue: 1.18, energyMwh: 1200000, co2Tons: 210000, renewableSharePct: 62, africa: false },
  { name: 'Azure North Europe', city: 'Amsterdam', country: 'Pays-Bas', hyperscaler: 'Azure', latitude: 52.37, longitude: 4.9, pue: 1.16, energyMwh: 1500000, co2Tons: 240000, renewableSharePct: 70, africa: false },
  { name: 'Google St-Ghislain', city: 'Saint-Ghislain', country: 'Belgique', hyperscaler: 'Google Cloud', latitude: 50.46, longitude: 3.82, pue: 1.1, energyMwh: 900000, co2Tons: 95000, renewableSharePct: 85, africa: false },
  { name: 'Asia Pacific', city: 'Singapour', country: 'Singapour', hyperscaler: 'Google Cloud', latitude: 1.35, longitude: 103.82, pue: 1.25, energyMwh: 1100000, co2Tons: 430000, renewableSharePct: 25, africa: false },
  { name: 'OVH Gravelines', city: 'Gravelines', country: 'France', hyperscaler: 'OVH', latitude: 50.99, longitude: 2.12, pue: 1.09, energyMwh: 600000, co2Tons: 42000, renewableSharePct: 80, africa: false },
  { name: 'Africa Data Centres NBO1', city: 'Nairobi', country: 'Kenya', hyperscaler: 'Africa Data Centres', latitude: -1.29, longitude: 36.82, pue: 1.55, energyMwh: 120000, co2Tons: 78000, renewableSharePct: 30, africa: true },
  { name: 'Africa Data Centres LOS', city: 'Lagos', country: 'Nigeria', hyperscaler: 'Africa Data Centres', latitude: 6.52, longitude: 3.37, pue: 1.65, energyMwh: 95000, co2Tons: 82000, renewableSharePct: 12, africa: true },
  { name: 'Cairo DC', city: 'Le Caire', country: 'Egypte', hyperscaler: 'Telecom Egypt', latitude: 30.04, longitude: 31.24, pue: 1.7, energyMwh: 140000, co2Tons: 110000, renewableSharePct: 10, africa: true },
  { name: 'Teraco JB1', city: 'Johannesburg', country: 'Afrique du Sud', hyperscaler: 'Teraco', latitude: -26.2, longitude: 28.04, pue: 1.6, energyMwh: 210000, co2Tons: 198000, renewableSharePct: 8, africa: true },
  { name: 'MTN Abidjan', city: 'Abidjan', country: "Cote d'Ivoire", hyperscaler: 'MTN', latitude: 5.36, longitude: -4.01, pue: 1.68, energyMwh: 70000, co2Tons: 51000, renewableSharePct: 33, africa: true },
];

export const FB_HYPERSCALERS = [
  { hyperscaler: 'AWS', sites: 2, energyMwh: 4000000, co2Tons: 1190000, avgPue: 1.19, avgRenewablePct: 50 },
  { hyperscaler: 'Azure', sites: 1, energyMwh: 1500000, co2Tons: 240000, avgPue: 1.16, avgRenewablePct: 70 },
  { hyperscaler: 'Google Cloud', sites: 2, energyMwh: 2000000, co2Tons: 525000, avgPue: 1.18, avgRenewablePct: 55 },
  { hyperscaler: 'Africa Data Centres', sites: 2, energyMwh: 215000, co2Tons: 160000, avgPue: 1.6, avgRenewablePct: 21 },
];

export const FB_EMISSIONS = [
  { subSector: 'Datacenters', scope1: 19, scope2: 45, scope3: 36 },
  { subSector: 'Reseaux', scope1: 28, scope2: 40, scope3: 32 },
  { subSector: 'Terminaux', scope1: 12, scope2: 25, scope3: 63 },
];

export const FB_SECTOR_COMPARISON = [
  { sector: 'Numerique', co2Share: 4.0 },
  { sector: 'Aviation', co2Share: 2.5 },
  { sector: 'Textile', co2Share: 4.0 },
  { sector: 'Agriculture', co2Share: 18.0 },
];

export const FB_ENERGY_TS = [
  { year: 2022, standardTwh: 300, aiTwh: 35, totalTwh: 335 },
  { year: 2024, standardTwh: 339, aiTwh: 76, totalTwh: 415 },
  { year: 2026, standardTwh: 450, aiTwh: 150, totalTwh: 600 },
  { year: 2028, standardTwh: 600, aiTwh: 326, totalTwh: 926 },
  { year: 2030, standardTwh: 495, aiTwh: 450, totalTwh: 945 },
];

export const FB_MINERALS = [
  { id: 1, name: 'Cobalt', symbol: 'Co', type: 'Metal critique', globalReservesTons: 8300000, productionTonsPerYear: 230000, mainProducers: ['RDC', 'Russie', 'Australie'], baseExhaustionYear: 2042, riskLevel: 'Tres Eleve', pricePerTon: 28500, geopoliticalTensionIndex: 92, miningEsgScore: 28 },
  { id: 2, name: 'Lithium', symbol: 'Li', type: 'Metal critique', globalReservesTons: 28000000, productionTonsPerYear: 180000, mainProducers: ['Australie', 'Chili', 'Zimbabwe'], baseExhaustionYear: 2050, riskLevel: 'Eleve', pricePerTon: 14200, geopoliticalTensionIndex: 70, miningEsgScore: 45 },
  { id: 3, name: 'Coltan (Tantale)', symbol: 'Ta', type: 'Metal critique', globalReservesTons: 130000, productionTonsPerYear: 2100, mainProducers: ['RDC', 'Rwanda', 'Bresil'], baseExhaustionYear: 2048, riskLevel: 'Tres Eleve', pricePerTon: 290000, geopoliticalTensionIndex: 95, miningEsgScore: 22 },
  { id: 4, name: 'Neodyme', symbol: 'Nd', type: 'Terre rare', globalReservesTons: 8000000, productionTonsPerYear: 120000, mainProducers: ['Chine', 'USA', 'Australie'], baseExhaustionYear: 2058, riskLevel: 'Eleve', pricePerTon: 85400, geopoliticalTensionIndex: 78, miningEsgScore: 40 },
  { id: 5, name: 'Cuivre', symbol: 'Cu', type: 'Metal de base', globalReservesTons: 880000000, productionTonsPerYear: 22000000, mainProducers: ['Chili', 'Perou', 'RDC'], baseExhaustionYear: 2075, riskLevel: 'Modere', pricePerTon: 9800, geopoliticalTensionIndex: 45, miningEsgScore: 55 },
  { id: 6, name: 'Nickel', symbol: 'Ni', type: 'Metal critique', globalReservesTons: 95000000, productionTonsPerYear: 3300000, mainProducers: ['Indonesie', 'Philippines', 'Russie'], baseExhaustionYear: 2065, riskLevel: 'Modere', pricePerTon: 18500, geopoliticalTensionIndex: 50, miningEsgScore: 48 },
];

export const FB_EXTRACTION_ZONES = [
  { mineral: 'Cobalt', site: 'Katanga', country: 'RDC', latitude: -10.7, longitude: 25.5, riskLevel: 'Tres Eleve' },
  { mineral: 'Coltan (Tantale)', site: 'Kivu', country: 'RDC', latitude: -1.7, longitude: 29.2, riskLevel: 'Tres Eleve' },
  { mineral: 'Lithium', site: 'Bikita', country: 'Zimbabwe', latitude: -20.1, longitude: 31.4, riskLevel: 'Eleve' },
  { mineral: 'Lithium', site: 'Salar de Atacama', country: 'Chili', latitude: -23.5, longitude: -68.2, riskLevel: 'Modere' },
  { mineral: 'Terres rares', site: 'Bayan Obo', country: 'Chine', latitude: 41.8, longitude: 109.9, riskLevel: 'Eleve' },
  { mineral: 'Cuivre', site: 'Cerro Verde', country: 'Perou', latitude: -16.5, longitude: -71.6, riskLevel: 'Modere' },
];

export const FB_AFRICA = [
  { id: 1, name: 'Republique Democratique du Congo', isoCode: 'COD', latitude: -4.04, longitude: 21.76, mineralsProduced: ['Cobalt', 'Coltan (Tantale)', 'Cuivre'], mineCount: 320, gdpMiningSharePct: 24, esgScore: 28, childLaborRisk: 85, deforestationIndex: 7.8, mainPartner: 'Chine', thermalEnergySharePct: 4 },
  { id: 2, name: 'Zimbabwe', isoCode: 'ZWE', latitude: -19.02, longitude: 29.15, mineralsProduced: ['Lithium', 'Or', 'Platine'], mineCount: 90, gdpMiningSharePct: 12.5, esgScore: 35, childLaborRisk: 45, deforestationIndex: 4.2, mainPartner: 'Chine', thermalEnergySharePct: 35 },
  { id: 3, name: 'Afrique du Sud', isoCode: 'ZAF', latitude: -28.48, longitude: 24.68, mineralsProduced: ['Platine', 'Manganese', 'Or'], mineCount: 280, gdpMiningSharePct: 8, esgScore: 52, childLaborRisk: 20, deforestationIndex: 3.1, mainPartner: 'UE', thermalEnergySharePct: 80 },
  { id: 4, name: 'Mali', isoCode: 'MLI', latitude: 17.57, longitude: -3.99, mineralsProduced: ['Or'], mineCount: 70, gdpMiningSharePct: 9.5, esgScore: 40, childLaborRisk: 60, deforestationIndex: 2.5, mainPartner: 'Canada', thermalEnergySharePct: 45 },
  { id: 5, name: 'Rwanda', isoCode: 'RWA', latitude: -1.94, longitude: 29.87, mineralsProduced: ['Coltan (Tantale)', 'Etain'], mineCount: 45, gdpMiningSharePct: 6, esgScore: 48, childLaborRisk: 50, deforestationIndex: 3, mainPartner: 'UE', thermalEnergySharePct: 12 },
  { id: 6, name: 'Nigeria', isoCode: 'NGA', latitude: 9.08, longitude: 8.68, mineralsProduced: ['Etain', 'Plomb'], mineCount: 60, gdpMiningSharePct: 1.5, esgScore: 38, childLaborRisk: 55, deforestationIndex: 4, mainPartner: 'Chine', thermalEnergySharePct: 75 },
];

export const FB_DIRECTORY = [
  { name: 'Gebeya', type: 'Startup', country: 'Ethiopie', description: 'Plateforme de talents tech panafricaine' },
  { name: 'Africa Data Centres', type: 'Infrastructure', country: 'Multi-pays', description: 'Datacenters alimentes en partie par du solaire' },
  { name: 'WeeRecycle', type: 'ONG', country: 'Nigeria', description: 'Collecte et recyclage des DEEE' },
  { name: 'Lifi-LED Tunisie', type: 'PME', country: 'Tunisie', description: 'Solutions reseau bas carbone' },
  { name: 'Sun Exchange', type: 'Startup', country: 'Afrique du Sud', description: 'Financement solaire pour infrastructures' },
];

export const FB_SECTORS = [
  { name: 'IA & Cloud (GPU)', co2PerUnit: 320, mineralDependencies: ['Lithium', 'Cobalt', 'Neodyme', 'Cuivre'], growthRatePct: 38, criticalityScore: 95 },
  { name: 'Smartphones', co2PerUnit: 70, mineralDependencies: ['Cobalt', 'Coltan (Tantale)', 'Neodyme'], growthRatePct: 6, criticalityScore: 70 },
  { name: 'Vehicules electriques', co2PerUnit: 110, mineralDependencies: ['Lithium', 'Cobalt', 'Nickel', 'Cuivre'], growthRatePct: 25, criticalityScore: 88 },
  { name: 'Infrastructures 5G', co2PerUnit: 55, mineralDependencies: ['Coltan (Tantale)', 'Cuivre', 'Neodyme'], growthRatePct: 14, criticalityScore: 65 },
  { name: 'Energies renouvelables', co2PerUnit: 40, mineralDependencies: ['Neodyme', 'Cuivre', 'Lithium'], growthRatePct: 18, criticalityScore: 60 },
];

export const FB_ESG = [
  { operator: 'Google Cloud', environmental: 82, social: 71, governance: 78, global: 77 },
  { operator: 'Microsoft Azure', environmental: 79, social: 74, governance: 80, global: 78 },
  { operator: 'AWS', environmental: 68, social: 70, governance: 72, global: 70 },
  { operator: 'OVHcloud', environmental: 75, social: 66, governance: 70, global: 70 },
  { operator: 'Africa Data Centres', environmental: 54, social: 60, governance: 58, global: 57 },
];

export const FB_CERTIFICATIONS = [
  { name: 'EPEAT', scope: 'Equipements electroniques', region: 'Mondial' },
  { name: 'Energy Star', scope: 'Efficacite energetique', region: 'Mondial' },
  { name: 'TCO Certified', scope: 'Durabilite IT', region: 'Mondial' },
  { name: 'ISO 14001', scope: 'Management environnemental', region: 'Mondial' },
  { name: 'GreenStar', scope: 'Datacenters', region: 'Mondial' },
];

export const FB_POLICIES = [
  { region: 'UE', name: 'Critical Raw Materials Act', description: "Securiser l'approvisionnement en matieres premieres critiques" },
  { region: 'USA', name: 'Inflation Reduction Act (IRA)', description: 'Subventions a la chaine de valeur batteries / minerais' },
  { region: 'Chine', name: 'Controle des terres rares', description: "Quotas d'exportation et integration verticale" },
  { region: 'UE', name: 'Directive CSRD', description: 'Reporting de durabilite obligatoire' },
  { region: 'France', name: 'Loi Devoir de Vigilance', description: "Responsabilite sur la chaine d'approvisionnement" },
];

export const FB_CONFLICTS = [
  { zone: 'Est de la RDC', latitude: -1.7, longitude: 29.2, level: 'Eleve', description: 'Coltan, cobalt - conflits armes et mines artisanales' },
  { zone: 'Triangle du lithium', latitude: -23.0, longitude: -67.0, level: 'Modere', description: 'Lithium - tensions sur l\'eau et les communautes' },
  { zone: 'Mer de Chine meridionale', latitude: 13.0, longitude: 115.0, level: 'Modere', description: "Routes d'approvisionnement strategiques" },
];

export const FB_POSTS = [
  { id: 1, authorName: 'Aminata Diallo', title: 'Refroidissement par air libre a Dakar', content: 'Retour d\'experience sur un datacenter optimise pour le climat sahelien sans climatisation classique.', region: 'Afrique de l\'Ouest', likes: 42, createdAt: '2026-05-10T10:00:00Z' },
  { id: 2, authorName: 'Jean-Pierre Mukendi', title: 'Tracabilite du cobalt en RDC', content: 'Comment notre cooperative documente l\'origine ethique du cobalt artisanal.', region: 'Afrique Centrale', likes: 67, createdAt: '2026-05-12T10:00:00Z' },
  { id: 3, authorName: 'Sarah Cohen', title: 'Eco-conception des modeles IA', content: 'Reduire l\'empreinte des LLM via le pruning et la quantification.', region: 'Mondial', likes: 95, createdAt: '2026-05-15T10:00:00Z' },
];

export const FB_RESOURCES = [
  { type: 'Etude', title: 'Empreinte environnementale du numerique', source: 'The Shift Project' },
  { type: 'Guide', title: 'Bonnes pratiques Green IT', source: 'GreenIT.fr' },
  { type: 'Rapport', title: 'Electricity 2024', source: 'IEA' },
  { type: 'Dataset', title: 'Mineral Commodity Summaries', source: 'USGS' },
];

export const FB_BADGES = [
  { name: 'Pionnier Vert', criteria: 'Premiere empreinte calculee', tier: 'Bronze' },
  { name: 'Sobriete', criteria: 'Reduction de 20% de l\'empreinte', tier: 'Argent' },
  { name: 'Ambassadeur AfricaGreen', criteria: '10 contributions communautaires', tier: 'Or' },
];

// Client-side statistical projection mirroring the backend PredictionService,
// used as fallback for the Predictions module.
export function fbPredictMinerals(scenario) {
  const factor = { boom_ia: 2.2, ev: 1.6, sobriete: 0.7 }[scenario] ?? 1.0;
  return FB_MINERALS.map((m) => {
    const yearsBase = m.baseExhaustionYear - 2026;
    const adjusted = Math.max(3, yearsBase / factor);
    const year = 2026 + Math.round(adjusted);
    const risk = Math.max(0, Math.min(100, 100 - (adjusted / 50) * 100));
    return {
      mineral: m.name,
      scenario: scenario || 'normal',
      baseExhaustionYear: m.baseExhaustionYear,
      predictedExhaustionYear: year,
      yearsRemaining: Math.round(adjusted),
      riskScore: Math.round(risk),
      alertLevel: risk >= 90 ? 'CATASTROPHIQUE' : risk >= 70 ? 'CRITIQUE' : risk >= 30 ? 'MOYEN' : 'FAIBLE',
      confidenceLow: year - 4,
      confidenceHigh: year + 4,
    };
  });
}
