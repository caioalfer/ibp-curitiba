# Plano de administração e segurança

Como o site será administrado, como será protegido e o que fazer se algo der errado. Atualizado em 2026-11-02.

**Status:** o painel `/studio` está pronto, mas desligado, porque ainda não há projeto no Sanity. Das medidas abaixo, só as marcadas com `[x]` estão aplicadas. As demais são plano.

**Em resumo:**
- O administrador usa o **Sanity Studio**. Login, senhas e banco de dados ficam com o Sanity, não com a gente.
- Os **dados de doação ficam no código**, fora do painel.
- O site **não coleta dados pessoais**, então o foco é impedir fraude e conteúdo falso, não vazamento.
- **Nenhuma pessoa recebe acesso ao painel antes de concluir a Fase 2.**

## 1. Decisões

| # | Decisão | Situação |
|---|---|---|
| A | Painel: Sanity Studio, não um painel próprio | Proposta, aguarda confirmação |
| B | Plano do Sanity: pedir o plano sem fins lucrativos e começar no Free (seção 3) | **Em aberto** |
| C | Dados do Pix e do banco no código (`src/lib/doacao.ts`) | Aplicada em 2026-11-02; reversível |
| D | Quem publica no dia a dia: padre, secretária ou outra pessoa | **Em aberto** |
| E | Este documento e `docs/` devem ficar no repositório público? (ver "Sobre este documento") | **Em aberto** |

## 2. Riscos

| Risco | Consequência | Principal proteção |
|---|---|---|
| Trocarem a chave Pix do quadro de doação | Doações desviadas | Pix no código; 2FA e proteção da `main` no GitHub |
| Invadirem o painel e publicarem um aviso falso, inclusive pedindo doação para outra chave | Fraude em nome do Instituto | 2FA, poucos acessos, alerta a cada publicação |
| Trocarem o WhatsApp do botão "Falar com o padre" | Fiéis falando com um golpista | As mesmas do item acima; WhatsApp pode ir para o código |
| Apagarem ou corromperem o conteúdo | Site sem conteúdo | Backup próprio |
| Horário ou local errado publicado por engano | Fiel vai ao lugar errado | Local obrigatório no painel; histórico de alterações |
| Segredo vazar (token, webhook) | Alteração não autorizada | Sem tokens de escrita permanentes; segredos só na Vercel |
| Dependência com falha conhecida | Depende da falha | Dependabot e revisão mensal |

**Limite importante:** tirar o Pix do painel protege o quadro de doação, mas quem invadir o painel ainda pode publicar um aviso com outra chave. Por isso o 2FA e os alertas continuam essenciais. A página `/doacoes` também deve dizer que aquelas são as únicas chaves oficiais.

## 3. Administração

### Quem acessa o quê

| Pessoa | Sanity | GitHub e Vercel |
|---|---|---|
| Desenvolvedor (Caio) | Administrador | Dono |
| Segundo administrador de confiança, para não perder o acesso (a definir) | Administrador | Sem acesso |
| Quem publica no dia a dia (a definir) | Editor | Sem acesso |
| Quem escreve sem publicar, se houver | Colaborador | Sem acesso |

Regras: uma conta por pessoa, nunca compartilhada, e acesso removido no mesmo dia em que alguém deixar a função.

### Onde cada coisa é alterada

| No painel | No código (passa pelo desenvolvedor) |
|---|---|
| Programação semanal, com o local de cada horário | Chaves Pix e dados bancários |
| Avisos, notícias e artigos | Regras e aparência do site |
| Horários padrão e locais | |
| Padres e texto do Sobre | |
| Campanha da capela: texto, resumo, fotos, mostrar ou esconder | |
| Configurações: WhatsApp, Instagram, e-mail, foto da home | |

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

- **Free:** quem edita precisa ser Administrador, com acesso a todas as configurações. Serve para começar só com o desenvolvedor.
- **Sem fins lucrativos:** exige formulário com um Project ID válido, e a resposta leva até 14 dias úteis. A página não cita igrejas ou organizações religiosas, então a aprovação não é garantida.
- **Se for negado:** assinar o Growth (US$ 15 por usuário ao mês), ou seguir no Free com só o desenvolvedor publicando.
- **Limites em todos esses planos:** não há permissão por tipo de conteúdo, log de auditoria completo, SSO nem backup gerenciado; isso é do Enterprise. Um Editor pode alterar qualquer documento do painel, e esconder um campo na tela não protege de verdade. Por isso existem a decisão C e as medidas de backup e alerta.

## 4. Medidas de segurança

### Contas
- [ ] 2FA no GitHub e na Vercel
- [ ] Login do Sanity por um único método para todos. A conta é ligada ao método: entrar por outro cria outra conta, sem acesso.
- [ ] Usar Google com 2FA, de preferência chave de acesso (passkey)
- [ ] Domínio próprio, quando houver: registro e DNS em conta com 2FA

### Sanity
- [ ] CORS só com os endereços exatos do site e `localhost`, sem curingas
- [ ] Sem tokens de escrita permanentes; se um for necessário, um por finalidade, guardado como segredo
- [ ] Nenhuma informação confidencial publicada no painel. O dataset é público: tudo que é publicado pode ser lido por qualquer pessoa. Rascunhos não são servidos sem login (documentação do Sanity).
- [x] O site lê o conteúdo publicado sem token
- [x] Regra do local obrigatório na programação semanal (escrita; testar quando o painel for ligado)

### Site
- [x] Sem login próprio e sem coleta de dados pessoais
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
- [ ] Avaliar os 3 alertas altos do `npm audit` (seção 7)
- [ ] Segredos só nas variáveis da Vercel, nunca com prefixo `NEXT_PUBLIC_`
- [ ] Proteger os endereços de prévia na Vercel

### Backup e monitoramento
- [ ] **Backup semanal próprio** com `sanity datasets export`, por GitHub Action. O backup gerenciado do Sanity é pago e só existe em planos Enterprise.
- [ ] Guardar os backups em **repositório privado separado**, nunca neste, que é público
- [ ] **Testar a restauração** uma vez antes de confiar no backup
- [ ] **Alerta por e-mail** a cada publicação ou exclusão (webhook do Sanity + serviço de envio de e-mail, a escolher)

## 5. Fases

Cada fase só termina quando o critério dela estiver cumprido.

### Fase 1: ligar o painel
1. Revisar e publicar o que está sem commit.
2. Caio cria o projeto no Sanity, com conta com 2FA, e passa o Project ID.
3. Configurar variáveis locais e na Vercel, CORS e webhook.
4. Rodar a carga inicial (`scripts/semear.ts`). Ela não envia conteúdo de exemplo nem dados bancários.
5. Enviar o formulário do plano sem fins lucrativos.

**Pronto quando:** uma alteração feita no `/studio` aparecer no site publicado.

### Fase 2: proteger
6. Ativar 2FA e as proteções do GitHub e da Vercel.
7. Aplicar cabeçalhos, CSP, validação de links, `robots` e `sitemap`.
8. Ativar backup e alertas, e testar a restauração.

**Pronto quando:** os itens da seção 4 estiverem marcados. Só então convidar outras pessoas.

### Fase 3: preparar para o administrador
9. Painel em português (verificar pacote de idioma), com o brasão, e Programação semanal e Avisos primeiro.
10. Textos de ajuda nos campos e teste de uso no celular.
11. Guia de uma página: como publicar um aviso e como ajustar a semana.
12. Sessão de teste com quem vai publicar.

**Pronto quando:** essa pessoa conseguir, sem ajuda, criar um aviso, cancelar um horário e escolher o local.

### Fase 4: sair dos exemplos
13. Publicar conteúdo real e remover os exemplos.
14. Fazer um Pix de valor baixo em cada chave, por mais de um banco, e conferir o nome do favorecido.

**Pronto quando:** não houver mais selo "Exemplo" no site e os dois Pix estiverem confirmados.

## 6. Rotinas

| Quando | O quê |
|---|---|
| Toda semana (automático) | Backup do conteúdo |
| Todo mês | Revisar alertas do Dependabot; atualizar `next` e `sanity`; conferir as chaves Pix em `/doacoes` |
| A cada 3 meses | Revisar quem tem acesso e os tokens; testar a restauração do backup |
| Quando alguém sair da função | Remover o acesso no mesmo dia |
| Ao mudar uma chave Pix | Alterar o código, publicar e testar com um Pix de valor baixo |

## 7. Pontos a confirmar

- **2FA no Sanity:** a única fonte encontrada é uma conversa de 2020, que diz que o 2FA fica no provedor de login. Confirmar também o que existe para login por e-mail e senha.
- **Alertas altos do `npm audit`:** `js-yaml` e `smol-toml` afetam `@vercel/frameworks`, e `undici` afeta `@module-federation/dts-plugin`. Parecem ferramentas de build, mas falta confirmar que não rodam no site publicado. A correção sugerida pelo npm é rebaixar o `sanity`, o que não parece bom.
- **Backup:** confirmar a permissão de token exigida pelo export e se ele inclui rascunhos. A documentação consultada não diz.
- **Plano da Vercel:** confirmar se o plano em uso permite um site de instituição que recebe doações, e como proteger as prévias nele.

## 8. Em caso de incidente

**Regra geral:** primeiro conter, depois investigar. Anote data, hora e o que foi visto.

### Chave Pix errada no site, ou aviso falso pedindo doação
1. Tirar o conteúdo falso do ar.
2. Se for no código: reverter o commit na `main` e confirmar a publicação na Vercel.
3. Conferir as chaves oficiais em `/doacoes` a partir de um celular.
4. Avisar os fiéis no Instagram, com o período afetado e as chaves corretas.
5. Orientar quem doou no período a procurar o próprio banco e registrar boletim de ocorrência.
6. Seguir o roteiro da conta invadida abaixo.

### Conta invadida
1. Remover o usuário do projeto no Sanity (ou no GitHub ou Vercel).
2. Trocar a senha e revogar as sessões no Google, e refazer o 2FA.
3. Revogar os tokens de API e trocar `SANITY_REVALIDATE_SECRET` no Sanity e na Vercel.
4. Revisar as alterações recentes no histórico e restaurar o que foi mexido.

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
- [2FA para login por provedor (conversa de 2020)](https://sanity.io/answers/clarification-on-two-factor-authentication-for-microsoft-users)
- Guia de CSP do Next.js: `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`
