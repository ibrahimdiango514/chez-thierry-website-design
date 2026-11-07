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

Images générées par IA à partir des descriptions de l'affiche officielle (même plat, mêmes accompagnements, même présentation), chacune vérifiée contre son libellé. Ce ne sont pas des photos du restaurant : à remplacer par les photos réelles dès qu'elles sont disponibles, en gardant les mêmes noms de fichiers.

- `plats-du-jour/` (déclarés dans `WEEK_DAILY_DISHES` / `WEEKEND_DAILY_DISHES`, `src/data.ts`) :
  - `mardi-fakouye.jpg` : fakouye à la viande de mouton
  - `mercredi-mafe.jpg` : mafé à la viande de bœuf
  - `jeudi-yassa.jpg` : yassa au poulet
  - `vendredi-riz-au-gras.jpg` : riz au gras façon thiep (poisson)
  - `dimanche-couscous-royal.jpg` : couscous royal 3 viandes
- `dejeuner/` (déclarés dans `DEJEUNER_JOURS`, `src/data.ts`), une image par journée avec entrée, plat et dessert :
  - `mardi.jpg`, `mercredi.jpg`, `jeudi.jpg`, `vendredi.jpg`, `samedi.jpg`
  - `dimanche.jpg` : couscous royal (plat seul, même plat que le plat du jour du dimanche)

Si une image est absente, le site n'affiche pas de photo pour le plat ou la journée (aucune image cassée).
