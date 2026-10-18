import type { PortableTextBlock } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url";
import type { StaticImageData } from "next/image";
import { defineQuery } from "next-sanity";
import type { CorLiturgica, Dia, TipoAtividade } from "./constantes";

// ---------- Tipos ----------

export type Local = { _id: string; nome: string; apelido?: string; endereco: string; mapaUrl?: string };

export type Atividade = {
  hora: string;
  tipo: TipoAtividade;
  titulo?: string;
  nota?: string;
  local?: Local;
};

export type HorarioPadrao = Atividade & { dias: Dia[] };

export type ItemProgramacao = Atividade & { data: string; cancelado?: boolean };

export type Semana = {
  inicio: string;
  destaques?: { data: string; texto: string; cor?: CorLiturgica }[];
  itens?: ItemProgramacao[];
};

/** `exemplo`: conteúdo de demonstração (src/lib/exemplos.ts), marcado na tela. */
export type Aviso = { _id: string; texto: string; validoAte: string; link?: string; exemplo?: boolean };

type ImagemComAlt = SanityImageSource & { alt?: string };

export type PublicacaoResumo = {
  _id: string;
  titulo: string;
  slug: string;
  data: string;
  resumo?: string;
  imagem?: ImagemComAlt;
  tema?: string;
  autor?: string;
  /** Só nos exemplos: imagem do projeto em vez da do Sanity. */
  imagemLocal?: StaticImageData;
  imagemAlt?: string;
  /** Legenda de crédito (obra, autor, acervo). */
  imagemCredito?: string;
  exemplo?: boolean;
};

export type Publicacao = PublicacaoResumo & { corpo?: PortableTextBlock[] };

export type Pessoa = {
  _id: string;
  nome: string;
  cargo?: string;
  foto?: SanityImageSource;
  /** Sem painel: foto do projeto (src/assets). */
  fotoLocal?: StaticImageData;
  /** Ponto do rosto na foto local (CSS object-position), para recortes e avatar. */
  fotoFoco?: string;
  bio?: PortableTextBlock[];
};

export type Sobre = {
  historia?: PortableTextBlock[];
  superiorGeral?: Pessoa;
  prior?: Pessoa;
};

export type Configuracoes = {
  whatsapp?: string;
  textoBotao?: string;
  opcoesAtendimento?: { rotulo: string; mensagem: string; whatsapp?: string }[];
  fotoCapa?: ImagemComAlt;
  instagram?: string;
  email?: string;
};

// ---------- Consultas ----------

const publicado = `!(_id in path("drafts.**"))`;
const projecaoLocal = `local->{_id, nome, apelido, endereco, mapaUrl}`;

export const QUERY_HORARIOS_PADRAO = defineQuery(
  `*[_type == "horarioPadrao" && ${publicado}] | order(hora asc){dias, hora, tipo, titulo, nota, ${projecaoLocal}}`,
);

// Semanas que tocam o intervalo pedido. Uma semana vai de `inicio` até `inicio` + 6 dias,
// então $desde = primeiro dia do intervalo - 6.
export const QUERY_SEMANAS = defineQuery(
  `*[_type == "semana" && ${publicado} && inicio >= $desde && inicio <= $ate]
    | order(inicio asc){
      inicio,
      destaques[]{data, texto, cor},
      itens[]{data, hora, tipo, titulo, nota, cancelado, ${projecaoLocal}}
    }`,
);

export const QUERY_LOCAIS = defineQuery(`*[_type == "local" && ${publicado}] | order(nome asc){_id, nome, apelido, endereco, mapaUrl}`);

export const QUERY_AVISOS = defineQuery(
  `*[_type == "aviso" && ${publicado} && validoAte >= $hoje] | order(validoAte asc){_id, texto, validoAte, link}`,
);

const projecaoResumo = `_id, titulo, "slug": slug.current, data, resumo, imagem, tema, "autor": autor->nome`;

export const QUERY_NOTICIAS = defineQuery(
  `*[_type == "noticia" && ${publicado} && defined(slug.current)] | order(data desc)[0...$limite]{${projecaoResumo}}`,
);

export const QUERY_NOTICIA = defineQuery(
  `*[_type == "noticia" && ${publicado} && slug.current == $slug][0]{${projecaoResumo}, corpo}`,
);

export const QUERY_ARTIGOS = defineQuery(
  `*[_type == "artigo" && ${publicado} && defined(slug.current)] | order(data desc)[0...$limite]{${projecaoResumo}}`,
);

export const QUERY_ARTIGO = defineQuery(
  `*[_type == "artigo" && ${publicado} && slug.current == $slug][0]{${projecaoResumo}, corpo}`,
);

export const QUERY_SOBRE = defineQuery(
  `*[_id == "sobre"][0]{historia, superiorGeral->{_id, nome, cargo, foto, bio}, prior->{_id, nome, cargo, foto, bio}}`,
);

export const QUERY_CONFIGURACOES = defineQuery(
  `*[_id == "configuracoes"][0]{whatsapp, textoBotao, opcoesAtendimento[]{rotulo, mensagem, whatsapp}, fotoCapa, instagram, email}`,
);
