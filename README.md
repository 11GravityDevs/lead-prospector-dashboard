<h1 align="center">Lead Prospector Dashboard</h1>

<p align="center">
  The control room for an automated B2B lead prospecting and WhatsApp outreach pipeline.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License" />
</p>

---

## Overview

Lead Prospector is an automated pipeline that scrapes businesses from Google Maps by niche and city, enriches each one with AI analysis, and dispatches WhatsApp outreach messages on a schedule. All of that state lives in a Supabase database.

This repository is the **dashboard** that sits on top of that database. It gives a small team visibility into how leads are being found, contacted, and moved through the funnel, and lets them tune the pipeline's behavior, without touching the database or the automation scripts directly.

## Features

- **Overview**: KPIs for total leads, leads by status, and leads by niche, plus the most recent prospecting and dispatch runs.
- **Leads**: searchable, filterable, paginated table of every prospected business, with a detail view showing contact info, category, rating, and the AI analysis.
- **Prospecting**: execution log of scraping runs (niche, city, leads found, status, duration).
- **Dispatch**: execution log of WhatsApp outreach runs (messages sent, errors, duration).
- **Settings**: live pipeline configuration, such as the dispatch schedule, how many leads are contacted per run, and the delays used to simulate human typing.

## Tech stack

| Layer           | Technology                                                                |
| --------------- | ------------------------------------------------------------------------- |
| Framework       | Next.js 16 (App Router, Server Components, Server Actions)                |
| UI              | React 19, TypeScript (strict), Tailwind CSS v4                            |
| Data and auth   | Supabase (Postgres, Auth, Row Level Security) via `@supabase/ssr`         |
| Icons           | Lucide                                                                    |
| Tooling         | ESLint, Supabase CLI (type generation), Yarn, Docker (standalone output)  |

## Architecture

- **Server Components by default.** `"use client"` is used only where interactivity is needed (filters, modals, forms).
- **No API layer.** Pages call query functions in `src/lib/queries/`, and mutations go through Server Actions in `src/lib/actions/`.
- **URL-driven state.** Filtering and pagination live in URL search params, so every view is shareable and works without client-side JavaScript.
- **Auth.** Supabase Auth (email and password), guarded by a proxy that redirects unauthenticated requests to `/login`.
- **Least privilege.** The dashboard only ever uses the Supabase publishable key and relies on Row Level Security for data access, never a service role key.
- **Query tuning.** `sql/optimize-queries.sql` adds Postgres functions for the status and niche aggregates, composite indexes for the common filters, and a `pg_trgm` index for fast company-name search as the leads table grows.

## Project structure

```
src/
├── app/
│   ├── (auth)/          # Login and signup
│   ├── (dashboard)/     # Overview, leads, prospecting, dispatch, settings
│   └── api/auth/        # Logout route
├── components/          # Tables, filters, KPI cards, modals, and ui/ primitives
├── hooks/               # Client hooks (toasts)
├── lib/
│   ├── queries/         # Read functions used by Server Components
│   ├── actions/         # Server Actions for mutations
│   └── supabase/        # Browser and server Supabase clients
└── types/               # Generated database types
```

## Getting started

### Prerequisites

- Node.js 20+
- Yarn
- A Supabase project with the schema produced by the companion prospecting pipeline (leads, niches, cities, prospecting runs, dispatch runs, and settings). The dashboard will not show meaningful data against an empty project.

### Installation

```bash
git clone https://github.com/11GravityDevs/lead-prospector-dashboard.git
cd lead-prospector-dashboard
yarn install
cp .env.example .env
```

Fill in `.env`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Then start the dev server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command             | Description                   |
| ------------------- | ----------------------------- |
| `yarn dev`          | Start the development server  |
| `yarn build`        | Production build (standalone) |
| `yarn start`        | Serve the production build    |
| `yarn lint`         | Run ESLint                    |

## Deployment

`next.config.ts` uses `output: "standalone"`, and the included multi-stage `Dockerfile` (Node 22 Alpine, non-root user) packages that build into a small production image listening on port 3000.

## License

Distributed under the MIT license. See [LICENSE](LICENSE) for details.
