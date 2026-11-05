import type { Metadata } from "next";
import { ListaArquivo, ListaArtigos } from "@/components/Publicacoes";
import { BuscaPublicacoes } from "@/components/BuscaPublicacoes";
import { Envoltorio, TituloPagina } from "@/components/Titulo";
import { getArquivo, getArtigos } from "@/lib/conteudo";

export const metadata: Metadata = { title: "Artigos" };

/** Os mais recentes aparecem com imagem; todos os anteriores ficam no arquivo, por ano. A busca cobre todos. */
const RECENTES = 10;

export default async function Artigos() {
  const [artigos, todos] = await Promise.all([getArtigos(RECENTES), getArquivo("artigo", 0)]);
  return (
    <Envoltorio className="pt-16 pb-28 md:pt-24">
      <TituloPagina sub="Ensaios sobre a fé, a liturgia e a vida do espírito.">
        Palavra do <em>padre</em>
      </TituloPagina>
      <BuscaPublicacoes itens={todos} base="/artigos">
        {artigos.length ? (
          <ListaArtigos itens={artigos} />
        ) : (
          <p className="border-t border-linha pt-6 text-lg text-suave">Nenhum artigo publicado ainda.</p>
        )}
        <ListaArquivo itens={todos.slice(RECENTES)} base="/artigos" />
      </BuscaPublicacoes>
    </Envoltorio>
  );
}
