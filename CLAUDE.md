@AGENTS.md

# CLAUDE.md — Dashboard

## Project Overview

Dashboard interno para monitoramento e configuracao de uma pipeline automatizada de prospecção B2B. Consome dados do mesmo Supabase que a pipeline (repo separado). Stack: Next.js 15 (App Router) + Tailwind v4 + Supabase + TypeScript.

## Commands

```bash
npm run dev         # Dev server
npm run build       # Build (output standalone para VPS)
npm run start       # Start production server
npm run lint        # Lint
```

## Architecture

- **App Router** com route groups: `(auth)` para login, `(dashboard)` para paginas autenticadas com sidebar
- **Server Components por padrao** — `"use client"` apenas em componentes que precisam de interatividade (filtros, modals, formularios)
- **Supabase direto** via `@supabase/ssr` — sem API intermediaria. Queries em `lib/queries/`, mutations em `lib/actions/`
- **Filtros e paginacao via URL search params** — Server Components recebem `searchParams` e buscam dados no servidor
- **Auth** com email/senha via Supabase Auth. Proxy global protege todas as rotas exceto `/login`, `/signup` e `/api/auth`

## Code Conventions

- No comments in code — no inline comments, block comments, or section dividers
- Named exports everywhere. `export default` only in `page.tsx` and `layout.tsx` (Next.js requirement)
- No barrel exports (no `index.ts` re-exports). Import directly from the file
- Path alias `@/` for all imports
- Files and folders: kebab-case (`leads-table.tsx`)
- Components: PascalCase (`LeadsTable`)
- Functions and variables: camelCase (`getLeads`)
- Types and interfaces: PascalCase (`Lead`)
- Constants: UPPER_SNAKE_CASE (`ITEMS_PER_PAGE`)

## Data Access

- Pages never call Supabase directly — they import from `lib/queries/`
- Queries create their own Supabase server client via `createClient()` from `lib/supabase/server.ts`
- Server Actions in `lib/actions/` handle mutations, return `{ success: boolean, error?: string }`, and call `revalidatePath`
- Use `.select("field1, field2")` with explicit fields on large tables (especially `leads`)

## Design System

- Dark mode default. Background layers: `#09090B` → `#111113` → `#18181B`
- Primary color: green (`#22C55E`)
- Font: Inter
- Icons: Lucide React (outline, 1.5px stroke)
- Custom components in `components/ui/` — no component library
- `cn()` from `lib/cn.ts` (clsx + tailwind-merge) for conditional classes
- Status badge colors mapped to `lead_status` enum: new=blue, contacted=green, follow_up=amber, won=emerald, lost=red, skipped=gray

## Key Files

- `proxy.ts` — Auth guard, redirects unauthenticated users to `/login`
- `app/(dashboard)/layout.tsx` — Sidebar + content area layout
- `lib/supabase/server.ts` — Server-side Supabase client factory
- `lib/queries/` — All read operations
- `lib/actions/` — All write operations (Server Actions)
- `components/ui/` — Design system primitives
- `types/database.ts` — Supabase types matching live schema + derived aliases
- `lib/format.ts` — Formatters (date, duration, slug display)

## Database

Reads from the same Supabase project as the pipeline. Uses anon key + RLS (not service key). Tables consumed:

- `leads` — Prospected businesses (PK: `place_id`). Key columns: `company_name`, `niche`, `status`, `phone_gmb`, `phone_whatsapp`, `category`, `rating`, AI analysis fields. No `city`/`state` columns
- `niches` — Business categories (`slug`, `active`, `sort_order`). No `name` column — use `formatSlug(slug)` for display
- `cities` — Reference table of cities (`name`, `active`)
- `prospecting_runs` — Prospecting execution log (`niche_slug`, `city_name`, `run_status`, etc.)
- `dispatch_runs` — WhatsApp dispatch execution log. No `run_status` column
- `settings` — Key-value pipeline configuration (only table with write access from dashboard)

## Docs

Detailed specifications in `docs/`:
- `dashboard-spec.md` — Screens, features, user flows, edge cases
- `design-system.md` — Colors, typography, spacing, component specs
- `development-guide.md` — Architecture patterns, code examples, auth flow, deploy
