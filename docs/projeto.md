# Site do Instituto Bom Pastor — Curitiba

Documento vivo do projeto: escopo, decisões e pendências. Atualizar a cada decisão nova.

**Status (2026-10-17):** Fase 1 pronta e publicada (código no GitHub, site na Vercel; ver seção Publicação). Funcionam a home (próxima Missa, avisos, programação semanal, artigos, notícias, O Instituto), os horários, os avisos, as notícias, os artigos, o "Sobre" (história, Superior Geral, Prior de Curitiba), o botão de WhatsApp com seletor, o tema claro/escuro e o painel. Avisos, artigos e notícias ainda são **exemplos** marcados na tela. Faltam o projeto no Sanity e o local de cada horário. Visual em [DESIGN.md](../DESIGN.md); instruções técnicas no [README](../README.md).

---

## Objetivo

Site moderno, sóbrio e fácil de manter, que:

1. Mostre rapidamente **horários** (Missas, confissões, demais atividades).
2. Sirva de canal oficial para **avisos, notícias e artigos do padre**.
3. Facilite o contato para **confissão e direção espiritual**.
4. Acolha quem nunca foi a uma **Missa tradicional**.

---

## Contexto

Levantado em 2026-10-17 a partir do site do distrito: [ibpamericalatina.org](https://ibpamericalatina.org/) (página de Curitiba: [/casa/curitiba/](https://ibpamericalatina.org/casa/curitiba/)).

### O Instituto
- **Natureza:** sociedade de vida apostólica de direito pontifício. Os membros são padres seculares que vivem em comunidade, sob autoridade direta da Santa Sé.
- **Fundação:** 8 de setembro de 2006, em Roma (festa da Natividade de Nossa Senhora), sob Bento XVI. Os estatutos foram aprovados no mesmo dia pelo Card. Darío Castrillón Hoyos (Congregação para o Clero).
- **Seminário:** São Vicente de Paulo, em Courtalain, França (fundado em outubro de 2006).
- **Primeira casa:** Igreja Saint-Éloi, em Bordeaux (2007), erigida como paróquia pessoal.
- **Missão:** "Defender e difundir a Tradição católica sob todas as suas formas: doutrinal, apostólica e litúrgica."
- **Liturgia:** exclusivamente o Rito Romano Tradicional (livros litúrgicos de 1962).
- **Formação:** tomista. O apostolado inclui paróquias, capelanias, escolas, retiros, obras de caridade, cursos e conferências.
- **2026 = 20 anos do IBP.** O site do distrito já publicou um comunicado sobre o jubileu, com indulgência plenária. É um bom gancho para o lançamento do site.

### Superiores
- **Superior geral:** Pe. Luis Gabriel Barrero, eleito em 28/08/2019 (segundo superior geral). Nasceu em Bogotá em 05/12/1966 e foi ordenado em 14/12/1997. Entrou no IBP em 2014.
- **Superior do Distrito América Latina:** Pe. Daniel Pinheiro, desde 2018, sediado em Brasília. Não entra no site, mas fica registrado aqui.

### Distrito América Latina
- **Casas fixas:** Bogotá, Brasília, Belém, Curitiba e São Paulo.
- **Apostolados regulares:** Florianópolis e Guarapuava, entre outros.
- **Número de padres:** o site informa 15 em uma página e 17 em outra. Confirmar se for usar.
- **Site do distrito:** tem Publicações, Doações, Loja, Vocações (seminário e as Escravas Reparadoras da Sagrada Família) e Contato.

### Curitiba (o que existe hoje)
- **Padre:** Pe. Thiago Bonifácio. A página dele no site do distrito não tem biografia.
- **Locais:**
  - Casa do Padre (Casa Canônica): Rua Olavo Bilac, 76, Batel
  - Capela da Imaculada Conceição: Av. Lamenha Lins, 2115, Rebouças
  - A home do distrito indica que há Missa nos dois locais.
- **Contato publicado:** apenas o Instagram [@ibpcuritiba](https://www.instagram.com/ibpcuritiba/). Não há telefone, WhatsApp nem e-mail.
- **Faltam no site do distrito:** horários, história do apostolado local, grupos e atividades. O novo site preenche essa lacuna.

### Implicações para o projeto
- Os horários precisam suportar **dois locais**, com cada Missa indicando onde acontece e um mapa para cada endereço.
- Como hoje o Instagram é o canal principal, ele deve aparecer em destaque e talvez com os últimos posts.
- Para conteúdo institucional (Vocações, Loja, Publicações), linkar o site do distrito em vez de duplicar.
- A história do apostolado em Curitiba terá de vir do padre, porque não existe publicada.

---

## Decisões tomadas

| # | Data | Decisão | Motivo |
|---|---|---|---|
| 1 | 2026-10-17 | Agendamento de confissão e direção espiritual será feito **pelo WhatsApp**, sem sistema de reservas no site. | Mais prático para quem atende e para os fiéis. |
| 2 | 2026-10-17 | Contato via **um botão + seletor** (ver detalhes abaixo). | Um único ponto de entrada; a mensagem já chega identificada. |
| 3 | 2026-10-17 | **Avisos** e **notícias** são tipos de conteúdo separados. | Avisos são curtos e expiram; notícias são permanentes e com fotos. |
| 4 | 2026-10-17 | Seção **Sobre** com três partes: história do IBP, superiores e apostolado em Curitiba. | Apresentar o Instituto como um todo e a presença local. |
| 5 | 2026-10-17 | Superiores exibidos: **superior geral** e **padre de Curitiba**. O superior de distrito fica de fora. | Escolha do cliente. |
| 6 | 2026-10-17 | Dois níveis de horário: **horários padrão** (fixos) e **programação semanal** (editada pelo administrador toda semana), com a programação semanal **sempre em destaque**. | A semana real muda com festas, eventos e imprevistos; o fiel precisa ver a semana atual, não só a regra geral. |
| 7 | 2026-10-17 | Tecnologia: **Next.js 16 + Tailwind + Sanity**, com o painel em `/studio`. | Opção mais segura: login, banco e imagens ficam no Sanity, sem senha nem banco próprios para proteger. O site público é praticamente estático e não coleta dados pessoais. |
| 8 | 2026-10-17 | A programação semanal vai de **segunda a domingo**, igual ao post do Instagram. O site mostra sempre **os próximos 7 dias a partir de hoje**, juntando semanas e horários padrão. | O administrador pensa na semana do post; o fiel vê sempre o que vem pela frente, sem "buraco" na virada da semana. |
| 9 | 2026-10-17 | Visual: referência **Sequel** (fundo preto, creme como único destaque, sans leve + serif itálica na palavra-chave), adaptada como **"Lâmpada do Santíssimo"**: a próxima Missa é a única coisa "acesa" (creme) no site; na semana, o que já passou fica apagado e o cancelado, riscado. Fontes: Geist + Instrument Serif. | Escolha do cliente. A ideia da lâmpada transforma a tarefa principal (achar a próxima Missa) no elemento mais visível. |
| 10 | 2026-10-17 | **Fundo branco** no site. Só o topo da home fica escuro, com a foto da Missa e a próxima Missa em creme. Na semana, a próxima Missa e o "Hoje" viram uma faixa preta ("marcado a tinta"). Botão principal preto; creme só sobre a foto. | Melhor leitura para idosos, ao sol e em textos longos. A foto mantém o clima no topo. |
| 11 | 2026-10-17 | **Modo claro e modo escuro.** Segue o tema do sistema automaticamente; no cabeçalho dá para escolher Automático, Claro ou Escuro (a escolha fica salva no navegador). Claro: fundo branco, "agora" em preto, véu branco sobre a foto do topo. Escuro: fundo preto, "agora" em creme (a lâmpada), véu preto sobre a foto. | Pedido do cliente: respeitar a preferência de cada pessoa. |
| 12 | 2026-10-17 | Home com **uma seção por tópico**, nesta ordem: **Avisos** (primeira, logo após o topo), Esta semana, Palavra do padre (artigos), Notícias e O Instituto (primeira vez na Missa + superiores). Cada seção tem título, descrição e link para a página completa. Conteúdo de **exemplo** (avisos, artigos e notícias) em `src/lib/exemplos.ts`, marcado como "Exemplo" na tela e substituído automaticamente quando o painel estiver ligado. | Pedido do cliente: ilustrar o site e dar a cada tópico seu espaço na home. |
| 13 | 2026-10-17 | Página Sobre com **seções dedicadas**: A história → **O Superior Geral** (Pe. Luis Gabriel Barrero) → **O Prior de Curitiba** (Pe. Thiago Bonifácio). No painel, "Sobre" tem os campos *Superior Geral* e *Prior de Curitiba* (antes era uma lista de superiores). A seção "Em Curitiba" foi removida por ser redundante com a do Prior. | Pedido do cliente: destacar cada um em sua própria seção. |

---

## Horários

Existem dois níveis (decisão 6):

1. **Horários padrão**: a regra geral, que quase não muda. Aparece numa página de horários e serve de base para a semana.
2. **Programação semanal**: o que vai acontecer de fato nesta semana. Fica sempre em destaque na home e é editada pelo administrador.

### Fluxo da programação semanal
- Toda semana, a programação nasce **pré-preenchida com os horários padrão**.
- O administrador só ajusta o que muda, por exemplo:
  - **Acrescentar:** festa, Missa extra, procissão, bênção, palestra
  - **Cancelar ou alterar:** um horário específico daquela semana
  - **Observação no dia:** por exemplo, "Festa de Cristo Rei, I classe", ou o santo e a cor litúrgica do dia
- Se o administrador não mexer, o site exibe os horários padrão, então nunca fica vazio.
- **Sugerido:** mostrar o "hoje" destacado dentro da semana e a "próxima Missa" no topo.
- **Sugerido:** botão para baixar a semana como imagem, pronta para postar no Instagram, aproveitando o trabalho que hoje já é feito no post.

### Horários padrão

Recebidos em 2026-10-17, a partir de um post do Instagram @ibpcuritiba.

| Dia | Horário | Atividade | Local |
|---|---|---|---|
| Segunda, terça e quarta | 6h30 | Missa rezada *(a confirmar: a imagem não diz o que é)* | ? |
| Quinta | 18h30 | Exposição do Santíssimo | ? |
| Quinta | 19h30 | Missa rezada | ? |
| Sexta | 19h | Santo Terço | ? |
| Sexta | 19h30 | Missa rezada | ? |
| Sábado | 8h | Confissões | ? |
| Sábado | 8h30 | Missa rezada | ? |
| Domingo | 8h | Confissões | ? |
| Domingo | 8h30 | Missa rezada | ? |
| Domingo | 9h30 | Confissões | ? |
| Domingo | 10h | **Missa cantada** | ? |
| Domingo | 18h30 | Confissões | ? |
| Domingo | 19h | Missa rezada | ? |

**A confirmar:**
- O que acontece às 6h30 de segunda a quarta. Provavelmente é Missa rezada, mas a imagem está cortada no topo.
- O local de cada horário (Casa do Padre, no Batel, ou Capela da Imaculada Conceição, no Rebouças).
- Se há confissão nos dias de semana (antes das Missas ou a pedido).

### Modelagem
- **Horário padrão:** dia(s) da semana, hora, tipo (Missa rezada, Missa cantada, confissões, Exposição do Santíssimo, terço, outro) e local.
- **Semana:** data de início, uma lista de itens e uma observação opcional por dia. Cada item tem data, hora, tipo, local, uma nota opcional e um status (normal, cancelado ou alterado).
- Os itens da semana são gerados a partir dos horários padrão e depois editados livremente pelo administrador.
- Mudanças que precisam de mais destaque, como "não haverá Missa", podem também virar **aviso**.

---

## Funcionalidades

Legenda: **Confirmado** = decidido · **Sugerido** = proposto, aguardando validação

### Home
- **Confirmado** — Topo com a foto da Missa e a **próxima Missa** em destaque (dia, hora, tipo, local e botão "Ver a semana").
- **Confirmado** — Uma seção por tópico (decisão 12): **Avisos** (primeira), **Esta semana** (programação dos próximos 7 dias, editada pelo administrador), **Palavra do padre** (artigos), **Notícias** e **O Instituto** (primeira vez na Missa + Superior Geral e Prior).
- **Sugerido** — "Hoje no calendário litúrgico": festa do dia, classe e cor litúrgica (calendário de 1962).

### Botão de atendimento (WhatsApp)
- **Confirmado** — Um botão fixo (ex.: "Falar com o padre"), visível em todas as páginas.
- Ao clicar, abre um **seletor** com as opções:
  - **Confissão** → mensagem: *"Olá, gostaria de agendar uma confissão."*
  - **Direção espiritual** → mensagem: *"Olá, gostaria de conversar sobre direção espiritual."*
- Ao escolher, abre o WhatsApp (`https://wa.me/<numero>?text=<mensagem>`) com a mensagem pronta.
- Nenhum dado é coletado pelo site.
- Pendente: número(s) de WhatsApp; se cada opção vai para um número diferente; texto final do botão.
- Sugerido: urgências (ex.: unção dos enfermos) com telefone direto, fora do seletor.

### Avisos
- **Confirmado** — Texto curto, com **data de expiração**; some automaticamente quando vence.
- Aparece na faixa da home e numa página própria.

### Notícias
- **Confirmado** — Texto maior, sempre com foto (ex.: procissões, festas, peregrinações). As duas atuais são exemplos, com fotos reais do apostolado.

### Artigos do padre
- **Confirmado** — **Ensaios** (filosóficos/espirituais), cada um com imagem, data e tema. Os três atuais são exemplos, ilustrados com pinturas em domínio público.
- **Sugerido** — Organização por tema (liturgia, doutrina, vida espiritual, família).
- **Sugerido** — Sermões em áudio (formato podcast).
- **Sugerido** — Próprio da Missa do domingo em PDF (latim/português).

### Sobre
- **Confirmado** — **A história** do IBP: fundação, carisma e missão (decisão 13).
- **Confirmado** — **O Superior Geral**: Pe. Luis Gabriel Barrero, com foto, cargo e biografia.
- **Confirmado** — **O Prior de Curitiba**: Pe. Thiago Bonifácio, com foto, cargo e biografia.
- Endereços dos dois locais ficam no rodapé e na página de horários, com link para o mapa.

### Tema claro e escuro
- **Confirmado** — Automático pelo sistema, com seletor Automático/Claro/Escuro no cabeçalho (decisão 11).

### Outras páginas sugeridas
- **Sugerido** — "Primeira vez na Missa tradicional?": o que esperar, como acompanhar, vestimenta, comunhão, missal.
- **Sugerido** — Intenções de Missa (formulário + oferta via Pix).
- **Sugerido** — Doações / dízimo (Pix).
- **Sugerido** — Sacramentos: batismo, casamento, catequese, crisma (documentos, prazos, contato).
- **Sugerido** — Agenda de eventos (retiros, cursos, festas), com opção de adicionar ao calendário.
- **Sugerido** — Grupos e atividades: coro, coroinhas, outros grupos (pode virar parte de "Apostolado em Curitiba").
- **Sugerido** — Receber avisos (canal de WhatsApp ou newsletter).

---

## Princípios

- **Fácil de atualizar.** Painel simples, que funcione pelo celular, para publicar aviso, notícia ou artigo em um minuto.
- **Mobile first.** A maior parte dos acessos será pelo celular.
- **Visual sóbrio e sacro.** Moderno sem parecer template genérico. A direção visual será definida a partir da proposta de front-end.

---

## Fases (proposta)

- **Fase 1:** home com programação semanal e avisos, página de horários padrão, botão de WhatsApp, notícias, artigos, sobre/contato, página "primeira vez", doações.
- **Fase 2:** calendário litúrgico, sermões em áudio, intenções de Missa, sacramentos, agenda.

---

## Publicação

- **Código:** https://github.com/caioalfer/ibp-curitiba (público). Branch principal: `main`.
- **Hospedagem:** Vercel, em **https://ibp-curitiba.vercel.app**, conectada ao repositório: cada push na `main` publica o site; cada pull request ganha uma prévia.
- **Variáveis de ambiente** a cadastrar na Vercel quando o Sanity existir: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_REVALIDATE_SECRET` (ver README).

---

## Informações pendentes (a receber)

- [x] Horários de Missa, confissão e demais atividades (ver seção Horários)
- [ ] Local de cada horário e o que acontece às 6h30 de segunda a quarta
- [x] Endereços: Casa do Padre (Rua Olavo Bilac, 76, Batel) e Capela da Imaculada Conceição (Av. Lamenha Lins, 2115, Rebouças)
- [x] WhatsApp do botão de atendimento: +55 41 8526-6861 (recebido em 2026-10-17; o mesmo número para Confissão e Direção espiritual)
- [x] História do IBP (base no site do distrito; revisar com o padre)
- [x] Superiores definidos: Pe. Luis Gabriel Barrero e Pe. Thiago Bonifácio
- [x] Foto do Pe. Thiago Bonifácio (recebida em 2026-10-17; src/assets/padre-thiago.jpg; aparece no Sobre e na home)
- [x] Biografia do Pe. Thiago Bonifácio (recebida em 2026-10-17: nascido em Ibirité, MG, em 19/03/1990; ordenado em 25/06/2016)
- [x] Foto do Pe. Luis Gabriel Barrero (recebida em 2026-10-17; src/assets/padre-barrero.jpg; é pequena, 395 × 494 px; trocar por uma maior se houver)
- [x] Foto de capa da home (recebida em 2026-10-17; padrão em src/assets/capa-missa.png, substituível no painel em Configurações → Foto da página inicial)
- [x] Brasão do IBP (recebido em 2026-10-17; recortado em círculo transparente em src/assets/brasao.png; usado no cabeçalho, no rodapé e como ícone da aba)
- [ ] Outras fotos (capela, Casa do Padre, notícias)
- [ ] Domínio próprio (hoje o site está no endereço da Vercel)
- [x] Redes sociais: Instagram @ibpcuritiba
- [x] Proposta de front-end (referência Sequel, decisão 9)

## Perguntas em aberto

- Quem vai alimentar o site (padre, secretária, outra pessoa)?
- Vão receber doações e ofertas de intenção pelo site?
- As doações vão para Curitiba ou para o distrito? Linkar para a página de doações do site do distrito ou ter um Pix próprio?
- O site do distrito pode ser usado como fonte de textos e fotos (história, superior geral)?
