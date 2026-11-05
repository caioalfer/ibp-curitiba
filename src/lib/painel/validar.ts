import "server-only";
import { CORES_LITURGICAS, HORA_REGEX, TIPOS_ATIVIDADE, type CorLiturgica, type TipoAtividade } from "@/sanity/lib/constantes";

// Tudo o que chega do navegador é tratado como não confiável: as ações podem ser chamadas diretamente.

export function texto(formData: FormData, campo: string, max = 1000) {
  const valor = formData.get(campo);
  return typeof valor === "string" ? valor.trim().slice(0, max) : "";
}

export function dataISO(valor: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return null;
  const d = new Date(`${valor}T12:00:00Z`);
  return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== valor ? null : valor;
}

export function hora(valor: string) {
  return HORA_REGEX.test(valor) ? valor : null;
}

export function tipoAtividade(valor: string): TipoAtividade | null {
  return TIPOS_ATIVIDADE.some((t) => t.value === valor) ? (valor as TipoAtividade) : null;
}

export function corLiturgica(valor: string): CorLiturgica | null {
  return CORES_LITURGICAS.some((c) => c.value === valor) ? (valor as CorLiturgica) : null;
}

/** IDs de documento do Sanity: sem rascunhos ("drafts.") e só caracteres seguros. */
export function idDocumento(valor: string) {
  return /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/.test(valor) ? valor : null;
}

/** _key de item de lista: entra em caminhos de patch, então só letras e números. */
export function chaveItem(valor: string) {
  return /^[A-Za-z0-9]{1,32}$/.test(valor) ? valor : null;
}

/** Link de aviso: interno ("/capela") ou http(s). Bloqueia javascript:, data: e afins. */
export function link(valor: string): { ok: true; valor: string | undefined } | { ok: false } {
  if (!valor) return { ok: true, valor: undefined };
  if (valor.startsWith("/") && !valor.startsWith("//")) return { ok: true, valor };
  try {
    const url = new URL(valor);
    return url.protocol === "https:" || url.protocol === "http:" ? { ok: true, valor: url.toString() } : { ok: false };
  } catch {
    return { ok: false };
  }
}
