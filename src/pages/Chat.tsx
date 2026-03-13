import { useState, useRef, useEffect } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { useAuth } from '../context/AuthContext';
import { ai, MODEL } from '../lib/gemini';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { Chat as GeminiChat } from '@google/genai';
import { useSearchParams } from 'react-router-dom';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function Chat() {
  const { catalog } = useCatalog();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm your AI fragrance advisor. Ask me for recommendations, where to wear a specific scent, or advice for an upcoming trip!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<GeminiChat | null>(null);
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const catalogContext = catalog.length > 0
      ? `The user owns these fragrances: ${JSON.stringify(catalog.map(c => `${c.brand} ${c.name} (${c.notes.join(', ')})`))}.`
      : "The user's fragrance catalog is currently empty.";

    const demoContext = `User Demographics: ${user?.age ? user.age + ' years old' : 'Age unknown'}, ${user?.gender ? user.gender : 'Gender unknown'}.`;

    chatSessionRef.current = ai.chats.create({
      model: MODEL,
      config: {
        systemInstruction: `You are an expert fragrance advisor.
        ${catalogContext}
        ${demoContext}
        When the user asks for recommendations, prioritize suggesting from their catalog if appropriate, but also suggest new ones if they ask or if nothing fits perfectly.
        Be concise, friendly, and format your responses nicely using Markdown.`,
        tools: [{ googleSearch: {} }]
      }
    });
  }, [catalog, user]);

  useEffect(() => {
    if (initialQuery && messages.length === 1) {
      setInput(initialQuery);
    }
  }, [initialQuery]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await chatSessionRef.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: response.text || "I'm not sure how to respond to that." }]);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('429') || err.status === 429 || err.message?.includes('RESOURCE_EXHAUSTED')) {
        setMessages(prev => [...prev, { role: 'model', text: "### Quota Limit Reached\n\nI've reached my daily limit. Please try again later." }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col h-full max-w-2xl mx-auto"
      style={{ backgroundColor: 'var(--color-bg-base)' }}
    >
      <header
        className="p-6 pb-5 border-b sticky top-0 z-10 backdrop-blur-md"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-bg-base) 80%, transparent)',
          borderColor: 'color-mix(in srgb, var(--color-border) 20%, transparent)',
        }}
      >
        <h1
          className="text-2xl font-serif font-medium tracking-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Ask AI
        </h1>
        <p className="section-label mt-1.5">Personalized Fragrance Advice</p>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm"
              style={{
                backgroundColor: msg.role === 'user' ? 'var(--color-text-primary)' : 'var(--color-bg-surface)',
                color: msg.role === 'user' ? 'var(--color-bg-base)' : 'var(--color-accent)',
                border: '1px solid color-mix(in srgb, var(--color-border) 10%, transparent)',
              }}
            >
              {msg.role === 'user' ? <User size={18} strokeWidth={1.5} /> : <Bot size={18} strokeWidth={1.5} />}
            </div>
            <div
              className={`max-w-[85%] rounded-[1.5rem] p-5 shadow-sm ${msg.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'}`}
              style={
                msg.role === 'user'
                  ? { backgroundColor: 'var(--color-text-primary)', color: 'var(--color-bg-base)' }
                  : {
                      backgroundColor: 'var(--color-bg-card)',
                      border: '1px solid color-mix(in srgb, var(--color-border) 30%, transparent)',
                    }
              }
            >
              {msg.role === 'user' ? (
                <p className="text-sm font-medium">{msg.text}</p>
              ) : (
                <div className="arome-prose">
                  <Markdown>{msg.text}</Markdown>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-4">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                color: 'var(--color-accent)',
                border: '1px solid color-mix(in srgb, var(--color-border) 10%, transparent)',
              }}
            >
              <Bot size={18} strokeWidth={1.5} />
            </div>
            <div
              className="rounded-[1.5rem] rounded-tl-none p-5 flex items-center gap-3 shadow-sm"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                border: '1px solid color-mix(in srgb, var(--color-border) 30%, transparent)',
              }}
            >
              <Loader2 size={18} className="animate-spin opacity-40" strokeWidth={1.5} />
              <span className="text-sm font-medium italic" style={{ color: 'var(--color-text-secondary)' }}>
                Consulting the notes...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div
        className="p-6 border-t"
        style={{
          backgroundColor: 'var(--color-bg-base)',
          borderColor: 'color-mix(in srgb, var(--color-border) 20%, transparent)',
        }}
      >
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about a fragrance or occasion..."
            className="input-base w-full py-4 pl-6 pr-14 text-sm"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="btn-primary absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-xl shadow-md active:scale-90 disabled:opacity-30"
          >
            <Send size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
