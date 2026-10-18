---
name: Instituto Bom Pastor – Curitiba
description: Dois temas, papel e nave; nos dois, a próxima Missa é a única coisa marcada, a tinta no claro e com a lâmpada creme no escuro.
colors:
  marca: "#0a0a0a"
  marca-texto: "#ffffff"
  marca-escuro: "#f5f5f0"
  marca-texto-escuro: "#000000"
  fundo: "#ffffff"
  tinta: "#0a0a0a"
  placa: "#f4f3ef"
  linha: "#e2e1dc"
  suave: "#5e5e5e"
  apagado: "#767676"
  texto-leitura: "#1f1f1f"
  fundo-escuro: "#000000"
  tinta-escuro: "#ffffff"
  placa-escuro: "#202020"
  linha-escuro: "#333333"
  suave-escuro: "#999999"
  apagado-escuro: "#808080"
  texto-leitura-escuro: "#e8e8e3"
  preto: "#000000"
  branco: "#ffffff"
typography:
  display-pagina:
    fontFamily: "Geist, sans-serif"
    fontSize: "clamp(3rem, 9vw, 7rem)"
    fontWeight: 300
    lineHeight: 0.95
    letterSpacing: "-0.045em"
  display-lampada:
    fontFamily: "Geist, sans-serif"
    fontSize: "clamp(2.75rem, 8vw, 6rem)"
    fontWeight: 300
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Geist, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.5rem)"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Geist, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 300
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Geist, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "\"ss01\" on, \"cv11\" on"
  leitura:
    fontFamily: "Geist, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Geist, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.08em"
  chip:
    fontFamily: "Geist, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    letterSpacing: "0.05em"
  destaque:
    fontFamily: "Instrument Serif, serif"
    fontWeight: 400
    letterSpacing: "-0.01em"
rounded:
  placa: "10px"
  pill: "9999px"
spacing:
  linha: "8px"
  grade: "16px"
  placa: "28px"
  calha-mobile: "20px"
  calha: "32px"
  secao-mobile: "112px"
  secao: "144px"
components:
  button-primary:
    backgroundColor: "{colors.marca}"
    textColor: "{colors.marca-texto}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "44px"
    typography: "{typography.body}"
  button-primary-escuro:
    backgroundColor: "{colors.marca-escuro}"
    textColor: "{colors.marca-texto-escuro}"
  button-contorno:
    backgroundColor: "transparent"
    textColor: "{colors.tinta}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "44px"
  button-contorno-hover:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.fundo}"
  button-contorno-escuro-hover:
    backgroundColor: "{colors.tinta-escuro}"
    textColor: "{colors.fundo-escuro}"
  seletor-tema-botao:
    backgroundColor: "transparent"
    textColor: "{colors.tinta}"
    rounded: "{rounded.pill}"
    size: "40px"
  seletor-tema-opcao-ativa:
    backgroundColor: "{colors.marca}"
    textColor: "{colors.marca-texto}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "40px"
  chip-vidro:
    backgroundColor: "rgba(200, 200, 200, 0.1)"
    textColor: "{colors.branco}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
    typography: "{typography.chip}"
  chip-contorno:
    backgroundColor: "transparent"
    textColor: "{colors.tinta}"
    rounded: "{rounded.pill}"
    padding: "6px 16px"
    typography: "{typography.label}"
  card-placa:
    backgroundColor: "{colors.placa}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.placa}"
    padding: "28px"
  card-foto:
    backgroundColor: "{colors.preto}"
    textColor: "{colors.branco}"
    rounded: "{rounded.placa}"
    padding: "24px"
  marcador-hoje:
    backgroundColor: "{colors.marca}"
    textColor: "{colors.marca-texto}"
    rounded: "{rounded.pill}"
    padding: "0 10px"
    typography: "{typography.title}"
  linha-proxima:
    backgroundColor: "{colors.marca}"
    textColor: "{colors.marca-texto}"
    rounded: "{rounded.placa}"
    padding: "8px 12px"
---

# Design System: Instituto Bom Pastor – Curitiba

## Overview

**Creative North Star: "A lâmpada do sacrário"**

O site tem dois temas que são o mesmo mundo visto de dia e de noite. No claro, a página é papel branco e tinta quase preta; no escuro, é a nave preta com texto branco. Nos dois, só uma coisa é marcada: o que é "agora" (a próxima Missa, o dia de hoje, a ação principal) recebe a cor de marca, faixa de tinta preta no papel, luz creme da lâmpada na nave. Tudo o mais é cinza suave, placas e filetes. O tema segue o sistema por padrão e o visitante pode fixá-lo no cabeçalho (Automático, Claro, Escuro).

O topo da home é uma fotografia de altura total da nave sob véus na cor do fundo (brancos no claro, pretos no escuro), com o texto em tinta e, sob o horário da próxima Missa, o traço da lâmpada que acende na cor de marca. A tipografia é uma sans leve (Geist 300) em escala de display com tracking apertado, e uma serif itálica (Instrument Serif) que aparece no máximo como uma palavra de recompensa por página. Metadados vivem em rótulos em caixa alta espaçada. Ações são pílulas; categorias sobre fotos são chips de vidro, e sem foto, chips de contorno. O movimento é raro: um único momento autoral, a linha da lâmpada que acende.

A cor litúrgica do dia é escrita por extenso ("Roxo", "Branco"), nunca pintada. A interface não tem nenhuma cor cromática; a cor que existe vem só das fotografias.

**Key Characteristics:**
- Dois temas por tokens semânticos: papel branco e tinta #0a0a0a no claro; preto e branco no escuro.
- O "agora" é a cor de marca: preto cheio no claro, creme da lâmpada #f5f5f0 no escuro.
- Estado comunicado pela forma da linha (faixa cheia, inteira, curta, tracejada), nunca pelo matiz.
- Sans 300 de display com tracking negativo; no máximo uma palavra em serif itálica por página.
- Placas com cantos de 10px, sem sombra; filetes de 1px como estrutura.
- Pílulas para ações; chips de vidro sobre foto, chips de contorno sobre papel.

## Colors

Monocromático em dois temas: cada papel é um token semântico (`--fundo`, `--tinta`, `--placa`, `--linha`, `--suave`, `--apagado`, `--texto-leitura`, `--marca`, `--marca-texto`) que troca de valor com o tema; preto e branco fixos servem só aos cartões com foto.

### Primary
- **Marca** (marca no claro, marca-escuro no escuro): o "agora". Faixa da próxima Missa na programação, marcador "Hoje", pílula primária "Falar com o padre", traço da lâmpada no hero e a escolha atual do seletor de tema. No claro é tinta preta; no escuro é o creme da lâmpada, a única luz da nave.
- **Texto sobre marca** (marca-texto / marca-texto-escuro): branco sobre a faixa preta, preto sobre a faixa creme; o traço da faixa "Próxima" e o local e a nota dentro dela (a 70%) usam esta cor.

### Neutral
- **Fundo** (fundo / fundo-escuro): página, cabeçalho rolado, menu móvel, painéis suspensos, véus do hero e degradê do botão flutuante; texto sobre tinta.
- **Tinta** (tinta / tinta-escuro): texto principal e títulos, contorno das pílulas e seu preenchimento de hover, traço "adiante", seleção de texto, cursor.
- **Placa** (placa / placa-escuro): placas (avisos, locais, cartões de publicação sem foto) e hover das linhas de painéis e do botão do seletor de tema.
- **Linha** (linha / linha-escuro): filetes de 1px de listas, rodapé, cabeçalho rolado, painéis, chips de contorno e seletor de tema; o traço curto do "passou"; trilho da barra de rolagem.
- **Suave** (suave / suave-escuro): texto secundário, subtítulos, rótulos de metadados, links de navegação inativos, opções inativas do seletor.
- **Apagado** (apagado / apagado-escuro): o que já passou ou foi cancelado; opções indisponíveis; sublinhado dos links do texto rico.
- **Texto de leitura** (texto-leitura / texto-leitura-escuro): corpo do texto rico, um preto amortecido no claro e um branco morno no escuro.
- **Preto** (preto) e **Branco** (branco): fixos nos dois temas, só nos cartões de publicação com foto: fundo de reserva preto, véu preto a 75%, texto branco (data a 75%), chip de vidro branco.

### Named Rules
**A Regra da Marca.** O "agora" leva a cor de marca: próxima Missa, "Hoje", ação primária, o traço da lâmpada e a escolha atual do seletor de tema. Se algo preenchido de marca não for uma dessas coisas, está errado. Os hovers das pílulas de contorno se preenchem de tinta, não de marca.

**A Regra da Lâmpada.** O creme #f5f5f0 só existe como a marca do tema escuro. Nunca aparece no tema claro, nem como acento decorativo, fundo de seção ou cor de link no escuro.

**A Regra do Token Semântico.** Toda cor de interface vem dos tokens semânticos, que mudam com o tema; nenhum componente escreve preto ou branco fixo, exceto os cartões com foto, que mantêm véu preto e texto branco nos dois temas.

**A Regra Sem Matiz.** A interface não usa cor cromática. Cores litúrgicas são palavras em rótulo, não amostras de cor. A fotografia é a única fonte de cor e é bem-vinda como tal.

## Typography

**Display Font:** Geist (variável `--font-texto`, pesos 300/400/500)
**Body Font:** Geist
**Destaque:** Instrument Serif itálico 400 (variável `--font-destaque`)

**Character:** Uma sans leve e precisa em tamanhos grandes, sussurrada em vez de gritada, contra uma serif itálica que entra como inflexão de voz numa palavra só.

### Hierarchy
- **Display de página** (300, clamp(3rem, 9vw, 7rem), 0.95, -0.045em): o h1 de cada página interna; títulos de leitura usam clamp(2.5rem, 6.5vw, 5rem), 1, -0.04em.
- **Display da lâmpada** (300, clamp(2.75rem, 8vw, 6rem), 0.95, -0.04em): a frase da próxima Missa no hero; primeira linha em tinta a 65%, dia e horário em tinta cheia, com o dia em serif itálica. Acima dela, o h1 do hero é uma frase de apresentação em 300, clamp(1.75rem, 3.6vw, 2.75rem), tinta a 80%; a linha de tipo e local abaixo fica em tinta a 75%.
- **Headline** (300, clamp(2.25rem, 5vw, 3.5rem), 1, -0.035em): títulos de seção; o lema do rodapé usa clamp(2.5rem, 6vw, 4.5rem).
- **Title** (300, 1.75rem, 1.25, -0.025em): nomes dos dias na programação, títulos de cartões (1.5rem no celular), itens do menu móvel (2rem).
- **Body** (400, 1rem, 1.5, ss01 + cv11): texto corrente; 1.125rem para parágrafos de apoio em suave.
- **Leitura** (400, 1.125rem, 1.7): texto rico, numa coluna de no máximo 40rem; h2 internos em 300, 1.875rem, tinta.
- **Label** (500, 0.8125rem, 0.08em, caixa alta): datas, locais, "Próxima", "Cancelado", cor litúrgica, cabeçalhos de margem (Data, Autor, Tema), tema sem foto, legenda "Tema" do seletor no menu móvel.
- **Chip** (500, 0.6875rem, 0.05em, caixa alta): só dentro dos chips de vidro.

### Named Rules
**A Regra da Palavra Única.** A serif itálica aparece em no máximo uma palavra de recompensa por página, marcada com `<em>` dentro de um título ("Horários *habituais*", "Instituto *Bom Pastor*", "Palavra do *padre*", "*hoje*"). Nunca em frases inteiras, nunca em texto corrido; a única outra ocorrência é a citação em bloco do texto rico.

**A Regra do Peso Leve.** Títulos são sempre 300. Ênfase dentro do corpo é 500, nunca bold.

## Layout

Contêiner centralizado de 75rem com calhas de 20px no celular e 32px a partir de md. Seções da home separadas por 112px (144px em md). Grades de cartões em 1 coluna no celular e 2 em md, com gap de 16px. A programação usa duas colunas a partir de md (14rem para o dia, o resto para os itens) e empilha no celular. Páginas de leitura: coluna de margem de 14rem com metadados fixos (sticky) e coluna de texto de até 40rem. O hero da home ocupa 100svh, sobe por baixo do cabeçalho transparente, com a apresentação no alto e a próxima Missa ancorada embaixo. No celular, o botão de atendimento flutua no rodapé sobre um degradê para a cor do fundo.

O tema é escolhido antes da pintura: um script inline no `<head>` lê a chave `tema` do localStorage ("claro" ou "escuro"; ausente = automático) e grava `data-tema` no `<html>`; sem JavaScript, `prefers-color-scheme` decide. O `theme-color` do navegador acompanha o sistema (#ffffff / #000000) e `color-scheme` acompanha o tema.

## Elevation & Depth

Plano nos dois temas. A profundidade vem de tom (fundo, placa, linha) e da marca, não de sombras; placas não têm sombra. No hero, véus na cor do fundo garantem leitura sobre a foto: um véu geral de 35%, um degradê lateral de 85% a transparente da esquerda, um degradê de base em fundo cheio subindo três quartos da altura e um degradê de topo de 75% sob o cabeçalho. Nos cartões com foto, o véu é sempre preto, 75% nos 60% inferiores. As sombras são poucas e pertencem a componentes específicos.

### Shadow Vocabulary
- **Pílula** (`box-shadow: rgba(0,0,0,0.15) 0px 4px 20px 0px`): pílula primária.
- **Vidro** (`box-shadow: rgba(0,0,0,0.35) 0px 10px 30px 0px, rgba(255,255,255,0.08) 0px 1px 0px 0px inset`): só no chip de vidro sobre fotografia.
- **Painel** (`box-shadow: 0 10px 30px rgba(0,0,0,0.12)`): só nos painéis suspensos (atendimento e seletor de tema), que flutuam sobre o conteúdo.

### Named Rules
**A Regra da Placa Plana.** Placas nunca levam sombra; separação é tom e filete.

**A Regra do Véu do Fundo.** O véu do hero é sempre a cor do fundo do tema, para o texto em tinta ler sobre a foto; só os cartões com foto mantêm véu preto fixo.

## Shapes

Dois raios só: 10px para placas, imagens, faixas de linha e painéis; 9999px para pílulas, chips, o marcador "Hoje" e o seletor de tema. Estrutura com filetes de 1px na cor linha (topo e base de listas, rodapé, divisórias internas de painéis). O sistema de linhas da programação é a geometria assinatura: um traço horizontal à esquerda de cada item cuja forma muda com o estado.

## Components

### Buttons
Pílulas calmas, sem ícone.
- **Shape:** totalmente arredondada (9999px), altura mínima de 44px (40px no cabeçalho, 48px flutuando no celular).
- **Primary:** fundo marca, texto marca-texto, 500 em 1rem, sombra de pílula; hover reduz a opacidade para 0.85. "Falar com o padre", preta no claro, creme no escuro.
- **Contorno:** filete de tinta de 1px, texto tinta; hover inverte para fundo tinta e texto fundo. "Ver a semana", "Conheça o Instituto", "Como chegar", "Menu".
- **Transições:** 0.25s na curva da lâmpada (cubic-bezier(0.625, 0.05, 0, 1)) sobre cor, fundo, borda e opacidade.
- **Focus:** contorno de 1px na cor do texto (currentColor) com afastamento de 4px.

### Seletor de tema
Três opções: Automático, Claro, Escuro; "Automático" apaga a chave salva e volta a seguir o sistema.
- **Cabeçalho (md em diante):** botão circular de 40px com filete linha, ícone de meio círculo cheio em tinta (SVG de 16px), hover em placa. Abre um painel de 11rem (10px de raio, filete linha, fundo, sombra de painel) com as opções em 0.9375rem; a atual leva um ponto de 6px em marca. Fecha com clique fora ou Esc.
- **Menu móvel:** sob o rótulo "Tema", um grupo segmentado em pílula com filete linha e 4px de folga; a opção atual é uma pílula de marca com texto marca-texto, as outras em suave (tinta no hover).

### Chips
- **Vidro:** fundo cinza a 10%, desfoque de 20px com saturação 1.4, sombra de vidro, texto branco em rótulo de chip. Só sobre imagens (tema no canto superior direito do cartão).
- **Contorno:** filete linha de 1px, rótulo em tinta, 6px por 16px. O tema no cartão sem foto.

### Cards / Containers
- **Corner Style:** 10px.
- **Background:** placa.
- **Shadow Strategy:** nenhuma (ver Elevation & Depth).
- **Border:** nenhuma em placas de conteúdo; os painéis suspensos usam filete linha sobre fundo.
- **Internal Padding:** 28px (36px em md para os locais).
- **Cartão de publicação:** proporção 4:5 no celular, 4:3 a partir de sm. Com foto: igual nos dois temas, fundo preto, véu de 75% nos 60% inferiores, texto branco, data em branco a 75%, chip de vidro, zoom de 1.03 em 0.7s no hover. Sem foto: placa com texto tinta, resumo em suave e chip de contorno.

### Navigation
Cabeçalho fixo de 72px, sempre em tinta. Na home, antes de rolar, é transparente sobre o véu do hero; rolado ou com o menu aberto, ganha fundo e filete linha; transição de 0.3s. Marca em duas linhas: "Instituto Bom Pastor" 500 e "Curitiba" em rótulo suave. Links em 0.9375rem 500, inativos em suave, ativo e hover em tinta. À direita: seletor de tema e pílula primária (md em diante). Abaixo de lg, uma pílula de contorno "Menu" abre um painel de fundo em tela cheia com itens em title 2rem separados por filetes, e o seletor segmentado no celular.

### Links
**Link sutil:** sublinhado na cor do texto a 30% com afastamento de 4px; no hover o sublinhado assume a cor do texto. No texto rico, links em tinta com sublinhado apagado.

### Programação (componente assinatura)
A semana como uma coluna de marcas. Cada dia é uma linha entre filetes; o dia de hoje recebe o marcador "Hoje" em pílula de marca. Cada item tem um traço à esquerda cuja forma carrega o estado:
- **Próxima:** a linha inteira vira uma faixa de marca (10px de raio) com texto marca-texto, rótulo "Próxima", local e nota em marca-texto a 70%; traço de 2px em marca-texto que acende.
- **Adiante:** traço de tinta de 1px, 32px de largura, texto tinta.
- **Passou:** traço curto (16px) na cor linha, texto apagado.
- **Cancelado:** traço tracejado apagado, horário e nome riscados, rótulo "Cancelado".
Todas as linhas no mesmo tamanho; a hierarquia é peso (Missas em 500), caixa e a marca. A cor litúrgica do dia aparece como rótulo em tinta antes do destaque.

### A lâmpada (movimento)
O único momento autoral: a linha da próxima Missa acende uma vez, crescendo da esquerda (scaleX 0 a 1 e opacidade) em 0.9s na curva da lâmpada. No hero, um traço de marca de 2px por 64px sob o horário; na programação, o traço da faixa "Próxima". Com movimento reduzido, tudo fica instantâneo.

## Do's and Don'ts

### Do:
- **Do** marcar o "agora" com a cor de marca: a próxima Missa, o "Hoje", a ação primária, o traço da lâmpada e a escolha atual do seletor de tema.
- **Do** tirar toda cor de interface dos tokens semânticos (`--fundo`, `--tinta`, `--placa`, `--linha`, `--suave`, `--apagado`, `--texto-leitura`, `--marca`, `--marca-texto`) e conferir cada tela nos dois temas.
- **Do** aplicar o tema antes da pintura pelo `data-tema` do `<html>`, com `prefers-color-scheme` como reserva sem JavaScript.
- **Do** comunicar estado pela forma da linha (faixa cheia, filete inteiro, filete curto, tracejado), nunca por matiz.
- **Do** escrever cores litúrgicas como palavras em rótulo.
- **Do** usar Geist 300 com tracking negativo para todo título, e no máximo uma palavra em serif itálica por página.
- **Do** carregar metadados em rótulos em caixa alta (0.8125rem, 500, 0.08em) em suave.
- **Do** usar placas com 10px de raio e sem sombra, e filetes de 1px como estrutura.
- **Do** pôr véus na cor do fundo sob o texto do hero, e véu preto fixo sob o texto dos cartões com foto.
- **Do** usar a curva cubic-bezier(0.625, 0.05, 0, 1) em 0.2 a 0.3s para estados, e respeitar movimento reduzido.

### Don't:
- **Don't** introduzir cor cromática na interface, nem em amostras de cor litúrgica, ícones ou estados.
- **Don't** usar o creme da lâmpada no tema claro, nem como acento decorativo, fundo de seção ou cor de link no escuro.
- **Don't** preencher de marca nada além do "agora", da ação primária e da escolha atual do seletor de tema.
- **Don't** escrever preto ou branco fixos em componentes de interface; só os cartões com foto os usam.
- **Don't** pôr serif itálica em mais de uma palavra por página ou em texto corrido.
- **Don't** dar sombra a placas ou usar sombras duras deslocadas.
- **Don't** criar um segundo momento de movimento autoral além da lâmpada; nada de bounce.
- **Don't** usar títulos em bold; ênfase máxima é 500.
