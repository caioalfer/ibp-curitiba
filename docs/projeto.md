# Site do Instituto Bom Pastor — Curitiba

Documento vivo do projeto: escopo, decisões e pendências. Atualizar a cada decisão nova.

**Status:** levantamento de ideias. Aguardando informações do IBP e a proposta de front-end.

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
- **Confirmado** — **Programação semanal em destaque**, editada pelo administrador (ver seção Horários).
- **Confirmado** — Faixa de avisos ativos.
- **Sugerido** — "Hoje no calendário litúrgico": festa do dia, classe e cor litúrgica (calendário de 1962).
- **Sugerido** — Últimas notícias e artigos.

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
- **Confirmado** — Texto maior, com fotos (ex.: procissões, festas, visitas).

### Artigos do padre
- **Confirmado** — Artigos de formação.
- **Sugerido** — Organização por tema (liturgia, doutrina, vida espiritual, família).
- **Sugerido** — Sermões em áudio (formato podcast).
- **Sugerido** — Próprio da Missa do domingo em PDF (latim/português).

### Sobre
- **Confirmado** — **História do IBP**: fundação, carisma e missão do Instituto.
- **Confirmado** — **Superiores**, com foto e breve apresentação:
  - Superior geral: Pe. Luis Gabriel Barrero (a biografia já existe no site do distrito)
  - Padre de Curitiba: Pe. Thiago Bonifácio (biografia a receber)
- **Confirmado** — **Apostolado em Curitiba**: história da presença do IBP na cidade, os dois locais (Casa do Padre no Batel e Capela da Imaculada Conceição no Rebouças) e as atividades.
- Endereço com mapa e contato (pode ficar aqui ou numa página "Contato" separada).
- Pendente: definir se é uma página única com seções ou subpáginas (depende do volume de texto).

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

## Informações pendentes (a receber)

- [x] Horários de Missa, confissão e demais atividades (ver seção Horários)
- [ ] Local de cada horário e o que acontece às 6h30 de segunda a quarta
- [x] Endereços: Casa do Padre (Rua Olavo Bilac, 76, Batel) e Capela da Imaculada Conceição (Av. Lamenha Lins, 2115, Rebouças)
- [ ] Número(s) de WhatsApp para o botão de atendimento
- [x] História do IBP (base no site do distrito; revisar com o padre)
- [x] Superiores definidos: Pe. Luis Gabriel Barrero e Pe. Thiago Bonifácio
- [ ] Biografia e foto do Pe. Thiago Bonifácio (o cliente envia depois)
- [ ] Foto do Pe. Luis Gabriel Barrero (ou autorização para usar a do site do distrito)
- [ ] Texto sobre o apostolado em Curitiba (desde quando, como começou, atividades)
- [ ] Logo e fotos (da capela, das Missas, da Casa do Padre)
- [ ] Domínio desejado
- [x] Redes sociais: Instagram @ibpcuritiba
- [ ] Proposta de front-end

## Perguntas em aberto

- Quem vai alimentar o site (padre, secretária, outra pessoa)?
- Vão receber doações e ofertas de intenção pelo site?
- As doações vão para Curitiba ou para o distrito? Linkar para a página de doações do site do distrito ou ter um Pix próprio?
- O site do distrito pode ser usado como fonte de textos e fotos (história, superior geral)?
