"use server";

import { revalidatePath, updateTag } from "next/cache";
import { agoraEmCuritiba, codigoDia, segundaDaSemana, somarDias } from "@/lib/datas";
import { carimbo, lerPainel, novaChave, sanityPainel } from "@/lib/painel/sanity";
import { itensDosPadroes, QUERY_PADROES_PAINEL, type PadraoBruto } from "@/lib/painel/semana";
import { exigirAcesso, type Usuario } from "@/lib/painel/sessao";
import * as validar from "@/lib/painel/validar";

// Cada ação confere o acesso, valida tudo o que veio do navegador e confirma que o documento
// é mesmo uma programação semanal antes de gravar. Depois, atualiza o site na hora (updateTag).

type SemanaGravada = {
  _id: string;
  inicio: string;
  itens: { _key: string; data: string; cancelado?: boolean; temLocal: boolean }[];
  destaques: { _key: string; data: string }[];
};

async function semanaDoFormulario(formData: FormData): Promise<SemanaGravada | null> {
  const id = validar.idDocumento(validar.texto(formData, "semanaId", 140));
  if (!id) return null;
  return lerPainel<SemanaGravada | null>(
    `*[_id == $id && _type == "semana"][0]{_id, inicio, "itens": coalesce(itens[]{_key, data, cancelado, "temLocal": defined(local)}, []), "destaques": coalesce(destaques[]{_key, data}, [])}`,
    { id },
  );
}

async function localValido(id: string) {
  const ok = validar.idDocumento(id);
  return ok ? Boolean(await lerPainel<string | null>(`*[_id == $id && _type == "local"][0]._id`, { id: ok })) : false;
}

function concluir() {
  updateTag("semana");
  revalidatePath("/painel/semana");
}

async function gravar(usuario: Usuario, id: string, aplicar: (patch: ReturnType<ReturnType<typeof sanityPainel>["patch"]>) => void) {
  const patch = sanityPainel().patch(id).set(carimbo(usuario));
  aplicar(patch);
  await patch.commit();
  concluir();
}

/** Cria a programação da semana a partir dos horários padrão (só esta semana e as próximas 4). */
export async function comecarSemana(formData: FormData) {
  const usuario = await exigirAcesso();
  const inicio = validar.dataISO(validar.texto(formData, "inicio", 20));
  const segundaAtual = segundaDaSemana(agoraEmCuritiba().data);
  if (!inicio || codigoDia(inicio) !== "seg" || inicio < segundaAtual || inicio > somarDias(segundaAtual, 28)) return;

  const existente = await lerPainel<string | null>(`*[_type == "semana" && inicio == $inicio][0]._id`, { inicio });
  if (!existente) {
    const padroes = await lerPainel<PadraoBruto[]>(QUERY_PADROES_PAINEL);
    await sanityPainel().createIfNotExists({
      _id: `semana-${inicio}`,
      _type: "semana",
      inicio,
      itens: itensDosPadroes(inicio, padroes),
      destaques: [],
      ...carimbo(usuario),
    });
  }
  concluir();
}

export async function definirLocal(formData: FormData) {
  const usuario = await exigirAcesso();
  const semana = await semanaDoFormulario(formData);
  const chave = validar.chaveItem(validar.texto(formData, "chave", 40));
  const local = validar.texto(formData, "local", 140);
  if (!semana || !chave || !semana.itens.some((i) => i._key === chave)) return;
  if (local && !(await localValido(local))) return;

  await gravar(usuario, semana._id, (patch) => {
    if (local) patch.set({ [`itens[_key=="${chave}"].local`]: { _type: "reference", _ref: local } });
    else patch.unset([`itens[_key=="${chave}"].local`]);
  });
}

/** Atalho: marca o mesmo local em todos os horários que ainda estão sem local. */
export async function definirLocalDosSemLocal(formData: FormData) {
  const usuario = await exigirAcesso();
  const semana = await semanaDoFormulario(formData);
  const local = validar.texto(formData, "local", 140);
  if (!semana || !local || !(await localValido(local))) return;
  const chaves = semana.itens.filter((i) => !i.temLocal && !i.cancelado).map((i) => i._key);
  if (chaves.length === 0) return;

  await gravar(usuario, semana._id, (patch) =>
    patch.set(Object.fromEntries(chaves.map((k) => [`itens[_key=="${k}"].local`, { _type: "reference", _ref: local }]))),
  );
}

export async function alternarCancelado(formData: FormData) {
  const usuario = await exigirAcesso();
  const semana = await semanaDoFormulario(formData);
  const chave = validar.chaveItem(validar.texto(formData, "chave", 40));
  const item = semana?.itens.find((i) => i._key === chave);
  if (!semana || !chave || !item) return;

  await gravar(usuario, semana._id, (patch) => patch.set({ [`itens[_key=="${chave}"].cancelado`]: !item.cancelado }));
}

export async function removerItem(formData: FormData) {
  const usuario = await exigirAcesso();
  const semana = await semanaDoFormulario(formData);
  const chave = validar.chaveItem(validar.texto(formData, "chave", 40));
  if (!semana || !chave || !semana.itens.some((i) => i._key === chave)) return;

  await gravar(usuario, semana._id, (patch) => patch.unset([`itens[_key=="${chave}"]`]));
}

export type EstadoNovoItem = { erros?: Partial<Record<"data" | "hora" | "tipo" | "local" | "geral", string>>; ok?: number };

export async function adicionarItem(_anterior: EstadoNovoItem, formData: FormData): Promise<EstadoNovoItem> {
  const usuario = await exigirAcesso();
  const semana = await semanaDoFormulario(formData);
  if (!semana) return { erros: { geral: "Programação não encontrada. Recarregue a página." } };

  const data = validar.dataISO(validar.texto(formData, "data", 20));
  const hora = validar.hora(validar.texto(formData, "hora", 5));
  const tipo = validar.tipoAtividade(validar.texto(formData, "tipo", 40));
  const local = validar.texto(formData, "local", 140);
  const titulo = validar.texto(formData, "titulo", 80);
  const nota = validar.texto(formData, "nota", 120);

  const erros: EstadoNovoItem["erros"] = {};
  if (!data || data < semana.inicio || data > somarDias(semana.inicio, 6)) erros.data = "Escolha um dia desta semana.";
  if (!hora) erros.hora = "Informe a hora, ex.: 19:30.";
  if (!tipo) erros.tipo = "Escolha o tipo.";
  if (!local || !(await localValido(local))) erros.local = "Escolha onde vai ser.";
  if (Object.keys(erros).length > 0) return { erros };

  try {
    await gravar(usuario, semana._id, (patch) =>
      patch.setIfMissing({ itens: [] }).append("itens", [
        {
          _key: novaChave(),
          _type: "itemProgramacao",
          data,
          hora,
          tipo,
          local: { _type: "reference", _ref: local },
          ...(titulo ? { titulo } : {}),
          ...(nota ? { nota } : {}),
        },
      ]),
    );
  } catch (erro) {
    console.error("adicionarItem", erro);
    return { erros: { geral: "Não foi possível salvar agora. Tente de novo." } };
  }
  return { ok: Date.now() };
}

/** Destaque do dia (festa, observação). Texto vazio remove o destaque daquele dia. */
export async function salvarDestaque(formData: FormData) {
  const usuario = await exigirAcesso();
  const semana = await semanaDoFormulario(formData);
  const data = validar.dataISO(validar.texto(formData, "data", 20));
  if (!semana || !data || data < semana.inicio || data > somarDias(semana.inicio, 6)) return;

  const texto = formData.get("remover") ? "" : validar.texto(formData, "texto", 80);
  const cor = validar.corLiturgica(validar.texto(formData, "cor", 20));
  const existente = semana.destaques.find((d) => d.data === data);

  await gravar(usuario, semana._id, (patch) => {
    if (!texto) {
      if (existente) patch.unset([`destaques[_key=="${existente._key}"]`]);
      return;
    }
    if (existente) {
      patch.set({ [`destaques[_key=="${existente._key}"].texto`]: texto });
      if (cor) patch.set({ [`destaques[_key=="${existente._key}"].cor`]: cor });
      else patch.unset([`destaques[_key=="${existente._key}"].cor`]);
    } else {
      patch
        .setIfMissing({ destaques: [] })
        .append("destaques", [{ _key: novaChave(), _type: "destaqueDia", data, texto, ...(cor ? { cor } : {}) }]);
    }
  });
}
