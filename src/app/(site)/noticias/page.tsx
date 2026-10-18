import type { Metadata } from "next";
import { ListaPublicacoes } from "@/components/Publicacoes";
import { Envoltorio, TituloPagina } from "@/components/Titulo";
import { getNoticias } from "@/lib/conteudo";

export const metadata: Metadata = { title: "Notícias" };

export default async function Noticias() {
  const noticias = await getNoticias();
  return (
    <Envoltorio className="pt-16 pb-28 md:pt-24">
      <TituloPagina sub="Festas, procissões e a vida do apostolado em Curitiba.">
        Notícias
      </TituloPagina>
      {noticias.length ? (
        <ListaPublicacoes itens={noticias} base="/noticias" />
      ) : (
        <p className="border-t border-linha pt-6 text-lg text-suave">Nenhuma notícia publicada ainda.</p>
      )}
    </Envoltorio>
  );
}
