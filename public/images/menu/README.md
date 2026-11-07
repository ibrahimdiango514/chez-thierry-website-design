# 📸 Photos des plats — Menu Digital

Déposez ici les photos des plats. **Aucune modification de code n'est nécessaire.**

## Convention de nommage

Le chemin de chaque plat est défini dans `src/data.ts` (propriété `image`).
Par défaut : `/images/menu/{restaurant|rooftop}/{nom-slugifie}.jpg`

Exemple :
- `restaurant/marguerita.jpg` → pizza Marguerita
- `rooftop/smash-burger.jpg` → Smash Burger

## Règles
- Le nom de fichier doit correspondre **exactement** au chemin indiqué dans `src/data.ts`.
- Si le fichier n'existe pas, le site affiche automatiquement un placeholder élégant (rien ne casse).
- Plats spéciaux (ex: Couscous Royal) : conserver leur image existante (`/images/couscous-royal.jpg`).

## Plats du jour et menu Déjeuner (site principal)

Photos extraites des visuels officiels du restaurant (« Plats du jour » et « Menu Déjeuner »).

- `plats-du-jour/` : `mardi-fakouye.jpg`, `mercredi-mafe.jpg`, `jeudi-yassa.jpg`, `vendredi-riz-au-gras.jpg`, `dimanche-couscous-royal.jpg` (chemins déclarés dans `WEEK_DAILY_DISHES` / `WEEKEND_DAILY_DISHES`, `src/data.ts`).
- `dejeuner/` : une photo par journée (`mardi.jpg` … `dimanche.jpg`), déclarée dans `DEJEUNER_JOURS`, `src/data.ts`.

Ces images sont des recadrages des visuels fournis (résolution limitée). Pour un rendu optimal, remplacer par les photos originales du plat, en gardant le même nom de fichier.
