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
