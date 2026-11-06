"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { PaginaPublicacao } from "@/components/Publicacoes";
import type { Publicacao } from "@/sanity/lib/queries";

/**
 * Mostra o texto exatamente como vai sair no site: usa o mesmo componente da página do artigo
 * (PaginaPublicacao), com o que está no formulário agora, sem precisar salvar.
 */
export function PreVisualizacao({
  publicacao,
  voltar,
  aoFechar,
}: {
  publicacao: Publicacao;
  voltar: { href: string; rotulo: string };
  aoFechar: () => void;
}) {
  const fechar = useRef<HTMLButtonElement>(null);
  const aoFecharAtual = useRef(aoFechar);
  useEffect(() => {
    aoFecharAtual.current = aoFechar;
  });

  useEffect(() => {
    const rolagem = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    fechar.current?.focus();
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && aoFecharAtual.current();
    document.addEventListener("keydown", tecla);
    return () => {
      document.body.style.overflow = rolagem;
      document.removeEventListener("keydown", tecla);
    };
  }, []);

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="Pré-visualização" className="fixed inset-0 z-50 overflow-y-auto bg-fundo">
      <div className="sticky top-0 z-10 border-b border-linha bg-fundo/95 backdrop-blur">
        <div className="mx-auto flex max-w-[75rem] items-center justify-between gap-4 px-5 py-3 md:px-8">
          <p className="text-[0.9375rem] text-suave">
            <span className="font-medium text-tinta">Pré-visualização.</span> Assim vai aparecer no site.
          </p>
          <button ref={fechar} type="button" onClick={aoFechar} className="pill pill-primaria min-h-10 shrink-0 text-[0.9375rem]">
            Voltar a editar
          </button>
        </div>
      </div>
      {/* Os links da página não navegam aqui: sair dela perderia o que ainda não foi salvo. */}
      <div
        onClickCapture={(e) => {
          if ((e.target as HTMLElement).closest("a")) e.preventDefault();
        }}
      >
        <PaginaPublicacao p={publicacao} voltar={voltar} />
      </div>
    </div>,
    document.body,
  );
}
