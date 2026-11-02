import "server-only";
import { sanityFetch } from "@/sanity/lib/client";
import {
  QUERY_ARTIGO,
  QUERY_ARTIGOS,
  QUERY_AVISOS,
  QUERY_CAPELA,
  QUERY_CONFIGURACOES,
  QUERY_HORARIOS_PADRAO,
  QUERY_LOCAIS,
  QUERY_NOTICIA,
  QUERY_NOTICIAS,
  QUERY_SEMANAS,
  QUERY_SOBRE,
  type Aviso,
  type Capela,
  type Configuracoes,
  type HorarioPadrao,
  type Local,
  type Publicacao,
  type PublicacaoResumo,
  type Semana,
  type Sobre,
} from "@/sanity/lib/queries";
import { agoraEmCuritiba, somarDias } from "./datas";
import { artigosExemplo, avisosExemplo, horariosExemplo, noticiasExemplo } from "./exemplos";
import fotoBarrero from "@/assets/padre-barrero.jpg";
import fotoThiago from "@/assets/padre-thiago.jpg";
import fotoDaniel from "@/assets/padre-daniel.png";
import arteCapela from "@/assets/projeto-capela.jpg";
import { AVISO_CAPELA, CAPELA, CONFIGURACOES, LOCAIS, SOBRE } from "./fallback";

// A foto entra aqui, e não em fallback.ts, porque fallback.ts também é lido pelo script de carga do Sanity.
const SOBRE_LOCAL: Sobre = {
  ...SOBRE,
  superiorGeral: SOBRE.superiorGeral && { ...SOBRE.superiorGeral, fotoLocal: fotoBarrero, fotoFoco: "48% 28%" },
  superiorDistrito: SOBRE.superiorDistrito && { ...SOBRE.superiorDistrito, fotoLocal: fotoDaniel, fotoFoco: "50% 26%" },
  paroco: SOBRE.paroco && { ...SOBRE.paroco, fotoLocal: fotoThiago, fotoFoco: "42% 30%" },
};
import { montarProgramacao } from "./programacao";

export function getHorariosPadrao() {
  return sanityFetch<HorarioPadrao[]>({
    query: QUERY_HORARIOS_PADRAO,
    tags: ["horarioPadrao", "local"],
    semSanity: horariosExemplo(),
  });
}

/**
 * Programação de ontem até daqui a 7 dias (9 dias). O dia extra de cada lado deixa o
 * componente do navegador recalcular "hoje" mesmo que a página em cache tenha sido gerada antes da meia-noite.
 */
export async function getProgramacao() {
  const hoje = agoraEmCuritiba().data;
  const inicio = somarDias(hoje, -1);
  const quantos = 9;
  const [padroes, semanas] = await Promise.all([
    getHorariosPadrao(),
    sanityFetch<Semana[]>({
      query: QUERY_SEMANAS,
      params: { desde: somarDias(inicio, -6), ate: somarDias(inicio, quantos - 1) },
      tags: ["semana", "local"],
      semSanity: [],
    }),
  ]);
  return montarProgramacao(inicio, quantos, padroes, semanas);
}

export function getLocais() {
  return sanityFetch<Local[]>({ query: QUERY_LOCAIS, tags: ["local"], semSanity: LOCAIS });
}

export function getAvisos() {
  return sanityFetch<Aviso[]>({
    query: QUERY_AVISOS,
    params: { hoje: agoraEmCuritiba().data },
    tags: ["aviso"],
    semSanity: [AVISO_CAPELA, ...avisosExemplo(agoraEmCuritiba().data)],
  });
}

export function getNoticias(limite = 50) {
  return sanityFetch<PublicacaoResumo[]>({
    query: QUERY_NOTICIAS,
    params: { limite },
    tags: ["noticia"],
    semSanity: noticiasExemplo(agoraEmCuritiba().data).slice(0, limite),
  });
}

export function getNoticia(slug: string) {
  return sanityFetch<Publicacao | null>({
    query: QUERY_NOTICIA,
    params: { slug },
    tags: ["noticia"],
    semSanity: noticiasExemplo(agoraEmCuritiba().data).find((n) => n.slug === slug) ?? null,
  });
}

export function getArtigos(limite = 50) {
  return sanityFetch<PublicacaoResumo[]>({
    query: QUERY_ARTIGOS,
    params: { limite },
    tags: ["artigo", "pessoa"],
    semSanity: artigosExemplo(agoraEmCuritiba().data).slice(0, limite),
  });
}

export function getArtigo(slug: string) {
  return sanityFetch<Publicacao | null>({
    query: QUERY_ARTIGO,
    params: { slug },
    tags: ["artigo", "pessoa"],
    semSanity: artigosExemplo(agoraEmCuritiba().data).find((a) => a.slug === slug) ?? null,
  });
}

export async function getSobre() {
  return (await sanityFetch<Sobre | null>({ query: QUERY_SOBRE, tags: ["sobre", "pessoa"], semSanity: SOBRE_LOCAL })) ?? {};
}

// Arte da campanha enviada pelo cliente: vale até o painel ter outra imagem.
const ARTE_CAPELA: Capela = {
  imagemLocal: arteCapela,
  imagemAlt:
    "Projeto Capela da Imaculada Conceição. Junte-se a milhares de católicos que, como São Pio V, amam a Liturgia Romana. Ilustração da fachada de uma igreja com torre sineira.",
};

export async function getCapela() {
  const capela = await sanityFetch<Capela | null>({
    query: QUERY_CAPELA,
    tags: ["capela"],
    semSanity: CAPELA,
  });
  return { ...ARTE_CAPELA, ...capela };
}

export async function getConfiguracoes() {
  const config = await sanityFetch<Configuracoes | null>({
    query: QUERY_CONFIGURACOES,
    tags: ["configuracoes"],
    semSanity: CONFIGURACOES,
  });
  return { ...CONFIGURACOES, ...config };
}
