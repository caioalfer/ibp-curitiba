"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { dataPorExtenso } from "@/lib/datas";
import { TEMAS_ARTIGO } from "@/sanity/lib/constantes";
import type { ItemArquivo } from "@/sanity/lib/queries";
import { SeloExemplo } from "./SeloExemplo";

/** Minúsculas e sem acento: "Silêncio" e "silencio" se encontram. */
function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function rotuloTema(tema?: string) {
  return TEMAS_ARTIGO.find((t) => t.value === tema)?.title;
}

/**
 * Busca em todas as notícias ou artigos (os recentes e o arquivo), por título, resumo, tema e data.
 * Filtra no navegador enquanto a pessoa digita. Sem busca, mostra o conteúdo normal da página.
 */
export function BuscaPublicacoes({
  itens,
  base,
  children,
}: {
  itens: ItemArquivo[];
  base: "/noticias" | "/artigos";
  children: React.ReactNode;
}) {
  const [busca, setBusca] = useState("");
  const id = useId();
  const nome = base === "/noticias" ? "notícias" : "artigos";

  const indice = useMemo(
    () =>
      itens.map((p) => ({
        p,
        texto: normalizar([p.titulo, p.resumo, rotuloTema(p.tema), p.data, dataPorExtenso(p.data)].filter(Boolean).join(" ")),
      })),
    [itens],
  );

  const termos = normalizar(busca).split(/\s+/).filter(Boolean);
  const resultados = termos.length ? indice.filter(({ texto }) => termos.every((t) => texto.includes(t))).map(({ p }) => p) : [];

  if (itens.length === 0) return <>{children}</>;

  return (
    <>
      <div role="search" className="mb-14 md:mb-16">
        <label htmlFor={id} className="sr-only">
          Buscar {nome}
        </label>
        <div className="relative max-w-xl">
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="pointer-events-none absolute top-1/2 left-5 size-4 -translate-y-1/2 stroke-current text-suave"
            fill="none"
            strokeWidth="1.5"
          >
            <circle cx="7" cy="7" r="4.75" />
            <path d="m10.5 10.5 3.5 3.5" strokeLinecap="round" />
          </svg>
          <input
            id={id}
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder={`Buscar ${nome} por título, assunto ou ano`}
            autoComplete="off"
            className="h-12 w-full appearance-none rounded-full border border-linha bg-fundo pr-12 pl-12 text-base text-tinta transition-colors duration-200 placeholder:text-suave hover:border-suave focus:border-tinta focus:outline-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
          />
          {busca && (
            <button
              type="button"
              onClick={() => setBusca("")}
              aria-label="Limpar a busca"
              className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-suave transition-colors hover:bg-placa hover:text-tinta"
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 stroke-current" fill="none" strokeWidth="1.5">
                <path d="m4 4 8 8M12 4l-8 8" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
        <p aria-live="polite" className="mt-4 text-suave">
          {termos.length > 0 &&
            (resultados.length === 0
              ? `Nenhum resultado para “${busca.trim()}”.`
              : `${resultados.length} ${resultados.length === 1 ? "resultado" : "resultados"} para “${busca.trim()}”.`)}
        </p>
      </div>

      {termos.length === 0 ? (
        children
      ) : (
        resultados.length > 0 && (
          <ul className="border-t border-linha">
            {resultados.map((p) => {
              const tema = rotuloTema(p.tema);
              return (
                <li key={p._id} className="border-b border-linha">
                  <Link href={`${base}/${p.slug}`} className="group block py-6">
                    <span className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.9375rem] text-suave">
                      <time dateTime={p.data}>{dataPorExtenso(p.data)}</time>
                      {tema && <span className="rotulo">{tema}</span>}
                      {p.exemplo && <SeloExemplo />}
                    </span>
                    <span className="block text-[1.5rem] leading-tight font-light tracking-[-0.02em] transition-colors duration-200 group-hover:text-suave">
                      {p.titulo}
                    </span>
                    {p.resumo && <span className="mt-2 line-clamp-2 block max-w-2xl text-suave">{p.resumo}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        )
      )}
    </>
  );
}
