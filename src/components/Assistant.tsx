import React, { useEffect, useRef, useState } from 'react';
import { Send, X } from 'lucide-react';
import { MenuItem } from '../types';
import { ASSISTANT_CONFIG } from '../config/assistant';
import { Establishment } from '../lib/restaurantKnowledge';
import {
  getGreeting,
  respond,
  welcomeMessage,
  AssistantContext,
  AssistantState,
  ChatTurn,
} from '../lib/assistantEngine';

interface ChatMessage {
  id: number;
  from: 'user' | 'assistant';
  text: string;
}

interface AssistantProps {
  /** Contexte optionnel (panier) pour des réponses plus personnalisées */
  cartInfo?: AssistantContext;
  /**
   * Callback d'ajout au panier — appelé quand l'assistant ajoute un plat
   * (après confirmation du client). Permet de connecter l'assistant au
   * panier réel du site.
   */
  onAddToCart?: (item: MenuItem, section: Establishment) => void;
}

/** Suggestions rapides (discrètes, faciles à taper pour tous les âges) */
const QUICK_SUGGESTIONS = ['📖 Le menu', '🌟 Recommande-moi', '🍕 Les pizzas', '🍰 Les desserts', '🛒 Commander'];

let msgId = 0;

export const Assistant: React.FC<AssistantProps> = ({ cartInfo, onAddToCart }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleOut, setBubbleOut] = useState(false);
  const [showWave, setShowWave] = useState(false);
  const [pop, setPop] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [engineState, setEngineState] = useState<AssistantState>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  /* ── Bulle de bienvenue + salutation 👋 périodique ─────────────────── */
  useEffect(() => {
    const inT = setTimeout(() => setShowBubble(true), ASSISTANT_CONFIG.bubbleDelay);
    const outT = setTimeout(
      () => {
        setBubbleOut(true);
        setTimeout(() => {
          setShowBubble(false);
          setBubbleOut(false);
        }, 450);
      },
      ASSISTANT_CONFIG.bubbleDelay + ASSISTANT_CONFIG.bubbleDuration
    );
    return () => {
      clearTimeout(inT);
      clearTimeout(outT);
    };
  }, []);

  useEffect(() => {
    if (open) return;
    const first = setTimeout(() => setShowWave(true), ASSISTANT_CONFIG.bubbleDelay + 8000);
    const interval = setInterval(() => {
      setShowWave(false);
      setTimeout(() => setShowWave(true), 120);
      setTimeout(() => setShowWave(false), 2600);
    }, 16000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [open]);

  /* ── Historique pour le contexte conversationnel ───────────────────── */
  const historyRef = useRef<ChatTurn[]>([]);

  /* ── Réponse : externe (n8n) si configurée, sinon moteur local ─────── */
  const getReply = async (text: string): Promise<{ reply: string; actions: { type: 'addToCart'; item: MenuItem; section: Establishment }[] }> => {
    // En mode externe (n8n) : envoi au webhook, réponse texte (les actions
    // panier pourront être ajoutées plus tard via le protocole externe).
    if (ASSISTANT_CONFIG.useExternalAI && ASSISTANT_CONFIG.webhookUrl) {
      try {
        const res = await fetch(ASSISTANT_CONFIG.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            history: historyRef.current,
            context: { ...cartInfo, assistant: ASSISTANT_CONFIG.name },
          }),
        });
        const data = await res.json();
        const reply = data?.reply ?? data?.message ?? data?.text ?? data?.response;
        if (typeof reply === 'string' && reply.trim()) return { reply, actions: [] };
      } catch {
        /* erreur réseau : on retombe sur le moteur local */
      }
    }
    // Mode local : moteur conversationnel connecté aux données du site
    const result = respond(text, {
      state: engineState,
      history: historyRef.current,
      cartInfo,
    });
    setEngineState(result.state);
    return { reply: result.reply, actions: result.actions };
  };

  /* ── Défilement auto ───────────────────────────────────────────────── */
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing, open]);

  /* ── Ouverture : bulle → disparaît, avatar pop ─────────────────────── */
  const handleOpen = () => {
    setPop(true);
    setTimeout(() => setPop(false), 320);
    setShowBubble(false);
    setBubbleOut(false);
    setOpen((prev) => {
      if (!prev && messages.length === 0) {
        setMessages([{ id: ++msgId, from: 'assistant', text: welcomeMessage() }]);
      }
      return !prev;
    });
  };

  const send = async (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || typing) return;
    setInput('');
    setMessages((m) => [...m, { id: ++msgId, from: 'user', text }]);
    setTyping(true);

    const { reply, actions } = await getReply(text);

    // Exécution des actions (ajout au panier)
    actions.forEach((a) => {
      if (a.type === 'addToCart' && onAddToCart) onAddToCart(a.item, a.section);
    });

    // Mise à jour de l'historique conversationnel (derniers 12 échanges)
    historyRef.current = [
      ...historyRef.current,
      { role: 'user' as const, text },
      { role: 'assistant' as const, text: reply },
    ].slice(-12);

    setTyping(false);
    setMessages((m) => [...m, { id: ++msgId, from: 'assistant', text: reply }]);
  };

  return (
    <>
      {/* 🤖 Bouton flottant — avatar 3D animé, discret */}
      <div
        className="fixed bottom-24 right-4 md:right-6 z-40 flex items-end justify-end gap-3"
        onMouseEnter={() => setShowHint(true)}
        onMouseLeave={() => setShowHint(false)}
      >
        {/* Étiquette "Besoin d'aide ?" (desktop/hover) */}
        {showHint && !open && (
          <div className="hidden md:block mb-4 assistant-hint-in">
            <span className="bg-neutral-900/95 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
              {ASSISTANT_CONFIG.hint}
            </span>
          </div>
        )}

        {/* Bulle de bienvenue (première visite) */}
        {showBubble && !open && (
          <div className={`relative mb-4 max-w-[240px] sm:max-w-[260px] ${bubbleOut ? 'assistant-bubble-out' : 'assistant-bubble-in'}`}>
            <div className="relative bg-neutral-900/95 backdrop-blur-md border border-amber-500/30 rounded-2xl rounded-br-md px-4 py-3 shadow-2xl">
              <button
                onClick={() => {
                  setBubbleOut(true);
                  setTimeout(() => {
                    setShowBubble(false);
                    setBubbleOut(false);
                  }, 400);
                }}
                aria-label="Fermer le message de bienvenue"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-slate-300 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {ASSISTANT_CONFIG.bubble}
              </p>
              <p className="text-[11px] text-amber-400 font-bold mt-2 flex items-center gap-1">
                👆 Touchez ici pour me parler
              </p>
            </div>
          </div>
        )}

        {/* Avatar animé */}
        <button
          onClick={handleOpen}
          aria-label={open ? 'Fermer l’assistant' : `Discuter avec ${ASSISTANT_CONFIG.name}`}
          className={`relative assistant-enter ${pop ? 'assistant-pop' : ''}`}
        >
          {/* Anneau d'attention */}
          <span className="absolute inset-0 rounded-full border-2 border-amber-500/60 assistant-ring" />
          {/* Avatar flottant */}
          <span className="relative flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full border-2 border-amber-500/50 bg-neutral-900 shadow-2xl shadow-black/50 overflow-hidden">
            <img
              src={ASSISTANT_CONFIG.avatar}
              alt={ASSISTANT_CONFIG.name}
              className={`h-full w-full object-cover ${open ? '' : 'assistant-float'}`}
            />
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-neutral-950" />
          </span>
          {/* 👋 Salutation périodique */}
          {showWave && !open && (
            <span className="absolute -top-2 -right-2 text-2xl assistant-wave pointer-events-none">
              👋
            </span>
          )}
        </button>
      </div>

      {/* 💬 Fenêtre de discussion */}
      {open && (
        <div className="fixed bottom-40 right-3 md:right-6 z-50 w-[calc(100vw-1.5rem)] max-w-sm flex flex-col rounded-3xl border border-neutral-800 bg-neutral-950/95 backdrop-blur-md shadow-2xl overflow-hidden animate-fade-in-up">
          {/* En-tête */}
          <div className="flex items-center gap-3 px-4 py-3 bg-neutral-900/60 border-b border-neutral-800">
            <div className="relative h-10 w-10 flex-shrink-0">
              <img
                src={ASSISTANT_CONFIG.avatar}
                alt={ASSISTANT_CONFIG.name}
                className={`h-10 w-10 rounded-full object-cover border border-amber-500/40 ${typing ? 'assistant-thinking' : ''}`}
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-neutral-950" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{ASSISTANT_CONFIG.name}</p>
              <p className="text-[11px] text-green-400 font-semibold">
                {typing ? 'réfléchit…' : `● En ligne — ${getGreeting()}`}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Fermer"
              className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 max-h-[45vh] md:max-h-[50vh]">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-line text-sm leading-relaxed px-3.5 py-2.5 rounded-2xl ${
                    m.from === 'user'
                      ? 'bg-amber-500 text-neutral-950 font-semibold rounded-br-md'
                      : 'bg-neutral-900 text-slate-200 border border-neutral-800 rounded-bl-md'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.3s]" />
                </div>
              </div>
            )}
          </div>

          {/* Suggestions rapides */}
          <div className="px-3 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
            {QUICK_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="whitespace-nowrap text-xs font-bold px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-slate-300 hover:border-amber-500/50 hover:text-white transition-all"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Saisie */}
          <div className="flex items-center gap-2 p-3 border-t border-neutral-800 bg-neutral-900/40">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Écrivez votre message…"
              className="flex-1 min-w-0 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none transition-all"
            />
            <button
              onClick={() => send()}
              aria-label="Envoyer"
              disabled={!input.trim() || typing}
              className="flex items-center justify-center h-10 w-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 disabled:opacity-40 active:scale-95 transition-all"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
