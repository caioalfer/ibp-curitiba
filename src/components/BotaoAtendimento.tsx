"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Configuracoes } from "@/sanity/lib/queries";

function linkWhatsApp(numero: string, mensagem: string) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

/**
 * Botão "Falar com o padre": abre um seletor (confissão, direção espiritual...) e leva ao WhatsApp
 * com a mensagem pronta. No cabeçalho em telas médias e grandes; flutuante no celular.
 */
export function BotaoAtendimento({
  config,
  posicao,
}: {
  config: Configuracoes;
  posicao: "cabecalho" | "flutuante";
}) {
  const [aberto, setAberto] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const idPainel = useId();
  const opcoes = config.opcoesAtendimento ?? [];
  const flutuante = posicao === "flutuante";


  useEffect(() => {
    if (!aberto) return;
    const fecharFora = (e: PointerEvent) => {
      if (!raiz.current?.contains(e.target as Node)) setAberto(false);
    };
    const fecharEsc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    document.addEventListener("pointerdown", fecharFora);
    document.addEventListener("keydown", fecharEsc);
    return () => {
      document.removeEventListener("pointerdown", fecharFora);
      document.removeEventListener("keydown", fecharEsc);
    };
  }, [aberto]);

  if (opcoes.length === 0) return null;

  return (
    <div
      ref={raiz}
      className={
        flutuante
          ? "pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-end bg-gradient-to-t from-fundo via-fundo/85 to-transparent px-4 pt-10 pb-8 md:hidden *:pointer-events-auto"
          : "relative"
      }
    >
      <button
        type="button"
        aria-expanded={aberto}
        aria-controls={idPainel}
        onClick={() => setAberto((v) => !v)}
        className={`pill pill-primaria ${flutuante ? "order-2 min-h-12" : "min-h-10 px-5 text-[0.9375rem]"}`}
      >
        {config.textoBotao || "Falar com o padre"}
      </button>

      <div
        id={idPainel}
        hidden={!aberto}
        className={`w-[min(20rem,100%)] overflow-hidden rounded-[10px] border border-linha bg-fundo text-tinta shadow-[0_10px_30px_rgba(0,0,0,0.12)] ${
          flutuante ? "order-1 mb-3" : "absolute top-full right-0 mt-3"
        }`}
      >
        <p className="rotulo px-5 pt-5 pb-3 text-suave">Sobre o que deseja falar?</p>
        <ul>
          {opcoes.map((opcao) => {
            const numero = opcao.whatsapp || config.whatsapp;
            return (
              <li key={opcao.rotulo} className="border-t border-linha">
                {numero ? (
                  <a
                    href={linkWhatsApp(numero, opcao.mensagem)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setAberto(false)}
                    className="flex items-center justify-between gap-4 px-5 py-4 text-lg font-light transition-colors duration-200 hover:bg-placa"
                  >
                    {opcao.rotulo}
                    <SetaExterna />
                  </a>
                ) : (
                  <span className="block px-5 py-4 text-lg font-light text-apagado">
                    {opcao.rotulo}
                    <span className="rotulo mt-1 block">WhatsApp ainda não configurado</span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        <p className="border-t border-linha px-5 py-4 text-sm text-suave">Abre o WhatsApp com a mensagem pronta.</p>
      </div>
    </div>
  );
}

function SetaExterna() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0 stroke-current" fill="none" strokeWidth="1.25">
      <path d="M5 11 11 5M6 5h5v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
