import Link from "next/link";
import { agoraEmCuritiba } from "@/lib/datas";
import { lerPainel, lerPainelComRascunhos } from "@/lib/painel/sanity";
import { TIPOS_PUBLICACAO, type TipoPublicacao } from "@/lib/painel/tiposPublicacao";
import { exigirAcesso } from "@/lib/painel/sessao";

export const metadata = { title: "Início" };

export default async function InicioDoPainel() {
  const usuario = await exigirAcesso();
  const primeiroNome = usuario.nome.split(" ")[0];
  const [avisosNoAr, publicacoes] = await Promise.all([
    lerPainel<number>(`count(*[_type == "aviso" && validoAte >= $hoje])`, { hoje: agoraEmCuritiba().data }),
    lerPainelComRascunhos<{ _id: string; _type: string }[]>(`*[_type in ["artigo", "noticia"]]{_id, _type}`),
  ]);
  const contar = (tipo: TipoPublicacao) => {
    const doTipo = publicacoes.filter((p) => p._type === tipo);
    const noSite = doTipo.filter((p) => !p._id.startsWith("drafts.")).length;
    const soRascunho = doTipo.filter((p) => p._id.startsWith("drafts.") && !doTipo.some((o) => o._id === p._id.slice(7))).length;
    return `${noSite ? `${noSite} no site` : `${TIPOS_PUBLICACAO[tipo].nenhum} no site ainda`}${soRascunho ? `, ${soRascunho === 1 ? "1 rascunho" : `${soRascunho} rascunhos`}` : ""}.`;
  };

  const tarefas = [
    {
      href: "/painel/semana",
      titulo: "Programação",
      texto: "Esta semana e a próxima: cancelar ou acrescentar horários, escolher o local e destacar a festa do dia.",
    },
    {
      href: "/painel/avisos",
      titulo: "Avisos",
      texto: `${avisosNoAr === 1 ? "1 aviso" : `${avisosNoAr} avisos`} no site agora. Publicar, editar ou tirar do ar.`,
    },
    {
      href: "/painel/artigos",
      titulo: "Artigos",
      texto: `${contar("artigo")} Escrever, com fotos, e publicar quando estiver pronto.`,
    },
    {
      href: "/painel/noticias",
      titulo: "Notícias",
      texto: `${contar("noticia")} O que aconteceu no apostolado, com data e fotos.`,
    },
  ];

  return (
    <>
      <h1 className="text-[clamp(2.5rem,6vw,4rem)] leading-none font-light tracking-[-0.04em]">Olá, {primeiroNome}</h1>
      <p className="mt-4 text-lg text-suave">O que você quer fazer hoje?</p>

      <ul className="mt-12 grid gap-4 md:grid-cols-2">
        {tarefas.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              className="group flex h-full flex-col gap-4 rounded-[10px] bg-placa p-7 transition-colors duration-200 hover:bg-linha md:p-9"
            >
              <span className="flex items-center justify-between gap-4 text-[1.75rem] leading-tight font-light tracking-[-0.025em]">
                {t.titulo}
                <svg aria-hidden="true" viewBox="0 0 16 16" className="size-5 stroke-current transition-transform duration-300 group-hover:translate-x-1" fill="none" strokeWidth="1.25">
                  <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-suave">{t.texto}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
