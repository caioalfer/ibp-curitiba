import "server-only";
import { sanityFetch } from "@/sanity/lib/client";
import {
  QUERY_ARTIGO,
  QUERY_ARTIGOS,
  QUERY_AVISOS,
  QUERY_CONFIGURACOES,
  QUERY_HORARIOS_PADRAO,
  QUERY_LOCAIS,
  QUERY_NOTICIA,
  QUERY_NOTICIAS,
  QUERY_SEMANAS,
  QUERY_SOBRE,
  type Aviso,
  type Configuracoes,
  type HorarioPadrao,
  type Local,
  type Publicacao,
  type PublicacaoResumo,
  type Semana,
  type Sobre,
} from "@/sanity/lib/queries";
import { agoraEmCuritiba, somarDias } from "./datas";
import { artigosExemplo, avisosExemplo, noticiasExemplo } from "./exemplos";
import fotoBarrero from "@/assets/padre-barrero.jpg";
import fotoThiago from "@/assets/padre-thiago.jpg";
import { CONFIGURACOES, HORARIOS_PADRAO, LOCAIS, SOBRE } from "./fallback";

// A foto entra aqui, e não em fallback.ts, porque fallback.ts também é lido pelo script de carga do Sanity.
const SOBRE_LOCAL: Sobre = {
  ...SOBRE,
  superiorGeral: SOBRE.superiorGeral && { ...SOBRE.superiorGeral, fotoLocal: fotoBarrero, fotoFoco: "48% 28%" },
  prior: SOBRE.prior && { ...SOBRE.prior, fotoLocal: fotoThiago, fotoFoco: "42% 30%" },
};
import { montarProgramacao } from "./programacao";

export function getHorariosPadrao() {
  return sanityFetch<HorarioPadrao[]>({
    query: QUERY_HORARIOS_PADRAO,
    tags: ["horarioPadrao", "local"],
    semSanity: HORARIOS_PADRAO,
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
    semSanity: avisosExemplo(agoraEmCuritiba().data),
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

export async function getConfiguracoes() {
  const config = await sanityFetch<Configuracoes | null>({
    query: QUERY_CONFIGURACOES,
    tags: ["configuracoes"],
    semSanity: CONFIGURACOES,
  });
  return { ...CONFIGURACOES, ...config };
}
