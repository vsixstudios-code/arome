import { useTheme } from '../context/ThemeContext';
import { themes, type ThemeKey } from '../themes/tokens';
import { Check } from 'lucide-react';

const themeOrder: ThemeKey[] = [
  'ivoryAtelier',
  'midnightOud',
  'blancheRose',
  'sacredSmoke',
  'aldehydeGrey',
];

export default function ThemePicker() {
  const { themeKey, setTheme } = useTheme();

  return (
    <div>
      <p className="section-label mb-4">App Theme</p>
      <div className="space-y-2">
        {themeOrder.map((key) => {
          const t = themes[key];
          const isActive = key === themeKey;
          return (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className="w-full flex items-center gap-4 rounded-2xl p-4 transition-all active:scale-[0.98] text-left"
              style={{
                backgroundColor: isActive
                  ? 'color-mix(in srgb, var(--color-accent) 8%, var(--color-bg-surface))'
                  : 'var(--color-bg-surface)',
                border: isActive
                  ? '1.5px solid color-mix(in srgb, var(--color-accent) 40%, transparent)'
                  : '1.5px solid transparent',
              }}
            >
              {/* Swatch */}
              <div className="flex gap-1.5 shrink-0">
                <div className="w-6 h-6 rounded-full border border-black/5" style={{ backgroundColor: t.bgBase }} />
                <div className="w-6 h-6 rounded-full border border-black/5" style={{ backgroundColor: t.accent }} />
                <div className="w-6 h-6 rounded-full border border-black/5" style={{ backgroundColor: t.bgCard }} />
              </div>

              {/* Labels */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium leading-tight truncate"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {t.name}
                </p>
                <p
                  className="text-[11px] mt-0.5 truncate"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {t.targetFeel}
                </p>
              </div>

              {/* Active check */}
              {isActive && (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                >
                  <Check size={11} strokeWidth={3} style={{ color: 'var(--color-cta-text)' }} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
