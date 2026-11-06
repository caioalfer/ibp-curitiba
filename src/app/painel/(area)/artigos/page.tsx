import { ListaPublicacoes } from "@/components/painel/PaginasPublicacao";

export const metadata = { title: "Artigos" };

export default async function Pagina({ searchParams }: PageProps<"/painel/artigos">) {
  const { ok } = await searchParams;
  return <ListaPublicacoes tipo="artigo" ok={ok} />;
}
