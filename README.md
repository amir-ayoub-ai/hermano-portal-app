# Portal do Cliente — Garcez Consultoria (SAHF App)

Portal de acompanhamento para clientes do escritório Luiz Garcez Consultoria
Jurídica. Os clientes acompanham o andamento do seu planejamento patrimonial
e holding familiar, organizado em uma jornada de etapas progressivas.

## Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** + componentes shadcn-style sobre Radix UI
- **React Router v6** para navegação
- **next-themes** para alternância dark/light
- **sonner** para toasts
- Deploy em **Cloudflare Pages**

## Estrutura

```
src/
├── features/           módulos do produto (auth, home, sv, croqui, holding, sahf, admin)
├── components/
│   ├── ui/             componentes de UI primitivos (Button, Card, Input, etc.)
│   └── shared/         componentes compartilhados (AppHeader, ProtectedRoute, …)
├── contexts/           AuthContext, ThemeProvider
├── lib/                utilitários + dados mock
├── types/              tipos do domínio (User, Stage, Module, …)
└── assets/logos/       identidade visual oficial
```

## Modelo de jornada

A jornada do cliente tem **3 etapas obrigatórias** em ordem fixa:

1. **Sessão de Viabilidade** (`sv`)
2. **Projeto Estrutural** (`croqui`)
3. **Holding Familiar** (`holding`)

O **SAHF** (Gestão de Legado Contínua) é um **add-on independente**,
contratado separadamente. Para clientes sem SAHF, o card aparece com efeito
"teaser" (blur + cadeado) para gerar curiosidade.

## Desenvolvimento

```sh
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # gera dist/
```

## Deploy

Auto-deploy via Cloudflare Pages a cada push na branch `main`.

URL pública: <https://garcez-portal.pages.dev>

Para deploy manual:

```sh
pnpm build
npx wrangler pages deploy dist --project-name=garcez-portal --branch=main
```
