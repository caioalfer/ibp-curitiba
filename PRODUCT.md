# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Fiéis e frequentadores** da Missa Tradicional do Instituto Bom Pastor em Curitiba. Acessam principalmente pelo celular, muitas vezes pouco antes de sair de casa, para saber o horário e o local da próxima Missa ou confissão.
- **Quem procura a Missa Tridentina pela primeira vez** e precisa entender onde ir, quando e o que esperar.
- **Administrador** (padre ou secretaria): publica a programação semanal, avisos, notícias e artigos pelo painel (Sanity Studio em `/studio`), muitas vezes pelo celular.

## Product Purpose

Site oficial do apostolado do IBP em Curitiba. A tarefa principal é responder **quando e onde é a próxima Missa ou confissão**. Depois vêm avisos, notícias, artigos do padre, a seção Sobre (história do IBP, superiores, apostolado local) e o contato com o padre pelo WhatsApp. O site funciona quando o fiel encontra o horário certo em segundos e quando o administrador consegue atualizar a semana sem ajuda.

## Positioning

É o único lugar com a **programação real da semana** do IBP em Curitiba. O site do distrito (ibpamericalatina.org) não publica horários, e hoje eles só circulam em posts do Instagram @ibpcuritiba.

## Operating Context

- Rito Romano Tradicional (livros de 1962): Missa rezada, Missa cantada, Exposição do Santíssimo, Santo Terço, confissões antes das Missas.
- Dois locais: Capela da Imaculada Conceição (Av. Lamenha Lins, 2115, Rebouças) e Casa do Padre (Rua Olavo Bilac, 76, Batel).
- Ritmo semanal: os horários padrão são a base, e a programação de cada semana (segunda a domingo) é ajustada pelo administrador.
- 2026 marca os 20 anos do IBP (fundado em 8 set. 2006).

## Capabilities and Constraints

- Next.js 16 + Tailwind 4 + Sanity. Conteúdo editável pelo painel; o site roda com dados de exemplo (`src/lib/fallback.ts`) enquanto o Sanity não está configurado.
- Agendamento de confissão e direção espiritual **só pelo WhatsApp**: botão com seletor e mensagem pronta. O site não coleta dados pessoais.
- Avisos expiram sozinhos. A programação semanal é sempre destaque na home.
- Escopo e decisões vivos em `docs/projeto.md`.
- Em aberto: local de cada horário, número de WhatsApp, biografia e foto do Pe. Thiago, texto do apostolado em Curitiba.

## Brand Commitments

- Nome: **Instituto Bom Pastor – Curitiba**. Logo/brasão oficial do IBP será fornecido pelo cliente.
- Tom sóbrio e reverente, sem apelo comercial nem linguagem de marketing.
- Referência visual escolhida pelo cliente: estilo "Sequel" (canvas escuro, um único acento creme, sans leve + serif itálica de destaque), adaptado ao contexto católico tradicional.

## Evidence on Hand

- Horários padrão (post do Instagram, registrados em `docs/projeto.md`).
- Textos institucionais de ibpamericalatina.org (história, superior geral).
- **Ainda não temos:** fotos (o cliente vai enviar), logo (o cliente vai enviar), biografia do Pe. Thiago. Não inventar imagens, depoimentos nem números.

## Product Principles

1. O horário vem primeiro: a próxima Missa e a semana precisam estar legíveis no celular em segundos.
2. Reverência acima de efeito: nada no site pode parecer propaganda.
3. Fácil de manter: tudo que muda é editável no painel, e o site nunca fica vazio.
4. Acolher quem chega: quem nunca foi à Missa Tradicional deve entender onde e quando ir.

## Accessibility & Inclusion

Público de todas as idades, incluindo idosos: texto com bom tamanho e contraste, alvos de toque grandes, sem depender de cor para transmitir informação.
