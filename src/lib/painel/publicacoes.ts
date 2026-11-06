import "server-only";
import type { PortableTextBlock } from "next-sanity";
import { enderecoYoutube, idYoutube } from "@/lib/youtube";
import { novaChave } from "./sanity";
import { REF_IMAGEM } from "./tiposPublicacao";
import * as validar from "./validar";

/** "Missa de Cristo Rei" → "missa-de-cristo-rei" (endereço da página). */
export function criarSlug(titulo: string) {
  return (
    titulo
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80)
      .replace(/-+$/g, "") || "sem-titulo"
  );
}

const ESTILOS = new Set(["normal", "h2", "h3", "blockquote"]);
const DECORADORES = new Set(["strong", "em", "strike-through"]);
const LISTAS = new Set(["bullet", "number"]);

/**
 * Recorte da foto (frações cortadas de cada lado), feito na janela de enquadramento. Guardado no formato
 * do Sanity, com o ponto de interesse no centro do recorte; o site recorta na proporção padrão a partir dele.
 */
export function limparRecorte(bruto: unknown) {
  if (!bruto || typeof bruto !== "object") return null;
  const r = bruto as Record<string, unknown>;
  const fracao = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.round(Math.min(0.95, Math.max(0, v)) * 10000) / 10000 : NaN);
  const [top, bottom, left, right] = [fracao(r.top), fracao(r.bottom), fracao(r.left), fracao(r.right)];
  if ([top, bottom, left, right].some(Number.isNaN) || top + bottom > 0.95 || left + right > 0.95) return null;
  const largura = 1 - left - right;
  const altura = 1 - top - bottom;
  return {
    crop: { _type: "sanity.imageCrop", top, bottom, left, right },
    hotspot: { _type: "sanity.imageHotspot", x: left + largura / 2, y: top + altura / 2, width: largura, height: altura },
  };
}

function chave(b: Record<string, unknown>) {
  return validar.chaveItem(String(b._key ?? "")) ?? novaChave();
}

function textoCurto(valor: unknown, max: number) {
  return typeof valor === "string" ? valor.trim().slice(0, max) : "";
}

/**
 * O texto do artigo chega do navegador como JSON. Reconstruímos cada bloco só com o que o site sabe
 * mostrar (parágrafo, título, subtítulo, citação, listas, negrito, itálico, riscado, link, imagem, vídeo do
 * YouTube, botão e linha separadora). Qualquer outra coisa é descartada; links só http(s) ou internos;
 * imagens só referências do Sanity; vídeos só do YouTube.
 */
export function limparCorpo(bruto: unknown): PortableTextBlock[] | null {
  if (!Array.isArray(bruto) || bruto.length > 3000) return null;
  const saida: PortableTextBlock[] = [];

  for (const b of bruto as Record<string, unknown>[]) {
    if (!b || typeof b !== "object") return null;

    if (b._type === "block") {
      const markDefs = (Array.isArray(b.markDefs) ? (b.markDefs as Record<string, unknown>[]) : []).flatMap((m) => {
        if (m?._type !== "link") return [];
        const chave = validar.chaveItem(String(m._key ?? ""));
        const link = validar.link(textoCurto(m.href, 500));
        return chave && link.ok && link.valor ? [{ _key: chave, _type: "link", href: link.valor }] : [];
      });
      const chavesLink = new Set(markDefs.map((m) => m._key));
      const children = (Array.isArray(b.children) ? (b.children as Record<string, unknown>[]) : [])
        .filter((c) => c?._type === "span")
        .map((c) => ({
          _key: validar.chaveItem(String(c._key ?? "")) ?? novaChave(),
          _type: "span",
          text: typeof c.text === "string" ? c.text.slice(0, 20000) : "",
          marks: (Array.isArray(c.marks) ? c.marks : []).filter(
            (m): m is string => typeof m === "string" && (DECORADORES.has(m) || chavesLink.has(m)),
          ),
        }));
      const listItem = LISTAS.has(String(b.listItem)) ? String(b.listItem) : undefined;
      saida.push({
        _key: validar.chaveItem(String(b._key ?? "")) ?? novaChave(),
        _type: "block",
        style: ESTILOS.has(String(b.style)) ? String(b.style) : "normal",
        ...(listItem ? { listItem, level: Math.min(3, Math.max(1, Math.trunc(Number(b.level)) || 1)) } : {}),
        markDefs,
        children: children.length ? children : [{ _key: novaChave(), _type: "span", text: "", marks: [] }],
      } as PortableTextBlock);
      continue;
    }

    if (b._type === "image") {
      const ref = (b.asset as { _ref?: unknown } | undefined)?._ref;
      if (typeof ref !== "string" || !REF_IMAGEM.test(ref)) continue;
      const alt = textoCurto(b.alt, 160);
      const legenda = textoCurto(b.legenda, 200);
      const link = validar.link(textoCurto(b.link, 500));
      saida.push({
        _key: chave(b),
        _type: "image",
        asset: { _type: "reference", _ref: ref },
        ...(alt ? { alt } : {}),
        ...(legenda ? { legenda } : {}),
        ...(link.ok && link.valor ? { link: link.valor } : {}),
        ...(limparRecorte(b.crop) ?? {}),
      } as unknown as PortableTextBlock);
      continue;
    }

    if (b._type === "video") {
      const id = idYoutube(textoCurto(b.url, 300));
      if (id) saida.push({ _key: chave(b), _type: "video", url: enderecoYoutube(id) } as unknown as PortableTextBlock);
      continue;
    }

    if (b._type === "botao") {
      const texto = textoCurto(b.texto, 60);
      const link = validar.link(textoCurto(b.link, 500));
      if (texto && link.ok && link.valor) saida.push({ _key: chave(b), _type: "botao", texto, link: link.valor } as unknown as PortableTextBlock);
      continue;
    }

    if (b._type === "separador") {
      saida.push({ _key: chave(b), _type: "separador" } as unknown as PortableTextBlock);
    }
  }

  // Tira parágrafos vazios do fim.
  while (saida.length) {
    const ultimo = saida[saida.length - 1] as { _type: string; children?: { text: string }[] };
    if (ultimo._type === "block" && !ultimo.children?.some((c) => c.text.trim())) saida.pop();
    else break;
  }
  return saida;
}

/** Arquivo de imagem aceito: confere a assinatura dos bytes, não só a extensão. */
export function tipoDeImagem(bytes: Uint8Array): "image/jpeg" | "image/png" | "image/webp" | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  const riff = String.fromCharCode(...bytes.slice(0, 4));
  const webp = String.fromCharCode(...bytes.slice(8, 12));
  return riff === "RIFF" && webp === "WEBP" ? "image/webp" : null;
}
