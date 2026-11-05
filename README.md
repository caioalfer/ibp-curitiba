# Site do Instituto Bom Pastor – Curitiba

Site do apostolado do Instituto Bom Pastor em Curitiba (Missa Tradicional, rito tridentino).

- **Stack:** Next.js 16 (App Router) + Tailwind CSS 4 + Sanity (painel em `/studio`).
- **Escopo, decisões e pendências:** [docs/projeto.md](docs/projeto.md).
- **Sistema visual (cores, tipografia, componentes, temas):** [DESIGN.md](DESIGN.md).
- **Produto (público, propósito, princípios):** [PRODUCT.md](PRODUCT.md).

## Rodar localmente

Requer Node.js 20 ou mais novo.

```bash
npm install
npm run dev      # http://localhost:3000
```

Outros comandos:

```bash
npm run build    # build de produção
npm run lint     # ESLint
npx tsc --noEmit # checagem de tipos
```

**Sem `.env.local`, o site já funciona:** horários padrão, locais, "Sobre" e configurações vêm de [src/lib/fallback.ts](src/lib/fallback.ts), e avisos, artigos e notícias de **exemplo** vêm de [src/lib/exemplos.ts](src/lib/exemplos.ts). O conteúdo de exemplo aparece marcado como "Exemplo" e some sozinho quando o Sanity estiver configurado. O painel `/studio` só funciona depois de configurar o Sanity.

> **Projeto dentro do OneDrive:** o `npm run dev` às vezes não percebe mudanças no `src/app/globals.css`. Se uma mudança de cor ou estilo não aparecer, pare o servidor, apague a pasta `.next/dev` e rode `npm run dev` de novo.

## Páginas

| Rota | Conteúdo |
|---|---|
| `/` | Topo com foto e a **próxima Missa**; seções de Avisos, Esta semana (programação dos próximos 7 dias), Palavra do padre (artigos), Notícias e O Instituto |
| `/horarios` | Horários habituais por dia e os dois locais com link para o mapa |
| `/avisos` | Avisos dentro da validade |
| `/noticias` e `/noticias/[slug]` | Notícias com foto; as 12 mais recentes em destaque, todas as anteriores no **Arquivo**, por ano, e **busca** por título, resumo, tema ou data |
| `/artigos` e `/artigos/[slug]` | Ensaios ("Palavra do padre"), com imagem, data e tema; os 10 mais recentes em destaque, todos os anteriores no **Arquivo**, por ano, e **busca** por título, resumo, tema ou data |
| `/capela` | Construção da capela: o projeto, fotos da obra e como doar (QR code, Pix copia e cola, transferência) |
| `/doacoes` | Os dois destinos de doação, cada um com o seu Pix: projeto da capela e manutenção básica da casa |
| `/sobre` | A história do IBP, O Superior Geral, O Superior do Distrito e O Pároco de Curitiba |
| `/painel` | **Painel de administração** (login com Google): Programação da semana e Avisos |
| `/studio` | Sanity Studio, só para o desenvolvedor (conteúdo que muda raramente) |
| `/api/revalidar` | Webhook do Sanity para atualizar o site na hora |

Em todas as páginas há o botão **"Falar com o padre"**: abre um seletor (Confissão, Direção espiritual) e leva ao WhatsApp com a mensagem pronta. No celular ele fica flutuando no rodapé da tela.

## Tema claro e escuro

O site segue o tema do sistema (claro ou escuro) automaticamente. No cabeçalho (ou no menu, no celular) a pessoa pode escolher **Automático, Claro ou Escuro**; a escolha fica salva no navegador (`localStorage`, chave `tema`).

- Um script no `<head>` ([src/lib/tema.ts](src/lib/tema.ts)) aplica o atributo `data-tema` no `<html>` antes da página aparecer, para não piscar no tema errado.
- As cores são variáveis CSS por tema em [src/app/globals.css](src/app/globals.css) (`--fundo`, `--tinta`, `--placa`, `--linha`, `--suave`, `--marca`…). Os componentes usam só essas variáveis.
- **Claro:** fundo branco; o "agora" (próxima Missa, "Hoje", botão principal) em preto; véu branco sobre a foto do topo.
- **Escuro:** fundo preto; o "agora" em creme (a "lâmpada"); véu preto sobre a foto.

## Configurar o Sanity (uma vez)

1. Crie uma conta e um projeto em [sanity.io/manage](https://www.sanity.io/manage), com o dataset `production` **público**. O conteúdo do site é público; a escrita continua exigindo login.
2. Copie `.env.example` para `.env.local` e preencha `NEXT_PUBLIC_SANITY_PROJECT_ID`.
3. Em **API → CORS origins**, adicione `http://localhost:3000` e o domínio do site (ex.: `https://<projeto>.vercel.app`), ambos **com credentials**.
4. Faça a carga inicial (locais, horários padrão, padres, "Sobre", configurações):
   ```bash
   npx sanity login
   npx sanity exec scripts/semear.ts --with-user-token
   ```
5. Abra `/studio`. Em **Configurações**, preencha o número de WhatsApp e, se quiser, a foto da página inicial. Em **Padres**, envie as fotos do Pe. Barrero e do Pe. Thiago (as fotos atuais estão em `src/assets` e só valem enquanto o painel não tiver as suas).
6. Convide o administrador em **sanity.io/manage → Members**. O login é pelo Google, pelo GitHub ou por e-mail e senha do próprio Sanity.

## Painel (`/painel`)

Painel próprio, com o visual do site. Detalhes de segurança em [docs/painel-e-seguranca.md](docs/painel-e-seguranca.md).

- **Login:** só Google, só os e-mails da variável `PAINEL_ACESSOS` (formato `email:admin,email:editor`). Para liberar ou tirar alguém, edite essa variável (no `.env.local` e na Vercel).
- **Programação** (`/painel/semana`): esta semana e a próxima. "Ajustar esta semana" copia os horários padrão; depois dá para escolher o local de cada horário (ou de todos de uma vez), cancelar, acrescentar, remover e destacar a festa do dia.
- **Avisos** (`/painel/avisos`): publicar, editar, republicar e excluir.
- Cada gravação guarda quem alterou e quando, e atualiza o site na hora.
- Variáveis necessárias (ver `.env.example`): `SANITY_WRITE_TOKEN`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `PAINEL_ACESSOS`.

## Revalidação (publicar → aparecer no site)

Sem configuração extra, o site busca o conteúdo novo a cada 5 minutos. Para atualizar na hora:

1. Defina `SANITY_REVALIDATE_SECRET` (um texto longo e aleatório) no `.env.local` e na Vercel.
2. Em **sanity.io/manage → API → Webhooks**, crie um webhook com:
   - URL: `https://<domínio>/api/revalidar`
   - Trigger on: create, update, delete
   - Projection: `{_type}`
   - Secret: o mesmo valor de `SANITY_REVALIDATE_SECRET`

## Publicação (Vercel)

Endereço: **https://ibp-curitiba.vercel.app**. O repositório está conectado à Vercel: cada `git push` na branch `main` publica o site automaticamente, e cada pull request ganha um endereço de prévia. O `vercel.json` fixa o framework como Next.js (sem ele a Vercel detectava errado e procurava a pasta `dist`).

Variáveis de ambiente a cadastrar na Vercel (**Project → Settings → Environment Variables**) quando o Sanity estiver pronto:

| Variável | Valor |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Project ID do Sanity |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_REVALIDATE_SECRET` | o mesmo segredo do webhook |

Depois de cadastrar, faça um novo deploy (ou um novo push) para as variáveis valerem.

## Ao trocar o domínio

O endereço do site está cadastrado em vários serviços. Ao passar para um domínio próprio, **mantenha o endereço antigo funcionando até o novo estar testado** e atualize:

1. **Vercel:** adicionar o domínio (Project → Settings → Domains) e configurar o DNS.
2. **Google Cloud** ([console.cloud.google.com/auth/clients](https://console.cloud.google.com/auth/clients), cliente `Painel do site`): adicionar o URI de redirecionamento `https://NOVO-DOMINIO/api/auth/callback/google`. Sem isso o login do `/painel` falha com `redirect_uri_mismatch`. Pode levar de minutos a algumas horas para valer.
3. **Vercel → Environment Variables:** trocar `NEXTAUTH_URL` para `https://NOVO-DOMINIO` e publicar de novo.
4. **Sanity** ([sanity.io/manage](https://www.sanity.io/manage), projeto `xuak6t0d`): adicionar `https://NOVO-DOMINIO` em **API → CORS origins** (com credentials) e trocar a URL do webhook para `https://NOVO-DOMINIO/api/revalidar`.
5. Testar: login no `/painel`, uma publicação aparecendo no site e o `/studio`.
6. Só então remover o endereço antigo do Google e do CORS do Sanity.

## Como o conteúdo funciona

| No painel | No site |
|---|---|
| **Programação semanal** | Seção "Esta semana" e a "próxima Missa" da home. Cada semana nova já vem preenchida com os horários padrão; o administrador ajusta só o que muda (cancelar, acrescentar, destacar a festa do dia). |
| **Horários padrão** | Página `/horarios`. Também valem para os dias que não têm programação semanal cadastrada. |
| **Avisos** | Primeira seção da home e página `/avisos`. Somem sozinhos depois da data de validade. |
| **Notícias / Artigos** | `/noticias` e `/artigos`, com prévia na home |
| **Padres / Sobre** | `/sobre`: história, Superior Geral, Superior do Distrito e Pároco de Curitiba |
| **Construção da capela** | Resumo na home com o botão "Quero ajudar" e a página `/capela` (texto do projeto e fotos). Os dados de doação **não** ficam no painel: estão em `src/lib/doacao.ts`. Desmarque "Mostrar no site" quando a campanha terminar. |
| **Configurações** | WhatsApp e opções do botão de atendimento, foto da página inicial, Instagram e e-mail |

## Estrutura

```
src/app/(site)/          páginas públicas
src/app/studio/          painel (Sanity Studio)
src/app/api/revalidar/   webhook de revalidação
src/app/globals.css      tokens de cor por tema, tipografia e utilitários
src/components/          componentes do site (cabeçalho, programação, botão de WhatsApp, seletor de tema…)
src/lib/                 datas no fuso de Curitiba, montagem da programação, dados de exemplo, tema
src/sanity/              modelos de conteúdo (schemaTypes), consultas e cliente
src/assets/              fotos e brasão (origem gravada nos metadados de cada arquivo)
scripts/semear.ts        carga inicial do painel
docs/projeto.md          escopo, decisões e pendências
```

## Imagens

- **Fotos e brasão** enviados pelo cliente: `src/assets/capa-missa.png`, `brasao.png`, `padre-barrero.jpg`, `padre-thiago.jpg`, `exemplos/peregrinacao-aparecida.jpg`.
- **Pinturas em domínio público** (Wikimedia Commons) usadas nos ensaios de exemplo: La Tour, Philippe de Champaigne e Fra Angelico, em `src/assets/exemplos/`. O crédito aparece na página de cada ensaio.
- **Arte do projeto da capela**, enviada pelo cliente: `src/assets/projeto-capela.jpg`. Vale até o painel ter outra imagem em "Construção da capela".
