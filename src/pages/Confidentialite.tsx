import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-2">
    <h2 className="text-lg font-bold text-amber-400">{title}</h2>
    <div className="space-y-2 text-sm leading-relaxed text-slate-300">{children}</div>
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

      <main className="max-w-3xl mx-auto px-4 md:px-8 py-10 space-y-8">
        <h1 className="text-3xl font-bold text-white">Politique de confidentialité</h1>

        <p className="text-sm leading-relaxed text-slate-300">
          Ce site présente le restaurant Chez Thierry x Le Palmier, son menu, et permet de commander par WhatsApp ou par
          téléphone.
        </p>

        <Section title="Mesure de fréquentation">
          <p>
            Le site utilise Google Analytics pour savoir combien de personnes le visitent, quelles pages et quels menus
            sont consultés, et quelles actions sont faites (par exemple un clic sur un bouton WhatsApp ou téléphone).
            Ces statistiques servent à améliorer le site. Elles ne servent pas à la publicité.
          </p>
        </Section>

        <Section title="Vos choix">
          <p>
            Au premier passage, un bandeau vous demande si vous acceptez ou refusez les cookies de mesure. Les deux
            boutons ont le même poids : refuser est aussi simple qu'accepter. Si vous refusez, Google Analytics n'est pas
            chargé.
          </p>
          <p>
            Vous pouvez changer d'avis à tout moment avec le lien « Gérer les cookies » en bas de page. Votre choix est
            conservé six mois.
          </p>
        </Section>

        <Section title="Clics WhatsApp et téléphone">
          <p>
            Un clic sur un bouton WhatsApp ou téléphone peut être comptabilisé comme une interaction. Seul le fait du clic
            est enregistré : ni le numéro de téléphone ni le contenu d'un message ne sont transmis.
          </p>
        </Section>

        <Section title="Informations personnelles">
          <p>
            Vos informations personnelles ne sont pas envoyées à Google Analytics : nom, numéro de téléphone, adresse,
            adresse e-mail ou contenu de vos messages.
          </p>
          <p>
            Si vous commandez, les informations que vous saisissez (nom, téléphone, adresse, message) sont envoyées au
            restaurant par WhatsApp ou par appel téléphonique, pour traiter votre commande.
          </p>
        </Section>

        <Section title="Localisation">
          <p>
            La localisation n'est utilisée que si vous la demandez, en choisissant l'option de localisation du formulaire de
            commande (« Ma position GPS » ou « Partager ma localisation »). Votre navigateur vous demande alors l'autorisation. Aucune localisation n'est faite
            automatiquement à l'ouverture du site.
          </p>
          <p>
            Si la position précise n'est pas disponible, une position approximative peut être obtenue à partir de votre
            adresse IP, par le service ipapi.co.
          </p>
        </Section>

        <Section title="Carte">
          <p>
            La carte Google Maps n'est chargée qu'après que vous avez cliqué sur « Afficher la carte ».
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Pour toute question sur vos informations, contactez le restaurant par les coordonnées affichées sur le site.
          </p>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
