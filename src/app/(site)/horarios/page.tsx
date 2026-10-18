import type { Metadata } from "next";
import { urlMapa } from "@/components/LinkMapa";
import { Envoltorio, TituloPagina, TituloSecao } from "@/components/Titulo";
import { getHorariosPadrao, getLocais } from "@/lib/conteudo";
import { formatarHora } from "@/lib/datas";
import { DIAS, rotuloTipo } from "@/sanity/lib/constantes";

export const metadata: Metadata = { title: "Horários" };

// Segunda a domingo, como no post de horários.
const ORDEM = [...DIAS.slice(1), DIAS[0]];

export default async function Horarios() {
  const [padroes, locais] = await Promise.all([getHorariosPadrao(), getLocais()]);

  return (
    <Envoltorio className="pt-16 pb-28 md:pt-24">
      <TituloPagina sub="A regra de cada semana. Festas e mudanças aparecem na programação da página inicial.">
        Horários <em>habituais</em>
      </TituloPagina>

      <ol className="border-t border-linha">
        {ORDEM.map((dia) => {
          const itens = padroes.filter((p) => p.dias.includes(dia.value));
          return (
            <li key={dia.value} className="grid gap-x-10 gap-y-4 border-b border-linha py-7 md:grid-cols-[14rem_1fr]">
              <p className="text-[1.75rem] leading-tight font-light tracking-[-0.025em]">{dia.title}</p>
              {itens.length === 0 ? (
                <p className="text-suave">Sem atividades.</p>
              ) : (
                <ul className="space-y-1">
                  {itens.map((p, i) => (
                    <li key={i} className="grid grid-cols-[4.25rem_1fr] items-baseline gap-x-3 py-1.5">
                      <span className="tabular-nums">{formatarHora(p.hora)}</span>
                      <span className="flex flex-wrap items-baseline gap-x-3">
                        <span className={p.tipo.startsWith("missa") ? "font-medium" : ""}>
                          {p.titulo || rotuloTipo(p.tipo)}
                        </span>
                        {p.local && <span className="rotulo text-suave">{p.local.apelido || p.local.nome}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>

      <section id="locais" className="mt-28 scroll-mt-28 md:mt-36" aria-labelledby="titulo-locais">
        <TituloSecao id="titulo-locais">
          Onde estamos
        </TituloSecao>
        <ul className="grid gap-4 md:grid-cols-2">
          {locais.map((l) => (
            <li key={l._id} className="flex flex-col gap-8 rounded-[10px] bg-placa p-7 md:p-9">
              <div>
                <p className="text-[1.875rem] leading-tight font-light tracking-[-0.025em]">{l.nome}</p>
                <p className="mt-2 text-suave">{l.endereco}</p>
              </div>
              <a href={urlMapa(l)} target="_blank" rel="noopener noreferrer" className="pill pill-contorno self-start">
                Como chegar
              </a>
            </li>
          ))}
        </ul>
      </section>
    </Envoltorio>
  );
}
