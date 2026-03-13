import { useCatalog } from '../context/CatalogContext';
import { Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Catalog() {
  const { catalog, removeFragrance } = useCatalog();

  const cardStyle = {
    backgroundColor: 'var(--color-bg-card)',
    border: '1px solid color-mix(in srgb, var(--color-border) 30%, transparent)',
    boxShadow: '0 4px 20px -4px color-mix(in srgb, var(--color-text-primary) 5%, transparent)',
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <header className="mb-8 mt-4 flex justify-between items-end">
        <div>
          <h1
            className="text-3xl font-serif font-medium tracking-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Wardrobe
          </h1>
          <p className="text-sm font-medium mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Your curated collection
          </p>
        </div>
        <Link
          to="/scanner"
          className="p-3 rounded-full transition-all shadow-md active:scale-95"
          style={{ backgroundColor: 'var(--color-cta-bg)', color: 'var(--color-cta-text)' }}
        >
          <Plus size={24} strokeWidth={1.5} />
        </Link>
      </header>

      {catalog.length === 0 ? (
        <div
          className="text-center py-20 rounded-3xl border-2 border-dashed flex flex-col items-center"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            borderColor: 'color-mix(in srgb, var(--color-border) 40%, transparent)',
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              color: 'color-mix(in srgb, var(--color-text-secondary) 40%, transparent)',
            }}
          >
            <Plus size={32} strokeWidth={1} />
          </div>
          <p className="mb-6 font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            Your wardrobe is empty.
          </p>
          <Link
            to="/scanner"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all shadow-sm active:scale-95"
            style={{ backgroundColor: 'var(--color-text-primary)', color: 'var(--color-bg-base)' }}
          >
            <Plus size={18} strokeWidth={2} />
            Add Your First Fragrance
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {catalog.map((fragrance) => (
            <div
              key={fragrance.id}
              className="p-6 rounded-2xl flex flex-col transition-transform hover:-translate-y-0.5 duration-300"
              style={cardStyle}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 pr-4">
                  <h3
                    className="font-serif font-medium text-xl leading-tight"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {fragrance.name}
                  </h3>
                  <p className="section-label tracking-widest mt-1">{fragrance.brand}</p>
                </div>
                <button
                  onClick={() => removeFragrance(fragrance.id)}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--color-border)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-warning)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-border)')}
                  aria-label="Remove"
                >
                  <Trash2 size={18} strokeWidth={1.5} />
                </button>
              </div>

              <div className="mt-auto pt-5">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {fragrance.notes.slice(0, 3).map((note, i) => (
                    <span key={i} className="chip">{note}</span>
                  ))}
                  {fragrance.notes.length > 3 && (
                    <span className="chip">+{fragrance.notes.length - 3}</span>
                  )}
                </div>
                <p
                  className="text-xs line-clamp-2 leading-relaxed italic"
                  style={{ color: 'color-mix(in srgb, var(--color-text-secondary) 80%, transparent)' }}
                >
                  {fragrance.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
