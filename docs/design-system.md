# Design System

Referencia visual: Linear. Dark mode default, minimalista, custom components. Fonte: Inter.

---

## Cores

### Background (camadas do dark theme)

Hierarquia de superficies do mais profundo ao mais elevado.

| Token | Hex | Uso |
|---|---|---|
| `bg-app` | `#09090B` | Fundo da aplicacao inteira |
| `bg-surface` | `#111113` | Cards, sidebar, areas de conteudo |
| `bg-elevated` | `#18181B` | Hover de linhas de tabela, dropdowns |
| `bg-overlay` | `#000000/60%` | Backdrop do modal (fundo escurecido) |
| `bg-modal` | `#18181B` | Superficie do modal |
| `bg-input` | `#111113` | Campos de input, selects |

### Bordas

| Token | Hex | Uso |
|---|---|---|
| `border-default` | `#27272A` | Bordas de cards, separadores, tabela |
| `border-subtle` | `#1C1C1F` | Divisores secundarios |
| `border-focus` | `#22C55E` | Ring de foco em inputs e botoes |

### Texto

| Token | Hex | Uso |
|---|---|---|
| `text-primary` | `#FAFAFA` | Titulos, conteudo principal |
| `text-secondary` | `#A1A1AA` | Descricoes, labels, metadados |
| `text-tertiary` | `#71717A` | Placeholders, textos desabilitados |
| `text-inverse` | `#09090B` | Texto sobre botao primario preenchido |

### Cor primaria (verde)

| Token | Hex | Uso |
|---|---|---|
| `green-400` | `#4ADE80` | Texto verde sobre fundo escuro (links, destaques) |
| `green-500` | `#22C55E` | Botoes preenchidos, badges ativos, icones |
| `green-600` | `#16A34A` | Hover de botoes preenchidos |
| `green-500/10` | `#22C55E` com 10% opacidade | Background sutil de badges e highlights verdes |
| `green-500/20` | `#22C55E` com 20% opacidade | Hover de botoes ghost/outline verdes |

### Cores semanticas

| Token | Hex | Uso |
|---|---|---|
| `error` | `#EF4444` | Erros, estados destrutivos |
| `error/10` | `#EF4444` com 10% opacidade | Background de badges de erro |
| `warning` | `#F59E0B` | Alertas, atencao |
| `warning/10` | `#F59E0B` com 10% opacidade | Background de badges de alerta |
| `info` | `#3B82F6` | Informacoes neutras |
| `info/10` | `#3B82F6` com 10% opacidade | Background de badges informativos |

### Cores de status dos leads

Mapeamento direto do enum `lead_status` do banco.

| Status | Cor texto | Cor fundo (10% opacidade) | Significado |
|---|---|---|---|
| `new` | `#3B82F6` (blue) | `#3B82F6/10` | Lead novo, sem contato |
| `contacted` | `#22C55E` (green) | `#22C55E/10` | Primeiro contato feito |
| `follow_up` | `#F59E0B` (amber) | `#F59E0B/10` | Aguardando retorno |
| `won` | `#10B981` (emerald) | `#10B981/10` | Convertido |
| `lost` | `#EF4444` (red) | `#EF4444/10` | Perdido |
| `skipped` | `#71717A` (zinc) | `#71717A/10` | Ignorado |

---

## Tipografia

Fonte: **Inter** (variavel, via `next/font/google`).

| Token | Tamanho | Peso | Line-height | Uso |
|---|---|---|---|---|
| `display` | 30px | 600 (semibold) | 36px | Titulo da pagina ("Dashboard", "Leads") |
| `heading` | 20px | 600 (semibold) | 28px | Titulos de secao dentro da pagina |
| `subheading` | 14px | 500 (medium) | 20px | Titulos de cards, headers de tabela |
| `body` | 14px | 400 (regular) | 20px | Texto geral, conteudo de tabela |
| `small` | 12px | 400 (regular) | 16px | Badges, captions, timestamps, metadados |
| `mono` | 13px | 400 (regular) | 20px | Numeros em KPIs (usar `font-variant-numeric: tabular-nums`) |

---

## Espacamento

Base de 4px (padrao Tailwind). Escala usada no layout:

| Token | Valor | Uso |
|---|---|---|
| `space-1` | 4px | Gap minimo, padding interno de badges |
| `space-2` | 8px | Gap entre icone e texto, padding de badges |
| `space-3` | 12px | Padding interno de inputs e botoes |
| `space-4` | 16px | Gap entre itens de lista, padding de celulas de tabela |
| `space-6` | 24px | Padding interno de cards |
| `space-8` | 32px | Gap entre secoes |
| `space-10` | 40px | Margem entre blocos principais da pagina |

---

## Border Radius

| Token | Valor | Uso |
|---|---|---|
| `radius-sm` | 6px | Badges, tags |
| `radius-md` | 8px | Botoes, inputs, selects |
| `radius-lg` | 12px | Cards, modals, dropdowns |

---

## Sombras

Minimas e sutis. Em dark mode, bordas fazem mais trabalho que sombras.

| Token | Valor | Uso |
|---|---|---|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.4)` | Dropdowns, tooltips |
| `shadow-md` | `0 4px 12px rgba(0,0,0,0.5)` | Modals |

---

## Componentes

### Botao Primario

- Background: `green-500`
- Texto: `text-inverse` (escuro)
- Hover: `green-600`
- Padding: `12px 16px`
- Border radius: `radius-md`
- Fonte: `subheading` (14px medium)
- Transicao: `150ms ease` em background

### Botao Secundario (ghost)

- Background: transparente
- Texto: `text-secondary`
- Hover: `bg-elevated`
- Borda: `border-default`
- Padding: `12px 16px`
- Border radius: `radius-md`

### Input / Select

- Background: `bg-input`
- Borda: `border-default`
- Texto: `text-primary`
- Placeholder: `text-tertiary`
- Focus: borda `border-focus` com ring `green-500/20` (box-shadow)
- Padding: `10px 12px`
- Border radius: `radius-md`
- Fonte: `body`

### Badge de Status

Estilo: texto colorido sobre fundo com opacidade baixa (ghost badge).

- Padding: `4px 8px`
- Border radius: `radius-sm`
- Fonte: `small` (12px) com weight 500
- Cores: conforme tabela de status dos leads

Exemplo visual: texto `#22C55E` sobre fundo `#22C55E` com 10% opacidade = badge "Contacted"

### Card (KPI)

- Background: `bg-surface`
- Borda: `border-default` (1px solid)
- Border radius: `radius-lg`
- Padding: `space-6`
- Conteudo:
  - Label: `small`, `text-secondary`
  - Valor: `display` ou 24px semibold, `text-primary`, `tabular-nums`

### Tabela

- Header: `subheading`, `text-secondary`, sem background (transparente)
- Bordas: `border-default` apenas no bottom de cada linha
- Celulas: `body`, `text-primary`
- Hover na linha: `bg-elevated`
- Padding celula: `12px 16px`
- Cursor: `pointer` em linhas clicaveis

### Modal

- Backdrop: `bg-overlay`
- Superficie: `bg-modal`
- Borda: `border-default`
- Border radius: `radius-lg`
- Shadow: `shadow-md`
- Largura: `640px` (max)
- Padding: `space-6`
- Header: `heading` + botao de fechar (X) alinhado a direita
- Secoes internas separadas por `border-subtle`

### Sidebar

- Background: `bg-surface`
- Largura: `240px`
- Borda direita: `border-default`
- Itens de navegacao:
  - Padding: `8px 12px`
  - Border radius: `radius-md`
  - Inativo: `text-secondary`
  - Hover: `bg-elevated`, `text-primary`
  - Ativo: `green-500/10` como background, `green-400` como texto
- Logo: topo, `space-6` de padding
- Usuario: rodape, avatar 28px + nome em `small`

---

## Iconografia

- Estilo: outline, stroke 1.5px (consistente com Linear)
- Tamanho padrao: 16px na sidebar e tabela, 20px em botoes
- Biblioteca sugerida: Lucide Icons (mesma base do Linear)
- Cor: herda `currentColor` do texto pai

---

## Resumo de tokens para Tailwind (`tailwind.config.ts`)

```
colors:
  bg:
    app:       #09090B
    surface:   #111113
    elevated:  #18181B
    input:     #111113
    modal:     #18181B
  border:
    default:   #27272A
    subtle:    #1C1C1F
  text:
    primary:   #FAFAFA
    secondary: #A1A1AA
    tertiary:  #71717A
    inverse:   #09090B
  green:
    400:       #4ADE80
    500:       #22C55E
    600:       #16A34A
  status:
    new:       #3B82F6
    contacted: #22C55E
    follow-up: #F59E0B
    won:       #10B981
    lost:      #EF4444
    skipped:   #71717A
  error:       #EF4444
  warning:     #F59E0B
  info:        #3B82F6

borderRadius:
  sm: 6px
  md: 8px
  lg: 12px

fontFamily:
  sans: Inter Variable, sans-serif
```
