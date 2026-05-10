import React from 'react';
export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 text-slate-400 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Logo and Brand */}
        <div className="text-center md:text-left">
          <h3 className="font-playfair text-xl font-bold text-white mb-2 tracking-wide">
            CHEZ THIERRY <span className="text-amber-500">X</span> LE PALMIER
          </h3>
          <p className="text-xs text-neutral-500 max-w-xs font-light mb-2">
            L'excellence culinaire haut de gamme et l'ambiance festive réunies au cœur de Bamako.
          </p>
          <p className="text-[11px] text-amber-500 font-semibold flex items-center justify-center md:justify-start gap-1">
            <span>📍</span> Rue 548, Quinzambougou, Bamako, Mali
          </p>
          <p className="text-[11px] text-slate-300 mt-1 flex items-center justify-center md:justify-start gap-1">
            <span>✉️</span> <a href="mailto:chezthierryresto@gmail.com" className="hover:text-amber-400 underline transition-colors">chezthierryresto@gmail.com</a>
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <a href="tel:+22366427777" className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 hover:border-amber-500 text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all">
              <span>📞</span> Restaurant
            </a>
            <a href="tel:+22376222777" className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 hover:border-amber-500 text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all">
              <span>📞</span> Rooftop
            </a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chez+Thierry,+Rue+548,+Quinzambougou,+Bamako,+Mali" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 hover:border-amber-500 text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all">
              <span>🗺️</span> Maps
            </a>
          </div>
        </div>

        {/* Profil Officiel */}
        <div className="text-center md:text-left text-xs bg-neutral-900/40 p-4 rounded-xl border border-neutral-900/60 max-w-xs">
          <h4 className="font-bold text-amber-400 mb-1 tracking-wider text-xs uppercase">✨ PROFIL OFFICIEL</h4>
          <p className="text-white font-bold mb-1 text-[11px]">Chez Thierry X Le Palmier</p>
          <p className="text-neutral-500 text-[10px] mb-2">Restaurant & Rooftop</p>
          <p className="text-slate-300 text-[10px] leading-relaxed">
            Bar à cocktails • Snacks • Grillades • Pizzeria
          </p>
        </div>

        {/* Social Networks Links */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            Suivez-nous sur les réseaux
          </span>
          <div className="flex items-center gap-4">
            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@chez_tchierry?_r=1&_t=ZS-95vI7ZXa0W5"
              target="_blank"
              rel="noreferrer"
              className="bg-neutral-900 hover:bg-neutral-800 p-3 rounded-full text-slate-300 hover:text-white border border-neutral-800 hover:border-neutral-700 transition-all shadow-md flex items-center gap-2 text-sm font-semibold"
            >
              {/* Custom TikTok SVG since lucide doesn't have it */}
              <svg 
                className="w-5 h-5 fill-current" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.06-.03-.11-.07-.17-.1v9.83c.02 4.59-3.28 8.64-7.84 9.24-5.41.71-10.35-3.37-10.35-8.82.03-4.43 3.44-8.17 7.85-8.51.1-.01.21-.01.31-.02v4.13c-2.1.25-3.65 2.1-3.48 4.22.18 2.3 2.19 3.93 4.46 3.63 1.83-.24 3.14-1.76 3.12-3.6V0z"/>
              </svg>
              <span>TikTok</span>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/chez_thierry_x_le_palmier?igsh=MWVkNnVpN3oyNGNnZw=="
              target="_blank"
              rel="noreferrer"
              className="bg-neutral-900 hover:bg-neutral-800 p-3 rounded-full text-slate-300 hover:text-white border border-neutral-800 hover:border-neutral-700 transition-all shadow-md flex items-center gap-2 text-sm font-semibold"
            >
              <svg 
                className="w-5 h-5 text-amber-500 fill-none stroke-current stroke-2" 
                viewBox="0 0 24 24" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>Instagram</span>
            </a>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto mt-8 pt-4 border-t border-neutral-900/60 text-center text-[10px] text-neutral-600">
        © {new Date().getFullYear()} Chez Thierry & Le Palmier Rooftop Bamako. Tous droits réservés.
      </div>
    </footer>
  );
};
