import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LEGAL } from '../config/legal';
import { Footer } from '../components/Footer';

/** Affiche la valeur validée, ou un repère « À VALIDER » visible tant qu'elle est vide. */
const Pending: React.FC<{ value: string; label: string }> = ({ value, label }) =>
  value.trim() ? (
    <>{value}</>
  ) : (
    <span className="inline-block rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 px-1.5 py-0.5 text-xs font-bold">
      À VALIDER : {label}
    </span>
  );

const Section: React.FC<{ id: string; title: string; children: React.ReactNode }> = ({ id, title, children }) => (
  <section id={id} className="space-y-3">
    <h2 className="text-lg font-bold text-amber-400">{title}</h2>
    <div className="space-y-3 text-sm leading-relaxed text-slate-300">{children}</div>
  </section>
);

export default function Confidentialite() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Politique de confidentialité | Chez Thierry & Le Palmier Rooftop';
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-100 font-sans antialiased">
      <header className="border-b border-neutral-900 px-4 md:px-8 py-4">
        <Link to="/" className="inline-flex items-center min-h-11 text-sm font-bold text-amber-400 hover:text-amber-300">
          ← Retour à l'accueil
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-4 md:px-8 py-10 space-y-10">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-white">Politique de confidentialité</h1>
          <p className="text-sm text-slate-400">
            Cette page explique quelles données le site chezthierryxlepalmier.com traite, pourquoi, et comment exercer
            vos choix.
          </p>
          {!LEGAL.validated && (
            <div role="status" className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-4 text-sm text-amber-200">
              <strong>Page en attente de validation.</strong> Les champs marqués « À VALIDER » doivent être confirmés par
              le responsable du restaurant avant publication. Tant que ce n'est pas fait, cette page ne constitue pas une
              politique de confidentialité validée.
            </div>
          )}
        </div>

        <Section id="responsable" title="1. Responsable du traitement">
          <ul className="list-disc pl-5 space-y-1">
            <li>Nom ou raison sociale : <Pending value={LEGAL.controllerName} label="raison sociale" /></li>
            <li>Forme juridique : <Pending value={LEGAL.controllerLegalForm} label="forme juridique" /></li>
            <li>Adresse : <Pending value={LEGAL.controllerAddress} label="adresse" /></li>
            <li>Immatriculation (RCCM / NIF) : <Pending value={LEGAL.controllerRegistration} label="immatriculation" /></li>
            <li>Représentant légal : <Pending value={LEGAL.controllerRepresentative} label="représentant légal" /></li>
            <li>Contact pour les données personnelles : <Pending value={LEGAL.privacyContactEmail} label="e-mail de contact" /></li>
          </ul>
        </Section>

        <Section id="donnees" title="2. Données traitées et finalités">
          <div className="rounded-xl border border-neutral-800 p-4 space-y-2">
            <h3 className="font-bold text-white">a) Mesure d'audience (Google Analytics 4), avec votre accord</h3>
            <p>
              Si vous acceptez, Google Analytics mesure les pages et menus consultés, les sections vues, les clics sur les
              boutons WhatsApp et téléphone (emplacement du bouton uniquement), l'ouverture du formulaire de commande
              (nombre d'articles, montant, noms des plats) et le choix « passer commande par téléphone ».
            </p>
            <p>
              <strong className="text-white">Jamais transmis à Google Analytics :</strong> votre nom, votre numéro de
              téléphone, votre adresse, votre e-mail, le contenu de vos messages WhatsApp.
            </p>
            <p>Finalité : mesurer la fréquentation et améliorer le site. Aucune publicité, aucun remarketing.</p>
            <p>
              Base légale : <Pending value={LEGAL.analyticsLegalBasis} label="base légale (consentement attendu)" />
            </p>
            <p>
              Durée de conservation : cookies 13 mois au plus ; données GA4 :{' '}
              <Pending value={LEGAL.analyticsRetention} label="durée de conservation GA4" />
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 p-4 space-y-2">
            <h3 className="font-bold text-white">b) Commande par WhatsApp ou par téléphone</h3>
            <p>
              Les informations que vous saisissez dans le formulaire (nom, téléphone, mode de retrait ou de livraison,
              adresse, message) sont envoyées par vous au restaurant, via WhatsApp ou par appel. Elles ne passent pas par
              Google Analytics.
            </p>
            <p>Finalité : traiter votre commande.</p>
            <p>
              Base légale : <Pending value={LEGAL.orderLegalBasis} label="base légale des commandes" />
            </p>
            <p>
              Durée de conservation : <Pending value={LEGAL.orderRetention} label="durée de conservation des commandes" />
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 p-4 space-y-2">
            <h3 className="font-bold text-white">c) Localisation, si vous la demandez</h3>
            <p>
              Uniquement si vous choisissez « ma position » dans le formulaire de commande. Votre navigateur vous demande
              d'abord l'autorisation. Vos coordonnées sont alors envoyées à OpenStreetMap (service Nominatim) pour obtenir
              une adresse. Si la localisation précise échoue, une localisation approximative est obtenue à partir de votre
              adresse IP par le service ipapi.co (société américaine Kloudend, Inc.).
            </p>
            <p>Finalité : proposer une adresse de livraison. Aucun appel n'est fait au chargement de la page.</p>
            <p>
              Base légale : <Pending value={LEGAL.geolocationLegalBasis} label="base légale de la localisation" />
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 p-4 space-y-2">
            <h3 className="font-bold text-white">d) Carte Google Maps</h3>
            <p>
              La carte n'est chargée qu'après votre clic sur « Afficher la carte ». Google peut alors recevoir des
              informations de connexion, comme votre adresse IP.
            </p>
          </div>
        </Section>

        <Section id="destinataires" title="3. Destinataires et sous-traitants">
          <ul className="list-disc pl-5 space-y-1">
            <li>Google (Google Analytics, et Google Maps après clic) : États-Unis.</li>
            <li>Kloudend, Inc. (ipapi.co), en cas de localisation approximative : États-Unis.</li>
            <li>OpenStreetMap Foundation (Nominatim), en cas de localisation par GPS : <Pending value="" label="pays de traitement à confirmer" /></li>
            <li>WhatsApp (Meta), pour les commandes envoyées par WhatsApp.</li>
            <li>Hébergeur du site (Netlify) : <Pending value={LEGAL.hostingProvider} label="hébergeur et journaux de connexion" /></li>
            <li>Le restaurant Chez Thierry & Le Palmier, destinataire des commandes.</li>
          </ul>
          <p>
            Contrats ou clauses avec ces sous-traitants :{' '}
            <Pending
              value={LEGAL.processorContractsConfirmed ? 'confirmés' : ''}
              label="confirmer les contrats ou conditions de chaque prestataire"
            />
          </p>
          <p>
            Transferts hors du Mali : <Pending value={LEGAL.transfersOutsideMali} label="garanties des transferts" />
          </p>
        </Section>

        <Section id="cookies" title="4. Cookies et traceurs">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <code>_ga</code> et <code>_ga_…</code> : Google Analytics, avec votre accord. Durée : 13 mois au plus.
            </li>
            <li>
              Stockage local <code>ct_consent_analytics_v1</code> : enregistre votre choix, pendant 6 mois.
            </li>
          </ul>
          <p>Aucun cookie publicitaire. Retirer votre accord supprime les cookies Google Analytics.</p>
        </Section>

        <Section id="droits" title="5. Vos droits et vos choix">
          <p>
            Vous pouvez à tout moment retirer votre accord à la mesure d'audience, avec le bouton « Gérer les cookies » en
            bas de page. La loi n° 2013-015 du 21 mai 2013 sur la protection des données à caractère personnel au Mali
            prévoit notamment les droits d'accès, de rectification, de suppression et d'opposition.
          </p>
          <p>
            Pour exercer vos droits : <Pending value={LEGAL.rightsContact} label="adresse ou e-mail pour exercer les droits" />
          </p>
          <p>
            Réclamation : Autorité de Protection des Données à caractère Personnel (APDP), Mali.{' '}
            <Pending value={LEGAL.apdpContact} label="coordonnées APDP à vérifier" />
          </p>
        </Section>

        <Section id="divers" title="6. Autres informations">
          <p>
            Sécurité : <Pending value={LEGAL.securityMeasures} label="mesures de sécurité" />
          </p>
          <p>
            Mineurs : <Pending value={LEGAL.minorsPolicy} label="politique relative aux mineurs" />
          </p>
          <p>
            RGPD (publics situés dans l'Union européenne) :{' '}
            <Pending value={LEGAL.gdprApplicability} label="analyse du champ d'application du RGPD" />
          </p>
          <p>
            Dernière mise à jour : <Pending value={LEGAL.lastUpdated} label="date de mise à jour" />
          </p>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
