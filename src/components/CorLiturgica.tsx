import { CORES_LITURGICAS } from "@/sanity/lib/constantes";

// A bolinha mostra a cor litúrgica de verdade; o texto usa um tom legível no tema (--lit-* em globals.css).
const AMOSTRA: Record<string, string> = {
  branco: "#ffffff",
  vermelho: "#b3261e",
  verde: "#2e7d32",
  roxo: "#5b2a86",
  rosa: "#e48aa9",
  preto: "#000000",
};

/** Cor litúrgica do dia: rótulo na própria cor, com uma bolinha da cor ao lado. */
export function CorLiturgica({ cor, className = "" }: { cor: string; className?: string }) {
  const titulo = CORES_LITURGICAS.find((c) => c.value === cor)?.title;
  if (!titulo) return null;
  return (
    <span className={`rotulo inline-flex items-center gap-1.5 ${className}`} style={{ color: `var(--lit-${cor}, var(--tinta))` }}>
      <span aria-hidden="true" className="inline-block size-2.5 rounded-full border border-linha" style={{ background: AMOSTRA[cor] }} />
      {titulo}
    </span>
  );
}
