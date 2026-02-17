# Feature-based folder structure

## Folder tree under `src/`

```
src/
├── index.ts                 # Barrel (theme, config)
├── README.md                # This file
├── navigation/
│   └── index.ts             # Route constants / helpers (Expo Router lives in app/)
├── features/
│   ├── index.ts
│   ├── auth/
│   │   ├── components/      # Auth-specific UI
│   │   ├── hooks/
│   │   ├── screens/
│   │   ├── services/        # Auth API / data
│   │   └── types/
│   ├── feed/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── screens/
│   │   ├── services/
│   │   └── types/
│   ├── restaurant/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── screens/
│   │   ├── services/
│   │   └── types/
│   ├── rating/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── screens/
│   │   ├── services/
│   │   └── types/
│   └── search/
│       ├── components/
│       ├── hooks/
│       ├── screens/
│       ├── services/
│       └── types/
├── shared/                  # Reusable across features
│   ├── components/
│   ├── hooks/
│   └── utils/
├── theme/                   # Colors, spacing, typography
│   └── index.ts
├── config/                  # Env, constants
│   └── index.ts
└── assets/                  # Images, fonts, icons
    └── .gitkeep
```

## Why this structure

- **Feature-first**: Everything for one domain (e.g. feed) lives under `features/feed/`. Easy to find and change.
- **Scales well**: New features don’t clutter shared folders; each feature stays self-contained.
- **Clear boundaries**: `shared/` is for cross-feature code; feature-specific code stays in the feature.
- **Fits mobile**: Screens, components, hooks, services and types per feature match how React Native apps are built.

## How to add a new feature

1. Create `src/features/<featureName>/` with:
   - `screens/index.ts` (and screen components)
   - `components/index.ts` (and feature components)
   - `hooks/index.ts`
   - `services/index.ts`
   - `types/index.ts`
2. Add screens to Expo Router in `app/` (e.g. `app/feed.tsx` that renders the feature screen).
3. Use `@/src/features/<featureName>/...` for imports (path alias `@/*` → `./*` in tsconfig).

## Imports

- Feature: `import { ... } from "@/src/features/feed/screens"`
- Shared: `import { ... } from "@/src/shared/components"`
- Theme: `import { theme } from "@/src/theme"`
- Config: `import { config } from "@/src/config"`
