# Lead Prospector Dashboard

An internal dashboard for monitoring and configuring an automated B2B lead prospecting pipeline. It gives a small team visibility into how leads are being found, contacted, and moved through the pipeline, without needing to touch the database or the automation scripts directly.

## What it does

The dashboard sits on top of a Supabase database that is populated by a separate prospecting pipeline. That pipeline scrapes businesses from Google Maps by niche and city, enriches them with AI analysis, and dispatches WhatsApp outreach messages. This project is the control room for that pipeline:

- **Overview**: snapshot of total leads, leads by status, leads by niche, and the most recent prospecting and dispatch runs.
- **Leads**: searchable, filterable table of every prospected business, with a detail view showing contact info, category, rating, and AI analysis.
- **Prospecting**: execution log of prospecting runs (niche, city, leads found, status, duration).
- **Dispatch**: execution log of WhatsApp outreach runs (messages sent, errors, duration).
- **Settings**: live configuration for the pipeline, such as the WhatsApp dispatch schedule, how many leads are contacted per run, and the delays used to simulate human typing.

## Tech stack

- [Next.js](https://nextjs.org) (App Router, Server Components, Server Actions)
- [Supabase](https://supabase.com) (Postgres, Auth, Row Level Security) via `@supabase/ssr`
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Lucide React](https://lucide.dev) for icons

## Architecture

- Server Components by default. `"use client"` is used only where interactivity is needed (filters, modals, forms).
- No API layer between the app and the database: pages call query functions in `lib/queries/`, and mutations go through Server Actions in `lib/actions/`.
- Filtering and pagination are driven by URL search params, so state is shareable and works without client-side JavaScript.
- Auth is email and password based via Supabase Auth, guarded by a proxy that redirects unauthenticated requests to `/login`.
- The dashboard only ever uses the Supabase publishable (anon) key and relies on Row Level Security for data access, never a service role key.

## Getting started

```bash
git clone https://github.com/<your-username>/lead-prospector-dashboard.git
cd lead-prospector-dashboard
npm install
cp .env.example .env
```

Fill in `.env` with your own Supabase project URL and publishable key:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Then run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see it running. Note that this project expects the schema produced by the companion prospecting pipeline (tables for leads, niches, cities, prospecting runs, dispatch runs, and settings); it will not show meaningful data against an empty Supabase project.

## Available scripts

```bash
npm run dev     # Start the dev server
npm run build   # Production build (standalone output, ready for Docker)
npm run start   # Start the production server
npm run lint    # Run ESLint
```

## Docker

A `Dockerfile` is included for deploying the standalone build:

```bash
docker build -t lead-prospector-dashboard .
docker run -p 3000:3000 --env-file .env lead-prospector-dashboard
```

## License

Distributed under the MIT license. See [LICENSE](LICENSE) for details.
