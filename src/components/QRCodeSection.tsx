import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Share2 } from 'lucide-react';

/* ── URLs officielles (production) ───────────────────────────────────── */
const LOGO_URL = '/images/logo.png';

export type QRVariant = 'site' | 'menu';

interface QRConfig {
  id: QRVariant;
  /** Nom affiché AROUND le QR (jamais dans les modules) */
  title: string;
  subtitle: string;
  caption: string;
  url: string;
  filename: string;
  emoji: string;
  usage: string;
}

const QR_CONFIGS: Record<QRVariant, QRConfig> = {
  site: {
    id: 'site',
    title: 'SITE OFFICIEL CHEZ THIERRY',
    subtitle: 'Scanner pour découvrir le restaurant',
    caption: 'Le site officiel du restaurant & rooftop : informations, menus, expérience et services.',
    url: 'https://chezthierryxlepalmier.com/',
    filename: 'QR-Site-Officiel-Chez-Thierry.png',
    emoji: '🏠',
    usage: 'Impression sur table, flyers et affiches',
  },
  menu: {
    id: 'menu',
    title: 'MENU DIGITAL CHEZ THIERRY',
    subtitle: 'Scanner pour consulter la carte et commander',
    caption: 'Le menu digital : toute la carte et la commande directement depuis votre table.',
    url: 'https://chezthierryxlepalmier.com/menu',
    filename: 'QR-Menu-Digital-Chez-Thierry.png',
    emoji: '📱',
    usage: 'Impression sur table, flyers et affiches',
  },
};

/** Rectangle arrondi (fallback si roundRect absent) */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}

/**
 * Génère le QR code PNG 2048px (qualité impression) avec le logo Chez Thierry
 * au centre (sur fond blanc pour préserver la lisibilité du scan).
 * Le nom n'est JAMAIS dessiné dans les modules du QR — il reste autour.
 */
async function generateQRWithLogo(url: string): Promise<string> {
  const qrDataUrl = await QRCode.toDataURL(url, {
    width: 2048,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: { dark: '#171717', light: '#ffffff' },
  });

  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');
  if (!ctx) return qrDataUrl;

  // 1) Dessiner le QR
  const qrImg = new Image();
  await new Promise<void>((res, rej) => {
    qrImg.onload = () => res();
    qrImg.onerror = () => rej(new Error('QR load'));
    qrImg.src = qrDataUrl;
  });
  ctx.drawImage(qrImg, 0, 0, 2048, 2048);

  // 2) Logo Chez Thierry au centre (~18% de la taille → compatible scan en niveau H)
  const logoSize = Math.round(2048 * 0.18);
  const pad = Math.round(logoSize * 0.12);
  const x = (2048 - logoSize) / 2;
  const y = (2048 - logoSize) / 2;

  // Fond blanc arrondi autour du logo (préserve les modules de correction)
  ctx.fillStyle = '#ffffff';
  ctx.save();
  roundRect(ctx, x - pad, y - pad, logoSize + pad * 2, logoSize + pad * 2, 48);
  ctx.fill();
  ctx.restore();

  // Logo lui-même (arrondi)
  const logo = new Image();
  await new Promise<void>((res, rej) => {
    logo.onload = () => res();
    logo.onerror = () => rej(new Error('logo load'));
    logo.src = LOGO_URL;
  });
  ctx.save();
  roundRect(ctx, x, y, logoSize, logoSize, 32);
  ctx.clip();
  ctx.drawImage(logo, x, y, logoSize, logoSize);
  ctx.restore();

  return canvas.toDataURL('image/png');
}

/** Télécharge une image dataURL (PNG HD) dans la galerie/téléphone */
function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/** Partage natif (WhatsApp, réseaux…) avec repli WhatsApp */
async function shareQR(cfg: QRConfig) {
  const text = `${cfg.emoji} ${cfg.title}\n${cfg.subtitle}\n${cfg.url}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: cfg.title, text, url: cfg.url });
      return;
    } catch {
      /* partage annulé */
    }
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

interface QRCodeSectionProps {
  /** 'site' → QR du site officiel (page d'accueil) ; 'menu' → QR du menu digital (/menu) */
  variant: QRVariant;
}

export const QRCodeSection: React.FC<QRCodeSectionProps> = ({ variant }) => {
  const cfg = QR_CONFIGS[variant];
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    generateQRWithLogo(cfg.url)
      .then((d) => {
        if (!cancelled) setQrDataUrl(d);
      })
      .catch(() => {
        /* erreur : on garde l'état vide */
      });
    return () => {
      cancelled = true;
    };
  }, [cfg.url]);

  return (
    <section className="bg-neutral-950 text-white py-14 px-4 md:px-8 border-t border-neutral-900">
      <div className="max-w-lg mx-auto">
        {/* En-tête avec logo + marque */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <img
            src={LOGO_URL}
            alt="Chez Thierry x Le Palmier"
            className="h-12 w-12 rounded-full object-cover border-2 border-amber-500/30 shadow-lg"
          />
          <div className="text-left">
            <p className="font-playfair text-sm font-bold text-amber-500 tracking-wider leading-tight">
              CHEZ THIERRY <span className="text-white">x</span> LE PALMIER
            </p>
            <p className="text-[11px] text-neutral-500 font-semibold uppercase tracking-widest">
              Bamako · Restaurant & Rooftop
            </p>
          </div>
        </div>

        {/* Carte QR unique */}
        <div className="bg-neutral-900/40 border border-neutral-800/70 hover:border-amber-500/30 rounded-3xl p-6 md:p-8 flex flex-col items-center text-center transition-all shadow-2xl">
          {/* Nom clairement visible AU-DESSUS du QR (jamais dans les modules) */}
          <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-wide">
            {cfg.emoji} {cfg.title}
          </h2>
          <p className="text-slate-300 text-sm md:text-base font-light mt-2">{cfg.subtitle}</p>
          <p className="text-slate-500 text-xs mt-1 max-w-sm leading-relaxed">{cfg.caption}</p>

          {/* QR code (logo au centre) */}
          <div className="bg-white p-3 rounded-2xl shadow-2xl mt-6 mb-3">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={cfg.title}
                className="w-60 h-60 md:w-64 md:h-64 rounded-lg"
                width={2048}
                height={2048}
              />
            ) : (
              <div className="w-60 h-60 md:w-64 md:h-64 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400 text-sm">
                Génération…
              </div>
            )}
          </div>

          {/* URL sous le QR */}
          <p className="text-[11px] text-neutral-500 font-mono break-all max-w-full mb-4">{cfg.url}</p>

          {/* Boutons */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => qrDataUrl && downloadDataUrl(qrDataUrl, cfg.filename)}
              disabled={!qrDataUrl}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-sm px-5 py-3 rounded-xl active:scale-95 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              Télécharger (PNG HD)
            </button>
            <button
              onClick={() => shareQR(cfg)}
              className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 hover:border-amber-500 text-slate-200 hover:text-white font-bold text-sm px-5 py-3 rounded-xl active:scale-95 transition-all"
            >
              <Share2 className="w-4 h-4" />
              Partager
            </button>
          </div>
        </div>

        {/* Note d'usage */}
        <p className="text-center text-[11px] text-neutral-600 mt-6 leading-relaxed">
          💡 {cfg.emoji} {cfg.usage} — PNG haute qualité (2048 px).
          <br />
          Pointe vers : <span className="text-neutral-500 font-mono">{cfg.url}</span>
        </p>
      </div>
    </section>
  );
};
