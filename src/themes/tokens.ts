/**
 * AROME — Centralized Theme Token System
 * ----------------------------------------
 * All color, typography, and UI tokens live here.
 * To switch themes, change DEFAULT_THEME below.
 * In Cursor: search "DEFAULT_THEME" to set the active theme.
 */

export type ThemeKey =
  | 'ivoryAtelier'   // DEFAULT — Warm ivory + cypress teal (current, refined)
  | 'midnightOud'    // Dark luxury: deep charcoal + gold
  | 'blancheRose'    // Light feminine: blanc + dusty rose
  | 'sacredSmoke'    // Editorial dark: near-black + amber
  | 'aldehydeGrey';  // Maison-inspired: cold grey + muted blue

export interface Theme {
  name: string;
  description: string;
  targetFeel: string;

  // Backgrounds
  bgBase: string;
  bgSurface: string;
  bgCard: string;
  bgMuted: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textInverse: string;

  // Brand / Accent
  accent: string;
  accentDeep: string;
  accentSoft: string;

  // Borders
  border: string;

  // Semantic
  ctaBg: string;
  ctaText: string;
  success: string;
  warning: string;

  // Font references (loaded via Google Fonts in index.css)
  fontSerif: string;
  fontSans: string;
}

export const themes: Record<ThemeKey, Theme> = {

  // ─── 1. IVORY ATELIER (DEFAULT) ─────────────────────────────────────────────
  ivoryAtelier: {
    name: 'Ivory Atelier',
    description: 'Warm ivory grounds with cypress teal — organic luxury',
    targetFeel: 'Genderless apothecary. Sophisticated, warm, inviting.',

    bgBase: '#F7F4EF',
    bgSurface: '#EFE9E1',
    bgCard: '#FFFCF8',
    bgMuted: '#EFE9E1',

    textPrimary: '#201C18',
    textSecondary: '#6F675E',
    textInverse: '#FFFCF8',

    accent: '#2E6B62',
    accentDeep: '#24564F',
    accentSoft: '#EFE9E1',

    border: '#DDD5CB',

    ctaBg: '#2E6B62',
    ctaText: '#FFFCF8',
    success: '#5D7A68',
    warning: '#B7864A',

    fontSerif: '"Cormorant Garamond", serif',
    fontSans: '"Inter", ui-sans-serif, sans-serif',
  },

  // ─── 2. MIDNIGHT OUD ────────────────────────────────────────────────────────
  midnightOud: {
    name: 'Midnight Oud',
    description: 'Deep charcoal with warm gold — dark masculine luxury',
    targetFeel: 'Niche perfumery. Late-night. High-end. Masculine-leaning but universal.',

    bgBase: '#141210',
    bgSurface: '#1C1915',
    bgCard: '#211E1A',
    bgMuted: '#2A2520',

    textPrimary: '#F5EFE6',
    textSecondary: '#9A8F83',
    textInverse: '#141210',

    accent: '#C49A4A',
    accentDeep: '#A07C34',
    accentSoft: '#2A2520',

    border: '#3A342C',

    ctaBg: '#C49A4A',
    ctaText: '#141210',
    success: '#6A8C72',
    warning: '#C49A4A',

    fontSerif: '"Cormorant Garamond", serif',
    fontSans: '"Inter", ui-sans-serif, sans-serif',
  },

  // ─── 3. BLANCHE ROSE ────────────────────────────────────────────────────────
  blancheRose: {
    name: 'Blanche Rosé',
    description: 'Blanc white with dusty rose — feminine floral editorial',
    targetFeel: 'Parisian boutique. Clean. Feminine. Aspirational.',

    bgBase: '#FAF8F6',
    bgSurface: '#F2ECE8',
    bgCard: '#FFFFFF',
    bgMuted: '#F2ECE8',

    textPrimary: '#1A1015',
    textSecondary: '#8C7A7E',
    textInverse: '#FFFFFF',

    accent: '#B56B7A',
    accentDeep: '#943D55',
    accentSoft: '#F2ECE8',

    border: '#E5D9D6',

    ctaBg: '#B56B7A',
    ctaText: '#FFFFFF',
    success: '#7A9E7E',
    warning: '#C49460',

    fontSerif: '"Cormorant Garamond", serif',
    fontSans: '"Inter", ui-sans-serif, sans-serif',
  },

  // ─── 4. SACRED SMOKE ────────────────────────────────────────────────────────
  sacredSmoke: {
    name: 'Sacred Smoke',
    description: 'Near-black with warm amber — editorial dark, bold',
    targetFeel: 'Moody editorial. Niche dark aesthetic. Gender-neutral art crowd.',

    bgBase: '#0E0C0A',
    bgSurface: '#161310',
    bgCard: '#1C1915',
    bgMuted: '#221E1A',

    textPrimary: '#EDE6DC',
    textSecondary: '#8A8077',
    textInverse: '#0E0C0A',

    accent: '#D4875A',
    accentDeep: '#B36340',
    accentSoft: '#221E1A',

    border: '#2E2820',

    ctaBg: '#D4875A',
    ctaText: '#0E0C0A',
    success: '#5E8A68',
    warning: '#D4875A',

    fontSerif: '"Cormorant Garamond", serif',
    fontSans: '"Inter", ui-sans-serif, sans-serif',
  },

  // ─── 5. ALDEHYDE GREY ───────────────────────────────────────────────────────
  aldehydeGrey: {
    name: 'Aldehyde Grey',
    description: 'Cold grey with muted steel blue — Maison-inspired, minimal',
    targetFeel: 'Maison Margiela / Le Labo. Stripped back. Minimal. Unisex.',

    bgBase: '#F4F4F2',
    bgSurface: '#EBEBEA',
    bgCard: '#F9F9F8',
    bgMuted: '#E4E4E2',

    textPrimary: '#16161A',
    textSecondary: '#767676',
    textInverse: '#F9F9F8',

    accent: '#3D5A80',
    accentDeep: '#2B4068',
    accentSoft: '#E4E4E2',

    border: '#D8D8D6',

    ctaBg: '#16161A',
    ctaText: '#F9F9F8',
    success: '#507A68',
    warning: '#A07040',

    fontSerif: '"Cormorant Garamond", serif',
    fontSans: '"Inter", ui-sans-serif, sans-serif',
  },
};

// ─── ACTIVE THEME ─────────────────────────────────────────────────────────────
// Change this value to switch the app's theme:
// 'ivoryAtelier' | 'midnightOud' | 'blancheRose' | 'sacredSmoke' | 'aldehydeGrey'
export const DEFAULT_THEME: ThemeKey = 'ivoryAtelier';

export const activeTheme: Theme = themes[DEFAULT_THEME];
