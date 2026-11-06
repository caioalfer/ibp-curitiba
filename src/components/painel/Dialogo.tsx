"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Janela pequena para pedir um link, um vídeo ou o texto de um botão. Fica fora do <form> do artigo
// (portal no <body>): assim apertar Enter aqui nunca publica o artigo sem querer.

export type CampoDialogo = { nome: string; rotulo: string; placeholder?: string; ajuda?: string; inicial?: string; url?: boolean };

export function Dialogo({
  titulo,
  campos,
  botao,
  aoConfirmar,
  aoFechar,
}: {
  titulo: string;
  campos: CampoDialogo[];
  botao: string;
  /** Devolve uma mensagem de erro, ou null quando deu certo. */
  aoConfirmar: (valores: Record<string, string>) => string | null;
  aoFechar: () => void;
}) {
  const id = useId();
  const [valores, setValores] = useState(() => Object.fromEntries(campos.map((c) => [c.nome, c.inicial ?? ""])));
  const [erro, setErro] = useState("");
  const primeiro = useRef<HTMLInputElement>(null);
  const fechar = useRef(aoFechar);
  useEffect(() => {
    fechar.current = aoFechar;
  });

  // Uma vez só, ao abrir: foco no primeiro campo e Esc fecha.
  useEffect(() => {
    primeiro.current?.focus();
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        fechar.current();
      }
    };
    document.addEventListener("keydown", tecla);
    return () => document.removeEventListener("keydown", tecla);
  }, []);

  function confirmar() {
    const problema = aoConfirmar(Object.fromEntries(Object.entries(valores).map(([k, v]) => [k, v.trim()])));
    if (problema) setErro(problema);
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 px-4 pt-[14vh]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) aoFechar();
      }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby={`${id}-titulo`} className="w-full max-w-md rounded-[14px] bg-superficie p-6 shadow-2xl ring-1 ring-linha">
        <h2 id={`${id}-titulo`} className="text-xl font-medium">
          {titulo}
        </h2>
        <div className="mt-5 space-y-4">
          {campos.map((c, i) => (
            <div key={c.nome}>
              <label htmlFor={`${id}-${c.nome}`} className="block text-[0.9375rem] font-medium">
                {c.rotulo}
              </label>
              <input
                ref={i === 0 ? primeiro : undefined}
                id={`${id}-${c.nome}`}
                type="text"
                inputMode={c.url ? "url" : undefined}
                autoComplete="off"
                value={valores[c.nome]}
                placeholder={c.placeholder}
                onChange={(e) => setValores((v) => ({ ...v, [c.nome]: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    confirmar();
                  }
                }}
                className="mt-2 h-11 w-full rounded-[10px] border border-borda-campo bg-fundo px-3.5 text-base text-tinta placeholder:text-apagado focus:border-tinta focus:outline-none"
              />
              {c.ajuda && <p className="mt-1.5 text-sm text-suave">{c.ajuda}</p>}
            </div>
          ))}
        </div>
        {erro && (
          <p role="alert" className="mt-4 text-sm">
            {erro}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={aoFechar} className="pill pill-contorno min-h-10 text-[0.9375rem]">
            Cancelar
          </button>
          <button type="button" onClick={confirmar} className="pill pill-primaria min-h-10 text-[0.9375rem]">
            {botao}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
