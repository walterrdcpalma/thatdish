# thatdish app

Expo (React Native) app with web support. Same code runs in the browser (PC), iOS, and Android.

## Prerequisites

- Node.js 18+
- API running at `http://localhost:5000` (from repo root: `cd src && dotnet run --project ThatDish.Api`)

If you see "Nenhum prato encontrado" or an error: (1) Start the API first. (2) To get fresh seed data (placeholders + Vegan/Vegetarian), delete the SQLite DB file (e.g. `src/thatdish.db` or the path where the API runs) and restart the API so the seed runs again.

## Run

```bash
# From repo root
cd app
npm install
npm run web
```

Then open the URL shown in the terminal (e.g. http://localhost:8081). Press `w` in the Expo CLI to open the web browser.

For iOS simulator: `npm run ios`  
For Android: `npm run android`

## API URL

The app uses `http://localhost:5000` by default. To override (e.g. for a physical device or different host):

- Create `app/.env` with: `EXPO_PUBLIC_API_URL=http://YOUR_IP:5000`
- Or set the variable when starting: `EXPO_PUBLIC_API_URL=http://192.168.1.x:5000 npx expo start --web`

## Structure (industry-style)

All app code lives under `src/`; `app/` is only for Expo Router (routes and layouts).

```
app/
  app/                    # Expo Router (routes only)
    (tabs)/index.tsx      # Home: dish feed + category filters
    (tabs)/search.tsx, add.tsx, profile.tsx
    _layout.tsx, modal.tsx, +not-found.tsx
  src/
    api/                  # API client (e.g. dishes.ts)
    components/           # Reusable UI (Themed, EditScreenInfo, etc.)
    constants/            # Theme (Colors)
    hooks/                # Custom hooks
    types/                # TypeScript types (dish, FoodType)
    config.ts             # API base URL
  assets/
```

Imports use the `@/` alias: `@/src/components/...`, `@/src/constants/...`, `@/src/api/...`.

**Styling:** NativeWind (Tailwind for React Native) is configured. Use the `className` prop on RN components (e.g. `className="flex-1 p-4"`). Global styles are in `global.css`; theme colors still come from `src/constants/Colors.ts` for dark/light mode.
