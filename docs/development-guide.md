# Guia de Desenvolvimento — Dashboard

Stack: Next.js 15 (App Router) + Tailwind v4 + Supabase + TypeScript.

---

## Estrutura de pastas

```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── signup/
│       └── page.tsx
├── (dashboard)/
│   ├── layout.tsx                  # Sidebar + area de conteudo
│   ├── page.tsx                    # Home
│   ├── leads/
│   │   └── page.tsx
│   ├── prospecting/
│   │   └── page.tsx
│   ├── dispatch/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
├── layout.tsx                      # Root layout (fonte, globals)
└── globals.css

lib/
├── supabase/
│   ├── server.ts                   # createServerClient (cookies)
│   └── proxy.ts                    # Helper de auth para proxy
├── queries/
│   ├── leads.ts                    # getLeads, getLeadByPlaceId
│   ├── dashboard.ts                # getKpis, getLeadsByNiche, getLatestRuns
│   ├── prospecting-runs.ts         # getProspectingRuns
│   ├── dispatch-runs.ts            # getDispatchRuns
│   └── settings.ts                 # getSettings, updateSettings
├── actions/
│   ├── login.ts                    # Server Action: login (email/senha)
│   ├── signup.ts                   # Server Action: signup (nome/email/senha)
│   └── settings.ts                 # Server Action: saveSettings
└── format.ts                       # Formatadores (data, duracao, telefone)

components/
├── ui/                             # Primitivos do design system
│   ├── button.tsx
│   ├── badge.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── card.tsx
│   ├── table.tsx
│   └── modal.tsx
├── sidebar.tsx
├── kpi-cards.tsx
├── leads-filters.tsx
├── leads-table.tsx
├── lead-detail-modal.tsx
├── prospecting-runs-table.tsx
├── dispatch-runs-table.tsx
└── settings-form.tsx

types/
└── database.ts                     # Tipos gerados pelo Supabase CLI

proxy.ts                       # Auth guard global
```

### Decisoes de estrutura

**Route groups** `(auth)` e `(dashboard)` separam layouts: login e signup nao tem sidebar, paginas autenticadas sim. O Next.js trata route groups como agrupamento logico sem afetar a URL.

**`lib/queries/`** centraliza todo acesso ao Supabase. Paginas nunca chamam Supabase diretamente — importam funcoes daqui. Isso facilita reutilizar queries, tipar retornos e trocar a fonte de dados no futuro.

**`components/ui/`** contem apenas primitivos genericos e reutilizaveis (Button, Badge, Modal). Componentes compostos e especificos de dominio (LeadsTable, KpiCards) ficam na raiz de `components/`.

---

## Convencoes de codigo

### Nomenclatura

| Item | Padrao | Exemplo |
|---|---|---|
| Arquivos e pastas | kebab-case | `leads-table.tsx`, `dispatch-runs.ts` |
| Componentes React | PascalCase | `LeadsTable`, `KpiCards` |
| Funcoes e variaveis | camelCase | `getLeads`, `formatDuration` |
| Tipos e interfaces | PascalCase | `Lead`, `ProspectingRun` |
| Constantes | UPPER_SNAKE_CASE | `ITEMS_PER_PAGE` |

### Imports

- Sem barrel exports (sem `index.ts` que re-exporta). Importar direto do arquivo.
- Usar path alias `@/` configurado no `tsconfig.json` apontando para a raiz do projeto.

```tsx
import { getLeads } from "@/lib/queries/leads"
import { Badge } from "@/components/ui/badge"
```

### Exports

- Componentes de pagina (`page.tsx`): `export default` (exigido pelo Next.js).
- Todo o resto: `export` nomeado. Sem `export default` em componentes, funcoes e tipos.

```tsx
// components/ui/badge.tsx
export function Badge({ ... }) { ... }

// lib/queries/leads.ts
export async function getLeads({ ... }) { ... }
```

---

## Server Components vs Client Components

Regra: **Server Component por padrao.** Usar `"use client"` apenas quando o componente precisa de interatividade no browser.

| Componente | Tipo | Motivo |
|---|---|---|
| `page.tsx` (todas) | Server | Busca dados no servidor, sem estado |
| `layout.tsx` (dashboard) | Server | Estrutura estatica |
| `Sidebar` | Server | Links estaticos, nao precisa de estado |
| `NavLink` (item ativo) | Client | Usa `usePathname()` para marcar item ativo |
| `KpiCards` | Server | Recebe dados via props, apenas renderiza |
| `LeadsTable` | Server | Recebe dados via props, apenas renderiza |
| `LeadsFilters` | Client | Controla inputs e atualiza search params |
| `LeadDetailModal` | Client | Controla estado de aberto/fechado |
| `SettingsForm` | Client | Formulario com estado, validacao e submit via Server Action |
| `Badge`, `Button`, etc | Server | Apenas props, sem hooks |

### Como as paginas buscam dados

Paginas sao Server Components async. Recebem `searchParams`, chamam queries e passam os dados para componentes filhos via props.

```tsx
// app/(dashboard)/leads/page.tsx
import { getLeads } from "@/lib/queries/leads"
import { LeadsFilters } from "@/components/leads-filters"
import { LeadsTable } from "@/components/leads-table"

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ niche?: string; status?: string; q?: string; page?: string }>
}) {
  const params = await searchParams
  const { leads, total } = await getLeads(params)

  return (
    <>
      <LeadsFilters />
      <LeadsTable leads={leads} total={total} />
    </>
  )
}
```

---

## Filtros e paginacao via URL

Filtros, busca e paginacao usam **search params na URL** (`?niche=pet_shop&status=new&page=2`). Isso garante:

- Estado visivel e compartilhavel (copiar URL com filtros aplicados)
- Server Components re-renderizam com os dados corretos
- Sem estado client desnecessario

O componente `LeadsFilters` (Client Component) atualiza os search params usando `useRouter` + `useSearchParams`:

```tsx
"use client"

import { useRouter, useSearchParams } from "next/navigation"

export function LeadsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete("page")
    router.push(`?${params.toString()}`)
  }

  // ...
}
```

---

## Acesso a dados (lib/queries)

Cada arquivo em `lib/queries/` exporta funcoes async que criam um Supabase client server-side e executam a query.

```tsx
// lib/queries/leads.ts
import { createClient } from "@/lib/supabase/server"

const ITEMS_PER_PAGE = 20

interface GetLeadsParams {
  niche?: string
  status?: string
  q?: string
  page?: string
}

export async function getLeads(params: GetLeadsParams) {
  const supabase = await createClient()
  const page = Number(params.page) || 1
  const from = (page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  let query = supabase
    .from("leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to)

  if (params.niche) query = query.eq("niche", params.niche)
  if (params.status) query = query.eq("status", params.status)
  if (params.q) query = query.ilike("company_name", `%${params.q}%`)

  const { data, count } = await query

  return { leads: data ?? [], total: count ?? 0 }
}
```

---

## Autenticacao

### Fluxo

1. `proxy.ts` intercepta toda request
2. Se nao autenticado e rota != `/login` ou `/signup` → redirect para `/login`
3. Se autenticado e rota == `/login` ou `/signup` → redirect para `/`
4. Login usa Server Action com `supabase.auth.signInWithPassword({ email, password })`
5. Cadastro usa Server Action com `supabase.auth.signUp({ email, password, options: { data: { full_name } } })`
6. Logout via POST em `/api/auth/logout` que chama `supabase.auth.signOut()`

### Supabase client server-side

```tsx
// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        },
      },
    },
  )
}
```

### Proxy (auth guard)

```tsx
// proxy.ts
import { type NextRequest, NextResponse } from "next/server"
import { createProxyClient } from "@/lib/supabase/proxy"

export async function proxy(request: NextRequest) {
  const { supabase, response } = await createProxyClient(request)
  const { data: { user } } = await supabase.auth.getUser()

  const isAuthPage =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/signup"

  if (!user && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return response()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
}
```

### Logout

```tsx
// app/api/auth/logout/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  await supabase.auth.signOut()

  return NextResponse.redirect(new URL("/login", request.url))
}
```

---

## Tipos

Gerar tipos do Supabase automaticamente:

```bash
npx supabase gen types typescript --project-id <project-id> > types/database.ts
```

Derivar tipos uteis a partir do tipo gerado:

```tsx
// types/database.ts (apos geracao, adicionar no final)
import type { Database } from "./database"

export type Lead = Database["public"]["Tables"]["leads"]["Row"]
export type ProspectingRun = Database["public"]["Tables"]["prospecting_runs"]["Row"]
export type DispatchRun = Database["public"]["Tables"]["dispatch_runs"]["Row"]
export type Niche = Database["public"]["Tables"]["niches"]["Row"]
export type Setting = Database["public"]["Tables"]["settings"]["Row"]
export type LeadStatus = Database["public"]["Enums"]["lead_status"]
```

---

## Componentes UI (custom)

Abordagem: componentes pequenos, com props tipadas, sem logica de negocio.

### Pattern de composicao

```tsx
// components/ui/card.tsx
interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={`rounded-lg border border-border-default bg-bg-surface p-6 ${className ?? ""}`}>
      {children}
    </div>
  )
}
```

### Concatenacao de classes

Usar uma funcao `cn` minima para merge condicional de classes Tailwind. Nao precisa de lib — basta:

```tsx
// lib/cn.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Dependencias: `clsx` + `tailwind-merge`. Sao micro-libs (sem overhead) e evitam conflitos de classes Tailwind.

---

## Formatadores

Centralizar em `lib/format.ts`. Funcoes puras, sem side effects.

```tsx
// lib/format.ts
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`
  const min = Math.floor(seconds / 60)
  const sec = Math.round(seconds % 60)
  return `${min}m ${sec}s`
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function formatPhone(phone: string | null): string {
  if (!phone) return "-"
  const clean = phone.replace(/\D/g, "")
  if (clean.length === 13) {
    return `+${clean.slice(0, 2)} (${clean.slice(2, 4)}) ${clean.slice(4, 9)}-${clean.slice(9)}`
  }
  return phone
}
```

---

## Server Actions (mutations)

A tela de settings introduz escrita no banco. Mutations usam Server Actions em arquivos dedicados em `lib/actions/`.

### Pattern

```tsx
// lib/actions/settings.ts
"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

interface SaveSettingsInput {
  key: string
  value: string
}

export async function saveSettings(settings: SaveSettingsInput[]) {
  const supabase = await createClient()

  for (const { key, value } of settings) {
    const { error } = await supabase
      .from("settings")
      .update({ value, updated_at: new Date().toISOString() })
      .eq("key", key)

    if (error) {
      return { success: false, error: `Erro ao salvar ${key}` }
    }
  }

  revalidatePath("/settings")
  return { success: true }
}
```

### Convencoes para Server Actions

- Arquivo separado com `"use server"` no topo (nao inline no componente)
- Retornam `{ success: boolean, error?: string }` para feedback na UI
- Chamam `revalidatePath` apos mutacao para atualizar dados no Server Component
- Validacao acontece em dois lugares: client-side (UX imediata) e server-side (seguranca)
- Nao lançam exceptions — retornam objetos de resultado

### Consumo no Client Component

```tsx
// components/settings-form.tsx
"use client"

import { useTransition } from "react"
import { saveSettings } from "@/lib/actions/settings"

export function SettingsForm({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: Record<string, string>) {
    const changed = Object.entries(formData)
      .filter(([key, value]) => value !== initialSettings[key])
      .map(([key, value]) => ({ key, value }))

    if (changed.length === 0) return

    startTransition(async () => {
      const result = await saveSettings(changed)
      // mostrar toast de sucesso ou erro
    })
  }

  // ...
}
```

`useTransition` mantem a UI responsiva durante o submit e fornece `isPending` para desabilitar o botao e mostrar loading.

---

## Variaveis de ambiente

Separar variaveis do dashboard das variaveis da pipeline existente.

```
# Dashboard (Next.js)
NEXT_PUBLIC_SUPABASE_URL=        # Mesmo projeto Supabase
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=   # Chave anon (RLS protege os dados)
```

`NEXT_PUBLIC_` expoe para o browser — usar apenas para URL e anon key. A service key do Supabase NAO deve ser usada no dashboard (RLS com a anon key e suficiente para leitura).

---

## Performance

### Data fetching

- Queries no Supabase usam `.select("campo1, campo2")` com campos explicitos em vez de `"*"` em tabelas com muitas colunas (ex: `leads`). Isso reduz payload e tempo de resposta.
- Paginacao server-side obrigatoria na tabela de leads (`.range(from, to)` no Supabase).
- KPIs da home podem usar queries `.select("status", { count: "exact", head: true })` com filtro por status em vez de trazer todos os leads.

### Renderizacao

- `loading.tsx` em cada rota do dashboard para mostrar skeleton enquanto dados carregam (streaming do React Server Components).
- Modal do lead usa dados ja presentes na listagem para exibicao imediata. Se precisar de campos adicionais, faz fetch sob demanda.

---

## Deploy (VPS)

- Build: `next build` gera output standalone (configurar `output: "standalone"` no `next.config.ts`)
- Rodar com `node .next/standalone/server.js` (nao precisa de `next start` nem do node_modules inteiro)
- Usar process manager (PM2 ou systemd) para manter o processo vivo
- Reverse proxy (Nginx ou Caddy) na frente para HTTPS e dominio
- Variaveis de ambiente no `.env.local` da VPS ou via env do process manager
- Supabase Auth configurado para permitir signup com email/senha (desabilitar confirmacao de email ou criar usuarios com `email_confirmed_at` preenchido)

---

## Resumo de dependencias

| Pacote | Uso |
|---|---|
| `next` | Framework |
| `react`, `react-dom` | UI |
| `@supabase/supabase-js` | Client Supabase |
| `@supabase/ssr` | Auth server-side (cookies) |
| `tailwindcss`, `@tailwindcss/postcss` | Estilos |
| `clsx` | Concatenacao condicional de classes |
| `tailwind-merge` | Resolve conflitos de classes Tailwind |
| `lucide-react` | Icones |
| `typescript` | Tipagem |
