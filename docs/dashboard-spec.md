# Dashboard — Especificacao de Telas e Funcionalidades

## Contexto

Dashboard interno para equipe de 4 pessoas. Monitoramento + configuracao da pipeline. Estilo visual minimalista (referencia: Linear/Vercel). Desktop only. Stack: Next.js + Tailwind + Server Actions + Supabase direto.

---

## Autenticacao

- Login com email e senha via Supabase Auth
- Cadastro com nome, email e senha
- Redirect para `/login` se nao autenticado
- Apos login, redireciona para Home

---

## Telas

### 1. Login (`/login`)

Tela simples e centralizada.

**Elementos:**
- Logo/nome do produto
- Campos de email e senha
- Botao "Entrar"
- Link para cadastro (`/signup`)
- Fundo clean, sem sidebar

---

### 1b. Cadastro (`/signup`)

Tela simples e centralizada, mesmo layout do login.

**Elementos:**
- Logo/nome do produto
- Campos de nome, email e senha
- Botao "Criar conta"
- Link para login (`/login`)
- Fundo clean, sem sidebar

---

### 2. Home / Dashboard (`/`)

Visao geral em snapshot. Primeira tela apos o login.

**KPIs (cards no topo):**
- Total de leads
- Leads novos (status `new`)
- Leads contatados (status `contacted`)
- Leads ganhos (status `won`)

**Leads por nicho (tabela ou cards):**
- Nicho | Total leads | Novos | Contatados | Ganhos

**Leads por status (grafico ou distribuicao visual):**
- Distribuicao entre: `new`, `contacted`, `skipped`, `follow_up`, `lost`, `won`

**Ultima atividade (resumo):**
- Ultima execucao de prospecção: horario, nicho, cidade, leads novos encontrados
- Ultimo disparo WhatsApp: horario, total enviados, erros

---

### 3. Leads (`/leads`)

Listagem principal de leads com busca e filtros.

**Filtros (barra superior):**
- Busca por nome da empresa (text input)
- Filtro por nicho (select/dropdown, niches table has `slug` only — display via `formatSlug`)
- Filtro por status (select/dropdown)

**Tabela (colunas visiveis):**
| Coluna | Campo |
|---|---|
| Empresa | `company_name` |
| Nicho | `niche` (displayed via `formatSlug`) |
| Telefone | `phone_whatsapp` ?? `phone_gmb` |
| Status | `status` (badge colorido) |
| Avaliacao | `rating` + `review_count` |
| Mensagem | `personalized_message` (truncada) |
| Data | `created_at` |

**Comportamento:**
- Paginacao
- Clicar na linha abre o modal de detalhe
- Ordenacao por data (mais recentes primeiro)

---

### 4. Detalhe do Lead (Modal sobre `/leads`)

Modal overlay que abre ao clicar em um lead na listagem.

**Secao: Dados de Contato**
- Nome da empresa
- Telefone GMB (`phone_gmb`) / Telefone WhatsApp (`phone_whatsapp`)
- Website (link clicavel)
- Endereco (`address`)
- Link do Google Maps (`gmb_link`)
- Avaliacao (`rating` + `review_count`)
- Status atual do lead (badge)

**Secao: Mensagem de Abordagem**
- Mensagem personalizada gerada pela IA

**Secao: Analise IA**
- Descricao do negocio (`business_description`)
- Resumo (`business_summary`)
- Pontos positivos (`positive_points`)
- Pontos negativos (`negative_points`)
- Percepcao geral (`general_perception`)
- Oportunidade identificada (`ai_opportunity`)

---

### 5. Historico de Prospecção (`/prospecting`)

Historico de execucoes da pipeline de prospecção.

**Tabela:**
| Coluna | Campo |
|---|---|
| Data/Hora | `finished_at` |
| Nicho | `niche_slug` |
| Cidade | `city_name` |
| Processados | `total_processed` |
| Novos | `total_new` |
| Erros | `total_errors` |
| Duracao | `duration_seconds` (formatado) |
| Status | `run_status` (badge: sucesso/erro) |

**Comportamento:**
- Ordenado por data (mais recente primeiro)
- Paginacao
- Linhas com `total_errors > 0` ou status de erro com destaque visual (badge vermelho, icone de alerta)
- Filtro por nicho (opcional)

---

### 6. Historico de Disparos (`/dispatch`)

Historico de execucoes de disparo de WhatsApp.

**Tabela:**
| Coluna | Campo |
|---|---|
| Data/Hora | `finished_at` |
| Enviados | `total_sent` |
| Ignorados | `total_skipped` |
| Erros | `total_errors` |
| Duracao | `duration_seconds` (formatado) |
| Nichos | `niches_processed` (lista de badges) |

Note: `dispatch_runs` does not have a `run_status` column (unlike `prospecting_runs`).

**Comportamento:**
- Ordenado por data (mais recente primeiro)
- Paginacao
- Linhas com erros em destaque visual

---

### 7. Configuracoes (`/settings`)

Tela de configuracao da pipeline. Primeira tela com escrita (Server Action).

A tabela `settings` no Supabase e key-value (`key TEXT, value TEXT`). O formulario agrupa as chaves em secoes logicas e apresenta inputs adequados ao tipo de dado. Valores de tempo sao armazenados em milissegundos no banco mas exibidos em segundos na interface.

**Secao: Agendamento**

| Campo | Chave no banco | Input | Descricao exibida |
|---|---|---|---|
| Cron de prospecção | `prospecting_cron` | Text | Expressao cron que define quando a pipeline roda |
| Cron de disparo WhatsApp | `whatsapp_cron` | Text | Expressao cron que define quando as mensagens sao enviadas |
| Intervalo do scheduler | `scheduler_poll_interval_ms` | Number (exibir em segundos) | Intervalo em que o scheduler verifica mudancas nas configuracoes |

**Secao: Disparo WhatsApp**

| Campo | Chave no banco | Input | Descricao exibida |
|---|---|---|---|
| Leads por disparo | `leads_per_dispatch` | Number | Quantidade de leads contatados por nicho em cada execucao |
| Delay minimo entre mensagens | `whatsapp_delay_min_ms` | Number (exibir em segundos) | Tempo minimo de espera entre envios |
| Delay maximo entre mensagens | `whatsapp_delay_max_ms` | Number (exibir em segundos) | Tempo maximo de espera entre envios |
| Digitacao minima | `evolution_typing_min_ms` | Number (exibir em segundos) | Tempo minimo de simulacao de digitacao |
| Digitacao maxima | `evolution_typing_max_ms` | Number (exibir em segundos) | Tempo maximo de simulacao de digitacao |

**Layout:**
- Titulo da pagina: "Configuracoes"
- Secoes separadas por titulo (`heading`) e divisor visual
- Cada campo: label + descricao (`text-secondary`) + input
- Botao "Salvar" (primario) fixo no final do formulario
- Feedback apos salvar: toast de sucesso ou erro no topo da pagina

**Validacoes (client-side antes de enviar):**
- Campos numericos: inteiro positivo
- Campos de delay/digitacao: min < max (ex: `whatsapp_delay_min_ms` < `whatsapp_delay_max_ms`)
- Campos de cron: nao vazio

**Comportamento:**
- Pagina carrega com os valores atuais do banco
- Botao "Salvar" fica desabilitado ate que algum valor seja alterado
- Apos salvar com sucesso, valores atualizados refletem imediatamente
- A pipeline le essas configuracoes a cada ciclo, entao mudancas surtem efeito no proximo tick

---

## Layout Global

**Sidebar fixa (esquerda):**
- Logo no topo
- Navegacao:
  - Home (icone: LayoutGrid)
  - Leads (icone: Users)
  - Prospecção (icone: Radar)
  - Disparos (icone: Send)
  - separador visual
  - Configuracoes (icone: Settings)
- Usuario logado no rodape da sidebar (avatar + nome)
- Botao de logout

**Area de conteudo:**
- Header com titulo da pagina atual
- Conteudo abaixo

---

## Mapa de Navegacao

```
/login <--> /signup
  |
  v
/ (Home)
  |-- /leads
  |     |-- [modal] Detalhe do Lead
  |-- /prospecting
  |-- /dispatch
  |-- /settings
```

---

## Paginacao

Padrao para todas as tabelas (leads, prospecting runs, dispatch runs):

- **20 itens por pagina**
- Navegacao: botoes "Anterior" e "Proximo" + indicador "Pagina X de Y"
- Estado via search param `?page=2`
- Botao "Anterior" desabilitado na primeira pagina
- Botao "Proximo" desabilitado na ultima pagina
- Ao aplicar filtro, volta para pagina 1

---

## Estados de vazio

Cada tela deve tratar o cenario sem dados. Layout: icone + titulo + descricao centralizada na area de conteudo.

### Home (sem dados)

- **Quando:** nenhum lead e nenhum run registrado (primeiro acesso)
- **Icone:** LayoutGrid (Lucide)
- **Titulo:** "Nenhum dado ainda"
- **Descricao:** "Aguardando a primeira execucao da pipeline de prospecção."
- **KPI cards:** exibir normalmente com valores zerados (0)

### Leads (sem resultados)

Dois cenarios distintos:

**Nenhum lead no banco:**
- **Icone:** Users (Lucide)
- **Titulo:** "Nenhum lead encontrado"
- **Descricao:** "Os leads aparecerao aqui apos a primeira execucao da pipeline."

**Filtros sem resultado (existem leads, mas filtro nao retorna nada):**
- **Icone:** SearchX (Lucide)
- **Titulo:** "Nenhum resultado"
- **Descricao:** "Tente ajustar os filtros ou o termo de busca."

### Historico de Prospecção (vazio)

- **Icone:** Radar (Lucide)
- **Titulo:** "Nenhuma execucao registrada"
- **Descricao:** "O historico aparecera aqui apos a primeira execucao da pipeline."

### Historico de Disparos (vazio)

- **Icone:** Send (Lucide)
- **Titulo:** "Nenhum disparo registrado"
- **Descricao:** "O historico aparecera aqui apos o primeiro disparo de mensagens."

---

## Estados de erro

Quando uma query ao Supabase falha, exibir um toast de erro no canto superior direito da tela.

- **Variante:** erro (fundo com cor `error`, icone AlertTriangle)
- **Titulo:** "Erro ao carregar dados"
- **Descricao:** "Nao foi possivel conectar ao banco de dados. Tente novamente."
- **Auto-dismiss:** 5 segundos (com opcao de fechar manualmente)
- **Animacao:** slide-in da direita + fade-out ao sair

Implementacao: cada `page.tsx` faz a query dentro de try/catch. Em caso de erro, dispara um toast de erro via hook `useToast`. Componentes necessarios: `components/ui/toast.tsx`, `hooks/use-toast.ts`, `components/toast-provider.tsx` (adicionado no root layout). Nao usar `error.tsx` do Next.js para evitar perder o layout (sidebar).

---

## Fora do escopo (features futuras)

- Gerenciamento de leads (editar status, notas, atribuir)
- CRUD de nichos e cidades pelo dashboard (settings cobre apenas parametros da pipeline, nao entidades)
- Controle manual de disparo (pausar/retomar, selecionar leads)
- Follow-up automatizado
- Visao por nicho (estado da rotacao de cidades)
- Visao temporal (graficos de evolucao ao longo do tempo)
- Responsividade mobile/tablet
- Multi-tenant / SaaS
