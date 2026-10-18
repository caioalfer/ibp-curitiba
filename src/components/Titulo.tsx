/** Títulos no padrão do site: sans leve; a palavra em <em> sai em serif itálica. */
export function TituloPagina({ children, sub }: { children: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="mb-16 md:mb-24">
      <h1 className="text-[clamp(3rem,9vw,7rem)] leading-[0.95] font-light tracking-[-0.045em]">{children}</h1>
      {sub && <p className="mt-6 max-w-xl text-lg text-suave">{sub}</p>}
    </div>
  );
}

export function TituloSecao({
  children,
  acao,
  id,
}: {
  children: React.ReactNode;
  acao?: React.ReactNode;
  id?: string;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <h2 id={id} className="text-[clamp(2.25rem,5vw,3.5rem)] leading-none font-light tracking-[-0.035em]">
        {children}
      </h2>
      {acao}
    </div>
  );
}

export function Envoltorio({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[75rem] px-5 md:px-8 ${className}`}>{children}</div>;
}
