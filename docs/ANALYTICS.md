# Analytics (Google Analytics 4)

Ce document décrit l'intégration de Google Analytics 4 (GA4) sur le site Chez Thierry x Le Palmier :
architecture, événements envoyés, règles de confidentialité, tests et actions à effectuer dans l'interface GA.

- Flux Web : « Chez Thierry x Le Palmier – Site Web »
- ID de mesure : `G-0X8Q5E2MNL` (défaut dans `src/analytics/ga4.ts`, surchargeable par `VITE_GA_MEASUREMENT_ID`)
- Site : https://chezthierryxlepalmier.com

---

## 1. Architecture

### Fichiers

| Fichier | Rôle |
| --- | --- |
| `src/analytics/ga4.ts` | Chargeur gtag.js, Consent Mode v2, sanitisation des paramètres, `trackEvent` / `trackEventOnce`, `useAnalyticsActive` |
| `src/analytics/consent.ts` | Lecture / écriture du choix utilisateur (localStorage), événement de réouverture du bandeau |
| `src/analytics/events.ts` | Catalogue des événements métier (seul endroit où les noms et paramètres sont définis) |
| `src/analytics/RouteAnalytics.tsx` | Envoie `page_view` à chaque visite de page (y compris retour arrière) |
| `src/analytics/useVisitId.ts` | Identifiant unique par navigation, base de la déduplication |
| `src/analytics/useSectionViews.ts` | Envoie `menu_section_view` quand une section du menu devient visible |
| `src/components/CookieConsent.tsx` | Bandeau de consentement (Accepter / Refuser, même poids visuel) |
| `src/vite-env.d.ts` | Typage de `VITE_GA_MEASUREMENT_ID` et `VITE_ASSISTANT_WEBHOOK_URL` |
| `src/main.tsx` | Appelle `initAnalytics()` avant le rendu React |

### Chargement

1. Avant tout chargement, `initAnalytics()` déclare le consentement **refusé par défaut** (Consent Mode v2) sur `window.dataLayer`.
2. **Aucune requête vers Google n'est faite tant que l'utilisateur n'a pas accepté.** Le script `gtag.js` n'est injecté dans la page (de façon asynchrone) qu'après un choix « Accepter ».
3. Si l'utilisateur a déjà accepté, le script est chargé dès l'ouverture de la page. S'il a refusé, rien n'est chargé.
4. Le snippet n'est **pas** dans `index.html` : le site reste un build Vite statique (`vite-plugin-singlefile`) et fonctionne sans GA si l'ID est absent.

### Compatibilité Netlify et SPA

- Pas de modification de `netlify.toml`, `public/_headers` ou `public/_redirects`.
- Le `page_view` est envoyé **manuellement** par `RouteAnalytics` à chaque changement de route (`send_page_view: false`). Cela évite les doubles comptages avec la mesure améliorée.
- La déduplication se fait sur un identifiant de visite (`useVisitId`) et non sur `location.key`, afin qu'un retour arrière produise bien une nouvelle vue.

### Consent Mode v2

| Signal | Valeur par défaut | Après « Accepter » | Après « Refuser » |
| --- | --- | --- | --- |
| `analytics_storage` | denied | granted | denied |
| `ad_storage` | denied | denied | denied |
| `ad_user_data` | denied | denied | denied |
| `ad_personalization` | denied | denied | denied |

- Les signaux publicitaires restent **toujours** à `denied` : aucun remarketing, aucune personnalisation publicitaire, `allow_google_signals` et `allow_ad_personalization_signals` à `false`.
- Le choix est stocké dans le localStorage (clé `ct_consent_analytics_v1`, `{ choice, savedAt }`) et expire après **6 mois**, puis le bandeau est de nouveau proposé.
- Le lien **« Gérer les cookies »** du pied de page rouvre le bandeau.
- Retirer son consentement : signaux remis à `denied`, suppression des cookies `_ga*`, `_gid`, `_gat*`, puis rechargement de la page. Vérifié : aucune requête gtag après retrait.
- Durée de vie des cookies GA : 390 jours (≤ 13 mois, recommandation CNIL).

### Déduplication

- Un `Set` mémorise les clés déjà envoyées pendant la session : `page_view:<visite>`, `menu_view:<visite>`, `menu_section_view:<visite>:<section>`.
- Une clé n'est marquée envoyée que si l'analytics est actif. Une acceptation tardive envoie donc les vues en attente.
- `begin_checkout` est déclenché une fois par ouverture de la commande (effet à l'ouverture de la modale).

---

## 2. Événements

Tous les événements sont définis dans `src/analytics/events.ts`. Les paramètres sont nettoyés par `sanitize()` avant envoi (voir section 3).

| Événement | Déclencheur | Paramètres principaux |
| --- | --- | --- |
| `page_view` | Chaque changement de route | `page_location` (origine + chemin, sans query string), `page_path`, `page_title` |
| `menu_view` | Arrivée sur `/menu` | `menu_name` = `menu_digital` |
| `menu_section_view` | Une section du menu devient visible (≥ 25 %), une fois par visite | `section_name` (ex. `plat_du_jour`, `apero`, `restaurant_menu`, `rooftop_menu`, `pause_gourmande`) |
| `begin_checkout` | Ouverture du formulaire de commande (accueil ou `/menu`) | `currency` = `XOF`, `value`, `item_count`, `order_scope` (`restaurant` / `rooftop` / `mixed`), `items` |
| `whatsapp_click` | Clic sur un lien/bouton WhatsApp | `placement`, `business_unit`, `order_mode` (si pertinent) |
| `phone_click` | Clic sur un lien `tel:` | `placement`, `business_unit`, `order_mode` (si pertinent) |
| `order_phone_declared` | Bouton « Terminer » après le choix d'un appel | `currency`, `value`, `order_scope`, `order_mode`, `item_count` |

### Valeurs de `placement`

| Valeur | Emplacement |
| --- | --- |
| `contact_block` | Bloc contact de l'accueil |
| `floating_phone_menu` | Bouton téléphone flottant de l'accueil |
| `general_info` | Informations générales |
| `footer` | Pied de page |
| `checkout_order` | Formulaire de commande (WhatsApp / téléphone) |
| `checkout_recap` | Récapitulatif de commande (WhatsApp / téléphone) |
| `menu_page_help` | Aide téléphonique sur `/menu` |
| `qr_share_fallback` | Partage du QR code via WhatsApp (uniquement quand le partage natif n'est pas disponible) |
| `dish_order_mode` | Réservé : `OrderModeButtons` n'est actuellement pas utilisé |

### Règles de sémantique (importantes)

- **Un clic WhatsApp n'est jamais une commande confirmée.** Il signifie seulement une intention de contact. Le site n'a pas de backend ni de numéro de commande : **aucun événement `purchase` n'est envoyé**.
- `order_phone_declared` signifie « l'utilisateur déclare avoir choisi d'être appelé ». Il n'est pas une commande confirmée et ne doit pas être présenté comme telle.
- `begin_checkout` signifie « le formulaire de commande s'est ouvert avec au moins un article ».

---

## 3. Confidentialité

Principes appliqués :

- **Aucune donnée personnelle identifiable** n'est envoyée : pas de nom, d'adresse, de numéro de téléphone, de texte de message WhatsApp, ni de contenu de commande libre.
- `sanitize()` (dans `ga4.ts`) s'applique récursivement à tous les paramètres : les adresses e-mail, les numéros de téléphone (`+223…`, groupes de chiffres, séquences de 8 à 15 chiffres) sont remplacés par `[redacted]`.
- `page_location` ne contient pas de query string (pas de paramètres d'URL envoyés).
- Les liens WhatsApp et téléphone déclenchent l'événement, mais leur contenu (numéro, texte pré-rempli) n'est jamais transmis.
- Pas de remarketing ni de personnalisation publicitaire, y compris après consentement.
- Le bandeau indique clairement la finalité (mesure d'audience), l'absence de publicité et de remarketing, et comment changer d'avis.
- Le refus est aussi simple que l'acceptation : deux boutons strictement identiques (format, couleur, police, 44 px de haut minimum).
- Le bandeau reste au-dessus de la barre « Commander » sur mobile (il ne masque jamais les boutons de choix). Il est placé à 104 px du bas de l'écran et fait environ 20 à 37 % de la hauteur selon le téléphone.
- Le lien « Gérer les cookies » du pied de page rouvre le bandeau (cible de 44 px).

Contrôles automatisés effectués : `redact-check` (8 numéros masqués, IP / ports / prix / quantités / dates conservés) et contrôle E2E de l'absence de numéro, de nom ou de texte WhatsApp dans les requêtes.

---

## 4. Configuration

Fichier `.env.example` (bloc GA commenté) :

```bash
# Optionnel : ID de mesure GA4 (défaut : G-0X8Q5E2MNL)
# VITE_GA_MEASUREMENT_ID=G-0X8Q5E2MNL
```

- Variables lues au build par Vite. Sur Netlify, les variables d'environnement du site sont injectées au moment du build.
- Aucune configuration Netlify (`netlify.toml`, `_headers`, `_redirects`) n'est requise.
- Si `VITE_GA_MEASUREMENT_ID` est vide, l'ID par défaut (`G-0X8Q5E2MNL`) est utilisé. Il n'existe pas de commutateur « désactiver GA » distinct : sans consentement, rien n'est chargé ni envoyé.
- Mode debug : actif en développement et sur le site avec `?ga_debug=1` (événements visibles uniquement dans DebugView).

---

## 5. Tests

### Vérifications automatisées (build local, Chromium headless)

- **Non-régression visuelle** : captures par fenêtre de défilement (390×844 et 1280×800) comparées pixel à pixel à la version précédente. Écarts attendus uniquement : la zone carte (affichage à la demande) et le pied de page (bouton « Gérer les cookies »). Le haut de page est strictement identique.
- **Parcours E2E** (74 vérifications) : chargement de la balise, page_view à chaque navigation (y compris retour arrière), `menu_view` unique, `menu_section_view`, `begin_checkout` une fois par ouverture, clics WhatsApp et téléphone sur les placements listés, `order_phone_declared`, absence de doublons, absence de données personnelles dans les paramètres.
- **Partage QR** : repli `wa.me` tracé une seule fois (`qr_share_fallback`).
- **Consentement** : aucune requête Google avant acceptation ; après refus ou retrait, aucune requête gtag.

### Vérifications manuelles à faire sur le site déployé

1. Ouvrir https://chezthierryxlepalmier.com en navigation privée.
2. Vérifier qu'aucune requête vers `googletagmanager.com` n'est faite avant d'avoir accepté.
3. Accepter, puis ouvrir GA4 > Configurer > DebugView (ou ajouter `?ga_debug=1` à l'URL) et vérifier : `page_view`, `menu_view`, `whatsapp_click`, `phone_click`, `begin_checkout`.
4. Naviguer entre accueil, `/menu` et les pages secondaires : un `page_view` par page.
5. Vérifier que `order_phone_declared` n'apparaît qu'après le bouton « Terminer ».
6. Vérifier dans les paramètres de flux que la rédaction des données est active (voir section 6).

Note : la collecte réelle n'a pas pu être vérifiée depuis l'environnement de développement. Elle doit être confirmée sur le site déployé (étape 3 ci-dessus).

---

## 6. Requêtes tierces et polices (hors Google Analytics)

Avant tout consentement, le site ne fait **aucune requête vers un domaine tiers** (vérifié en défilant la page entière, sur `/` et `/menu`).

| Élément | Comportement | État |
| --- | --- | --- |
| Google Fonts | Supprimé. La page n'a jamais appliqué Montserrat ni Playfair (les classes `font-playfair` n'étaient pas définies dans le thème Tailwind). Le rendu reste donc la pile système, inchangée. | Supprimé, aucun changement visuel |
| Carte Google Maps | Insérée seulement après le clic « Afficher la carte ». Lien « Ouvrir dans Google Maps » (nouvel onglet) disponible avant. | Chargement à la demande |
| Géolocalisation (commande, livraison) | Appels à `ipapi.co` et `nominatim.openstreetmap.org`, uniquement après une action de l'utilisateur dans le formulaire de commande. | Inchangé, à examiner (voir ci-dessous) |
| Liens TikTok, Instagram, WhatsApp | Liens simples, aucune requête au chargement. | Inchangé |

Points à trancher :
- **Application de Playfair Display / Montserrat** : décision de design. Si vous voulez ces polices, il faut définir `--font-playfair` et `--font-sans` dans le thème, héberger les fichiers (licence SIL OFL) et accepter un changement visuel sur les titres.
- **Géolocalisation de livraison** : `ipapi.co` reçoit l'adresse IP de l'utilisateur. Une solution sans tiers serait préférable.
- **Politique de confidentialité** : aucune page n'existe dans le dépôt. Le bandeau ne contient donc pas de lien. À ajouter une fois le texte publié (responsable de traitement, contact, durées, droits).

## 7. Actions à effectuer dans l'interface GA4

| Action | Où | Pourquoi |
| --- | --- | --- |
| Désactiver « Clics sortants » | Admin > Flux de données > Mesure améliorée | Les clics WhatsApp / téléphone sont déjà suivis par le code ; évite les doublons |
| Désactiver « Modifications de page basées sur l'historique » | Mesure améliorée | Les `page_view` sont envoyés manuellement par la SPA ; évite les doubles comptages |
| Activer la rédaction des données | Flux de données > Rédaction des données | Masquer e-mails et paramètres d'URL (`phone`, `text`) par sécurité |
| Enregistrer les dimensions personnalisées | Admin > Définitions personnalisées | `placement`, `business_unit`, `order_mode`, `order_scope`, `section_name`, `menu_name` |
| Ne pas marquer comme conversions clés sans réserve | Événements | `whatsapp_click`, `phone_click` et `order_phone_declared` sont des intentions, pas des commandes |
| Vérifier DebugView et Realtime | Rapports > Temps réel | Confirmer la réception après déploiement |
| Définir la durée de conservation des données | Admin > Paramètres des données > Conservation | Recommandé : 14 mois maximum (RGPD / CNIL) |
| Vérifier la bannière de consentement | Admin > Flux de données | Cohérence avec le texte du bandeau |

---

## 8. Maintenance

- Ajouter un événement : le déclarer dans `events.ts` (nom, paramètres, types), appeler la fonction depuis le composant, et mettre à jour ce document.
- Ne jamais passer de texte libre, de numéro de téléphone ou de contenu WhatsApp dans un paramètre.
- Toute nouvelle page doit passer par la route React (`RouteAnalytics` s'occupe du `page_view`).
- Toute modification du bandeau doit rester conforme aux recommandations CNIL (refus aussi simple qu'acceptation, information claire sur la finalité).
