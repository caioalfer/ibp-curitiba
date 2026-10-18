import type { Metadata } from "next";
import { ListaArtigos } from "@/components/Publicacoes";
import { Envoltorio, TituloPagina } from "@/components/Titulo";
import { getArtigos } from "@/lib/conteudo";

export const metadata: Metadata = { title: "Artigos" };

export default async function Artigos() {
  const artigos = await getArtigos();
  return (
    <Envoltorio className="pt-16 pb-28 md:pt-24">
      <TituloPagina sub="Ensaios sobre a fé, a liturgia e a vida do espírito.">
        Palavra do <em>padre</em>
      </TituloPagina>
      {artigos.length ? (
        <ListaArtigos itens={artigos} />
      ) : (
        <p className="border-t border-linha pt-6 text-lg text-suave">Nenhum artigo publicado ainda.</p>
      )}
    </Envoltorio>
  );
}
