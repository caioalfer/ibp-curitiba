import Link from "next/link";
import { BotaoConfirmar } from "@/components/painel/Botoes";
import { quandoAlterado, Voltar } from "@/components/painel/Voltar";
import { agoraEmCuritiba, diaMes } from "@/lib/datas";
import { lerPainel } from "@/lib/painel/sanity";
import { exigirAcesso } from "@/lib/painel/sessao";
import { excluirAviso } from "./acoes";

export const metadata = { title: "Avisos" };

type AvisoPainel = { _id: string; texto: string; validoAte: string; link?: string; atualizadoPor?: string; atualizadoEm?: string };

const MENSAGENS: Record<string, string> = {
  criado: "Aviso publicado. Ele já aparece no site.",
  editado: "Alterações salvas.",
  excluido: "Aviso excluído.",
};

export default async function AvisosDoPainel({ searchParams }: PageProps<"/painel/avisos">) {
  await exigirAcesso();
  const { ok } = await searchParams;
  const hoje = agoraEmCuritiba().data;
  const avisos = await lerPainel<AvisoPainel[]>(
    `*[_type == "aviso"] | order(validoAte desc){_id, texto, validoAte, link, atualizadoPor, atualizadoEm}`,
  );
  const noAr = avisos.filter((a) => a.validoAte >= hoje).reverse();
  const encerrados = avisos.filter((a) => a.validoAte < hoje).slice(0, 20);
  const mensagem = typeof ok === "string" ? MENSAGENS[ok] : undefined;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Voltar href="/painel">Painel</Voltar>
          <h1 className="mt-4 text-[clamp(2.5rem,6vw,4rem)] leading-none font-light tracking-[-0.04em]">Avisos</h1>
        </div>
        <Link href="/painel/avisos/novo" className="pill pill-primaria">
          Novo aviso
        </Link>
      </div>

      {mensagem && (
        <p role="status" className="mt-8 rounded-[10px] bg-placa p-4">
          {mensagem}
        </p>
      )}

      <Secao titulo="No site agora" vazio="Nenhum aviso no site no momento." avisos={noAr} hoje={hoje} />
      {encerrados.length > 0 && (
        <Secao titulo="Já saíram do site" vazio="" avisos={encerrados} hoje={hoje} encerrados />
      )}
    </>
  );
}

function Secao({
  titulo,
  vazio,
  avisos,
  hoje,
  encerrados = false,
}: {
  titulo: string;
  vazio: string;
  avisos: AvisoPainel[];
  hoje: string;
  encerrados?: boolean;
}) {
  return (
    <section className="mt-14">
      <h2 className="text-[1.75rem] leading-tight font-light tracking-[-0.025em]">{titulo}</h2>
      {avisos.length === 0 ? (
        <p className="mt-4 text-suave">{vazio}</p>
      ) : (
        <ul className="mt-6 border-t border-linha">
          {avisos.map((a) => (
            <li key={a._id} className="grid gap-4 border-b border-linha py-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
              <div className={encerrados ? "text-suave" : ""}>
                <p className="text-lg leading-relaxed whitespace-pre-line">{a.texto}</p>
                <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-suave">
                  <span>
                    {encerrados ? "Saiu do site em" : "Até"} {diaMes(a.validoAte)}
                    {a.validoAte === hoje && " (último dia)"}
                  </span>
                  {a.link && <span className="break-all">Link: {a.link}</span>}
                  {a.atualizadoPor && (
                    <span>
                      Alterado por {a.atualizadoPor}, {quandoAlterado(a.atualizadoEm)}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex gap-3">
                <Link href={`/painel/avisos/${a._id}`} className="pill pill-contorno min-h-10 text-[0.9375rem]">
                  {encerrados ? "Republicar" : "Editar"}
                </Link>
                <form action={excluirAviso}>
                  <input type="hidden" name="id" value={a._id} />
                  <BotaoConfirmar pergunta="Excluir este aviso? Não dá para desfazer." className="pill pill-contorno min-h-10 text-[0.9375rem]">
                    Excluir
                  </BotaoConfirmar>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
