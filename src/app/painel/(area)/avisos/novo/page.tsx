import { FormAviso } from "@/components/painel/FormAviso";
import { Voltar } from "@/components/painel/Voltar";
import { agoraEmCuritiba, somarDias } from "@/lib/datas";
import { exigirAcesso } from "@/lib/painel/sessao";

export const metadata = { title: "Novo aviso" };

export default async function NovoAviso() {
  await exigirAcesso();
  const hoje = agoraEmCuritiba().data;
  return (
    <>
      <Voltar href="/painel/avisos">Avisos</Voltar>
      <h1 className="mt-4 mb-12 text-[clamp(2.5rem,6vw,4rem)] leading-none font-light tracking-[-0.04em]">Novo aviso</h1>
      <FormAviso hoje={hoje} sugestaoValidade={somarDias(hoje, 7)} />
    </>
  );
}
