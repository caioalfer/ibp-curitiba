// Proporção padrão das fotos de artigos e notícias (capa e fotos no meio do texto): 3 de largura por 2 de altura.
// Para mudar: trocar aqui e nas classes `aspect-[3/2]` (busque por "aspect-[3/2]" no projeto).

export const PROPORCAO_FOTO = 3 / 2;

export const alturaDaFoto = (largura: number) => Math.round(largura / PROPORCAO_FOTO);

/** Recorte guardado junto da foto (frações de 0 a 1 cortadas de cada lado), no formato do Sanity. */
export type Recorte = { top: number; bottom: number; left: number; right: number };
