import React, { useEffect, useState } from 'react';

interface HeroProps {
  type: 'restaurant' | 'rooftop';
}

export const Hero: React.FC<HeroProps> = ({ type }) => {
  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);

  const restaurantSlogans = [
    "Une pizza qui cartonne, une envie de revenir",
    "Expérience culinaire incontournable de Bamako",
    "Depuis 30 ans, la passion de la pizza au cœur de Bamako"
  ];

  useEffect(() => {
    if (type === 'restaurant') {
      const interval = setInterval(() => {
        setCurrentSloganIndex((prev) => (prev + 1) % restaurantSlogans.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [type]);

  if (type === 'restaurant') {
    return (
      <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-black">
          <img
            src="/images/pizza-hero.jpg"
            alt="Pizza Chez Thierry"
            className="w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <div className="mb-4 inline-flex items-center gap-2 bg-amber-500/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-amber-500/30 text-amber-400 text-sm font-semibold tracking-wider uppercase">
            🍕 Restaurant Chez Thierry
          </div>
          
          <h1 className="text-4xl md:text-7xl font-playfair font-bold text-white mb-6 transition-all duration-1000 min-h-[120px] md:min-h-[160px] flex items-center leading-tight">
            "{restaurantSlogans[currentSloganIndex]}"
          </h1>

          <div className="flex gap-2 mt-4">
            {restaurantSlogans.map((_, index) => (
              <span
                key={index}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === currentSloganIndex ? 'w-8 bg-amber-500' : 'w-2 bg-white/30'
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-black">
        <img
          src="/images/rooftop-hero.jpg"
          alt="Rooftop Le Palmier"
          className="w-full h-full object-cover opacity-50 scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <div className="mb-6 inline-flex items-center gap-2 bg-amber-500/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-amber-500/30 text-amber-400 text-sm font-semibold tracking-wider uppercase animate-fade-in-up">
          🌇 Rooftop Le Palmier
        </div>

        <h1 className="relative text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase text-center leading-[1.1] md:leading-[1.05] max-w-full px-2 py-3" style={{ color: '#ff1493', filter: 'drop-shadow(0 0 20px rgba(255,20,147,0.8)) drop-shadow(0 0 40px rgba(255,20,147,0.5))' }}>
          <span className="absolute inset-0 bg-black/25 backdrop-blur-sm rounded-3xl -z-0" />
          <span className="relative z-10 flex flex-col items-center">
            <span className="animate-word inline-block tracking-[0.15em] sm:tracking-[0.2em]" style={{ animationDelay: '0.1s' }}>STOP</span>
            <span className="animate-word inline-block tracking-[0.15em] sm:tracking-[0.2em]" style={{ animationDelay: '0.25s' }}>THINKING</span>
            <span className="animate-word inline-block tracking-[0.15em] sm:tracking-[0.2em]" style={{ animationDelay: '0.4s' }}>START</span>
            <span className="animate-word inline-block tracking-[0.15em] sm:tracking-[0.2em]" style={{ animationDelay: '0.55s' }}>DRINKING</span>
          </span>
        </h1>

        <p className="text-amber-500 text-sm sm:text-base md:text-lg mt-8 font-bold tracking-widest uppercase bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full border border-amber-500/10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          Rooftop • Bar
        </p>
      </div>
    </div>
  );
};
