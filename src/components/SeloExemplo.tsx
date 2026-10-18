/** Marca o conteúdo de demonstração (src/lib/exemplos.ts) para não ser confundido com conteúdo real. */
export function SeloExemplo({ sobreFoto = false }: { sobreFoto?: boolean }) {
  return (
    <span
      className={`rotulo inline-flex rounded-full border px-2.5 py-0.5 ${
        sobreFoto ? "border-branco/40 text-branco/85" : "border-linha text-suave"
      }`}
    >
      Exemplo
    </span>
  );
}
