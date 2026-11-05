import type { Metadata } from "next";
import { ListaArquivo, ListaPublicacoes } from "@/components/Publicacoes";
import { BuscaPublicacoes } from "@/components/BuscaPublicacoes";
import { Envoltorio, TituloPagina } from "@/components/Titulo";
import { getArquivo, getNoticias } from "@/lib/conteudo";

export const metadata: Metadata = { title: "Notícias" };

/** Os mais recentes aparecem com imagem; todos os anteriores ficam no arquivo, por ano. A busca cobre todos. */
const RECENTES = 12;

export default async function Noticias() {
  const [noticias, todos] = await Promise.all([getNoticias(RECENTES), getArquivo("noticia", 0)]);
  return (
    <Envoltorio className="pt-16 pb-28 md:pt-24">
      <TituloPagina sub="Festas, procissões e a vida do apostolado em Curitiba.">
        Notícias
      </TituloPagina>
      <BuscaPublicacoes itens={todos} base="/noticias">
        {noticias.length ? (
          <ListaPublicacoes itens={noticias} base="/noticias" />
        ) : (
          <p className="border-t border-linha pt-6 text-lg text-suave">Nenhuma notícia publicada ainda.</p>
        )}
        <ListaArquivo itens={todos.slice(RECENTES)} base="/noticias" />
      </BuscaPublicacoes>
    </Envoltorio>
  );
}
