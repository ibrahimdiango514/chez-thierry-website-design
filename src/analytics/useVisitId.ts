import { useRef } from 'react';
import { useLocation } from 'react-router-dom';

let visitCounter = 0;

/**
 * Identifiant unique d'une « visite » de page, utilisé pour n'envoyer chaque
 * événement de page qu'une seule fois.
 *
 * Il change à chaque navigation, y compris le retour arrière / avant : React
 * Router recrée alors l'objet `location`, alors que `location.key` peut être
 * identique à celui d'une entrée déjà visitée (ce qui ferait perdre la pvue).
 * Stable pendant le rendu et les doubles exécutions de StrictMode.
 */
export function useVisitId(): string {
  const location = useLocation();
  const ref = useRef<{ location: ReturnType<typeof useLocation> | null; id: string }>({
    location: null,
    id: '',
  });
  if (ref.current.location !== location) {
    visitCounter += 1;
    ref.current = { location, id: `${Date.now().toString(36)}-${visitCounter}` };
  }
  return ref.current.id;
}
