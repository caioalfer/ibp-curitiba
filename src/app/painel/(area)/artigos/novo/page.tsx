import { NovaPublicacao } from "@/components/painel/PaginasPublicacao";

export const metadata = { title: "Novo artigo" };

export default function Pagina() {
  return <NovaPublicacao tipo="artigo" />;
}
