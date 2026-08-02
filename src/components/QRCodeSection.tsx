import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Share2 } from 'lucide-react';

/* ── URLs officielles (production) ───────────────────────────────────── */
const SITE_URL = 'https://chezthierryxlepalmier.com';
const MENU_URL = 'https://chezthierryxlepalmier.com/menu';

interface QRItem {
  id: 'site' | 'menu';
  title: string;
  caption: string;
  url: string;
  emoji: string;
  filename: string;
}

const QR_ITEMS: QRItem[] = [
  {
    id: 'site',
    title: 'Site Officiel Chez Thierry',
    caption: 'Découvrez le restaurant, nos informations, l’expérience et nos services.',
    url: SITE_URL,
    emoji: '🏠',
    filename: 'QR-Site-Officiel-Chez-Thierry.png',
  },
  {
    id: 'menu',
    title: 'Menu Digital Chez Thierry',
    caption: 'Commandez directement depuis votre table : scannez, consultez, commandez.',
    url: MENU_URL,
    emoji: '📱',
    filename: 'QR-Menu-Digital-Chez-Thierry.png',
  },
];

/** Génère un QR code en PNG haute résolution (2048 px — prêt pour l'impression) */
async function generateQR(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 2048,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: { dark: '#171717', light: '#ffffff' },
  });
}

/** Télécharge une image dataURL (PNG) dans la galerie/téléphone */
function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/** Partage natif (WhatsApp, réseaux sociaux…) avec repli WhatsApp */
async function shareQR(item: QRItem) {
  const text = `📱 ${item.title} — ${item.caption}\n${item.url}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: item.title, text, url: item.url });
      return;
    } catch {
      /* partage annulé : on ne fait rien */
    }
  }
  // Repli : lien WhatsApp avec message pré-rempli
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

export const QRCodeSection: React.FC = () => {
  const [qrImages, setQrImages] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const results: Record<string, string> = {};
      for (const item of QR_ITEMS) {
        try {
          results[item.id] = await generateQR(item.url);
        } catch {
          /* erreur de génération : on laisse vide (affichera le placeholder) */
        }
      }
      if (!cancelled) setQrImages(results);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-neutral-950 text-white py-14 px-4 md:px-8 border-t border-neutral-900">
      <div className="max-w-5xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-10">
          <img
            src="/images/logo.png"
            alt="Chez Thierry x Le Palmier"
            className="h-14 w-14 rounded-full object-cover border-2 border-amber-500/30 shadow-lg mx-auto mb-4"
          />
          <h2 className="text-2xl md:text-3xl font-bold font-playfair text-amber-400 mb-2">
            📱 Nos QR Codes
          </h2>
          <p className="text-slate-400 text-sm md:text-base font-light max-w-xl mx-auto">
            Deux accès rapides, à télécharger et à partager. Scannez avec l'appareil photo de votre téléphone.
          </p>
        </div>

        {/* Les deux QR codes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {QR_ITEMS.map((item) => (
            <div
              key={item.id}
              className="bg-neutral-900/40 border border-neutral-800/70 hover:border-amber-500/30 rounded-3xl p-6 flex flex-col items-center text-center transition-all shadow-xl"
            >
              {/* Nom + légende */}
              <div className="mb-4">
                <h3 className="text-lg md:text-xl font-extrabold text-white flex items-center justify-center gap-2">
                  <span className="text-xl">{item.emoji}</span>
                  {item.title}
                </h3>
                <p className="text-slate-400 text-xs mt-1.5 max-w-xs leading-relaxed">{item.caption}</p>
              </div>

              {/* QR code (PNG HD) */}
              <div className="bg-white p-3 rounded-2xl shadow-2xl mb-3">
                {qrImages[item.id] ? (
                  <img
                    src={qrImages[item.id]}
                    alt={`QR Code ${item.title}`}
                    className="w-52 h-52 md:w-56 md:h-56 rounded-lg"
                    width={2048}
                    height={2048}
                  />
                ) : (
                  <div className="w-52 h-52 md:w-56 md:h-56 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400 text-sm">
                    Génération…
                  </div>
                )}
              </div>

              {/* URL affichée sous le QR */}
              <p className="text-[11px] text-neutral-500 font-mono mb-4 break-all max-w-full">
                {item.url}
              </p>

              {/* Boutons : Télécharger + Partager */}
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => qrImages[item.id] && downloadDataUrl(qrImages[item.id], item.filename)}
                  disabled={!qrImages[item.id]}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-sm px-5 py-3 rounded-xl active:scale-95 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  Télécharger (PNG HD)
                </button>
                <button
                  onClick={() => shareQR(item)}
                  className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 hover:border-amber-500 text-slate-200 hover:text-white font-bold text-sm px-5 py-3 rounded-xl active:scale-95 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  Partager
                </button>
              </div>

              {/* Légende claire */}
              <p className="text-[10px] text-neutral-500 mt-4 uppercase tracking-widest font-semibold">
                {item.id === 'menu' ? '→ Pour les tables, clients et commandes' : '→ Pour découvrir le restaurant'}
              </p>
            </div>
          ))}
        </div>

        {/* Note d'usage */}
        <p className="text-center text-[11px] text-neutral-600 mt-8 max-w-lg mx-auto leading-relaxed">
          💡 Les QR codes sont générés en haute qualité (PNG 2048 px) pour une impression nette.
          Téléchargez-les, puis imprimez-les sur vos tables, flyers ou affiches.
        </p>
      </div>
    </section>
  );
};
