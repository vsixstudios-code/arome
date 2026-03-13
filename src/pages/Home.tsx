import { useState, useEffect } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { useAuth } from '../context/AuthContext';
import { ai } from '../lib/gemini';
import { Cloud, MapPin, Loader2, Plane, Search, Sun, CloudRain, Snowflake, Moon } from 'lucide-react';
import Markdown from 'react-markdown';
import { Type } from '@google/genai';
import { MODEL } from '../lib/gemini';

interface DailySuggestion {
  recommendationMarkdown: string;
  weather?: {
    temperature: string;
    condition: string;
    iconType: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'clear';
  };
}

export default function Home() {
  const { catalog } = useCatalog();
  const { user } = useAuth();
  const [recommendation, setRecommendation] = useState<DailySuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [destination, setDestination] = useState('');
  const [travelRec, setTravelRec] = useState<string | null>(null);
  const [travelLoading, setTravelLoading] = useState(false);

  useEffect(() => {
    async function getRecommendation() {
      const cached = sessionStorage.getItem('arome_daily_rec');
      if (cached) {
        try {
          const cacheDate = sessionStorage.getItem('arome_daily_rec_date');
          const today = new Date().toDateString();
          if (cacheDate === today) {
            setRecommendation(JSON.parse(cached));
            return;
          }
        } catch (e) {
          console.error('Cache parse error:', e);
        }
      }

      setLoading(true);
      try {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              await fetchRecommendation(latitude, longitude);
            },
            async (error) => {
              console.warn('Geolocation error:', error);
              setLocationError('Could not get location. Showing general recommendation.');
              await fetchRecommendation(null, null);
            }
          );
        } else {
          await fetchRecommendation(null, null);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    getRecommendation();
  }, [catalog, user]);

  async function fetchRecommendation(lat: number | null, lon: number | null) {
    try {
      const catalogContext = catalog.length > 0
        ? `The user owns these fragrances: ${JSON.stringify(catalog.map(c => `${c.brand} ${c.name} (${c.notes.join(', ')})`))}.`
        : "The user's fragrance catalog is currently empty.";

      const demoContext = `User Demographics: ${user?.age ? user.age + ' years old' : 'Age unknown'}, ${user?.gender ? user.gender : 'Gender unknown'}.`;

      const locationContext = lat && lon
        ? `The user is at latitude ${lat}, longitude ${lon}. Use the googleSearch tool to find the current local weather conditions for this location.`
        : "The user's location is unknown. Give a general recommendation for the current season.";

      const prompt = `
        You are an expert fragrance advisor.
        ${catalogContext}
        ${demoContext}
        ${locationContext}
        Based on the current weather (temperature, humidity, season), recommend ONE fragrance for the user to wear today.
        If they have a suitable fragrance in their catalog, recommend it and explain why it fits the weather.
        If their catalog is empty or nothing fits perfectly, recommend a new fragrance they should try and explain why.
        Keep the response concise and engaging.
        Return the response as JSON matching the requested schema.
      `;

      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendationMarkdown: { type: Type.STRING },
              weather: {
                type: Type.OBJECT,
                properties: {
                  temperature: { type: Type.STRING },
                  condition: { type: Type.STRING },
                  iconType: { type: Type.STRING },
                },
              },
            },
            required: ['recommendationMarkdown'],
          },
        },
      });

      const jsonStr = response.text?.trim() || '{}';
      const parsed = JSON.parse(jsonStr);
      setRecommendation(parsed);
      sessionStorage.setItem('arome_daily_rec', jsonStr);
      sessionStorage.setItem('arome_daily_rec_date', new Date().toDateString());
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('429') || err.status === 429 || err.message?.includes('RESOURCE_EXHAUSTED')) {
        setRecommendation({
          recommendationMarkdown: '### Quota Limit Reached\n\nI\'ve reached my daily limit for AI recommendations. Please check back tomorrow or try again later.',
        });
      } else {
        setRecommendation({ recommendationMarkdown: 'Failed to load recommendation. Please try again later.' });
      }
    } finally {
      setLoading(false);
    }
  }

  async function fetchTravelRecommendation() {
    if (!destination.trim()) return;
    setTravelLoading(true);
    setTravelRec(null);
    try {
      const catalogContext = catalog.length > 0
        ? `The user owns these fragrances: ${JSON.stringify(catalog.map(c => `${c.brand} ${c.name} (${c.notes.join(', ')})`))}.`
        : "The user's fragrance catalog is currently empty.";

      const demoContext = `User Demographics: ${user?.age ? user.age + ' years old' : 'Age unknown'}, ${user?.gender ? user.gender : 'Gender unknown'}.`;

      const prompt = `
        You are an expert fragrance advisor.
        ${catalogContext}
        ${demoContext}
        The user is planning a trip to: ${destination}.
        Use the googleSearch tool to find the typical or current weather conditions for ${destination}.
        Based on the destination's climate, recommend ONE fragrance for the trip.
        Keep the response concise, engaging, and formatted nicely in Markdown.
      `;

      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] },
      });

      setTravelRec(response.text || 'Could not generate a travel recommendation.');
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('429') || err.status === 429 || err.message?.includes('RESOURCE_EXHAUSTED')) {
        setTravelRec('### Quota Limit Reached\n\nI\'ve reached my daily limit. Please try again later.');
      } else {
        setTravelRec('Failed to load travel recommendation. Please try again later.');
      }
    } finally {
      setTravelLoading(false);
    }
  }

  const getWeatherIcon = (type?: string) => {
    switch (type) {
      case 'sunny': return <Sun size={20} />;
      case 'rainy': return <CloudRain size={20} />;
      case 'snowy': return <Snowflake size={20} />;
      case 'clear': return <Moon size={20} />;
      default: return <Cloud size={20} />;
    }
  };

  const cardStyle = {
    backgroundColor: 'var(--color-bg-card)',
    border: '1px solid color-mix(in srgb, var(--color-border) 30%, transparent)',
    boxShadow: '0 4px 20px -4px color-mix(in srgb, var(--color-text-primary) 5%, transparent)',
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <header className="mb-8 mt-4 flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-serif font-medium tracking-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Arome
          </h1>
          <p className="section-label mt-1 tracking-[0.2em]">Find what fits the moment.</p>
        </div>
      </header>

      {/* Daily Suggestion */}
      <section className="rounded-2xl p-6" style={cardStyle}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3" style={{ color: 'var(--color-accent)' }}>
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
              {recommendation?.weather ? getWeatherIcon(recommendation.weather.iconType) : <Cloud size={20} />}
            </div>
            <h2 className="font-medium text-lg tracking-tight">Daily Suggestion</h2>
          </div>
          {recommendation?.weather && (
            <div
              className="text-[11px] font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider"
              style={{ backgroundColor: 'var(--color-bg-surface)', color: 'var(--color-text-secondary)' }}
            >
              {recommendation.weather.temperature} • {recommendation.weather.condition}
            </div>
          )}
        </div>

        {locationError && (
          <div
            className="flex items-center gap-2 text-xs mb-6 p-3 rounded-xl"
            style={{
              color: 'var(--color-warning)',
              backgroundColor: 'color-mix(in srgb, var(--color-warning) 8%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-warning) 15%, transparent)',
            }}
          >
            <MapPin size={14} />
            <span>{locationError}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12" style={{ color: 'var(--color-text-secondary)' }}>
            <Loader2 className="animate-spin mb-3 opacity-40" size={28} strokeWidth={1.5} />
            <p className="text-sm font-medium">Analyzing weather and wardrobe...</p>
          </div>
        ) : (
          <div className="arome-prose">
            {recommendation ? (
              <Markdown>{recommendation.recommendationMarkdown}</Markdown>
            ) : (
              <p className="italic" style={{ color: 'var(--color-text-secondary)' }}>No recommendation available.</p>
            )}
          </div>
        )}
      </section>

      {/* Travel Planner */}
      <section className="mt-8 rounded-2xl p-6" style={cardStyle}>
        <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--color-accent)' }}>
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
            <Plane size={20} />
          </div>
          <h2 className="font-medium text-lg tracking-tight">Travel Planner</h2>
        </div>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          Going somewhere? Enter your destination to get a tailored fragrance recommendation based on the local climate.
        </p>

        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchTravelRecommendation()}
              placeholder="e.g., Bali, Paris, Tokyo"
              className="input-base w-full py-3.5 pl-11 pr-4 text-sm"
            />
            <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'color-mix(in srgb, var(--color-text-secondary) 60%, transparent)' }} />
          </div>
          <button
            onClick={fetchTravelRecommendation}
            disabled={!destination.trim() || travelLoading}
            className="btn-primary px-5 flex items-center justify-center shrink-0"
          >
            {travelLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
          </button>
        </div>

        {travelRec && (
          <div
            className="arome-prose p-5 rounded-xl"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-bg-surface) 50%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-border) 20%, transparent)',
            }}
          >
            <Markdown>{travelRec}</Markdown>
          </div>
        )}
      </section>

      {/* Wardrobe Insights */}
      <section className="mt-10 mb-8">
        <h2
          className="text-xl font-serif font-medium mb-5"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Wardrobe Insights
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: catalog.length, label: 'Fragrances' },
            { value: new Set(catalog.map(c => c.brand)).size, label: 'Brands' },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="rounded-2xl p-6 flex flex-col items-center justify-center"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid color-mix(in srgb, var(--color-border) 10%, transparent)',
              }}
            >
              <span
                className="text-4xl font-light tracking-tight"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {value}
              </span>
              <span className="section-label mt-2">{label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
