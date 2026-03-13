# Arome — AI Fragrance Advisor

A mobile-first fragrance recommendation app powered by Gemini AI.
Recommends what to wear based on weather, location, occasion, and your personal collection.

---

## ✅ Quick Start (Cursor / Local)

### 1. Prerequisites
- Node.js 18+
- A Gemini API key — get one free at https://aistudio.google.com/apikey

### 2. Install
```bash
npm install
```

### 3. Set up environment
```bash
cp .env.example .env.local
```
Open `.env.local` and replace `MY_GEMINI_API_KEY` with your real key:
```
GEMINI_API_KEY=AIza...your_key_here
```

### 4. Run
```bash
npm run dev
```
Open http://localhost:3000

---

## 🎨 Themes

The app ships with **5 premium themes**, switchable live from the Profile page:

| Theme | Feel |
|---|---|
| **Ivory Atelier** (default) | Warm ivory + cypress teal — organic luxury |
| **Midnight Oud** | Dark charcoal + gold — niche dark masculine |
| **Blanche Rosé** | Blanc + dusty rose — Parisian feminine |
| **Sacred Smoke** | Near-black + amber — editorial moody |
| **Aldehyde Grey** | Cold grey + blue — Maison Margiela minimal |

### Changing the default theme in code:
Open `src/themes/tokens.ts` and change `DEFAULT_THEME`:
```ts
export const DEFAULT_THEME: ThemeKey = 'midnightOud'; // or any other key
```

---

## 🗂 Project Structure

```
src/
  themes/
    tokens.ts           — All theme color tokens + DEFAULT_THEME setting
  context/
    ThemeContext.tsx     — Runtime theme switching + CSS variable injection
    AuthContext.tsx      — User auth (localStorage)
    CatalogContext.tsx   — Fragrance catalog (localStorage)
  components/
    Layout.tsx          — App shell + bottom nav
    SplashScreen.tsx    — Animated splash
    ThemePicker.tsx     — In-app theme switcher (lives in Profile)
  pages/
    Home.tsx            — Daily AI recommendation + Travel Planner
    Catalog.tsx         — Fragrance wardrobe
    Scanner.tsx         — Photo-based fragrance identification
    Chat.tsx            — AI chat advisor
    Profile.tsx         — User settings + theme picker
  lib/
    gemini.ts           — Gemini AI client + MODEL constant
  index.css             — CSS variable system + Tailwind @theme tokens
  App.tsx               — Root with ThemeProvider
```

---

## ⚠️ Known Issues / Watch Out For

- **Gemini API key**: Must be set in `.env.local`. The app will fail silently without it.
- **Quota**: Free Gemini tier has rate limits. The app handles `429` errors gracefully.
- **Camera on iOS**: Works best when opened in Safari (PWA/homescreen). Chrome may block `capture="environment"`.
- **Geolocation**: Users must grant permission for weather-based recommendations. Denied = general recommendation.

---

## 🚀 Deploy

### Vercel (recommended, free)
1. Push to GitHub
2. Import repo at vercel.com
3. Add `GEMINI_API_KEY` in Project → Settings → Environment Variables
4. Deploy

### Netlify
Same as Vercel — add env var in Site Settings → Environment Variables.

---

## 🔧 Tech Stack

- **React 19** + **TypeScript**
- **Vite 6** (build tool)
- **Tailwind CSS v4** (utility classes)
- **React Router v7** (navigation)
- **Framer Motion** (animations)
- **@google/genai** (Gemini AI SDK)
- **lucide-react** (icons)

---

## 📝 Extending the App

### Add a new theme:
1. Add a new entry to `themes` in `src/themes/tokens.ts`
2. Add its key to `themeOrder` in `src/components/ThemePicker.tsx`
3. That's it — the system handles the rest.

### Change the AI model:
In `src/lib/gemini.ts`, change the `MODEL` constant:
```ts
const MODEL = "gemini-1.5-pro"; // for more complex reasoning
```
