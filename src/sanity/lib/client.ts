import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, projectId, sanityConfigurado } from "../env";

export const client = createClient({
  projectId: projectId || "nao-configurado",
  dataset,
  apiVersion,
  // Sem o CDN do Sanity: o Next já guarda as páginas em cache, e o CDN levaria alguns segundos para refletir
  // uma alteração. Lendo direto, o que o painel publica aparece no site na hora (updateTag/webhook).
  useCdn: false,
});

// Tempo máximo até o site refletir uma edição, caso o webhook de revalidação não esteja configurado.
const REVALIDAR_SEGUNDOS = 300;

/**
 * Busca no Sanity com cache do Next. Cada consulta é marcada com os tipos de documento que lê,
 * para o webhook (/api/revalidar) invalidar só o que mudou.
 * Sem Sanity configurado, devolve `semSanity` (dados de exemplo).
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags,
  semSanity,
}: {
  query: string;
  params?: QueryParams;
  tags: string[];
  semSanity: T;
}): Promise<T> {
  if (!sanityConfigurado) return semSanity;
  return client.fetch<T>(query, params, { next: { revalidate: REVALIDAR_SEGUNDOS, tags } });
}
