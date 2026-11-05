import "server-only";
import { codigoDia, somarDias } from "@/lib/datas";
import { novaChave } from "./sanity";

export type PadraoBruto = {
  dias?: string[];
  hora?: string;
  tipo?: string;
  titulo?: string;
  nota?: string;
  local?: { _ref: string } | null;
};

export type ItemSemana = {
  _key: string;
  data: string;
  hora: string;
  tipo: string;
  titulo?: string;
  nota?: string;
  cancelado?: boolean;
  local?: string;
};

export type DestaqueSemana = { _key: string; data: string; texto: string; cor?: string };

export type SemanaPainel = {
  _id: string;
  inicio: string;
  atualizadoPor?: string;
  atualizadoEm?: string;
  itens?: ItemSemana[];
  destaques?: DestaqueSemana[];
};

export const QUERY_SEMANA_PAINEL = `*[_type == "semana" && inicio == $inicio] | order(_updatedAt desc)[0]{
  _id, inicio, atualizadoPor, atualizadoEm,
  destaques[]{_key, data, texto, cor},
  itens[]{_key, data, hora, tipo, titulo, nota, cancelado, "local": local._ref}
}`;

export const QUERY_PADROES_PAINEL = `*[_type == "horarioPadrao"] | order(hora asc){dias, hora, tipo, titulo, nota, local}`;

/** Os 7 dias da semana (segunda a domingo) preenchidos com os horários padrão, no formato do Sanity. */
export function itensDosPadroes(inicio: string, padroes: PadraoBruto[]) {
  const itens = [];
  for (let i = 0; i < 7; i++) {
    const data = somarDias(inicio, i);
    for (const p of padroes.filter((x) => x.hora && x.tipo && x.dias?.includes(codigoDia(data)))) {
      itens.push({
        _key: novaChave(),
        _type: "itemProgramacao",
        data,
        hora: p.hora!,
        tipo: p.tipo!,
        ...(p.titulo ? { titulo: p.titulo } : {}),
        ...(p.nota ? { nota: p.nota } : {}),
        ...(p.local?._ref ? { local: { _type: "reference", _ref: p.local._ref } } : {}),
      });
    }
  }
  return itens.sort((a, b) => `${a.data} ${a.hora}`.localeCompare(`${b.data} ${b.hora}`));
}
