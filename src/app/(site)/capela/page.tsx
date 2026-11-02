import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ComoDoar } from "@/components/ComoDoar";
import { ImagemCapela } from "@/components/ImagemCapela";
import { TextoRico } from "@/components/TextoRico";
import { Envoltorio, TituloPagina } from "@/components/Titulo";
import { getCapela } from "@/lib/conteudo";
import { DOACAO_CAPELA } from "@/lib/doacao";
import { urlImagem } from "@/sanity/lib/image";

export async function generateMetadata(): Promise<Metadata> {
  const capela = await getCapela();
  return { title: capela.titulo || "Construção da capela", description: capela.resumo };
}

/** Página da campanha: o projeto (texto e fotos) e, ao lado, como doar (QR code, Pix e transferência). */
export default async function Capela() {
  const capela = await getCapela();
  if (!capela.ativa) notFound();

  return (
    <Envoltorio className="pt-16 pb-28 md:pt-24">
      <TituloPagina sub={capela.resumo}>
        Construção da <em>capela</em>
      </TituloPagina>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,40rem)_minmax(0,24rem)] lg:justify-between lg:gap-16">
        <section aria-labelledby="titulo-projeto">
          <ImagemCapela capela={capela} prioridade />
          <h2 id="titulo-projeto" className="mb-8 text-[clamp(2rem,4vw,2.75rem)] leading-tight font-light tracking-[-0.03em]">
            O projeto
          </h2>
          <TextoRico valor={capela.texto} />
        </section>

        <aside aria-labelledby="titulo-doar" className="h-fit rounded-[10px] bg-placa p-7 md:p-9 lg:sticky lg:top-28">
          <h2 id="titulo-doar" className="mb-6 text-[1.75rem] leading-tight font-light tracking-[-0.025em]">
            Como doar
          </h2>
          <ComoDoar dados={DOACAO_CAPELA} />
        </aside>
      </div>

      {capela.galeria?.length ? (
        <section aria-labelledby="titulo-galeria" className="mt-28 border-t border-linha pt-16">
          <h2 id="titulo-galeria" className="mb-10 text-[clamp(2rem,4vw,2.75rem)] leading-tight font-light tracking-[-0.03em]">
            A obra
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capela.galeria.map((foto, i) => (
              <li key={i} className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-placa">
                <Image
                  src={urlImagem(foto).width(900).height(675).fit("crop").url()}
                  alt={foto.alt ?? ""}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </Envoltorio>
  );
}
