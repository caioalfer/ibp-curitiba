"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { apagarFotosDoTexto, apagarFotosSemUso, fotosDoTexto } from "@/lib/painel/fotos";
import { criarSlug, limparCorpo, limparRecorte, tipoDeImagem } from "@/lib/painel/publicacoes";
import { carimbo, lerPainel, lerPainelComRascunhos, sanityPainel } from "@/lib/painel/sanity";
import { exigirAcesso } from "@/lib/painel/sessao";
import { REF_IMAGEM, TIPOS_PUBLICACAO, tipoPublicacao, type TipoPublicacao } from "@/lib/painel/tiposPublicacao";
import * as validar from "@/lib/painel/validar";
import { TEMAS_ARTIGO } from "@/sanity/lib/constantes";

// Artigos e notícias. Rascunho fica em "drafts.<id>" (o site nunca mostra); publicar copia para "<id>"
// e apaga o rascunho. Cada ação confere o acesso e valida tudo de novo, aqui no servidor.

const MAX_IMAGEM = 6 * 1024 * 1024;

export type ResultadoImagem = { ok: true; id: string; url: string } | { ok: false; erro: string };

/** Envia uma foto (capa ou dentro do texto) para o Sanity. */
export async function enviarImagem(formData: FormData): Promise<ResultadoImagem> {
  await exigirAcesso();
  const arquivo = formData.get("arquivo");
  if (!(arquivo instanceof File) || arquivo.size === 0) return { ok: false, erro: "Escolha uma foto." };
  if (arquivo.size > MAX_IMAGEM) return { ok: false, erro: "A foto é muito grande (máximo 6 MB)." };

  const bytes = new Uint8Array(await arquivo.arrayBuffer());
  const tipo = tipoDeImagem(bytes);
  if (!tipo) return { ok: false, erro: "Use uma foto em JPG, PNG ou WebP." };

  const nome = arquivo.name.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 80) || "foto";
  // A conexão com o Sanity às vezes oscila (internet ou DNS): tenta até 3 vezes antes de desistir.
  for (let tentativa = 1; ; tentativa++) {
    try {
      const asset = await sanityPainel().assets.upload("image", Buffer.from(bytes), { filename: nome, contentType: tipo });
      return { ok: true, id: asset._id, url: asset.url };
    } catch (erro) {
      const deRede = erroDeRede(erro);
      if (deRede && tentativa < 3) {
        await new Promise((r) => setTimeout(r, 800 * tentativa));
        continue;
      }
      console.error("enviarImagem", erro);
      return {
        ok: false,
        erro: deRede
          ? "Sem conexão com o serviço de fotos agora. Confira a internet e tente de novo."
          : "Não foi possível enviar a foto agora. Tente de novo em instantes.",
      };
    }
  }
}

/** Falha de conexão (sem internet, DNS, tempo esgotado), e não uma recusa do Sanity. */
function erroDeRede(erro: unknown) {
  const e = erro as { isNetworkError?: boolean; code?: string; cause?: { code?: string } };
  const codigo = e?.code ?? e?.cause?.code ?? "";
  return Boolean(e?.isNetworkError) || /ENOTFOUND|EAI_AGAIN|ECONNRESET|ECONNREFUSED|ETIMEDOUT|UND_ERR/.test(codigo);
}

export type EstadoPublicacao = {
  erros?: Partial<Record<"titulo" | "data" | "resumo" | "autor" | "corpo" | "imagem" | "geral", string>>;
};

type Existente = { _id: string; slug?: string };

async function existentes(tipo: TipoPublicacao, id: string) {
  return lerPainelComRascunhos<Existente[]>(`*[_type == $tipo && _id in [$id, "drafts." + $id]]{_id, "slug": slug.current}`, {
    tipo,
    id,
  });
}

async function slugLivre(tipo: TipoPublicacao, base: string, id: string) {
  for (let n = 1; n < 50; n++) {
    const slug = n === 1 ? base : `${base}-${n}`;
    const usados = await lerPainelComRascunhos<number>(
      `count(*[_type == $tipo && slug.current == $slug && !(_id in [$id, "drafts." + $id])])`,
      { tipo, slug, id },
    );
    if (usados === 0) return slug;
  }
  return `${base}-${Date.now()}`;
}

export async function salvarPublicacao(_anterior: EstadoPublicacao, formData: FormData): Promise<EstadoPublicacao> {
  const usuario = await exigirAcesso();
  const tipo = tipoPublicacao(formData.get("tipo"));
  if (!tipo) return { erros: { geral: "Tipo inválido." } };
  const config = TIPOS_PUBLICACAO[tipo];
  const publicar = formData.get("acao") === "publicar";

  const idBruto = validar.texto(formData, "id", 140);
  const idInformado = idBruto ? validar.idDocumento(idBruto) : null;
  if (idBruto && !idInformado) return { erros: { geral: "Conteúdo inválido." } };

  const titulo = validar.texto(formData, "titulo", 200);
  const resumo = validar.texto(formData, "resumo", 1000);
  const data = validar.dataISO(validar.texto(formData, "data", 20));
  const imagemId = validar.texto(formData, "imagemId", 200);
  const imagemAlt = validar.texto(formData, "imagemAlt", 160);
  let recorte: ReturnType<typeof limparRecorte> = null;
  try {
    const bruto = validar.texto(formData, "imagemRecorte", 400);
    recorte = bruto ? limparRecorte(JSON.parse(bruto)) : null;
  } catch {
    recorte = null; // recorte inválido: a foto fica centralizada
  }
  const tema = config.temaEAutor ? validar.texto(formData, "tema", 40) : "";
  const autor = config.temaEAutor ? validar.texto(formData, "autor", 200) : "";

  let corpo: ReturnType<typeof limparCorpo> = [];
  try {
    const bruto = validar.texto(formData, "corpo", 600_000);
    corpo = bruto ? limparCorpo(JSON.parse(bruto)) : [];
  } catch {
    corpo = null;
  }

  const erros: EstadoPublicacao["erros"] = {};
  if (!titulo) erros.titulo = "Escreva o título.";
  else if (titulo.length > 120) erros.titulo = "Use no máximo 120 caracteres.";
  if (!data) erros.data = "Escolha a data.";
  if (resumo.length > 300) erros.resumo = "Use no máximo 300 caracteres.";
  if (autor.length > 80) erros.autor = "Use no máximo 80 caracteres.";
  if (corpo === null) erros.corpo = "Não foi possível ler o texto. Recarregue a página e tente de novo.";
  if (imagemId && !REF_IMAGEM.test(imagemId)) erros.imagem = "Foto inválida. Envie de novo.";
  if (publicar && corpo && corpo.length === 0) erros.corpo = "Escreva o texto antes de publicar.";
  if (Object.keys(erros).length > 0) return { erros };

  const temaValido = TEMAS_ARTIGO.some((t) => t.value === tema) ? tema : undefined;

  const id = idInformado ?? `${tipo}-${crypto.randomUUID()}`;
  const atuais = idInformado ? await existentes(tipo, id) : [];
  if (idInformado && atuais.length === 0) return { erros: { geral: `Não encontramos ${config.este}. Volte à lista e confira.` } };
  // O endereço é criado uma vez e não muda depois de publicado, para não quebrar links já compartilhados.
  const slugAtual = atuais.find((d) => d._id === id)?.slug ?? atuais[0]?.slug;
  const slug = slugAtual ?? (await slugLivre(tipo, criarSlug(titulo), id));

  const documento = {
    _type: tipo,
    titulo,
    slug: { _type: "slug", current: slug },
    data: data!,
    ...(resumo ? { resumo } : {}),
    ...(imagemId
      ? { imagem: { _type: "image", asset: { _type: "reference", _ref: imagemId }, ...(recorte ?? {}), ...(imagemAlt ? { alt: imagemAlt } : {}) } }
      : {}),
    ...(temaValido ? { tema: temaValido } : {}),
    // Autor é texto livre: o nome de quem escreveu, seja quem for.
    ...(autor ? { autor } : {}),
    corpo: corpo ?? [],
    ...carimbo(usuario),
  };

  try {
    const cliente = sanityPainel();
    if (publicar) {
      await cliente.transaction().createOrReplace({ _id: id, ...documento }).delete(`drafts.${id}`).commit();
    } else {
      await cliente.createOrReplace({ _id: `drafts.${id}`, ...documento });
    }
  } catch (erro) {
    console.error("salvarPublicacao", erro);
    return { erros: { geral: "Não foi possível salvar agora. Tente de novo em instantes." } };
  }

  if (publicar) {
    updateTag(tipo);
    faxinaDeFotos(); // fotos trocadas ou tiradas do texto, depois da carência
  }
  redirect(`${config.rota}/${id}?ok=${publicar ? "publicado" : "rascunho"}`);
}

/** Depois de responder (não atrasa quem está usando o painel): apaga fotos que nada mais usa. */
function faxinaDeFotos(fotosQueSairam: string[] = []) {
  after(async () => {
    try {
      await apagarFotosDoTexto(fotosQueSairam);
      await apagarFotosSemUso();
    } catch (erro) {
      console.error("faxina de fotos", erro);
    }
  });
}

function idDoFormulario(formData: FormData) {
  return validar.idDocumento(validar.texto(formData, "id", 140));
}

/** Tira do site, mas guarda como rascunho (nada se perde). */
export async function despublicar(formData: FormData) {
  const usuario = await exigirAcesso();
  const tipo = tipoPublicacao(formData.get("tipo"));
  const id = idDoFormulario(formData);
  if (!tipo || !id) return;

  const atuais = await lerPainelComRascunhos<Record<string, unknown>[]>(`*[_type == $tipo && _id in [$id, "drafts." + $id]]`, { tipo, id });
  const publicado = atuais.find((d) => d._id === id);
  if (!publicado) return;
  const temRascunho = atuais.some((d) => d._id === `drafts.${id}`);

  // Copia o conteúdo sem os campos do sistema (_id, _rev, datas).
  const conteudo = Object.fromEntries(Object.entries(publicado).filter(([campo]) => !campo.startsWith("_")));
  const tx = sanityPainel().transaction();
  if (!temRascunho) tx.create({ ...conteudo, _id: `drafts.${id}`, _type: tipo, ...carimbo(usuario) });
  await tx.delete(id).commit();
  updateTag(tipo);
  redirect(`${TIPOS_PUBLICACAO[tipo].rota}/${id}?ok=despublicado`);
}

/** Joga fora o rascunho de algo já publicado: fica valendo o que está no site. */
export async function descartarRascunho(formData: FormData) {
  await exigirAcesso();
  const tipo = tipoPublicacao(formData.get("tipo"));
  const id = idDoFormulario(formData);
  if (!tipo || !id) return;

  const publicado = await lerPainel<string | null>(`*[_id == $id && _type == $tipo][0]._id`, { id, tipo });
  if (!publicado) return; // sem versão no site, o rascunho é tudo o que existe: não descarta
  const fotos = await fotosDoTexto(tipo, id);
  await sanityPainel().delete(`drafts.${id}`);
  faxinaDeFotos(fotos); // as que só estavam no rascunho descartado
  redirect(`${TIPOS_PUBLICACAO[tipo].rota}/${id}?ok=descartado`);
}

export async function excluirPublicacao(formData: FormData) {
  await exigirAcesso();
  const tipo = tipoPublicacao(formData.get("tipo"));
  const id = idDoFormulario(formData);
  if (!tipo || !id) return;

  const atuais = await lerPainelComRascunhos<{ _id: string }[]>(`*[_type == $tipo && _id in [$id, "drafts." + $id]]{_id}`, { tipo, id });
  if (atuais.length > 0) {
    const fotos = await fotosDoTexto(tipo, id);
    const tx = sanityPainel().transaction();
    for (const d of atuais) tx.delete(d._id);
    await tx.commit();
    updateTag(tipo);
    faxinaDeFotos(fotos); // as fotos do texto apagado saem junto, se nada mais as usa
  }
  redirect(`${TIPOS_PUBLICACAO[tipo].rota}?ok=excluido`);
}
