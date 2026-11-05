# Plano de administração e segurança

Como o site será administrado, como será protegido e o que fazer se algo der errado. Atualizado em 2026-11-05.

**Status:** o painel `/studio` está pronto, mas desligado, porque ainda não há projeto no Sanity. Das medidas abaixo, só as marcadas com `[x]` estão aplicadas. As demais são plano.

**Em resumo:**
- O administrador usa um **painel próprio** em `/painel`, com o mesmo visual do site. O login é com Google: a senha e a verificação em duas etapas ficam com o Google, e só entram os e-mails liberados. O conteúdo continua guardado no Sanity.
- Os **dados de doação ficam no código**, fora do painel.
- **O Pix só muda pelo código**, pelo desenvolvedor, como parte do serviço de manutenção. Cada troca fica no histórico do Git (seção 3).
- O site **não coleta dados pessoais**, então o foco é impedir fraude e conteúdo falso, não vazamento.
- **Nenhuma pessoa recebe acesso ao painel antes de concluir a Fase 2.**

## 1. Decisões

| # | Decisão | Situação |
|---|---|---|
| A | Painel próprio em `/painel`, com login Google (NextAuth.js) e o conteúdo no Sanity. O Studio do Sanity fica só para o desenvolvedor, para o que muda raramente (seção 4) | Decidida em 2026-11-05 |
| B | Plano do Sanity: Free basta, porque no Sanity só entram o desenvolvedor e a chave do servidor (seção 4) | Proposta |
| C | Dados do Pix e do banco no código (`src/lib/doacao.ts`) | Aplicada em 2026-11-02; reversível |
| D | Quem publica no dia a dia: padre, secretária ou outra pessoa | **Em aberto** |
| E | Este documento e `docs/` devem ficar no repositório público? (ver "Sobre este documento") | **Em aberto** |
| F | Pix só muda pelo código, pelo desenvolvedor, no serviço de manutenção. Sem registro de auditoria próprio por enquanto (seção 3) | Decidida em 2026-11-05 |

## 2. Riscos

| Risco | Consequência | Principal proteção |
|---|---|---|
| Trocarem a chave Pix do quadro de doação | Doações desviadas | Pix só no código, alterado só pelo desenvolvedor; 2FA e proteção da `main` |
| Alguém se passar pelo Instituto e pedir ao desenvolvedor a troca do Pix | Doações desviadas | Contato pessoal do desenvolvedor com o Instituto |
| Invadirem o painel e publicarem um aviso falso, inclusive pedindo doação para outra chave | Fraude em nome do Instituto | 2FA, poucos acessos, alerta a cada publicação |
| Trocarem o WhatsApp do botão "Falar com o padre" | Fiéis falando com um golpista | As mesmas do item acima; WhatsApp pode ir para o código |
| Apagarem ou corromperem o conteúdo | Site sem conteúdo | Backup próprio |
| Horário ou local errado publicado por engano | Fiel vai ao lugar errado | Local obrigatório no painel; histórico de alterações |
| Segredo vazar (token, webhook) | Alteração não autorizada | Sem tokens de escrita permanentes; segredos só na Vercel |
| Dependência com falha conhecida | Depende da falha | Dependabot e revisão mensal |

**Limite importante:** tirar o Pix do painel protege o quadro de doação, mas quem invadir o painel ainda pode publicar um aviso com outra chave. Por isso o 2FA e os alertas continuam essenciais. A página `/doacoes` também deve dizer que aquelas são as únicas chaves oficiais.

## 3. Alterações do Pix

**Decisão (2026-11-05):** as chaves Pix e os dados bancários só mudam pelo código (`src/lib/doacao.ts`), pelo desenvolvedor, como parte do serviço de manutenção. O painel não tem esses campos.

**O registro é o histórico do Git:** cada troca vira um commit com autor, data e o que mudou, e a Vercel guarda cada publicação. Com a `main` protegida contra force-push (Fase 2), esse histórico não pode ser reescrito enquanto a proteção estiver ativa.

**Pedidos de troca:** o desenvolvedor tem contato pessoal com o Instituto e confirma os pedidos diretamente.

### Procedimento de troca
1. Confirmar o pedido diretamente com o Instituto.
2. Editar `src/lib/doacao.ts`.
3. Rodar `npm run build` e conferir `/doacoes` e `/capela` localmente.
4. Fazer o commit dizendo o que mudou e a pedido de quem. Ex.: `Pix da capela: nova chave, a pedido do Pe. Thiago`.
5. Fazer o push na `main`, conferir a publicação na Vercel e as duas páginas no ar.
6. Fazer um Pix de valor baixo pela nova chave, por mais de um banco, e conferir o nome do favorecido.
7. Avisar quem pediu que a troca está no ar.

### Alternativa avaliada e não adotada: registro de auditoria irreversível
Em 2026-11-05 avaliamos um registro de toda ação na administração que ninguém conseguisse apagar. Fica anotado para retomar se o painel ganhar mais administradores ou se o Pix voltar para o painel:
- **Captura:** webhook do Sanity em toda criação, edição e exclusão (`delta::operation()`, `before()`, `after()`, `identity()`).
- **Armazenamento:** uma rota do site grava cada evento num bucket com Object Lock em modo *compliance* (AWS S3 ou Backblaze B2), com chave só de gravação e conta em nome de alguém do Instituto.
- **Conferência periódica:** necessária porque o Sanity reenvia um webhook só duas vezes, com 30 segundos de intervalo.
- **Cloudflare R2 não serve:** quem administra o bucket pode remover a regra de bloqueio.
- **Por que construir:** os planos Free e Growth do Sanity não têm log de auditoria; é recurso do Enterprise.

## 4. Administração

### Quem acessa o quê

| Pessoa | Painel `/painel` | Sanity (Studio) | GitHub e Vercel |
|---|---|---|---|
| Desenvolvedor (Caio) | admin | Administrador | Dono |
| Segundo administrador de confiança, para não perder o acesso (sugestão: `curitibaibp@gmail.com`, com o padre) | admin | Sem acesso, ou Administrador | Sem acesso |
| Quem publica no dia a dia (a definir) | editor | Sem acesso | Sem acesso |

Regras: uma conta por pessoa, nunca compartilhada, e acesso removido no mesmo dia em que alguém deixar a função. No painel, liberar ou tirar o acesso é editar a variável `PAINEL_ACESSOS` na Vercel.

### Como o painel protege o acesso
- **Login com Google** (NextAuth.js). Não guardamos senha. Só e-mails verificados pelo Google e presentes em `PAINEL_ACESSOS` entram.
- **Sessão** num cookie HttpOnly, com o conteúdo criptografado por `NEXTAUTH_SECRET`; vale 7 dias.
- **Toda página e toda ação** do painel conferem a sessão **e** se o e-mail continua liberado (`src/lib/painel/sessao.ts`). Tirar o e-mail de `PAINEL_ACESSOS` corta o acesso na próxima ação, mesmo com sessão aberta.
- **A chave de escrita do Sanity** (`SANITY_WRITE_TOKEN`) fica só no servidor, em variável da Vercel, e só é usada depois da checagem de acesso. Nunca vai para o navegador nem para o GitHub.
- **Quem fez o quê:** como todas as gravações saem da mesma chave, cada conteúdo editado pelo painel guarda o e-mail de quem editou e quando.
- **Segredos** (`NEXTAUTH_SECRET`, `GOOGLE_CLIENT_SECRET`, `SANITY_WRITE_TOKEN`) só em `.env.local` e nas variáveis da Vercel. A lista de e-mails também fica em variável, não no código.

### Onde cada coisa é alterada

| No painel `/painel` | No Studio do Sanity (só o desenvolvedor, por enquanto) | No código (passa pelo desenvolvedor) |
|---|---|---|
| Programação semanal, com o local de cada horário | Horários padrão e locais | Chaves Pix e dados bancários |
| Avisos | Padres e texto do Sobre | Regras e aparência do site |
| Notícias e artigos (etapa 2) | Campanha da capela: texto, resumo, fotos, mostrar ou esconder | |
| | Configurações: WhatsApp, Instagram, e-mail, foto da home | |

### Rotina do administrador

1. Toda semana, criar a programação: ela já vem preenchida com os horários padrão.
2. Escolher o local de cada horário. O painel não deixa publicar sem isso, exceto em horários cancelados.
3. Ajustar o que mudar: cancelar, acrescentar, destacar a festa do dia.
4. Publicar avisos, com data de validade. Eles saem do ar sozinhos.

### Plano do Sanity

| | Free | Sem fins lucrativos | Growth |
|---|---|---|---|
| Custo | US$ 0 | US$ 0 dentro das cotas | US$ 15 por usuário/mês |
| Papéis | Administrador e Leitor | "Espelha o Growth" | Administrador, Leitor, Editor, Desenvolvedor, Colaborador |
| Usuários | 20 | 25 | 50 |
| Histórico para revisar alterações | 3 dias | "Espelha o Growth" | 90 dias |
| Registro de atividades | Não | "Espelha o Growth" | 90 dias |

- **Com o painel próprio, o Free basta:** no Sanity só entram o desenvolvedor e a chave do servidor. Os papéis de quem publica (admin, editor) são definidos no nosso painel, não no Sanity.
- **Sem fins lucrativos:** opcional; daria 90 dias de histórico em vez de 3. Exige formulário com um Project ID válido, e a resposta leva até 14 dias úteis. A página não cita igrejas ou organizações religiosas.
- **Limites em todos esses planos:** não há permissão por tipo de conteúdo, log de auditoria completo, SSO nem backup gerenciado; isso é do Enterprise. Um Editor pode alterar qualquer documento do painel, e esconder um campo na tela não protege de verdade. Por isso existem a decisão C e as medidas de backup e alerta.

## 5. Medidas de segurança

### Contas
- [ ] 2FA no GitHub e na Vercel
- [ ] Login do Sanity do desenvolvedor por um único método (Google). A conta é ligada ao método: entrar por outro cria outra conta, sem acesso.
- [ ] Usar Google com 2FA, de preferência chave de acesso (passkey)
- [ ] Domínio próprio, quando houver: registro e DNS em conta com 2FA

### Painel `/painel`
- [x] Login só com Google e só e-mails em `PAINEL_ACESSOS` (testado em 2026-11-05 com sessões de teste: sem sessão e e-mail fora da lista são barrados)
- [x] Checagem de acesso em toda página do painel, inclusive do e-mail na lista a cada acesso
- [x] Painel fora dos buscadores (`noindex`)
- [x] Checagem de acesso e validação de tudo o que vem do navegador em toda ação de gravação (Avisos e Programação)
- [x] Registro de quem editou em cada conteúdo (`atualizadoPor` e `atualizadoEm` nos avisos e na programação)
- Observação: o modo "Teste" do Google **não** serve de segunda trava. Para login com Google só com nome, e-mail e foto, o Google deixa qualquer conta entrar mesmo em modo Teste. Quem barra é a nossa lista `PAINEL_ACESSOS`.

### Sanity
- [x] CORS só com os endereços exatos do site e `localhost`, sem curingas (`localhost:3000`, `localhost:3333`, `ibp-curitiba.vercel.app`)
- [ ] Um único token de escrita, só para o painel (`SANITY_WRITE_TOKEN`), guardado como segredo na Vercel; trocar se houver suspeita
- [ ] Nenhuma informação confidencial publicada no painel. O dataset é público: tudo que é publicado pode ser lido por qualquer pessoa. Rascunhos não são servidos sem login (documentação do Sanity).
- [x] O site lê o conteúdo publicado sem token
- [x] Regra do local obrigatório na programação semanal (escrita; testar quando o painel for ligado)

### Site
- [x] Sem coleta de dados pessoais do público (o painel guarda só o e-mail de quem edita)
- [x] Webhook `/api/revalidar` só aceita chamada com assinatura válida
- [x] `/studio` marcado como `noindex`
- [x] HTTPS forçado (`Strict-Transport-Security`, enviado pela Vercel)
- [ ] Cabeçalhos que faltam: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, com regras separadas para o site e o `/studio`
- [ ] Restringir `images.remotePatterns` ao caminho do nosso projeto no `cdn.sanity.io`
- [ ] Aceitar nos links vindos do painel só `http`, `https` e links internos. A validação do Studio não cobre escrita direta pela API.
- [ ] `robots.ts` e `sitemap.ts` (hoje `/robots.txt` dá 404)
- [ ] Frase nas páginas de doação: "estas são as únicas chaves oficiais"

**Sobre a CSP:** será sem nonce, porque o guia do Next diz que nonce exige renderização dinâmica, e o site perderia as páginas estáticas. O script de tema exige `'unsafe-inline'` em `script-src`. Compensamos restringindo o resto (`object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`, imagens só de `'self'` e `cdn.sanity.io`). Começar em modo só-relatório e depois ativar.

### Repositório e hospedagem
- [x] `.env.local` fora do Git
- [x] Dados de doação no código, com histórico de alterações no Git
- [ ] Proteger a `main` (hoje não está protegida): sem force-push e sem apagar a branch
- [ ] Dependabot, secret scanning e push protection no GitHub
- [ ] Avaliar os 3 alertas altos do `npm audit` (seção 8)
- [ ] Segredos só nas variáveis da Vercel, nunca com prefixo `NEXT_PUBLIC_`
- [ ] Proteger os endereços de prévia na Vercel

### Backup e monitoramento
- [ ] **Backup semanal próprio** com `sanity datasets export`, por GitHub Action. O backup gerenciado do Sanity é pago e só existe em planos Enterprise.
- [ ] Guardar os backups em **repositório privado separado**, nunca neste, que é público
- [ ] **Testar a restauração** uma vez antes de confiar no backup
- [ ] **Alerta por e-mail** a cada publicação ou exclusão no painel (webhook do Sanity + serviço de envio de e-mail, a escolher)

## 6. Fases

Cada fase só termina quando o critério dela estiver cumprido.

### Fase 1: ligar o Sanity e o login
1. ~~Revisar e publicar o que está sem commit.~~ Feito em 2026-11-02.
2. ~~Caio entra no Sanity pelo terminal, com conta com 2FA.~~ Feito em 2026-11-05: projeto **IBP Curitiba** (`xuak6t0d`), dataset `production` público.
3. Token de escrita (papel Editor), CORS e variáveis locais: feito em 2026-11-05. **Faltam:** variáveis na Vercel e o webhook de atualização.
4. ~~Rodar a carga inicial (`scripts/semear.ts`).~~ Feito em 2026-11-05: 20 documentos (locais, horários padrão, padres, Sobre, capela, aviso da capela, configurações), sem exemplos nem dados bancários.
5. ~~Caio cria o cliente OAuth no Google Cloud e define `PAINEL_ACESSOS`.~~ Feito em 2026-11-05; login testado por Caio no computador. **Recomendado:** gerar uma chave secreta nova, porque a atual passou pelo chat.
6. ~~Esqueleto do painel: login, proteção e tela inicial.~~ Feito em 2026-11-05.

**Pronto quando:** Caio entrar em `/painel` com o Google, no computador e no site publicado.

### Fase 1b: o painel do dia a dia
- ~~**Esta semana:** criar a semana a partir dos horários padrão; cancelar, acrescentar e remover horários; escolher o local; destacar a festa do dia.~~ Feito em 2026-11-05 (`/painel/semana`), com atalho para marcar o local de todos os horários sem local.
- ~~**Avisos:** criar, editar, tirar do ar.~~ Feito em 2026-11-05 (`/painel/avisos`).
- Depois: **notícias e artigos**, com texto formatado e fotos.

**Pronto quando:** uma alteração feita no painel aparecer no site publicado.

### Fase 2: proteger
6. Ativar 2FA e as proteções do GitHub e da Vercel.
7. Aplicar cabeçalhos, CSP, validação de links, `robots` e `sitemap`.
8. Ativar backup e alertas, e testar a restauração.

**Pronto quando:** os itens da seção 5 estiverem marcados. Só então convidar outras pessoas.

### Fase 3: preparar para o administrador
9. Textos de ajuda nos campos e teste de uso no celular.
10. Liberar os e-mails de quem vai publicar.
11. Guia de uma página: como publicar um aviso e como ajustar a semana.
12. Sessão de teste com quem vai publicar.

**Pronto quando:** essa pessoa conseguir, sem ajuda, criar um aviso, cancelar um horário e escolher o local.

### Fase 4: sair dos exemplos
13. Publicar conteúdo real e remover os exemplos.
14. Fazer um Pix de valor baixo em cada chave, por mais de um banco, e conferir o nome do favorecido.

**Pronto quando:** não houver mais selo "Exemplo" no site e os dois Pix estiverem confirmados.

## 7. Rotinas

| Quando | O quê |
|---|---|
| Toda semana (automático) | Backup do conteúdo |
| Todo mês | Revisar alertas do Dependabot; atualizar `next` e `sanity`; conferir as chaves Pix em `/doacoes` |
| A cada 3 meses | Revisar quem tem acesso e os tokens; testar a restauração do backup |
| Quando alguém sair da função | Remover o acesso no mesmo dia |
| Ao mudar uma chave Pix | Seguir o procedimento da seção 3 |

## 8. Pontos a confirmar

- **2FA no Sanity:** a única fonte encontrada é uma conversa de 2020, que diz que o 2FA fica no provedor de login. Confirmar também o que existe para login por e-mail e senha.
- **Alertas altos do `npm audit`:** `js-yaml` e `smol-toml` afetam `@vercel/frameworks`, e `undici` afeta `@module-federation/dts-plugin`. Parecem ferramentas de build, mas falta confirmar que não rodam no site publicado. A correção sugerida pelo npm é rebaixar o `sanity`, o que não parece bom.
- **Backup:** confirmar a permissão de token exigida pelo export e se ele inclui rascunhos. A documentação consultada não diz.
- **Plano da Vercel:** confirmar se o plano em uso permite um site de instituição que recebe doações, e como proteger as prévias nele.

## 9. Em caso de incidente

**Regra geral:** primeiro conter, depois investigar. Anote data, hora e o que foi visto.

### Chave Pix errada no site, ou aviso falso pedindo doação
1. Tirar o conteúdo falso do ar.
2. Se for no código: ver no histórico do Git quem fez o commit, reverter na `main` e confirmar a publicação na Vercel.
3. Conferir as chaves oficiais em `/doacoes` a partir de um celular.
4. Avisar os fiéis no Instagram, com o período afetado e as chaves corretas.
5. Orientar quem doou no período a procurar o próprio banco e registrar boletim de ocorrência.
6. Seguir o roteiro da conta invadida abaixo.

### Conta invadida
1. Remover o usuário do projeto no Sanity (ou no GitHub ou Vercel).
2. Trocar a senha e revogar as sessões no Google, e refazer o 2FA.
3. Revogar os tokens de API e trocar `SANITY_REVALIDATE_SECRET` no Sanity e na Vercel.
4. Revisar as alterações recentes no histórico do Sanity e restaurar o que foi mexido.

### Conteúdo apagado ou corrompido
1. Restaurar pelo histórico do documento, se ainda estiver no período do plano.
2. Se não der, restaurar o último backup: `sanity datasets import <arquivo> production --replace`.
3. Atenção: a importação **não apaga** documentos criados depois do backup. Conferir e remover à mão o que for indevido.

### Segredo publicado por engano
1. Revogar e gerar outro imediatamente. Apagar do Git não basta.
2. Atualizar na Vercel e publicar de novo.
3. Revisar o histórico do Sanity em busca de alterações indevidas.

## Sobre este documento

O repositório é público, e este plano lista medidas ainda não aplicadas. Não há segredos aqui, mas ele mostra o que falta proteger. Recomendação: não publicar este arquivo até concluir a Fase 2, ou mantê-lo em local privado. **Nunca escrever senhas, tokens ou segredos neste documento.**

## Fontes

- [Preços do Sanity](https://www.sanity.io/pricing)
- [Plano sem fins lucrativos](https://www.sanity.io/docs/platform-management/non-profit-plan)
- [Papéis](https://www.sanity.io/docs/user-guides/roles)
- [CORS](https://www.sanity.io/docs/content-lake/cors)
- [Proteção de dados e datasets públicos](https://www.sanity.io/docs/content-lake/keeping-your-data-safe)
- [Rascunhos](https://www.sanity.io/docs/content-lake/drafts)
- [Backups](https://www.sanity.io/docs/content-lake/backups)
- [Webhooks do Sanity](https://www.sanity.io/docs/content-lake/webhooks) e [boas práticas](https://www.sanity.io/docs/content-lake/webhook-best-practices)
- [Funções GROQ (`identity()`, `delta::operation()`)](https://www.sanity.io/docs/specifications/groq-functions)
- [API de histórico do Sanity](https://www.sanity.io/docs/http-reference/history)
- [AWS S3 Object Lock](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html)
- [Backblaze B2 Object Lock](https://www.backblaze.com/docs/cloud-storage-object-lock)
- [Cloudflare R2 bucket locks](https://developers.cloudflare.com/r2/buckets/bucket-locks/): **não serve**, porque quem administra o bucket pode remover a regra
- [2FA para login por provedor (conversa de 2020)](https://sanity.io/answers/clarification-on-two-factor-authentication-for-microsoft-users)
- Guia de CSP do Next.js: `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`
