import { EditarPublicacao } from "@/components/painel/PaginasPublicacao";

export const metadata = { title: "Editar notícia" };

export default async function Pagina({ params, searchParams }: PageProps<"/painel/noticias/[id]">) {
  const [{ id }, { ok }] = await Promise.all([params, searchParams]);
  return <EditarPublicacao tipo="noticia" idBruto={id} ok={ok} />;
}
