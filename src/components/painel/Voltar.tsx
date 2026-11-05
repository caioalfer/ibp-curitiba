import Link from "next/link";

export function Voltar({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="rotulo inline-flex items-center gap-2 text-suave transition-colors hover:text-tinta">
      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 stroke-current" fill="none" strokeWidth="1.25">
        <path d="M13 8H3M7 4 3 8l4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {children}
    </Link>
  );
}

/** "5 nov., 14:32" no horário de Curitiba. */
export function quandoAlterado(iso?: string) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(iso));
}
