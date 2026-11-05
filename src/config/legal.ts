/* ─────────────────────────────────────────────────────────────
   ⚖️ INFORMATIONS JURIDIQUES — page /confidentialite
   ─────────────────────────────────────────────────────────────
   Ce fichier ne contient AUCUNE information inventée.
   • Chaque champ vide s'affiche sur le site comme « À VALIDER : … ».
   • Ne remplir qu'avec des informations confirmées par le responsable
     du restaurant (et par un juriste si nécessaire).
   • `validated` ne doit passer à `true` qu'après validation écrite.
   ───────────────────────────────────────────────────────────── */
export const LEGAL = {
  /** Passer à true uniquement après validation écrite du responsable. */
  validated: false,

  /** Date de la dernière mise à jour (JJ/MM/AAAA). */
  lastUpdated: '',

  // ── Responsable du traitement ─────────────────────────────
  controllerName: '',
  controllerLegalForm: '',
  controllerAddress: '',
  controllerRegistration: '', // RCCM / NIF, selon le statut
  controllerRepresentative: '',
  /** Adresse e-mail dédiée aux questions de données personnelles. */
  privacyContactEmail: '',

  // ── Traitements : bases légales et durées ─────────────────
  analyticsLegalBasis: '',
  analyticsRetention: '', // durée de conservation GA4 à régler dans l'interface GA
  orderLegalBasis: '',
  orderRetention: '',
  geolocationLegalBasis: '',

  // ── Destinataires et transferts ───────────────────────────
  hostingProvider: '', // hébergeur (Netlify) : lieu de traitement et journaux
  transfersOutsideMali: '',
  processorContractsConfirmed: false,

  // ── Droits, réclamations, sécurité ────────────────────────
  rightsContact: '', // où et comment exercer ses droits
  apdpContact: '', // coordonnées de l'APDP (Mali) à vérifier
  securityMeasures: '',
  minorsPolicy: '',
  gdprApplicability: '', // analyse du champ d'application du RGPD (publics européens)
};
