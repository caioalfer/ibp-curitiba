import { NovaPublicacao } from "@/components/painel/PaginasPublicacao";

export const metadata = { title: "Nova notícia" };

export default function Pagina() {
  return <NovaPublicacao tipo="noticia" />;
}
