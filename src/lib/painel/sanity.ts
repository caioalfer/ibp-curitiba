import "server-only";
import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import type { Usuario } from "./sessao";

let cliente: SanityClient | null = null;

/**
 * Cliente com a chave de escrita (SANITY_WRITE_TOKEN). Só existe no servidor e só deve ser usado
 * depois de exigirAcesso(). Lê sempre o conteúdo publicado, sem cache, para o painel mostrar o estado real.
 */
export function sanityPainel(): SanityClient {
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!projectId || !token) throw new Error("Painel sem projeto do Sanity ou sem SANITY_WRITE_TOKEN.");
  cliente ??= createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "published" });
  return cliente;
}

export function lerPainel<T>(query: string, params: Record<string, unknown> = {}) {
  return sanityPainel().fetch<T>(query, params, { cache: "no-store" });
}

/** Quem alterou e quando: todas as gravações saem da mesma chave, então anotamos a pessoa no próprio conteúdo. */
export function carimbo(usuario: Usuario) {
  return { atualizadoPor: usuario.email, atualizadoEm: new Date().toISOString() };
}

/** Chave curta e aleatória para itens de lista do Sanity (_key). */
export function novaChave() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}
