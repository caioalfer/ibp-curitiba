"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { agoraEmCuritiba } from "@/lib/datas";
import { carimbo, lerPainel, sanityPainel } from "@/lib/painel/sanity";
import { exigirAcesso } from "@/lib/painel/sessao";
import * as validar from "@/lib/painel/validar";

export type EstadoAviso = { erros?: Partial<Record<"texto" | "validoAte" | "link" | "geral", string>> };

const MAX_TEXTO = 500;

/** Cria (sem id) ou edita (com id) um aviso. Toda checagem é refeita aqui, no servidor. */
export async function salvarAviso(_anterior: EstadoAviso, formData: FormData): Promise<EstadoAviso> {
  const usuario = await exigirAcesso();

  const idBruto = validar.texto(formData, "id", 140);
  const id = idBruto ? validar.idDocumento(idBruto) : null;
  if (idBruto && !id) return { erros: { geral: "Aviso inválido." } };

  const texto = validar.texto(formData, "texto", 5000);
  const validoAte = validar.dataISO(validar.texto(formData, "validoAte", 20));
  const link = validar.link(validar.texto(formData, "link", 500));

  const erros: EstadoAviso["erros"] = {};
  if (!texto) erros.texto = "Escreva o aviso.";
  else if (texto.length > MAX_TEXTO) erros.texto = `Use no máximo ${MAX_TEXTO} caracteres.`;
  if (!validoAte) erros.validoAte = "Escolha até quando o aviso fica no site.";
  else if (validoAte < agoraEmCuritiba().data) erros.validoAte = "Essa data já passou. Escolha hoje ou uma data futura.";
  if (!link.ok) erros.link = "Use um link que comece com https:// ou um endereço do site, como /capela.";
  if (Object.keys(erros).length > 0) return { erros };

  const dados = { texto, validoAte: validoAte!, ...carimbo(usuario) };
  const valorLink = link.ok ? link.valor : undefined;

  try {
    const cliente = sanityPainel();
    if (id) {
      const existe = await lerPainel<string | null>(`*[_id == $id && _type == "aviso"][0]._id`, { id });
      if (!existe) return { erros: { geral: "Este aviso não existe mais. Volte à lista." } };
      const patch = cliente.patch(id).set(dados);
      await (valorLink ? patch.set({ link: valorLink }) : patch.unset(["link"])).commit();
    } else {
      await cliente.create({
        _id: `aviso-${crypto.randomUUID()}`,
        _type: "aviso",
        ...dados,
        ...(valorLink ? { link: valorLink } : {}),
      });
    }
  } catch (erro) {
    console.error("salvarAviso", erro);
    return { erros: { geral: "Não foi possível salvar agora. Tente de novo em instantes." } };
  }

  updateTag("aviso");
  redirect(`/painel/avisos?ok=${id ? "editado" : "criado"}`);
}

export async function excluirAviso(formData: FormData) {
  await exigirAcesso();
  const id = validar.idDocumento(validar.texto(formData, "id", 140));
  if (!id) redirect("/painel/avisos");

  const existe = await lerPainel<string | null>(`*[_id == $id && _type == "aviso"][0]._id`, { id });
  if (existe) {
    await sanityPainel().delete(id);
    updateTag("aviso");
  }
  redirect("/painel/avisos?ok=excluido");
}
