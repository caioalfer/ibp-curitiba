"use client";

import { formatarHora, nomeDia, somarDias } from "@/lib/datas";
import { proximaMissa, type DiaProgramacao } from "@/lib/programacao";
import { rotuloTipo } from "@/sanity/lib/constantes";
import { urlMapa } from "./LinkMapa";
import { useAgora } from "./useAgora";

/** A frase-lâmpada da home: "A próxima Missa é hoje, às 19h30." */
export function ProximaMissa({ dias, agoraServidor }: { dias: DiaProgramacao[]; agoraServidor: { data: string; hora: string } }) {
  const agora = useAgora(agoraServidor);
  const missa = proximaMissa(
    dias.filter((d) => d.data >= agora.data),
    agora,
  );

  if (!missa) {
    return (
      <p className="display text-[clamp(2.5rem,7vw,5.5rem)] leading-none font-light tracking-[-0.04em]">
        Confira os <em>horários</em>.
      </p>
    );
  }

  const quando =
    missa.data === agora.data
      ? "hoje"
      : missa.data === somarDias(agora.data, 1)
        ? "amanhã"
        : nomeDia(missa.data).toLowerCase();

  return (
    <div className="flex flex-col items-start">
      <p className="display text-[clamp(2.75rem,8vw,6rem)] leading-[0.95] font-light tracking-[-0.04em]">
        <span className="block text-tinta/75">A próxima Missa é</span>
        <span className="block text-tinta">
          <em>{quando}</em>, às {formatarHora(missa.hora)}
        </span>
      </p>
      <span aria-hidden="true" className="acender mt-8 block h-0.5 w-16 bg-marca" />
      <p className="mt-5 max-w-xl text-lg text-tinta/75">
        {missa.titulo || rotuloTipo(missa.tipo)}
        {" · "}
        {missa.local ? (
          <a href={urlMapa(missa.local)} target="_blank" rel="noopener noreferrer" className="link-sutil text-tinta">
            {missa.local.nome}
          </a>
        ) : (
          <a href="/horarios#locais" className="link-sutil text-tinta">
            Local a confirmar, ver endereços
          </a>
        )}
      </p>
      <a href="#semana" className="pill pill-contorno mt-8">
        Ver a semana
      </a>
    </div>
  );
}
