// Configuração de artigos e notícias no painel. Sem segredos: usado no servidor e no navegador.

export type TipoPublicacao = "artigo" | "noticia";

export const TIPOS_PUBLICACAO: Record<
  TipoPublicacao,
  {
    rota: "/painel/artigos" | "/painel/noticias";
    rotaSite: "/artigos" | "/noticias";
    plural: string;
    singular: string;
    novo: string;
    /** "este artigo" / "esta notícia", "o artigo" / "a notícia", "Nenhum artigo" / "Nenhuma notícia". */
    este: string;
    o: string;
    nenhum: string;
    /** Artigos têm tema e autor; notícias, não. */
    temaEAutor: boolean;
  }
> = {
  artigo: { rota: "/painel/artigos", rotaSite: "/artigos", plural: "Artigos", singular: "artigo", novo: "Novo artigo", este: "este artigo", o: "o artigo", nenhum: "Nenhum artigo", temaEAutor: true },
  noticia: { rota: "/painel/noticias", rotaSite: "/noticias", plural: "Notícias", singular: "notícia", novo: "Nova notícia", este: "esta notícia", o: "a notícia", nenhum: "Nenhuma notícia", temaEAutor: false },
};

export function tipoPublicacao(valor: unknown): TipoPublicacao | null {
  return valor === "artigo" || valor === "noticia" ? valor : null;
}

/** Referência de imagem do Sanity: "image-<hash>-<largura>x<altura>-<formato>". */
export const REF_IMAGEM = /^image-[a-f0-9]{20,64}-\d+x\d+-(jpg|jpeg|png|webp|gif)$/;
