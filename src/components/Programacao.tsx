"use client";

import { diaMes, formatarHora, nomeDia, somarDias } from "@/lib/datas";
import { ehMissa, proximaMissa, type DiaProgramacao } from "@/lib/programacao";
import { CORES_LITURGICAS, rotuloTipo } from "@/sanity/lib/constantes";
import type { ItemProgramacao } from "@/sanity/lib/queries";
import { useAgora } from "./useAgora";

type Agora = { data: string; hora: string };
type Estado = "proxima" | "adiante" | "passou" | "cancelado";

function estadoDe(item: ItemProgramacao, data: string, agora: Agora, proxima?: ItemProgramacao): Estado {
  if (item.cancelado) return "cancelado";
  if (proxima && item === proxima) return "proxima";
  if (data < agora.data || (data === agora.data && item.hora < agora.hora)) return "passou";
  return "adiante";
}

/**
 * A semana como uma coluna de marcas: a próxima Missa em faixa preta, o que já passou apagado,
 * o cancelado riscado. O estado é dado pela forma da linha, nunca pela cor.
 */
export function Programacao({ dias, agoraServidor }: { dias: DiaProgramacao[]; agoraServidor: Agora }) {
  const agora = useAgora(agoraServidor);
  const semana = dias.filter((d) => d.data >= agora.data).slice(0, 7);
  const proxima = proximaMissa(semana, agora);

  const semLocal = semana.some((d) => d.itens.some((i) => !i.local));

  return (
    <>
    {semLocal && (
      <p className="mb-6 text-suave">
        O local de cada horário ainda será confirmado.{" "}
        <a href="/horarios#locais" className="link-sutil text-tinta">
          Ver os endereços
        </a>
      </p>
    )}
    <ol className="border-t border-linha">
      {semana.map((dia) => {
        const ehHoje = dia.data === agora.data;
        const cor = CORES_LITURGICAS.find((c) => c.value === dia.destaque?.cor)?.title;
        return (
          <li key={dia.data} className="grid gap-x-10 gap-y-4 border-b border-linha py-7 md:grid-cols-[14rem_1fr]">
            <div className="flex items-baseline gap-3 md:block">
              {ehHoje ? (
                <p className="-ml-2.5 inline-flex rounded-full bg-marca px-2.5 text-[1.75rem] leading-tight font-light tracking-[-0.025em] text-marca-texto">
                  Hoje
                </p>
              ) : (
                <p className="text-[1.75rem] leading-tight font-light tracking-[-0.025em]">
                  {dia.data === somarDias(agora.data, 1) ? "Amanhã" : nomeDia(dia.data)}
                </p>
              )}
              <p className="text-[0.9375rem] text-suave md:mt-2">
                {ehHoje || dia.data === somarDias(agora.data, 1) ? `${nomeDia(dia.data)} · ` : ""}
                {diaMes(dia.data)}
              </p>
            </div>

            <div>
              {dia.destaque && (
                <p className="mb-4 text-suave">
                  {cor && <span className="rotulo mr-3 text-tinta">{cor}</span>}
                  {dia.destaque.texto}
                </p>
              )}
              {dia.itens.length === 0 ? (
                <p className="text-suave">Sem atividades.</p>
              ) : (
                <ul className="space-y-1">
                  {dia.itens.map((item, i) => (
                    <LinhaItem key={i} item={item} estado={estadoDe(item, dia.data, agora, proxima)} />
                  ))}
                </ul>
              )}
            </div>
          </li>
        );
      })}
    </ol>
    </>
  );
}

const PAVIO: Record<Estado, string> = {
  proxima: "w-8 h-0.5 bg-marca-texto acender",
  adiante: "w-8 h-px bg-tinta",
  passou: "w-4 h-px bg-linha",
  cancelado: "w-8 h-px border-t border-dashed border-apagado",
};

const TEXTO: Record<Estado, string> = {
  proxima: "bg-marca text-marca-texto",
  adiante: "text-tinta",
  passou: "text-apagado",
  cancelado: "text-apagado",
};

function LinhaItem({ item, estado }: { item: ItemProgramacao; estado: Estado }) {
  const nome = item.titulo || rotuloTipo(item.tipo);
  return (
    <li className={`grid grid-cols-[2rem_4.25rem_1fr] items-baseline gap-x-3 rounded-[10px] px-3 py-2 ${TEXTO[estado]}`}>
      <span aria-hidden="true" className="relative top-[-0.3em] flex items-center">
        <span className={`block ${PAVIO[estado]}`} />
      </span>
      <span className={`tabular-nums ${estado === "cancelado" ? "line-through" : ""}`}>{formatarHora(item.hora)}</span>
      <span className="flex flex-wrap items-baseline gap-x-3">
        <span className={`${ehMissa(item) ? "font-medium" : ""} ${estado === "cancelado" ? "line-through" : ""}`}>
          {nome}
        </span>
        {estado === "proxima" && <span className="rotulo">Próxima</span>}
        {estado === "cancelado" && <span className="rotulo">Cancelado</span>}
        {item.local && (
          <span className={`rotulo ${estado === "proxima" ? "text-marca-texto/70" : "text-suave"}`}>
            {item.local.apelido || item.local.nome}
          </span>
        )}
        {item.nota && <span className={`basis-full ${estado === "proxima" ? "text-marca-texto/70" : "text-suave"}`}>{item.nota}</span>}
      </span>
    </li>
  );
}
