import type { HorarioPadrao, ItemProgramacao, Semana } from "@/sanity/lib/queries";
import { codigoDia, somarDias } from "./datas";

export type DiaProgramacao = {
  data: string;
  itens: ItemProgramacao[];
  destaque?: NonNullable<Semana["destaques"]>[number];
  /** "semana" = editado pelo administrador; "padrao" = gerado dos horários padrão. */
  origem: "semana" | "padrao";
};

/**
 * Monta `quantos` dias a partir de `inicio`. Cada dia vem da programação semanal que o cobre;
 * se não houver, vem dos horários padrão. Assim o site nunca fica sem horários.
 */
export function montarProgramacao(
  inicio: string,
  quantos: number,
  padroes: HorarioPadrao[],
  semanas: Semana[],
): DiaProgramacao[] {
  const dias: DiaProgramacao[] = [];

  for (let i = 0; i < quantos; i++) {
    const data = somarDias(inicio, i);
    const semana = semanas.findLast((s) => s.inicio <= data && data <= somarDias(s.inicio, 6));

    if (semana) {
      dias.push({
        data,
        origem: "semana",
        destaque: semana.destaques?.find((d) => d.data === data),
        itens: (semana.itens ?? []).filter((item) => item.data === data).sort(porHora),
      });
    } else {
      const codigo = codigoDia(data);
      dias.push({
        data,
        origem: "padrao",
        itens: padroes
          .filter((p) => p.dias.includes(codigo))
          .map((p) => ({ hora: p.hora, tipo: p.tipo, titulo: p.titulo, nota: p.nota, local: p.local, data }))
          .sort(porHora),
      });
    }
  }

  return dias;
}

function porHora(a: { hora: string }, b: { hora: string }) {
  return a.hora.localeCompare(b.hora);
}

export function ehMissa(item: ItemProgramacao) {
  return item.tipo.startsWith("missa");
}

/** Primeira Missa não cancelada a partir de agora. */
export function proximaMissa(dias: DiaProgramacao[], agora: { data: string; hora: string }) {
  for (const dia of dias) {
    if (dia.data < agora.data) continue;
    const item = dia.itens.find(
      (i) => ehMissa(i) && !i.cancelado && (dia.data > agora.data || i.hora >= agora.hora),
    );
    if (item) return item;
  }
  return undefined;
}
