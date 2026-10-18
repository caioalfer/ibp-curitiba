import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PaginaPublicacao } from "@/components/Publicacoes";
import { getNoticia } from "@/lib/conteudo";

export async function generateMetadata({ params }: PageProps<"/noticias/[slug]">): Promise<Metadata> {
  const noticia = await getNoticia((await params).slug);
  return noticia ? { title: noticia.titulo, description: noticia.resumo } : {};
}

export default async function Noticia({ params }: PageProps<"/noticias/[slug]">) {
  const noticia = await getNoticia((await params).slug);
  if (!noticia) notFound();
  return <PaginaPublicacao p={noticia} voltar={{ href: "/noticias", rotulo: "Notícias" }} />;
}
