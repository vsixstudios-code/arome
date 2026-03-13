import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, CheckCircle, MessageSquare } from 'lucide-react';
import { identifyFragrance } from '../lib/gemini';
import { useCatalog } from '../context/CatalogContext';
import { useNavigate } from 'react-router-dom';

export default function Scanner() {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addFragrance } = useCatalog();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const base64Data = image.split(',')[1];
      const data = await identifyFragrance(base64Data, mimeType);
      if (!data.isFragrance) {
        setError(data.errorMessage || "This doesn't look like a fragrance. Please try another photo.");
      } else {
        setResult(data);
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('429') || err.status === 429 || err.message?.includes('RESOURCE_EXHAUSTED')) {
        setError("I've reached my daily limit for AI analysis. Please try again later.");
      } else {
        setError('Failed to analyze image. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    addFragrance({
      name: result.name,
      brand: result.brand,
      notes: result.notes || [],
      seasons: result.seasons || [],
      occasions: result.occasions || [],
      description: result.description || '',
      imageUrl: image || undefined,
    });
    navigate('/catalog');
  };

  const cardStyle = {
    backgroundColor: 'var(--color-bg-card)',
    border: '1px solid color-mix(in srgb, var(--color-border) 30%, transparent)',
    boxShadow: '0 8px 30px color-mix(in srgb, var(--color-text-primary) 8%, transparent)',
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <header className="mb-8 mt-4">
        <h1
          className="text-3xl font-serif font-medium tracking-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Scanner
        </h1>
        <p className="text-sm font-medium mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          Identify and add to your wardrobe
        </p>
      </header>

      {!image ? (
        <div
          className="border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center text-center min-h-[350px] cursor-pointer transition-all duration-300 group"
          style={{
            borderColor: 'color-mix(in srgb, var(--color-border) 40%, transparent)',
            backgroundColor: 'var(--color-bg-card)',
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <div
            className="p-5 rounded-full mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300"
            style={{ backgroundColor: 'var(--color-bg-surface)', color: 'var(--color-accent)' }}
          >
            <Camera size={36} strokeWidth={1.5} />
          </div>
          <h3
            className="font-serif text-xl mb-3"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Capture or Upload
          </h3>
          <p className="text-sm max-w-[240px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            Snap a picture of a fragrance bottle or box to identify it instantly.
          </p>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="space-y-8">
          <div
            className="relative rounded-[2rem] overflow-hidden"
            style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid color-mix(in srgb, var(--color-border) 20%, transparent)' }}
          >
            <img src={image} alt="Scanned fragrance" className="w-full h-72 object-contain p-4" />
            <button
              onClick={() => { setImage(null); setResult(null); setError(null); }}
              className="absolute top-4 right-4 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm active:scale-95 transition-all"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--color-bg-card) 90%, transparent)',
                color: 'var(--color-text-secondary)',
                border: '1px solid color-mix(in srgb, var(--color-border) 30%, transparent)',
              }}
            >
              Retake
            </button>
          </div>

          {!result && !error && (
            <button
              onClick={analyzeImage}
              disabled={loading}
              className="btn-primary w-full rounded-2xl py-4 font-semibold flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin opacity-60" />
                  <span className="tracking-wide">Analyzing Essence...</span>
                </>
              ) : (
                <>
                  <Upload size={20} strokeWidth={2} />
                  <span className="tracking-wide">Identify Fragrance</span>
                </>
              )}
            </button>
          )}

          {error && (
            <div
              className="p-5 rounded-2xl text-sm font-medium text-center"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--color-warning) 8%, transparent)',
                color: 'var(--color-warning)',
                border: '1px solid color-mix(in srgb, var(--color-warning) 15%, transparent)',
              }}
            >
              {error}
            </div>
          )}

          {result && (
            <div className="rounded-[2rem] p-8 animate-in fade-in slide-in-from-bottom-6 duration-500" style={cardStyle}>
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-serif font-medium leading-tight" style={{ color: 'var(--color-text-primary)' }}>
                  {result.name}
                </h2>
                <p className="section-label tracking-[0.2em] mt-2">{result.brand}</p>
              </div>

              <div className="space-y-6 mb-10">
                <div>
                  <h4 className="section-label mb-3">Olfactory Notes</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.notes?.map((note: string, i: number) => (
                      <span key={i} className="chip text-xs px-3.5 py-1.5">{note}</span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="section-label mb-2">Best Seasons</h4>
                    <p className="text-sm font-medium" style={{ color: 'color-mix(in srgb, var(--color-text-primary) 80%, transparent)' }}>
                      {result.seasons?.join(', ')}
                    </p>
                  </div>
                  <div>
                    <h4 className="section-label mb-2">Occasions</h4>
                    <p className="text-sm font-medium" style={{ color: 'color-mix(in srgb, var(--color-text-primary) 80%, transparent)' }}>
                      {result.occasions?.join(', ')}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="section-label mb-2">Profile</h4>
                  <p className="text-sm leading-relaxed italic" style={{ color: 'var(--color-text-secondary)' }}>
                    {result.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleSave}
                  className="w-full rounded-xl py-4 font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
                  style={{ backgroundColor: 'var(--color-success)', color: 'var(--color-text-inverse)' }}
                >
                  <CheckCircle size={20} strokeWidth={2} />
                  Add to Wardrobe
                </button>

                <button
                  onClick={() => navigate(`/chat?q=${encodeURIComponent(`What is the best occasion to wear ${result.name} by ${result.brand}?`)}`)}
                  className="w-full rounded-xl py-4 font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  style={{ backgroundColor: 'var(--color-bg-surface)', color: 'var(--color-text-primary)' }}
                >
                  <MessageSquare size={20} strokeWidth={1.5} />
                  Ask AI about this
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
