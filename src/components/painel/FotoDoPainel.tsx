"use client";

import { useState } from "react";

/**
 * Prévia de foto do Sanity no painel. Se a internet oscilar e a foto não carregar, tenta de novo
 * sozinha duas vezes e depois mostra um aviso com "Tentar de novo", em vez de um espaço vazio.
 * Quem usa passa key={src}, para recomeçar quando a foto ou o enquadramento mudam.
 */
export function FotoDoPainel({ src, className = "" }: { src: string; className?: string }) {
  const [tentativa, setTentativa] = useState(0);
  const [falhou, setFalhou] = useState(false);

  if (falhou) {
    return (
      <div role="alert" className={`${className} grid place-items-center bg-placa p-6 text-center`}>
        <div>
          <p className="text-[0.9375rem] text-suave">A foto não carregou. Confira a internet.</p>
          <button
            type="button"
            onClick={() => {
              setFalhou(false);
              setTentativa((t) => t + 1);
            }}
            className="link-sutil mt-2 text-[0.9375rem] font-medium text-tinta"
          >
            Tentar de novo
          </button>
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- prévia já redimensionada e recortada pelo CDN do Sanity
    <img
      src={tentativa ? `${src}${src.includes("?") ? "&" : "?"}tentativa=${tentativa}` : src}
      alt=""
      className={className}
      onError={() => {
        if (tentativa < 2) setTimeout(() => setTentativa((t) => t + 1), 1500 * (tentativa + 1));
        else setFalhou(true);
      }}
    />
  );
}
