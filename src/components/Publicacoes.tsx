import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { dataPorExtenso } from "@/lib/datas";
import { urlImagem } from "@/sanity/lib/image";
import { TEMAS_ARTIGO } from "@/sanity/lib/constantes";
import type { Publicacao, PublicacaoResumo } from "@/sanity/lib/queries";
import { SeloExemplo } from "./SeloExemplo";
import { TextoRico } from "./TextoRico";
import { Envoltorio } from "./Titulo";

export function rotuloTema(tema?: string) {
  return TEMAS_ARTIGO.find((t) => t.value === tema)?.title;
}

/** Imagem do Sanity ou, nos exemplos, a imagem do projeto. */
function imagemDe(p: PublicacaoResumo, largura: number, altura?: number): { src: string | StaticImageData; alt: string } | null {
  if (p.imagem) {
    const url = urlImagem(p.imagem).width(largura);
    return { src: (altura ? url.height(altura).fit("crop") : url).url(), alt: p.imagem.alt ?? "" };
  }
  if (p.imagemLocal) return { src: p.imagemLocal, alt: p.imagemAlt ?? "" };
  return null;
}

/** Cartões (notícias): foto com véu escuro e texto claro embaixo; sem foto, placa com texto do tema. */
export function ListaPublicacoes({ itens, base }: { itens: PublicacaoResumo[]; base: "/noticias" | "/artigos" }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {itens.map((p) => {
        const tema = rotuloTema(p.tema);
        const imagem = imagemDe(p, 1000, 750);
        return (
          <li key={p._id}>
            <Link
              href={`${base}/${p.slug}`}
              className={`group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[10px] sm:aspect-[4/3] ${imagem ? "bg-preto text-branco" : "bg-placa text-tinta"}`}
            >
              {imagem && (
                <>
                  <Image
                    src={imagem.src}
                    alt={imagem.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover transition-transform duration-700 ease-lampada group-hover:scale-[1.03]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/75 to-transparent"
                  />
                </>
              )}
              <span className="absolute top-5 right-5 flex gap-2">
                {p.exemplo && <SeloExemplo sobreFoto={!!imagem} />}
                {tema && (
                  <span className={imagem ? "vidro" : "rotulo rounded-full border border-linha px-4 py-1.5"}>{tema}</span>
                )}
              </span>
              <span className="relative p-6 md:p-7">
                <span className={`rotulo block ${imagem ? "text-branco/75" : "text-suave"}`}>{dataPorExtenso(p.data)}</span>
                <span className="mt-2 block text-[1.5rem] leading-tight font-light tracking-[-0.02em] md:text-[1.75rem]">
                  {p.titulo}
                </span>
                {p.resumo && !imagem && <span className="mt-3 line-clamp-3 block text-suave">{p.resumo}</span>}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Índice de leitura (artigos): imagem, data e tema, título grande e resumo; uma linha por ensaio. */
export function ListaArtigos({ itens }: { itens: PublicacaoResumo[] }) {
  return (
    <ol className="border-t border-linha">
      {itens.map((p) => {
        const tema = rotuloTema(p.tema);
        const imagem = imagemDe(p, 640, 480);
        return (
          <li key={p._id} className="border-b border-linha">
            <Link
              href={`/artigos/${p.slug}`}
              className="group grid gap-x-10 gap-y-5 py-8 md:grid-cols-[16rem_minmax(0,1fr)_auto] md:items-center"
            >
              <span className="relative block aspect-[4/3] overflow-hidden rounded-[10px] bg-placa">
                {imagem && (
                  <Image
                    src={imagem.src}
                    alt={imagem.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 256px"
                    className="object-cover transition-transform duration-700 ease-lampada group-hover:scale-[1.04]"
                  />
                )}
              </span>
              <span>
                <span className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.9375rem] text-suave">
                  {dataPorExtenso(p.data)}
                  {tema && <span className="rotulo">{tema}</span>}
                  {p.exemplo && <SeloExemplo />}
                </span>
                <span className="block text-[1.625rem] leading-tight font-light tracking-[-0.02em] transition-colors duration-200 group-hover:text-suave md:text-[2rem]">
                  {p.titulo}
                </span>
                {p.resumo && <span className="mt-3 block max-w-2xl text-suave">{p.resumo}</span>}
              </span>
              <span aria-hidden="true" className="hidden md:block">
                <svg viewBox="0 0 16 16" className="size-5 stroke-current transition-transform duration-300 ease-lampada group-hover:translate-x-1" fill="none" strokeWidth="1.25">
                  <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

/** Página de leitura: coluna de texto com medida fixa; data, autor e tema na margem. */
export function PaginaPublicacao({ p, voltar }: { p: Publicacao; voltar: { href: string; rotulo: string } }) {
  const tema = rotuloTema(p.tema);
  const imagem = imagemDe(p, 2000);
  return (
    <article className="pt-10 pb-24 md:pt-20">
      <Envoltorio>
        <Link href={voltar.href} className="rotulo inline-flex items-center gap-2 text-suave transition-colors hover:text-tinta">
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 stroke-current" fill="none" strokeWidth="1.25">
            <path d="M13 8H3M7 4 3 8l4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {voltar.rotulo}
        </Link>
        {p.exemplo && (
          <p className="mt-8 flex flex-wrap items-center gap-3 text-[0.9375rem] text-suave">
            <SeloExemplo />
            Texto de demonstração. Será substituído pelo conteúdo publicado no painel.
          </p>
        )}
        <h1 className="mt-8 max-w-4xl text-[clamp(2.5rem,6.5vw,5rem)] leading-[1] font-light tracking-[-0.04em]">
          {p.titulo}
        </h1>
        {p.resumo && <p className="mt-6 max-w-2xl text-xl text-suave">{p.resumo}</p>}
      </Envoltorio>

      {imagem && (
        <Envoltorio className="mt-14">
          {typeof imagem.src === "string" ? (
            // Imagem do Sanity: proporção desconhecida aqui, então quadro fixo com recorte.
            <Image
              src={imagem.src}
              alt={imagem.alt}
              width={2000}
              height={1250}
              priority
              sizes="(max-width: 1200px) 100vw, 1136px"
              className="aspect-[16/10] w-full rounded-[10px] object-cover"
            />
          ) : (
            // Imagem do projeto: proporção original (pinturas em pé ou deitadas), limitada à altura da tela.
            <Image
              src={imagem.src}
              alt={imagem.alt}
              priority
              sizes="(max-width: 1200px) 100vw, 1136px"
              className="mx-auto h-auto max-h-[80vh] w-auto rounded-[10px]"
            />
          )}
          {p.imagemCredito && <p className="mt-3 text-center text-sm text-suave">{p.imagemCredito}</p>}
        </Envoltorio>
      )}

      <Envoltorio className="mt-14 grid gap-10 lg:grid-cols-[14rem_minmax(0,40rem)] lg:gap-16">
        <dl className="grid h-fit grid-cols-2 gap-6 border-t border-linha pt-5 lg:sticky lg:top-32 lg:grid-cols-1">
          <div>
            <dt className="rotulo text-suave">Data</dt>
            <dd className="mt-1">{dataPorExtenso(p.data)}</dd>
          </div>
          {p.autor && (
            <div>
              <dt className="rotulo text-suave">Autor</dt>
              <dd className="mt-1">{p.autor}</dd>
            </div>
          )}
          {tema && (
            <div>
              <dt className="rotulo text-suave">Tema</dt>
              <dd className="mt-1">{tema}</dd>
            </div>
          )}
        </dl>
        <TextoRico valor={p.corpo} />
      </Envoltorio>
    </article>
  );
}
