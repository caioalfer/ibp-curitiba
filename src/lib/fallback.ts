// Dados de exemplo: usados enquanto o Sanity não está configurado e como carga inicial
// do painel (scripts/semear.ts). Fonte: post de horários do @ibpcuritiba e ibpamericalatina.org.

import type { PortableTextBlock } from "next-sanity";
import type { Configuracoes, HorarioPadrao, Local, Pessoa, Sobre } from "@/sanity/lib/queries";

function paragrafos(...textos: string[]): PortableTextBlock[] {
  return textos.map((texto, i) => ({
    _type: "block",
    _key: `p${i}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `s${i}`, text: texto, marks: [] }],
  }));
}

export const LOCAIS: Local[] = [
  {
    _id: "local-capela",
    nome: "Capela da Imaculada Conceição",
    apelido: "Capela",
    endereco: "Av. Lamenha Lins, 2115 – Rebouças, Curitiba",
  },
  {
    _id: "local-casa",
    nome: "Casa do Padre",
    apelido: "Casa do Padre",
    endereco: "Rua Olavo Bilac, 76 – Batel, Curitiba",
  },
];

// O local de cada horário ainda não foi informado (ver docs/projeto.md).
export const HORARIOS_PADRAO: HorarioPadrao[] = [
  { dias: ["seg", "ter", "qua"], hora: "06:30", tipo: "missa-rezada" },
  { dias: ["qui"], hora: "18:30", tipo: "exposicao" },
  { dias: ["qui"], hora: "19:30", tipo: "missa-rezada" },
  { dias: ["sex"], hora: "19:00", tipo: "terco" },
  { dias: ["sex"], hora: "19:30", tipo: "missa-rezada" },
  { dias: ["sab", "dom"], hora: "08:00", tipo: "confissoes" },
  { dias: ["sab", "dom"], hora: "08:30", tipo: "missa-rezada" },
  { dias: ["dom"], hora: "09:30", tipo: "confissoes" },
  { dias: ["dom"], hora: "10:00", tipo: "missa-cantada" },
  { dias: ["dom"], hora: "18:30", tipo: "confissoes" },
  { dias: ["dom"], hora: "19:00", tipo: "missa-rezada" },
];

export const CONFIGURACOES: Configuracoes = {
  // WhatsApp do atendimento (+55 41 8526-6861), só números com DDI e DDD.
  whatsapp: "554185266861",
  textoBotao: "Falar com o padre",
  opcoesAtendimento: [
    { rotulo: "Confissão", mensagem: "Olá, gostaria de agendar uma confissão." },
    { rotulo: "Direção espiritual", mensagem: "Olá, gostaria de conversar sobre direção espiritual." },
  ],
  instagram: "https://www.instagram.com/ibpcuritiba/",
};

export const PADRES: Pessoa[] = [
  {
    _id: "padre-barrero",
    nome: "Pe. Luis Gabriel Barrero",
    cargo: "Superior Geral do Instituto Bom Pastor",
    bio: paragrafos(
      "Nascido em Bogotá, Colômbia, em 5 de dezembro de 1966, foi ordenado sacerdote em 14 de dezembro de 1997. Ingressou no Instituto Bom Pastor em 2014 e foi eleito seu segundo Superior Geral em 28 de agosto de 2019.",
    ),
  },
  {
    _id: "padre-thiago",
    nome: "Pe. Thiago Bonifácio",
    cargo: "Prior do Instituto Bom Pastor em Curitiba",
    bio: paragrafos(
      "Nascido em Ibirité, Minas Gerais, em 19 de março de 1990, foi ordenado sacerdote em 25 de junho de 2016.",
    ),
  },
];

export const SOBRE: Sobre = {
  historia: paragrafos(
    "O Instituto Bom Pastor é uma sociedade de vida apostólica de direito pontifício. Seus membros são sacerdotes seculares que vivem em comunidade, sob a autoridade direta da Santa Sé.",
    "Foi fundado em Roma em 8 de setembro de 2006, festa da Natividade de Nossa Senhora, sob o pontificado de Bento XVI. Seus estatutos foram aprovados no mesmo dia pelo Cardeal Darío Castrillón Hoyos, então prefeito da Congregação para o Clero.",
    "Sua missão é defender e difundir a Tradição católica sob todas as suas formas: doutrinal, apostólica e litúrgica. Em todos os atos litúrgicos, o Instituto usa exclusivamente o Rito Romano Tradicional, segundo os livros litúrgicos de 1962.",
  ),
  superiorGeral: PADRES[0],
  prior: PADRES[1],
};
