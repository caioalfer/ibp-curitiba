import { EditarPublicacao } from "@/components/painel/PaginasPublicacao";

export const metadata = { title: "Editar artigo" };

export default async function Pagina({ params, searchParams }: PageProps<"/painel/artigos/[id]">) {
  const [{ id }, { ok }] = await Promise.all([params, searchParams]);
  return <EditarPublicacao tipo="artigo" idBruto={id} ok={ok} />;
}
