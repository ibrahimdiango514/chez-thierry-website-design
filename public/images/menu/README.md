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

Images générées par IA à partir des descriptions de l'affiche officielle (même plat, mêmes accompagnements, même présentation). Ce ne sont pas des photos du restaurant : à remplacer par les photos réelles dès qu'elles sont disponibles, en gardant les mêmes noms de fichiers.

État actuel :
- `plats-du-jour/` : `mardi-fakouye.jpg`, `mercredi-mafe.jpg`, `vendredi-riz-au-gras.jpg`, `dimanche-couscous-royal.jpg` (vérifiées). `jeudi-yassa.jpg` : **à produire** (chemin non déclaré pour l'instant dans `src/data.ts`).
- `dejeuner/` : `dimanche.jpg` (couscous royal, vérifiée). **À produire** : `mardi.jpg`, `mercredi.jpg`, `jeudi.jpg`, `vendredi.jpg`, `samedi.jpg` (une image par journée, entrée / plat / dessert). Tant qu'une image manque, aucune photo n'est affichée pour la journée (pas d'image cassée).

Les chemins sont déclarés dans `src/data.ts` (`WEEK_DAILY_DISHES`, `WEEKEND_DAILY_DISHES`, `DEJEUNER_JOURS`).
