import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PaginaPublicacao } from "@/components/Publicacoes";
import { getArtigo } from "@/lib/conteudo";

export async function generateMetadata({ params }: PageProps<"/artigos/[slug]">): Promise<Metadata> {
  const artigo = await getArtigo((await params).slug);
  return artigo ? { title: artigo.titulo, description: artigo.resumo } : {};
}

export default async function Artigo({ params }: PageProps<"/artigos/[slug]">) {
  const artigo = await getArtigo((await params).slug);
  if (!artigo) notFound();
  return <PaginaPublicacao p={artigo} voltar={{ href: "/artigos", rotulo: "Artigos" }} />;
}
