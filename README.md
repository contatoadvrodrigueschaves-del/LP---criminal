# Rodrigues Chaves Advocacia — Landing Page

Landing page institucional de prospecção para escritório de advocacia criminal
especializado em provas digitais. Single-page, Vite + TypeScript vanilla +
Tailwind CSS, sem backend próprio nesta fase (conversão via WhatsApp).

## Stack

- [Vite](https://vitejs.dev/) — build tool e dev server
- TypeScript vanilla (sem framework de UI)
- [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite`

## Requisitos

- Node.js 18+ e npm instalados. Verifique com:

```bash
node -v
npm -v
```

Se não tiver Node instalado, baixe em https://nodejs.org (versão LTS).

## Rodando localmente

```bash
npm install
npm run dev
```

O Vite abrirá o site em `http://localhost:5173` com hot reload.

## Build de produção

```bash
npm run build
```

Gera os arquivos estáticos otimizados em `dist/`. Para pré-visualizar o build:

```bash
npm run preview
```

## Deploy

O projeto é 100% estático — publique a pasta `dist/` em qualquer host estático:

- **Vercel**: `vercel --prod` (framework preset: Vite)
- **Netlify**: build command `npm run build`, publish directory `dist`
- **Cloudflare Pages**: build command `npm run build`, output directory `dist`

Atualize a URL canônica e as tags Open Graph em [`index.html`](index.html) e o
domínio em [`public/robots.txt`](public/robots.txt) /
[`public/sitemap.xml`](public/sitemap.xml) antes de publicar.

## Estrutura do projeto

```
src/
├── main.ts               # bootstrap: importa CSS e monta todas as seções
├── style.css              # tema Tailwind (paleta, fontes) e estilos globais
├── sections/               # um módulo por seção da página (render(container))
├── components/             # botão WhatsApp sticky, accordion acessível
├── triagem/                # formulário de triagem multi-etapas (modal)
├── lib/                    # helpers de DOM e wrapper de analytics
└── types/                  # tipos das respostas da triagem
```

Cada seção exporta uma função `render*()` que injeta HTML no container
correspondente definido em `index.html` (`#hero`, `#situacoes`, etc.), evitando
um único arquivo monolítico.

## Formulário de triagem

O botão "Iniciar triagem" abre um modal com 4 passos (situação → etapa →
urgência → dados de contato), barra de progresso e tela de confirmação antes
de redirecionar para o WhatsApp. A mensagem enviada é montada automaticamente
em [`src/triagem/whatsapp-message.ts`](src/triagem/whatsapp-message.ts) a
partir das respostas.

Não há envio para backend — o único destino dos dados hoje é o link
`wa.me` gerado no navegador do próprio usuário.

### Onde plugar um backend de captura de leads no futuro

Dois pontos estão marcados com `TODO(lead-capture)` para receber a integração
com e-mail/CRM sem quebrar o fluxo atual do WhatsApp:

- [`src/triagem/triagem.ts`](src/triagem/triagem.ts) — no handler de submit do
  formulário de contato (`renderStepContato`) e no clique de confirmação
  (`renderConfirmacao`), antes/depois de redirecionar para o WhatsApp.

Sugestão de implementação futura: `fetch()` para um endpoint serverless
(Vercel/Netlify Function ou Cloudflare Worker) que grave o lead num CRM ou
dispare um e-mail, mantendo o redirecionamento para o WhatsApp como fallback
garantido mesmo se a chamada falhar.

## Analytics (GA4 / Meta Pixel)

Os SDKs ficam comentados em [`index.html`](index.html) com instruções de onde
colocar os IDs reais. O wrapper de eventos já está pronto em
[`src/lib/analytics.ts`](src/lib/analytics.ts) e dispara, independentemente
dos SDKs estarem ativos:

- `whatsapp_click` — qualquer clique em um link de WhatsApp (com `source`)
- `triagem_start` — abertura do modal de triagem
- `triagem_step_complete` — conclusão de cada passo do formulário
- `triagem_complete` — confirmação final antes do redirecionamento

Para ativar: preencha os IDs nos comentários do `index.html` e descomente os
scripts.

## Compliance OAB

O aviso do Provimento nº 205/2021 do CFOAB está fixo no rodapé
([`src/sections/footer.ts`](src/sections/footer.ts)) e não deve ser removido,
escondido em modal ou tornado opcional.

## Configurações que precisam de dados reais antes de publicar

- Número de WhatsApp: `WHATSAPP_NUMBER` em
  [`src/components/whatsapp-button.ts`](src/components/whatsapp-button.ts)
- Domínio canônico e imagem OG: [`index.html`](index.html)
- `public/sitemap.xml` e `public/robots.txt`
- IDs de GA4 / Meta Pixel (ver seção Analytics acima)
