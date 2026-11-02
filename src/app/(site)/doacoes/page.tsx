import type { Metadata } from "next";
import Link from "next/link";
import { ComoDoar } from "@/components/ComoDoar";
import { Envoltorio, TituloPagina } from "@/components/Titulo";
import { DOACAO_CAPELA, DOACAO_CASA } from "@/lib/doacao";

export const metadata: Metadata = {
  title: "Doações",
  description: "Doe pelo Pix para o Projeto Capela da Imaculada Conceição ou para a manutenção básica da casa.",
};

/** Os dois destinos de doação, cada um com o seu Pix: o projeto da capela e a manutenção da casa. */
export default function Doacoes() {
  return (
    <Envoltorio className="pt-16 pb-28 md:pt-24">
      <TituloPagina sub="Escolha o destino da sua doação. Cada um tem o seu próprio Pix.">Doações</TituloPagina>

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <section aria-labelledby="titulo-doacao-capela" className="rounded-[10px] bg-placa p-7 md:p-9">
          <h2 id="titulo-doacao-capela" className="text-[1.75rem] leading-tight font-light tracking-[-0.025em]">
            {DOACAO_CAPELA.finalidade}
          </h2>
          <p className="mt-3 mb-8 text-suave">
            Para a construção da capela.{" "}
            <Link href="/capela" className="link-sutil text-tinta">
              Conheça o projeto
            </Link>
          </p>
          <ComoDoar dados={DOACAO_CAPELA} />
        </section>

        <section aria-labelledby="titulo-doacao-casa" className="rounded-[10px] bg-placa p-7 md:p-9">
          <h2 id="titulo-doacao-casa" className="text-[1.75rem] leading-tight font-light tracking-[-0.025em]">
            {DOACAO_CASA.finalidade}
          </h2>
          <p className="mt-3 mb-8 text-suave">Para as despesas básicas da casa.</p>
          <ComoDoar dados={DOACAO_CASA} />
        </section>
      </div>
    </Envoltorio>
  );
}
