import type { Metadata } from "next";
import { ListaAvisos } from "@/components/ListaAvisos";
import { Envoltorio, TituloPagina } from "@/components/Titulo";
import { getAvisos } from "@/lib/conteudo";

export const metadata: Metadata = { title: "Avisos" };

export default async function Avisos() {
  const avisos = await getAvisos();
  return (
    <Envoltorio className="pt-16 pb-28 md:pt-24">
      <TituloPagina sub="Cada aviso sai do ar sozinho depois da data indicada.">
        Avisos
      </TituloPagina>
      {avisos.length ? (
        <ListaAvisos avisos={avisos} />
      ) : (
        <p className="border-t border-linha pt-6 text-lg text-suave">Nenhum aviso no momento.</p>
      )}
    </Envoltorio>
  );
}
