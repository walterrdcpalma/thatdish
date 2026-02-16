# That Dish (mobile)

React Native + TypeScript with Expo. Stable deps only. One basic screen—no feature logic.

## Run

```bash
cd app
npm install
npm start
```

Then `i` (iOS), `a` (Android), or `w` (web).

## Structure

```
app/
├── app/                 # Expo Router
│   ├── _layout.tsx      # Root layout
│   └── (tabs)/
│       ├── _layout.tsx  # Tabs
│       └── index.tsx    # Home screen
├── components/
├── config/env.ts
├── hooks/
├── services/
├── theme/
├── .env.example
├── eslint.config.mjs   # ESLint 9 flat config
├── .prettierrc
├── app.json
├── babel.config.js
├── package.json
└── tsconfig.json
```

- **Theme**: `@/theme` (colors, spacing)
- **Env**: copy `.env.example` → `.env`
- **Lint**: `npm run lint` | **Format**: `npm run format`

Some `npm install` deprecation warnings (@babel/plugin-proposal-*, rimraf, @xmldom/xmldom, and sometimes tar/glob) come from Expo’s dependency tree. We override `tar` and `send` for security; the rest will improve when Expo updates its dependencies.
