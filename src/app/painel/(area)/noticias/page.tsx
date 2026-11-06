import { ListaPublicacoes } from "@/components/painel/PaginasPublicacao";

export const metadata = { title: "Notícias" };

export default async function Pagina({ searchParams }: PageProps<"/painel/noticias">) {
  const { ok } = await searchParams;
  return <ListaPublicacoes tipo="noticia" ok={ok} />;
}
