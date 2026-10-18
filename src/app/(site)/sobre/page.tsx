import type { Metadata } from "next";
import Image from "next/image";
import { TextoRico } from "@/components/TextoRico";
import { Envoltorio, TituloPagina } from "@/components/Titulo";
import { getSobre } from "@/lib/conteudo";
import { urlImagem } from "@/sanity/lib/image";
import type { Pessoa } from "@/sanity/lib/queries";

export const metadata: Metadata = { title: "Sobre" };

const TITULO_SECAO = "text-[clamp(2.25rem,5vw,3.5rem)] leading-none font-light tracking-[-0.035em]";

export default async function Sobre() {
  const sobre = await getSobre();

  return (
    <Envoltorio className="pt-16 pb-28 md:pt-24">
      <TituloPagina sub="Sociedade de vida apostólica de direito pontifício, fundada em Roma em 2006.">
        Instituto <em>Bom Pastor</em>
      </TituloPagina>

      <div className="space-y-28 md:space-y-36">
        {sobre.historia && (
          <section aria-labelledby="titulo-historia" className="grid gap-10 lg:grid-cols-[1fr_minmax(0,40rem)] lg:gap-16">
            <h2 id="titulo-historia" className={TITULO_SECAO}>
              A história
            </h2>
            <TextoRico valor={sobre.historia} />
          </section>
        )}

        {sobre.superiorGeral && <SecaoPessoa id="superior-geral" titulo="O Superior Geral" pessoa={sobre.superiorGeral} />}

        {sobre.prior && <SecaoPessoa id="prior" titulo="O Prior de Curitiba" pessoa={sobre.prior} />}
      </div>
    </Envoltorio>
  );
}

/** Seção dedicada a um padre: retrato em pé à esquerda; nome, cargo e biografia à direita. */
function SecaoPessoa({ id, titulo, pessoa: p }: { id: string; titulo: string; pessoa: Pessoa }) {
  const temFoto = p.foto || p.fotoLocal;
  return (
    <section id={id} aria-labelledby={`titulo-${id}`} className="scroll-mt-28 border-t border-linha pt-16">
      <h2 id={`titulo-${id}`} className={`${TITULO_SECAO} mb-12`}>
        {titulo}
      </h2>
      <div className={`grid items-start gap-10 lg:gap-16 ${temFoto ? "md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]" : ""}`}>
        {temFoto && (
          <div className="relative aspect-[4/5] overflow-hidden rounded-[10px] bg-placa">
            <Image
              src={p.foto ? urlImagem(p.foto).width(800).height(1000).fit("crop").url() : p.fotoLocal!}
              alt={p.nome}
              fill
              sizes="(max-width: 768px) 100vw, 352px"
              className="object-cover"
              style={{ objectPosition: p.fotoFoco ?? "50% 30%" }}
            />
          </div>
        )}
        <div className="max-w-[40rem]">
          <p className="text-[clamp(2rem,4vw,2.75rem)] leading-tight font-light tracking-[-0.03em]">{p.nome}</p>
          {p.cargo && <p className="mt-3 text-lg text-suave">{p.cargo}</p>}
          {p.bio && (
            <div className="mt-8 border-t border-linha pt-8">
              <TextoRico valor={p.bio} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
