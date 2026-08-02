import React, { useState } from 'react';

/** Emojis par catégorie — identité visuelle partagée (Menu Digital + site principal) */
export const CATEGORY_EMOJIS: Record<string, string> = {
  // Restaurant
  Pizzas: '🍕',
  Entrées: '🥗',
  Plats: '🍽️',
  'Les plus de chez Thierry': '🌟',
  'Les temporelles': '🍲',
  "Suppléments d'accompagnement": '🍟',
  Desserts: '🍰',
  'Vins bouteilles': '🍷',
  'Vins en pichet et au verre': '🥂',
  'Cocktails alcoolisés': '🍹',
  // Rooftop
  'Burgers & Fried Food': '🍔',
  'Grill & African Touch': '🍢',
  'Mocktails - Sans alcool': '🧃',
  'Cocktails - Avec alcool': '🍸',
  // Spécialités
  'Plat Signature': '🌟',
};

/**
 * Image d'un plat avec placeholder automatique :
 * - si la photo existe, elle s'affiche ;
 * - sinon (fichier pas encore déposé), un placeholder élégant est montré
 *   et le nom / description / prix restent visibles.
 */
export const DishImage: React.FC<{ src?: string; alt: string; emoji: string }> = ({
  src,
  alt,
  emoji,
}) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-neutral-900 to-neutral-950 select-none">
        <span className="text-4xl opacity-60">{emoji}</span>
        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-600">
          Photo à venir
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      onError={() => setFailed(true)}
    />
  );
};
