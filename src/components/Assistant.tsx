import React, { useEffect, useRef, useState } from 'react';
import { Send, X } from 'lucide-react';
import { ASSISTANT_CONFIG } from '../config/assistant';
import { getGreeting, respond, welcomeMessage, AssistantContext } from '../lib/assistantEngine';

interface ChatMessage {
  id: number;
  from: 'user' | 'assistant';
  text: string;
}

interface AssistantProps {
  /** Contexte optionnel (panier) pour des réponses plus personnalisées */
  cartInfo?: AssistantContext;
}

/** Suggestions rapides (discrètes, faciles à taper pour tous les âges) */
const QUICK_SUGGESTIONS = ['📖 Le menu', '🌟 Recommande-moi', '🍕 Les pizzas', '🍰 Les desserts', '🛒 Commander'];

let msgId = 0;

export const Assistant: React.FC<AssistantProps> = ({ cartInfo }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Réponse : externe (n8n) si configurée, sinon moteur local */
  const getReply = async (text: string): Promise<string> => {
    if (ASSISTANT_CONFIG.useExternalAI && ASSISTANT_CONFIG.webhookUrl) {
      try {
        const res = await fetch(ASSISTANT_CONFIG.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            context: { ...cartInfo, assistant: ASSISTANT_CONFIG.name },
          }),
        });
        const data = await res.json();
        const reply = data?.reply ?? data?.message ?? data?.text ?? data?.response;
        if (typeof reply === 'string' && reply.trim()) return reply;
      } catch {
        /* erreur réseau : on retombe sur le moteur local */
      }
    }
    return respond(text, cartInfo);
  };

  /* Salutation automatique à l'ouverture */
  const openChat = () => {
    setOpen((prev) => {
      if (!prev && messages.length === 0) {
        setMessages([{ id: ++msgId, from: 'assistant', text: welcomeMessage() }]);
      }
      return !prev;
    });
  };

  /* Défilement auto vers le bas */
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing, open]);

  const send = async (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || typing) return;
    setInput('');
    setMessages((m) => [...m, { id: ++msgId, from: 'user', text }]);
    setTyping(true);
    const reply = await getReply(text);
    setTyping(false);
    setMessages((m) => [...m, { id: ++msgId, from: 'assistant', text: reply }]);
  };

  return (
    <>
      {/* 🤖 Bouton flottant — discret, en bas à droite */}
      <button
        onClick={openChat}
        aria-label={open ? 'Fermer l’assistant' : `Discuter avec ${ASSISTANT_CONFIG.name}`}
        className="fixed bottom-24 right-4 md:right-6 z-40 group"
      >
        <span className="relative flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full border-2 border-amber-500/50 bg-neutral-900 shadow-2xl shadow-black/50 transition-transform hover:scale-105 active:scale-95 overflow-hidden">
          <img
            src={ASSISTANT_CONFIG.avatar}
            alt={ASSISTANT_CONFIG.name}
            className="h-full w-full object-cover"
          />
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-neutral-950" />
        </span>
      </button>

      {/* 💬 Fenêtre de discussion */}
      {open && (
        <div className="fixed bottom-40 right-3 md:right-6 z-50 w-[calc(100vw-1.5rem)] max-w-sm flex flex-col rounded-3xl border border-neutral-800 bg-neutral-950/95 backdrop-blur-md shadow-2xl overflow-hidden animate-fade-in-up">
          {/* En-tête */}
          <div className="flex items-center gap-3 px-4 py-3 bg-neutral-900/60 border-b border-neutral-800">
            <img
              src={ASSISTANT_CONFIG.avatar}
              alt={ASSISTANT_CONFIG.name}
              className="h-10 w-10 rounded-full object-cover border border-amber-500/40"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{ASSISTANT_CONFIG.name}</p>
              <p className="text-[11px] text-green-400 font-semibold">● En ligne — {getGreeting()}</p>
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
