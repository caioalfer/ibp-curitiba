import { notFound } from "next/navigation";
import { FormAviso } from "@/components/painel/FormAviso";
import { Voltar } from "@/components/painel/Voltar";
import { agoraEmCuritiba, somarDias } from "@/lib/datas";
import { lerPainel } from "@/lib/painel/sanity";
import { exigirAcesso } from "@/lib/painel/sessao";
import { idDocumento } from "@/lib/painel/validar";

export const metadata = { title: "Editar aviso" };

export default async function EditarAviso({ params }: PageProps<"/painel/avisos/[id]">) {
  await exigirAcesso();
  const id = idDocumento((await params).id);
  if (!id) notFound();

  const aviso = await lerPainel<{ _id: string; texto: string; validoAte: string; link?: string } | null>(
    `*[_id == $id && _type == "aviso"][0]{_id, texto, validoAte, link}`,
    { id },
  );
  if (!aviso) notFound();

  const hoje = agoraEmCuritiba().data;
  return (
    <>
      <Voltar href="/painel/avisos">Avisos</Voltar>
      <h1 className="mt-4 mb-12 text-[clamp(2.5rem,6vw,4rem)] leading-none font-light tracking-[-0.04em]">Editar aviso</h1>
      <FormAviso aviso={aviso} hoje={hoje} sugestaoValidade={somarDias(hoje, 7)} />
    </>
  );
}
