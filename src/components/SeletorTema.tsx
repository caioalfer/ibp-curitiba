"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { CHAVE_TEMA as CHAVE, MIDIA_ESCURO as ESCURO } from "@/lib/tema";

export type PreferenciaTema = "auto" | "claro" | "escuro";

const EVENTO = "tema-alterado";

function lerPreferencia(): PreferenciaTema {
  try {
    const p = localStorage.getItem(CHAVE);
    return p === "claro" || p === "escuro" ? p : "auto";
  } catch {
    return "auto";
  }
}

function aplicar(preferencia: PreferenciaTema) {
  const escuro = preferencia === "escuro" || (preferencia === "auto" && matchMedia(ESCURO).matches);
  document.documentElement.dataset.tema = escuro ? "escuro" : "claro";
}

function salvar(preferencia: PreferenciaTema) {
  try {
    if (preferencia === "auto") localStorage.removeItem(CHAVE);
    else localStorage.setItem(CHAVE, preferencia);
  } catch {
    // Sem armazenamento (aba anônima, bloqueio): o tema vale só para esta visita.
  }
  aplicar(preferencia);
  window.dispatchEvent(new Event(EVENTO));
}

function assinar(avisar: () => void) {
  const sistema = matchMedia(ESCURO);
  const aoMudarSistema = () => {
    if (lerPreferencia() === "auto") aplicar("auto");
    avisar();
  };
  window.addEventListener(EVENTO, avisar);
  window.addEventListener("storage", aoMudarSistema);
  sistema.addEventListener("change", aoMudarSistema);
  return () => {
    window.removeEventListener(EVENTO, avisar);
    window.removeEventListener("storage", aoMudarSistema);
    sistema.removeEventListener("change", aoMudarSistema);
  };
}

function usePreferenciaTema() {
  return useSyncExternalStore(assinar, lerPreferencia, () => "auto" as const);
}

const OPCOES: { valor: PreferenciaTema; rotulo: string }[] = [
  { valor: "auto", rotulo: "Automático" },
  { valor: "claro", rotulo: "Claro" },
  { valor: "escuro", rotulo: "Escuro" },
];

/** Três opções lado a lado (menu do celular). */
export function SeletorTemaLista() {
  const preferencia = usePreferenciaTema();
  return (
    <div role="group" aria-label="Tema" className="flex rounded-full border border-linha p-1">
      {OPCOES.map((o) => (
        <button
          key={o.valor}
          type="button"
          aria-pressed={preferencia === o.valor}
          onClick={() => salvar(o.valor)}
          className={`min-h-10 flex-1 rounded-full px-4 text-[0.9375rem] font-medium transition-colors duration-200 ${
            preferencia === o.valor ? "bg-marca text-marca-texto" : "text-suave hover:text-tinta"
          }`}
        >
          {o.rotulo}
        </button>
      ))}
    </div>
  );
}

/** Botão com ícone que abre as três opções (cabeçalho em telas grandes). */
export function SeletorTemaBotao() {
  const preferencia = usePreferenciaTema();
  const [aberto, setAberto] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const idPainel = useId();

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

  const atual = OPCOES.find((o) => o.valor === preferencia)?.rotulo;

  return (
    <div ref={raiz} className="relative">
      <button
        type="button"
        aria-expanded={aberto}
        aria-controls={idPainel}
        aria-label={`Tema: ${atual}`}
        title={`Tema: ${atual}`}
        onClick={() => setAberto((v) => !v)}
        className="flex size-10 items-center justify-center rounded-full text-tinta transition-colors duration-200 hover:bg-placa"
      >
        <IconeTema />
      </button>
      <ul
        id={idPainel}
        hidden={!aberto}
        className="absolute top-full right-0 mt-3 w-44 overflow-hidden rounded-[10px] border border-linha bg-fundo py-1 text-tinta shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
      >
        {OPCOES.map((o) => (
          <li key={o.valor}>
            <button
              type="button"
              aria-pressed={preferencia === o.valor}
              onClick={() => {
                salvar(o.valor);
                setAberto(false);
              }}
              className="flex w-full items-center justify-between px-4 py-2.5 text-left text-[0.9375rem] transition-colors duration-200 hover:bg-placa"
            >
              {o.rotulo}
              {preferencia === o.valor && <span aria-hidden="true" className="size-1.5 rounded-full bg-marca" />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Meio círculo cheio: claro e escuro ao mesmo tempo. */
function IconeTema() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4">
      <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 1.75a6.25 6.25 0 0 1 0 12.5Z" fill="currentColor" />
    </svg>
  );
}
