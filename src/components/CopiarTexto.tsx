"use client";

import { useState } from "react";

/** Botão que copia um texto (ex.: chave Pix) e confirma por alguns segundos. */
export function CopiarTexto({ texto, rotulo }: { texto: string; rotulo: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // Sem permissão de área de transferência: a chave continua visível para copiar à mão.
    }
  }

  return (
    <button type="button" onClick={copiar} className="pill pill-contorno min-h-10 text-[0.9375rem]" aria-live="polite">
      {copiado ? "Copiado" : rotulo}
    </button>
  );
}
